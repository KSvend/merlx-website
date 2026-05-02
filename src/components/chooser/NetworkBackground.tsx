/**
 * Network side background: federated MERL ops map.
 *
 * Same construction as the Studio PRISM cutout but in the teal register:
 * - World-scale equirectangular projection of Natural Earth admin0 borders
 *   (countries-110m for performance — all continents, lower detail than
 *   Studio's 50m since we're zoomed way out).
 * - Land fills + coastlines + internal borders all real geometry.
 * - Federated network nodes overlaid (NileX active in Sudan, plus 8
 *   regional partner sites). Dashed mesh of TLS-secured links.
 * - Right-side ops console — node count, last-sync, tail of the
 *   federation log. MERLx-token discipline: surface card · border-light
 *   edge · deep-teal active · iris for emphasis · Plex Mono for data.
 * - Wrapping <g class="chooser-bg-drift"> drifts on hover.
 */

import { geoPath, geoTransform } from 'd3-geo';
import { feature, mesh } from 'topojson-client';
// biome-ignore lint/suspicious/noExplicitAny: TopoJSON shape varies by source
import worldAtlas from 'world-atlas/countries-110m.json' with { type: 'json' };

const VW = 600;
const VH = 360;

// Equirectangular world frame with the inhabited band visible.
const LNG_MIN = -120;
const LNG_W = 300;
const LAT_MAX = 65;
const LAT_H = 105;

function proj(lat: number, lng: number): [number, number] {
  return [((lng - LNG_MIN) / LNG_W) * VW, ((LAT_MAX - lat) / LAT_H) * VH];
}

const transform = geoTransform({
  point(lng: number, lat: number) {
    this.stream.point(((lng - LNG_MIN) / LNG_W) * VW, ((LAT_MAX - lat) / LAT_H) * VH);
  },
});

const pathFn = geoPath(transform);

// biome-ignore lint/suspicious/noExplicitAny: world-atlas TopoJSON is loose
const world = worldAtlas as unknown as any;
const countriesObj = world.objects.countries;

// Render every country at the world scale — at 110m resolution and a
// world equirectangular projection the path string compresses well.
const ALL_LAND_PATH = pathFn(feature(world, countriesObj)) ?? '';

// biome-ignore lint/suspicious/noExplicitAny: same loose TopoJSON typings
const INTERIOR_PATH = pathFn(mesh(world, countriesObj, (a: any, b: any) => a !== b)) ?? '';
// biome-ignore lint/suspicious/noExplicitAny: same loose TopoJSON typings
const COASTLINE_PATH = pathFn(mesh(world, countriesObj, (a: any, b: any) => a === b)) ?? '';

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

const LOG_LINES = [
  '14:18:42 nilex   · sync ok',
  '14:18:43 horn    · sync ok',
  '14:18:44 mena    · sync ok',
  '14:18:46 sa      · sync ok',
];

// MERLx tokens
const BASEMAP = '#F5F3EE'; // shell
const LAND_FILL = '#EDE9E1'; // shell-warm
const COUNTRY_BORDER = '#D5D0C7'; // border
const COASTLINE = '#9E9E9E'; // ink-faint
const PANEL_FILL = '#FFFFFF'; // surface
const PANEL_BORDER = '#E5E1DA'; // border-light
const INK = '#111111';
const INK_LIGHT = '#2A2A2A';
const INK_MUTED = '#6B6B6B';
const INK_FAINT = '#9E9E9E';
const IRIS = '#8071BC';
const DEEP_TEAL = '#1A3A34';
const DEEP_TEAL_DIM = 'rgba(26, 58, 52, 0.10)';
const SUCCESS = '#3BAA7F';

export function NetworkBackground() {
  return (
    <svg viewBox={`0 0 ${VW} ${VH}`} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect x="0" y="0" width={VW} height={VH} fill="#FAFAF7" />

      {/* DEFAULT-STATE BRAND MARK — visible until hover.
       * Network panel emphasises the deep-teal block (the federation
       * spine) with iris teardrop + smaller orange circle as supporting
       * marks, mirroring the company profile cover. */}
      <g className="brand-mark">
        <rect x={VW * 0.55} y={VH * 0.18} width="80" height="180" fill="#1A3A34" />
        <path
          d={`M ${VW * 0.42} ${VH * 0.3} q -32 0 -32 32 q 0 32 32 64 q 32 -32 32 -64 q 0 -32 -32 -32 z`}
          fill="#4A3F6B"
        />
        <circle cx={VW * 0.32} cy={VH * 0.62} r="32" fill="#CA5D0F" />
        <text
          x={VW - 22}
          y={VH - 14}
          fontFamily="var(--font-mono)"
          fontSize="9"
          letterSpacing="0.16em"
          fill="#6B6B6B"
          textAnchor="end"
        >
          MERLx · NETWORK
        </text>
      </g>

      {/* HOVER-STATE MAP COMPOSITION */}
      <g className="brand-map">
        <rect x="0" y="0" width={VW} height={VH} fill={BASEMAP} />
        <g className="chooser-bg-drift">
          {/* Blueprint grid — same engineering-drawing rhythm as Studio. */}
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
            {[0, 150, 300].map((y) => (
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

          {/* Land fills */}
          <path d={ALL_LAND_PATH} fill={LAND_FILL} stroke="none" />

          {/* Coastlines */}
          <path d={COASTLINE_PATH} fill="none" stroke={COASTLINE} strokeWidth="0.5" opacity="0.7" />

          {/* Internal borders */}
          <path
            d={INTERIOR_PATH}
            fill="none"
            stroke={COUNTRY_BORDER}
            strokeWidth="0.4"
            strokeDasharray="2 2"
            opacity="0.7"
          />

          {/* Network mesh */}
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
                  stroke={DEEP_TEAL}
                  strokeWidth="0.6"
                  opacity="0.45"
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
                      stroke={DEEP_TEAL}
                      strokeWidth="0.5"
                      opacity="0.3"
                    />
                    <circle
                      cx={n.p[0]}
                      cy={n.p[1]}
                      r="9"
                      fill="none"
                      stroke={DEEP_TEAL}
                      strokeWidth="0.7"
                      opacity="0.5"
                    />
                  </>
                )}
                <circle
                  cx={n.p[0]}
                  cy={n.p[1]}
                  r={n.active ? 5.5 : 4}
                  fill={PANEL_FILL}
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
                  fill={INK_LIGHT}
                  opacity="0.85"
                >
                  {n.label}
                </text>
              </g>
            ))}
          </g>

          {/* Compact federated-ops sidebar — mirrors Studio's prediction
           * sidebar but in the teal register: federated nodes are stable,
           * Studio's are predictive. */}
          <g transform={`translate(${VW - 138}, 22)`}>
            <rect
              x="0"
              y="0"
              width="124"
              height="218"
              rx="4"
              fill={PANEL_FILL}
              stroke={PANEL_BORDER}
              strokeWidth="0.6"
            />

            <text
              x="10"
              y="18"
              fontFamily="var(--font-sans)"
              fontSize="11"
              fontWeight="600"
              fill={INK}
            >
              <tspan>MERLx</tspan>
              <tspan dx="2" fill={IRIS} fontStyle="italic">
                Network
              </tspan>
            </text>
            <text
              x="10"
              y="30"
              fontFamily="var(--font-mono)"
              fontSize="8"
              fill={INK_MUTED}
              letterSpacing="0.04em"
            >
              federation · v0.4
            </text>

            {/* View toggle — deep-teal active per PRISM convention */}
            <g transform="translate(10, 42)">
              {[
                { k: 'Nodes', active: true },
                { k: 'Mesh', active: false },
                { k: 'Sync', active: false },
              ].map((t, i) => (
                <g key={t.k} transform={`translate(${i * 36}, 0)`}>
                  <rect
                    x="0"
                    y="0"
                    width="33"
                    height="16"
                    rx="3"
                    fill={t.active ? DEEP_TEAL : 'transparent'}
                    stroke={t.active ? DEEP_TEAL : PANEL_BORDER}
                    strokeWidth="0.5"
                  />
                  <text
                    x="16.5"
                    y="11.5"
                    fontFamily="var(--font-sans)"
                    fontSize="8.5"
                    fontWeight="500"
                    textAnchor="middle"
                    fill={t.active ? '#FFFFFF' : INK_MUTED}
                  >
                    {t.k}
                  </text>
                </g>
              ))}
            </g>

            {/* Status counts */}
            <g transform="translate(10, 76)">
              <text
                x="0"
                y="0"
                fontFamily="var(--font-sans)"
                fontSize="8"
                fontWeight="600"
                letterSpacing="0.16em"
                fill={INK_MUTED}
              >
                FEDERATION
              </text>
              <g transform="translate(0, 12)">
                <circle cx="3" cy="6" r="2.5" fill={SUCCESS} />
                <text x="12" y="9" fontFamily="var(--font-sans)" fontSize="9" fill={INK_LIGHT}>
                  9 / 9 online
                </text>
              </g>
              <g transform="translate(0, 26)">
                <circle cx="3" cy="6" r="2.5" fill={DEEP_TEAL} />
                <text x="12" y="9" fontFamily="var(--font-sans)" fontSize="9" fill={INK_LIGHT}>
                  11 links · TLS
                </text>
              </g>
              <g transform="translate(0, 40)">
                <circle cx="3" cy="6" r="2.5" fill={IRIS} />
                <text x="12" y="9" fontFamily="var(--font-sans)" fontSize="9" fill={INK_LIGHT}>
                  2 active sites
                </text>
              </g>
            </g>

            {/* Sync log tail */}
            <line x1="10" y1="142" x2="114" y2="142" stroke={PANEL_BORDER} strokeWidth="0.5" />
            <text
              x="10"
              y="156"
              fontFamily="var(--font-sans)"
              fontSize="8"
              fontWeight="600"
              letterSpacing="0.16em"
              fill={INK_MUTED}
            >
              SYNC LOG
            </text>
            {LOG_LINES.map((line, i) => (
              <text
                key={`log-${line.length}-${i}`}
                x="10"
                y={170 + i * 11}
                fontFamily="var(--font-mono)"
                fontSize="7.5"
                fill={INK_FAINT}
                letterSpacing="0.04em"
              >
                {line}
              </text>
            ))}
          </g>
        </g>
      </g>
    </svg>
  );
}
