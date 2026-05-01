/**
 * Studio side background: faithful slice of the PRISM map.
 *
 * Shows the actual PRISM look at the screenshot frame the user
 * shared — CARTO-style basemap, country borders + labels in faint
 * pink/grey, H3 hex cells in the bipolar Delta colorway (teal
 * de-escalating, grey stable, red escalating). No control chrome,
 * no legend, no date picker — just the map and the cells.
 *
 * The wrapping <g class="chooser-bg-drift"> is what gives the
 * "interactive feel": chooser.css runs a slow drift+scale loop on
 * hover so the map gently pans, mimicking a live MapLibre canvas.
 *
 * Real interactive MapLibre + GeoJSON cell data is the next step
 * if/when the JS bundle weight is justified.
 */

const VW = 600;
const VH = 600;

// Horn-of-Africa frame matching the PRISM screenshot:
// lng 22..52 (Chad → Somalia), lat -3..22 (Tanzania → Egypt).
const LNG_MIN = 22;
const VIEW_W_DEG = 30;
const LAT_MAX = 22;
const VIEW_H_DEG = 25;

function proj(lat: number, lng: number): [number, number] {
  return [((lng - LNG_MIN) / VIEW_W_DEG) * VW, ((LAT_MAX - lat) / VIEW_H_DEG) * VH];
}

// Africa east-of-22E landmass (Chad/Sudan east through Somalia south
// through Tanzania border). One big polygon; the cell mask uses this.
const AFRICA: Array<[number, number]> = [
  [22, 22],
  [22, 36.8],
  [18, 38.2],
  [15, 39.3],
  [13, 42],
  [12, 43.4],
  [10.8, 44.5],
  [11, 49],
  [8, 49.5],
  [4, 51.4],
  [-1.5, 41.9],
  [-3, 39.7],
  [-3, 33],
  [-3, 30],
  [1, 29],
  [4, 28.5],
  [7, 27.5],
  [10, 24],
  [12, 22.5],
  [15, 22],
  [22, 22],
];

// Arabian peninsula sliver (Saudi + Yemen) — for label placement only,
// no hex coverage.
const ARABIA: Array<[number, number]> = [
  [22, 36.8],
  [22, 52],
  [12.5, 52],
  [12.5, 43.4],
  [16, 39.5],
  [22, 36.8],
];

const PROJ_AFRICA = AFRICA.map(([lat, lng]) => proj(lat, lng));
const PROJ_ARABIA = ARABIA.map(([lat, lng]) => proj(lat, lng));

// Internal country borders — simplified pink dashed lines like CARTO.
const BORDERS: Array<Array<[number, number]>> = [
  // Sudan / South Sudan
  [[10, 24], [10.5, 28], [10.8, 30], [11, 33.5], [10, 35]],
  // Sudan / Eritrea + Sudan / Ethiopia
  [[15, 36.5], [13, 36.2], [11, 35], [10, 35]],
  // Eritrea / Ethiopia
  [[15, 36.5], [14.5, 38], [13, 42]],
  // South Sudan / Ethiopia
  [[10, 35], [7, 34.5], [4.5, 35.5]],
  // Ethiopia / Kenya
  [[4.5, 35.5], [4.3, 38], [3.7, 41.9]],
  // Ethiopia / Somalia
  [[10.8, 44.5], [8, 44], [4, 41.9]],
  // South Sudan / Kenya / Uganda
  [[4.5, 35.5], [4, 34.5], [4, 33]],
  [[4, 33], [1.5, 31], [-1, 30]],
  // Kenya / Tanzania
  [[-1, 30], [-1, 33], [-3, 34.5], [-3, 39.7]],
  // Sudan / Egypt (top)
  [[22, 25], [22, 31], [22, 36.8]],
  // Sudan / CAR + S Sudan / CAR
  [[10, 24], [7, 27], [4, 28.5]],
  // Sudan / Chad (left)
  [[12, 22], [16, 22.5], [22, 22]],
];

const COUNTRY_LABELS: Array<{ text: string; lat: number; lng: number; size?: number }> = [
  { text: 'EGYPT', lat: 21.2, lng: 28, size: 11 },
  { text: 'SAUDI ARABIA', lat: 20, lng: 44.5, size: 12 },
  { text: 'YEMEN', lat: 15.5, lng: 47, size: 11 },
  { text: 'CHAD', lat: 16, lng: 23, size: 11 },
  { text: 'SUDAN', lat: 15, lng: 30, size: 13 },
  { text: 'ERITREA', lat: 15.3, lng: 38.5, size: 9 },
  { text: 'DJIBOUTI', lat: 11.6, lng: 43, size: 7.5 },
  { text: 'SOUTH SUDAN', lat: 7.5, lng: 31, size: 10 },
  { text: 'ETHIOPIA', lat: 8.5, lng: 39, size: 12 },
  { text: 'SOMALIA', lat: 4, lng: 46, size: 12 },
  { text: 'CENTRAL AFRICAN REPUBLIC', lat: 6, lng: 23.5, size: 7 },
  { text: 'UGANDA', lat: 1.5, lng: 32.5, size: 8 },
  { text: 'KENYA', lat: 0, lng: 38, size: 12 },
  { text: 'DEMOCRATIC REPUBLIC OF THE CONGO', lat: -1.5, lng: 23.5, size: 7 },
  { text: 'TANZANIA', lat: -2.5, lng: 34, size: 10 },
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

// Hex grid (pointy-top, H3-ish density)
const HEX_R = 6;
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

// Bipolar Delta clusters — escalating (red) and de-escalating (teal),
// matching the kind of distribution shown in the PRISM screenshot.
interface Cluster {
  pos: [number, number];
  polarity: 'red' | 'teal';
  radius: number;
  intensity: number;
}

const CLUSTERS: Cluster[] = [
  { pos: proj(15.5, 32.5), polarity: 'red', radius: 50, intensity: 1.0 }, // Khartoum/central
  { pos: proj(13, 24.5), polarity: 'red', radius: 35, intensity: 0.85 }, // Darfur
  { pos: proj(11, 33), polarity: 'teal', radius: 40, intensity: 0.8 }, // Sudan/SS east
  { pos: proj(13, 35), polarity: 'teal', radius: 25, intensity: 0.7 }, // Blue Nile
  { pos: proj(9.5, 39), polarity: 'red', radius: 32, intensity: 0.7 }, // central Ethiopia
  { pos: proj(7, 38), polarity: 'teal', radius: 28, intensity: 0.6 }, // S Ethiopia
  { pos: proj(9, 42), polarity: 'red', radius: 30, intensity: 0.7 }, // Somali region
  { pos: proj(3.5, 36), polarity: 'red', radius: 32, intensity: 0.75 }, // N Kenya / Turkana
  { pos: proj(2, 45), polarity: 'red', radius: 28, intensity: 0.7 }, // Mogadishu
  { pos: proj(7, 33), polarity: 'teal', radius: 24, intensity: 0.55 }, // SW Ethiopia/SS
  { pos: proj(0, 41), polarity: 'red', radius: 26, intensity: 0.65 }, // Kenya/Somalia border
  { pos: proj(-1, 37.5), polarity: 'teal', radius: 22, intensity: 0.55 }, // central Kenya
  { pos: proj(8, 27), polarity: 'teal', radius: 22, intensity: 0.5 }, // Bahr el-Ghazal
  { pos: proj(5, 32), polarity: 'red', radius: 26, intensity: 0.6 }, // Upper Nile
];

function cellColor(cx: number, cy: number): { fill: string; opacity: number } | null {
  let red = 0;
  let teal = 0;
  for (const c of CLUSTERS) {
    const d = Math.hypot(cx - c.pos[0], cy - c.pos[1]);
    if (d > c.radius * 1.6) continue;
    const w = c.intensity * Math.exp(-(d * d) / (c.radius * c.radius * 0.6));
    if (c.polarity === 'red') red = Math.max(red, w);
    else teal = Math.max(teal, w);
  }
  const v = Math.max(red, teal);
  if (v < 0.04) {
    // stable / no cluster — light grey, very low alpha (most of the map)
    return { fill: '#bcb6a8', opacity: 0.22 };
  }
  if (red > teal) {
    if (v > 0.7) return { fill: '#a83227', opacity: 0.92 };
    if (v > 0.45) return { fill: '#c44a3b', opacity: 0.85 };
    if (v > 0.25) return { fill: '#dc7864', opacity: 0.7 };
    if (v > 0.12) return { fill: '#e8a896', opacity: 0.55 };
    return { fill: '#bcb6a8', opacity: 0.32 };
  }
  if (v > 0.7) return { fill: '#1f4a42', opacity: 0.92 };
  if (v > 0.45) return { fill: '#2c6359', opacity: 0.82 };
  if (v > 0.25) return { fill: '#5c8480', opacity: 0.65 };
  if (v > 0.12) return { fill: '#9ab8b3', opacity: 0.5 };
  return { fill: '#bcb6a8', opacity: 0.32 };
}

interface Cell {
  key: string;
  cx: number;
  cy: number;
  fill: string;
  opacity: number;
}

function buildCells(): Cell[] {
  const cells: Cell[] = [];
  let row = 0;
  for (let cy = HEX_R; cy <= VH - HEX_R; cy += HEX_DY) {
    const offset = row % 2 === 1 ? HEX_DX / 2 : 0;
    for (let cx = HEX_R + offset; cx <= VW - HEX_R; cx += HEX_DX) {
      if (!pointInPolygon(cx, cy, PROJ_AFRICA)) continue;
      const c = cellColor(cx, cy);
      if (!c) continue;
      cells.push({ key: `${cx.toFixed(0)}-${cy.toFixed(0)}`, cx, cy, ...c });
    }
    row += 1;
  }
  return cells;
}

const CELLS = buildCells();

const BASEMAP = '#f0eee6';
const COUNTRY_FILL = '#f7f5ee';
const ARABIA_FILL = '#f5f3ec';
const COUNTRY_BORDER = '#e6c8c5';
const COASTLINE = '#cfc8b6';
const LABEL_INK = '#a89f8e';
const GRATICULE_LINE = '#dad6c8';
const GRATICULE_TICK = '#a89f8e';

// Lat/lng degree grid every 5°, with degree labels along the edges
const LAT_TICKS = [-5, 0, 5, 10, 15, 20, 25];
const LNG_TICKS = [20, 25, 30, 35, 40, 45, 50, 55];

function fmtLat(lat: number): string {
  if (lat === 0) return '0°';
  return `${Math.abs(lat)}°${lat > 0 ? 'N' : 'S'}`;
}
function fmtLng(lng: number): string {
  return `${lng}°E`;
}

function pathFromPoly(poly: Array<[number, number]>): string {
  return `${poly.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`).join(' ')} Z`;
}

function pathFromLine(line: Array<[number, number]>): string {
  return line
    .map(([lat, lng], j) => {
      const [x, y] = proj(lat, lng);
      return `${j === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(' ');
}

export function StudioBackground() {
  return (
    <svg viewBox={`0 0 ${VW} ${VH}`} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect x="0" y="0" width={VW} height={VH} fill={BASEMAP} />

      {/* Slow drift wrapper — animation defined in chooser.css */}
      <g className="chooser-bg-drift">
        {/* Lat/lng graticule (5° grid) */}
        <g opacity="0.55">
          {LAT_TICKS.map((lat) => {
            const [, y] = proj(lat, LNG_MIN);
            return (
              <line
                key={`grat-h-${lat}`}
                x1={0}
                y1={y}
                x2={VW}
                y2={y}
                stroke={GRATICULE_LINE}
                strokeWidth="0.4"
              />
            );
          })}
          {LNG_TICKS.map((lng) => {
            const [x] = proj(LAT_MAX, lng);
            return (
              <line
                key={`grat-v-${lng}`}
                x1={x}
                y1={0}
                x2={x}
                y2={VH}
                stroke={GRATICULE_LINE}
                strokeWidth="0.4"
              />
            );
          })}
          {/* Equator slightly stronger */}
          {(() => {
            const [, y] = proj(0, LNG_MIN);
            return (
              <line x1={0} y1={y} x2={VW} y2={y} stroke="#c8c2b0" strokeWidth="0.6" />
            );
          })()}
        </g>

        {/* Degree labels — corners-style cartographic chart */}
        <g>
          {/* Latitude labels along left + right edges */}
          {LAT_TICKS.map((lat) => {
            const [, y] = proj(lat, LNG_MIN);
            if (y < 12 || y > VH - 6) return null;
            return (
              <g key={`lat-lbl-${lat}`}>
                <text
                  x={6}
                  y={y - 2}
                  fontFamily="var(--font-mono)"
                  fontSize="7"
                  fill={GRATICULE_TICK}
                  letterSpacing="0.04em"
                  opacity="0.7"
                >
                  {fmtLat(lat)}
                </text>
                <text
                  x={VW - 6}
                  y={y - 2}
                  fontFamily="var(--font-mono)"
                  fontSize="7"
                  textAnchor="end"
                  fill={GRATICULE_TICK}
                  letterSpacing="0.04em"
                  opacity="0.7"
                >
                  {fmtLat(lat)}
                </text>
                <line x1={0} y1={y} x2={4} y2={y} stroke={GRATICULE_TICK} strokeWidth="0.5" opacity="0.55" />
                <line x1={VW - 4} y1={y} x2={VW} y2={y} stroke={GRATICULE_TICK} strokeWidth="0.5" opacity="0.55" />
              </g>
            );
          })}
          {/* Longitude labels along top + bottom edges */}
          {LNG_TICKS.map((lng) => {
            const [x] = proj(LAT_MAX, lng);
            if (x < 18 || x > VW - 18) return null;
            return (
              <g key={`lng-lbl-${lng}`}>
                <text
                  x={x}
                  y={9}
                  fontFamily="var(--font-mono)"
                  fontSize="7"
                  textAnchor="middle"
                  fill={GRATICULE_TICK}
                  letterSpacing="0.04em"
                  opacity="0.7"
                >
                  {fmtLng(lng)}
                </text>
                <text
                  x={x}
                  y={VH - 4}
                  fontFamily="var(--font-mono)"
                  fontSize="7"
                  textAnchor="middle"
                  fill={GRATICULE_TICK}
                  letterSpacing="0.04em"
                  opacity="0.7"
                >
                  {fmtLng(lng)}
                </text>
                <line x1={x} y1={0} x2={x} y2={4} stroke={GRATICULE_TICK} strokeWidth="0.5" opacity="0.55" />
                <line x1={x} y1={VH - 4} x2={x} y2={VH} stroke={GRATICULE_TICK} strokeWidth="0.5" opacity="0.55" />
              </g>
            );
          })}
        </g>


        {/* Landmasses */}
        <path d={pathFromPoly(PROJ_AFRICA)} fill={COUNTRY_FILL} stroke={COASTLINE} strokeWidth="0.8" />
        <path d={pathFromPoly(PROJ_ARABIA)} fill={ARABIA_FILL} stroke={COASTLINE} strokeWidth="0.8" />

        {/* Country borders (faint pink, dashed) */}
        <g opacity="0.85">
          {BORDERS.map((line, i) => (
            <path
              key={`b-${i}`}
              d={pathFromLine(line)}
              fill="none"
              stroke={COUNTRY_BORDER}
              strokeWidth="0.7"
              strokeDasharray="3 2"
            />
          ))}
        </g>

        {/* Hex cells with bipolar Delta coloring */}
        <g>
          {CELLS.map((c) => (
            <polygon
              key={c.key}
              points={hexPoints(c.cx, c.cy, HEX_R)}
              fill={c.fill}
              opacity={c.opacity}
            />
          ))}
        </g>

        {/* Country labels */}
        <g>
          {COUNTRY_LABELS.map((l) => {
            const [x, y] = proj(l.lat, l.lng);
            return (
              <text
                key={l.text}
                x={x}
                y={y}
                fontFamily="var(--font-sans)"
                fontSize={l.size ?? 10}
                textAnchor="middle"
                fill={LABEL_INK}
                letterSpacing="0.08em"
                fontWeight="500"
                opacity="0.75"
              >
                {l.text}
              </text>
            );
          })}
        </g>
      </g>
    </svg>
  );
}
