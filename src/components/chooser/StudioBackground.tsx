/**
 * Studio side background: PRISM map cutout with REAL country geometry.
 *
 * - Country fills + coastlines + internal borders use Natural Earth
 *   admin0 boundaries (world-atlas/countries-50m.json) projected via
 *   d3-geo. All projection runs at module load on the server — the
 *   client receives only pre-rendered SVG path strings.
 * - Frame is wider than the prior PRISM_01-tight crop: shows all of
 *   East Africa with breathing room into Sahel, North Africa, and the
 *   Arabian peninsula. Horn data clusters land in the upper-right of
 *   the viewBox.
 * - Hex layer (bipolar Delta colorway) stays scoped to a Horn-only
 *   mask so the hex grid appears where PRISM actually has coverage,
 *   not over the whole continent.
 * - Wrapping <g class="chooser-bg-drift"> is what gives the live-map
 *   feel — chooser.css runs a slow drift+scale loop on hover.
 */

import { geoPath, geoTransform } from 'd3-geo';
import { feature, mesh } from 'topojson-client';
// biome-ignore lint/suspicious/noExplicitAny: TopoJSON shape varies by source
import worldAtlas from 'world-atlas/countries-50m.json' with { type: 'json' };

const VW = 600;
const VH = 600;

// Frame — wider East Africa with surroundings, square aspect.
const LNG_MIN = -2;
const VIEW_W_DEG = 56;
const LAT_MAX = 30;
const VIEW_H_DEG = 50;

function proj(lat: number, lng: number): [number, number] {
  return [((lng - LNG_MIN) / VIEW_W_DEG) * VW, ((LAT_MAX - lat) / VIEW_H_DEG) * VH];
}

const transform = geoTransform({
  point(lng: number, lat: number) {
    // d3-geo streams in [lng, lat] order
    this.stream.point(((lng - LNG_MIN) / VIEW_W_DEG) * VW, ((LAT_MAX - lat) / VIEW_H_DEG) * VH);
  },
});

const pathFn = geoPath(transform);

// biome-ignore lint/suspicious/noExplicitAny: world-atlas TopoJSON is loose
const world = worldAtlas as unknown as any;
const countriesObj = world.objects.countries;
// biome-ignore lint/suspicious/noExplicitAny: feature() returns Feature<Geometry> | FeatureCollection
const allFeatures = (feature(world, countriesObj) as any).features as Array<{
  // biome-ignore lint/suspicious/noExplicitAny: GeoJSON geometry
  geometry: any;
  properties: { name: string };
}>;

const AFRICAN = new Set([
  'Sudan',
  'S. Sudan',
  'Ethiopia',
  'Eritrea',
  'Djibouti',
  'Somalia',
  'Kenya',
  'Uganda',
  'Tanzania',
  'Burundi',
  'Rwanda',
  'Egypt',
  'Libya',
  'Chad',
  'Niger',
  'Nigeria',
  'Cameroon',
  'Central African Rep.',
  'Congo',
  'Dem. Rep. Congo',
  'Mozambique',
  'Madagascar',
  'Malawi',
  'Zambia',
  'Zimbabwe',
  'Algeria',
  'Mali',
  'Burkina Faso',
  'Benin',
  'Togo',
  'Ghana',
  'Angola',
  'Botswana',
  'Senegal',
  'Mauritania',
]);

const ARABIAN = new Set([
  'Saudi Arabia',
  'Yemen',
  'Oman',
  'United Arab Emirates',
  'Qatar',
  'Bahrain',
  'Kuwait',
  'Iraq',
  'Iran',
  'Jordan',
  'Israel',
  'Palestine',
  'Syria',
  'Lebanon',
  'Turkey',
]);

const VISIBLE_NAMES = new Set([...AFRICAN, ...ARABIAN]);

const africaFeatures = allFeatures.filter((f) => AFRICAN.has(f.properties.name));
const arabiaFeatures = allFeatures.filter((f) => ARABIAN.has(f.properties.name));

const africaPaths = africaFeatures.map((f) => ({
  name: f.properties.name,
  d: pathFn(f) ?? '',
}));
const arabiaPaths = arabiaFeatures.map((f) => ({
  name: f.properties.name,
  d: pathFn(f) ?? '',
}));

// Mesh: scope to visible countries only so the path string isn't bloated
// with unused arcs.
const visibleObj = {
  type: 'GeometryCollection' as const,
  geometries: countriesObj.geometries.filter(
    // biome-ignore lint/suspicious/noExplicitAny: TopoJSON geometry has loose typing
    (g: any) => g.properties && VISIBLE_NAMES.has(g.properties.name),
  ),
};

// biome-ignore lint/suspicious/noExplicitAny: mesh's filter receives loose geometry refs
const INTERIOR_PATH = pathFn(mesh(world, visibleObj as any, (a: any, b: any) => a !== b)) ?? '';
// biome-ignore lint/suspicious/noExplicitAny: same as above
const COASTLINE_PATH = pathFn(mesh(world, visibleObj as any, (a: any, b: any) => a === b)) ?? '';

// Horn-only mask for hex coverage (PRISM only computes scores here)
const HEX_MASK_LL: Array<[number, number]> = [
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
const HEX_MASK = HEX_MASK_LL.map(([lat, lng]) => proj(lat, lng));

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
const HEX_R = 5.5;
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

interface Cluster {
  pos: [number, number];
  polarity: 'red' | 'teal';
  radius: number;
  intensity: number;
}

const CLUSTERS: Cluster[] = [
  { pos: proj(15.5, 32.5), polarity: 'red', radius: 38, intensity: 1.0 },
  { pos: proj(13, 24.5), polarity: 'red', radius: 28, intensity: 0.85 },
  { pos: proj(11, 33), polarity: 'teal', radius: 30, intensity: 0.8 },
  { pos: proj(13, 35), polarity: 'teal', radius: 22, intensity: 0.7 },
  { pos: proj(9.5, 39), polarity: 'red', radius: 26, intensity: 0.7 },
  { pos: proj(7, 38), polarity: 'teal', radius: 24, intensity: 0.6 },
  { pos: proj(9, 42), polarity: 'red', radius: 24, intensity: 0.7 },
  { pos: proj(3.5, 36), polarity: 'red', radius: 26, intensity: 0.75 },
  { pos: proj(2, 45), polarity: 'red', radius: 22, intensity: 0.7 },
  { pos: proj(7, 33), polarity: 'teal', radius: 22, intensity: 0.55 },
  { pos: proj(0, 41), polarity: 'red', radius: 22, intensity: 0.65 },
  { pos: proj(-1, 37.5), polarity: 'teal', radius: 20, intensity: 0.55 },
  { pos: proj(8, 27), polarity: 'teal', radius: 20, intensity: 0.5 },
  { pos: proj(5, 32), polarity: 'red', radius: 22, intensity: 0.6 },
];

function cellColor(cx: number, cy: number): { fill: string; opacity: number } {
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
  if (v < 0.04) return { fill: '#bcb6a8', opacity: 0.18 };
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
      if (!pointInPolygon(cx, cy, HEX_MASK)) continue;
      const c = cellColor(cx, cy);
      cells.push({ key: `${cx.toFixed(0)}-${cy.toFixed(0)}`, cx, cy, ...c });
    }
    row += 1;
  }
  return cells;
}

const CELLS = buildCells();

const COUNTRY_LABELS: Array<{ text: string; lat: number; lng: number; size?: number }> = [
  { text: 'EGYPT', lat: 26, lng: 30, size: 12 },
  { text: 'LIBYA', lat: 27, lng: 18, size: 12 },
  { text: 'ALGERIA', lat: 27, lng: 5, size: 11 },
  { text: 'SAUDI ARABIA', lat: 23, lng: 45, size: 11 },
  { text: 'YEMEN', lat: 15.3, lng: 47, size: 10 },
  { text: 'OMAN', lat: 21, lng: 56, size: 9 },
  { text: 'CHAD', lat: 16, lng: 19, size: 11 },
  { text: 'NIGER', lat: 17, lng: 9, size: 10 },
  { text: 'NIGERIA', lat: 9.5, lng: 8, size: 10 },
  { text: 'CAMEROON', lat: 5.5, lng: 12.5, size: 9 },
  { text: 'SUDAN', lat: 15.5, lng: 30, size: 13 },
  { text: 'ERITREA', lat: 15.3, lng: 38.6, size: 8 },
  { text: 'DJIBOUTI', lat: 11.6, lng: 43, size: 7 },
  { text: 'SOUTH SUDAN', lat: 7.5, lng: 30, size: 10 },
  { text: 'ETHIOPIA', lat: 8.5, lng: 39.5, size: 12 },
  { text: 'SOMALIA', lat: 4, lng: 47, size: 12 },
  { text: 'CENTRAL AFRICAN REPUBLIC', lat: 6.5, lng: 21, size: 7 },
  { text: 'UGANDA', lat: 1.5, lng: 32.5, size: 8 },
  { text: 'KENYA', lat: 0, lng: 38, size: 12 },
  { text: 'DEM. REP. OF THE CONGO', lat: -3, lng: 22, size: 8 },
  { text: 'TANZANIA', lat: -6, lng: 35, size: 11 },
  { text: 'MOZAMBIQUE', lat: -16, lng: 36, size: 10 },
  { text: 'MADAGASCAR', lat: -19, lng: 47, size: 10 },
  { text: 'ZAMBIA', lat: -14, lng: 27, size: 9 },
  { text: 'MALAWI', lat: -13, lng: 34, size: 8 },
];

const BASEMAP = '#f0eee6';
const COUNTRY_FILL = '#f7f5ee';
const ARABIA_FILL = '#f3f1ea';
const COUNTRY_BORDER = '#e6c8c5';
const COASTLINE = '#cfc8b6';
const LABEL_INK = '#a89f8e';
const GRATICULE_LINE = '#dad6c8';
const GRATICULE_TICK = '#a89f8e';

const LAT_TICKS = [-15, -10, -5, 0, 5, 10, 15, 20, 25];
const LNG_TICKS = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

function fmtLat(lat: number): string {
  if (lat === 0) return '0°';
  return `${Math.abs(lat)}°${lat > 0 ? 'N' : 'S'}`;
}
function fmtLng(lng: number): string {
  if (lng === 0) return '0°';
  return `${Math.abs(lng)}°${lng > 0 ? 'E' : 'W'}`;
}

export function StudioBackground() {
  return (
    <svg viewBox={`0 0 ${VW} ${VH}`} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect x="0" y="0" width={VW} height={VH} fill={BASEMAP} />

      <g className="chooser-bg-drift">
        {/* Lat/lng graticule */}
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
          {(() => {
            const [, y] = proj(0, LNG_MIN);
            return <line x1={0} y1={y} x2={VW} y2={y} stroke="#c8c2b0" strokeWidth="0.6" />;
          })()}
        </g>

        {/* Country fills */}
        <g>
          {arabiaPaths.map((p) => (
            <path key={`r-${p.name}`} d={p.d} fill={ARABIA_FILL} stroke="none" />
          ))}
          {africaPaths.map((p) => (
            <path key={`a-${p.name}`} d={p.d} fill={COUNTRY_FILL} stroke="none" />
          ))}
        </g>

        {/* Coastlines */}
        <path d={COASTLINE_PATH} fill="none" stroke={COASTLINE} strokeWidth="0.7" />

        {/* Internal country borders (faint pink, dashed) */}
        <path
          d={INTERIOR_PATH}
          fill="none"
          stroke={COUNTRY_BORDER}
          strokeWidth="0.55"
          strokeDasharray="3 2"
          opacity="0.85"
        />

        {/* Hex cells (bipolar Delta) over Horn region */}
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
                opacity="0.7"
              >
                {l.text}
              </text>
            );
          })}
        </g>

        {/* Degree labels along edges */}
        <g>
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
                <line
                  x1={0}
                  y1={y}
                  x2={4}
                  y2={y}
                  stroke={GRATICULE_TICK}
                  strokeWidth="0.5"
                  opacity="0.55"
                />
                <line
                  x1={VW - 4}
                  y1={y}
                  x2={VW}
                  y2={y}
                  stroke={GRATICULE_TICK}
                  strokeWidth="0.5"
                  opacity="0.55"
                />
              </g>
            );
          })}
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
                <line
                  x1={x}
                  y1={0}
                  x2={x}
                  y2={4}
                  stroke={GRATICULE_TICK}
                  strokeWidth="0.5"
                  opacity="0.55"
                />
                <line
                  x1={x}
                  y1={VH - 4}
                  x2={x}
                  y2={VH}
                  stroke={GRATICULE_TICK}
                  strokeWidth="0.5"
                  opacity="0.55"
                />
              </g>
            );
          })}
        </g>
      </g>
    </svg>
  );
}
