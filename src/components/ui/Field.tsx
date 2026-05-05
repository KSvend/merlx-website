import type {
  CSSProperties,
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react';

interface FieldProps {
  label: ReactNode;
  htmlFor: string;
  helper?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  children: ReactNode;
}

export function Field({ label, htmlFor, helper, error, required, children }: FieldProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
      <label htmlFor={htmlFor} style={fieldLabelStyle}>
        {label}
        {required ? (
          <span
            aria-hidden="true"
            style={{ color: 'var(--ember)', marginInlineStart: 'var(--space-2)' }}
          >
            *
          </span>
        ) : null}
      </label>
      {children}
      {helper && !error ? <span style={helperStyle}>{helper}</span> : null}
      {error ? (
        <span style={errorStyle} role="alert">
          {error}
        </span>
      ) : null}
    </div>
  );
}

const fieldLabelStyle: CSSProperties = {
  fontFamily: 'var(--font-sans)',
  fontWeight: 500,
  fontSize: 'var(--text-xs)',
  color: 'var(--ink)',
};

const helperStyle: CSSProperties = {
  fontFamily: 'var(--font-sans)',
  fontWeight: 400,
  fontSize: 'var(--text-xs)',
  color: 'var(--ink-muted)',
};

const errorStyle: CSSProperties = {
  fontFamily: 'var(--font-sans)',
  fontWeight: 500,
  fontSize: 'var(--text-xs)',
  color: 'var(--error)',
};

const inputBase: CSSProperties = {
  background: 'var(--surface)',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius-sm)',
  padding: 'var(--space-3) var(--space-4)',
  fontFamily: 'var(--font-sans)',
  fontWeight: 400,
  fontSize: 'var(--text-base)',
  color: 'var(--ink)',
  letterSpacing: '0.04em',
  width: '100%',
  minHeight: '32px',
  transition: 'border-color var(--motion-default) var(--motion-easing)',
};

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

export function Input({ invalid, style, ...rest }: InputProps) {
  return (
    <input
      {...rest}
      style={{
        ...inputBase,
        borderColor: invalid ? 'var(--error)' : 'var(--border)',
        ...style,
      }}
    />
  );
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}

export function Textarea({ invalid, rows = 5, style, ...rest }: TextareaProps) {
  return (
    <textarea
      rows={rows}
      {...rest}
      style={{
        ...inputBase,
        resize: 'vertical',
        minHeight: `calc(${rows} * 1.5em + var(--space-6))`,
        borderColor: invalid ? 'var(--error)' : 'var(--border)',
        ...style,
      }}
    />
  );
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  invalid?: boolean;
}

export function Select({ invalid, children, style, ...rest }: SelectProps) {
  return (
    <select
      {...rest}
      style={{
        ...inputBase,
        appearance: 'none',
        // Caret-down inline SVG at right padding zone, ink-muted colour
        backgroundImage:
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 256 256'><path fill='%236b6b6b' d='M213.66 101.66l-80 80a8 8 0 0 1-11.32 0l-80-80a8 8 0 0 1 11.32-11.32L128 164.69l74.34-74.35a8 8 0 0 1 11.32 11.32Z'/></svg>\")",
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right var(--space-3) center',
        paddingInlineEnd: 'var(--space-10)',
        borderColor: invalid ? 'var(--error)' : 'var(--border)',
        ...style,
      }}
    >
      {children}
    </select>
  );
}
