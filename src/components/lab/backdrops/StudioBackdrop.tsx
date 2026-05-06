import type { CSSProperties } from 'react';

interface BackdropProps {
  style?: CSSProperties;
  /** Active = full opacity. Inactive = dimmed. */
  active?: boolean;
}

/**
 * Studio backdrop — PRISM-style hex compound-risk grid. Some cells
 * in ember/iris/deep-teal accents to suggest a live forecast read.
 */
export function StudioBackdrop({ style, active = true }: BackdropProps) {
  const cols = 18;
  const rows = 10;
  const cellSize = 28;
  const cells: { x: number; y: number; tone: 'a' | 'b' | 'c' | 'd' | 'e' }[] = [];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const dx = r % 2 === 0 ? 0 : cellSize / 2;
      const noise = Math.sin(r * 1.3 + c * 0.7) * 0.5 + Math.cos(r * 0.6 - c * 0.9) * 0.4;
      const intensity = Math.max(0, Math.min(1, 0.5 + noise * 0.5));
      let tone: 'a' | 'b' | 'c' | 'd' | 'e' = 'a';
      if (intensity > 0.78) tone = 'e';
      else if (intensity > 0.6) tone = 'd';
      else if (intensity > 0.42) tone = 'c';
      else if (intensity > 0.25) tone = 'b';
      cells.push({ x: c * cellSize + dx, y: r * cellSize, tone });
    }
  }

  return (
    <svg
      style={{
        width: '100%',
        height: '100%',
        opacity: active ? 1 : 0.25,
        transition: 'opacity 600ms cubic-bezier(0.16, 1, 0.3, 1)',
        ...style,
      }}
      viewBox={`0 0 ${cols * cellSize} ${rows * cellSize}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="studio-glow" cx="50%" cy="55%" r="60%">
          <stop offset="0%" stopColor="var(--ember-dim)" stopOpacity="0.25" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="var(--shell-cool)" />
      <rect width="100%" height="100%" fill="url(#studio-glow)" />
      {cells.map((cell, i) => {
        const fill =
          cell.tone === 'e'
            ? 'var(--ember)'
            : cell.tone === 'd'
              ? 'var(--ember-dim)'
              : cell.tone === 'c'
                ? 'var(--iris-dim)'
                : cell.tone === 'b'
                  ? 'var(--shell-warm)'
                  : 'transparent';
        const opacity = cell.tone === 'a' ? 0 : cell.tone === 'e' ? 0.78 : 0.5;
        const half = cellSize / 2;
        const x = cell.x;
        const y = cell.y;
        const points = [
          `${x + half},${y}`,
          `${x + cellSize},${y + half / 1.7}`,
          `${x + cellSize},${y + cellSize - half / 1.7}`,
          `${x + half},${y + cellSize}`,
          `${x},${y + cellSize - half / 1.7}`,
          `${x},${y + half / 1.7}`,
        ].join(' ');
        return (
          <polygon
            // biome-ignore lint/suspicious/noArrayIndexKey: hex grid cells have no stable id
            key={`hex-${i}`}
            points={points}
            fill={fill}
            fillOpacity={opacity}
            stroke="var(--border-light)"
            strokeWidth="0.5"
          />
        );
      })}
      {/* Two pulsing alert cells */}
      <circle cx={5 * cellSize} cy={3 * cellSize} r={6}>
        <animate attributeName="r" values="3;9;3" dur="2.4s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.8;0;0.8" dur="2.4s" repeatCount="indefinite" />
      </circle>
      <circle cx={5 * cellSize} cy={3 * cellSize} r="3" fill="var(--ember)" />
      <circle cx={12 * cellSize} cy={6 * cellSize} r={6}>
        <animate attributeName="r" values="3;9;3" dur="2.8s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.6;0;0.6" dur="2.8s" repeatCount="indefinite" />
      </circle>
      <circle cx={12 * cellSize} cy={6 * cellSize} r="3" fill="var(--iris)" />
    </svg>
  );
}
