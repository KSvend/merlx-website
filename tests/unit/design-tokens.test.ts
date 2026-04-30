import { describe, expect, it } from 'vitest';
import { colors, fonts, radii, space } from '../../src/lib/design-tokens';

describe('design tokens', () => {
  it('colors include canonical brand hex values from MERLx_icon.svg', () => {
    expect(colors.teal).toBe('#1a3a34');
    expect(colors.orange).toBe('#ca5d0f');
    expect(colors.purple).toBe('#4a3f6b');
  });

  it('uses warm-white as the page bg, not pure white', () => {
    expect(colors.bg).toBe('#fbfaf5');
    expect(colors.bg.toLowerCase()).not.toBe('#ffffff');
  });

  it('fonts cover the tri-typeface system', () => {
    expect(fonts.serif).toContain('Tiempos');
    expect(fonts.sans).toContain('Inter');
    expect(fonts.mono).toContain('Plex Mono');
  });

  it('exposes a space scale', () => {
    expect(space.s1).toBe('4px');
    expect(space.s4).toBe('16px');
  });

  it('radii are minimal (square edges per company profile)', () => {
    expect(radii.md).toBe('4px');
  });
});
