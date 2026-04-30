import createIntlMiddleware from 'next-intl/middleware';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { routing } from './i18n/routing';
import { type ParsedTenant, parseTenantFromHost } from './lib/tenant';

const intlMiddleware = createIntlMiddleware(routing);

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api|admin|brand).*)'],
};

export function proxy(request: NextRequest): NextResponse {
  const host = request.headers.get('host') ?? '';

  let tenant: ParsedTenant;
  try {
    tenant = parseTenantFromHost(host);
  } catch (error) {
    if (error instanceof Error && error.message.includes('Tool subdomain')) {
      return NextResponse.next();
    }
    throw error;
  }

  // Mutate the request headers in place so that downstream `headers()` calls
  // in layouts/pages and any handler reading from request headers can read
  // the tenant info. (next-intl middleware reads from request.headers.)
  request.headers.set('x-tenant-kind', tenant.kind);
  request.headers.set('x-tenant-subdomain', tenant.subdomain ?? '');
  request.headers.set('x-tenant-domain', tenant.domain);

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
