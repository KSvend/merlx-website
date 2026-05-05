import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /** Max width of inner content. */
  width?: 'narrow' | 'reading' | 'standard' | 'wide';
  /** Whether to apply page padding (top/bottom). */
  pad?: boolean;
}

const widths: Record<NonNullable<ContainerProps['width']>, string> = {
  narrow: '640px',
  reading: '720px',
  standard: '1080px',
  wide: '1280px',
};

export function Container({
  children,
  width = 'standard',
  pad = false,
  style,
  ...rest
}: ContainerProps) {
  const composed: CSSProperties = {
    width: '100%',
    maxWidth: widths[width],
    marginInline: 'auto',
    paddingInline: 'clamp(var(--space-8), 4vw, var(--space-12))',
    paddingBlock: pad ? 'clamp(var(--space-16), 6vw, var(--space-32))' : undefined,
    ...style,
  };
  return (
    <div style={composed} {...rest}>
      {children}
    </div>
  );
}

interface SectionProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  /** Background tone — page, offset, or surface (rare for sections). */
  tone?: 'shell' | 'shell-warm' | 'shell-cool' | 'surface';
}

export function Section({ children, tone = 'shell', style, ...rest }: SectionProps) {
  const toneMap = {
    shell: 'var(--shell)',
    'shell-warm': 'var(--shell-warm)',
    'shell-cool': 'var(--shell-cool)',
    surface: 'var(--surface)',
  } as const;
  return (
    <section
      style={{
        background: toneMap[tone],
        paddingBlock: 'clamp(var(--space-16), 6vw, var(--space-40))',
        ...style,
      }}
      {...rest}
    >
      {children}
    </section>
  );
}
