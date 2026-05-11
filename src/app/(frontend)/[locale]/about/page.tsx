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

      {kind === 'group' ? (
        <>
          <NarrativeSection />
          <CompanyHistorySection />
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

function NarrativeSection() {
  return (
    <>
      <section className="mx-section">
        <div className="mx-container-narrow">
          <p className="mx-eyebrow">Why MERLx exists</p>
          <h2 className="mx-h2-section" style={{ maxWidth: '26ch' }}>
            The system is under pressure, and most MERL was{' '}
            <em style={{ color: 'var(--teal-light)' }}>not built for it</em>.
          </h2>
          <div style={proseStyle}>
            <p>
              Humanitarian and development systems are under unprecedented pressure. Donors are
              being asked to deliver more impact, more accountability, and more localisation —
              with less money, more political scrutiny, and rapidly compounding risks. Budgets
              are tightening just as climate shocks, protracted crises, and geopolitical
              fragmentation intensify.
            </p>
            <p>
              In that context, Monitoring, Evaluation, Research and Learning is both critical and
              increasingly misaligned with the challenge. Evaluations arrive too late to inform
              adaptive management. Learning products are stored, not used, and rarely feed
              portfolio-level decisions. Third-Party Monitoring can feel like compliance
              surveillance, rather than a tool for joint problem-solving. Local researchers and
              MERL partners shoulder frontline risk but retain little ownership over data, tools,
              or long-term value. Emerging AI tools are mostly black-box products — hard to
              trust, hard to explain, and rarely designed with fragile contexts in mind.
            </p>
            <p>
              The result is a widening gap between what decision-makers need — timely,
              conflict-sensitive, trusted evidence — and what current MERL systems can
              structurally deliver.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-section mx-section--shell-warm">
        <div className="mx-container-narrow">
          <p className="mx-eyebrow">The MERLx response</p>
          <h2 className="mx-h2-section" style={{ maxWidth: '26ch' }}>
            AI-augmented, <em style={{ color: 'var(--ember)' }}>locally anchored</em> MERL.
          </h2>
          <div style={proseStyle}>
            <p>
              MERLx is being built as an AI-augmented, locally anchored MERL practice for donors,
              multilaterals, INGOs and implementers who want to re-architect evidence
              infrastructure around four moves: real-time analysis and compound-risk insight,
              locally anchored delivery, conflict-sensitive methodology, and operational
              readiness rather than concept notes.
            </p>
            <p>
              We combine analytical infrastructure — the Optics Suite: IRIS, Aperture, PRISM, ToC
              Tester, OASIS, ECHO — with locally anchored research and conflict-sensitive
              methodology. AI is an amplifier for the analysts, evaluators and programme staff
              who already do this work. It does not replace their judgement. AI-augmented
              workflows can reduce qualitative synthesis time by up to 60–75%, freeing expert
              time for interpretation and dialogue rather than manual coding.
            </p>
            <p>
              Localisation is not a translation step at the end. It is built into the language
              stack, the infrastructure choices, and the governance of every engagement. We
              design tools so the people closest to the work can run them, and we anchor delivery
              locally through partner cooperatives who own the analysis under their own
              governance, in their own languages. Findings are owned by the country team.
              Headquarters does not rewrite them.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-section">
        <div className="mx-container-narrow">
          <p className="mx-eyebrow">What we hold to</p>
          <h2 className="mx-h2-section" style={{ maxWidth: '26ch' }}>
            Field first. Evidence over abstraction. Open. Responsible.
          </h2>
          <div style={proseStyle}>
            <p>
              <strong>Field first, not lab first.</strong> Programme reality sets the
              architecture. Low bandwidth, limited infrastructure, non-specialist users, noisy
              data, power that cuts out. Every tool has to work for a programme officer on a
              modest laptop, or an analyst at a shared country-office desk behind a captive
              portal. We design for sustained programme use, not conference demos.
            </p>
            <p>
              <strong>Evidence over abstraction.</strong> Every analytical output is auditable.
              Classifiers show which features drove the call. Narrative reports cite the
              indicators behind them. ToC Tester critique cites its evidence. We support human
              judgement; we don&apos;t replace it.
            </p>
            <p>
              <strong>Open and interoperable.</strong> Open data standards, open satellite
              archives (Sentinel, Landsat, MODIS via Copernicus and Planetary Computer),
              open-source analytical libraries and standard APIs. Clients own their data and
              their instance. Nothing in our core stack is licence-locked.
            </p>
            <p>
              <strong>Responsible by default.</strong> Every engagement runs a data-protection
              impact assessment at inception. We align to IASC operational guidance on data
              responsibility, and to OECD-DAC conflict-sensitivity and Core Humanitarian
              Standard principles. Informed consent, distress-referral and takedown protocols
              are documented per deployment. Classifier outputs affecting named individuals pass
              a human-in-the-loop review before release. PII redaction is on by default. Data
              residency and retention are set by the client.
            </p>
          </div>
        </div>
      </section>
    </>
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
    <section
      style={{
        padding: '64px 0 80px',
        borderTop: '1px solid var(--border-light)',
        background: 'var(--shell)',
      }}
    >
      <div className="mx-container-narrow">
        <p className="mx-eyebrow">Origins</p>
        <h3 style={historyHeadingStyle}>
          A practice running since <em style={{ color: 'var(--ember)' }}>2017</em>, now under
          MERLx, S.L.
        </h3>
        <p style={historyLeadStyle}>
          MERLx, S.L. is a Spain-based MERL consultancy established in 2026 to formalise an
          advisory practice that previously operated under the Slipström name. Same principal,
          same methodology, same partner relationships — under a clearer legal form.
        </p>

        <ol style={timelineStyle}>
          {milestones.map((m) => (
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
  return 'AI-augmented MERL infrastructure for global development and humanitarian aid programmes — anchored locally through in-country partners.';
}

function capitalise(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
