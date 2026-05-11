import { PageShell } from '@/components/chrome/PageShell';
import { RichTextRenderer } from '@/components/pages/RichTextRenderer';
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

  const heroLine = renderHeroTitle(page.title, page.subtitle, kind);

  return (
    <PageShell locale={locale} pathname="/about">
      <section className="mx-page-header">
        <div className="mx-container">
          <p className="mx-eyebrow">About · {kind === 'group' ? 'MERLx' : capitalise(kind)}</p>
          <h1>{heroLine}</h1>
          <p className="mx-lead" style={{ maxWidth: '56ch' }}>
            {leadFor(kind)}
          </p>
        </div>
      </section>

      {kind === 'group' ? <CompanyHistorySection /> : null}

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
    </PageShell>
  );
}

function CompanyHistorySection() {
  const milestones: Array<{
    year: string;
    entity: string;
    title: string;
    body: string;
  }> = [
    {
      year: '2017',
      entity: 'DK · enkeltmandsvirksomhed',
      title: 'Slipström practice begins in Denmark',
      body: 'Independent advisory work begins in Copenhagen as a Danish enkeltmandsvirksomhed under the Slipström name. The early years build the core practice: MERL, conflict analysis, research, and evidence-based advisory for international development and humanitarian partners.',
    },
    {
      year: '2021',
      entity: 'ES · autónoma · Barcelona',
      title: 'Practice relocates to Spain',
      body: 'The principal consultant moves to Spain and registers as an autónoma in Barcelona, continuing under the Slipström name. A growing portfolio across East Africa and the Middle East shapes the practice toward conflict-sensitive MERL and data-enabled evaluation.',
    },
    {
      year: '2024',
      entity: 'NileX · Nairobi',
      title: 'NileX founded as a local-anchor node',
      body: 'The network-building logic crystallizes with the creation of NileX, an independent MERL and data-analytic firm in Nairobi. NileX is designed as a local-anchor node to strengthen conflict-sensitive programme evaluation, research, and early-warning systems across the region.',
    },
    {
      year: '2026',
      entity: 'NileX · Sudan',
      title: 'NileX expands into Sudan',
      body: 'The network expands with the establishment of NileX in Sudan, deepening the practice’s presence in fragile-state contexts and reinforcing capacity for locally anchored, conflict-informed MERL operations across the Nile-region corridor.',
    },
    {
      year: '2026',
      entity: 'MERLx, S.L. · Spain',
      title: 'First formal node in the network',
      body: 'The practice is formalized through the incorporation of MERLx, S.L. in Spain — a limited-liability legal form that carries forward the eight-year track record built under the Slipström name. Same principal, same methodology, same partner relationships. From here on the practice runs as MERLx, S.L., serving as the strategic hub and the first formal node in a broader network with NileX (Nairobi and Sudan).',
    },
  ];

  return (
    <section className="mx-section mx-section--shell-warm">
      <div className="mx-container">
        <div className="mx-intro">
          <div>
            <p className="mx-eyebrow">Organizational history</p>
            <h2 className="mx-h2-section">
              The formal continuation of a practice running since{' '}
              <em style={{ color: 'var(--ember)' }}>2017</em>.
            </h2>
          </div>
          <p className="mx-lead">
            MERLx, S.L. is a Spain-based Monitoring, Evaluation, Research & Learning consultancy
            established in 2026 as the first formal node in a broader advisory network rooted in
            conflict-sensitive MERL and data-enabled evaluation. The underlying practice began in
            2017 through the Slipström brand, initially as a sole-proprietor business in Denmark
            and from 2021 as an autónoma-registered consultancy in Barcelona, building a track
            record across East Africa and the Middle East.
          </p>
        </div>

        <ol style={timelineStyle}>
          {milestones.map((m) => (
            <li key={`${m.year}-${m.title}`} style={timelineItemStyle}>
              <div style={timelineYearColStyle}>
                <span style={timelineYearStyle}>{m.year}</span>
                <span style={timelineEntityStyle}>{m.entity}</span>
              </div>
              <div style={timelineBodyColStyle}>
                <h3 style={timelineTitleStyle}>{m.title}</h3>
                <p style={timelineProseStyle}>{m.body}</p>
              </div>
            </li>
          ))}
        </ol>

        <p style={timelineClosingStyle}>
          MERLx, S.L. is not a start-from-zero entity. It is the formal continuation of a practice
          active since 2017, now structured as the strategic hub of a network anchored locally
          through NileX in Nairobi and Sudan — built for clearer contracting, stronger
          accountability, and conflict-sensitive MERL at scale.
        </p>
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

const timelineClosingStyle: CSSProperties = {
  marginTop: 40,
  paddingTop: 32,
  borderTop: '1px solid var(--border-light)',
  fontFamily: 'var(--font-display)',
  fontStyle: 'italic',
  fontWeight: 400,
  fontSize: 22,
  lineHeight: 1.4,
  color: 'var(--ink)',
  letterSpacing: '-0.3px',
  maxWidth: '60ch',
};

function renderHeroTitle(title: string, subtitle: string | null | undefined, kind: string) {
  const flourish = subtitle ?? defaultFlourish(kind);
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
  return 'MERLx is a Spain-based Monitoring, Evaluation, Research & Learning consultancy delivering advanced data science and tech-enabled MERL for global development and humanitarian aid programmes. We combine AI-augmented analytical infrastructure with locally anchored research and conflict-sensitive methodology, working alongside donors, multilaterals, INGOs and implementers across active conflict and fragile-state contexts.';
}

function capitalise(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
