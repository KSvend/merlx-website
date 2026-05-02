import { PageShell } from '@/components/chrome/PageShell';
import { NODES } from '@/content/nodes';
import { isNetworkTenant } from '@/lib/tenant-aware';
import { setRequestLocale } from 'next-intl/server';
import { headers } from 'next/headers';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ locale: string }>;
}

const STATUS_LABEL: Record<string, string> = {
  active: 'Active',
  onboarding: 'Onboarding',
  planned: 'Planned',
};

export default async function NodesIndex({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const headerList = await headers();
  if (!isNetworkTenant(headerList)) notFound();

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
          The Network
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
          Federated nodes across {NODES.length} regions.
        </h1>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {NODES.map((node) => (
            <Link
              key={node.slug}
              href={`/${locale}/nodes/${node.slug}`}
              style={{
                display: 'grid',
                gridTemplateColumns: '180px 180px 1fr auto',
                alignItems: 'baseline',
                gap: 24,
                padding: '24px 28px',
                border: '1px solid var(--color-rule)',
                borderRadius: 'var(--radius-md)',
                background: 'var(--color-bg)',
                textDecoration: 'none',
                color: 'var(--color-ink)',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 22,
                  fontWeight: 600,
                  letterSpacing: '-0.012em',
                }}
              >
                {node.name}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10,
                  letterSpacing: '0.04em',
                  color: 'var(--color-ink-mute)',
                }}
              >
                {node.region}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 14,
                  lineHeight: 1.5,
                  color: 'var(--color-ink-soft)',
                }}
              >
                {node.tagline}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 9,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: node.status === 'active' ? 'var(--color-teal)' : 'var(--color-ink-mute)',
                }}
              >
                {STATUS_LABEL[node.status]}
              </span>
            </Link>
          ))}
        </div>
      </article>
    </PageShell>
  );
}
