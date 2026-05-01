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

// biome-ignore lint/suspicious/noExplicitAny: feature objects pass through unchanged
const africaPaths = africaFeatures.map((f: any) => ({
  name: f.properties.name as string,
  d: pathFn(f) ?? '',
}));
// biome-ignore lint/suspicious/noExplicitAny: same as above
const arabiaPaths = arabiaFeatures.map((f: any) => ({
  name: f.properties.name as string,
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

// Hex grid (pointy-top, H3-ish density) — small + dense like real H3 res-6/7
const HEX_R = 2.6;
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
  radius: number;
  intensity: number;
}

// Sequential heat clusters using MERLx orange register only (Studio side
// = warmth/risk register; teal lives on the Network half).
const CLUSTERS: Cluster[] = [
  // Sudan
  { pos: proj(15.5, 32.5), radius: 14, intensity: 1.0 },
  { pos: proj(14.2, 31.5), radius: 10, intensity: 0.8 },
  { pos: proj(13.8, 33.6), radius: 9, intensity: 0.6 },
  // Darfur
  { pos: proj(13, 24.5), radius: 11, intensity: 0.85 },
  { pos: proj(11.5, 25.7), radius: 8, intensity: 0.6 },
  // South Sudan
  { pos: proj(8, 31), radius: 9, intensity: 0.7 },
  { pos: proj(9, 28), radius: 8, intensity: 0.5 },
  { pos: proj(6.5, 30.5), radius: 7, intensity: 0.5 },
  // Ethiopia
  { pos: proj(13.6, 39.5), radius: 9, intensity: 0.65 },
  { pos: proj(11.8, 39.7), radius: 8, intensity: 0.6 },
  { pos: proj(9.5, 39), radius: 9, intensity: 0.7 },
  { pos: proj(7.5, 38.5), radius: 8, intensity: 0.55 },
  { pos: proj(7.2, 41.5), radius: 9, intensity: 0.6 },
  // Somalia / Ogaden
  { pos: proj(8.8, 43), radius: 9, intensity: 0.7 },
  { pos: proj(6.2, 44.2), radius: 7, intensity: 0.55 },
  // N Kenya
  { pos: proj(3.5, 36), radius: 10, intensity: 0.75 },
  { pos: proj(2.5, 37.8), radius: 7, intensity: 0.45 },
  // Mogadishu
  { pos: proj(2, 45), radius: 9, intensity: 0.7 },
  { pos: proj(0.5, 42.7), radius: 7, intensity: 0.5 },
  // Kenya
  { pos: proj(-1, 37.5), radius: 7, intensity: 0.5 },
  { pos: proj(-2.5, 39.5), radius: 6, intensity: 0.4 },
  // Uganda
  { pos: proj(0.8, 32.4), radius: 7, intensity: 0.45 },
];

function cellColor(cx: number, cy: number): { fill: string; opacity: number } | null {
  let v = 0;
  for (const c of CLUSTERS) {
    const d = Math.hypot(cx - c.pos[0], cy - c.pos[1]);
    if (d > c.radius * 1.5) continue;
    const w = c.intensity * Math.exp(-(d * d) / (c.radius * c.radius * 0.5));
    if (w > v) v = w;
  }
  if (v < 0.18) return null;
  // MERLx orange ramp — sequential warmth (cream → orange → orange-hot)
  if (v > 0.78) return { fill: '#7a2a0a', opacity: 0.95 }; // orange-hot deepest
  if (v > 0.6) return { fill: '#a8421a', opacity: 0.9 };
  if (v > 0.42) return { fill: '#c8682a', opacity: 0.82 };
  if (v > 0.28) return { fill: '#dca06a', opacity: 0.7 };
  return { fill: '#ecccaa', opacity: 0.58 };
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
      if (!c) continue;
      cells.push({ key: `${cx.toFixed(0)}-${cy.toFixed(0)}`, cx, cy, ...c });
    }
    row += 1;
  }
  return cells;
}

const CELLS = buildCells();

// Sidebar feature-importance bars — gives a "deep learning is happening"
// signal without being a literal model dump.
const FEATURE_BARS = [
  { name: 'conflict', val: 0.34 },
  { name: 'food', val: 0.21 },
  { name: 'climate', val: 0.18 },
  { name: 'actors', val: 0.14 },
  { name: 'structural', val: 0.09 },
  { name: 'spatial', val: 0.04 },
];

const LOG_LINES = [
  '[14:32:08] load tensor(5089, 52)',
  '[14:32:09] inflate r=5 d=0.85',
  '[14:32:11] postsmooth ok',
  '[14:32:11] write 5089 → cells',
  '[14:32:11] mode=delta · w/w',
];

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
const COUNTRY_FILL = '#f4f2eb';
const ARABIA_FILL = '#f1efe8';
const COUNTRY_BORDER = '#e6c8c5';
const COASTLINE = '#cfc8b6';
const LABEL_INK = '#a89f8e';

export function StudioBackground() {
  return (
    <svg viewBox={`0 0 ${VW} ${VH}`} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect x="0" y="0" width={VW} height={VH} fill={BASEMAP} />

      <g className="chooser-bg-drift">
        {/* Blueprint grid — regular px grid, minor + major + corner ticks.
         * Reads as engineering drawing, not cartographic graticule. */}
        <g opacity="0.45">
          {Array.from({ length: Math.floor(VW / 30) + 1 }, (_, i) => i * 30).map((x) => (
            <line
              key={`bp-mv-${x}`}
              x1={x}
              y1={0}
              x2={x}
              y2={VH}
              stroke="#dcd8ca"
              strokeWidth="0.3"
            />
          ))}
          {Array.from({ length: Math.floor(VH / 30) + 1 }, (_, i) => i * 30).map((y) => (
            <line
              key={`bp-mh-${y}`}
              x1={0}
              y1={y}
              x2={VW}
              y2={y}
              stroke="#dcd8ca"
              strokeWidth="0.3"
            />
          ))}
        </g>
        <g opacity="0.7">
          {[0, 150, 300, 450, 600].map((x) => (
            <line
              key={`bp-Mv-${x}`}
              x1={x}
              y1={0}
              x2={x}
              y2={VH}
              stroke="#bdb7a6"
              strokeWidth="0.45"
            />
          ))}
          {[0, 150, 300, 450, 600].map((y) => (
            <line
              key={`bp-Mh-${y}`}
              x1={0}
              y1={y}
              x2={VW}
              y2={y}
              stroke="#bdb7a6"
              strokeWidth="0.45"
            />
          ))}
        </g>
        {/* Corner crosses at major intersections */}
        <g opacity="0.55">
          {[0, 150, 300, 450, 600].map((x) =>
            [0, 150, 300, 450, 600].map((y) => (
              <g key={`bp-x-${x}-${y}`}>
                <line x1={x - 4} y1={y} x2={x + 4} y2={y} stroke="#8a8474" strokeWidth="0.6" />
                <line x1={x} y1={y - 4} x2={x} y2={y + 4} stroke="#8a8474" strokeWidth="0.6" />
              </g>
            )),
          )}
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

        {/* Right-side data-science sidebar — model header, feature
         * importance bars, log line stream. All mono, faint, restrained. */}
        <g transform={`translate(${VW - 162}, 22)`}>
          <rect
            x="0"
            y="0"
            width="148"
            height={VH - 60}
            rx="2"
            fill="#fafaf6"
            stroke="#bdb7a6"
            strokeWidth="0.5"
            opacity="0.78"
          />

          {/* Header */}
          <text
            x="10"
            y="16"
            fontFamily="var(--font-mono)"
            fontSize="9"
            letterSpacing="0.16em"
            fill="var(--color-orange-hot, #7a2a0a)"
            fontWeight="500"
          >
            PRISM · v1.5
          </text>
          <line x1="10" y1="22" x2="138" y2="22" stroke="#bdb7a6" strokeWidth="0.4" opacity="0.6" />
          <text
            x="10"
            y="34"
            fontFamily="var(--font-mono)"
            fontSize="7.5"
            fill="#7a786f"
            letterSpacing="0.04em"
          >
            tensor[5089, 52]
          </text>
          <text
            x="10"
            y="44"
            fontFamily="var(--font-mono)"
            fontSize="7.5"
            fill="#7a786f"
            letterSpacing="0.04em"
          >
            model · 9a7f3b2
          </text>

          {/* Feature importance bars */}
          <text
            x="10"
            y="64"
            fontFamily="var(--font-mono)"
            fontSize="7"
            letterSpacing="0.16em"
            fill="#7a786f"
            opacity="0.85"
          >
            FEATURE IMPORTANCE
          </text>
          {FEATURE_BARS.map((f, i) => {
            const y = 76 + i * 14;
            const barW = f.val * 130;
            return (
              <g key={`fb-${f.name}`}>
                <text x="10" y={y + 5} fontFamily="var(--font-mono)" fontSize="7.5" fill="#3a3a3a">
                  {f.name}
                </text>
                <rect x="62" y={y} width="76" height="6" fill="#e8e4d4" opacity="0.7" />
                <rect
                  x="62"
                  y={y}
                  width={Math.min(barW, 76)}
                  height="6"
                  fill="var(--color-orange, #c8682a)"
                  opacity="0.85"
                />
                <text
                  x="138"
                  y={y + 5}
                  fontFamily="var(--font-mono)"
                  fontSize="7"
                  textAnchor="end"
                  fill="#7a786f"
                >
                  {f.val.toFixed(2)}
                </text>
              </g>
            );
          })}

          {/* Loss curve */}
          <text
            x="10"
            y="180"
            fontFamily="var(--font-mono)"
            fontSize="7"
            letterSpacing="0.16em"
            fill="#7a786f"
            opacity="0.85"
          >
            LOSS · EPOCH 4 / 4
          </text>
          <g transform="translate(10, 188)">
            <rect x="0" y="0" width="128" height="22" fill="#f0ede4" opacity="0.5" />
            <polyline
              points="0,18 16,15 32,12 48,8 64,9 80,7 96,5 112,4 128,3"
              fill="none"
              stroke="var(--color-orange, #c8682a)"
              strokeWidth="0.9"
              opacity="0.85"
            />
            <circle cx="128" cy="3" r="1.6" fill="var(--color-orange-hot, #7a2a0a)" />
          </g>
          <text x="10" y="222" fontFamily="var(--font-mono)" fontSize="7" fill="#7a786f">
            loss 0.0218
          </text>

          {/* Log lines */}
          <text
            x="10"
            y="248"
            fontFamily="var(--font-mono)"
            fontSize="7"
            letterSpacing="0.16em"
            fill="#7a786f"
            opacity="0.85"
          >
            INFERENCE LOG
          </text>
          {LOG_LINES.map((line, i) => (
            <text
              key={`log-${i}-${line.length}`}
              x="10"
              y={262 + i * 12}
              fontFamily="var(--font-mono)"
              fontSize="7"
              fill="#3a3a3a"
              opacity="0.85"
            >
              {line}
            </text>
          ))}

          {/* Footer status */}
          <line
            x1="10"
            y1={VH - 88}
            x2="138"
            y2={VH - 88}
            stroke="#bdb7a6"
            strokeWidth="0.4"
            opacity="0.6"
          />
          <circle
            cx="14"
            cy={VH - 78}
            r="2"
            fill="var(--color-orange-hot, #7a2a0a)"
            opacity="0.85"
          />
          <text
            x="22"
            y={VH - 75}
            fontFamily="var(--font-mono)"
            fontSize="7.5"
            fill="#3a3a3a"
            letterSpacing="0.06em"
          >
            LIVE · w/w delta
          </text>
          <text x="10" y={VH - 64} fontFamily="var(--font-mono)" fontSize="7" fill="#7a786f">
            27 MAR 2026 · 5089
          </text>
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
      </g>
    </svg>
  );
}
