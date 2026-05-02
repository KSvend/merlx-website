/**
 * Studio side background: minimalist terminal + reactive hex grid.
 *
 * No map, no chrome, no panels, no roundness. Just:
 * - A column of mono code lines that read like a PRISM inference
 *   script running (load tensor → features → forward → write cells).
 * - A hex grid to the right that "responds" to the script — cells
 *   flip from neutral grey to ember (escalating) or deep-teal
 *   (de-escalating) at staggered offsets, looping with the code.
 *
 * Animation runs continuously (CSS keyframes from chooser.css). The
 * default state shows the chooser orange tint overlay; on hover the
 * tint fades and this composition becomes visible.
 */

const VW = 600;
const VH = 600;

// Code lines — left column of the composition
const CODE_LINES: Array<{ text: string; tone?: 'cmd' | 'log' | 'score' | 'done' }> = [
  { text: "> prism.predict(date='2026-04-09', mode='delta')", tone: 'cmd' },
  { text: '[14:32:08] load tensor[5089, 52]', tone: 'log' },
  { text: '[14:32:09] features.conflict.aggregate(7d)', tone: 'log' },
  { text: '[14:32:10] features.food.carryforward()', tone: 'log' },
  { text: '[14:32:11] features.climate.ndvi_anom()', tone: 'log' },
  { text: '[14:32:12] model.crisis_3m.forward()', tone: 'log' },
  { text: '[14:32:13] inflate(r=5, decay=0.85)', tone: 'log' },
  { text: '[14:32:14] postsmooth(kernel=3)', tone: 'log' },
  { text: '[14:32:15] write 5089 → cells', tone: 'log' },
  { text: '   8c4f3a   0.61  ▲', tone: 'score' },
  { text: '   8c2b71   0.48  ▲', tone: 'score' },
  { text: '   8c1d9e   0.42  ▲', tone: 'score' },
  { text: '   8c3e22   0.31  ▼', tone: 'score' },
  { text: 'done. Δ w/w = +5,089', tone: 'done' },
];

// Hex grid: pointy-top hexes laid out in a tight grid, right column
const HEX_R = 3;
const HEX_DX = HEX_R * Math.sqrt(3);
const HEX_DY = HEX_R * 1.5;
const GRID_X0 = 300;
const GRID_Y0 = 44;
const GRID_W = 280;
const GRID_H = 510;

function hexPoints(cx: number, cy: number, r: number): string {
  const pts: string[] = [];
  for (let i = 0; i < 6; i += 1) {
    const a = (Math.PI / 3) * i - Math.PI / 2;
    pts.push(`${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`);
  }
  return pts.join(' ');
}

interface Cell {
  key: string;
  cx: number;
  cy: number;
  variant: 'idle' | 'up' | 'down';
  delay: number;
}

// Deterministic pseudo-random based on (col, row) so the same cells
// flip on every render
function classifyCell(col: number, row: number): { variant: Cell['variant']; delay: number } {
  // Hash to [0, 1)
  const h = (Math.sin(col * 12.9898 + row * 78.233) * 43758.5453) % 1;
  const r = h < 0 ? h + 1 : h;
  // ~30% of cells flip; of those, ~70% up, 30% down
  if (r < 0.18) return { variant: 'up', delay: r * 12 };
  if (r < 0.28) return { variant: 'down', delay: r * 12 };
  return { variant: 'idle', delay: 0 };
}

function buildCells(): Cell[] {
  const cells: Cell[] = [];
  let row = 0;
  for (let cy = GRID_Y0 + HEX_R; cy <= GRID_Y0 + GRID_H - HEX_R; cy += HEX_DY) {
    const offset = row % 2 === 1 ? HEX_DX / 2 : 0;
    let col = 0;
    for (let cx = GRID_X0 + HEX_R + offset; cx <= GRID_X0 + GRID_W - HEX_R; cx += HEX_DX) {
      const { variant, delay } = classifyCell(col, row);
      cells.push({ key: `${col}-${row}`, cx, cy, variant, delay });
      col += 1;
    }
    row += 1;
  }
  return cells;
}

const CELLS = buildCells();

// MERLx tokens
const SHELL = '#F5F3EE';
const INK = '#111111';
const INK_LIGHT = '#2A2A2A';
const INK_MUTED = '#6B6B6B';
const INK_FAINT = '#9E9E9E';
const IRIS = '#8071BC';
const IRIS_DARK = '#635499';
const EMBER = '#CA5D0F';
const DEEP_TEAL = '#1A3A34';
const BORDER_LIGHT = '#E5E1DA';
const SHELL_WARM = '#EDE9E1';

const TONE_COLOR: Record<NonNullable<(typeof CODE_LINES)[number]['tone']>, string> = {
  cmd: IRIS_DARK,
  log: INK_LIGHT,
  score: EMBER,
  done: DEEP_TEAL,
};

const LINE_HEIGHT = 12;
const CODE_X = 22;
const CODE_Y0 = 44;

export function StudioBackground() {
  return (
    <svg viewBox={`0 0 ${VW} ${VH}`} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect x="0" y="0" width={VW} height={VH} fill={SHELL} />

      {/* Top header bar — minimalist, sharp corners */}
      <text
        x={CODE_X}
        y={24}
        fontFamily="var(--font-mono)"
        fontSize="7"
        letterSpacing="0.16em"
        fill={INK_MUTED}
      >
        PRISM · INFERENCE
      </text>
      <line x1={CODE_X} y1={32} x2={VW - 22} y2={32} stroke={BORDER_LIGHT} strokeWidth="0.5" />

      {/* Code lines — staggered fade-in */}
      <g>
        {CODE_LINES.map((line, i) => (
          <text
            key={`line-${i}-${line.text.length}`}
            x={CODE_X}
            y={CODE_Y0 + i * LINE_HEIGHT + 8}
            fontFamily="var(--font-mono)"
            fontSize="8"
            fill={TONE_COLOR[line.tone ?? 'log']}
            className={`studio-code-line studio-code-line--${i}`}
          >
            {line.text}
          </text>
        ))}
        {/* Blinking cursor */}
        <rect
          x={CODE_X}
          y={CODE_Y0 + CODE_LINES.length * LINE_HEIGHT + 2}
          width="4"
          height="8"
          fill={INK}
          className="studio-code-cursor"
        />
      </g>

      {/* Hex grid — column header */}
      <text
        x={GRID_X0}
        y={24}
        fontFamily="var(--font-mono)"
        fontSize="7"
        letterSpacing="0.16em"
        fill={INK_MUTED}
      >
        CELLS · 5,089
      </text>

      {/* Hex grid — sharp vertices, color flips with delay */}
      <g>
        {CELLS.map((c) => {
          const isFlipping = c.variant !== 'idle';
          return (
            <polygon
              key={c.key}
              points={hexPoints(c.cx, c.cy, HEX_R - 0.4)}
              fill={SHELL_WARM}
              stroke="none"
              className={isFlipping ? `studio-hex studio-hex--${c.variant}` : undefined}
              style={isFlipping ? { animationDelay: `${c.delay}s` } : undefined}
            />
          );
        })}
      </g>

      {/* Footer line — total cell count */}
      <line
        x1={CODE_X}
        y1={VH - 28}
        x2={VW - 22}
        y2={VH - 28}
        stroke={BORDER_LIGHT}
        strokeWidth="0.5"
      />
      <text
        x={CODE_X}
        y={VH - 14}
        fontFamily="var(--font-mono)"
        fontSize="7"
        letterSpacing="0.1em"
        fill={INK_FAINT}
      >
        tensor[5089, 52] · model 9a7f3b2
      </text>
      <text
        x={VW - 22}
        y={VH - 14}
        fontFamily="var(--font-mono)"
        fontSize="7"
        textAnchor="end"
        fill={IRIS}
        fontWeight="500"
      >
        ▶ predicting
      </text>
    </svg>
  );
}
