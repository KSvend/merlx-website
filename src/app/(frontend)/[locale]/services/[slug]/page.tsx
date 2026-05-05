import { PageShell } from '@/components/chrome/PageShell';
import { SERVICES } from '@/content/services';
import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { CSSProperties } from 'react';

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export default async function ServiceSlugPage({ params }: PageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const service = SERVICES.find((s) => s.slug === slug);
  if (!service) notFound();

  return (
    <PageShell locale={locale} pathname={`/services/${slug}`}>
      <section className="mx-page-header">
        <div className="mx-container">
          <p className="mx-eyebrow">Network service</p>
          <h1>
            {service.name} <em>— {service.tagline.replace(/\.$/, '')}.</em>
          </h1>
          <p className="mx-lead" style={{ maxWidth: '64ch' }}>
            {service.description}
          </p>
        </div>
      </section>

      <section className="mx-section">
        <div className="mx-container-narrow">
          <p className="mx-mono-caption" style={{ margin: '0 0 16px', textTransform: 'uppercase' }}>
            What's included
          </p>
          <ol style={listStyle}>
            {service.bullets.map((b, i) => (
              <li
                key={b}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '48px 1fr',
                  gap: 24,
                  padding: '20px 0',
                  borderBottom:
                    i < service.bullets.length - 1 ? '1px solid var(--border-light)' : 'none',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 11,
                    color: 'var(--deep-teal)',
                    letterSpacing: '0.5px',
                    paddingTop: 3,
                  }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p style={{ fontSize: 15, lineHeight: 1.55, color: 'var(--ink)', margin: 0 }}>
                  {b}
                </p>
              </li>
            ))}
          </ol>

          <div style={{ marginTop: 48, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link href={`/${locale}/contact`} className="mx-btn mx-btn--primary">
              Talk to the network →
            </Link>
            <Link href={`/${locale}/services`} className="mx-btn mx-btn--ghost">
              ← All services
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
};
