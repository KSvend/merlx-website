import type { ReactNode } from 'react';

interface ProseProps {
  children: ReactNode;
  /** Tighter line-height + smaller scale for cards / asides. */
  density?: 'normal' | 'compact';
}

/**
 * Prose — long-form text container with the reading-column type
 * scale + spacing. Wraps anything that should read as body copy
 * (Lexical-rendered content, content/* exports, hand-authored JSX).
 */
export function Prose({ children, density = 'normal' }: ProseProps) {
  return (
    <div
      data-merlx-prose={density}
      style={{
        fontFamily: 'var(--font-sans)',
        fontSize: density === 'compact' ? 'var(--text-base)' : 'var(--text-lg)',
        fontWeight: 400,
        lineHeight: density === 'compact' ? 1.55 : 1.65,
        letterSpacing: '0.01em',
        color: 'var(--ink-light)',
        maxWidth: '64ch',
      }}
    >
      {children}
    </div>
  );
}
