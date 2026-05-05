'use client';

import { submitContact } from '@/server-actions/submit-contact';
import Script from 'next/script';
import { useEffect, useId, useRef, useState } from 'react';
import type { CSSProperties, FormEvent } from 'react';

interface ContactFormProps {
  /** Cloudflare Turnstile site key. When undefined, widget is omitted. */
  turnstileSiteKey?: string;
  /** Pre-set interest tag (used when reaching contact from a tool page). */
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
  const [engagement, setEngagement] = useState<string>(defaultInterest ?? 'studio');

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

    const turnstileToken =
      turnstileSiteKey && turnstileRef.current
        ? ((formData.get('cf-turnstile-response') as string | null) ?? undefined)
        : undefined;

    const payload = {
      name: ((formData.get('name') as string) ?? '').trim(),
      email: ((formData.get('email') as string) ?? '').trim(),
      organisation: ((formData.get('organisation') as string) ?? '').trim() || undefined,
      role: ((formData.get('role') as string) ?? '').trim() || undefined,
      country: ((formData.get('country') as string) ?? '').trim() || undefined,
      message: ((formData.get('message') as string) ?? '').trim(),
      interest: engagement ? [engagement] : undefined,
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
      console.error(err);
      setStatus({
        state: 'error',
        message: 'Submission failed. Try again or email hello@merlx.org.',
      });
    }
  }

  if (status.state === 'success') {
    return (
      <div style={{ textAlign: 'center', padding: '48px 0' }}>
        <h3
          style={{
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            fontWeight: 400,
            fontSize: 32,
            color: 'var(--ink)',
            margin: '0 0 12px',
            letterSpacing: '-0.4px',
          }}
        >
          Message received.
        </h3>
        <p
          style={{
            fontSize: 14,
            color: 'var(--ink-muted)',
            margin: 0,
            maxWidth: '40ch',
            marginInline: 'auto',
            lineHeight: 1.6,
          }}
        >
          Someone from the right team will reply within two working days. If anything is urgent,
          email{' '}
          <a href="mailto:hello@merlx.org" style={inlineLinkStyle}>
            hello@merlx.org
          </a>{' '}
          directly.
        </p>
      </div>
    );
  }

  const submitDisabled =
    status.state === 'submitting' || (Boolean(turnstileSiteKey) && !tokenReady);

  return (
    <>
      {turnstileSiteKey ? (
        <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer />
      ) : null}
      <form onSubmit={handleSubmit} noValidate>
        <p className="mx-eyebrow">Start a conversation</p>
        <h2 className="mx-h2-section" style={{ margin: '8px 0 32px' }}>
          How can we help?
        </h2>

        <FieldGroup label="Engagement type">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
            {[
              { v: 'studio', l: 'Studio · tools' },
              { v: 'network', l: 'Network · MERL' },
              { v: 'advisory', l: 'Advisory' },
            ].map((o) => (
              <label
                key={o.v}
                style={{
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-sm)',
                  border: `1px solid ${engagement === o.v ? 'var(--deep-teal)' : 'var(--border)'}`,
                  background: engagement === o.v ? 'var(--deep-teal-dim)' : 'transparent',
                  color: engagement === o.v ? 'var(--deep-teal)' : 'var(--ink)',
                  fontSize: 13,
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all var(--motion-default) var(--easing)',
                }}
              >
                <input
                  type="radio"
                  name="engagement"
                  value={o.v}
                  checked={engagement === o.v}
                  onChange={() => setEngagement(o.v)}
                  style={{ display: 'none' }}
                />
                {o.l}
              </label>
            ))}
          </div>
        </FieldGroup>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 16,
          }}
        >
          <FieldGroup label="Name">
            <input
              id={`${formId}-name`}
              name="name"
              required
              autoComplete="name"
              className="mx-input"
              placeholder="Your name"
            />
          </FieldGroup>
          <FieldGroup label="Email">
            <input
              id={`${formId}-email`}
              name="email"
              type="email"
              required
              autoComplete="email"
              className="mx-input"
              placeholder="you@organization.org"
            />
          </FieldGroup>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 16,
          }}
        >
          <FieldGroup label="Organisation">
            <input
              id={`${formId}-org`}
              name="organisation"
              autoComplete="organization"
              className="mx-input"
              placeholder="Ministry of Health, INGO, donor…"
            />
          </FieldGroup>
          <FieldGroup label="Role">
            <input
              id={`${formId}-role`}
              name="role"
              autoComplete="organization-title"
              className="mx-input"
              placeholder="MEL lead, programme director…"
            />
          </FieldGroup>
        </div>

        <FieldGroup label="Country">
          <input
            id={`${formId}-country`}
            name="country"
            autoComplete="country-name"
            className="mx-input"
          />
        </FieldGroup>

        <FieldGroup label="What are you trying to learn or decide?">
          <textarea
            id={`${formId}-message`}
            name="message"
            required
            rows={6}
            minLength={10}
            className="mx-textarea"
            placeholder="A few sentences. Timeline and rough budget are helpful but not required."
          />
        </FieldGroup>

        {turnstileSiteKey ? (
          <div ref={turnstileRef} data-cf-turnstile style={{ marginTop: 8 }} />
        ) : null}

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 16,
            marginTop: 16,
            flexWrap: 'wrap',
          }}
        >
          <p
            style={{
              fontSize: 11,
              color: 'var(--ink-faint)',
              margin: 0,
              fontFamily: 'var(--font-mono)',
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
            }}
          >
            We reply within two working days
          </p>
          <button type="submit" className="mx-btn mx-btn--primary" disabled={submitDisabled}>
            {status.state === 'submitting' ? 'Sending…' : 'Send message →'}
          </button>
        </div>

        {status.state === 'error' ? (
          <p
            role="alert"
            style={{
              marginTop: 16,
              fontSize: 12,
              color: 'var(--error)',
              fontFamily: 'var(--font-sans)',
            }}
          >
            {status.message}
          </p>
        ) : null}
      </form>
    </>
  );
}

function FieldGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: child input is the implicit control
    <label
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        marginBottom: 18,
      }}
    >
      <span
        style={{
          fontSize: 11,
          fontWeight: 500,
          color: 'var(--ink)',
          letterSpacing: '0.04em',
        }}
      >
        {label}
      </span>
      {children}
    </label>
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

const inlineLinkStyle: CSSProperties = {
  color: 'var(--deep-teal)',
  textDecoration: 'underline',
};
