'use client';

import { LANDING_SCENES, SHARED_HEADER } from '@/content/landing-scenes';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { LearnBackdrop } from './backdrops/LearnBackdrop';
import { NetworkBackdrop } from './backdrops/NetworkBackdrop';
import { StudioBackdrop } from './backdrops/StudioBackdrop';

// Compass positions in degrees (clockwise from 12 o'clock = 0).
const COMPASS_POSITIONS = [0, 120, 240]; // Studio, Network, Learn
const AUTO_CYCLE_MS = 6000;

/**
 * LandingC — compass / dial. A central circular dial, three labels
 * arranged at 12 / 4 / 8 o'clock. Hovering a label rotates the
 * needle to that position with calm easing; the page tints toward
 * the active accent and the body copy rewrites.
 */
export function LandingC() {
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
  const angle = COMPASS_POSITIONS[active] ?? 0;

  return (
    <section style={{ ...heroSectionStyle, background: scene.accentDim }}>
      <div className="mx-container" style={{ position: 'relative', zIndex: 2 }}>
        <p className="mx-eyebrow" style={{ color: scene.accent }}>
          {SHARED_HEADER.eyebrow}
        </p>

        <h1 style={brandHeadlineStyle}>
          <span style={{ color: 'var(--ink)' }}>{SHARED_HEADER.brandPrefix}</span>
        </h1>
        <p style={subTitleStyle}>oriented across three directions</p>

        <div style={layoutStyle}>
          {/* Compass */}
          <div style={compassWrapStyle}>
            <CompassDial
              angle={angle}
              activeIndex={active}
              onPick={pickScene}
              activeColor={scene.accent}
            />
          </div>

          {/* Active scene copy */}
          <div style={copyColStyle}>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                color: scene.accent,
              }}
            >
              {scene.eyebrow}
            </span>

            <h2
              style={{
                ...sceneTitleStyle,
                transition: 'color 480ms cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              MERLx{' '}
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontStyle: 'italic',
                  fontWeight: 400,
                  color: scene.accent,
                }}
              >
                {scene.label}
              </span>
            </h2>

            <p style={sceneHeadlineStyle}>
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

            <p style={sceneBodyStyle}>{scene.body}</p>

            <a
              href={scene.cta.href}
              className="mx-btn mx-btn--primary mx-btn--lg"
              style={{ alignSelf: 'flex-start', marginTop: 16 }}
            >
              {scene.cta.label}
            </a>
          </div>
        </div>

        <p style={prototypeNoteStyle}>
          Concept C · compass ·{' '}
          <Link href="/en/lab" style={prototypeLinkStyle}>
            back to lab
          </Link>
        </p>
      </div>

      {/* Soft backdrop hint per scene, behind everything */}
      <div style={backdropHintStyle}>
        <div style={{ ...backdropFillStyle, opacity: active === 0 ? 0.18 : 0 }}>
          <StudioBackdrop active={active === 0} />
        </div>
        <div style={{ ...backdropFillStyle, opacity: active === 1 ? 0.18 : 0 }}>
          <NetworkBackdrop active={active === 1} />
        </div>
        <div style={{ ...backdropFillStyle, opacity: active === 2 ? 0.18 : 0 }}>
          <LearnBackdrop active={active === 2} />
        </div>
      </div>
    </section>
  );
}

interface CompassDialProps {
  angle: number;
  activeIndex: number;
  activeColor: string;
  onPick: (index: number) => void;
}

function CompassDial({ angle, activeIndex, activeColor, onPick }: CompassDialProps) {
  const size = 460;
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 36;

  // Label positions: convert COMPASS_POSITIONS to (x, y) on a circle
  // slightly outside the dial.
  const labelRadius = r + 24;
  const labelPositions = COMPASS_POSITIONS.map((deg) => {
    const rad = ((deg - 90) * Math.PI) / 180;
    return { x: cx + labelRadius * Math.cos(rad), y: cy + labelRadius * Math.sin(rad), deg };
  });

  // Needle endpoint
  const needleRad = ((angle - 90) * Math.PI) / 180;
  const needleX = cx + (r - 28) * Math.cos(needleRad);
  const needleY = cy + (r - 28) * Math.sin(needleRad);

  return (
    <div style={{ width: size, height: size, position: 'relative' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <title>MERLx compass</title>
        {/* Outer dial */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="var(--surface)"
          stroke="var(--border)"
          strokeWidth="1"
        />
        {/* Inner ring */}
        <circle
          cx={cx}
          cy={cy}
          r={r - 12}
          fill="none"
          stroke="var(--border-light)"
          strokeWidth="1"
        />
        {/* Tick marks every 30deg */}
        {Array.from({ length: 12 }).map((_, i) => {
          const tickAngle = i * 30 - 90;
          const tickRad = (tickAngle * Math.PI) / 180;
          const tickInner = r - 14;
          const tickOuter = r - 4;
          const x1 = cx + tickInner * Math.cos(tickRad);
          const y1 = cy + tickInner * Math.sin(tickRad);
          const x2 = cx + tickOuter * Math.cos(tickRad);
          const y2 = cy + tickOuter * Math.sin(tickRad);
          return (
            <line
              // biome-ignore lint/suspicious/noArrayIndexKey: tick index is the stable identity
              key={`tick-${i}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="var(--border)"
              strokeWidth="1"
            />
          );
        })}

        {/* Needle */}
        <g
          style={{
            transformOrigin: `${cx}px ${cy}px`,
            transform: `rotate(${angle}deg)`,
            transition: 'transform 600ms cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <line
            x1={cx}
            y1={cy + 12}
            x2={cx}
            y2={cy - (r - 32)}
            stroke={activeColor}
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx={cx} cy={cy - (r - 32)} r="6" fill={activeColor} />
        </g>

        {/* Centre cap */}
        <circle cx={cx} cy={cy} r="10" fill="var(--ink)" />
        <circle cx={cx} cy={cy} r="4" fill="var(--shell)" />

        {/* MERLx label centred underneath */}
        <text
          x={cx}
          y={cy + r - 18}
          textAnchor="middle"
          fontFamily="var(--font-mono)"
          fontSize="10"
          letterSpacing="2"
          fill="var(--ink-faint)"
        >
          MERLX · ORIENTED
        </text>
      </svg>

      {/* Position labels — overlaid as buttons */}
      {labelPositions.map((pos, i) => {
        const scene = LANDING_SCENES[i];
        if (!scene) return null;
        const isActive = activeIndex === i;
        return (
          <button
            key={scene.entity}
            type="button"
            onMouseEnter={() => onPick(i)}
            onFocus={() => onPick(i)}
            onClick={() => onPick(i)}
            style={{
              position: 'absolute',
              left: pos.x,
              top: pos.y,
              transform: 'translate(-50%, -50%)',
              padding: '10px 18px',
              borderRadius: 'var(--radius-pill)',
              border: `1px solid ${isActive ? scene.accent : 'var(--border)'}`,
              background: isActive ? scene.accent : 'var(--surface)',
              color: isActive ? 'var(--shell)' : 'var(--ink)',
              fontFamily: 'var(--font-sans)',
              fontWeight: 500,
              fontSize: 14,
              letterSpacing: '0.04em',
              cursor: 'pointer',
              transition: 'all var(--motion-default) var(--easing)',
              whiteSpace: 'nowrap',
            }}
            aria-pressed={isActive ? 'true' : 'false'}
          >
            {scene.label}
          </button>
        );
      })}
    </div>
  );
}

const heroSectionStyle: CSSProperties = {
  position: 'relative',
  padding: '64px 0 96px',
  minHeight: '90vh',
  transition: 'background 600ms cubic-bezier(0.16, 1, 0.3, 1)',
  overflow: 'hidden',
};

const brandHeadlineStyle: CSSProperties = {
  fontFamily: 'var(--font-sans)',
  fontWeight: 700,
  fontSize: 'clamp(56px, 9vw, 120px)',
  letterSpacing: '-2.4px',
  lineHeight: 1,
  margin: '24px 0 8px',
};

const subTitleStyle: CSSProperties = {
  fontFamily: 'var(--font-display)',
  fontStyle: 'italic',
  fontSize: 'clamp(20px, 2.4vw, 28px)',
  color: 'var(--ink-muted)',
  margin: 0,
};

const layoutStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'auto minmax(0, 1fr)',
  gap: 64,
  alignItems: 'center',
  marginTop: 56,
};

const compassWrapStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const copyColStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 14,
};

const sceneTitleStyle: CSSProperties = {
  fontFamily: 'var(--font-sans)',
  fontWeight: 700,
  fontSize: 'clamp(36px, 4.5vw, 56px)',
  letterSpacing: '-1.2px',
  lineHeight: 1.05,
  margin: '8px 0 0',
};

const sceneHeadlineStyle: CSSProperties = {
  fontFamily: 'var(--font-sans)',
  fontWeight: 600,
  fontSize: 'clamp(20px, 2.2vw, 24px)',
  lineHeight: 1.3,
  letterSpacing: '-0.3px',
  color: 'var(--ink)',
  margin: '8px 0 0',
  maxWidth: '52ch',
};

const sceneBodyStyle: CSSProperties = {
  fontSize: 15,
  color: 'var(--ink-light)',
  lineHeight: 1.6,
  margin: 0,
  maxWidth: '52ch',
};

const backdropHintStyle: CSSProperties = {
  position: 'absolute',
  inset: 0,
  zIndex: 0,
  pointerEvents: 'none',
};

const backdropFillStyle: CSSProperties = {
  position: 'absolute',
  inset: 0,
  transition: 'opacity 600ms cubic-bezier(0.16, 1, 0.3, 1)',
};

const prototypeNoteStyle: CSSProperties = {
  marginTop: 56,
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
