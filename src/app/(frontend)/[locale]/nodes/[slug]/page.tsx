import { PageShell } from '@/components/chrome/PageShell';
import { NODES } from '@/content/nodes';
import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { CSSProperties } from 'react';

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

const STATUS_COLOR: Record<string, string> = {
  active: 'var(--deep-teal)',
  onboarding: 'var(--iris)',
  planned: 'var(--ink-faint)',
};

const STATUS_LABEL: Record<string, string> = {
  active: 'ACTIVE NODE',
  onboarding: 'ONBOARDING',
  planned: 'PLANNED · 2026',
};

export default async function NodeSlugPage({ params }: PageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const node = NODES.find((n) => n.slug === slug);
  if (!node) notFound();

  const accent = STATUS_COLOR[node.status] ?? 'var(--ink-muted)';

  return (
    <PageShell locale={locale} pathname={`/nodes/${slug}`}>
      <section className="mx-page-header">
        <div className="mx-container">
          <p className="mx-eyebrow" style={{ color: accent }}>
            {STATUS_LABEL[node.status]} · {node.region}
          </p>
          <h1>
            {node.name} <em>— {node.tagline.replace(/\.$/, '')}.</em>
          </h1>
          <p className="mx-lead" style={{ maxWidth: '64ch' }}>
            {node.description}
          </p>
        </div>
      </section>

      <section className="mx-section">
        <div className="mx-container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: 0,
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              background: 'var(--surface)',
            }}
          >
            <Cell label="Country" value={node.country} />
            <Cell label="Region" value={node.region} />
            <Cell label="Primary locale" value={node.primaryLocale.toUpperCase()} />
            {node.subdomain ? <Cell label="Subdomain" value={node.subdomain} /> : null}
          </div>
        </div>
      </section>

      <section className="mx-section mx-section--shell-warm">
        <div className="mx-container">
          <div className="mx-intro">
            <div>
              <p className="mx-eyebrow">Capabilities</p>
              <h2 className="mx-h2-section">
                What this node <em>delivers</em>.
              </h2>
            </div>
            <p className="mx-lead">
              Capabilities listed here are present in the node's current bench. New capabilities are
              added as senior staff onboard or partner demand justifies the bench change.
            </p>
          </div>
          <ol style={{ listStyle: 'none', padding: 0, margin: 0, counterReset: 'cap' }}>
            {node.capabilities.map((c, i) => (
              <li
                key={c}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '48px 1fr',
                  gap: 24,
                  padding: '20px 0',
                  borderBottom:
                    i < node.capabilities.length - 1 ? '1px solid var(--border-light)' : 'none',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 11,
                    color: accent,
                    letterSpacing: '0.5px',
                    paddingTop: 3,
                  }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p
                  style={{
                    fontSize: 15,
                    lineHeight: 1.55,
                    color: 'var(--ink)',
                    margin: 0,
                    textWrap: 'pretty',
                  }}
                >
                  {c}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-section">
        <div className="mx-container">
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {node.subdomain ? (
              <a
                href={`https://${node.subdomain}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mx-btn mx-btn--primary"
              >
                Visit {node.name} →
              </a>
            ) : null}
            <Link href={`/${locale}/contact`} className="mx-btn mx-btn--ghost">
              Talk to the network
            </Link>
            <Link href={`/${locale}/nodes`} className="mx-btn mx-btn--ghost">
              ← All nodes
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

function Cell({ label, value }: { label: string; value: string }) {
  return (
    <div style={cellStyle}>
      <p
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          letterSpacing: '1.5px',
          color: 'var(--ink-faint)',
          textTransform: 'uppercase',
          margin: '0 0 8px',
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontFamily: 'var(--font-display)',
          fontStyle: 'italic',
          fontWeight: 400,
          fontSize: 22,
          color: 'var(--ink)',
          margin: 0,
          letterSpacing: '-0.3px',
        }}
      >
        {value}
      </p>
    </div>
  );
}

const cellStyle: CSSProperties = {
  padding: 28,
  borderRight: '1px solid var(--border-light)',
};
