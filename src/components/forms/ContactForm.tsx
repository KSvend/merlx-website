'use client';

import { Badge, Button, Field, Input, Select, Textarea } from '@/components/ui';
import { submitContact } from '@/server-actions/submit-contact';
import Script from 'next/script';
import { useEffect, useId, useRef, useState } from 'react';
import type { CSSProperties, FormEvent } from 'react';

interface ContactFormProps {
  /** Cloudflare Turnstile site key. When undefined, widget is omitted. */
  turnstileSiteKey?: string;
  /** Optional pre-set interest tag (used when reaching contact from a tool page). */
  defaultInterest?: 'studio' | 'network' | 'hosted' | 'pilot' | 'build-with' | 'advisory';
}

type Status =
  | { state: 'idle' }
  | { state: 'submitting' }
  | { state: 'success' }
  | { state: 'error'; message: string };

export function ContactForm({ turnstileSiteKey, defaultInterest }: ContactFormProps) {
  const formId = useId();
  const turnstileRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<Status>({ state: 'idle' });
  const [tokenReady, setTokenReady] = useState(!turnstileSiteKey);

  // Render the Turnstile widget once the script is loaded.
  useEffect(() => {
    if (!turnstileSiteKey) return;
    const tryRender = () => {
      // biome-ignore lint/suspicious/noExplicitAny: window.turnstile from CF script
      const t = (window as any).turnstile;
      if (!t || !turnstileRef.current) return false;
      t.render(turnstileRef.current, {
        sitekey: turnstileSiteKey,
        callback: () => setTokenReady(true),
        'expired-callback': () => setTokenReady(false),
        'error-callback': () => setTokenReady(false),
        theme: 'light',
      });
      return true;
    };
    if (tryRender()) return;
    const intervalId = window.setInterval(() => {
      if (tryRender()) window.clearInterval(intervalId);
    }, 200);
    return () => window.clearInterval(intervalId);
  }, [turnstileSiteKey]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus({ state: 'submitting' });

    const formData = new FormData(event.currentTarget);
    const interest = formData.getAll('interest').filter((v) => typeof v === 'string') as string[];

    const turnstileToken =
      turnstileSiteKey && turnstileRef.current
        ? ((formData.get('cf-turnstile-response') as string | null) ?? undefined)
        : undefined;

    const payload = {
      name: (formData.get('name') as string)?.trim() ?? '',
      email: (formData.get('email') as string)?.trim() ?? '',
      organisation: ((formData.get('organisation') as string) || '').trim() || undefined,
      role: ((formData.get('role') as string) || '').trim() || undefined,
      country: ((formData.get('country') as string) || '').trim() || undefined,
      message: (formData.get('message') as string)?.trim() ?? '',
      interest: interest.length > 0 ? interest : undefined,
      turnstileToken,
    };

    try {
      const result = await submitContact(payload);
      if (result.ok) {
        setStatus({ state: 'success' });
        event.currentTarget.reset();
        return;
      }
      setStatus({ state: 'error', message: errorMessageFor(result.error) });
    } catch (err) {
      setStatus({
        state: 'error',
        message: 'Submission failed. Try again or email hello@merlx.org.',
      });
      console.error(err);
    }
  }

  if (status.state === 'success') {
    return <SuccessPanel />;
  }

  const submitDisabled =
    status.state === 'submitting' || (Boolean(turnstileSiteKey) && !tokenReady);

  return (
    <>
      {turnstileSiteKey ? (
        <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer />
      ) : null}

      <form onSubmit={handleSubmit} style={formStyle} noValidate>
        <div style={twoColStyle}>
          <Field label="Name" htmlFor={`${formId}-name`} required>
            <Input id={`${formId}-name`} name="name" required autoComplete="name" />
          </Field>
          <Field label="Email" htmlFor={`${formId}-email`} required>
            <Input id={`${formId}-email`} name="email" type="email" required autoComplete="email" />
          </Field>
        </div>

        <div style={twoColStyle}>
          <Field label="Organisation" htmlFor={`${formId}-org`}>
            <Input id={`${formId}-org`} name="organisation" autoComplete="organization" />
          </Field>
          <Field label="Role" htmlFor={`${formId}-role`}>
            <Input id={`${formId}-role`} name="role" autoComplete="organization-title" />
          </Field>
        </div>

        <Field label="Country" htmlFor={`${formId}-country`}>
          <Input id={`${formId}-country`} name="country" autoComplete="country-name" />
        </Field>

        <Field
          label="What are you considering?"
          htmlFor={`${formId}-interest`}
          helper="Pick the closest fit. We will route you to the right team."
        >
          <Select id={`${formId}-interest`} name="interest" defaultValue={defaultInterest ?? ''}>
            <option value="">Choose one</option>
            <option value="studio">MERLx Studio (tools)</option>
            <option value="network">MERLx Network (in-country MERL)</option>
            <option value="hosted">Hosted Optics Suite</option>
            <option value="pilot">Pilot of one tool</option>
            <option value="build-with">Build-with engagement</option>
            <option value="advisory">Advisory</option>
          </Select>
        </Field>

        <Field label="Message" htmlFor={`${formId}-message`} required>
          <Textarea id={`${formId}-message`} name="message" required rows={6} minLength={10} />
        </Field>

        {turnstileSiteKey ? <div ref={turnstileRef} data-cf-turnstile /> : null}

        <div style={submitRowStyle}>
          {status.state === 'error' ? (
            <Badge tone="error">{status.message}</Badge>
          ) : (
            <span style={consentStyle}>
              By sending, you agree we may store and reply to your message.
            </span>
          )}
          <Button type="submit" variant="primary" disabled={submitDisabled}>
            {status.state === 'submitting' ? 'Sending…' : 'Send message'}
          </Button>
        </div>
      </form>
    </>
  );
}

function SuccessPanel() {
  return (
    <div
      style={{
        background: 'var(--shell-cool)',
        border: '1px solid var(--border-light)',
        borderRadius: 'var(--radius-md)',
        padding: 'var(--space-12)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-4)',
      }}
    >
      <h2
        style={{
          fontFamily: 'var(--font-sans)',
          fontWeight: 600,
          fontSize: 'var(--text-lg)',
          color: 'var(--ink)',
          margin: 0,
        }}
      >
        Message received.
      </h2>
      <p
        style={{
          fontFamily: 'var(--font-sans)',
          fontWeight: 400,
          fontSize: 'var(--text-base)',
          color: 'var(--ink-light)',
          lineHeight: 1.55,
          margin: 0,
        }}
      >
        Someone from the right team will reply within two working days. If anything is urgent, write
        to hello@merlx.org directly.
      </p>
    </div>
  );
}

function errorMessageFor(code?: string): string {
  switch (code) {
    case 'invalid_input':
      return 'Check the required fields and message length (10+ characters).';
    case 'turnstile_required':
      return 'Complete the security check above.';
    case 'turnstile_invalid':
      return 'Security check failed. Refresh and try again.';
    default:
      return 'Submission failed. Try again or email hello@merlx.org.';
  }
}

const formStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--space-10)',
};

const twoColStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: 'var(--space-8)',
};

const submitRowStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 'var(--space-5)',
  marginTop: 'var(--space-4)',
};

const consentStyle: CSSProperties = {
  fontFamily: 'var(--font-sans)',
  fontWeight: 400,
  fontSize: 'var(--text-xs)',
  color: 'var(--ink-muted)',
  maxWidth: '52ch',
  lineHeight: 1.55,
};
