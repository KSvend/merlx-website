import { describe, expect, it } from 'vitest';
import ar from '../../src/i18n/messages/ar.json';
import en from '../../src/i18n/messages/en.json';
import fr from '../../src/i18n/messages/fr.json';

function flattenKeys(obj: unknown, prefix = ''): string[] {
  if (typeof obj !== 'object' || obj === null) return [];
  return Object.entries(obj).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      return flattenKeys(value, path);
    }
    return [path];
  });
}

describe('i18n key parity', () => {
  const enKeys = flattenKeys(en).sort();

  it('ar has the same keys as en', () => {
    const arKeys = flattenKeys(ar).sort();
    expect(arKeys).toEqual(enKeys);
  });

  it('fr has the same keys as en', () => {
    const frKeys = flattenKeys(fr).sort();
    expect(frKeys).toEqual(enKeys);
  });
});
