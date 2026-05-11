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
      <ForAudiencesSection locale={locale} />
      <DashboardPreviewSection />
      <CaseStudiesSection locale={locale} />
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
        <p className="mx-eyebrow">Evidence infrastructure for adaptive programming</p>
        <h1 className="mx-h1-display" style={{ maxWidth: '20ch' }}>
          <em style={{ color: 'var(--iris)' }}>Next-generation MERL</em> for global development and
          humanitarian aid programmes.
        </h1>
        <p className="mx-lead" style={{ marginTop: 32, maxWidth: '60ch' }}>
          MERLx delivers advanced data science and tech-enabled MERL for global development and
          humanitarian aid programmes. AI-augmented analytical tools, locally anchored research and
          conflict-sensitive methodology, built for donors, multilaterals, INGOs and implementers —
          faster context reads, earlier course corrections, decisions grounded in real evidence
          rather than headquarters narrative.
        </p>
      </div>
    </section>
  );
}

function ForAudiencesSection({ locale }: { locale: string }) {
  return (
    <section style={{ padding: '32px 0 96px' }}>
      <div className="mx-container">
        <div style={gridTwoCol}>
          <article style={audienceCardStyle}>
            <span className="mx-mono-caption" style={accentLabel('var(--deep-teal)')}>
              01 · FOR DONORS, MULTILATERALS & INGOs
            </span>
            <h2 style={cardHeadingStyle}>
              MERLx <em style={emItalicStyle('var(--teal-light)')}>Studio</em>
              <br />
              <span style={{ color: 'var(--ink-muted)', fontWeight: 400 }}>
                Scope, instrument, evaluate.
              </span>
            </h2>
            <p style={cardLeadStyle}>
              MERLx delivers AI-augmented MERL infrastructure for international development and
              humanitarian programmes. From scoping to live dashboards to formal evaluation — built
              for accountability, conflict-sensitivity and compound-risk realities.
            </p>
            <BulletList
              items={[
                'AI-augmented analytical infrastructure (Optics Suite)',
                'Conflict-sensitive MERL design, delivery, and evaluation',
                'Live dashboards: indicators, compound risk, narrative monitoring',
                'Auditable outputs — features and signals, not black boxes',
              ]}
            />
            <div style={{ display: 'flex', gap: 12, marginTop: 24, flexWrap: 'wrap' }}>
              <Link href={`/${locale}/contact`} className="mx-btn mx-btn--primary">
                Start a conversation →
              </Link>
              <Link href={`/${locale}/deployments`} className="mx-btn mx-btn--ghost">
                Browse deployments
              </Link>
            </div>
          </article>

          <article style={audienceCardStyle}>
            <span className="mx-mono-caption" style={accentLabel('var(--ember)')}>
              02 · FOR MERL PRACTITIONERS & FIELD TEAMS
            </span>
            <h2 style={cardHeadingStyle}>
              MERLx <em style={emItalicStyle('var(--ember)')}>Network</em>
              <br />
              <span style={{ color: 'var(--ink-muted)', fontWeight: 400 }}>
                Shared methodology, shared tools.
              </span>
            </h2>
            <p style={cardLeadStyle}>
              MERLx works alongside in-country MERL teams, researchers and enumerators. Use the
              Optics Suite as shared analytical infrastructure, train on conflict-sensitivity
              standards, and join a peer-review practice that holds a methodological floor across
              engagements.
            </p>
            <BulletList
              items={[
                'Optics Suite as shared analytical tooling',
                'Conflict-sensitivity training and methodological standards',
                'Peer review across active engagements',
                'Routes to ongoing partnership for established teams',
              ]}
            />
            <div style={{ display: 'flex', gap: 12, marginTop: 24, flexWrap: 'wrap' }}>
              <Link href={`/${locale}/become-a-node`} className="mx-btn mx-btn--primary">
                Become a partner →
              </Link>
              <Link href={`/${locale}/contact`} className="mx-btn mx-btn--ghost">
                Talk to us
              </Link>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

function DashboardPreviewSection() {
  return (
    <section className="mx-section mx-section--shell-warm">
      <div className="mx-container">
        <div className="mx-intro">
          <div>
            <p className="mx-eyebrow">What it looks like in practice</p>
            <h2 className="mx-h2-section">
              A live MERL dashboard, <em>built for the programme team</em>.
            </h2>
          </div>
          <p className="mx-lead">
            INGO programme teams log into MERLx and see compound risk for their portfolio,
            real-time indicator trends, narrative shifts, and forecast confidence — auditable down
            to the underlying signal. No black-box outputs.
          </p>
        </div>
        <div style={dashboardFrameStyle}>
          <StudioPreview />
        </div>
      </div>
    </section>
  );
}

function CaseStudiesSection({ locale }: { locale: string }) {
  const cases = [
    {
      eyebrow: 'ACTIVE · NILEX · SUDAN',
      eyebrowColor: 'var(--deep-teal)',
      title: 'Conflict-sensitive MERL across an active conflict',
      body: 'NileX deploys IRIS, PRISM and conflict-sensitive evaluation across Sudan and the wider Nile basin. Bilingual reporting in Arabic and English. KII research with on-device transcription. Programme teams receive weekly compound-risk briefs.',
      href: `/${locale}/nodes/nilex`,
    },
    {
      eyebrow: 'LIVE · PRISM · HORN OF AFRICA',
      eyebrowColor: 'var(--ember)',
      title: 'Four-month forecast for food insecurity and displacement',
      body: 'PRISM ingests EO data, conflict events and price signals to forecast compound risk across IPC phase 3+ populations. Programme teams use the dashboard for adaptive resource allocation across the Horn of Africa.',
      href: `/${locale}/optics/prism`,
    },
  ];

  return (
    <section className="mx-section">
      <div className="mx-container">
        <div className="mx-intro">
          <div>
            <p className="mx-eyebrow">Case studies</p>
            <h2 className="mx-h2-section">
              Deployed across <em>active conflict and fragile-state contexts</em>.
            </h2>
          </div>
          <p className="mx-lead">
            Real engagements where MERLx infrastructure runs on the ground, with locally anchored
            partners.
          </p>
        </div>
        <div style={caseStudyGridStyle}>
          {cases.map((c) => (
            <article key={c.title} style={caseStudyCardStyle}>
              <span className="mx-mono-caption" style={accentLabel(c.eyebrowColor)}>
                {c.eyebrow}
              </span>
              <h3 style={caseStudyTitleStyle}>{c.title}</h3>
              <p style={caseStudyBodyStyle}>{c.body}</p>
              <Link href={c.href} style={caseStudyLinkStyle}>
                Read case study →
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function PrinciplesSection() {
  const items = [
    {
      n: '01',
      t: 'Field first, not lab first.',
      d: 'Our tools have to work for programme teams in low-bandwidth environments with limited infrastructure, not just at a conference demo.',
    },
    {
      n: '02',
      t: 'Evidence over abstraction.',
      d: 'Analytical outputs are auditable. We can show the features behind a classification, the indicators behind a narrative, the inputs behind a forecast. No black-box outputs.',
    },
    {
      n: '03',
      t: 'Open and interoperable.',
      d: 'Open data standards, open satellite archives, open-source models, standard APIs. Clients own their data and their instance.',
    },
    {
      n: '04',
      t: 'Responsible by default.',
      d: 'Data-protection impact assessment per engagement. IASC data-responsibility guidance, do-no-harm and informed-consent protocols documented. On-device processing wherever viable. Data residency set by the client.',
    },
  ];

  return (
    <section className="mx-section mx-section--shell-warm">
      <div className="mx-container">
        <div className="mx-intro">
          <div>
            <p className="mx-eyebrow">How we work</p>
            <h2 className="mx-h2-section">
              Four commitments, <em style={{ color: 'var(--teal-light)' }}>held on every engagement</em>.
            </h2>
          </div>
          <p className="mx-lead">
            These describe the floor we will not drop below — methodology, conflict-sensitivity,
            data responsibility, and how we handle the tools.
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

const audienceCardStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  background: 'var(--surface)',
  border: '1px solid var(--border-light)',
  borderRadius: 'var(--radius-md)',
  padding: 40,
};

const dashboardFrameStyle: CSSProperties = {
  marginTop: 32,
  background: 'var(--surface)',
  border: '1px solid var(--border-light)',
  borderRadius: 'var(--radius-md)',
  padding: 24,
};

const caseStudyGridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
  gap: 24,
  marginTop: 32,
};

const caseStudyCardStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
  background: 'var(--surface)',
  border: '1px solid var(--border-light)',
  borderRadius: 'var(--radius-md)',
  padding: 32,
};

const caseStudyTitleStyle: CSSProperties = {
  fontFamily: 'var(--font-sans)',
  fontWeight: 600,
  fontSize: 22,
  lineHeight: 1.2,
  letterSpacing: '-0.3px',
  color: 'var(--ink)',
  margin: 0,
  maxWidth: '22ch',
};

const caseStudyBodyStyle: CSSProperties = {
  fontSize: 14,
  lineHeight: 1.6,
  color: 'var(--ink-muted)',
  margin: 0,
  flex: 1,
};

const caseStudyLinkStyle: CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: 11,
  letterSpacing: '0.5px',
  color: 'var(--deep-teal)',
  textDecoration: 'underline',
  textDecorationColor: 'var(--border)',
  textUnderlineOffset: '4px',
  alignSelf: 'flex-start',
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
