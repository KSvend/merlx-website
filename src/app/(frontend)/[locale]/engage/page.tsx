import { PageShell } from '@/components/chrome/PageShell';
import { ENGAGEMENT_MODELS } from '@/content/engage';
import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function EngagePage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <PageShell locale={locale} pathname="/engage">
      <section className="mx-page-header">
        <div className="mx-container">
          <p className="mx-eyebrow">How to work with MERLx</p>
          <h1>
            Four ways to <em>engage</em>.
          </h1>
          <p className="mx-lead" style={{ maxWidth: '64ch' }}>
            Most engagements with MERLx fit one of four shapes. Pick the closest fit on the contact
            form and we will route you to the right team within two working days.
          </p>
        </div>
      </section>

      <section className="mx-section mx-section--ink">
        <div className="mx-container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
              gap: 16,
            }}
          >
            {ENGAGEMENT_MODELS.map((m, i) => (
              <Link
                key={m.slug}
                href={`/${locale}/engage/${m.slug}`}
                style={{
                  padding: 32,
                  background: 'rgba(245,243,238,0.04)',
                  border: '1px solid rgba(245,243,238,0.08)',
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
                    color: 'var(--teal-light)',
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
                    color: 'var(--shell)',
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
                    color: 'rgba(245,243,238,0.78)',
                    margin: '0 0 16px',
                  }}
                >
                  {m.tagline}
                </p>
                <p
                  style={{
                    fontSize: 12,
                    color: 'rgba(245,243,238,0.55)',
                    margin: '0 0 20px',
                    lineHeight: 1.55,
                  }}
                >
                  <strong style={{ fontWeight: 500, color: 'rgba(245,243,238,0.85)' }}>
                    Fit ·{' '}
                  </strong>
                  {m.fit}
                </p>
                <p
                  style={{
                    marginTop: 'auto',
                    fontSize: 11,
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--teal-light)',
                    letterSpacing: '0.5px',
                  }}
                >
                  Read more →
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
