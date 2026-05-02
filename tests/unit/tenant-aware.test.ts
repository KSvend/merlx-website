import { describe, expect, it } from 'vitest';
import {
  isGroupTenant,
  isNetworkTenant,
  isStudioTenant,
  parseTenantHeaders,
} from '../../src/lib/tenant-aware';

describe('parseTenantHeaders', () => {
  it('reads x-tenant-* headers and returns a record', () => {
    const headers = new Headers({
      'x-tenant-kind': 'group',
      'x-tenant-subdomain': '',
      'x-tenant-domain': 'merlx.org',
    });
    expect(parseTenantHeaders(headers)).toEqual({
      kind: 'group',
      subdomain: '',
      domain: 'merlx.org',
    });
  });

  it('defaults to "unknown" when headers are absent', () => {
    expect(parseTenantHeaders(new Headers())).toEqual({
      kind: 'unknown',
      subdomain: '',
      domain: '',
    });
  });
});

describe('isGroupTenant', () => {
  it('returns true for kind=group', () => {
    const headers = new Headers({ 'x-tenant-kind': 'group' });
    expect(isGroupTenant(headers)).toBe(true);
  });
  it('returns false for non-group', () => {
    const headers = new Headers({ 'x-tenant-kind': 'studio' });
    expect(isGroupTenant(headers)).toBe(false);
  });
});

describe('isStudioTenant', () => {
  it('returns true for kind=studio', () => {
    expect(isStudioTenant(new Headers({ 'x-tenant-kind': 'studio' }))).toBe(true);
  });
  it('returns false for non-studio', () => {
    expect(isStudioTenant(new Headers({ 'x-tenant-kind': 'group' }))).toBe(false);
    expect(isStudioTenant(new Headers({ 'x-tenant-kind': 'network' }))).toBe(false);
    expect(isStudioTenant(new Headers())).toBe(false);
  });
});

describe('isNetworkTenant', () => {
  it('returns true for kind=network', () => {
    expect(isNetworkTenant(new Headers({ 'x-tenant-kind': 'network' }))).toBe(true);
  });
  it('returns false for non-network', () => {
    expect(isNetworkTenant(new Headers({ 'x-tenant-kind': 'studio' }))).toBe(false);
  });
});
