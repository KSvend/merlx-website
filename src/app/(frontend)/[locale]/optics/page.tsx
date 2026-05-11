import { PageShell } from '@/components/chrome/PageShell';
import { listOpticsTools } from '@/lib/cms';
import { parseTenantHeaders, requireKnownTenant } from '@/lib/tenant-aware';
import config from '@/payload.config';
import { setRequestLocale } from 'next-intl/server';
import { headers } from 'next/headers';
import Link from 'next/link';
import { getPayload } from 'payload';
import type { CSSProperties } from 'react';

interface PageProps {
  params: Promise<{ locale: string }>;
}

const ACCENT_BY_SLUG: Record<string, string> = {
  iris: 'var(--iris)',
  aperture: 'var(--deep-teal)',
  prism: 'var(--ember)',
  'toc-tester': 'var(--deep-iris)',
  oasis: 'var(--sand-dark)',
  echo: 'var(--deep-teal)',
};

const STATUS_LABEL: Record<string, string> = {
  live: '● LIVE',
  beta: '◐ BETA',
  'coming-soon': '○ COMING SOON',
};

const STATUS_COLOR: Record<string, string> = {
  live: 'var(--deep-teal)',
  beta: 'var(--ember)',
  'coming-soon': 'var(--iris)',
};

export default async function OpticsIndexPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const headerList = await headers();
  const { kind: _kind } = parseTenantHeaders(headerList);
  const payload = await getPayload({ config });
  const tenant = await requireKnownTenant(headerList, payload);
  const tools = await listOpticsTools({ tenant, locale });

  return (
    <PageShell locale={locale} pathname="/optics">
      <section className="mx-page-header">
        <div className="mx-container">
          <p className="mx-eyebrow">The Optics Suite</p>
          <h1>
            Six tools, <em>one practice</em>.
          </h1>
          <p className="mx-lead" style={{ maxWidth: '64ch' }}>
            MERLx's open AI tooling for monitoring, evaluation, research and early warning. Each
            tool is small, opinionated, and built to interoperate with the data systems your
            programme already runs.
          </p>
        </div>
      </section>

      <section
        style={{
          background: 'var(--shell-warm)',
          borderTop: '1px solid var(--border-light)',
          padding: '40px 0',
        }}
      >
        <div className="mx-container">
          <p className="mx-mono-caption" style={{ marginBottom: 14 }}>
            Browse the portfolio · {tools.length} tools
          </p>
          {tools.length === 0 ? (
            <p
              style={{
                fontFamily: 'var(--font-display)',
                fontStyle: 'italic',
                fontSize: 24,
                color: 'var(--ink-muted)',
                margin: 0,
              }}
            >
              The portfolio is being seeded. Reload shortly.
            </p>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: 8,
              }}
            >
              {tools.map((t) => {
                const accent = ACCENT_BY_SLUG[t.slug] ?? 'var(--ink-muted)';
                const letter = t.name.charAt(0).toUpperCase();
                return (
                  <Link
                    key={t.id}
                    href={`/${locale}/optics/${t.slug}`}
                    style={{
                      ...switcherStyle,
                      borderColor: 'var(--border-light)',
                      background: 'transparent',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 'var(--radius-sm)',
                          background: 'transparent',
                          border: `1px solid ${accent}`,
                          color: accent,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontFamily: 'var(--font-display)',
                          fontStyle: 'italic',
                          fontSize: 18,
                          letterSpacing: '-0.5px',
                        }}
                      >
                        {letter}
                      </span>
                      <span
                        style={{
                          fontSize: 15,
                          fontWeight: 600,
                          color: 'var(--ink)',
                          letterSpacing: '-0.2px',
                        }}
                      >
                        {t.name}
                      </span>
                    </div>
                    <p
                      style={{
                        fontSize: 12,
                        color: 'var(--ink-muted)',
                        margin: 0,
                        lineHeight: 1.45,
                      }}
                    >
                      {t.tagline}
                    </p>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 9,
                        letterSpacing: '1px',
                        color: STATUS_COLOR[t.status] ?? 'var(--ink-muted)',
                        marginTop: 'auto',
                      }}
                    >
                      {STATUS_LABEL[t.status] ?? t.status.toUpperCase()}
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section className="mx-section">
        <div className="mx-container">
          <div className="mx-intro">
            <div>
              <p className="mx-eyebrow">Three analytical domains</p>
              <h2 className="mx-h2-section">
                Information, terrain, <em>compound risk</em>.
              </h2>
            </div>
            <p className="mx-lead">
              Optics tools cover three analytical domains. Alongside those, three delivery tools
              turn analysis into programme decisions. When a question needs a bespoke component, we
              build it.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: 24,
            }}
          >
            {DOMAIN_CARDS.map((d) => (
              <article key={d.title} className="mx-card" style={domainCardStyle}>
                <p
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 10,
                    letterSpacing: '1.5px',
                    color: d.accent,
                    margin: 0,
                  }}
                >
                  {d.label}
                </p>
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontStyle: 'italic',
                    fontWeight: 400,
                    fontSize: 28,
                    color: 'var(--ink)',
                    margin: '12px 0 8px',
                    letterSpacing: '-0.4px',
                  }}
                >
                  {d.title}
                </h3>
                <p style={{ fontSize: 13, lineHeight: 1.55, color: 'var(--ink-muted)', margin: 0 }}>
                  {d.description}
                </p>
                <p
                  style={{
                    marginTop: 'auto',
                    paddingTop: 16,
                    borderTop: '1px solid var(--border-light)',
                    fontSize: 12,
                    color: 'var(--ink-muted)',
                    fontFamily: 'var(--font-mono)',
                    letterSpacing: '0.5px',
                  }}
                >
                  {d.tools.join(' · ')}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}

const DOMAIN_CARDS = [
  {
    label: 'INFORMATION',
    title: 'What is the discourse doing?',
    description:
      'Hate speech, disinformation and violent-extremism narratives across social media. Multilingual classifiers and an analyst chat for triage.',
    tools: ['IRIS'],
    accent: 'var(--iris)',
  },
  {
    label: 'TERRAIN',
    title: 'What is changing on the ground?',
    description:
      'Earth observation for non-specialists. NDVI, surface water, settlement expansion, radar backscatter and active fires, abstracted to a click-and-go interface.',
    tools: ['Aperture'],
    accent: 'var(--deep-teal)',
  },
  {
    label: 'COMPOUND RISK',
    title: 'Where is the system tilting?',
    description:
      'Conflict, socioeconomic, environmental, health and coping-capacity data on a single spatial grid, with cell-level forecasts and narrative summaries.',
    tools: ['PRISM'],
    accent: 'var(--ember)',
  },
  {
    label: 'DELIVERY',
    title: 'How do you turn analysis into decisions?',
    description:
      'Theory-of-change simulation, recovery mapping, and on-device KII assistance — the tools that move analytical insight into programme decisions.',
    tools: ['ToC Tester', 'OASIS', 'ECHO'],
    accent: 'var(--sand-dark)',
  },
];

const switcherStyle: CSSProperties = {
  padding: '20px 18px',
  textAlign: 'left',
  background: 'var(--surface)',
  border: '1px solid var(--border-light)',
  borderRadius: 'var(--radius-md)',
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
  textDecoration: 'none',
  minHeight: 130,
  position: 'relative',
};

const domainCardStyle: CSSProperties = {
  padding: 28,
  display: 'flex',
  flexDirection: 'column',
  gap: 0,
  background: 'var(--surface)',
};
