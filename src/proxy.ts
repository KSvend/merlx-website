import createIntlMiddleware from 'next-intl/middleware';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { routing } from './i18n/routing';
import { parseTenantFromHost } from './lib/tenant';

const intlMiddleware = createIntlMiddleware(routing);

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api|admin|brand).*)'],
};

// Paths handled by Next's metadata routes (sitemap/robots) — they need
// tenant headers stamped but NOT the next-intl locale redirect.
const METADATA_PATHS = new Set(['/sitemap.xml', '/robots.txt']);

const LOCALE_PREFIX = /^\/(en|ar|fr)(\/|$)/;

export function proxy(request: NextRequest): NextResponse {
  const host = request.headers.get('host') ?? '';
  const tenant = parseTenantFromHost(host);

  // Tool subdomain (prism.merlx.org, etc.) → rewrite to the studio
  // per-tool marketing page, stamp studio tenant headers. URL bar stays
  // at the tool subdomain.
  if (tenant.kind === 'tool' && tenant.toolSlug) {
    const url = request.nextUrl.clone();
    const path = url.pathname;
    if (path === '/' || path === '') {
      url.pathname = `/en/optics/${tenant.toolSlug}`;
    } else if (!LOCALE_PREFIX.test(path)) {
      url.pathname = `/en${path}`;
    }
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-tenant-kind', 'studio');
    requestHeaders.set('x-tenant-subdomain', tenant.subdomain ?? '');
    requestHeaders.set('x-tenant-domain', `${tenant.subdomain}.merlx.org`);
    const rewrite = NextResponse.rewrite(url, { request: { headers: requestHeaders } });
    rewrite.headers.set('x-tenant-kind', 'studio');
    rewrite.headers.set('x-tenant-subdomain', tenant.subdomain ?? '');
    rewrite.headers.set('x-tenant-domain', `${tenant.subdomain}.merlx.org`);
    return rewrite;
  }

  // Mutate the request headers in place so that downstream `headers()` calls
  // in layouts/pages and any handler reading from request headers can read
  // the tenant info. (next-intl middleware reads from request.headers.)
  request.headers.set('x-tenant-kind', tenant.kind);
  request.headers.set('x-tenant-subdomain', tenant.subdomain ?? '');
  request.headers.set('x-tenant-domain', tenant.domain);

  // Sitemap + robots: skip intl, just forward with tenant headers.
  if (METADATA_PATHS.has(request.nextUrl.pathname)) {
    const requestHeaders = new Headers(request.headers);
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  if (request.nextUrl.pathname.startsWith('/tenant-debug')) {
    // Build a NextResponse.next that explicitly forwards the rewritten
    // request headers so the route handler sees them via `headers()`.
    const requestHeaders = new Headers(request.headers);
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  const intlResponse = intlMiddleware(request);

  // For non-redirect responses, also forward the rewritten request headers
  // through so the rendered page's `headers()` calls see the tenant info.
  if (intlResponse.status < 300 || intlResponse.status >= 400) {
    const requestHeaders = new Headers(request.headers);
    const passthrough = NextResponse.next({ request: { headers: requestHeaders } });
    // Copy any headers/cookies the intl middleware set onto the response
    // (e.g. NEXT_LOCALE cookie, x-middleware-rewrite) onto our passthrough.
    intlResponse.headers.forEach((value, key) => {
      passthrough.headers.set(key, value);
    });
    passthrough.headers.set('x-tenant-kind', tenant.kind);
    passthrough.headers.set('x-tenant-subdomain', tenant.subdomain ?? '');
    passthrough.headers.set('x-tenant-domain', tenant.domain);
    return passthrough;
  }

  // Redirect — propagate tenant on response only (the next request will redo the proxy).
  intlResponse.headers.set('x-tenant-kind', tenant.kind);
  intlResponse.headers.set('x-tenant-subdomain', tenant.subdomain ?? '');
  intlResponse.headers.set('x-tenant-domain', tenant.domain);
  return intlResponse;
}
