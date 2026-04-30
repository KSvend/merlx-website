import { describe, expect, it, beforeEach } from 'vitest';
import { loadEnv, resetEnvForTests } from '../../src/lib/env.js';

describe('env', () => {
  beforeEach(() => {
    resetEnvForTests();
    delete process.env.DATABASE_URL;
    delete process.env.PAYLOAD_SECRET;
    delete process.env.NEXT_PUBLIC_SITE_URL;
  });

  it('throws when required env vars are missing', () => {
    expect(() => loadEnv()).toThrow();
  });

  it('returns parsed env when all required vars are present', () => {
    process.env.DATABASE_URL = 'postgres://u:p@localhost:5432/db';
    process.env.PAYLOAD_SECRET = 'a'.repeat(32);
    process.env.NEXT_PUBLIC_SITE_URL = 'http://localhost:3000';
    const env = loadEnv();
    expect(env.DATABASE_URL).toBe('postgres://u:p@localhost:5432/db');
    expect(env.PAYLOAD_SECRET.length).toBeGreaterThanOrEqual(32);
  });
});
