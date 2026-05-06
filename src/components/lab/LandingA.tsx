'use client';

import { LANDING_SCENES, SHARED_HEADER } from '@/content/landing-scenes';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { LearnBackdrop } from './backdrops/LearnBackdrop';
import { NetworkBackdrop } from './backdrops/NetworkBackdrop';
import { StudioBackdrop } from './backdrops/StudioBackdrop';

const AUTO_CYCLE_MS = 6000;

/**
 * LandingA — wordmark-roll concept. Three pills below the headline
 * roll the suffix word in a vertical slot. Body, bullets and
 * backdrop cross-fade. Auto-cycles every 6s until first hover.
 */
export function LandingA() {
  const [active, setActive] = useState(0);
  const [interacted, setInteracted] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (interacted) return;
    timerRef.current = setInterval(() => {
      setActive((prev) => (prev + 1) % LANDING_SCENES.length);
    }, AUTO_CYCLE_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [interacted]);

  function pickScene(index: number) {
    setActive(index);
    setInteracted(true);
  }

  const scene = LANDING_SCENES[active] ?? LANDING_SCENES[0];
  if (!scene) return null;

  return (
    <section style={heroSectionStyle}>
      {/* Layered backdrops, cross-fade between them */}
      <div style={backdropLayerStyle}>
        <div style={{ ...backdropFillStyle, opacity: active === 0 ? 1 : 0 }}>
          <StudioBackdrop active={active === 0} />
        </div>
        <div style={{ ...backdropFillStyle, opacity: active === 1 ? 1 : 0 }}>
          <NetworkBackdrop active={active === 1} />
        </div>
        <div style={{ ...backdropFillStyle, opacity: active === 2 ? 1 : 0 }}>
          <LearnBackdrop active={active === 2} />
        </div>
        <div style={backdropVeilStyle} />
      </div>

      <div className="mx-container" style={{ position: 'relative', zIndex: 2 }}>
        <p className="mx-eyebrow" style={{ color: scene.accent }}>
          {SHARED_HEADER.eyebrow}
        </p>

        <h1 style={brandHeadlineStyle}>
          <span style={brandFixedStyle}>{SHARED_HEADER.brandPrefix}</span>
          <span style={brandSlotWrapStyle} aria-live="polite">
            <span
              style={{
                ...brandSlotInnerStyle,
                transform: `translateY(-${active * 100}%)`,
              }}
            >
              {LANDING_SCENES.map((s) => (
                <span key={s.entity} style={{ ...brandSlotItemStyle, color: s.accent }}>
                  {s.label}
                </span>
              ))}
            </span>
          </span>
        </h1>

        {/* Body + flourish, cross-faded */}
        <div style={bodyWrapStyle}>
          {LANDING_SCENES.map((s, i) => (
            <div
              key={s.entity}
              style={{
                ...bodyLayerStyle,
                opacity: active === i ? 1 : 0,
                transform: active === i ? 'translateY(0)' : 'translateY(8px)',
                pointerEvents: active === i ? 'auto' : 'none',
              }}
              aria-hidden={active === i ? undefined : true}
            >
              <h2 style={subHeadlineStyle}>
                {s.headline}{' '}
                <em
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontStyle: 'italic',
                    fontWeight: 400,
                    color: s.accent,
                  }}
                >
                  {s.flourish}
                </em>
              </h2>
              <p className="mx-lead" style={{ marginTop: 24, maxWidth: '60ch' }}>
                {s.body}
              </p>
              <ul style={bulletListStyle}>
                {s.bullets.map((b) => (
                  <li key={b} style={bulletItemStyle}>
                    <span
                      aria-hidden="true"
                      style={{ color: s.accent, fontFamily: 'var(--font-mono)' }}
                    >
                      ·
                    </span>
                    {b}
                  </li>
                ))}
              </ul>
              <div style={{ display: 'flex', gap: 12, marginTop: 32, flexWrap: 'wrap' }}>
                <a href={s.cta.href} className="mx-btn mx-btn--primary mx-btn--lg">
                  {s.cta.label}
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Pills */}
        <div style={pillRowStyle}>
          {LANDING_SCENES.map((s, i) => (
            <button
              key={s.entity}
              type="button"
              onMouseEnter={() => pickScene(i)}
              onFocus={() => pickScene(i)}
              onClick={() => pickScene(i)}
              style={{
                ...pillStyle,
                background: active === i ? s.accent : 'transparent',
                color: active === i ? 'var(--shell)' : 'var(--ink)',
                borderColor: active === i ? s.accent : 'var(--border)',
              }}
              aria-pressed={active === i ? 'true' : 'false'}
            >
              {s.label}
            </button>
          ))}
          {!interacted ? <span style={cycleHintStyle}>Auto-cycling · hover to pause</span> : null}
        </div>

        <p style={prototypeNoteStyle}>
          Concept A · wordmark roll ·{' '}
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
  padding: '72px 0 96px',
  minHeight: '90vh',
  overflow: 'hidden',
};

const backdropLayerStyle: CSSProperties = {
  position: 'absolute',
  inset: 0,
  zIndex: 0,
};

const backdropFillStyle: CSSProperties = {
  position: 'absolute',
  inset: 0,
  transition: 'opacity 600ms cubic-bezier(0.16, 1, 0.3, 1)',
};

const backdropVeilStyle: CSSProperties = {
  position: 'absolute',
  inset: 0,
  background:
    'linear-gradient(180deg, rgba(245,243,238,0.6) 0%, rgba(245,243,238,0.85) 50%, var(--shell) 100%)',
};

const brandHeadlineStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'baseline',
  gap: 18,
  fontFamily: 'var(--font-sans)',
  fontWeight: 700,
  fontSize: 'clamp(56px, 9vw, 120px)',
  letterSpacing: '-2.4px',
  lineHeight: 1,
  margin: '32px 0 0',
};

const brandFixedStyle: CSSProperties = {
  color: 'var(--ink)',
};

const brandSlotWrapStyle: CSSProperties = {
  display: 'inline-block',
  position: 'relative',
  overflow: 'hidden',
  height: '1.05em',
  verticalAlign: 'baseline',
};

const brandSlotInnerStyle: CSSProperties = {
  display: 'block',
  transition: 'transform 480ms cubic-bezier(0.16, 1, 0.3, 1)',
};

const brandSlotItemStyle: CSSProperties = {
  display: 'block',
  height: '1.05em',
  lineHeight: 1,
  fontFamily: 'var(--font-display)',
  fontStyle: 'italic',
  fontWeight: 400,
  letterSpacing: '-2.4px',
};

const bodyWrapStyle: CSSProperties = {
  position: 'relative',
  marginTop: 28,
  minHeight: 320,
};

const bodyLayerStyle: CSSProperties = {
  position: 'absolute',
  inset: 0,
  transition:
    'opacity 480ms cubic-bezier(0.16, 1, 0.3, 1), transform 480ms cubic-bezier(0.16, 1, 0.3, 1)',
};

const subHeadlineStyle: CSSProperties = {
  fontFamily: 'var(--font-sans)',
  fontWeight: 600,
  fontSize: 'clamp(20px, 2.2vw, 26px)',
  lineHeight: 1.3,
  letterSpacing: '-0.4px',
  color: 'var(--ink)',
  margin: 0,
  maxWidth: '64ch',
};

const bulletListStyle: CSSProperties = {
  listStyle: 'none',
  padding: 0,
  margin: '20px 0 0',
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  maxWidth: '64ch',
};

const bulletItemStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '20px 1fr',
  gap: 8,
  fontSize: 14,
  color: 'var(--ink-light)',
  lineHeight: 1.55,
};

const pillRowStyle: CSSProperties = {
  position: 'absolute',
  bottom: 96,
  left: 'clamp(32px, 4vw, 64px)',
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  zIndex: 3,
  flexWrap: 'wrap',
};

const pillStyle: CSSProperties = {
  padding: '10px 22px',
  borderRadius: 'var(--radius-pill)',
  fontFamily: 'var(--font-sans)',
  fontWeight: 500,
  fontSize: 14,
  letterSpacing: '0.04em',
  cursor: 'pointer',
  border: '1px solid var(--border)',
  transition: 'all var(--motion-default) var(--easing)',
  background: 'transparent',
};

const cycleHintStyle: CSSProperties = {
  marginLeft: 8,
  fontFamily: 'var(--font-mono)',
  fontSize: 10,
  color: 'var(--ink-faint)',
  letterSpacing: '1.5px',
  textTransform: 'uppercase',
};

const prototypeNoteStyle: CSSProperties = {
  position: 'absolute',
  bottom: 32,
  left: 'clamp(32px, 4vw, 64px)',
  fontFamily: 'var(--font-mono)',
  fontSize: 10,
  letterSpacing: '1.5px',
  textTransform: 'uppercase',
  color: 'var(--ink-faint)',
  margin: 0,
};

const prototypeLinkStyle: CSSProperties = {
  color: 'var(--deep-teal)',
  textDecoration: 'underline',
  textDecorationColor: 'var(--deep-teal-dim)',
};
