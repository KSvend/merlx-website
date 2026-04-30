export const colors = {
  bg: '#fbfaf5',
  bgSoft: '#f6f4ec',
  ink: '#1a1a1a',
  inkSoft: '#555555',
  inkMute: '#8c8779',
  teal: '#1a3a34',
  tealDeep: '#122a26',
  tealTintHover: '#f3f5ee',
  purple: '#4a3f6b',
  orange: '#ca5d0f',
  orangeTintHover: '#f9eee0',
  orangeHot: '#8a2f0a',
  rule: '#e8e3d4',
  ruleSoft: '#efeae0',
} as const;

export const fonts = {
  serif: '"Tiempos Headline", "GT Sectra Display", Georgia, serif',
  sans: 'Inter, system-ui, -apple-system, sans-serif',
  mono: '"IBM Plex Mono", "JetBrains Mono", ui-monospace, monospace',
} as const;

export const space = {
  px1: '1px',
  px: '1px',
  s1: '4px',
  s2: '8px',
  s3: '12px',
  s4: '16px',
  s5: '20px',
  s6: '24px',
  s8: '32px',
  s10: '40px',
  s12: '48px',
  s16: '64px',
  s20: '80px',
} as const;

export const radii = {
  none: '0',
  sm: '2px',
  md: '4px',
} as const;

export type ColorToken = keyof typeof colors;
export type FontToken = keyof typeof fonts;
export type SpaceToken = keyof typeof space;
export type RadiusToken = keyof typeof radii;
