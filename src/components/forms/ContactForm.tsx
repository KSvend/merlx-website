'use client';

import { submitContact } from '@/server-actions/submit-contact';
import { useState } from 'react';

interface ContactFormProps {
  turnstileSiteKey?: string;
}

export function ContactForm({ turnstileSiteKey }: ContactFormProps) {
  const [state, setState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  async function handleSubmit(formData: FormData) {
    setState('submitting');
    setErrorMessage('');

    const turnstileToken = formData.get('cf-turnstile-response')?.toString();

    const result = await submitContact({
      name: formData.get('name'),
      email: formData.get('email'),
      organisation: formData.get('organisation') || undefined,
      role: formData.get('role') || undefined,
      country: formData.get('country') || undefined,
      message: formData.get('message'),
      interest: formData.getAll('interest').map(String),
      turnstileToken,
    });

    if (result.ok) {
      setState('success');
    } else {
      setState('error');
      setErrorMessage(result.error ?? 'unknown_error');
    }
  }

  if (state === 'success') {
    return (
      <div
        style={{
          padding: 24,
          background: 'var(--color-bg-soft, #f6f4ec)',
          borderRadius: 'var(--radius-md)',
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 17,
            color: 'var(--color-ink)',
            margin: 0,
          }}
        >
          Thank you. We'll be in touch within a few working days.
        </p>
      </div>
    );
  }

  return (
    <form
      action={handleSubmit}
      style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 560 }}
    >
      <Field label="Name *" name="name" required />
      <Field label="Email *" name="email" type="email" required />
      <Field label="Organisation" name="organisation" />
      <Field label="Role" name="role" />
      <Field label="Country" name="country" />

      <label style={labelStyle}>
        <span style={labelTextStyle}>Interest (select any that apply)</span>
        <select name="interest" multiple size={4} style={{ ...inputStyle, height: 'auto' }}>
          <option value="studio">Optics Suite (Studio)</option>
          <option value="network">Network engagement</option>
          <option value="hosted">Hosted instance</option>
          <option value="pilot">Pilot &amp; evaluate</option>
          <option value="build-with">Build-with</option>
          <option value="advisory">Advisory</option>
        </select>
      </label>

      <label style={labelStyle}>
        <span style={labelTextStyle}>Message *</span>
        <textarea
          name="message"
          required
          minLength={10}
          rows={6}
          style={{ ...inputStyle, fontFamily: 'var(--font-serif)', resize: 'vertical' }}
        />
      </label>

      {turnstileSiteKey && <div className="cf-turnstile" data-sitekey={turnstileSiteKey} />}

      <button
        type="submit"
        disabled={state === 'submitting'}
        style={{
          alignSelf: 'flex-start',
          padding: '13px 22px',
          background: 'var(--color-teal)',
          color: 'var(--color-bg)',
          border: 'none',
          borderRadius: 'var(--radius-sm)',
          fontFamily: 'var(--font-sans)',
          fontSize: 13,
          fontWeight: 500,
          cursor: state === 'submitting' ? 'wait' : 'pointer',
          opacity: state === 'submitting' ? 0.6 : 1,
        }}
      >
        {state === 'submitting' ? 'Sending…' : 'Send'}
      </button>

      {state === 'error' && (
        <p
          style={{
            color: 'var(--color-orange-hot, #8a2f0a)',
            fontFamily: 'var(--font-serif)',
            fontSize: 14,
          }}
        >
          Submission failed: {errorMessage}. Please try again.
        </p>
      )}
    </form>
  );
}

const labelStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
};

const labelTextStyle: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: 10,
  letterSpacing: '0.16em',
  textTransform: 'uppercase',
  color: 'var(--color-ink-mute)',
};

const inputStyle: React.CSSProperties = {
  padding: '10px 12px',
  border: '1px solid var(--color-rule)',
  borderRadius: 'var(--radius-sm)',
  fontFamily: 'var(--font-sans)',
  fontSize: 14,
  color: 'var(--color-ink)',
  background: 'var(--color-bg)',
};

interface FieldProps {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}

function Field({ label, name, type = 'text', required }: FieldProps) {
  return (
    <label style={labelStyle}>
      <span style={labelTextStyle}>{label}</span>
      <input type={type} name={name} required={required} style={inputStyle} />
    </label>
  );
}
