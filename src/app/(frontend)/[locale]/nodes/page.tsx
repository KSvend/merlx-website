import { PageShell } from '@/components/chrome/PageShell';
import { NetworkPreview } from '@/components/dashboards/NetworkPreview';
import { NODES } from '@/content/nodes';
import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import type { CSSProperties } from 'react';

interface PageProps {
  params: Promise<{ locale: string }>;
}

const STATUS_COLOR: Record<string, string> = {
  active: 'var(--deep-teal)',
  onboarding: 'var(--iris)',
  planned: 'var(--ink-faint)',
};

const STATUS_LABEL: Record<string, string> = {
  active: '● ACTIVE',
  onboarding: '◐ ONBOARDING',
  planned: '○ PLANNED',
};

export default async function NodesIndexPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <PageShell locale={locale} pathname="/nodes">
      <section className="mx-page-header">
        <div className="mx-container">
          <p className="mx-eyebrow">The federation</p>
          <h1>
            Nodes, <em>not branches</em>.
          </h1>
          <p className="mx-lead" style={{ maxWidth: '64ch' }}>
            Each MERLx Network node is an autonomous, locally owned cooperative — accountable in
            country, not to a head office. Nodes share methodology, peer review, and tooling, not
            governance.
          </p>
        </div>
      </section>

      <section className="mx-section">
        <div className="mx-container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 1fr)',
              gap: 64,
              alignItems: 'start',
            }}
          >
            <div>
              <p className="mx-eyebrow">Where the work happens</p>
              <h2 className="mx-h2-section" style={{ margin: '8px 0 24px' }}>
                Four nodes across <em>three regions</em>.
              </h2>
              <p
                style={{
                  fontSize: 14,
                  color: 'var(--ink-muted)',
                  lineHeight: 1.6,
                  margin: 0,
                  maxWidth: '52ch',
                }}
              >
                One active node, two onboarding, one planned. The Network grows by invitation —
                cooperative MERL practices in countries where the federation has gaps and partner
                demand.
              </p>
            </div>
            <NetworkPreview />
          </div>
        </div>
      </section>

      <section className="mx-section mx-section--shell-warm">
        <div className="mx-container">
          <p className="mx-eyebrow">All nodes</p>
          <h2 className="mx-h2-section">
            Browse the <em>directory</em>.
          </h2>
          <div
            className="mx-card"
            style={{ padding: 0, overflow: 'hidden', background: 'var(--surface)', marginTop: 32 }}
          >
            {NODES.map((node, i) => {
              const accent = STATUS_COLOR[node.status] ?? 'var(--ink-muted)';
              return (
                <Link
                  key={node.slug}
                  href={`/${locale}/nodes/${node.slug}`}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '120px 1fr 200px 60px',
                    gap: 24,
                    padding: '28px 32px',
                    alignItems: 'center',
                    borderBottom: i < NODES.length - 1 ? '1px solid var(--border-light)' : 'none',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 10,
                      color: accent,
                      letterSpacing: '1px',
                    }}
                  >
                    {STATUS_LABEL[node.status] ?? node.status.toUpperCase()}
                  </span>
                  <div>
                    <h3 style={titleStyle}>{node.name}</h3>
                    <p style={taglineStyle}>{node.tagline}</p>
                  </div>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 11,
                      color: 'var(--ink-muted)',
                      letterSpacing: '0.5px',
                    }}
                  >
                    {node.country} · {node.region}
                  </span>
                  <span
                    aria-hidden="true"
                    style={{ color: 'var(--ink-muted)', fontSize: 18, justifySelf: 'end' }}
                  >
                    →
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </PageShell>
  );
}

const titleStyle: CSSProperties = {
  fontFamily: 'var(--font-sans)',
  fontWeight: 600,
  fontSize: 22,
  margin: 0,
  letterSpacing: '-0.3px',
  color: 'var(--ink)',
};

const taglineStyle: CSSProperties = {
  fontSize: 13,
  color: 'var(--ink-muted)',
  margin: '6px 0 0',
  lineHeight: 1.55,
  maxWidth: '64ch',
};
