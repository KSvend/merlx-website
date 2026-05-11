import { PageShell } from '@/components/chrome/PageShell';
import { RichTextRenderer } from '@/components/pages/RichTextRenderer';
import { aboutCopyFor, type AboutCopy } from '@/content/copy/about';
import { findPageBySlug } from '@/lib/cms';
import { parseTenantHeaders, requireKnownTenant } from '@/lib/tenant-aware';
import config from '@/payload.config';
import { setRequestLocale } from 'next-intl/server';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { getPayload } from 'payload';
import type { CSSProperties } from 'react';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function AboutPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const headerList = await headers();
  const { kind } = parseTenantHeaders(headerList);

  const payload = await getPayload({ config });
  const tenant = await requireKnownTenant(headerList, payload);
  const page = await findPageBySlug({ tenant, slug: 'about', locale });

  if (!page) notFound();

  const aboutCopy = aboutCopyFor(locale);
  const heroLine = renderHeroTitle(page.title, page.subtitle, kind, aboutCopy);

  return (
    <PageShell locale={locale} pathname="/about">
      <section className="mx-page-header">
        <div className="mx-container">
          <p className="mx-eyebrow">
            {kind === 'group' ? aboutCopy.hero.eyebrow : `About · ${capitalise(kind)}`}
          </p>
          <h1>{heroLine}</h1>
          <p className="mx-lead" style={{ maxWidth: '56ch' }}>
            {kind === 'group' ? aboutCopy.hero.leadGroup : leadFor(kind)}
          </p>
        </div>
      </section>

      {kind === 'group' ? (
        <>
          <NarrativeSection copy={aboutCopy.narrative} />
          <CompanyHistorySection copy={aboutCopy.history} />
        </>
      ) : (
        <section className="mx-section">
          <div className="mx-container-narrow">
            {page.body ? (
              // biome-ignore lint/suspicious/noExplicitAny: Lexical body shape
              <RichTextRenderer data={page.body as any} />
            ) : (
              <p className="mx-lead">This page is in preparation. Check back shortly.</p>
            )}
          </div>
        </section>
      )}
    </PageShell>
  );
}

function NarrativeSection({ copy }: { copy: AboutCopy['narrative'] }) {
  const accent = (key: keyof AboutCopy['narrative']) =>
    key === 'why' ? 'var(--teal-light)' : key === 'response' ? 'var(--ember)' : 'var(--ink)';
  const shellWarm = (key: keyof AboutCopy['narrative']) => key === 'response';

  const renderSection = (
    section: AboutCopy['narrative']['why'],
    key: keyof AboutCopy['narrative'],
  ) => (
    <section
      key={key}
      className={shellWarm(key) ? 'mx-section mx-section--shell-warm' : 'mx-section'}
    >
      <div className="mx-container-narrow">
        <p className="mx-eyebrow">{section.eyebrow}</p>
        <h2 className="mx-h2-section" style={{ maxWidth: '26ch' }}>
          {section.headlinePrefix}{' '}
          <em style={{ color: accent(key) }}>{section.headlineEm}</em>
          {section.headlineSuffix ?? '.'}
        </h2>
        <div style={proseStyle}>
          {section.paragraphs.map((p, idx) => (
            <p key={idx}>
              {p.strong ? <strong>{p.strong}</strong> : null}
              {p.text}
            </p>
          ))}
        </div>
      </div>
    </section>
  );

  return (
    <>
      {renderSection(copy.why, 'why')}
      {renderSection(copy.response, 'response')}
      {renderSection(copy.holdTo, 'holdTo')}
    </>
  );
}

function CompanyHistorySection({ copy }: { copy: AboutCopy['history'] }) {
  return (
    <section
      style={{
        padding: '64px 0 80px',
        borderTop: '1px solid var(--border-light)',
        background: 'var(--shell)',
      }}
    >
      <div className="mx-container-narrow">
        <p className="mx-eyebrow">{copy.eyebrow}</p>
        <h3 style={historyHeadingStyle}>
          {copy.headlinePrefix} <em style={{ color: 'var(--ember)' }}>{copy.headlineEm}</em>
          {copy.headlineSuffix}
        </h3>
        <p style={historyLeadStyle}>{copy.lead}</p>

        <ol style={timelineStyle}>
          {copy.milestones.map((m) => (
            <li key={`${m.year}-${m.title}`} style={timelineItemStyle}>
              <div style={timelineYearColStyle}>
                <span style={timelineYearStyle}>{m.year}</span>
                <span style={timelineEntityStyle}>{m.entity}</span>
              </div>
              <div style={timelineBodyColStyle}>
                <h4 style={timelineTitleStyle}>{m.title}</h4>
                <p style={timelineProseStyle}>{m.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

const timelineStyle: CSSProperties = {
  listStyle: 'none',
  padding: 0,
  margin: '8px 0 0',
  display: 'flex',
  flexDirection: 'column',
  borderLeft: '1px solid var(--border-light)',
};

const timelineItemStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'minmax(140px, 180px) 1fr',
  gap: 32,
  padding: '24px 0 24px 32px',
  borderBottom: '1px solid var(--border-light)',
  position: 'relative',
};

const timelineYearColStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
};

const timelineYearStyle: CSSProperties = {
  fontFamily: 'var(--font-display)',
  fontStyle: 'italic',
  fontWeight: 400,
  fontSize: 32,
  lineHeight: 1,
  color: 'var(--deep-teal)',
  letterSpacing: '-0.5px',
};

const timelineEntityStyle: CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: 10,
  letterSpacing: '1.5px',
  textTransform: 'uppercase',
  color: 'var(--ink-faint)',
};

const timelineBodyColStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
};

const timelineTitleStyle: CSSProperties = {
  fontFamily: 'var(--font-sans)',
  fontWeight: 600,
  fontSize: 18,
  letterSpacing: '-0.2px',
  color: 'var(--ink)',
  margin: 0,
};

const timelineProseStyle: CSSProperties = {
  fontSize: 14,
  lineHeight: 1.6,
  color: 'var(--ink-muted)',
  margin: 0,
  maxWidth: '64ch',
};

const proseStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 18,
  marginTop: 24,
  fontSize: 16,
  lineHeight: 1.65,
  color: 'var(--ink-light)',
};

const historyHeadingStyle: CSSProperties = {
  fontFamily: 'var(--font-sans)',
  fontWeight: 600,
  fontSize: 22,
  lineHeight: 1.25,
  letterSpacing: '-0.2px',
  color: 'var(--ink)',
  margin: '8px 0 12px',
  maxWidth: '32ch',
};

const historyLeadStyle: CSSProperties = {
  fontSize: 14,
  lineHeight: 1.6,
  color: 'var(--ink-muted)',
  margin: '0 0 28px',
  maxWidth: '64ch',
};

function renderHeroTitle(
  title: string,
  subtitle: string | null | undefined,
  kind: string,
  aboutCopy: AboutCopy,
) {
  const flourish =
    subtitle ?? (kind === 'group' ? aboutCopy.hero.flourishGroup : defaultFlourish(kind));
  return (
    <>
      {title} <em style={{ color: 'var(--teal-light)' }}>{flourish}</em>.
    </>
  );
}

function defaultFlourish(kind: string): string {
  if (kind === 'studio') return 'a partner for tech-enabled global development';
  if (kind === 'network') return 'a cooperative of MERL practices';
  if (kind === 'node') return 'a MERLx Network node';
  return 'the next-generation MERL practice';
}

function leadFor(kind: string): string {
  if (kind === 'studio')
    return 'MERLx is an independent studio building analytical tools and infrastructure for humanitarian, peacebuilding and conflict-prevention organisations. Our work helps teams read context faster, adapt programming earlier, and ground decisions in real evidence. AI augments the analysts, evaluators and programme staff who already do this work. It does not replace their judgement.';
  if (kind === 'network')
    return 'A cooperative of locally owned MERL practices. Each node is autonomous and accountable in country, working under shared methodology and conflict-sensitivity standards.';
  if (kind === 'node')
    return 'A MERLx Network node. Locally owned MERL, working in cooperative under shared methodology and conflict-sensitivity standards.';
  return 'AI-augmented MERL infrastructure for global development and humanitarian aid programmes — anchored locally through in-country partners.';
}

function capitalise(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
