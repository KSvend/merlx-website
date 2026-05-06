import { PageShell } from '@/components/chrome/PageShell';
import { OPTICS_ACCENT_BY_SLUG, OPTICS_TOOL_PROFILES } from '@/content/optics-tool-profiles';
import { findOpticsToolBySlug } from '@/lib/cms';
import { requireKnownTenant } from '@/lib/tenant-aware';
import config from '@/payload.config';
import { setRequestLocale } from 'next-intl/server';
import { headers } from 'next/headers';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPayload } from 'payload';
import type { CSSProperties } from 'react';

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

const STATUS_LABEL: Record<string, string> = {
  live: '● LIVE',
  beta: '◐ BETA',
  'coming-soon': '○ COMING SOON',
};

export default async function OpticsToolPage({ params }: PageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const headerList = await headers();
  const payload = await getPayload({ config });
  const tenant = await requireKnownTenant(headerList, payload);
  const tool = await findOpticsToolBySlug({ tenant, slug, locale });
  const profile = OPTICS_TOOL_PROFILES[slug];

  if (!tool && !profile) notFound();

  // Authoritative copy comes from the company-profile profile; the
  // Payload doc supplies status, an editorial override of name/tagline,
  // and any external-deployment URL.
  const accent = OPTICS_ACCENT_BY_SLUG[slug] ?? 'var(--ink-muted)';
  const name = tool?.name ?? slug.toUpperCase();
  const longName = profile?.longName ?? '';
  const tagline = profile?.tagline ?? tool?.tagline ?? '';
  const summary = profile?.summary ?? tool?.tagline ?? '';
  const status = tool?.status ?? 'beta';
  const externalUrl = tool?.externalUrl ?? null;

  return (
    <PageShell locale={locale} pathname={`/optics/${slug}`}>
      {/* Header strip */}
      <section className="mx-section">
        <div className="mx-container">
          <div style={headerRowStyle}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 'var(--radius-sm)',
                background: 'transparent',
                color: accent,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--font-display)',
                fontStyle: 'italic',
                fontSize: 30,
                letterSpacing: '-0.6px',
                border: `1px solid ${accent}`,
              }}
            >
              {profile?.letter ?? name.charAt(0)}
            </div>
            <div style={{ flex: 1 }}>
              <h2 style={toolNameStyle}>{name}</h2>
              {longName ? <p style={longNameStyle}>{longName}</p> : null}
            </div>
            <span style={{ ...statusPillStyle, color: accent, borderColor: accent }}>
              {STATUS_LABEL[status] ?? status.toUpperCase()}
            </span>
          </div>

          <p style={taglineStyle}>{tagline}</p>
          <p style={summaryStyle}>{summary}</p>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 32 }}>
            {externalUrl ? (
              <a
                href={externalUrl}
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

          {/* Screenshots */}
          {profile?.screenshots && profile.screenshots.length > 0 ? (
            <ScreenshotGrid screenshots={profile.screenshots} altPrefix={name} />
          ) : null}
        </div>
      </section>

      {/* Capabilities */}
      {profile?.capabilities && profile.capabilities.length > 0 ? (
        <section className="mx-section mx-section--shell-warm">
          <div className="mx-container">
            <div style={capsLayoutStyle}>
              <div>
                <p className="mx-eyebrow">Capabilities</p>
                <h2 className="mx-h2-section" style={{ margin: '8px 0 16px' }}>
                  What it <em>does</em>.
                </h2>
                <p style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--ink-muted)', margin: 0 }}>
                  Capabilities listed here are present in the current build. Performance figures,
                  model cards and annotation protocols available under NDA.
                </p>
              </div>
              <ul style={capsListStyle}>
                {profile.capabilities.map((c) => (
                  <li key={c} style={capsItemStyle}>
                    <span style={{ color: accent, fontFamily: 'var(--font-mono)' }}>·</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      ) : null}

      {/* Built on + note */}
      {profile?.builtOn && profile.builtOn.length > 0 ? (
        <section className="mx-section">
          <div className="mx-container">
            <div style={builtOnRowStyle}>
              <span style={builtOnLabelStyle}>Built on</span>
              <div style={builtOnListStyle}>
                {profile.builtOn.map((b, i, arr) => (
                  <span key={b} style={builtOnItemStyle}>
                    {b}
                    {i < arr.length - 1 ? <span style={builtOnDotStyle}>·</span> : null}
                  </span>
                ))}
              </div>
            </div>
            {profile.note ? <p style={builtOnNoteStyle}>{profile.note}</p> : null}
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

interface ScreenshotGridProps {
  screenshots: { src: string; caption: string; width?: 'wide' | 'half' }[];
  altPrefix: string;
}

function ScreenshotGrid({ screenshots, altPrefix }: ScreenshotGridProps) {
  // If any screenshot is wide, render single-column. Otherwise pair them.
  const hasWide = screenshots.some((s) => s.width === 'wide' || !s.width);
  const gridStyle: CSSProperties = hasWide
    ? { display: 'grid', gridTemplateColumns: '1fr', gap: 24 }
    : { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 };

  return (
    <div style={gridStyle}>
      {screenshots.map((s, i) => (
        <figure
          key={s.src}
          style={{
            margin: 0,
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            background: 'var(--surface)',
          }}
        >
          <Image
            src={s.src}
            alt={`${altPrefix} screenshot ${i + 1}: ${s.caption}`}
            width={1240}
            height={720}
            sizes="(max-width: 768px) 100vw, 600px"
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
          <figcaption style={captionStyle}>{s.caption}</figcaption>
        </figure>
      ))}
    </div>
  );
}

const headerRowStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 16,
  marginBottom: 32,
  paddingBottom: 20,
  borderBottom: '1px solid var(--border-light)',
};

const toolNameStyle: CSSProperties = {
  fontFamily: 'var(--font-sans)',
  fontWeight: 700,
  fontSize: 30,
  letterSpacing: '-0.4px',
  margin: 0,
  color: 'var(--ink)',
};

const longNameStyle: CSSProperties = {
  fontFamily: 'var(--font-display)',
  fontStyle: 'italic',
  fontWeight: 400,
  fontSize: 16,
  color: 'var(--ink-muted)',
  margin: '4px 0 0',
};

const statusPillStyle: CSSProperties = {
  padding: '6px 12px',
  borderRadius: 'var(--radius-pill)',
  fontFamily: 'var(--font-mono)',
  fontSize: 10,
  letterSpacing: '1px',
  border: '1px solid currentColor',
  background: 'transparent',
  whiteSpace: 'nowrap',
};

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

const summaryStyle: CSSProperties = {
  fontSize: 17,
  lineHeight: 1.55,
  color: 'var(--ink-light)',
  margin: '0 0 32px',
  maxWidth: '64ch',
};

const captionStyle: CSSProperties = {
  padding: '12px 16px',
  borderTop: '1px solid var(--border-light)',
  fontFamily: 'var(--font-mono)',
  fontSize: 11,
  color: 'var(--ink-muted)',
  letterSpacing: '0.5px',
  background: 'var(--shell-cool)',
};

const capsLayoutStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 2fr)',
  gap: 64,
  alignItems: 'start',
};

const capsListStyle: CSSProperties = {
  listStyle: 'none',
  padding: 0,
  margin: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
};

const capsItemStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '20px 1fr',
  gap: 12,
  fontSize: 15,
  lineHeight: 1.55,
  color: 'var(--ink)',
};

const builtOnRowStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '180px 1fr',
  gap: 32,
  padding: '32px 0',
  borderTop: '1px solid var(--border-light)',
  borderBottom: '1px solid var(--border-light)',
  alignItems: 'baseline',
};

const builtOnLabelStyle: CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: 10,
  letterSpacing: '1.5px',
  color: 'var(--ink-faint)',
  textTransform: 'uppercase',
};

const builtOnListStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '8px 0',
};

const builtOnItemStyle: CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: 13,
  color: 'var(--ink)',
  display: 'inline-flex',
  alignItems: 'center',
};

const builtOnDotStyle: CSSProperties = {
  color: 'var(--ink-faint)',
  marginLeft: 16,
  marginRight: 16,
};

const builtOnNoteStyle: CSSProperties = {
  fontSize: 12,
  lineHeight: 1.6,
  color: 'var(--ink-muted)',
  fontStyle: 'italic',
  marginTop: 24,
  maxWidth: '70ch',
};
