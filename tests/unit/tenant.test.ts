import { describe, expect, it } from 'vitest';
import { normalizeHost, parseTenantFromHost } from '../../src/lib/tenant';

describe('normalizeHost', () => {
  it('strips port', () => {
    expect(normalizeHost('localhost:3000')).toBe('localhost');
    expect(normalizeHost('studio.merlx.org:8080')).toBe('studio.merlx.org');
  });

  it('lowercases', () => {
    expect(normalizeHost('Studio.MERLX.ORG')).toBe('studio.merlx.org');
  });

  it('returns the host as-is when there is no port', () => {
    expect(normalizeHost('merlx.org')).toBe('merlx.org');
  });
});

describe('parseTenantFromHost', () => {
  it('returns group for the bare apex domain', () => {
    expect(parseTenantFromHost('merlx.org')).toEqual({
      kind: 'group',
      subdomain: null,
      domain: 'merlx.org',
    });
  });

  it('returns studio for studio.merlx.org', () => {
    expect(parseTenantFromHost('studio.merlx.org')).toEqual({
      kind: 'studio',
      subdomain: 'studio',
      domain: 'studio.merlx.org',
    });
  });

  it('returns network for network.merlx.org', () => {
    expect(parseTenantFromHost('network.merlx.org')).toEqual({
      kind: 'network',
      subdomain: 'network',
      domain: 'network.merlx.org',
    });
  });

  it('returns node for any other subdomain', () => {
    expect(parseTenantFromHost('nilex.merlx.org')).toEqual({
      kind: 'node',
      subdomain: 'nilex',
      domain: 'nilex.merlx.org',
    });
  });

  it('handles localhost.test apex as group', () => {
    expect(parseTenantFromHost('localhost.test')).toEqual({
      kind: 'group',
      subdomain: null,
      domain: 'localhost.test',
    });
  });

  it('handles studio.localhost.test as studio', () => {
    expect(parseTenantFromHost('studio.localhost.test')).toEqual({
      kind: 'studio',
      subdomain: 'studio',
      domain: 'studio.localhost.test',
    });
  });

  it('treats www as group, not as a node', () => {
    expect(parseTenantFromHost('www.merlx.org')).toEqual({
      kind: 'group',
      subdomain: 'www',
      domain: 'www.merlx.org',
    });
  });
});
