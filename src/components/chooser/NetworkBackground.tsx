/**
 * Network side background: federated MERL ops map.
 *
 * Same visual register as the Studio PRISM cutout — CARTO Positron
 * light basemap, faint country dots, minimal control chrome top-left.
 * Nine federated nodes (NileX active), sparse dashed link mesh.
 *
 * Static. Animation deferred.
 */

const VW = 600;
const VH = 360;

// World projection (equirectangular) covering the inhabited band.
// lng −120 .. 180 (range 300°), lat −40 .. 65 (range 105°)
const LNG_MIN = -120;
const LNG_W = 300;
const LAT_MAX = 65;
const LAT_H = 105;

function proj(lat: number, lng: number): [number, number] {
  return [((lng - LNG_MIN) / LNG_W) * VW, ((LAT_MAX - lat) / LAT_H) * VH];
}

// Continent dot density — sampled lat/lng points across landmasses.
// Tighter than v1 (≈ every 2.5° lat × 3° lng) but still sparse enough
// to read as basemap rather than infographic.
const LAND_DOTS: Array<[number, number]> = [];
const STEP_LAT = 2.5;
const STEP_LNG = 3;

// Each row: [lat, [lng ranges as pairs]]
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
  // Central America / Caribbean
  [20, [[-105, -85], [-78, -72]]],
  [15, [[-95, -85], [-77, -72]]],
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
  // North Africa / Sahara
  [30, [[-8, 32]]],
  [25, [[-15, 36]]],
  [20, [[-15, 38]]],
  [15, [[-15, 40]]],
  [10, [[-12, 42]]],
  [5, [[-8, 45]]],
  // Sub-Saharan Africa / Horn
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
  // Central Asia / Russia
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
  { id: 'nilex', lat: 14.5, lng: 32.5, label: 'NILEX · SUDAN', active: true, labelDx: 9, labelDy: -8 },
  { id: 'sahel', lat: 14, lng: 0, label: 'SAHEL', labelDx: -9, labelDy: -8, anchor: 'end' },
  { id: 'horn', lat: 5, lng: 45, label: 'HORN OF AFRICA', labelDx: 9, labelDy: 4 },
  { id: 'maghreb', lat: 33, lng: 0, label: 'MAGHREB', labelDx: -9, labelDy: -8, anchor: 'end' },
  { id: 'mena', lat: 33, lng: 38, label: 'LEVANT · MENA', labelDx: 9, labelDy: -8 },
  { id: 'south-asia', lat: 26, lng: 80, label: 'SOUTH ASIA', labelDx: 9, labelDy: -8 },
  { id: 'sea', lat: -2, lng: 117, label: 'SE ASIA', labelDx: 9, labelDy: 4 },
  { id: 'andes', lat: 5, lng: -73, label: 'ANDES · COLOMBIA', labelDx: 9, labelDy: 4 },
  { id: 'centralam', lat: 14, lng: -88, label: 'CENTRAL AMERICA', labelDx: -9, labelDy: -8, anchor: 'end' },
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

const PANEL_FILL = '#fafaf6';
const PANEL_BORDER = '#d8d4ca';
const BASEMAP = '#eeece5';
const COUNTRY_DOT = '#c2bfb3';
const TEXT_INK = '#1a1a1a';
const TEXT_MUTE = '#7a786f';
const DEEP_TEAL = '#1A3A34';
const TEAL = '#3d7a72';

const VIEW_BUTTONS = ['Nodes', 'Mesh', 'Activity'];
const ACTIVE_VIEW = 0;

export function NetworkBackground() {
  return (
    <svg viewBox={`0 0 ${VW} ${VH}`} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect x="0" y="0" width={VW} height={VH} fill={BASEMAP} />

      {/* Faint graticule every 30° */}
      <g opacity="0.5">
        {[-90, -60, -30, 0, 30, 60, 90, 120, 150].map((lng) => {
          const x = ((lng - LNG_MIN) / LNG_W) * VW;
          return (
            <line
              key={`mer-${lng}`}
              x1={x}
              y1="0"
              x2={x}
              y2={VH}
              stroke="#e5e2d8"
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
              stroke="#e5e2d8"
              strokeWidth="0.4"
            />
          );
        })}
      </g>

      {/* Equator slightly stronger */}
      <line
        x1="0"
        y1={((LAT_MAX - 0) / LAT_H) * VH}
        x2={VW}
        y2={((LAT_MAX - 0) / LAT_H) * VH}
        stroke="#dcd9cd"
        strokeWidth="0.6"
      />

      {/* Continent dots */}
      <g>
        {LAND_DOTS.map(([cx, cy], i) => (
          <circle key={`d-${i}`} cx={cx} cy={cy} r="1.2" fill={COUNTRY_DOT} />
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
            <circle
              cx={n.p[0]}
              cy={n.p[1]}
              r={n.active ? 2.6 : 1.8}
              fill={DEEP_TEAL}
            />
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

      {/* Top-left ViewToggle (mirrors Studio's chrome rhythm) */}
      <g transform="translate(20, 20)">
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
              {isActive && <rect x={i * w} y="0" width={w} height="24" rx="4" fill={DEEP_TEAL} />}
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
      </g>

      {/* Compact summary chip */}
      <g transform="translate(20, 56)">
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
        <circle cx="14" cy="12" r="2.5" fill={TEAL} />
        <text
          x="22"
          y="15"
          fontFamily="var(--font-mono)"
          fontSize="9.5"
          fill={TEXT_INK}
          letterSpacing="0.04em"
        >
          9 nodes online · 11 links
        </text>
      </g>

      {/* Bottom-right attribution */}
      <g transform={`translate(${VW - 140}, ${VH - 16})`}>
        <text x="0" y="0" fontFamily="var(--font-mono)" fontSize="7.5" fill={TEXT_MUTE} letterSpacing="0.04em">
          © CARTO · OpenStreetMap
        </text>
      </g>
    </svg>
  );
}
