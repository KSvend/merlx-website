import Link from 'next/link';
import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /** Compact (14px) or comfortable (16px) padding. */
  density?: 'compact' | 'comfortable';
  /** Render as a navigable surface (renders as `<a>` via next/link). */
  href?: string;
  /** Subdue tone — lighter border, used for inline / nested. */
  variant?: 'default' | 'inset';
}

const baseStyle = (
  density: 'compact' | 'comfortable',
  variant: 'default' | 'inset',
): CSSProperties => ({
  background: variant === 'inset' ? 'var(--shell-cool)' : 'var(--surface)',
  border: `1px solid ${variant === 'inset' ? 'transparent' : 'var(--border-light)'}`,
  borderRadius: 'var(--radius-md)',
  padding: density === 'compact' ? 'var(--space-7)' : 'var(--space-8)',
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--space-5)',
});

const interactiveStyle: CSSProperties = {
  textDecoration: 'none',
  color: 'inherit',
  transition:
    'border-color var(--motion-default) var(--motion-easing), background var(--motion-default) var(--motion-easing)',
};

export function Card({
  children,
  density = 'comfortable',
  href,
  variant = 'default',
  style,
  ...rest
}: CardProps) {
  const composed: CSSProperties = {
    ...baseStyle(density, variant),
    ...(href ? interactiveStyle : null),
    ...style,
  };

  if (href) {
    return (
      <Link href={href} style={composed} data-merlx-card="interactive">
        {children}
      </Link>
    );
  }

  return (
    <div style={composed} data-merlx-card="static" {...rest}>
      {children}
    </div>
  );
}

interface CardHeaderProps {
  eyebrow?: ReactNode;
  title: ReactNode;
  trailing?: ReactNode;
}

export function CardHeader({ eyebrow, title, trailing }: CardHeaderProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: 'var(--space-4)',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
        {eyebrow}
        <h3
          style={{
            fontFamily: 'var(--font-sans)',
            fontWeight: 600,
            fontSize: 'var(--text-lg)',
            letterSpacing: '-0.2px',
            color: 'var(--ink)',
            margin: 0,
          }}
        >
          {title}
        </h3>
      </div>
      {trailing}
    </div>
  );
}

interface CardBodyProps {
  children: ReactNode;
}

export function CardBody({ children }: CardBodyProps) {
  return (
    <div
      style={{
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--text-base)',
        lineHeight: 1.55,
        color: 'var(--ink-light)',
      }}
    >
      {children}
    </div>
  );
}
