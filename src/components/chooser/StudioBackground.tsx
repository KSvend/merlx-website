/**
 * Studio side background: 1:1 PRISM screenshot match.
 *
 * Reproduces the actual PRISM map UI exactly:
 * - Light-grey water + cream-shell land via Natural Earth admin0 paths.
 * - Solid faint pink country borders (CARTO Positron style).
 * - Dense bipolar Delta hex carpet — most cells are faint grey
 *   (stable), cluster cells are red (escalating) or teal (de-escalating)
 *   matching the screenshot's distribution across Sudan, S. Sudan,
 *   Ethiopia, Kenya, Somalia, Tanzania, DRC border.
 * - Top-left PRISM controls panel: CONTROLS pill + view toggle
 *   (Conflict Systems / Hex active / Admin Areas) + mode toggle
 *   (Now / Trend / Delta active / Predicted / i) + legend with
 *   bipolar ramp, "Week-over-week change · 5,089", "threshold ≥ 0.25".
 * - City dots (Riyadh, Addis Ababa, Nairobi).
 * - Country labels in faint grey ALL-CAPS sans.
 *
 * Wrapping <g class="chooser-bg-drift"> animates the map content
 * (not the controls) so the cutout feels alive on hover.
 */

import { geoPath, geoTransform } from 'd3-geo';
import { feature, mesh } from 'topojson-client';
// biome-ignore lint/suspicious/noExplicitAny: TopoJSON shape varies by source
import worldAtlas from 'world-atlas/countries-50m.json' with { type: 'json' };

const VW = 600;
const VH = 600;

// Frame matches the PRISM screenshot: Riyadh top-right, Tanzania bottom,
// Chad top-left, Yemen right edge. Square aspect, no projection stretch.
const LNG_MIN = 14;
const VIEW_W_DEG = 38;
const LAT_MAX = 28;
const VIEW_H_DEG = 38;

function proj(lat: number, lng: number): [number, number] {
  return [((lng - LNG_MIN) / VIEW_W_DEG) * VW, ((LAT_MAX - lat) / VIEW_H_DEG) * VH];
}

const transform = geoTransform({
  point(lng: number, lat: number) {
    this.stream.point(((lng - LNG_MIN) / VIEW_W_DEG) * VW, ((LAT_MAX - lat) / VIEW_H_DEG) * VH);
  },
});
const pathFn = geoPath(transform);

// biome-ignore lint/suspicious/noExplicitAny: world-atlas TopoJSON is loose
const world = worldAtlas as unknown as any;
const countriesObj = world.objects.countries;
// biome-ignore lint/suspicious/noExplicitAny: feature() returns FeatureCollection
const allFeatures = (feature(world, countriesObj) as any).features as Array<{
  // biome-ignore lint/suspicious/noExplicitAny: GeoJSON geometry
  geometry: any;
  properties: { name: string };
}>;

const VISIBLE_NAMES = new Set([
  'Sudan',
  'S. Sudan',
  'Ethiopia',
  'Eritrea',
  'Djibouti',
  'Somalia',
  'Somaliland',
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

// H3-coverage mask — anywhere PRISM has data. Roughly: Africa east of
// Cameroon, south of Egypt, north of Tanzania border. Includes all the
// countries the screenshot shows hexes over.
const H3_COVERAGE_NAMES = new Set([
  'Sudan',
  'S. Sudan',
  'Ethiopia',
  'Eritrea',
  'Djibouti',
  'Somalia',
  'Somaliland',
  'Kenya',
  'Uganda',
  'Tanzania',
  'Burundi',
  'Rwanda',
  'Central African Rep.',
  'Dem. Rep. Congo',
  'Congo',
]);

const visibleFeatures = allFeatures.filter((f) => VISIBLE_NAMES.has(f.properties.name));
const h3Features = allFeatures.filter((f) => H3_COVERAGE_NAMES.has(f.properties.name));

// biome-ignore lint/suspicious/noExplicitAny: feature passthrough
const visiblePaths = visibleFeatures.map((f: any) => ({
  name: f.properties.name as string,
  d: pathFn(f) ?? '',
}));

const visibleObj = {
  type: 'GeometryCollection' as const,
  geometries: countriesObj.geometries.filter(
    // biome-ignore lint/suspicious/noExplicitAny: TopoJSON geometry typing
    (g: any) => g.properties && VISIBLE_NAMES.has(g.properties.name),
  ),
};
// biome-ignore lint/suspicious/noExplicitAny: mesh filter
const INTERIOR_PATH = pathFn(mesh(world, visibleObj as any, (a: any, b: any) => a !== b)) ?? '';
// biome-ignore lint/suspicious/noExplicitAny: mesh filter
const COASTLINE_PATH = pathFn(mesh(world, visibleObj as any, (a: any, b: any) => a === b)) ?? '';

// H3-coverage path used to mask hex cells to the data-coverage region.
const h3Obj = {
  type: 'GeometryCollection' as const,
  geometries: countriesObj.geometries.filter(
    // biome-ignore lint/suspicious/noExplicitAny: TopoJSON geometry typing
    (g: any) => g.properties && H3_COVERAGE_NAMES.has(g.properties.name),
  ),
};

// Compute a coarse bounding-box test for hex cells: only render hexes
// whose center falls within an H3 country. We project the country
// boundaries and use a rasterized lookup via a viewBox-sized array of
// "is this pixel land" — but since we need point-in-polygon, simpler:
// build all polygon rings and test each cell.

// Extract polygons from h3Features as projected ring arrays.
const H3_RINGS: Array<Array<[number, number]>> = [];
for (const f of h3Features) {
  // biome-ignore lint/suspicious/noExplicitAny: GeoJSON traversal
  const geom: any = f.geometry;
  const polys = geom.type === 'MultiPolygon' ? geom.coordinates : [geom.coordinates];
  for (const poly of polys) {
    for (const ring of poly) {
      const projected: Array<[number, number]> = ring.map(([lng, lat]: [number, number]) =>
        proj(lat, lng),
      );
      H3_RINGS.push(projected);
    }
  }
}

function pointInRing(x: number, y: number, ring: Array<[number, number]>): boolean {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i, i += 1) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
  }
  return inside;
}

function pointInH3Coverage(x: number, y: number): boolean {
  for (const ring of H3_RINGS) {
    if (pointInRing(x, y, ring)) return true;
  }
  return false;
}

// Hex grid (pointy-top, dense H3-res-ish)
const HEX_R = 2.4;
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
  // Darfur — strong red
  { pos: proj(13, 24.5), polarity: 'red', radius: 18, intensity: 0.9 },
  { pos: proj(11.5, 25.7), polarity: 'red', radius: 12, intensity: 0.7 },
  { pos: proj(15, 26), polarity: 'red', radius: 10, intensity: 0.55 },
  // Sudan east + Blue Nile
  { pos: proj(13, 35), polarity: 'teal', radius: 12, intensity: 0.65 },
  { pos: proj(11.5, 33.5), polarity: 'red', radius: 10, intensity: 0.5 },
  { pos: proj(15.5, 32), polarity: 'teal', radius: 8, intensity: 0.4 },
  // South Sudan / Bahr el-Ghazal / Upper Nile
  { pos: proj(8.5, 28), polarity: 'red', radius: 14, intensity: 0.75 },
  { pos: proj(7, 30), polarity: 'red', radius: 12, intensity: 0.7 },
  { pos: proj(6, 32), polarity: 'red', radius: 11, intensity: 0.65 },
  { pos: proj(8, 33.5), polarity: 'teal', radius: 10, intensity: 0.55 },
  // Ethiopia central / Addis
  { pos: proj(11, 39), polarity: 'red', radius: 10, intensity: 0.65 },
  { pos: proj(10, 40), polarity: 'teal', radius: 9, intensity: 0.55 },
  { pos: proj(8.5, 38), polarity: 'teal', radius: 11, intensity: 0.6 },
  { pos: proj(7, 38.5), polarity: 'red', radius: 10, intensity: 0.55 },
  // Ethiopia south / Somali region
  { pos: proj(7.5, 41.5), polarity: 'red', radius: 11, intensity: 0.6 },
  { pos: proj(6, 42.5), polarity: 'teal', radius: 9, intensity: 0.5 },
  // Northern Kenya / Turkana
  { pos: proj(3.5, 36), polarity: 'red', radius: 12, intensity: 0.7 },
  { pos: proj(2, 37), polarity: 'teal', radius: 9, intensity: 0.5 },
  // Central Kenya
  { pos: proj(0, 36.5), polarity: 'red', radius: 9, intensity: 0.55 },
  { pos: proj(-1.5, 37), polarity: 'teal', radius: 8, intensity: 0.5 },
  { pos: proj(-1, 38.5), polarity: 'red', radius: 9, intensity: 0.6 },
  // Mogadishu coast
  { pos: proj(2, 45), polarity: 'red', radius: 11, intensity: 0.7 },
  { pos: proj(0.5, 42.5), polarity: 'red', radius: 8, intensity: 0.5 },
  // Tanzania north + Lake Victoria
  { pos: proj(-3, 32), polarity: 'red', radius: 10, intensity: 0.6 },
  { pos: proj(-2, 33.5), polarity: 'teal', radius: 8, intensity: 0.45 },
  { pos: proj(-4, 35), polarity: 'red', radius: 9, intensity: 0.5 },
  // Uganda
  { pos: proj(1.5, 32.5), polarity: 'teal', radius: 9, intensity: 0.5 },
  { pos: proj(2.5, 31), polarity: 'red', radius: 8, intensity: 0.45 },
];

function clusterValue(cx: number, cy: number): { red: number; teal: number } {
  let red = 0;
  let teal = 0;
  for (const c of CLUSTERS) {
    const d = Math.hypot(cx - c.pos[0], cy - c.pos[1]);
    if (d > c.radius * 1.5) continue;
    const w = c.intensity * Math.exp(-(d * d) / (c.radius * c.radius * 0.55));
    if (c.polarity === 'red') red = Math.max(red, w);
    else teal = Math.max(teal, w);
  }
  return { red, teal };
}

// PRISM-faithful Delta colors.
// Red ramp (escalating): light → deep
// Teal ramp (de-escalating): light → deep
// Stable (carpet): faint grey
function cellColor(cx: number, cy: number): { fill: string; opacity: number } {
  const { red, teal } = clusterValue(cx, cy);
  const v = Math.max(red, teal);
  // Stable carpet — almost invisible against cream land, matches the
  // very faint H3 dot density in PRISM_01.
  if (v < 0.06) {
    return { fill: '#cfc8b6', opacity: 0.12 };
  }
  if (red > teal) {
    if (v > 0.7) return { fill: '#a83227', opacity: 0.95 };
    if (v > 0.5) return { fill: '#c44a3b', opacity: 0.88 };
    if (v > 0.3) return { fill: '#dc7864', opacity: 0.78 };
    if (v > 0.15) return { fill: '#e8a896', opacity: 0.55 };
    return { fill: '#cfc8b6', opacity: 0.22 };
  }
  if (v > 0.7) return { fill: '#1f4a42', opacity: 0.95 };
  if (v > 0.5) return { fill: '#2c6359', opacity: 0.85 };
  if (v > 0.3) return { fill: '#5c8480', opacity: 0.72 };
  if (v > 0.15) return { fill: '#9ab8b3', opacity: 0.5 };
  return { fill: '#cfc8b6', opacity: 0.22 };
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
      if (!pointInH3Coverage(cx, cy)) continue;
      cells.push({
        key: `${cx.toFixed(0)}-${cy.toFixed(0)}`,
        cx,
        cy,
        ...cellColor(cx, cy),
      });
    }
    row += 1;
  }
  return cells;
}

const CELLS = buildCells();

// City labels (small dot + name)
const CITIES: Array<{
  name: string;
  lat: number;
  lng: number;
  dx?: number;
  dy?: number;
  anchor?: 'start' | 'end';
}> = [
  { name: 'Riyadh', lat: 24.7, lng: 46.7, dx: 6, dy: -3 },
  { name: 'Khartoum', lat: 15.5, lng: 32.5, dx: 6, dy: 3 },
  { name: 'Asmara', lat: 15.3, lng: 38.9, dx: 6, dy: 3 },
  { name: 'Addis Ababa', lat: 9, lng: 38.7, dx: 6, dy: 2 },
  { name: 'Mogadishu', lat: 2, lng: 45.3, dx: 6, dy: 3 },
  { name: 'Nairobi', lat: -1.3, lng: 36.8, dx: 6, dy: 3 },
  { name: 'Kampala', lat: 0.3, lng: 32.6, dx: -6, dy: 3, anchor: 'end' },
  { name: 'Juba', lat: 4.85, lng: 31.6, dx: 6, dy: 2 },
];

const COUNTRY_LABELS: Array<{
  text: string;
  lat: number;
  lng: number;
  size?: number;
  lines?: string[];
}> = [
  { text: 'EGYPT', lat: 26, lng: 30, size: 9 },
  { text: 'CHAD', lat: 16, lng: 18, size: 9 },
  { text: 'SUDAN', lat: 15, lng: 30, size: 10 },
  { text: 'ERITREA', lat: 15.3, lng: 38.5, size: 7.5 },
  { text: 'DJIBOUTI', lat: 11.6, lng: 43, size: 6.5 },
  { text: 'YEMEN', lat: 15.5, lng: 47, size: 9 },
  { text: 'SAUDI ARABIA', lat: 23, lng: 44.5, size: 8.5 },
  { text: 'SOUTH SUDAN', lat: 7.5, lng: 30, size: 8.5 },
  { text: 'ETHIOPIA', lat: 8.5, lng: 39.5, size: 10 },
  { text: 'SOMALIA', lat: 4, lng: 47, size: 10 },
  {
    text: 'CENTRAL AFRICAN',
    lat: 6.5,
    lng: 21,
    size: 8,
    lines: ['CENTRAL AFRICAN', 'REPUBLIC'],
  },
  { text: 'UGANDA', lat: 1, lng: 32.5, size: 8 },
  { text: 'KENYA', lat: 0, lng: 38.5, size: 10 },
  { text: 'RWANDA', lat: -2, lng: 30, size: 7 },
  { text: 'BURUNDI', lat: -3, lng: 30, size: 7 },
  {
    text: 'DEM. REP. OF THE CONGO',
    lat: -3,
    lng: 22,
    size: 8,
    lines: ['DEMOCRATIC', 'REPUBLIC OF', 'THE CONGO'],
  },
  { text: 'TANZANIA', lat: -7, lng: 35, size: 9 },
];

// MERLx-aligned tokens (per the design guide §2 + per-product PRISM look)
const WATER = '#e7e3d6'; // slightly cooler than land (Positron-style sea)
const LAND_FILL = '#f5f3ee'; // shell
const COUNTRY_BORDER = '#e6c8c5'; // CARTO Positron pink, solid
const COASTLINE = '#9e9e9e'; // ink-faint
const LABEL_INK = '#9e9e9e'; // ink-faint
const PANEL_FILL = '#FFFFFF';
const PANEL_BORDER = '#E5E1DA';
const INK = '#111111';
const INK_MUTED = '#6B6B6B';
const INK_FAINT = '#9E9E9E';
const IRIS = '#8071BC';
const DEEP_TEAL = '#1A3A34';

// Bipolar Delta legend ramp colors
const RAMP_TEAL_DARK = '#1f4a42';
const RAMP_TEAL_MID = '#5c8480';
const RAMP_GREY = '#cfcabc';
const RAMP_RED_MID = '#c44a3b';
const RAMP_RED_DARK = '#a83227';

export function StudioBackground() {
  return (
    <svg viewBox={`0 0 ${VW} ${VH}`} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      {/* Near-white field — replaces the cream tint that previously
       * filled the chooser panel. Brand mark and map sit on top. */}
      <rect x="0" y="0" width={VW} height={VH} fill="#FAFAF7" />

      {/* DEFAULT-STATE BRAND MARK — full company-profile cover layout
       * scaled into the chooser panel. Deep-teal rect dominant on right,
       * iris teardrop centre, orange circle left, MERLx wordmark below
       * the composition, italic tagline. Sized so the geometric pieces
       * are PRESENT (visible color blocks) without flooding the panel
       * with a cream tint. */}
      <g className="brand-mark">
        {/* Top-left version annotation — like the cover */}
        <text
          x={26}
          y={36}
          fontFamily="var(--font-mono)"
          fontSize="9"
          letterSpacing="0.18em"
          fill="#6B6B6B"
        >
          STUDIO
        </text>
        <text
          x={VW - 26}
          y={36}
          fontFamily="var(--font-mono)"
          fontSize="9"
          letterSpacing="0.18em"
          fill="#9E9E9E"
          textAnchor="end"
        >
          V2026.04
        </text>

        {/* Logo composition — centred, large, like the cover.
         * Total composition spans ~280px wide × ~200px tall, sitting
         * in the upper-middle of the panel. */}
        <g transform={`translate(${VW / 2 - 140}, ${VH * 0.32})`}>
          {/* Orange filled circle — left, dominant Studio mark */}
          <circle cx="40" cy="100" r="46" fill="#CA5D0F" className="brand-mark-pulse" />
          {/* Iris teardrop (pin shape) — centre */}
          <path
            d="M 130 38 q -34 0 -34 34 q 0 34 34 68 q 34 -34 34 -68 q 0 -34 -34 -34 z"
            fill="#4A3F6B"
          />
          {/* Deep-teal rectangle — right, the federation/structure mark */}
          <rect x="220" y="0" width="60" height="200" fill="#1A3A34" />
        </g>

        {/* MERLx wordmark — serif, big, with x in iris */}
        <text
          x={VW / 2}
          y={VH * 0.62}
          fontFamily="var(--font-serif)"
          fontSize="64"
          fontWeight="700"
          textAnchor="middle"
          fill="#1a1a1a"
          letterSpacing="-0.01em"
        >
          MERL<tspan fill="#8071BC">x</tspan>
        </text>
        {/* Italic tagline */}
        <text
          x={VW / 2}
          y={VH * 0.68}
          fontFamily="var(--font-serif)"
          fontStyle="italic"
          fontSize="17"
          textAnchor="middle"
          fill="#2A2A2A"
        >
          Advanced analytics for humanitarian
        </text>
        <text
          x={VW / 2}
          y={VH * 0.71}
          fontFamily="var(--font-serif)"
          fontStyle="italic"
          fontSize="17"
          textAnchor="middle"
          fill="#2A2A2A"
        >
          and peacebuilding programming.
        </text>
        {/* Iris underline accent — like the cover */}
        <line
          x1={VW / 2 - 36}
          y1={VH * 0.74}
          x2={VW / 2 + 36}
          y2={VH * 0.74}
          stroke="#8071BC"
          strokeWidth="2"
        />

        {/* Bottom row — practice / focus split, mirroring cover */}
        <line x1={26} y1={VH - 60} x2={VW - 26} y2={VH - 60} stroke="#E5E1DA" strokeWidth="0.6" />
        <text
          x={26}
          y={VH - 38}
          fontFamily="var(--font-mono)"
          fontSize="8"
          letterSpacing="0.18em"
          fill="#6B6B6B"
        >
          PRACTICE
        </text>
        <text x={26} y={VH - 22} fontFamily="var(--font-mono)" fontSize="9" fill="#2A2A2A">
          Research · MERL · Early warning
        </text>
        <text
          x={VW * 0.55}
          y={VH - 38}
          fontFamily="var(--font-mono)"
          fontSize="8"
          letterSpacing="0.18em"
          fill="#6B6B6B"
        >
          FOCUS
        </text>
        <text x={VW * 0.55} y={VH - 22} fontFamily="var(--font-mono)" fontSize="9" fill="#2A2A2A">
          Global development · peacebuilding
        </text>
      </g>

      {/* HOVER-STATE MAP COMPOSITION — fades in on hover */}
      <g className="brand-map">
        <rect x="0" y="0" width={VW} height={VH} fill={WATER} />
        <g className="chooser-bg-drift">
          {/* Land fills */}
          <g>
            {visiblePaths.map((p) => (
              <path key={`land-${p.name}`} d={p.d} fill={LAND_FILL} stroke="none" />
            ))}
          </g>

          {/* Internal country borders — solid faint pink, CARTO style */}
          <path
            d={INTERIOR_PATH}
            fill="none"
            stroke={COUNTRY_BORDER}
            strokeWidth="0.55"
            opacity="0.85"
          />

          {/* Coastlines — slightly darker grey */}
          <path
            d={COASTLINE_PATH}
            fill="none"
            stroke={COASTLINE}
            strokeWidth="0.5"
            opacity="0.55"
          />

          {/* Hex cells — bipolar Delta carpet */}
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

          {/* City dots */}
          <g>
            {CITIES.map((city) => {
              const [cx, cy] = proj(city.lat, city.lng);
              return (
                <g key={`city-${city.name}`}>
                  <circle cx={cx} cy={cy} r="2" fill={INK} opacity="0.7" />
                  <text
                    x={cx + (city.dx ?? 5)}
                    y={cy + (city.dy ?? 2)}
                    fontFamily="var(--font-sans)"
                    fontSize="8.5"
                    fill={INK_MUTED}
                    letterSpacing="0.02em"
                    textAnchor={city.anchor ?? 'start'}
                  >
                    {city.name}
                  </text>
                </g>
              );
            })}
          </g>

          {/* Country labels — faint grey ALL CAPS sans, multi-line where needed */}
          <g>
            {COUNTRY_LABELS.map((l) => {
              const [x, y] = proj(l.lat, l.lng);
              const size = l.size ?? 10;
              if (l.lines) {
                return (
                  <text
                    key={`lbl-${l.text}`}
                    x={x}
                    y={y}
                    fontFamily="var(--font-sans)"
                    fontSize={size}
                    textAnchor="middle"
                    fill={LABEL_INK}
                    letterSpacing="0.08em"
                    fontWeight="500"
                    opacity="0.75"
                  >
                    {l.lines.map((line, i) => (
                      <tspan key={`${l.text}-${i}-${line}`} x={x} dy={i === 0 ? 0 : size + 2}>
                        {line}
                      </tspan>
                    ))}
                  </text>
                );
              }
              return (
                <text
                  key={`lbl-${l.text}`}
                  x={x}
                  y={y}
                  fontFamily="var(--font-sans)"
                  fontSize={size}
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

        {/* Top-right metadata strip — PRISM date + frame counter +
         * mode dropdown, rendered as flat mono text without panel chrome.
         * Mirrors PRISM_01's '23 Mar 2026 · 51/57 · Crisis Risk Score'. */}
        <g>
          <text
            x={VW - 22}
            y={62}
            fontFamily="var(--font-mono)"
            fontSize="8.5"
            fill="#1a1a1a"
            textAnchor="end"
            letterSpacing="0.02em"
          >
            23 Mar 2026
          </text>
          <text
            x={VW - 22}
            y={76}
            fontFamily="var(--font-mono)"
            fontSize="7.5"
            fill="#9E9E9E"
            textAnchor="end"
            letterSpacing="0.04em"
          >
            51 / 57 · Crisis Risk Score
          </text>
        </g>

        {/* PRISM controls panel — top-right, with safe y offset so the
         * top doesn't crop when the chooser panel is taller than wide
         * (which slices the top/bottom of a 1:1 viewBox). Does NOT drift.
         * Sits inside .brand-map so it fades in with the rest of the map. */}
        <g transform={`translate(${VW - 264}, 96)`}>
          {/* CONTROLS pill */}
          <g>
            <rect
              x="0"
              y="0"
              width="78"
              height="20"
              rx="3"
              fill={PANEL_FILL}
              stroke={PANEL_BORDER}
              strokeWidth="0.5"
            />
            <text
              x="10"
              y="13.5"
              fontFamily="var(--font-mono)"
              fontSize="8.5"
              letterSpacing="0.16em"
              fill={INK}
              fontWeight="500"
            >
              CONTROLS
            </text>
            <text
              x="68"
              y="13.5"
              fontFamily="var(--font-mono)"
              fontSize="8.5"
              fill={INK_MUTED}
              textAnchor="middle"
            >
              ‹
            </text>
          </g>

          {/* View toggle (Conflict Systems / Hex / Admin Areas) */}
          <g transform="translate(0, 28)">
            <rect
              x="0"
              y="0"
              width="244"
              height="22"
              rx="3"
              fill={PANEL_FILL}
              stroke={PANEL_BORDER}
              strokeWidth="0.5"
            />
            <text
              x="48"
              y="14.5"
              fontFamily="var(--font-mono)"
              fontSize="9"
              textAnchor="middle"
              fill={INK_MUTED}
            >
              Conflict Systems
            </text>
            <line x1="96" y1="4" x2="96" y2="18" stroke={PANEL_BORDER} strokeWidth="0.5" />
            {/* Hex active in deep-teal */}
            <rect x="96" y="0" width="48" height="22" rx="3" fill={DEEP_TEAL} />
            <text
              x="120"
              y="14.5"
              fontFamily="var(--font-mono)"
              fontSize="9"
              textAnchor="middle"
              fill="#FFFFFF"
              fontWeight="500"
            >
              Hex
            </text>
            <line x1="144" y1="4" x2="144" y2="18" stroke={PANEL_BORDER} strokeWidth="0.5" />
            <text
              x="194"
              y="14.5"
              fontFamily="var(--font-mono)"
              fontSize="9"
              textAnchor="middle"
              fill={INK_MUTED}
            >
              Admin Areas
            </text>
          </g>

          {/* Mode toggle (Now / Trend / Delta / Predicted / i) */}
          <g transform="translate(0, 58)">
            <rect
              x="0"
              y="0"
              width="244"
              height="22"
              rx="3"
              fill={PANEL_FILL}
              stroke={PANEL_BORDER}
              strokeWidth="0.5"
            />
            <text
              x="22"
              y="14.5"
              fontFamily="var(--font-mono)"
              fontSize="9"
              textAnchor="middle"
              fill={INK_MUTED}
            >
              Now
            </text>
            <line x1="44" y1="4" x2="44" y2="18" stroke={PANEL_BORDER} strokeWidth="0.5" />
            <text
              x="74"
              y="14.5"
              fontFamily="var(--font-mono)"
              fontSize="9"
              textAnchor="middle"
              fill={INK_MUTED}
            >
              Trend
            </text>
            <line x1="104" y1="4" x2="104" y2="18" stroke={PANEL_BORDER} strokeWidth="0.5" />
            {/* Delta active in iris */}
            <rect x="104" y="0" width="46" height="22" rx="3" fill={IRIS} />
            <text
              x="127"
              y="14.5"
              fontFamily="var(--font-mono)"
              fontSize="9"
              textAnchor="middle"
              fill="#FFFFFF"
              fontWeight="500"
            >
              Delta
            </text>
            <line x1="150" y1="4" x2="150" y2="18" stroke={PANEL_BORDER} strokeWidth="0.5" />
            <text
              x="182"
              y="14.5"
              fontFamily="var(--font-mono)"
              fontSize="9"
              textAnchor="middle"
              fill={INK_MUTED}
            >
              Predicted
            </text>
            <line x1="214" y1="4" x2="214" y2="18" stroke={PANEL_BORDER} strokeWidth="0.5" />
            <text
              x="229"
              y="14.5"
              fontFamily="var(--font-mono)"
              fontSize="9"
              textAnchor="middle"
              fill={INK_MUTED}
              fontStyle="italic"
            >
              i
            </text>
          </g>

          {/* Legend — bipolar ramp + delta count + threshold */}
          <g transform="translate(0, 88)">
            <rect
              x="0"
              y="0"
              width="244"
              height="64"
              rx="3"
              fill={PANEL_FILL}
              stroke={PANEL_BORDER}
              strokeWidth="0.5"
            />
            {/* Bipolar gradient ramp */}
            <defs>
              <linearGradient id="delta-ramp" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={RAMP_TEAL_DARK} />
                <stop offset="25%" stopColor={RAMP_TEAL_MID} />
                <stop offset="50%" stopColor={RAMP_GREY} />
                <stop offset="75%" stopColor={RAMP_RED_MID} />
                <stop offset="100%" stopColor={RAMP_RED_DARK} />
              </linearGradient>
            </defs>
            <rect x="10" y="10" width="224" height="6" fill="url(#delta-ramp)" />
            <text
              x="10"
              y="26"
              fontFamily="var(--font-mono)"
              fontSize="7.5"
              fill={INK_MUTED}
              letterSpacing="0.04em"
            >
              de-escalating
            </text>
            <text
              x="122"
              y="26"
              fontFamily="var(--font-mono)"
              fontSize="7.5"
              fill={INK_MUTED}
              textAnchor="middle"
              letterSpacing="0.04em"
            >
              stable
            </text>
            <text
              x="234"
              y="26"
              fontFamily="var(--font-mono)"
              fontSize="7.5"
              fill={INK_MUTED}
              textAnchor="end"
              letterSpacing="0.04em"
            >
              escalating
            </text>
            <text
              x="10"
              y="44"
              fontFamily="var(--font-mono)"
              fontSize="9"
              fill={INK}
              fontWeight="500"
            >
              Week-over-week change
            </text>
            <text
              x="234"
              y="44"
              fontFamily="var(--font-mono)"
              fontSize="9"
              fill={INK}
              textAnchor="end"
              fontWeight="500"
            >
              5,089
            </text>
            <text
              x="10"
              y="56"
              fontFamily="var(--font-mono)"
              fontSize="7.5"
              fill={INK_FAINT}
              letterSpacing="0.04em"
            >
              threshold ≥ 0.25
            </text>
          </g>
        </g>
      </g>
    </svg>
  );
}
