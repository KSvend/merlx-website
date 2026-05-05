import { PageShell } from '@/components/chrome/PageShell';
import { NILEX_NEWS } from '@/content/nilex';
import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function NewsIndexPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <PageShell locale={locale} pathname="/news">
      <section className="mx-page-header">
        <div className="mx-container">
          <p className="mx-eyebrow">News from the node</p>
          <h1>
            What's happened <em>at NileX</em>.
          </h1>
          <p className="mx-lead" style={{ maxWidth: '64ch' }}>
            Methodology updates, new deployments, publications, cross-network announcements, and
            occasional editorials.
          </p>
        </div>
      </section>

      <section className="mx-section mx-section--shell-warm">
        <div className="mx-container">
          <div
            className="mx-card"
            style={{ padding: 0, overflow: 'hidden', background: 'var(--surface)' }}
          >
            {NILEX_NEWS.map((item, i) => (
              <Link
                key={item.slug}
                href={`/${locale}/news/${item.slug}`}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '120px 1fr 60px',
                  gap: 24,
                  padding: '28px 32px',
                  alignItems: 'center',
                  borderBottom:
                    i < NILEX_NEWS.length - 1 ? '1px solid var(--border-light)' : 'none',
                }}
              >
                <span
                  style={{
                    fontSize: 11,
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--ink-faint)',
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase',
                  }}
                >
                  {item.date}
                </span>
                <div>
                  <h3
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontStyle: 'italic',
                      fontWeight: 400,
                      fontSize: 24,
                      lineHeight: 1.25,
                      margin: '0 0 8px',
                      color: 'var(--ink)',
                      letterSpacing: '-0.3px',
                    }}
                  >
                    {item.title}
                  </h3>
                  <p
                    style={{
                      fontSize: 13,
                      color: 'var(--ink-muted)',
                      lineHeight: 1.55,
                      margin: 0,
                      maxWidth: '64ch',
                    }}
                  >
                    {item.excerpt}
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
