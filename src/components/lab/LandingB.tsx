'use client';

import { LANDING_SCENES, SHARED_HEADER } from '@/content/landing-scenes';
import Link from 'next/link';
import { useState } from 'react';
import type { CSSProperties } from 'react';
import { LearnBackdrop } from './backdrops/LearnBackdrop';
import { NetworkBackdrop } from './backdrops/NetworkBackdrop';
import { StudioBackdrop } from './backdrops/StudioBackdrop';

const BACKDROPS = [StudioBackdrop, NetworkBackdrop, LearnBackdrop] as const;

/**
 * LandingB — three lenses. Three side-by-side panels at 1:1:1 by
 * default; hover any one and it grows to ~2.4:1:1, with the lens
 * inside it revealing copy. The other two dim and contract.
 */
export function LandingB() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <section style={heroSectionStyle}>
      <div className="mx-container" style={{ position: 'relative', zIndex: 2, paddingTop: 64 }}>
        <p className="mx-eyebrow" style={{ color: 'var(--ink-muted)' }}>
          {SHARED_HEADER.eyebrow}
        </p>
        <h1 style={brandHeadlineStyle}>
          <span style={{ color: 'var(--ink)' }}>{SHARED_HEADER.brandPrefix}</span>
          <span style={{ ...brandSuffixStyle, color: 'var(--ink-muted)' }}>· three lenses</span>
        </h1>
        <p className="mx-lead" style={{ marginTop: 24, maxWidth: '60ch' }}>
          MERLx is one practice viewed through three lenses. Hover a lens to focus on it.
        </p>
      </div>

      <div style={lensRowStyle}>
        {LANDING_SCENES.map((scene, i) => {
          const Backdrop = BACKDROPS[i];
          const isActive = active === i;
          const otherActive = active !== null && active !== i;
          return (
            <button
              key={scene.entity}
              type="button"
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              onBlur={() => setActive(null)}
              onClick={() => {
                window.location.href = scene.cta.href;
              }}
              style={{
                ...lensPanelStyle,
                flex: isActive ? 2.6 : otherActive ? 0.7 : 1,
                opacity: otherActive ? 0.55 : 1,
                cursor: 'pointer',
              }}
              aria-label={`${scene.label} — ${scene.headline}`}
            >
              <div style={lensBackdropStyle}>
                <Backdrop active={isActive || active === null} />
                <div style={isActive ? lensVeilActiveStyle : lensVeilDimStyle} />
              </div>

              <div style={lensContentStyle}>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 10,
                    letterSpacing: '1.5px',
                    color: scene.accent,
                    textTransform: 'uppercase',
                  }}
                >
                  {scene.eyebrow}
                </span>

                <h2 style={lensTitleStyle}>
                  <span style={{ color: 'var(--ink)' }}>{SHARED_HEADER.brandPrefix}</span>
                  <span
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontStyle: 'italic',
                      fontWeight: 400,
                      color: scene.accent,
                      marginLeft: 6,
                    }}
                  >
                    {scene.label}
                  </span>
                </h2>

                <div
                  style={{
                    ...lensExpandedStyle,
                    opacity: isActive ? 1 : 0,
                    transform: isActive ? 'translateY(0)' : 'translateY(12px)',
                  }}
                >
                  <p style={lensHeadlineStyle}>
                    {scene.headline}{' '}
                    <em
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontStyle: 'italic',
                        fontWeight: 400,
                        color: scene.accent,
                      }}
                    >
                      {scene.flourish}
                    </em>
                  </p>
                  <p style={lensBodyStyle}>{scene.body}</p>
                  <span
                    style={{
                      ...lensCtaStyle,
                      color: scene.accent,
                      borderColor: scene.accent,
                    }}
                  >
                    {scene.cta.label}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mx-container" style={{ position: 'relative', zIndex: 2 }}>
        <p style={prototypeNoteStyle}>
          Concept B · three lenses ·{' '}
          <Link href="/en/lab" style={prototypeLinkStyle}>
            back to lab
          </Link>
        </p>
      </div>
    </section>
  );
}

const heroSectionStyle: CSSProperties = {
  position: 'relative',
  padding: '0 0 96px',
  minHeight: '90vh',
};

const brandHeadlineStyle: CSSProperties = {
  fontFamily: 'var(--font-sans)',
  fontWeight: 700,
  fontSize: 'clamp(40px, 6vw, 72px)',
  letterSpacing: '-1.6px',
  lineHeight: 1.05,
  margin: '24px 0 0',
};

const brandSuffixStyle: CSSProperties = {
  marginLeft: 16,
  fontFamily: 'var(--font-display)',
  fontStyle: 'italic',
  fontWeight: 400,
};

const lensRowStyle: CSSProperties = {
  display: 'flex',
  width: '100%',
  height: '60vh',
  minHeight: 480,
  marginTop: 56,
};

const lensPanelStyle: CSSProperties = {
  position: 'relative',
  flex: 1,
  background: 'var(--surface)',
  border: 'none',
  padding: 0,
  borderRight: '1px solid var(--border-light)',
  transition:
    'flex 600ms cubic-bezier(0.16, 1, 0.3, 1), opacity 600ms cubic-bezier(0.16, 1, 0.3, 1)',
  overflow: 'hidden',
  textAlign: 'left',
  fontFamily: 'inherit',
};

const lensBackdropStyle: CSSProperties = {
  position: 'absolute',
  inset: 0,
  zIndex: 0,
};

const lensVeilDimStyle: CSSProperties = {
  position: 'absolute',
  inset: 0,
  background: 'linear-gradient(180deg, rgba(245,243,238,0.45) 0%, rgba(245,243,238,0.85) 100%)',
  transition: 'background 600ms cubic-bezier(0.16, 1, 0.3, 1)',
};

const lensVeilActiveStyle: CSSProperties = {
  position: 'absolute',
  inset: 0,
  background:
    'linear-gradient(180deg, rgba(245,243,238,0.2) 0%, rgba(245,243,238,0.78) 70%, var(--shell) 100%)',
  transition: 'background 600ms cubic-bezier(0.16, 1, 0.3, 1)',
};

const lensContentStyle: CSSProperties = {
  position: 'relative',
  zIndex: 1,
  padding: 'clamp(28px, 4vw, 48px)',
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
  height: '100%',
};

const lensTitleStyle: CSSProperties = {
  fontFamily: 'var(--font-sans)',
  fontWeight: 700,
  fontSize: 'clamp(28px, 4vw, 48px)',
  letterSpacing: '-1px',
  margin: '12px 0 0',
  lineHeight: 1.05,
};

const lensExpandedStyle: CSSProperties = {
  marginTop: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
  transition:
    'opacity 480ms cubic-bezier(0.16, 1, 0.3, 1), transform 480ms cubic-bezier(0.16, 1, 0.3, 1)',
};

const lensHeadlineStyle: CSSProperties = {
  fontFamily: 'var(--font-sans)',
  fontWeight: 600,
  fontSize: 22,
  lineHeight: 1.3,
  letterSpacing: '-0.4px',
  color: 'var(--ink)',
  margin: 0,
  maxWidth: '52ch',
};

const lensBodyStyle: CSSProperties = {
  fontSize: 14,
  color: 'var(--ink-light)',
  lineHeight: 1.6,
  margin: 0,
  maxWidth: '52ch',
};

const lensCtaStyle: CSSProperties = {
  alignSelf: 'flex-start',
  fontFamily: 'var(--font-sans)',
  fontWeight: 500,
  fontSize: 13,
  padding: '8px 14px',
  border: '1px solid currentColor',
  borderRadius: 'var(--radius-pill)',
  letterSpacing: '0.04em',
};

const prototypeNoteStyle: CSSProperties = {
  marginTop: 32,
  fontFamily: 'var(--font-mono)',
  fontSize: 10,
  letterSpacing: '1.5px',
  textTransform: 'uppercase',
  color: 'var(--ink-faint)',
};

const prototypeLinkStyle: CSSProperties = {
  color: 'var(--deep-teal)',
  textDecoration: 'underline',
  textDecorationColor: 'var(--deep-teal-dim)',
};
