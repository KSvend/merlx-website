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

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-tenant-kind', tenant.kind);
  requestHeaders.set('x-tenant-subdomain', tenant.subdomain ?? '');
  requestHeaders.set('x-tenant-domain', tenant.domain);

  if (request.nextUrl.pathname.startsWith('/tenant-debug')) {
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  const intlResponse = intlMiddleware(request);
  intlResponse.headers.set('x-tenant-kind', tenant.kind);
  intlResponse.headers.set('x-tenant-subdomain', tenant.subdomain ?? '');
  intlResponse.headers.set('x-tenant-domain', tenant.domain);
  return intlResponse;
}
