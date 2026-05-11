import { PageShell } from '@/components/chrome/PageShell';
import { engagementModelsFor } from '@/content/engage';
import { pageHeroesFor } from '@/content/copy/page-heroes';
import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function EngagePage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const hero = pageHeroesFor(locale).engage;
  const models = engagementModelsFor(locale);
  const fitLabel = pageHeroesFor(locale).engageModel.leadLabel;

  return (
    <PageShell locale={locale} pathname="/engage">
      <section className="mx-page-header">
        <div className="mx-container">
          <p className="mx-eyebrow">{hero.eyebrow}</p>
          <h1>
            {hero.headlinePrefix}{' '}
            <em style={{ color: 'var(--ember)' }}>{hero.headlineEm}</em>
            {hero.headlineSuffix}
          </h1>
          <p className="mx-lead" style={{ maxWidth: '64ch' }}>
            {hero.lead}
          </p>
        </div>
      </section>

      <section className="mx-section">
        <div className="mx-container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
              gap: 16,
            }}
          >
            {models.map((m, i) => (
              <Link
                key={m.slug}
                href={`/${locale}/engage/${m.slug}`}
                style={{
                  padding: 32,
                  background: 'var(--surface)',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-md)',
                  textDecoration: 'none',
                  color: 'inherit',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 0,
                }}
              >
                <p
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 11,
                    color: 'var(--ember)',
                    letterSpacing: '1.5px',
                    margin: '0 0 16px',
                  }}
                >
                  MODEL · 0{i + 1}
                </p>
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontStyle: 'italic',
                    fontWeight: 400,
                    fontSize: 28,
                    color: 'var(--ink)',
                    margin: '0 0 12px',
                    letterSpacing: '-0.4px',
                  }}
                >
                  {m.name}
                </h3>
                <p
                  style={{
                    fontSize: 13,
                    lineHeight: 1.6,
                    color: 'var(--ink-muted)',
                    margin: '0 0 16px',
                  }}
                >
                  {m.tagline}
                </p>
                <p
                  style={{
                    fontSize: 12,
                    color: 'var(--ink-faint)',
                    margin: '0 0 20px',
                    lineHeight: 1.55,
                  }}
                >
                  <strong style={{ fontWeight: 500, color: 'var(--ink-muted)' }}>
                    {fitLabel} ·{' '}
                  </strong>
                  {m.fit}
                </p>
                <p
                  style={{
                    marginTop: 'auto',
                    fontSize: 11,
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--deep-teal)',
                    letterSpacing: '0.5px',
                  }}
                >
                  →
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
