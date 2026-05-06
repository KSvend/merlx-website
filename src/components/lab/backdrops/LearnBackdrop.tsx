import type { CSSProperties } from 'react';

interface BackdropProps {
  style?: CSSProperties;
  active?: boolean;
}

/**
 * Learn backdrop — a curriculum flow. Two tracks (cooperative-
 * onboarding and advanced-MERL) running across the canvas with
 * module nodes connected by light paths. The two tracks meet at a
 * shared "instructor pool" node in the centre to express the "two
 * tracks, one practice" framing.
 */
export function LearnBackdrop({ style, active = true }: BackdropProps) {
  const trackY1 = 150; // cooperative-onboarding
  const trackY2 = 330; // advanced-merl
  const xs = [120, 280, 440, 600, 760, 880];

  return (
    <svg
      style={{
        width: '100%',
        height: '100%',
        opacity: active ? 1 : 0.25,
        transition: 'opacity 600ms cubic-bezier(0.16, 1, 0.3, 1)',
        ...style,
      }}
      viewBox="0 0 960 480"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="learn-glow" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="var(--iris-dim)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="var(--shell-cool)" />
      <rect width="100%" height="100%" fill="url(#learn-glow)" />

      {/* Track labels */}
      <text
        x="60"
        y={trackY1 - 22}
        fontFamily="var(--font-mono)"
        fontSize="10"
        letterSpacing="1.5"
        fill="var(--ink-faint)"
      >
        COOPERATIVE ONBOARDING
      </text>
      <text
        x="60"
        y={trackY2 - 22}
        fontFamily="var(--font-mono)"
        fontSize="10"
        letterSpacing="1.5"
        fill="var(--ink-faint)"
      >
        ADVANCED MERL
      </text>

      {/* Track lines */}
      <line
        x1={xs[0]}
        y1={trackY1}
        x2={xs[xs.length - 1]}
        y2={trackY1}
        stroke="var(--border)"
        strokeWidth="1"
        strokeDasharray="4 4"
      />
      <line
        x1={xs[0]}
        y1={trackY2}
        x2={xs[xs.length - 1]}
        y2={trackY2}
        stroke="var(--border)"
        strokeWidth="1"
        strokeDasharray="4 4"
      />

      {/* Convergence: dashed lines from the third module on each track to the centre instructor pool */}
      <path
        d={`M ${xs[2]} ${trackY1} Q 480 240 ${xs[3]} ${trackY2}`}
        stroke="var(--iris)"
        strokeWidth="0.8"
        strokeDasharray="2 4"
        fill="none"
        opacity="0.5"
      />
      <path
        d={`M ${xs[2]} ${trackY2} Q 480 240 ${xs[3]} ${trackY1}`}
        stroke="var(--iris)"
        strokeWidth="0.8"
        strokeDasharray="2 4"
        fill="none"
        opacity="0.5"
      />

      {/* Cooperative onboarding modules */}
      {(['MERL fdns', 'Conflict-sens.', 'KII protocol', 'Tool intro', '', ''] as string[]).map(
        (label, i) => {
          if (!label) return null;
          const x = xs[i];
          return (
            // biome-ignore lint/suspicious/noArrayIndexKey: module index is the stable identity
            <g key={`co-${i}`}>
              <circle
                cx={x}
                cy={trackY1}
                r="10"
                fill="var(--surface)"
                stroke="var(--deep-teal)"
                strokeWidth="1.5"
              />
              <circle cx={x} cy={trackY1} r="4" fill="var(--deep-teal)" />
              <text
                x={x}
                y={trackY1 + 30}
                textAnchor="middle"
                fontFamily="var(--font-mono)"
                fontSize="10"
                fill="var(--ink-muted)"
                letterSpacing="0.5"
              >
                {label}
              </text>
            </g>
          );
        },
      )}

      {/* Advanced MERL modules */}
      {(['', '', 'Causal inf.', 'ToC stress-test', 'AI qual coding', 'Capstone'] as string[]).map(
        (label, i) => {
          if (!label) return null;
          const x = xs[i];
          return (
            // biome-ignore lint/suspicious/noArrayIndexKey: module index is the stable identity
            <g key={`am-${i}`}>
              <circle
                cx={x}
                cy={trackY2}
                r="10"
                fill="var(--surface)"
                stroke="var(--ember)"
                strokeWidth="1.5"
              />
              <circle cx={x} cy={trackY2} r="4" fill="var(--ember)" />
              <text
                x={x}
                y={trackY2 + 30}
                textAnchor="middle"
                fontFamily="var(--font-mono)"
                fontSize="10"
                fill="var(--ink-muted)"
                letterSpacing="0.5"
              >
                {label}
              </text>
            </g>
          );
        },
      )}

      {/* Instructor pool node (centre) */}
      <circle
        cx="480"
        cy="240"
        r="24"
        fill="var(--iris-dim)"
        stroke="var(--iris)"
        strokeWidth="1.5"
      >
        <animate attributeName="r" values="22;28;22" dur="3.6s" repeatCount="indefinite" />
      </circle>
      <circle cx="480" cy="240" r="6" fill="var(--iris)" />
      <text
        x="480"
        y="280"
        textAnchor="middle"
        fontFamily="var(--font-mono)"
        fontSize="11"
        letterSpacing="0.5"
        fill="var(--iris-dark)"
      >
        instructor pool
      </text>
    </svg>
  );
}
