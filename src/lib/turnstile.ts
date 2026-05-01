const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

interface VerifyResponse {
  success: boolean;
  'error-codes'?: string[];
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
