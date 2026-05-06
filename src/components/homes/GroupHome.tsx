import { NetworkPreview } from '@/components/dashboards/NetworkPreview';
import { StudioPreview } from '@/components/dashboards/StudioPreview';
import Link from 'next/link';
import type { CSSProperties } from 'react';

interface GroupHomeProps {
  locale: string;
  tenantKind: string;
}

export function GroupHome({ locale, tenantKind }: GroupHomeProps) {
  return (
    <>
      <Hero />
      <TwoFrontDoorsSection locale={locale} />
      <PrinciplesSection />
      <PartnersStrip />
      <FinalCTA locale={locale} tenantKind={tenantKind} />
    </>
  );
}

function Hero() {
  return (
    <section style={{ padding: '80px 0 48px' }}>
      <div className="mx-container">
        <p className="mx-eyebrow">A studio and a network</p>
        <h1 className="mx-h1-display" style={{ maxWidth: '20ch' }}>
          Advanced data science and tech-enabled MERL{' '}
          <em>for global development and humanitarian aid programmes.</em>
        </h1>
        <p className="mx-lead" style={{ marginTop: 32, maxWidth: '52ch' }}>
          MERLx is two entities under one roof. The Studio builds the tools. The Network is a
          cooperative of locally owned MERL practices that runs those tools, and traditional MERL,
          in country.
        </p>
      </div>
    </section>
  );
}

function TwoFrontDoorsSection({ locale }: { locale: string }) {
  return (
    <section style={{ padding: '32px 0 96px' }}>
      <div className="mx-container">
        <div style={gridTwoCol}>
          <article style={frontDoorCardStyle}>
            <div style={frontDoorHeaderStyle}>
              <span className="mx-mono-caption" style={accentLabel('var(--ember)')}>
                01 · THE TECH STUDIO
              </span>
              <h2 style={cardHeadingStyle}>
                MERLx <em style={emItalicStyle('var(--deep-teal)')}>Studio</em>
                <br />
                <span style={{ color: 'var(--ink-muted)', fontWeight: 400 }}>
                  We build the tools.
                </span>
              </h2>
              <p style={cardLeadStyle}>
                An independent studio building the Optics Suite: six AI-native tools for analysts
                working in conflict, food-insecurity and humanitarian contexts. Methods are open.
                Outputs ship with their uncertainty.
              </p>
              <BulletList
                items={[
                  'Six tools: IRIS, Aperture, PRISM, ToC Tester, OASIS, ECHO',
                  'Earth observation, NLP, compound-risk forecasting',
                  'Engagements: hosted, pilot, build-with, advisory',
                ]}
              />
              <div style={{ display: 'flex', gap: 12, marginTop: 24, flexWrap: 'wrap' }}>
                <a
                  href="https://studio.merlx.org"
                  className="mx-btn mx-btn--primary"
                  rel="noopener noreferrer"
                >
                  Enter MERLx Studio →
                </a>
                <Link href={`/${locale}/contact`} className="mx-btn mx-btn--ghost">
                  Talk to the studio
                </Link>
              </div>
            </div>
            <div style={frontDoorPreviewStyle}>
              <StudioPreview />
            </div>
          </article>

          <article style={frontDoorCardStyle}>
            <div style={frontDoorHeaderStyle}>
              <span className="mx-mono-caption" style={accentLabel('var(--deep-teal)')}>
                02 · THE MERL NETWORK
              </span>
              <h2 style={cardHeadingStyle}>
                MERLx <em style={emItalicStyle('var(--iris)')}>Network</em>
                <br />
                <span style={{ color: 'var(--ink-muted)', fontWeight: 400 }}>
                  Locally owned MERL, in-country.
                </span>
              </h2>
              <p style={cardLeadStyle}>
                A cooperative of locally owned MERL practices. Each node is autonomous and
                accountable in country. Nodes share methodology, peer review and the Optics Suite as
                infrastructure. Governance stays local.
              </p>
              <BulletList
                items={[
                  'Active node: NileX (Sudan and the Nile basin)',
                  'Onboarding: Andes Cooperativa, Sahel Reseau',
                  'Services: research, evaluation, TPM, KII, partner support',
                ]}
              />
              <div style={{ display: 'flex', gap: 12, marginTop: 24, flexWrap: 'wrap' }}>
                <a
                  href="https://network.merlx.org"
                  className="mx-btn mx-btn--primary"
                  rel="noopener noreferrer"
                >
                  Enter the Network →
                </a>
                <Link href={`/${locale}/contact`} className="mx-btn mx-btn--ghost">
                  Talk to the network
                </Link>
              </div>
            </div>
            <div style={frontDoorPreviewStyle}>
              <NetworkPreview />
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

function PrinciplesSection() {
  const items = [
    {
      n: '01',
      t: 'Open by default.',
      d: 'Tools, methods and data schemas are open-source unless a partner constraint says otherwise. When a constraint exists, we name it.',
    },
    {
      n: '02',
      t: 'Conflict-sensitive engineering.',
      d: 'Every tool is reviewed for harm pathways before launch: surveillance, dual-use, exclusion. Reviews are documented and re-run when the context shifts.',
    },
    {
      n: '03',
      t: 'Numbers ship with uncertainty.',
      d: 'No quietly-rounded estimates. Models ship with the evaluation that produced them.',
    },
    {
      n: '04',
      t: 'Local epistemics.',
      d: 'Local researchers know things satellites cannot. The Studio builds; the Network deploys.',
    },
  ];

  return (
    <section className="mx-section mx-section--shell-warm">
      <div className="mx-container">
        <div className="mx-intro">
          <div>
            <p className="mx-eyebrow">How we work</p>
            <h2 className="mx-h2-section">
              Four commitments, <em>shared across the studio and the network</em>.
            </h2>
          </div>
          <p className="mx-lead">
            These describe the floor we will not drop below. Both Studio and Network sign off on
            them on every engagement.
          </p>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 0,
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            background: 'var(--surface)',
          }}
        >
          {items.map((item, i) => (
            <div
              key={item.n}
              style={{
                padding: 32,
                borderRight: i < items.length - 1 ? '1px solid var(--border-light)' : 'none',
              }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  color: 'var(--ink-faint)',
                  letterSpacing: '1.5px',
                  margin: '0 0 24px',
                }}
              >
                {item.n}
              </p>
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontStyle: 'italic',
                  fontWeight: 400,
                  fontSize: 24,
                  margin: '0 0 12px',
                  letterSpacing: '-0.4px',
                  color: 'var(--ink)',
                }}
              >
                {item.t}
              </h3>
              <p style={{ fontSize: 13, lineHeight: 1.55, color: 'var(--ink-muted)', margin: 0 }}>
                {item.d}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PartnersStrip() {
  const partners = ['UNDP', 'UNICEF', 'WFP', 'UN OCHA', 'GIZ', 'FCDO', 'USAID', 'World Bank'];
  return (
    <section style={{ padding: '64px 0', borderTop: '1px solid var(--border-light)' }}>
      <div className="mx-container">
        <p
          style={{
            textAlign: 'center',
            fontSize: 11,
            color: 'var(--ink-faint)',
            fontFamily: 'var(--font-mono)',
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            margin: '0 0 32px',
          }}
        >
          We have worked with
        </p>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '32px 56px',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {partners.map((p) => (
            <span
              key={p}
              style={{
                fontFamily: 'var(--font-display)',
                fontStyle: 'italic',
                fontSize: 22,
                color: 'var(--ink-muted)',
                opacity: 0.55,
              }}
            >
              {p}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA({ locale, tenantKind }: { locale: string; tenantKind: string }) {
  return (
    <section className="mx-section mx-section--teal">
      <div className="mx-container" style={{ textAlign: 'center' }}>
        <p className="mx-eyebrow" style={{ justifyContent: 'center', display: 'inline-flex' }}>
          Working with MERLx
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
            maxWidth: '20ch',
            textWrap: 'balance',
          }}
        >
          Bring us in <em style={emItalicStyle('var(--teal-light)')}>early</em>.
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
          A pilot, a hosted Optics Suite deployment, an evaluation, or short advisory work — send us
          a brief and we will route it to the right team within two working days.
        </p>
        <div
          style={{ display: 'inline-flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}
        >
          <Link href={`/${locale}/contact`} className="mx-btn mx-btn--inverse mx-btn--lg">
            Start a conversation →
          </Link>
          <Link
            href={`/${locale}/publications`}
            className="mx-btn mx-btn--outline-light mx-btn--lg"
          >
            Browse publications
          </Link>
        </div>
        {tenantKind !== 'group' ? (
          <p
            style={{
              marginTop: 32,
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              color: 'rgba(245,243,238,0.55)',
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
            }}
          >
            Tenant: {tenantKind}
          </p>
        ) : null}
      </div>
    </section>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul
      style={{
        listStyle: 'none',
        padding: 0,
        margin: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}
    >
      {items.map((item) => (
        <li
          key={item}
          style={{
            fontSize: 12,
            color: 'var(--ink)',
            display: 'flex',
            gap: 10,
            lineHeight: 1.55,
          }}
        >
          <span
            aria-hidden="true"
            style={{
              fontFamily: 'var(--font-mono)',
              color: 'var(--ink-faint)',
              fontSize: 10,
              paddingTop: 2,
            }}
          >
            ·
          </span>
          {item}
        </li>
      ))}
    </ul>
  );
}

const gridTwoCol: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
  gap: 24,
  alignItems: 'stretch',
};

const frontDoorCardStyle: CSSProperties = {
  display: 'grid',
  gridTemplateRows: 'auto 1fr',
  gap: 32,
  background: 'var(--surface)',
  border: '1px solid var(--border-light)',
  borderRadius: 'var(--radius-md)',
  padding: 40,
};

const frontDoorHeaderStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
};

const frontDoorPreviewStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'flex-start',
};

const cardHeadingStyle: CSSProperties = {
  fontFamily: 'var(--font-sans)',
  fontWeight: 600,
  fontSize: 'clamp(28px, 3vw, 36px)',
  lineHeight: 1.1,
  letterSpacing: '-0.6px',
  margin: '12px 0 16px',
  color: 'var(--ink)',
  textWrap: 'balance',
  maxWidth: '18ch',
};

const cardLeadStyle: CSSProperties = {
  fontSize: 14,
  lineHeight: 1.6,
  color: 'var(--ink-muted)',
  margin: '0 0 20px',
  maxWidth: '46ch',
};

const accentLabel = (color: string): CSSProperties => ({
  fontFamily: 'var(--font-mono)',
  fontSize: 10,
  letterSpacing: '1.5px',
  color,
  textTransform: 'uppercase',
});

const emItalicStyle = (color: string): CSSProperties => ({
  fontFamily: 'var(--font-display)',
  fontStyle: 'italic',
  fontWeight: 400,
  color,
});
