import type { CSSProperties } from 'react';

interface BackdropProps {
  style?: CSSProperties;
  active?: boolean;
}

const NODES = [
  { name: 'NileX', cx: 540, cy: 230, status: 'active', color: 'var(--deep-teal)' },
  { name: 'Andes', cx: 230, cy: 360, status: 'onboarding', color: 'var(--iris)' },
  { name: 'Sahel', cx: 430, cy: 270, status: 'onboarding', color: 'var(--iris)' },
  { name: 'MENA', cx: 575, cy: 195, status: 'planned', color: 'var(--ink-faint)' },
];

export function NetworkBackdrop({ style, active = true }: BackdropProps) {
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
        <radialGradient id="network-glow" cx="56%" cy="50%" r="60%">
          <stop offset="0%" stopColor="var(--deep-teal-dim)" stopOpacity="0.3" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="var(--shell-cool)" />
      <rect width="100%" height="100%" fill="url(#network-glow)" />

      {/* Continent silhouettes — abstract */}
      <path
        d="M80 180 L300 140 L400 200 L390 320 L260 350 L120 300 Z"
        fill="var(--shell-warm)"
        stroke="var(--border)"
        strokeWidth="1"
      />
      <path
        d="M420 120 L640 140 L670 260 L600 350 L480 330 L430 220 Z"
        fill="var(--shell-warm)"
        stroke="var(--border)"
        strokeWidth="1"
      />
      <path
        d="M690 150 L840 160 L880 300 L740 330 L680 260 Z"
        fill="var(--shell-warm)"
        stroke="var(--border)"
        strokeWidth="1"
      />
      <path
        d="M210 360 L320 330 L340 420 L260 450 Z"
        fill="var(--shell-warm)"
        stroke="var(--border)"
        strokeWidth="1"
      />

      {/* Node pins */}
      {NODES.map((n) => (
        <g key={n.name}>
          <circle cx={n.cx} cy={n.cy} r="22" fill={n.color} fillOpacity="0.12">
            <animate attributeName="r" values="14;28;14" dur="3.2s" repeatCount="indefinite" />
            <animate
              attributeName="fill-opacity"
              values="0.18;0.04;0.18"
              dur="3.2s"
              repeatCount="indefinite"
            />
          </circle>
          <circle
            cx={n.cx}
            cy={n.cy}
            r="6"
            fill={n.color}
            stroke="var(--surface)"
            strokeWidth="2"
          />
          <text
            x={n.cx}
            y={n.cy + 26}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize="11"
            fill="var(--ink-muted)"
            letterSpacing="0.5"
          >
            {n.name}
          </text>
        </g>
      ))}

      {/* Methodology threads connecting active to onboarding */}
      <path
        d="M540 230 Q 480 250 430 270"
        stroke="var(--deep-teal)"
        strokeWidth="0.8"
        strokeDasharray="2 4"
        fill="none"
        opacity="0.4"
      />
      <path
        d="M540 230 Q 380 320 230 360"
        stroke="var(--deep-teal)"
        strokeWidth="0.8"
        strokeDasharray="2 4"
        fill="none"
        opacity="0.4"
      />
    </svg>
  );
}
