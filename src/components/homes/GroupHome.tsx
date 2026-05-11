import { StudioPreview } from '@/components/dashboards/StudioPreview';
import { homeCopyFor, type HomeCopy } from '@/content/copy/home';
import Link from 'next/link';
import type { CSSProperties } from 'react';

interface GroupHomeProps {
  locale: string;
  tenantKind: string;
}

export function GroupHome({ locale, tenantKind }: GroupHomeProps) {
  const copy = homeCopyFor(locale);
  return (
    <>
      <Hero copy={copy.hero} />
      <DashboardPreviewSection copy={copy.dashboardPreview} />
      <CaseStudiesSection locale={locale} copy={copy.caseStudies} />
      <WhereWeOperateSection copy={copy.whereWeOperate} />
      <PrinciplesSection copy={copy.principles} />
      <PartnersStrip copy={copy.partners} />
      <FinalCTA locale={locale} tenantKind={tenantKind} copy={copy.finalCta} />
    </>
  );
}

function Hero({ copy }: { copy: HomeCopy['hero'] }) {
  return (
    <section style={{ padding: '80px 0 48px' }}>
      <div className="mx-container">
        <p className="mx-eyebrow">{copy.eyebrow}</p>
        <h1 className="mx-h1-display" style={{ maxWidth: '20ch' }}>
          <em style={{ color: 'var(--iris)' }}>{copy.headlineEm}</em> {copy.headlineRest}
        </h1>
        <p className="mx-lead" style={{ marginTop: 32, maxWidth: '60ch' }}>
          {copy.body}
        </p>
      </div>
    </section>
  );
}

function DashboardPreviewSection({ copy }: { copy: HomeCopy['dashboardPreview'] }) {
  return (
    <section className="mx-section mx-section--shell-warm">
      <div className="mx-container">
        <div className="mx-intro">
          <div>
            <p className="mx-eyebrow">{copy.eyebrow}</p>
            <h2 className="mx-h2-section">
              {copy.headlinePrefix} <em>{copy.headlineEm}</em>.
            </h2>
          </div>
          <p className="mx-lead">{copy.body}</p>
        </div>
        <div style={dashboardFrameStyle}>
          <StudioPreview />
        </div>
      </div>
    </section>
  );
}

function CaseStudiesSection({
  locale,
  copy,
}: {
  locale: string;
  copy: HomeCopy['caseStudies'];
}) {
  const [nilex, prism] = copy.cards;
  const cases = [
    {
      ...nilex,
      eyebrowColor: 'var(--deep-teal)',
      href: `/${locale}/nodes/nilex`,
    },
    {
      ...prism,
      eyebrowColor: 'var(--ember)',
      href: `/${locale}/optics/prism`,
    },
  ];

  return (
    <section className="mx-section">
      <div className="mx-container">
        <div className="mx-intro">
          <div>
            <p className="mx-eyebrow">{copy.eyebrow}</p>
            <h2 className="mx-h2-section">
              {copy.headlinePrefix} <em>{copy.headlineEm}</em>
              {copy.headlineSuffix}
            </h2>
          </div>
          <p className="mx-lead">{copy.lead}</p>
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
                {c.cta}
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhereWeOperateSection({ copy }: { copy: HomeCopy['whereWeOperate'] }) {
  return (
    <section className="mx-section">
      <div className="mx-container">
        <div className="mx-intro">
          <div>
            <p className="mx-eyebrow">{copy.eyebrow}</p>
            <h2 className="mx-h2-section">
              {copy.headlinePrefix}{' '}
              <em style={{ color: 'var(--teal-light)' }}>{copy.headlineEm}</em>.
            </h2>
          </div>
          <p className="mx-lead">{copy.lead}</p>
        </div>

        <div style={regionGridStyle}>
          {copy.regions.map((r) => (
            <article key={r.title} style={regionCardStyle}>
              <span className="mx-mono-caption" style={accentLabel('var(--ember)')}>
                {r.label}
              </span>
              <h3 style={regionTitleStyle}>{r.title}</h3>
              <p style={regionBodyStyle}>{r.detail}</p>
            </article>
          ))}
        </div>

        <div style={languagesWrapStyle}>
          <p className="mx-mono-caption" style={{ margin: '0 0 12px', color: 'var(--ink-faint)' }}>
            {copy.languagesLabel}
          </p>
          <div style={languagesRowStyle}>
            {copy.languages.map((lang) => (
              <span key={lang} style={languageChipStyle}>
                {lang}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function PrinciplesSection({ copy }: { copy: HomeCopy['principles'] }) {
  return (
    <section className="mx-section mx-section--shell-warm">
      <div className="mx-container">
        <div className="mx-intro">
          <div>
            <p className="mx-eyebrow">{copy.eyebrow}</p>
            <h2 className="mx-h2-section">
              {copy.headlinePrefix}{' '}
              <em style={{ color: 'var(--teal-light)' }}>{copy.headlineEm}</em>.
            </h2>
          </div>
          <p className="mx-lead">{copy.lead}</p>
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
          {copy.items.map((item, i) => (
            <div
              key={item.n}
              style={{
                padding: 32,
                borderRight: i < copy.items.length - 1 ? '1px solid var(--border-light)' : 'none',
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
                {item.title}
              </h3>
              <p style={{ fontSize: 13, lineHeight: 1.55, color: 'var(--ink-muted)', margin: 0 }}>
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PartnersStrip({ copy }: { copy: HomeCopy['partners'] }) {
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
          {copy.label}
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
          {copy.items.map((p) => (
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

function FinalCTA({
  locale,
  tenantKind,
  copy,
}: {
  locale: string;
  tenantKind: string;
  copy: HomeCopy['finalCta'];
}) {
  return (
    <section className="mx-section mx-section--teal">
      <div className="mx-container" style={{ textAlign: 'center' }}>
        <p className="mx-eyebrow" style={{ justifyContent: 'center', display: 'inline-flex' }}>
          {copy.eyebrow}
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
          {copy.headlinePrefix}{' '}
          <em style={emItalicStyle('var(--teal-light)')}>{copy.headlineEm}</em>.
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
          {copy.body}
        </p>
        <div
          style={{ display: 'inline-flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}
        >
          <Link href={`/${locale}/contact`} className="mx-btn mx-btn--inverse mx-btn--lg">
            {copy.primary}
          </Link>
          <Link
            href={`/${locale}/publications`}
            className="mx-btn mx-btn--outline-light mx-btn--lg"
          >
            {copy.secondary}
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

const regionGridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: 16,
  marginTop: 32,
};

const regionCardStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
  padding: 28,
  background: 'var(--surface)',
  border: '1px solid var(--border-light)',
  borderRadius: 'var(--radius-md)',
};

const regionTitleStyle: CSSProperties = {
  fontFamily: 'var(--font-sans)',
  fontWeight: 600,
  fontSize: 18,
  lineHeight: 1.25,
  letterSpacing: '-0.2px',
  color: 'var(--ink)',
  margin: 0,
};

const regionBodyStyle: CSSProperties = {
  fontSize: 13,
  lineHeight: 1.6,
  color: 'var(--ink-muted)',
  margin: 0,
};

const languagesWrapStyle: CSSProperties = {
  marginTop: 40,
  paddingTop: 32,
  borderTop: '1px solid var(--border-light)',
};

const languagesRowStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 8,
};

const languageChipStyle: CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: 11,
  letterSpacing: '0.5px',
  padding: '6px 12px',
  background: 'var(--shell-warm)',
  border: '1px solid var(--border-light)',
  borderRadius: 'var(--radius-pill, 100px)',
  color: 'var(--ink-muted)',
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
