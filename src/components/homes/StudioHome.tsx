import { StudioPreview } from '@/components/dashboards/StudioPreview';
import Link from 'next/link';
import type { CSSProperties } from 'react';

interface StudioHomeProps {
  locale: string;
}

const PRODUCTS = [
  {
    code: 'I',
    name: 'IRIS',
    accent: 'var(--iris)',
    d: 'Information-risk intelligence. Hate speech, disinformation and violent-extremism narrative monitoring across social media.',
  },
  {
    code: 'A',
    name: 'Aperture',
    accent: 'var(--deep-teal)',
    d: 'Satellite analysis for non-specialists. Click a location, set a date range, get an environmental and situational read.',
  },
  {
    code: 'P',
    name: 'PRISM',
    accent: 'var(--ember)',
    d: 'Compound-risk platform. Conflict, socioeconomic, environmental, health and coping-capacity data on a single spatial grid.',
  },
  {
    code: 'T',
    name: 'ToC Tester',
    accent: 'var(--deep-iris)',
    d: "Theory of Change as a simulation. Causal map + AI critic anchored in your project's own evidence corpus.",
  },
  {
    code: 'O',
    name: 'OASIS',
    accent: 'var(--sand-dark)',
    d: 'Geospatial infrastructure for post-conflict recovery planning. Where to go first, ranked.',
  },
  {
    code: 'E',
    name: 'ECHO',
    accent: 'var(--deep-teal)',
    d: 'Offline-first AI for field interviews. On-device transcription and follow-up probes. No cloud call required.',
  },
];

export function StudioHome({ locale }: StudioHomeProps) {
  return (
    <>
      <Hero locale={locale} />
      <PartnersStrip />
      <ProductsTeaser locale={locale} />
      <LocalisationStrip />
      <MethodologyStrip />
      <FinalCTA locale={locale} />
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
            <p className="mx-eyebrow">MERLx Studio</p>
            <h1 className="mx-h1-display">
              A partner for <em>tech-enabled global development</em>.
            </h1>
            <p className="mx-lead" style={{ marginTop: 32, maxWidth: '46ch' }}>
              MERLx is an independent studio building analytical tools and infrastructure for
              humanitarian, peacebuilding and conflict-prevention organisations. Our work helps
              teams read context faster, adapt programming earlier, and ground decisions in real
              evidence. AI augments the analysts, evaluators and programme staff who already do this
              work. It does not replace their judgement.
            </p>
            <div style={{ display: 'flex', gap: 12, marginTop: 36, flexWrap: 'wrap' }}>
              <Link href={`/${locale}/optics`} className="mx-btn mx-btn--primary mx-btn--lg">
                See the Optics Suite →
              </Link>
              <Link href={`/${locale}/engage`} className="mx-btn mx-btn--ghost mx-btn--lg">
                How to engage
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
              We have worked with UNDP, UNICEF, WFP, OCHA, GIZ and FCDO
            </p>
          </div>
          <StudioPreview />
        </div>
      </div>
    </section>
  );
}

function PartnersStrip() {
  const partners = ['UNDP', 'UNICEF', 'WFP', 'UN OCHA', 'GIZ', 'USAID', 'UNHCR', 'World Bank'];
  return (
    <section style={{ padding: '40px 0 80px', borderTop: '1px solid var(--border-light)' }}>
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

function ProductsTeaser({ locale }: { locale: string }) {
  return (
    <section className="mx-section">
      <div className="mx-container">
        <div className="mx-intro">
          <div>
            <p className="mx-eyebrow">The Optics Suite</p>
            <h2 className="mx-h2-section">
              Six tools, <em>one practice</em>.
            </h2>
          </div>
          <p className="mx-lead">
            Built for analysts. Each tool is small, opinionated, and interoperable with the data
            systems your programme already runs.
          </p>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 16,
          }}
        >
          {PRODUCTS.map((p) => (
            <Link
              key={p.code}
              href={`/${locale}/optics/${p.name.toLowerCase().replace(/\s/g, '-')}`}
              className="mx-card"
              style={productCardStyle}
            >
              <div
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
              >
                <span
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 'var(--radius-sm)',
                    background: 'transparent',
                    border: `1px solid ${p.accent}`,
                    color: p.accent,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'var(--font-display)',
                    fontStyle: 'italic',
                    fontSize: 18,
                  }}
                >
                  {p.code}
                </span>
                <span aria-hidden="true" style={{ fontSize: 18, color: 'var(--ink-muted)' }}>
                  ↗
                </span>
              </div>
              <div>
                <h3
                  style={{
                    fontSize: 20,
                    fontWeight: 600,
                    margin: '16px 0 8px',
                    letterSpacing: '-0.3px',
                  }}
                >
                  {p.name}
                </h3>
                <p style={{ fontSize: 13, lineHeight: 1.55, color: 'var(--ink-muted)', margin: 0 }}>
                  {p.d}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function LocalisationStrip() {
  const items = [
    {
      label: 'Languages',
      title: 'Multilingual by default.',
      body: 'IRIS classifiers run in Arabic, Somali, Swahili, Amharic, Oromo, Tigrinya, Kinyarwanda and English, with new languages added as Network nodes need them. ECHO transcribes interviews on-device in the same set.',
    },
    {
      label: 'Infrastructure',
      title: 'Built for the field, not the demo.',
      body: 'Low bandwidth, captive portals, power that cuts out. Inference runs on standard CPUs; ECHO runs entirely on the phone. Tools work for a country-office analyst on a modest laptop, not just at a head-office desk.',
    },
    {
      label: 'Governance',
      title: 'Local control, audited everywhere.',
      body: 'Clients own their data and their instance. Data residency is set by the client. Network nodes own evaluation findings. Studio does not interfere; the cooperative does the analytical work.',
    },
  ];

  return (
    <section className="mx-section mx-section--shell-warm">
      <div className="mx-container">
        <div className="mx-intro">
          <div>
            <p className="mx-eyebrow">Localisation</p>
            <h2 className="mx-h2-section">
              Real adaptive programming runs <em>in country</em>, not from headquarters.
            </h2>
          </div>
          <p className="mx-lead">
            Localisation is not a translation step at the end. It is built into the language stack,
            the infrastructure choices and the governance of every engagement. The tools are
            designed so the people closest to the work can run them.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 0,
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            background: 'var(--surface)',
          }}
        >
          {items.map((item, i) => (
            <div
              key={item.label}
              style={{
                padding: 32,
                borderRight: i < items.length - 1 ? '1px solid var(--border-light)' : 'none',
              }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10,
                  letterSpacing: '1.5px',
                  color: 'var(--iris)',
                  textTransform: 'uppercase',
                  margin: '0 0 16px',
                }}
              >
                {item.label}
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
                {item.title}
              </h3>
              <p style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--ink-muted)', margin: 0 }}>
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function MethodologyStrip() {
  const steps = [
    { n: '01', t: 'Frame', d: 'Co-design ToC, indicator scoping, stakeholder map.' },
    { n: '02', t: 'Instrument', d: 'Field instruments, integrations, baseline.' },
    { n: '03', t: 'Analyse', d: 'Continuous monitoring, mid-line, course correction.' },
    { n: '04', t: 'Decide', d: 'Decision briefs, donor reports, end-line.' },
  ];

  return (
    <section className="mx-section">
      <div className="mx-container">
        <div className="mx-intro">
          <div>
            <p className="mx-eyebrow">How a Studio engagement runs</p>
            <h2 className="mx-h2-section">
              Frame, instrument, analyse, <em>decide</em>.
            </h2>
          </div>
          <p className="mx-lead">
            Studio engagements run alongside the programme. Findings ship continuously, not as a
            single end-line report. Tools amplify the practice; they do not replace it.
          </p>
        </div>
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
          {steps.map((s, i) => (
            <div
              key={s.n}
              style={{
                padding: 32,
                borderRight: i < steps.length - 1 ? '1px solid var(--border-light)' : 'none',
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
                {s.n}
              </p>
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontStyle: 'italic',
                  fontWeight: 400,
                  fontSize: 28,
                  margin: '0 0 12px',
                  letterSpacing: '-0.4px',
                  color: 'var(--ink)',
                }}
              >
                {s.t}
              </h3>
              <p style={{ fontSize: 13, lineHeight: 1.55, color: 'var(--ink-muted)', margin: 0 }}>
                {s.d}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA({ locale }: { locale: string }) {
  return (
    <section className="mx-section mx-section--ink">
      <div className="mx-container" style={{ textAlign: 'center' }}>
        <p className="mx-eyebrow" style={{ justifyContent: 'center', display: 'inline-flex' }}>
          Working with the Studio
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
          Bring us in{' '}
          <em
            style={{
              fontFamily: 'var(--font-display)',
              fontStyle: 'italic',
              fontWeight: 400,
              color: 'var(--teal-light)',
            }}
          >
            early
          </em>
          .
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
          Hosted Optics Suite, a bounded pilot, a build-with engagement, or short advisory? Send a
          brief and we will reply within two working days.
        </p>
        <div
          style={{ display: 'inline-flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}
        >
          <Link href={`/${locale}/contact`} className="mx-btn mx-btn--inverse mx-btn--lg">
            Start a conversation →
          </Link>
          <Link href={`/${locale}/engage`} className="mx-btn mx-btn--outline-light mx-btn--lg">
            How to engage
          </Link>
        </div>
      </div>
    </section>
  );
}

const productCardStyle: CSSProperties = {
  padding: 28,
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
  textDecoration: 'none',
  minHeight: 200,
  cursor: 'pointer',
};
