import { PageShell } from '@/components/chrome/PageShell';
import { ENGAGEMENT_MODELS } from '@/content/engage';
import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { CSSProperties } from 'react';

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export default async function EngageSlugPage({ params }: PageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const model = ENGAGEMENT_MODELS.find((m) => m.slug === slug);
  if (!model) notFound();

  return (
    <PageShell locale={locale} pathname={`/engage/${slug}`}>
      <section className="mx-page-header">
        <div className="mx-container">
          <p className="mx-eyebrow">Engagement model</p>
          <h1>
            {model.name} <em>— {model.tagline.replace(/\.$/, '')}.</em>
          </h1>
          <p className="mx-lead" style={{ maxWidth: '64ch' }}>
            {model.fit}
          </p>
        </div>
      </section>

      <section className="mx-section">
        <div className="mx-container-narrow">
          <p
            style={{
              fontFamily: 'var(--font-display)',
              fontStyle: 'italic',
              fontWeight: 400,
              fontSize: 'clamp(20px, 2.2vw, 26px)',
              lineHeight: 1.4,
              color: 'var(--ink)',
              margin: '0 0 32px',
              maxWidth: '52ch',
            }}
          >
            {model.description}
          </p>

          <p className="mx-mono-caption" style={{ margin: '0 0 16px', textTransform: 'uppercase' }}>
            What's included
          </p>
          <ul style={listStyle}>
            {model.bullets.map((b) => (
              <li key={b} style={liStyle}>
                <span
                  aria-hidden="true"
                  style={{ color: 'var(--ink-faint)', fontFamily: 'var(--font-mono)' }}
                >
                  ·
                </span>
                {b}
              </li>
            ))}
          </ul>

          <div style={{ marginTop: 48, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link href={`/${locale}/contact`} className="mx-btn mx-btn--primary">
              Start a conversation →
            </Link>
            <Link href={`/${locale}/engage`} className="mx-btn mx-btn--ghost">
              ← All engagement models
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

const listStyle: CSSProperties = {
  listStyle: 'none',
  padding: 0,
  margin: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: 14,
};

const liStyle: CSSProperties = {
  fontSize: 14,
  lineHeight: 1.6,
  color: 'var(--ink)',
  display: 'grid',
  gridTemplateColumns: '20px 1fr',
  gap: 8,
};
