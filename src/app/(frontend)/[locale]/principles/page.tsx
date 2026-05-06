import { PageShell } from '@/components/chrome/PageShell';
import { NETWORK_BELIEFS, NETWORK_COMMITMENTS } from '@/content/network-principles';
import { BELIEFS, COMMITMENTS } from '@/content/principles';
import { isNetworkTenant, parseTenantHeaders } from '@/lib/tenant-aware';
import { setRequestLocale } from 'next-intl/server';
import { headers } from 'next/headers';
import Link from 'next/link';
import type { CSSProperties } from 'react';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function PrinciplesPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const headerList = await headers();
  const isNetwork = isNetworkTenant(headerList);
  // Tenant context retrieved for completeness; only the network/studio
  // branch is needed below, but parsing here keeps the pattern uniform.
  parseTenantHeaders(headerList);

  const commitments = isNetwork ? NETWORK_COMMITMENTS : COMMITMENTS;
  const beliefs = isNetwork ? NETWORK_BELIEFS : BELIEFS;
  const heroLine = isNetwork
    ? 'How the Network operates.'
    : 'A quieter, more careful kind of analytical practice.';
  const heroFlourish = isNetwork ? 'cooperative, not franchised' : 'principles, not slogans';

  return (
    <PageShell locale={locale} pathname="/principles">
      <section className="mx-page-header">
        <div className="mx-container">
          <p className="mx-eyebrow">Principles · {isNetwork ? 'Network' : 'Studio'}</p>
          <h1>
            {heroLine} <em>{heroFlourish}.</em>
          </h1>
          <p className="mx-lead" style={{ maxWidth: '64ch' }}>
            Principles describe the floor we will not drop below. They are the things we will say no
            to a contract for.
          </p>
        </div>
      </section>

      <section className="mx-section">
        <div className="mx-container">
          <p className="mx-eyebrow">Commitments</p>
          <h2 className="mx-h2-section">
            What we promise to <em>deliver</em>.
          </h2>
          <div style={listGridStyle}>
            {commitments.map((p) => (
              <article key={p.number} style={itemStyle}>
                <span style={numberStyle}>{String(p.number).padStart(2, '0')}</span>
                <div>
                  <h3 style={titleStyle}>{p.title}</h3>
                  <p style={bodyStyle}>{p.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-section mx-section--shell-warm">
        <div className="mx-container">
          <p className="mx-eyebrow">Beliefs</p>
          <h2 className="mx-h2-section">
            How we think about the <em>work</em>.
          </h2>
          <div style={listGridStyle}>
            {beliefs.map((p) => (
              <article key={p.number} style={itemStyle}>
                <span style={numberStyle}>{String(p.number).padStart(2, '0')}</span>
                <div>
                  <h3 style={titleStyle}>{p.title}</h3>
                  <p style={bodyStyle}>{p.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-section">
        <div className="mx-container">
          <Link href={`/${locale}/contact`} className="mx-btn mx-btn--primary">
            Talk to {isNetwork ? 'the network' : 'the studio'} →
          </Link>
        </div>
      </section>
    </PageShell>
  );
}

const listGridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
  gap: 48,
  marginTop: 48,
};

const itemStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'auto 1fr',
  gap: 24,
  alignItems: 'start',
};

const numberStyle: CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: 11,
  color: 'var(--ink-faint)',
  letterSpacing: '1.5px',
  paddingTop: 6,
};

const titleStyle: CSSProperties = {
  fontFamily: 'var(--font-display)',
  fontStyle: 'italic',
  fontWeight: 400,
  fontSize: 24,
  margin: '0 0 12px',
  color: 'var(--iris)',
  letterSpacing: '-0.3px',
};

const bodyStyle: CSSProperties = {
  fontSize: 14,
  lineHeight: 1.6,
  color: 'var(--ink-muted)',
  margin: 0,
  maxWidth: '52ch',
};
