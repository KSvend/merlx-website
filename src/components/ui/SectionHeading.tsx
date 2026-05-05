import type { CSSProperties, ReactNode } from 'react';

interface SectionHeadingProps {
  children: ReactNode;
  level?: 1 | 2 | 3;
  /** Optional editorial flourish — phrase rendered in DM Serif Display italic. */
  flourish?: ReactNode;
  /** Where the flourish appears relative to the children. */
  flourishPosition?: 'before' | 'after';
}

/**
 * SectionHeading — Inter 600 with optional DM Serif Display italic
 * flourish. Used for hero headlines + section heads. Sentence case.
 */
export function SectionHeading({
  children,
  level = 2,
  flourish,
  flourishPosition = 'after',
}: SectionHeadingProps) {
  const sizeMap: Record<number, string> = {
    1: 'clamp(28px, 4vw, 44px)',
    2: 'clamp(22px, 2.4vw, 28px)',
    3: 'clamp(18px, 1.8vw, 20px)',
  };

  const style: CSSProperties = {
    fontFamily: 'var(--font-sans)',
    fontWeight: 600,
    fontSize: sizeMap[level],
    lineHeight: 1.15,
    letterSpacing: '-0.3px',
    color: 'var(--ink)',
    margin: 0,
    maxWidth: '40ch',
  };

  const flourishStyle: CSSProperties = {
    fontFamily: 'var(--font-display)',
    fontStyle: 'italic',
    fontWeight: 400,
    color: 'var(--iris-dark)',
    letterSpacing: 0,
  };

  const content = flourish ? (
    flourishPosition === 'before' ? (
      <>
        <span style={flourishStyle}>{flourish}</span> {children}
      </>
    ) : (
      <>
        {children} <span style={flourishStyle}>{flourish}</span>
      </>
    )
  ) : (
    children
  );

  if (level === 1) return <h1 style={style}>{content}</h1>;
  if (level === 2) return <h2 style={style}>{content}</h2>;
  return <h3 style={style}>{content}</h3>;
}
