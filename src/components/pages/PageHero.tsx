import { Container, Eyebrow, SectionHeading } from '@/components/ui';
import type { CSSProperties, ReactNode } from 'react';

interface PageHeroProps {
  eyebrow?: ReactNode;
  title: ReactNode;
  flourish?: ReactNode;
  subtitle?: ReactNode;
  /** Right-aligned slot — eg metadata table or CTA. */
  trailing?: ReactNode;
  width?: 'standard' | 'wide';
}

/**
 * PageHero — top-of-page block used on About, Legal, Insights, etc.
 * Matches the home hero pattern (eyebrow + headline + optional
 * subtitle) but with smaller scale + tighter padding.
 */
export function PageHero({
  eyebrow,
  title,
  flourish,
  subtitle,
  trailing,
  width = 'standard',
}: PageHeroProps) {
  const wrap: CSSProperties = {
    paddingBlock: 'clamp(var(--space-24), 6vw, var(--space-40))',
  };

  const grid: CSSProperties = trailing
    ? {
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) auto',
        gap: 'var(--space-16)',
        alignItems: 'flex-end',
      }
    : { display: 'flex', flexDirection: 'column' };

  return (
    <section style={wrap}>
      <Container width={width}>
        <div style={grid}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
            {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
            <SectionHeading level={1} flourish={flourish}>
              {title}
            </SectionHeading>
            {subtitle ? (
              <p
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontWeight: 400,
                  fontSize: 'var(--text-lg)',
                  lineHeight: 1.55,
                  color: 'var(--ink-light)',
                  maxWidth: '64ch',
                  margin: 0,
                }}
              >
                {subtitle}
              </p>
            ) : null}
          </div>
          {trailing ? <div>{trailing}</div> : null}
        </div>
      </Container>
    </section>
  );
}
