import { NetworkPreview } from '@/components/dashboards/NetworkPreview';
import { NODES } from '@/content/nodes';
import { SERVICES } from '@/content/services';
import Link from 'next/link';
import type { CSSProperties } from 'react';

interface NetworkHomeProps {
  locale: string;
}

export function NetworkHome({ locale }: NetworkHomeProps) {
  return (
    <>
      <Hero locale={locale} />
      <NodesStrip locale={locale} />
      <ServicesStrip locale={locale} />
      <BecomeANodeStrip locale={locale} />
    </>
  );
}

function Hero({ locale }: { locale: string }) {
  return (
    <section style={{ padding: '80px 0 64px' }}>
      <div className="mx-container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.05fr 1fr',
            gap: 64,
            alignItems: 'center',
          }}
        >
          <div>
            <p className="mx-eyebrow">MERLx Network · the MERL guild</p>
            <h1 className="mx-h1-display">
              Locally owned MERL. <em>Cooperative, not franchised.</em>
            </h1>
            <p className="mx-lead" style={{ marginTop: 32, maxWidth: '46ch' }}>
              The Network is a cooperative of locally owned MERL practices — research, evaluation,
              third-party monitoring, KII rotations, and field analysis under shared methodology and
              conflict-sensitivity standards. The Studio builds the tools; the Network does the work
              in country.
            </p>
            <div style={{ display: 'flex', gap: 12, marginTop: 36, flexWrap: 'wrap' }}>
              <Link href={`/${locale}/nodes`} className="mx-btn mx-btn--primary mx-btn--lg">
                See the nodes →
              </Link>
              <Link href={`/${locale}/services`} className="mx-btn mx-btn--ghost mx-btn--lg">
                What we deliver
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
              Active node — NileX · Sudan and the Nile basin
            </p>
          </div>
          <NetworkPreview />
        </div>
      </div>
    </section>
  );
}

function NodesStrip({ locale }: { locale: string }) {
  return (
    <section className="mx-section mx-section--shell-warm">
      <div className="mx-container">
        <div className="mx-intro">
          <div>
            <p className="mx-eyebrow">The cooperative</p>
            <h2 className="mx-h2-section">
              Four nodes, <em>one methodology</em>.
            </h2>
          </div>
          <p className="mx-lead">
            Each node is autonomous and accountable in country. Nodes share methodology, peer
            review, and tooling — not governance.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 16,
          }}
        >
          {NODES.map((node) => {
            const accent =
              node.status === 'active'
                ? 'var(--deep-teal)'
                : node.status === 'onboarding'
                  ? 'var(--iris)'
                  : 'var(--ink-faint)';
            const statusLabel =
              node.status === 'active'
                ? '● ACTIVE'
                : node.status === 'onboarding'
                  ? '◐ ONBOARDING'
                  : '○ PLANNED';
            return (
              <Link
                key={node.slug}
                href={`/${locale}/nodes/${node.slug}`}
                className="mx-card"
                style={cardStyle}
              >
                <div
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 10,
                      letterSpacing: '1px',
                      color: accent,
                    }}
                  >
                    {statusLabel}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 10,
                      color: 'var(--ink-faint)',
                      letterSpacing: '0.5px',
                    }}
                  >
                    {node.region.toUpperCase()}
                  </span>
                </div>
                <h3
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontWeight: 600,
                    fontSize: 22,
                    margin: '16px 0 8px',
                    letterSpacing: '-0.3px',
                  }}
                >
                  {node.name}
                </h3>
                <p style={{ fontSize: 13, lineHeight: 1.55, color: 'var(--ink-muted)', margin: 0 }}>
                  {node.tagline}
                </p>
                <div
                  style={{
                    marginTop: 'auto',
                    paddingTop: 16,
                    borderTop: '1px solid var(--border-light)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span style={{ fontSize: 11, color: 'var(--ink-muted)' }}>{node.country}</span>
                  <span aria-hidden="true" style={{ color: accent, fontSize: 16 }}>
                    →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ServicesStrip({ locale }: { locale: string }) {
  return (
    <section className="mx-section">
      <div className="mx-container">
        <div className="mx-intro">
          <div>
            <p className="mx-eyebrow">What nodes deliver</p>
            <h2 className="mx-h2-section">
              MERL programme delivery, end-to-end.{' '}
              <em>Plus the Studio's tools as infrastructure.</em>
            </h2>
          </div>
          <p className="mx-lead">
            Five service areas across the cooperative. Every engagement uses locally-grounded
            methodology with cross-node peer review.
          </p>
        </div>

        <div
          className="mx-card"
          style={{ padding: 0, overflow: 'hidden', background: 'var(--surface)' }}
        >
          {SERVICES.map((service, i) => (
            <Link
              key={service.slug}
              href={`/${locale}/services/${service.slug}`}
              style={{
                display: 'grid',
                gridTemplateColumns: '60px 1fr 60px',
                gap: 24,
                padding: '28px 32px',
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
                    fontSize: 24,
                    color: 'var(--ink)',
                    letterSpacing: '-0.3px',
                    margin: '0 0 6px',
                  }}
                >
                  {service.name}
                </h3>
                <p
                  style={{
                    fontSize: 13,
                    lineHeight: 1.55,
                    color: 'var(--ink-muted)',
                    margin: 0,
                    maxWidth: '64ch',
                  }}
                >
                  {service.tagline}
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

function BecomeANodeStrip({ locale }: { locale: string }) {
  return (
    <section className="mx-section mx-section--iris">
      <div className="mx-container" style={{ textAlign: 'center' }}>
        <p className="mx-eyebrow" style={{ justifyContent: 'center', display: 'inline-flex' }}>
          Joining the cooperative
        </p>
        <h2
          style={{
            fontFamily: 'var(--font-sans)',
            fontWeight: 600,
            fontSize: 'clamp(36px, 4.5vw, 56px)',
            lineHeight: 1.05,
            letterSpacing: '-1px',
            color: 'var(--shell)',
            margin: '12px auto 24px',
            maxWidth: '22ch',
            textWrap: 'balance',
          }}
        >
          Locally owned. <em style={emInverse}>Globally connected</em>.
        </h2>
        <p
          style={{
            fontSize: 16,
            lineHeight: 1.55,
            color: 'rgba(245,243,238,0.78)',
            maxWidth: '52ch',
            margin: '0 auto 32px',
          }}
        >
          We work with cooperative MERL practices in countries where the Network has gaps.
          Onboarding is a six-month process: methodology alignment, peer review, tooling
          integration, then a first joint engagement.
        </p>
        <div
          style={{ display: 'inline-flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}
        >
          <Link href={`/${locale}/become-a-node`} className="mx-btn mx-btn--inverse mx-btn--lg">
            Read the onboarding brief →
          </Link>
          <Link href={`/${locale}/contact`} className="mx-btn mx-btn--outline-light mx-btn--lg">
            Talk to the network
          </Link>
        </div>
      </div>
    </section>
  );
}

const cardStyle: CSSProperties = {
  padding: 28,
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
  textDecoration: 'none',
  minHeight: 220,
};

const emInverse: CSSProperties = {
  fontFamily: 'var(--font-display)',
  fontStyle: 'italic',
  fontWeight: 400,
  color: 'var(--teal-light)',
};
