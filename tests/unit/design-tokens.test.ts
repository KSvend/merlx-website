import { describe, expect, it } from 'vitest';
import {
  breakpoints,
  colors,
  dimColors,
  fontSize,
  fonts,
  motion,
  radii,
  space,
} from '../../src/lib/design-tokens';

describe('MERLx Design System tokens', () => {
  describe('colors', () => {
    it('uses Shell warm neutrals as page backgrounds (no cool grays)', () => {
      expect(colors.shell).toBe('#f5f3ee');
      expect(colors.shellWarm).toBe('#ede9e1');
      expect(colors.shellCool).toBe('#f9f8f5');
    });

    it('iris is the brand accent and matches the logo SVG fill', () => {
      expect(colors.iris).toBe('#8071bc');
    });

    it('deep-teal is the primary action colour', () => {
      expect(colors.deepTeal).toBe('#1a3a34');
    });

    it('ember is reserved for warnings, not buttons', () => {
      expect(colors.ember).toBe('#ca5d0f');
    });

    it('error is distinct from ember', () => {
      expect(colors.error).toBe('#b83a2a');
      expect(colors.error).not.toBe(colors.ember);
    });

    it('exposes ink scale ranging from full to faint', () => {
      expect(colors.ink).toBe('#111111');
      expect(colors.inkLight).toBe('#2a2a2a');
      expect(colors.inkMuted).toBe('#6b6b6b');
      expect(colors.inkFaint).toBe('#9e9e9e');
    });
  });

  describe('dim variants', () => {
    it('iris-dim is a translucent iris for badge backgrounds', () => {
      expect(dimColors.iris).toBe('rgba(128, 113, 188, 0.12)');
    });

    it('deep-teal-dim is the active-state sidebar background', () => {
      expect(dimColors.deepTeal).toBe('rgba(26, 58, 52, 0.10)');
    });
  });

  describe('typography', () => {
    it('exposes the tri-family stack: Inter / DM Serif Display / IBM Plex Mono', () => {
      expect(fonts.sans).toContain('Inter');
      expect(fonts.display).toContain('DM Serif Display');
      expect(fonts.mono).toContain('IBM Plex Mono');
    });

    it('does not reference Tiempos Headline (legacy identity)', () => {
      expect(fonts.display).not.toContain('Tiempos');
    });

    it('size scale ranges from text-xl down to text-micro', () => {
      expect(fontSize.xl).toBe('16px');
      expect(fontSize.base).toBe('13px');
      expect(fontSize.micro).toBe('9px');
    });
  });

  describe('spacing', () => {
    it('starts at 2px and goes up in design-system steps', () => {
      expect(space.s1).toBe('2px');
      expect(space.s4).toBe('8px');
      expect(space.s8).toBe('16px');
      expect(space.s12).toBe('24px');
    });
  });

  describe('radii', () => {
    it('sm is 4px (buttons/inputs), md is 8px (cards)', () => {
      expect(radii.sm).toBe('4px');
      expect(radii.md).toBe('8px');
    });

    it('pill is the badge token at 100px', () => {
      expect(radii.pill).toBe('100px');
    });
  });

  describe('motion', () => {
    it('default transition is 200ms with a soft-landing curve', () => {
      expect(motion.default).toBe('200ms');
      expect(motion.easing).toBe('cubic-bezier(0.16, 1, 0.3, 1)');
    });
  });

  describe('breakpoints', () => {
    it('uses three semantic breakpoints', () => {
      expect(breakpoints.mobile).toBe(0);
      expect(breakpoints.tablet).toBe(640);
      expect(breakpoints.desktop).toBe(1024);
    });
  });
});
