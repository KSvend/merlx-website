import { PageShell } from '@/components/chrome/PageShell';
import { NILEX_DEPLOYMENTS } from '@/content/nilex';
import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ locale: string }>;
}

const STATUS_COLOR: Record<string, string> = {
  active: 'var(--deep-teal)',
  closed: 'var(--ink-faint)',
  planned: 'var(--iris)',
};

const STATUS_LABEL: Record<string, string> = {
  active: '● ACTIVE',
  closed: '◐ CLOSED',
  planned: '○ PLANNED',
};

export default async function DeploymentsIndexPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <PageShell locale={locale} pathname="/deployments">
      <section className="mx-page-header">
        <div className="mx-container">
          <p className="mx-eyebrow">Deployments</p>
          <h1>
            Programmes <em>currently underway</em>.
          </h1>
          <p className="mx-lead" style={{ maxWidth: '64ch' }}>
            Active engagements across Sudan, South Sudan, and the wider Nile basin — for INGO
            consortia, multilateral research foundations, and partner Network operations.
          </p>
        </div>
      </section>

      <section className="mx-section mx-section--shell-warm">
        <div className="mx-container">
          <div
            className="mx-card"
            style={{ padding: 0, overflow: 'hidden', background: 'var(--surface)' }}
          >
            {NILEX_DEPLOYMENTS.map((d, i) => (
              <Link
                key={d.slug}
                href={`/${locale}/deployments/${d.slug}`}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '110px 1fr 60px',
                  gap: 24,
                  padding: '32px',
                  alignItems: 'center',
                  borderBottom:
                    i < NILEX_DEPLOYMENTS.length - 1 ? '1px solid var(--border-light)' : 'none',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 10,
                    color: STATUS_COLOR[d.status],
                    letterSpacing: '1px',
                  }}
                >
                  {STATUS_LABEL[d.status]}
                </span>
                <div>
                  <h3
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontStyle: 'italic',
                      fontWeight: 400,
                      fontSize: 24,
                      color: 'var(--ink)',
                      letterSpacing: '-0.3px',
                      margin: '0 0 6px',
                    }}
                  >
                    {d.name}
                  </h3>
                  <p
                    style={{
                      fontSize: 13,
                      color: 'var(--ink-muted)',
                      lineHeight: 1.55,
                      margin: '0 0 8px',
                      maxWidth: '64ch',
                    }}
                  >
                    {d.summary}
                  </p>
                  <p
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 11,
                      color: 'var(--ink-faint)',
                      letterSpacing: '0.5px',
                      margin: 0,
                    }}
                  >
                    {d.partner} · {d.region}
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
