import { PageShell } from '@/components/chrome/PageShell';
import { NILEX_DEPLOYMENTS } from '@/content/nilex';
import { isNodeTenant, parseTenantHeaders } from '@/lib/tenant-aware';
import { setRequestLocale } from 'next-intl/server';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ locale: string }>;
}

const STATUS_LABEL: Record<string, string> = {
  active: 'Active',
  closed: 'Closed',
  planned: 'Planned',
};

export default async function DeploymentsPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const headerList = await headers();
  if (!isNodeTenant(headerList)) notFound();
  const { subdomain } = parseTenantHeaders(headerList);
  if (subdomain !== 'nilex') notFound();

  return (
    <PageShell locale={locale}>
      <article style={{ maxWidth: 980, margin: '0 auto', padding: '64px 24px 96px' }}>
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: 'var(--color-teal)',
            margin: '0 0 18px',
          }}
        >
          Deployments
        </p>
        <h1
          style={{
            fontFamily: 'var(--font-serif)',
            fontWeight: 600,
            fontSize: 48,
            letterSpacing: '-0.018em',
            lineHeight: 1.1,
            color: 'var(--color-ink)',
            margin: '0 0 56px',
            maxWidth: 760,
          }}
        >
          Programmes NileX is delivering right now.
        </h1>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {NILEX_DEPLOYMENTS.map((d) => (
            <div
              key={d.slug}
              style={{
                display: 'grid',
                gridTemplateColumns: '220px 220px 1fr auto',
                alignItems: 'baseline',
                gap: 24,
                padding: '20px 24px',
                border: '1px solid var(--color-rule)',
                borderRadius: 'var(--radius-md)',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 19,
                  fontWeight: 600,
                  letterSpacing: '-0.012em',
                  color: 'var(--color-ink)',
                }}
              >
                {d.name}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  color: 'var(--color-ink-mute)',
                  letterSpacing: '0.04em',
                }}
              >
                {d.partner} · {d.region}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 14,
                  lineHeight: 1.5,
                  color: 'var(--color-ink-soft)',
                }}
              >
                {d.summary}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 9,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: d.status === 'active' ? 'var(--color-teal)' : 'var(--color-ink-mute)',
                }}
              >
                {STATUS_LABEL[d.status]}
              </span>
            </div>
          ))}
        </div>
      </article>
    </PageShell>
  );
}
