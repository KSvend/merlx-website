/**
 * Group landing background: fine-line world map with subtle grid,
 * MERLx city pins (Barcelona / Nairobi / Copenhagen), and the Nile.
 *
 * Two reveal layers are hidden by default:
 *   .studio-reveal  — PRISM hex bloom + EO satellite tile rectangles
 *                     over the Horn of Africa
 *   .network-reveal — federated node pins + dashed mesh lines
 *
 * The parent .world-landing toggles them via CSS :has() — see
 * chooser.css for the rules.
 */

import { geoPath, geoTransform } from 'd3-geo';
import { mesh } from 'topojson-client';
// biome-ignore lint/suspicious/noExplicitAny: TopoJSON shape varies by source
import worldAtlas from 'world-atlas/countries-50m.json' with { type: 'json' };

const VW = 1200;
const VH = 600;

// Equirectangular world projection — slightly zoomed to the inhabited
// band (lat -55..78), full longitude range.
const LNG_MIN = -180;
const LNG_W = 360;
const LAT_MAX = 78;
const LAT_H = 133;

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

// Outer coastline (where land meets sea) — sharper, slightly stronger.
// biome-ignore lint/suspicious/noExplicitAny: mesh filter typing
const COASTLINE_PATH = pathFn(mesh(world, countriesObj, (a: any, b: any) => a === b)) ?? '';
// Internal country borders — fainter.
// biome-ignore lint/suspicious/noExplicitAny: mesh filter typing
const INTERIOR_PATH = pathFn(mesh(world, countriesObj, (a: any, b: any) => a !== b)) ?? '';

// MERLx office cities
const CITIES: Array<{ name: string; lat: number; lng: number; primary?: boolean }> = [
  { name: 'Barcelona', lat: 41.39, lng: 2.17, primary: true },
  { name: 'Copenhagen', lat: 55.68, lng: 12.57 },
  { name: 'Nairobi', lat: -1.29, lng: 36.82 },
];

// Nile river — Lake Victoria → Mediterranean
const NILE_LL: Array<[number, number]> = [
  [-0.3, 33],
  [4.85, 31.6], // Juba
  [9.5, 31.6], // Malakal
  [13.5, 32.5],
  [15.6, 32.5], // Khartoum
  [17.7, 33.97], // Atbara
  [22, 31.5],
  [24, 31],
  [27, 31],
  [30, 30.5],
  [31.5, 30], // delta
];

// Studio reveal — Horn-of-Africa hex bloom positions (cluster-style)
// + EO satellite tile rectangles over Sudan/Ethiopia.
const STUDIO_HEX_R = 4;
const STUDIO_HEX_DX = STUDIO_HEX_R * Math.sqrt(3);
const STUDIO_HEX_DY = STUDIO_HEX_R * 1.5;

interface StudioCluster {
  pos: [number, number];
  polarity: 'red' | 'teal';
  radius: number;
  intensity: number;
}

const STUDIO_CLUSTERS: StudioCluster[] = [
  { pos: proj(13, 24.5), polarity: 'red', radius: 18, intensity: 1.0 }, // Darfur
  { pos: proj(8, 30), polarity: 'red', radius: 16, intensity: 0.85 }, // S Sudan
  { pos: proj(2, 45), polarity: 'red', radius: 12, intensity: 0.75 }, // Mogadishu
  { pos: proj(9, 39), polarity: 'red', radius: 14, intensity: 0.7 }, // Addis
  { pos: proj(12, 36), polarity: 'teal', radius: 12, intensity: 0.6 }, // E Sudan
  { pos: proj(3, 38), polarity: 'red', radius: 10, intensity: 0.6 }, // N Kenya
];

function studioCellColor(cx: number, cy: number): { fill: string; opacity: number } | null {
  let red = 0;
  let teal = 0;
  for (const c of STUDIO_CLUSTERS) {
    const d = Math.hypot(cx - c.pos[0], cy - c.pos[1]);
    if (d > c.radius * 1.4) continue;
    const w = c.intensity * Math.exp(-(d * d) / (c.radius * c.radius * 0.5));
    if (c.polarity === 'red') red = Math.max(red, w);
    else teal = Math.max(teal, w);
  }
  const v = Math.max(red, teal);
  if (v < 0.12) return null;
  if (red > teal) {
    if (v > 0.7) return { fill: '#a83227', opacity: 0.95 };
    if (v > 0.5) return { fill: '#c44a3b', opacity: 0.88 };
    if (v > 0.3) return { fill: '#dc7864', opacity: 0.78 };
    return { fill: '#e8a896', opacity: 0.6 };
  }
  if (v > 0.5) return { fill: '#2c6359', opacity: 0.85 };
  if (v > 0.3) return { fill: '#5c8480', opacity: 0.7 };
  return { fill: '#9ab8b3', opacity: 0.55 };
}

function hexPoints(cx: number, cy: number, r: number): string {
  const pts: string[] = [];
  for (let i = 0; i < 6; i += 1) {
    const a = (Math.PI / 3) * i - Math.PI / 2;
    pts.push(`${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`);
  }
  return pts.join(' ');
}

interface StudioCell {
  key: string;
  cx: number;
  cy: number;
  fill: string;
  opacity: number;
}

function buildStudioCells(): StudioCell[] {
  const cells: StudioCell[] = [];
  // Horn frame: lat -3..22, lng 22..52 → projected
  const [x0, y1] = proj(-3, 22);
  const [x1, y0] = proj(22, 52);
  let row = 0;
  for (let cy = y0; cy <= y1; cy += STUDIO_HEX_DY) {
    const offset = row % 2 === 1 ? STUDIO_HEX_DX / 2 : 0;
    for (let cx = x0 + offset; cx <= x1; cx += STUDIO_HEX_DX) {
      const c = studioCellColor(cx, cy);
      if (!c) continue;
      cells.push({ key: `${cx.toFixed(0)}-${cy.toFixed(0)}`, cx, cy, ...c });
    }
    row += 1;
  }
  return cells;
}

const STUDIO_CELLS = buildStudioCells();

// Studio EO satellite tile rectangles — represent satellite tile
// coverage over named regions.
interface EOTile {
  pos: [number, number]; // [lat, lng] lower-left
  width: number; // degrees
  height: number;
  label: string;
}

const EO_TILES: EOTile[] = [
  { pos: [12.5, 23.5], width: 2, height: 1.6, label: 'EL FASHER' },
  { pos: [9, 38], width: 1.6, height: 1.4, label: 'ADDIS' },
];

// Network nodes — same set used by network.merlx.org
const NETWORK_NODES = [
  { id: 'nilex', lat: 14.5, lng: 32.5, label: 'NILEX · SUDAN', active: true },
  { id: 'sahel', lat: 14, lng: 0, label: 'SAHEL' },
  { id: 'horn', lat: 5, lng: 45, label: 'HORN' },
  { id: 'maghreb', lat: 33, lng: 0, label: 'MAGHREB' },
  { id: 'mena', lat: 33, lng: 38, label: 'LEVANT' },
  { id: 'south-asia', lat: 26, lng: 80, label: 'S. ASIA' },
  { id: 'sea', lat: -2, lng: 117, label: 'SE ASIA' },
  { id: 'andes', lat: 5, lng: -73, label: 'ANDES' },
  { id: 'centralam', lat: 14, lng: -88, label: 'C. AMERICA' },
];

const NETWORK_LINKS: Array<[string, string]> = [
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
];

const NODE_BY_ID = NETWORK_NODES.reduce(
  (acc, n) => {
    acc[n.id] = n;
    return acc;
  },
  {} as Record<string, (typeof NETWORK_NODES)[0]>,
);

// Tokens
const COASTLINE = '#9e9e9e';
const INTERIOR = '#d5d0c7';
const GRID = '#e8e3d4';
const INK = '#111111';
const INK_MUTED = '#6B6B6B';
const IRIS = '#8071BC';
const DEEP_TEAL = '#1A3A34';
const EMBER = '#CA5D0F';
const NILE_BLUE = '#a8c0c8';

export function WorldMapBackground() {
  const nilePath = NILE_LL.map(([lat, lng], i) => {
    const [x, y] = proj(lat, lng);
    return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(' ');

  return (
    <svg
      viewBox={`0 0 ${VW} ${VH}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      className="world-map-svg"
    >
      {/* Subtle 30° lat/lng grid — signals 'data analysis' without
       * being prominent. */}
      <g opacity="0.5">
        {[-150, -120, -90, -60, -30, 0, 30, 60, 90, 120, 150].map((lng) => {
          const x = ((lng - LNG_MIN) / LNG_W) * VW;
          return (
            <line key={`m-${lng}`} x1={x} y1={0} x2={x} y2={VH} stroke={GRID} strokeWidth="0.5" />
          );
        })}
        {[-60, -30, 0, 30, 60].map((lat) => {
          const y = ((LAT_MAX - lat) / LAT_H) * VH;
          return (
            <line key={`p-${lat}`} x1={0} y1={y} x2={VW} y2={y} stroke={GRID} strokeWidth="0.5" />
          );
        })}
      </g>
      {/* Equator + prime meridian slightly stronger */}
      <line
        x1={0}
        y1={((LAT_MAX - 0) / LAT_H) * VH}
        x2={VW}
        y2={((LAT_MAX - 0) / LAT_H) * VH}
        stroke="#dad4c0"
        strokeWidth="0.7"
      />
      <line
        x1={((0 - LNG_MIN) / LNG_W) * VW}
        y1={0}
        x2={((0 - LNG_MIN) / LNG_W) * VW}
        y2={VH}
        stroke="#dad4c0"
        strokeWidth="0.7"
      />

      {/* Continent outlines — fine-line, stroke-only */}
      <path d={INTERIOR_PATH} fill="none" stroke={INTERIOR} strokeWidth="0.4" opacity="0.7" />
      <path d={COASTLINE_PATH} fill="none" stroke={COASTLINE} strokeWidth="0.6" opacity="0.85" />

      {/* Nile river — fine blue-grey */}
      <path d={nilePath} fill="none" stroke={NILE_BLUE} strokeWidth="0.8" opacity="0.7" />

      {/* MERLx city pins (always visible) */}
      <g>
        {CITIES.map((city) => {
          const [cx, cy] = proj(city.lat, city.lng);
          const r = city.primary ? 4 : 3;
          return (
            <g key={city.name}>
              {city.primary && (
                <>
                  <circle
                    cx={cx}
                    cy={cy}
                    r="22"
                    fill="none"
                    stroke={DEEP_TEAL}
                    strokeWidth="0.4"
                    opacity="0.18"
                  />
                  <circle
                    cx={cx}
                    cy={cy}
                    r="13"
                    fill="none"
                    stroke={DEEP_TEAL}
                    strokeWidth="0.5"
                    opacity="0.35"
                    className="city-pulse"
                  />
                </>
              )}
              <line
                x1={cx - 7}
                y1={cy}
                x2={cx - 3}
                y2={cy}
                stroke={DEEP_TEAL}
                strokeWidth="0.5"
                opacity="0.55"
              />
              <line
                x1={cx + 3}
                y1={cy}
                x2={cx + 7}
                y2={cy}
                stroke={DEEP_TEAL}
                strokeWidth="0.5"
                opacity="0.55"
              />
              <line
                x1={cx}
                y1={cy - 7}
                x2={cx}
                y2={cy - 3}
                stroke={DEEP_TEAL}
                strokeWidth="0.5"
                opacity="0.55"
              />
              <line
                x1={cx}
                y1={cy + 3}
                x2={cx}
                y2={cy + 7}
                stroke={DEEP_TEAL}
                strokeWidth="0.5"
                opacity="0.55"
              />
              <circle
                cx={cx}
                cy={cy}
                r={r + 1.5}
                fill="#FFFFFF"
                stroke={DEEP_TEAL}
                strokeWidth="1"
              />
              <circle cx={cx} cy={cy} r={r - 0.5} fill={DEEP_TEAL} />
              <text
                x={cx + 12}
                y={cy + 3}
                fontFamily="var(--font-mono)"
                fontSize="10.5"
                letterSpacing="0.08em"
                fill={INK}
                fontWeight={city.primary ? 600 : 500}
              >
                {city.name.toUpperCase()}
                {city.primary ? '  · HQ' : ''}
              </text>
              <text
                x={cx + 12}
                y={cy + 14}
                fontFamily="var(--font-mono)"
                fontSize="7.5"
                letterSpacing="0.08em"
                fill={INK_MUTED}
                opacity="0.7"
              >
                {city.lat.toFixed(2)}°{city.lat >= 0 ? 'N' : 'S'} {Math.abs(city.lng).toFixed(2)}°
                {city.lng >= 0 ? 'E' : 'W'}
              </text>
            </g>
          );
        })}
      </g>

      {/* STUDIO REVEAL — hidden by default, fades in when Studio CTA hovered */}
      <g className="studio-reveal">
        {/* Horn-of-Africa hex bloom */}
        <g>
          {STUDIO_CELLS.map((c) => (
            <polygon
              key={c.key}
              points={hexPoints(c.cx, c.cy, STUDIO_HEX_R - 0.4)}
              fill={c.fill}
              opacity={c.opacity}
            />
          ))}
        </g>
        {/* EO satellite tile rectangles — represent satellite imagery
         * tile coverage. Iris dashed outline + small label. */}
        {EO_TILES.map((tile) => {
          const [x0, y1] = proj(tile.pos[0], tile.pos[1]);
          const [x1, y0] = proj(tile.pos[0] + tile.height, tile.pos[1] + tile.width);
          return (
            <g key={tile.label}>
              <rect
                x={x0}
                y={y0}
                width={x1 - x0}
                height={y1 - y0}
                fill="none"
                stroke={IRIS}
                strokeWidth="1"
                strokeDasharray="3 2"
              />
              <rect x={x0} y={y0} width={x1 - x0} height={y1 - y0} fill={IRIS} opacity="0.08" />
              <text
                x={x0 + 4}
                y={y0 - 4}
                fontFamily="var(--font-mono)"
                fontSize="9"
                letterSpacing="0.08em"
                fill={IRIS}
                fontWeight="500"
              >
                EO · {tile.label}
              </text>
            </g>
          );
        })}
      </g>

      {/* NETWORK REVEAL — hidden by default, fades in when Network CTA hovered */}
      <g className="network-reveal">
        {/* Mesh lines */}
        <g>
          {NETWORK_LINKS.map(([a, b]) => {
            const na = NODE_BY_ID[a];
            const nb = NODE_BY_ID[b];
            if (!na || !nb) return null;
            const [ax, ay] = proj(na.lat, na.lng);
            const [bx, by] = proj(nb.lat, nb.lng);
            return (
              <line
                key={`l-${a}-${b}`}
                x1={ax}
                y1={ay}
                x2={bx}
                y2={by}
                stroke={DEEP_TEAL}
                strokeWidth="0.7"
                opacity="0.5"
                strokeDasharray="3 3"
              />
            );
          })}
        </g>
        {/* Nodes */}
        <g>
          {NETWORK_NODES.map((n) => {
            const [cx, cy] = proj(n.lat, n.lng);
            return (
              <g key={n.id}>
                {n.active && (
                  <circle
                    cx={cx}
                    cy={cy}
                    r="14"
                    fill="none"
                    stroke={DEEP_TEAL}
                    strokeWidth="0.5"
                    opacity="0.4"
                  />
                )}
                <circle
                  cx={cx}
                  cy={cy}
                  r={n.active ? 6 : 4.5}
                  fill="#FFFFFF"
                  stroke={DEEP_TEAL}
                  strokeWidth="1.1"
                />
                <circle cx={cx} cy={cy} r={n.active ? 3 : 2.2} fill={DEEP_TEAL} />
                <text
                  x={cx + 9}
                  y={cy - 7}
                  fontFamily="var(--font-mono)"
                  fontSize="9"
                  letterSpacing="0.08em"
                  fill={INK}
                  fontWeight="500"
                >
                  {n.label}
                </text>
              </g>
            );
          })}
        </g>
      </g>
    </svg>
  );
}
