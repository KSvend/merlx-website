/**
 * NetworkPreview — schematic node-pin map + cooperative directory
 * fragment. Used as the Network side of the group home.
 */

import type { CSSProperties } from 'react';

interface Node {
  name: string;
  region: string;
  status: 'active' | 'onboarding' | 'planned';
  cx: number;
  cy: number;
}

const NODES: Node[] = [
  { name: 'NileX', region: 'Sudan · Horn of Africa', status: 'active', cx: 270, cy: 110 },
  {
    name: 'Andes Cooperativa',
    region: 'Colombia · Andean region',
    status: 'onboarding',
    cx: 110,
    cy: 165,
  },
  { name: 'Sahel Reseau', region: 'Senegal · West Africa', status: 'onboarding', cx: 215, cy: 130 },
  { name: 'MENA Methods', region: 'Jordan · Levant', status: 'planned', cx: 285, cy: 90 },
];

const STATUS_COLOR: Record<Node['status'], string> = {
  active: 'var(--deep-teal)',
  onboarding: 'var(--iris)',
  planned: 'var(--ink-faint)',
};

const STATUS_LABEL: Record<Node['status'], string> = {
  active: '● ACTIVE',
  onboarding: '◐ ONBOARDING',
  planned: '○ PLANNED',
};

export function NetworkPreview() {
  return (
    <div className="mx-card" style={cardStyle}>
      <div style={chromeRowStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span
            style={{ width: 8, height: 8, borderRadius: 100, background: 'var(--deep-teal)' }}
          />
          <span style={chromeLabelStyle}>MERLx Network · cooperative directory</span>
        </div>
        <span style={chromeMetaStyle}>4 NODES · 1 ACTIVE</span>
      </div>

      <div style={{ padding: 24 }}>
        <p className="mx-mono-caption" style={{ margin: '0 0 12px', fontSize: 9 }}>
          GLOBAL NODE MAP · SCHEMATIC
        </p>
        <svg
          viewBox="0 0 480 220"
          style={{
            width: '100%',
            height: 200,
            background: 'var(--shell-cool)',
            borderRadius: 'var(--radius-sm)',
          }}
          role="img"
          aria-labelledby="merlx-network-preview-title"
        >
          <title id="merlx-network-preview-title">Schematic world map of MERLx Network nodes</title>
          {/* Continent silhouettes — abstract shapes only */}
          <path
            d="M40 90 L150 70 L200 100 L195 160 L130 175 L60 150 Z"
            fill="var(--shell-warm)"
            stroke="var(--border)"
          />
          <path
            d="M210 60 L320 70 L335 130 L300 175 L240 165 L215 110 Z"
            fill="var(--shell-warm)"
            stroke="var(--border)"
          />
          <path
            d="M345 75 L420 80 L440 150 L370 165 L340 130 Z"
            fill="var(--shell-warm)"
            stroke="var(--border)"
          />

          {NODES.map((n) => {
            const c = STATUS_COLOR[n.status];
            return (
              <g key={n.name}>
                <circle cx={n.cx} cy={n.cy} r="12" fill={c} fillOpacity="0.18" />
                <circle
                  cx={n.cx}
                  cy={n.cy}
                  r="5"
                  fill={c}
                  stroke="var(--surface)"
                  strokeWidth="1.5"
                />
              </g>
            );
          })}
        </svg>

        <div style={listStyle}>
          {NODES.map((n) => (
            <div key={n.name} style={rowStyle}>
              <span style={{ ...indicatorStyle, color: STATUS_COLOR[n.status] }}>
                {STATUS_LABEL[n.status]}
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={{ fontSize: 13, color: 'var(--ink)', fontWeight: 500 }}>{n.name}</span>
                <span style={{ fontSize: 11, color: 'var(--ink-muted)' }}>{n.region}</span>
              </div>
            </div>
          ))}
        </div>

        <p style={footnoteStyle}>
          Each node operates under shared methodology + conflict-sensitivity standards. The Studio
          builds; the Network deploys.
        </p>
      </div>
    </div>
  );
}

const cardStyle: CSSProperties = { padding: 0, overflow: 'hidden', background: 'var(--surface)' };

const chromeRowStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '12px 16px',
  borderBottom: '1px solid var(--border-light)',
};

const chromeLabelStyle: CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: 11,
  color: 'var(--ink-muted)',
  letterSpacing: '0.5px',
};

const chromeMetaStyle: CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: 10,
  color: 'var(--ink-faint)',
  letterSpacing: '0.5px',
};

const listStyle: CSSProperties = {
  marginTop: 20,
  display: 'flex',
  flexDirection: 'column',
  borderTop: '1px solid var(--border-light)',
};

const rowStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '110px 1fr',
  gap: 12,
  alignItems: 'center',
  padding: '12px 0',
  borderBottom: '1px solid var(--border-light)',
};

const indicatorStyle: CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: 9,
  letterSpacing: '1px',
};

const footnoteStyle: CSSProperties = {
  marginTop: 16,
  fontSize: 12,
  lineHeight: 1.55,
  color: 'var(--ink-muted)',
  fontStyle: 'italic',
  fontFamily: 'var(--font-display)',
};
