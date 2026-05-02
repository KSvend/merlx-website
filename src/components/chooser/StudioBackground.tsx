/**
 * Studio side background: minimalist terminal + painterly hex plumage.
 *
 * Hexes form a country-shaped landmass (irregular polygon, not a
 * rectangular grid) and bloom into red/teal "plumages" of risk
 * intensity around cluster centers. Code log sits on the right side
 * so the chooser text panel on the left reads cleanly.
 *
 * Animation: a small subset of the hottest cells pulse on stagger,
 * suggesting the inference is updating their scores. Loops with the
 * code log every 14s. Pure CSS keyframes — zero client JS.
 */

const VW = 600;
const VH = 600;

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
  { text: '8c4f3a   0.61  ▲', tone: 'score' },
  { text: '8c2b71   0.48  ▲', tone: 'score' },
  { text: '8c1d9e   0.42  ▲', tone: 'score' },
  { text: '8c3e22   0.31  ▼', tone: 'score' },
  { text: 'done. Δ w/w = +5,089', tone: 'done' },
];

const HEX_R = 3;
const HEX_DX = HEX_R * Math.sqrt(3);
const HEX_DY = HEX_R * 1.5;

function hexPoints(cx: number, cy: number, r: number): string {
  const pts: string[] = [];
  for (let i = 0; i < 6; i += 1) {
    const a = (Math.PI / 3) * i - Math.PI / 2;
    pts.push(`${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`);
  }
  return pts.join(' ');
}

// Country-shaped landmass — irregular polygon defining where hexes
// appear. Hand-drawn to feel like a real country silhouette without
// being any specific country. Goes roughly: top-left bay, jutting
// peninsula east, southern tip, concave western coast.
const LANDMASS: Array<[number, number]> = [
  [60, 70],
  [120, 50],
  [200, 60],
  [260, 90],
  [310, 80],
  [340, 100],
  [380, 90],
  [410, 130],
  [430, 170],
  [445, 220],
  [435, 270],
  [450, 320],
  [430, 380],
  [400, 430],
  [380, 470],
  [340, 510],
  [290, 530],
  [240, 525],
  [200, 510],
  [170, 470],
  [140, 430],
  [115, 380],
  [95, 340],
  [80, 280],
  [70, 230],
  [55, 180],
  [50, 130],
  [60, 70],
];

function pointInPolygon(x: number, y: number, poly: Array<[number, number]>): boolean {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i, i += 1) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
  }
  return inside;
}

// Risk plumes — clusters of escalating (red) or de-escalating (teal)
// intensity. Each cell's color comes from its proximity to these
// centers, painted as a smooth Gaussian falloff.
interface Plume {
  pos: [number, number];
  polarity: 'red' | 'teal';
  radius: number;
  intensity: number;
}

const PLUMES: Plume[] = [
  // Strong red plume — central
  { pos: [220, 220], polarity: 'red', radius: 70, intensity: 1.0 },
  { pos: [180, 280], polarity: 'red', radius: 50, intensity: 0.85 },
  { pos: [150, 200], polarity: 'red', radius: 40, intensity: 0.6 },
  // Teal plume — upper right
  { pos: [330, 160], polarity: 'teal', radius: 55, intensity: 0.85 },
  { pos: [290, 220], polarity: 'teal', radius: 35, intensity: 0.6 },
  // Red plume — lower
  { pos: [280, 400], polarity: 'red', radius: 50, intensity: 0.8 },
  { pos: [320, 380], polarity: 'red', radius: 35, intensity: 0.6 },
  // Smaller teal plume — east coast
  { pos: [400, 280], polarity: 'teal', radius: 40, intensity: 0.7 },
  { pos: [410, 350], polarity: 'red', radius: 30, intensity: 0.55 },
  // Mixed lower-west
  { pos: [180, 430], polarity: 'teal', radius: 30, intensity: 0.5 },
  { pos: [150, 360], polarity: 'red', radius: 28, intensity: 0.5 },
];

interface CellColor {
  fill: string;
  intensity: number; // 0..1, used to decide which cells animate
  polarity: 'red' | 'teal' | 'neutral';
}

function plumeColor(cx: number, cy: number): CellColor {
  let red = 0;
  let teal = 0;
  for (const p of PLUMES) {
    const d = Math.hypot(cx - p.pos[0], cy - p.pos[1]);
    if (d > p.radius * 1.5) continue;
    const w = p.intensity * Math.exp(-(d * d) / (p.radius * p.radius * 0.55));
    if (p.polarity === 'red') red = Math.max(red, w);
    else teal = Math.max(teal, w);
  }
  const v = Math.max(red, teal);
  if (v < 0.04) return { fill: '#ddd9cc', intensity: 0, polarity: 'neutral' };
  if (red > teal) {
    if (v > 0.7) return { fill: '#a83227', intensity: v, polarity: 'red' };
    if (v > 0.5) return { fill: '#c44a3b', intensity: v, polarity: 'red' };
    if (v > 0.3) return { fill: '#dc7864', intensity: v, polarity: 'red' };
    if (v > 0.15) return { fill: '#e8a896', intensity: v, polarity: 'red' };
    return { fill: '#efc9b8', intensity: v, polarity: 'red' };
  }
  if (v > 0.7) return { fill: '#1f4a42', intensity: v, polarity: 'teal' };
  if (v > 0.5) return { fill: '#2c6359', intensity: v, polarity: 'teal' };
  if (v > 0.3) return { fill: '#5c8480', intensity: v, polarity: 'teal' };
  if (v > 0.15) return { fill: '#9ab8b3', intensity: v, polarity: 'teal' };
  return { fill: '#bccfca', intensity: v, polarity: 'teal' };
}

interface Cell {
  key: string;
  cx: number;
  cy: number;
  fill: string;
  pulse: 'red' | 'teal' | null;
  delay: number;
}

function buildCells(): Cell[] {
  const cells: Cell[] = [];
  let row = 0;
  for (let cy = HEX_R; cy <= VH - HEX_R; cy += HEX_DY) {
    const offset = row % 2 === 1 ? HEX_DX / 2 : 0;
    let col = 0;
    for (let cx = HEX_R + offset; cx <= VW - HEX_R; cx += HEX_DX) {
      if (pointInPolygon(cx, cy, LANDMASS)) {
        const color = plumeColor(cx, cy);
        // Hot cells (intensity > 0.5) pulse to a brighter version on
        // a stagger, simulating the prediction updating their scores.
        const pulse = color.intensity > 0.5 && color.polarity !== 'neutral' ? color.polarity : null;
        // Deterministic delay per cell (pseudo-random hash)
        const h = (Math.sin(col * 12.9898 + row * 78.233) * 43758.5453) % 1;
        const r = h < 0 ? h + 1 : h;
        cells.push({
          key: `${col}-${row}`,
          cx,
          cy,
          fill: color.fill,
          pulse,
          delay: r * 12,
        });
      }
      col += 1;
    }
    row += 1;
  }
  return cells;
}

const CELLS = buildCells();

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

const TONE_COLOR: Record<NonNullable<(typeof CODE_LINES)[number]['tone']>, string> = {
  cmd: IRIS_DARK,
  log: INK_LIGHT,
  score: EMBER,
  done: DEEP_TEAL,
};

// Code lives on the RIGHT side so the chooser text panel on the left
// has clean space to read.
const LINE_HEIGHT = 12;
const CODE_X_RIGHT = VW - 22; // text-anchor end, anchored to right margin

export function StudioBackground() {
  return (
    <svg viewBox={`0 0 ${VW} ${VH}`} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect x="0" y="0" width={VW} height={VH} fill={SHELL} />

      {/* Header — left side: PRISM · INFERENCE */}
      <text
        x={22}
        y={24}
        fontFamily="var(--font-mono)"
        fontSize="7"
        letterSpacing="0.16em"
        fill={INK_MUTED}
      >
        PRISM · INFERENCE
      </text>
      <text
        x={CODE_X_RIGHT}
        y={24}
        fontFamily="var(--font-mono)"
        fontSize="7"
        letterSpacing="0.16em"
        fill={INK_MUTED}
        textAnchor="end"
      >
        CELLS · 5,089
      </text>
      <line x1={22} y1={32} x2={VW - 22} y2={32} stroke={BORDER_LIGHT} strokeWidth="0.5" />

      {/* Hex carpet — country-shaped landmass with painterly plumes */}
      <g>
        {CELLS.map((c) => (
          <polygon
            key={c.key}
            points={hexPoints(c.cx, c.cy, HEX_R - 0.3)}
            fill={c.fill}
            stroke="none"
            className={c.pulse ? `studio-hex studio-hex--${c.pulse}` : undefined}
            style={c.pulse ? { animationDelay: `${c.delay}s` } : undefined}
          />
        ))}
      </g>

      {/* Code log — RIGHT-aligned so it doesn't compete with the
       * chooser text panel on the left. */}
      <g>
        {CODE_LINES.map((line, i) => (
          <text
            key={`line-${i}-${line.text.length}`}
            x={CODE_X_RIGHT}
            y={44 + i * LINE_HEIGHT + 8}
            fontFamily="var(--font-mono)"
            fontSize="8"
            fill={TONE_COLOR[line.tone ?? 'log']}
            textAnchor="end"
            className={`studio-code-line studio-code-line--${i}`}
          >
            {line.text}
          </text>
        ))}
        {/* Blinking cursor — small block at the end of the last line */}
        <rect
          x={CODE_X_RIGHT - 4}
          y={44 + CODE_LINES.length * LINE_HEIGHT + 2}
          width="4"
          height="8"
          fill={INK}
          className="studio-code-cursor"
        />
      </g>

      {/* Footer */}
      <line
        x1={22}
        y1={VH - 28}
        x2={VW - 22}
        y2={VH - 28}
        stroke={BORDER_LIGHT}
        strokeWidth="0.5"
      />
      <text
        x={22}
        y={VH - 14}
        fontFamily="var(--font-mono)"
        fontSize="7"
        letterSpacing="0.1em"
        fill={INK_FAINT}
      >
        tensor[5089, 52] · model 9a7f3b2
      </text>
      <text
        x={CODE_X_RIGHT}
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
