import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { verifyTurnstileToken } from '../../src/lib/turnstile';

describe('verifyTurnstileToken', () => {
  const fetchSpy = vi.fn();

  beforeEach(() => {
    vi.stubGlobal('fetch', fetchSpy);
    fetchSpy.mockReset();
    process.env.TURNSTILE_SECRET_KEY = 'test-secret';
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    process.env.TURNSTILE_SECRET_KEY = undefined;
  });

  it('returns true when Cloudflare returns success: true', async () => {
    fetchSpy.mockResolvedValue({ json: async () => ({ success: true }) });
    const result = await verifyTurnstileToken('valid-token', '1.2.3.4');
    expect(result).toBe(true);
    expect(fetchSpy).toHaveBeenCalledOnce();
  });

  it('returns false when Cloudflare returns success: false', async () => {
    fetchSpy.mockResolvedValue({
      json: async () => ({ success: false, 'error-codes': ['invalid-input-response'] }),
    });
    const result = await verifyTurnstileToken('bad-token', '1.2.3.4');
    expect(result).toBe(false);
  });

  it('returns false when secret key is missing', async () => {
    process.env.TURNSTILE_SECRET_KEY = '';
    const result = await verifyTurnstileToken('any-token', '1.2.3.4');
    expect(result).toBe(false);
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});
