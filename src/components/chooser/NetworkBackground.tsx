/**
 * Network side background: federated MERL ops map — same chrome
 * discipline as the Studio PRISM cutout (no controls, no panels,
 * no attribution). CARTO-style basemap, faint graticule, continent
 * dots, nine federated nodes with NileX active, dashed link mesh.
 *
 * The wrapping <g class="chooser-bg-drift"> drifts on hover (CSS
 * keyframes in chooser.css) for the same "live map feel" as Studio.
 *
 * Static. Animation deferred.
 */

const VW = 600;
const VH = 360;

const LNG_MIN = -120;
const LNG_W = 300;
const LAT_MAX = 65;
const LAT_H = 105;

function proj(lat: number, lng: number): [number, number] {
  return [((lng - LNG_MIN) / LNG_W) * VW, ((LAT_MAX - lat) / LAT_H) * VH];
}

const LAND_DOTS: Array<[number, number]> = [];
const STEP_LNG = 3;

const LAND_BANDS: Array<[number, Array<[number, number]>]> = [
  // North America
  [62, [[-150, -65]]],
  [60, [[-150, -60]]],
  [55, [[-130, -55]]],
  [50, [[-125, -55]]],
  [45, [[-122, -60]]],
  [40, [[-120, -72]]],
  [35, [[-118, -77]]],
  [30, [[-110, -80]]],
  [25, [[-110, -80]]],
  [
    20,
    [
      [-105, -85],
      [-78, -72],
    ],
  ],
  [
    15,
    [
      [-95, -85],
      [-77, -72],
    ],
  ],
  [10, [[-87, -78]]],
  // South America
  [5, [[-78, -50]]],
  [0, [[-78, -50]]],
  [-5, [[-78, -38]]],
  [-10, [[-77, -36]]],
  [-15, [[-72, -38]]],
  [-20, [[-70, -42]]],
  [-25, [[-70, -45]]],
  [-30, [[-72, -55]]],
  [-35, [[-72, -58]]],
  // Europe
  [60, [[-7, 30]]],
  [55, [[-8, 38]]],
  [50, [[-5, 40]]],
  [45, [[-5, 45]]],
  [40, [[-9, 28]]],
  [37, [[-9, 28]]],
  // North Africa
  [30, [[-8, 32]]],
  [25, [[-15, 36]]],
  [20, [[-15, 38]]],
  [15, [[-15, 40]]],
  [10, [[-12, 42]]],
  [5, [[-8, 45]]],
  // Sub-Saharan Africa
  [0, [[8, 45]]],
  [-5, [[12, 40]]],
  [-10, [[12, 40]]],
  [-15, [[12, 40]]],
  [-20, [[14, 36]]],
  [-25, [[14, 33]]],
  [-30, [[16, 32]]],
  // Middle East
  [35, [[28, 60]]],
  [30, [[34, 60]]],
  [25, [[36, 58]]],
  // Russia / Central Asia
  [60, [[33, 175]]],
  [55, [[35, 175]]],
  [50, [[28, 140]]],
  [45, [[35, 140]]],
  [40, [[40, 135]]],
  // South Asia
  [35, [[68, 95]]],
  [30, [[68, 95]]],
  [25, [[68, 96]]],
  [20, [[70, 95]]],
  [15, [[72, 92]]],
  [10, [[75, 88]]],
  // SE Asia / Indonesia
  [20, [[98, 122]]],
  [15, [[98, 122]]],
  [10, [[98, 124]]],
  [5, [[95, 130]]],
  [0, [[100, 132]]],
  [-5, [[105, 140]]],
  [-10, [[110, 145]]],
  // Australia
  [-15, [[122, 144]]],
  [-20, [[115, 148]]],
  [-25, [[115, 152]]],
  [-30, [[115, 152]]],
  [-35, [[118, 148]]],
];

for (const [lat, ranges] of LAND_BANDS) {
  for (const [lngStart, lngEnd] of ranges) {
    for (let lng = lngStart; lng <= lngEnd; lng += STEP_LNG) {
      LAND_DOTS.push(proj(lat, lng));
    }
  }
}

interface NodeDef {
  id: string;
  lat: number;
  lng: number;
  label: string;
  active?: boolean;
  labelDx?: number;
  labelDy?: number;
  anchor?: 'start' | 'end';
}

const NODES: NodeDef[] = [
  {
    id: 'nilex',
    lat: 14.5,
    lng: 32.5,
    label: 'NILEX · SUDAN',
    active: true,
    labelDx: 9,
    labelDy: -8,
  },
  { id: 'sahel', lat: 14, lng: 0, label: 'SAHEL', labelDx: -9, labelDy: -8, anchor: 'end' },
  { id: 'horn', lat: 5, lng: 45, label: 'HORN OF AFRICA', labelDx: 9, labelDy: 4 },
  { id: 'maghreb', lat: 33, lng: 0, label: 'MAGHREB', labelDx: -9, labelDy: -8, anchor: 'end' },
  { id: 'mena', lat: 33, lng: 38, label: 'LEVANT · MENA', labelDx: 9, labelDy: -8 },
  { id: 'south-asia', lat: 26, lng: 80, label: 'SOUTH ASIA', labelDx: 9, labelDy: -8 },
  { id: 'sea', lat: -2, lng: 117, label: 'SE ASIA', labelDx: 9, labelDy: 4 },
  { id: 'andes', lat: 5, lng: -73, label: 'ANDES · COLOMBIA', labelDx: 9, labelDy: 4 },
  {
    id: 'centralam',
    lat: 14,
    lng: -88,
    label: 'CENTRAL AMERICA',
    labelDx: -9,
    labelDy: -8,
    anchor: 'end',
  },
];

const PROJECTED_NODES = NODES.map((n) => ({ ...n, p: proj(n.lat, n.lng) }));
const NODE_BY_ID: Record<string, (typeof PROJECTED_NODES)[0]> = PROJECTED_NODES.reduce(
  (acc, n) => {
    acc[n.id] = n;
    return acc;
  },
  {} as Record<string, (typeof PROJECTED_NODES)[0]>,
);

const LINK_PAIRS: Array<[string, string]> = [
  ['nilex', 'sahel'],
  ['nilex', 'horn'],
  ['nilex', 'maghreb'],
  ['nilex', 'mena'],
  ['nilex', 'south-asia'],
  ['nilex', 'andes'],
  ['horn', 'mena'],
  ['mena', 'south-asia'],
  ['south-asia', 'sea'],
  ['centralam', 'andes'],
  ['sahel', 'maghreb'],
];

const BASEMAP = '#f0eee6';
const COUNTRY_DOT = '#bdb7a6';
const TEXT_INK = '#1a1a1a';
const DEEP_TEAL = '#1A3A34';
const TEAL = '#3d7a72';
const GRATICULE_TICK = '#a89f8e';

const LAT_LABELS = [-30, 0, 30, 60];
const LNG_LABELS = [-90, -60, -30, 0, 30, 60, 90, 120, 150];

function fmtLat(lat: number): string {
  if (lat === 0) return '0°';
  return `${Math.abs(lat)}°${lat > 0 ? 'N' : 'S'}`;
}
function fmtLng(lng: number): string {
  if (lng === 0) return '0°';
  return `${Math.abs(lng)}°${lng > 0 ? 'E' : 'W'}`;
}

export function NetworkBackground() {
  return (
    <svg viewBox={`0 0 ${VW} ${VH}`} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect x="0" y="0" width={VW} height={VH} fill={BASEMAP} />

      <g className="chooser-bg-drift">
        {/* Faint graticule every 30° */}
        <g opacity="0.55">
          {[-90, -60, -30, 0, 30, 60, 90, 120, 150].map((lng) => {
            const x = ((lng - LNG_MIN) / LNG_W) * VW;
            return (
              <line
                key={`mer-${lng}`}
                x1={x}
                y1="0"
                x2={x}
                y2={VH}
                stroke="#e2dfd2"
                strokeWidth="0.4"
              />
            );
          })}
          {[-30, 0, 30, 60].map((lat) => {
            const y = ((LAT_MAX - lat) / LAT_H) * VH;
            return (
              <line
                key={`par-${lat}`}
                x1="0"
                y1={y}
                x2={VW}
                y2={y}
                stroke="#e2dfd2"
                strokeWidth="0.4"
              />
            );
          })}
        </g>
        <line
          x1="0"
          y1={((LAT_MAX - 0) / LAT_H) * VH}
          x2={VW}
          y2={((LAT_MAX - 0) / LAT_H) * VH}
          stroke="#d8d4c4"
          strokeWidth="0.6"
        />

        {/* Degree labels along edges */}
        <g>
          {LAT_LABELS.map((lat) => {
            const y = ((LAT_MAX - lat) / LAT_H) * VH;
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
          {LNG_LABELS.map((lng) => {
            const x = ((lng - LNG_MIN) / LNG_W) * VW;
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

        {/* Continent dots */}
        <g>
          {LAND_DOTS.map(([cx, cy]) => (
            <circle
              key={`d-${cx.toFixed(1)}-${cy.toFixed(1)}`}
              cx={cx}
              cy={cy}
              r="1.2"
              fill={COUNTRY_DOT}
            />
          ))}
        </g>

        {/* Network links */}
        <g>
          {LINK_PAIRS.map(([a, b]) => {
            const na = NODE_BY_ID[a];
            const nb = NODE_BY_ID[b];
            if (!na || !nb) return null;
            return (
              <line
                key={`l-${a}-${b}`}
                x1={na.p[0]}
                y1={na.p[1]}
                x2={nb.p[0]}
                y2={nb.p[1]}
                stroke={TEAL}
                strokeWidth="0.7"
                opacity="0.5"
                strokeDasharray="2 3"
              />
            );
          })}
        </g>

        {/* Nodes */}
        <g>
          {PROJECTED_NODES.map((n) => (
            <g key={n.id}>
              {n.active && (
                <>
                  <circle
                    cx={n.p[0]}
                    cy={n.p[1]}
                    r="13"
                    fill="none"
                    stroke={TEAL}
                    strokeWidth="0.5"
                    opacity="0.3"
                  />
                  <circle
                    cx={n.p[0]}
                    cy={n.p[1]}
                    r="9"
                    fill="none"
                    stroke={TEAL}
                    strokeWidth="0.7"
                    opacity="0.5"
                  />
                </>
              )}
              <circle
                cx={n.p[0]}
                cy={n.p[1]}
                r={n.active ? 5.5 : 4}
                fill="#ffffff"
                stroke={DEEP_TEAL}
                strokeWidth="1.2"
              />
              <circle cx={n.p[0]} cy={n.p[1]} r={n.active ? 2.6 : 1.8} fill={DEEP_TEAL} />
              <text
                x={n.p[0] + (n.labelDx ?? 8)}
                y={n.p[1] + (n.labelDy ?? -8)}
                fontFamily="var(--font-mono)"
                fontSize="8.5"
                letterSpacing="0.06em"
                textAnchor={n.anchor ?? 'start'}
                fill={TEXT_INK}
                opacity="0.85"
              >
                {n.label}
              </text>
            </g>
          ))}
        </g>
      </g>
    </svg>
  );
}
