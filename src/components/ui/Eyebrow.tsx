import type { CSSProperties, ReactNode } from 'react';

interface EyebrowProps {
  children: ReactNode;
  tone?: 'mono' | 'sans';
  color?: 'muted' | 'ink' | 'iris';
  as?: 'div' | 'span' | 'p';
}

/**
 * Eyebrow — small label above a heading. Mono variant is the
 * default per the editorial register; sans variant for sidebar
 * section labels.
 */
export function Eyebrow({ children, tone = 'mono', color = 'muted', as = 'span' }: EyebrowProps) {
  const Tag = as;
  const colorMap = {
    muted: 'var(--ink-muted)',
    ink: 'var(--ink)',
    iris: 'var(--iris-dark)',
  } as const;

  const style: CSSProperties =
    tone === 'mono'
      ? {
          fontFamily: 'var(--font-mono)',
          fontWeight: 500,
          fontSize: 'var(--text-xxs)',
          letterSpacing: '0.5px',
          color: colorMap[color],
          textTransform: 'uppercase',
        }
      : {
          fontFamily: 'var(--font-sans)',
          fontWeight: 600,
          fontSize: 'var(--text-xxs)',
          letterSpacing: '1.5px',
          color: colorMap[color],
          textTransform: 'uppercase',
        };

  return <Tag style={style}>{children}</Tag>;
}
