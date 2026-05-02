import { PageShell } from '@/components/chrome/PageShell';
import { NODES } from '@/content/nodes';
import { isNetworkTenant } from '@/lib/tenant-aware';
import { setRequestLocale } from 'next-intl/server';
import { headers } from 'next/headers';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

const STATUS_LABEL: Record<string, string> = {
  active: 'Active',
  onboarding: 'Onboarding',
  planned: 'Planned',
};

export default async function NodeProfile({ params }: PageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const headerList = await headers();
  if (!isNetworkTenant(headerList)) notFound();

  const node = NODES.find((n) => n.slug === slug);
  if (!node) notFound();

  const statusColor = node.status === 'active' ? 'var(--color-teal)' : 'var(--color-ink-mute)';

  return (
    <PageShell locale={locale}>
      <article style={{ maxWidth: 760, margin: '0 auto', padding: '64px 24px 96px' }}>
        <Link
          href={`/${locale}/nodes`}
          style={{
            display: 'inline-block',
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            letterSpacing: '0.12em',
            color: 'var(--color-ink-mute)',
            textDecoration: 'none',
            marginBottom: 24,
          }}
        >
          ← All nodes
        </Link>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 14 }}>
          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontWeight: 600,
              fontSize: 56,
              letterSpacing: '-0.02em',
              color: 'var(--color-ink)',
              margin: 0,
            }}
          >
            {node.name}
          </h1>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: statusColor,
              padding: '4px 10px',
              border: `1px solid ${statusColor}`,
              borderRadius: 'var(--radius-pill, 100px)',
            }}
          >
            {STATUS_LABEL[node.status]}
          </span>
        </div>
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            letterSpacing: '0.12em',
            color: 'var(--color-ink-mute)',
            margin: '0 0 24px',
          }}
        >
          {node.region} · {node.country} · primary locale {node.primaryLocale}
        </p>

        <p
          style={{
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            fontSize: 20,
            lineHeight: 1.5,
            color: 'var(--color-ink-mute)',
            margin: '0 0 36px',
          }}
        >
          {node.tagline}
        </p>

        <p
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 17,
            lineHeight: 1.7,
            color: 'var(--color-ink-soft)',
            margin: '0 0 36px',
          }}
        >
          {node.description}
        </p>

        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: 'var(--color-teal)',
            margin: '0 0 12px',
          }}
        >
          Capabilities
        </p>
        <ul
          style={{
            listStyle: 'none',
            padding: 0,
            margin: '0 0 48px',
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            fontFamily: 'var(--font-serif)',
            fontSize: 15,
            color: 'var(--color-ink-soft)',
          }}
        >
          {node.capabilities.map((cap) => (
            <li key={cap} style={{ display: 'flex', gap: 12, alignItems: 'baseline' }}>
              <span style={{ color: 'var(--color-teal)' }}>→</span>
              <span>{cap}</span>
            </li>
          ))}
        </ul>

        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
          {node.subdomain && node.status === 'active' ? (
            <a
              href={`https://${node.subdomain}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '13px 22px',
                background: 'var(--color-teal)',
                color: 'var(--color-bg)',
                borderRadius: 'var(--radius-sm)',
                fontFamily: 'var(--font-sans)',
                fontSize: 13,
                fontWeight: 500,
                textDecoration: 'none',
              }}
            >
              Visit {node.subdomain} ↗
            </a>
          ) : null}
          <Link
            href={`/${locale}/contact?interest=network&node=${node.slug}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '13px 22px',
              border: '1px solid var(--color-rule)',
              color: 'var(--color-ink)',
              borderRadius: 'var(--radius-sm)',
              fontFamily: 'var(--font-sans)',
              fontSize: 13,
              fontWeight: 500,
              textDecoration: 'none',
            }}
          >
            Engage with {node.name} →
          </Link>
        </div>
      </article>
    </PageShell>
  );
}
