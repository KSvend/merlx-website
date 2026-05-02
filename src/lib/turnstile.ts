const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

interface VerifyResponse {
  success: boolean;
  'error-codes'?: string[];
}

export type TurnstileConfig =
  | { enabled: true; siteKey: string; secretKey: string }
  | { enabled: false };

/**
 * Read TURNSTILE_SITE_KEY + TURNSTILE_SECRET_KEY together as one config.
 * Both must be set or both unset; a half-configured pair is the silent
 * spam-bypass failure mode (widget renders but server skips verification).
 * In that mismatched case we log + treat as disabled — fail safe.
 */
export function getTurnstileConfig(): TurnstileConfig {
  const siteKey = process.env.TURNSTILE_SITE_KEY;
  const secretKey = process.env.TURNSTILE_SECRET_KEY;
  if (siteKey && secretKey) return { enabled: true, siteKey, secretKey };
  if (siteKey || secretKey) {
    console.warn(
      `[turnstile] mismatched config — siteKey=${!!siteKey}, secretKey=${!!secretKey}. Both must be set or both unset. Treating as disabled.`,
    );
  }
  return { enabled: false };
}

/**
 * Verify a Cloudflare Turnstile token via the siteverify endpoint.
 * Returns true if and only if Cloudflare confirms the token is valid.
 *
 * If TURNSTILE_SECRET_KEY is not set, returns false (fail-closed).
 */
export async function verifyTurnstileToken(token: string, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return false;

  const body = new URLSearchParams({
    secret,
    response: token,
    remoteip: ip,
  });

  const res = await fetch(VERIFY_URL, {
    method: 'POST',
    body,
  });
  const json = (await res.json()) as VerifyResponse;
  return json.success === true;
}
