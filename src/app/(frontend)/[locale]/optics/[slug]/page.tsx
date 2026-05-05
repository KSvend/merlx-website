import { PageShell } from '@/components/chrome/PageShell';
import { RichTextRenderer } from '@/components/pages/RichTextRenderer';
import { findOpticsToolBySlug } from '@/lib/cms';
import { requireKnownTenant } from '@/lib/tenant-aware';
import config from '@/payload.config';
import { setRequestLocale } from 'next-intl/server';
import { headers } from 'next/headers';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPayload } from 'payload';
import type { CSSProperties } from 'react';

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
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
  live: 'LIVE',
  beta: 'BETA',
  'coming-soon': 'COMING SOON',
};

export default async function OpticsToolPage({ params }: PageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const headerList = await headers();
  const payload = await getPayload({ config });
  const tenant = await requireKnownTenant(headerList, payload);
  const tool = await findOpticsToolBySlug({ tenant, slug, locale });

  if (!tool) notFound();

  const accent = ACCENT_BY_SLUG[tool.slug] ?? 'var(--ink-muted)';
  const letter = tool.name.charAt(0).toUpperCase();

  return (
    <PageShell locale={locale} pathname={`/optics/${slug}`}>
      {/* Header strip */}
      <section className="mx-section">
        <div className="mx-container">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              marginBottom: 32,
              paddingBottom: 20,
              borderBottom: '1px solid var(--border-light)',
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 'var(--radius-sm)',
                background: accent,
                color: 'var(--shell)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--font-display)',
                fontStyle: 'italic',
                fontSize: 30,
                letterSpacing: '-0.6px',
              }}
            >
              {letter}
            </div>
            <div style={{ flex: 1 }}>
              <p
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10,
                  letterSpacing: '1.5px',
                  color: 'var(--ink-faint)',
                  textTransform: 'uppercase',
                  margin: '0 0 4px',
                }}
              >
                MERLx Optics Suite
              </p>
              <h2
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontWeight: 600,
                  fontSize: 28,
                  letterSpacing: '-0.4px',
                  margin: 0,
                  color: 'var(--ink)',
                }}
              >
                {tool.name}
              </h2>
            </div>
            <span
              style={{
                padding: '6px 12px',
                borderRadius: 'var(--radius-pill)',
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                letterSpacing: '1px',
                color: accent,
                border: `1px solid ${accent}`,
                background: 'transparent',
              }}
            >
              {STATUS_LABEL[tool.status] ?? tool.status.toUpperCase()}
            </span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.15fr)',
              gap: 64,
              alignItems: 'start',
            }}
          >
            <div>
              <h3 style={taglineStyle}>{tool.tagline}</h3>
              {tool.summary ? (
                <div style={{ marginBottom: 24 }}>
                  {/* biome-ignore lint/suspicious/noExplicitAny: Lexical body shape */}
                  <RichTextRenderer data={tool.summary as any} />
                </div>
              ) : null}
              <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
                {tool.externalUrl ? (
                  <a
                    href={tool.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mx-btn mx-btn--primary"
                  >
                    Launch tool →
                  </a>
                ) : null}
                <Link href={`/${locale}/contact`} className="mx-btn mx-btn--ghost">
                  Request a demo
                </Link>
              </div>
            </div>

            {tool.screenshots && tool.screenshots.length > 0 ? (
              <div
                className="mx-card"
                style={{ padding: 0, overflow: 'hidden', background: 'var(--surface)' }}
              >
                {tool.screenshots.map((s, i) => (
                  <div
                    key={i.toString()}
                    style={{
                      padding: 24,
                      borderTop: i > 0 ? '1px solid var(--border-light)' : 'none',
                    }}
                  >
                    {s.image ? (
                      // External image URL or media id placeholder
                      <img
                        src={s.image}
                        alt={s.caption ?? `${tool.name} screenshot ${i + 1}`}
                        style={{ width: '100%', borderRadius: 'var(--radius-sm)' }}
                      />
                    ) : null}
                    {s.caption ? (
                      <p className="mx-mono-caption" style={{ marginTop: 12 }}>
                        {s.caption}
                      </p>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : (
              <PreviewPlaceholder name={tool.name} accent={accent} />
            )}
          </div>
        </div>
      </section>

      {/* Description / capabilities body */}
      {tool.description ? (
        <section className="mx-section mx-section--shell-warm">
          <div className="mx-container">
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 2fr',
                gap: 64,
                alignItems: 'start',
              }}
            >
              <div>
                <p className="mx-eyebrow">Capabilities</p>
                <h2 className="mx-h2-section" style={{ margin: '8px 0 24px' }}>
                  What it <em>does</em>.
                </h2>
                <p style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--ink-muted)', margin: 0 }}>
                  Capabilities listed here are present in the current build. Performance figures,
                  model cards and annotation protocols available under NDA.
                </p>
              </div>
              <div className="mx-card" style={{ padding: 32, background: 'var(--surface)' }}>
                {/* biome-ignore lint/suspicious/noExplicitAny: Lexical body shape */}
                <RichTextRenderer data={tool.description as any} />
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <section className="mx-section">
        <div className="mx-container">
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link href={`/${locale}/optics`} className="mx-btn mx-btn--ghost">
              ← All Optics tools
            </Link>
            <Link href={`/${locale}/contact`} className="mx-btn mx-btn--primary">
              Talk to the studio →
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

function PreviewPlaceholder({ name, accent }: { name: string; accent: string }) {
  return (
    <div
      className="mx-card"
      style={{
        padding: 40,
        background: 'var(--surface)',
        minHeight: 320,
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        alignItems: 'flex-start',
        justifyContent: 'center',
      }}
    >
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          letterSpacing: '1.5px',
          color: accent,
          textTransform: 'uppercase',
        }}
      >
        Visual preview
      </span>
      <p
        style={{
          fontFamily: 'var(--font-display)',
          fontStyle: 'italic',
          fontSize: 24,
          color: 'var(--ink-muted)',
          margin: 0,
          lineHeight: 1.4,
        }}
      >
        Screenshots for {name} are being uploaded. Request a live walkthrough via contact.
      </p>
    </div>
  );
}

const taglineStyle: CSSProperties = {
  fontFamily: 'var(--font-display)',
  fontStyle: 'italic',
  fontWeight: 400,
  fontSize: 'clamp(28px, 3.6vw, 40px)',
  lineHeight: 1.2,
  letterSpacing: '-0.5px',
  margin: '0 0 24px',
  textWrap: 'balance',
  color: 'var(--ink)',
};
