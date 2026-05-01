/**
 * Studio side background: literal cutout of the PRISM map UI.
 *
 * Mirrors the actual PRISM frontend at merlx-prism.up.railway.app:
 * - CARTO Positron-style light basemap field
 * - Faint country outlines (Horn of Africa)
 * - H3-style hex grid with sequential red risk ramp, hot zone over Sudan
 * - Top-left control stack: ViewToggle (deep-teal active) +
 *   MapModeToggle (iris active "Trend" with downward triangle) +
 *   MapLegend (subtitle, ramp, count, threshold)
 * - Top-right: DatePicker chip
 * - Bottom-right: scale bar + attribution
 *
 * Colors hardcoded to PRISM's actual tokens (iris #8071BC, deep-teal
 * #1A3A34, ColorBrewer Reds 5) — overrides chooser orange register
 * inside the cutout to read as authentic product, not decoration.
 */

const VW = 600;
const VH = 600;

// Lat/lng → viewBox projection. View centered on the Horn of Africa.
const VIEW_W_DEG = 34; // 18°E .. 52°E
const VIEW_H_DEG = 30; // 0°N .. 30°N
const LNG_MIN = 18;
const LAT_MAX = 30;

function proj(lat: number, lng: number): [number, number] {
  return [((lng - LNG_MIN) / VIEW_W_DEG) * VW, ((LAT_MAX - lat) / VIEW_H_DEG) * VH];
}

// Simplified Horn-of-Africa landmass mask (Sudan + South Sudan + Ethiopia +
// Eritrea + Djibouti + Somalia + Kenya). Coarse but reads as East Africa.
const LANDMASS: Array<[number, number]> = [
  [22, 25],
  [22, 31],
  [22, 36.8],
  [18, 38.5],
  [15, 39.5],
  [13.5, 42],
  [12, 43.4],
  [10.8, 44.6],
  [9, 49],
  [4, 51.4],
  [-1.5, 41.9],
  [-4.7, 39.2],
  [-4.5, 35],
  [-1, 30],
  [4, 28],
  [7, 26],
  [10, 22],
  [12, 21.8],
  [16, 22.2],
  [20, 23.5],
  [22, 25],
];

const PROJECTED_LANDMASS: Array<[number, number]> = LANDMASS.map(([lat, lng]) =>
  proj(lat, lng),
);

// Internal country borders (just visible cuts, not full polygons)
const INTERNAL_BORDERS: Array<Array<[number, number]>> = [
  // Sudan / South Sudan
  [
    [10, 24],
    [10.5, 28],
    [11, 33],
    [10, 35],
  ],
  // Sudan / Ethiopia
  [
    [15, 36.5],
    [11, 35],
    [10, 35],
  ],
  // Ethiopia / Kenya
  [
    [4.5, 36],
    [4, 39],
    [3.5, 41.9],
  ],
  // Ethiopia / Somalia
  [
    [10.8, 44.6],
    [8, 44],
    [4, 41.5],
  ],
  // Eritrea / Ethiopia
  [
    [15, 36.4],
    [14.5, 38],
    [13.5, 42],
  ],
  // South Sudan / Uganda+Kenya
  [
    [4, 33],
    [4, 36],
    [4.5, 36],
  ],
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

// H3-ish hex grid (pointy-top) covering the projected landmass.
const HEX_R = 9;
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

// PRISM red ramp (ColorBrewer Reds 5)
const RAMP = ['#fee5d9', '#fcae91', '#fb6a4a', '#de2d26', '#a50f15'];

// Hot centers (lat/lng): Khartoum/central Sudan + Darfur + South Sudan +
// southern Somalia. Risk = max Gaussian falloff among hot points.
const HOT_CENTERS = [
  proj(14.5, 32.5), // Khartoum / Gezira
  proj(13, 24), // Darfur
  proj(7.5, 31), // South Sudan (Bor / Jonglei)
  proj(2.5, 45.3), // Mogadishu / Lower Shabelle
];

function riskAt(x: number, y: number): number {
  let r = 0;
  for (const [hx, hy] of HOT_CENTERS) {
    const d = Math.hypot(x - hx, y - hy);
    const v = Math.exp(-(d * d) / 4500);
    if (v > r) r = v;
  }
  return r;
}

function rampColor(v: number): string | null {
  if (v < 0.08) return null; // "below threshold" — empty cell
  if (v < 0.18) return RAMP[0];
  if (v < 0.34) return RAMP[1];
  if (v < 0.55) return RAMP[2];
  if (v < 0.78) return RAMP[3];
  return RAMP[4];
}

interface HexCell {
  key: string;
  cx: number;
  cy: number;
  fill: string;
  level: number;
}

function buildHexes(): { cells: HexCell[]; counts: number[] } {
  const cells: HexCell[] = [];
  const counts = [0, 0, 0, 0, 0];
  let row = 0;
  for (let cy = HEX_R; cy <= VH - HEX_R; cy += HEX_DY) {
    const offset = row % 2 === 1 ? HEX_DX / 2 : 0;
    for (let cx = HEX_R + offset; cx <= VW - HEX_R; cx += HEX_DX) {
      if (!pointInPolygon(cx, cy, PROJECTED_LANDMASS)) continue;
      const v = riskAt(cx, cy);
      const fill = rampColor(v);
      if (!fill) continue;
      const level = RAMP.indexOf(fill);
      counts[level] += 1;
      cells.push({ key: `${cx.toFixed(0)}-${cy.toFixed(0)}`, cx, cy, fill, level });
    }
    row += 1;
  }
  return { cells, counts };
}

const { cells: HEXES, counts: COUNTS } = buildHexes();
const VISIBLE_COUNT = COUNTS.reduce((a, b) => a + b, 0);

const VIEW_BUTTONS = ['Hex', 'Admin', 'Systems'];
const MODE_BUTTONS = ['Now', 'Trend', 'Delta', 'Predicted'];
const ACTIVE_VIEW = 0;
const ACTIVE_MODE = 1;

const PANEL_FILL = '#fafaf6';
const PANEL_BORDER = '#d8d4ca';
const BASEMAP = '#eeece5';
const COUNTRY_LINE = '#c8c3b6';
const COUNTRY_FILL = '#f5f3ec';
const TEXT_INK = '#1a1a1a';
const TEXT_MUTE = '#7a786f';
const IRIS = '#8071BC';
const DEEP_TEAL = '#1A3A34';

function landmassPath(): string {
  return `${PROJECTED_LANDMASS.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`).join(' ')} Z`;
}

export function StudioBackground() {
  return (
    <svg viewBox={`0 0 ${VW} ${VH}`} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect x="0" y="0" width={VW} height={VH} fill={BASEMAP} />

      <g opacity="0.55">
        {[0, 100, 200, 300, 400, 500, 600].map((y) => (
          <line key={`gh-${y}`} x1="0" y1={y} x2={VW} y2={y} stroke="#e5e2d8" strokeWidth="0.4" />
        ))}
        {[0, 100, 200, 300, 400, 500, 600].map((x) => (
          <line key={`gv-${x}`} x1={x} y1="0" x2={x} y2={VH} stroke="#e5e2d8" strokeWidth="0.4" />
        ))}
      </g>

      <path d={landmassPath()} fill={COUNTRY_FILL} stroke={COUNTRY_LINE} strokeWidth="0.8" />

      <g opacity="0.7">
        {INTERNAL_BORDERS.map((line, i) => (
          <path
            key={`b-${i}`}
            d={line
              .map(
                ([lat, lng], j) =>
                  `${j === 0 ? 'M' : 'L'} ${proj(lat, lng)[0].toFixed(1)} ${proj(lat, lng)[1].toFixed(1)}`,
              )
              .join(' ')}
            fill="none"
            stroke={COUNTRY_LINE}
            strokeWidth="0.6"
            strokeDasharray="2 2"
          />
        ))}
      </g>

      <g>
        {HEXES.map((h) => (
          <polygon
            key={h.key}
            points={hexPoints(h.cx, h.cy, HEX_R)}
            fill={h.fill}
            stroke="#a50f15"
            strokeWidth="0.18"
            opacity={0.78}
          />
        ))}
      </g>

      {/* Top-left control stack */}
      <g transform="translate(20, 20)">
        {/* ViewToggle */}
        <g>
          <rect
            x="0"
            y="0"
            width="180"
            height="24"
            rx="4"
            fill={PANEL_FILL}
            stroke={PANEL_BORDER}
            strokeWidth="0.6"
          />
          {VIEW_BUTTONS.map((label, i) => {
            const w = 180 / VIEW_BUTTONS.length;
            const isActive = i === ACTIVE_VIEW;
            return (
              <g key={label}>
                {isActive && (
                  <rect x={i * w} y="0" width={w} height="24" rx="4" fill={DEEP_TEAL} />
                )}
                <text
                  x={i * w + w / 2}
                  y="16"
                  fontFamily="var(--font-mono)"
                  fontSize="9.5"
                  textAnchor="middle"
                  letterSpacing="0.04em"
                  fill={isActive ? '#ffffff' : TEXT_MUTE}
                >
                  {label}
                </text>
                {i > 0 && !isActive && i !== ACTIVE_VIEW + 1 && (
                  <line
                    x1={i * w}
                    y1="6"
                    x2={i * w}
                    y2="18"
                    stroke={PANEL_BORDER}
                    strokeWidth="0.5"
                  />
                )}
              </g>
            );
          })}
        </g>

        {/* MapModeToggle */}
        <g transform="translate(0, 32)">
          <rect
            x="0"
            y="0"
            width="220"
            height="24"
            rx="4"
            fill={PANEL_FILL}
            stroke={PANEL_BORDER}
            strokeWidth="0.6"
          />
          {MODE_BUTTONS.map((label, i) => {
            const w = 220 / MODE_BUTTONS.length;
            const isActive = i === ACTIVE_MODE;
            return (
              <g key={label}>
                {isActive && (
                  <rect x={i * w} y="0" width={w} height="24" rx="4" fill={IRIS} />
                )}
                <text
                  x={i * w + w / 2}
                  y="16"
                  fontFamily="var(--font-mono)"
                  fontSize="9.5"
                  textAnchor="middle"
                  letterSpacing="0.04em"
                  fill={isActive ? '#ffffff' : TEXT_MUTE}
                >
                  {label}
                </text>
              </g>
            );
          })}
          {/* Downward triangle pointing at the legend below — same iris */}
          <polygon
            points={`${(ACTIVE_MODE + 0.5) * (220 / MODE_BUTTONS.length) - 6},24 ${(ACTIVE_MODE + 0.5) * (220 / MODE_BUTTONS.length) + 6},24 ${(ACTIVE_MODE + 0.5) * (220 / MODE_BUTTONS.length)},30`}
            fill={IRIS}
          />
        </g>

        {/* MapLegend */}
        <g transform="translate(0, 70)">
          <rect
            x="0"
            y="0"
            width="220"
            height="86"
            rx="4"
            fill={PANEL_FILL}
            stroke={PANEL_BORDER}
            strokeWidth="0.6"
          />
          <text
            x="14"
            y="18"
            fontFamily="var(--font-mono)"
            fontSize="9"
            letterSpacing="0.06em"
            fill={TEXT_INK}
          >
            30-day rolling window
          </text>
          <text
            x="206"
            y="18"
            fontFamily="var(--font-mono)"
            fontSize="9"
            textAnchor="end"
            fill={TEXT_MUTE}
          >
            {VISIBLE_COUNT} cells
          </text>
          {/* Color ramp bar */}
          <g transform="translate(14, 30)">
            {RAMP.map((c, i) => (
              <rect key={c} x={i * 38.4} y="0" width="38.4" height="10" fill={c} />
            ))}
            <rect
              x="0"
              y="0"
              width={RAMP.length * 38.4}
              height="10"
              fill="none"
              stroke={PANEL_BORDER}
              strokeWidth="0.5"
            />
          </g>
          <text
            x="14"
            y="56"
            fontFamily="var(--font-mono)"
            fontSize="8"
            fill={TEXT_MUTE}
            letterSpacing="0.04em"
          >
            low
          </text>
          <text
            x="206"
            y="56"
            fontFamily="var(--font-mono)"
            fontSize="8"
            textAnchor="end"
            fill={TEXT_MUTE}
            letterSpacing="0.04em"
          >
            high
          </text>
          <line x1="14" y1="64" x2="206" y2="64" stroke={PANEL_BORDER} strokeWidth="0.5" />
          <text
            x="14"
            y="78"
            fontFamily="var(--font-mono)"
            fontSize="8.5"
            fill={TEXT_MUTE}
            letterSpacing="0.04em"
          >
            threshold ≥ 0.25
          </text>
        </g>
      </g>

      {/* Top-right date picker chip */}
      <g transform={`translate(${VW - 132}, 20)`}>
        <rect
          x="0"
          y="0"
          width="112"
          height="24"
          rx="4"
          fill={PANEL_FILL}
          stroke={PANEL_BORDER}
          strokeWidth="0.6"
        />
        <rect x="9" y="6" width="3" height="3" fill={DEEP_TEAL} />
        <rect x="9" y="11" width="3" height="3" fill={DEEP_TEAL} opacity="0.5" />
        <rect x="14" y="6" width="3" height="3" fill={DEEP_TEAL} opacity="0.5" />
        <rect x="14" y="11" width="3" height="3" fill={DEEP_TEAL} />
        <text
          x="26"
          y="16"
          fontFamily="var(--font-mono)"
          fontSize="9.5"
          fill={TEXT_INK}
          letterSpacing="0.04em"
        >
          2026-04-09
        </text>
        <polygon points="100,11 106,11 103,15" fill={TEXT_MUTE} />
      </g>

      {/* Bottom-right scale bar + attribution */}
      <g transform={`translate(${VW - 140}, ${VH - 36})`}>
        <line x1="0" y1="0" x2="100" y2="0" stroke={TEXT_INK} strokeWidth="0.8" />
        <line x1="0" y1="-3" x2="0" y2="3" stroke={TEXT_INK} strokeWidth="0.8" />
        <line x1="50" y1="-2" x2="50" y2="2" stroke={TEXT_INK} strokeWidth="0.8" />
        <line x1="100" y1="-3" x2="100" y2="3" stroke={TEXT_INK} strokeWidth="0.8" />
        <text x="0" y="-6" fontFamily="var(--font-mono)" fontSize="8" fill={TEXT_MUTE}>
          0
        </text>
        <text x="50" y="-6" fontFamily="var(--font-mono)" fontSize="8" fill={TEXT_MUTE} textAnchor="middle">
          200 km
        </text>
        <text x="0" y="14" fontFamily="var(--font-mono)" fontSize="7.5" fill={TEXT_MUTE} letterSpacing="0.04em">
          © CARTO · OpenStreetMap
        </text>
      </g>
    </svg>
  );
}
