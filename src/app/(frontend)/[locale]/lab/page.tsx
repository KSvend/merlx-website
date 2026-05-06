import { PageShell } from '@/components/chrome/PageShell';
import { isGroupTenant } from '@/lib/tenant-aware';
import { setRequestLocale } from 'next-intl/server';
import { headers } from 'next/headers';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { CSSProperties } from 'react';

interface PageProps {
  params: Promise<{ locale: string }>;
}

const PROTOTYPES = [
  {
    slug: 'landing-a',
    label: 'A · Wordmark roll',
    body: 'Three pills below the headline roll the suffix word in a vertical slot. Body, bullets and backdrop cross-fade. Auto-cycles every 6 s until first hover.',
    risk: 'Low — small mechanic, single hero.',
  },
  {
    slug: 'landing-b',
    label: 'B · Three lenses',
    body: 'Three side-by-side panels; hover one and it grows to ~2.6:1:1 with the lens revealing copy. Most distinctive of the three.',
    risk: 'Medium — needs three recognisable lens visuals.',
  },
  {
    slug: 'landing-c',
    label: 'C · Compass / dial',
    body: 'Central dial with three labels at 12 / 4 / 8 o’clock. Hover a label, the needle rotates, page tints toward the entity accent.',
    risk: 'Medium — compass metaphor is high-reward, high-design-risk.',
  },
];

export default async function LabIndexPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const headerList = await headers();
  if (!isGroupTenant(headerList)) notFound();

  return (
    <PageShell locale={locale} pathname="/lab">
      <section className="mx-page-header">
        <div className="mx-container">
          <p className="mx-eyebrow">Lab · landing prototypes</p>
          <h1>
            Three takes on the <em>group landing</em>.
          </h1>
          <p className="mx-lead" style={{ maxWidth: '64ch' }}>
            All three keep the MERLx wordmark fixed and animate the entity layer (Studio / Network /
            Learn). Built as standalone routes so they don't disturb the production landing.
          </p>
        </div>
      </section>

      <section className="mx-section">
        <div className="mx-container">
          <div style={gridStyle}>
            {PROTOTYPES.map((p) => (
              <Link
                key={p.slug}
                href={`/${locale}/lab/${p.slug}`}
                className="mx-card"
                style={cardStyle}
              >
                <span style={labelStyle}>{p.label}</span>
                <p style={bodyStyle}>{p.body}</p>
                <p style={riskStyle}>{p.risk}</p>
                <span style={ctaStyle}>Open prototype →</span>
              </Link>
            ))}
          </div>
          <p style={{ marginTop: 32, fontSize: 12, color: 'var(--ink-muted)' }}>
            Production landing for comparison:{' '}
            <Link href={`/${locale}`} style={inlineLinkStyle}>
              /{locale}
            </Link>
          </p>
        </div>
      </section>
    </PageShell>
  );
}

const gridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: 16,
};

const cardStyle: CSSProperties = {
  padding: 28,
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
  textDecoration: 'none',
  background: 'var(--surface)',
  minHeight: 220,
};

const labelStyle: CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: 11,
  letterSpacing: '1.5px',
  textTransform: 'uppercase',
  color: 'var(--deep-teal)',
};

const bodyStyle: CSSProperties = {
  fontFamily: 'var(--font-sans)',
  fontSize: 14,
  color: 'var(--ink)',
  lineHeight: 1.55,
  margin: 0,
};

const riskStyle: CSSProperties = {
  fontFamily: 'var(--font-sans)',
  fontSize: 12,
  color: 'var(--ink-muted)',
  margin: 0,
};

const ctaStyle: CSSProperties = {
  marginTop: 'auto',
  paddingTop: 12,
  borderTop: '1px solid var(--border-light)',
  fontFamily: 'var(--font-mono)',
  fontSize: 11,
  letterSpacing: '0.5px',
  color: 'var(--deep-teal)',
};

const inlineLinkStyle: CSSProperties = {
  color: 'var(--deep-teal)',
  textDecoration: 'underline',
  textDecorationColor: 'var(--deep-teal-dim)',
};
