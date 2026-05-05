import type { CSSProperties, ReactNode } from 'react';

type Tone =
  | 'brand'
  | 'sand'
  | 'warning'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'error'
  | 'neutral';

interface BadgeProps {
  children: ReactNode;
  tone?: Tone;
  iconLeft?: ReactNode;
}

const TONE_PALETTE: Record<Tone, { bg: string; color: string }> = {
  brand: { bg: 'var(--iris-dim)', color: 'var(--iris-dark)' },
  sand: { bg: 'var(--sand-dim)', color: 'var(--sand-dark)' },
  warning: { bg: 'var(--ember-dim)', color: 'var(--ember-dark)' },
  primary: { bg: 'var(--deep-teal-dim)', color: 'var(--deep-teal)' },
  secondary: { bg: 'var(--deep-iris-dim)', color: 'var(--deep-iris)' },
  success: { bg: 'rgba(59, 170, 127, 0.12)', color: '#1f7a55' },
  error: { bg: 'rgba(184, 58, 42, 0.10)', color: 'var(--error)' },
  neutral: { bg: 'var(--shell-warm)', color: 'var(--ink-muted)' },
};

export function Badge({ children, tone = 'neutral', iconLeft }: BadgeProps) {
  const { bg, color } = TONE_PALETTE[tone];
  const style: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 'var(--space-2)',
    background: bg,
    color,
    borderRadius: 'var(--radius-pill)',
    padding: 'var(--space-2) var(--space-3)',
    fontFamily: 'var(--font-sans)',
    fontWeight: 500,
    fontSize: 'var(--text-xxs)',
    letterSpacing: '0.04em',
    textTransform: 'none',
    whiteSpace: 'nowrap',
  };
  return (
    <span style={style}>
      {iconLeft}
      {children}
    </span>
  );
}
