import { NILEX_DEPLOYMENTS, NILEX_HERO, NILEX_NEWS } from '@/content/nilex';
import Link from 'next/link';
import type { CSSProperties } from 'react';

interface NodeHomeProps {
  locale: string;
  nodeName: string;
}

export function NodeHome({ locale, nodeName }: NodeHomeProps) {
  return (
    <>
      <Hero locale={locale} nodeName={nodeName} />
      <DeploymentsStrip locale={locale} />
      <NewsStrip locale={locale} />
    </>
  );
}

function Hero({ locale, nodeName }: { locale: string; nodeName: string }) {
  return (
    <section style={{ padding: '80px 0 64px' }}>
      <div className="mx-container">
        <p className="mx-eyebrow">{NILEX_HERO.eyebrow}</p>
        <h1 className="mx-h1-display" style={{ maxWidth: '20ch' }}>
          Sudan-rooted MERL, <em>evidence for the Nile basin</em>.
        </h1>
        <p className="mx-lead" style={{ marginTop: 32, maxWidth: '52ch' }}>
          {NILEX_HERO.tagline}
        </p>
        <div style={{ display: 'flex', gap: 12, marginTop: 36, flexWrap: 'wrap' }}>
          <Link href={`/${locale}/deployments`} className="mx-btn mx-btn--primary mx-btn--lg">
            {NILEX_HERO.primaryCta} →
          </Link>
          <Link href={`/${locale}/contact`} className="mx-btn mx-btn--ghost mx-btn--lg">
            {NILEX_HERO.secondaryCta}
          </Link>
        </div>
        <p
          style={{
            marginTop: 32,
            fontSize: 11,
            color: 'var(--ink-faint)',
            fontFamily: 'var(--font-mono)',
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
          }}
        >
          {nodeName} · a MERLx Network node · est. 2025
        </p>
      </div>
    </section>
  );
}

function DeploymentsStrip({ locale }: { locale: string }) {
  return (
    <section className="mx-section mx-section--shell-warm">
      <div className="mx-container">
        <div className="mx-intro">
          <div>
            <p className="mx-eyebrow">Active deployments</p>
            <h2 className="mx-h2-section">
              Programmes <em>currently underway</em>.
            </h2>
          </div>
          <p className="mx-lead">
            Active engagements across Sudan, South Sudan, and the wider Nile basin — for INGO
            consortia, multilateral research foundations, and partner Network operations.
          </p>
        </div>

        <div
          className="mx-card"
          style={{ padding: 0, overflow: 'hidden', background: 'var(--surface)' }}
        >
          {NILEX_DEPLOYMENTS.map((dep, i) => (
            <Link
              key={dep.slug}
              href={`/${locale}/deployments/${dep.slug}`}
              style={{
                display: 'grid',
                gridTemplateColumns: '60px 1fr 60px',
                gap: 24,
                padding: '28px 32px',
                alignItems: 'center',
                borderBottom:
                  i < NILEX_DEPLOYMENTS.length - 1 ? '1px solid var(--border-light)' : 'none',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10,
                  color:
                    dep.status === 'active'
                      ? 'var(--deep-teal)'
                      : dep.status === 'planned'
                        ? 'var(--iris)'
                        : 'var(--ink-faint)',
                  letterSpacing: '1px',
                }}
              >
                {dep.status === 'active'
                  ? '● ACTIVE'
                  : dep.status === 'planned'
                    ? '○ PLANNED'
                    : '◐ CLOSED'}
              </span>
              <div>
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontStyle: 'italic',
                    fontWeight: 400,
                    fontSize: 22,
                    color: 'var(--ink)',
                    letterSpacing: '-0.3px',
                    margin: '0 0 6px',
                  }}
                >
                  {dep.name}
                </h3>
                <p
                  style={{
                    fontSize: 13,
                    lineHeight: 1.55,
                    color: 'var(--ink-muted)',
                    margin: '0 0 8px',
                    maxWidth: '64ch',
                  }}
                >
                  {dep.summary}
                </p>
                <p style={metaStyle}>
                  {dep.partner} · {dep.region}
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
  );
}

function NewsStrip({ locale }: { locale: string }) {
  return (
    <section className="mx-section">
      <div className="mx-container">
        <div className="mx-intro">
          <div>
            <p className="mx-eyebrow">Recent news</p>
            <h2 className="mx-h2-section">
              From the <em>node</em>.
            </h2>
          </div>
          <p className="mx-lead">
            What's happened at the node lately — methodology updates, new deployments, publications,
            cross-network announcements.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 16,
          }}
        >
          {NILEX_NEWS.map((item) => (
            <Link
              key={item.slug}
              href={`/${locale}/news/${item.slug}`}
              className="mx-card"
              style={newsCardStyle}
            >
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10,
                  color: 'var(--ink-faint)',
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase',
                }}
              >
                {item.date}
              </span>
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontStyle: 'italic',
                  fontWeight: 400,
                  fontSize: 22,
                  margin: '12px 0 8px',
                  letterSpacing: '-0.3px',
                  color: 'var(--ink)',
                  lineHeight: 1.25,
                }}
              >
                {item.title}
              </h3>
              <p style={{ fontSize: 13, lineHeight: 1.55, color: 'var(--ink-muted)', margin: 0 }}>
                {item.excerpt}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

const metaStyle: CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: 11,
  color: 'var(--ink-faint)',
  letterSpacing: '0.5px',
  margin: 0,
};

const newsCardStyle: CSSProperties = {
  padding: 28,
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  textDecoration: 'none',
  minHeight: 200,
};
