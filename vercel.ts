import type { VercelConfig } from '@vercel/config/v1';

// Content Security Policy
// - 'unsafe-inline' on style-src is required by the project's inline-style
//   pattern (var(--token) + style={{...}}). Tightening to nonce/hash later.
// - script-src includes Cloudflare Turnstile (used by /contact when keys
//   are configured) and challenges domain for the verify call.
// - frame-src for the Turnstile widget iframe.
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "connect-src 'self' https://challenges.cloudflare.com",
  'frame-src https://challenges.cloudflare.com',
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join('; ');

export const config: VercelConfig = {
  buildCommand: 'bun run build',
  framework: 'nextjs',
  installCommand: 'bun install --frozen-lockfile',
  headers: [
    {
      source: '/(.*)',
      headers: [
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        {
          key: 'Strict-Transport-Security',
          value: 'max-age=63072000; includeSubDomains; preload',
        },
        { key: 'Content-Security-Policy', value: CSP },
      ],
    },
    // Payload admin needs looser CSP — its lexical editor + React DnD use
    // patterns that the strict public-site CSP would block. Keep this
    // route group separately scoped.
    {
      source: '/admin/(.*)',
      headers: [
        { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      ],
    },
  ],
};

export default config;
