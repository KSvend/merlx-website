import { PageShell } from '@/components/chrome/PageShell';
import { SERVICES } from '@/content/services';
import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function ServicesIndexPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <PageShell locale={locale} pathname="/services">
      <section className="mx-page-header">
        <div className="mx-container">
          <p className="mx-eyebrow">What network nodes deliver</p>
          <h1>
            Five service areas, <em>one practice</em>.
          </h1>
          <p className="mx-lead" style={{ maxWidth: '64ch' }}>
            Network nodes deliver MERL programmes from design through close-out, plus early warning,
            independent evaluation, qualitative research, and partner capacity work. Every
            engagement uses locally grounded methodology with cross-node peer review.
          </p>
        </div>
      </section>

      <section className="mx-section mx-section--shell-warm">
        <div className="mx-container">
          <div
            className="mx-card"
            style={{ padding: 0, overflow: 'hidden', background: 'var(--surface)' }}
          >
            {SERVICES.map((s, i) => (
              <Link
                key={s.slug}
                href={`/${locale}/services/${s.slug}`}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '60px 1fr 60px',
                  gap: 24,
                  padding: '32px',
                  alignItems: 'center',
                  borderBottom: i < SERVICES.length - 1 ? '1px solid var(--border-light)' : 'none',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 11,
                    color: 'var(--ink-faint)',
                    letterSpacing: '1.5px',
                  }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontStyle: 'italic',
                      fontWeight: 400,
                      fontSize: 26,
                      color: 'var(--ink)',
                      letterSpacing: '-0.3px',
                      margin: '0 0 6px',
                    }}
                  >
                    {s.name}
                  </h3>
                  <p
                    style={{
                      fontSize: 14,
                      color: 'var(--ink-muted)',
                      lineHeight: 1.55,
                      margin: 0,
                      maxWidth: '64ch',
                    }}
                  >
                    {s.tagline}
                  </p>
                </div>
                <span
                  aria-hidden="true"
                  style={{ color: 'var(--ink-muted)', fontSize: 18, justifySelf: 'end' }}
                >
                  →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
