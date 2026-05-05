/**
 * MERLx Design System — TypeScript token exports.
 *
 * Mirrors the CSS custom properties declared in src/app/globals.css.
 * Source of truth: ~/github/merlx-design-system/foundations/*.md.
 *
 * Use these in component code that needs raw values (inline styles
 * computing colours, chart configs, SVG fills). Prefer var(--token)
 * in CSS; only reach for the TS values when CSS variables aren't an
 * option.
 */

export const colors = {
  // Core
  shell: '#f5f3ee',
  shellWarm: '#ede9e1',
  shellCool: '#f9f8f5',
  ink: '#111111',
  inkLight: '#2a2a2a',
  inkMuted: '#6b6b6b',
  inkFaint: '#9e9e9e',
  surface: '#ffffff',
  border: '#d5d0c7',
  borderLight: '#e5e1da',

  // Accents
  sand: '#e8d4c0',
  sandLight: '#f0e2d4',
  sandDark: '#c4a98a',
  iris: '#8071bc',
  irisLight: '#a498d0',
  irisDark: '#635499',
  deepTeal: '#1a3a34',
  deepTealLight: '#2a5249',
  deepIris: '#4a3f6b',
  deepIrisLight: '#5e5280',
  ember: '#ca5d0f',
  emberLight: '#e07b33',
  emberDark: '#a84b0c',

  // Status
  success: '#3baa7f',
  error: '#b83a2a',
  errorLight: '#d05454',
} as const;

export const dimColors = {
  sand: 'rgba(232, 212, 192, 0.25)',
  iris: 'rgba(128, 113, 188, 0.12)',
  deepTeal: 'rgba(26, 58, 52, 0.10)',
  deepIris: 'rgba(74, 63, 107, 0.10)',
  ember: 'rgba(202, 93, 15, 0.10)',
} as const;

export const fonts = {
  sans: 'Inter, system-ui, -apple-system, sans-serif',
  display: '"DM Serif Display", Georgia, serif',
  mono: '"IBM Plex Mono", "JetBrains Mono", ui-monospace, monospace',
} as const;

export const fontSize = {
  xl: '16px',
  lg: '15px',
  base: '13px',
  sm: '12px',
  xs: '11px',
  xxs: '10px',
  micro: '9px',
} as const;

export const space = {
  s1: '2px',
  s2: '4px',
  s3: '6px',
  s4: '8px',
  s5: '10px',
  s6: '12px',
  s7: '14px',
  s8: '16px',
  s10: '20px',
  s12: '24px',
  s16: '32px',
  s20: '40px',
  s24: '48px',
  s32: '64px',
  s40: '80px',
  s48: '96px',
  s64: '128px',
} as const;

export const radii = {
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  pill: '100px',
} as const;

export const motion = {
  fast: '100ms',
  default: '200ms',
  slow: '300ms',
  easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
} as const;

export const breakpoints = {
  mobile: 0,
  tablet: 640,
  desktop: 1024,
} as const;

export type ColorToken = keyof typeof colors;
export type DimColorToken = keyof typeof dimColors;
export type FontToken = keyof typeof fonts;
export type FontSizeToken = keyof typeof fontSize;
export type SpaceToken = keyof typeof space;
export type RadiusToken = keyof typeof radii;
export type MotionToken = keyof typeof motion;
