import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { type ParsedTenant, parseTenantFromHost } from './lib/tenant';

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/admin|admin|brand).*)'],
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

  return NextResponse.next({ request: { headers: requestHeaders } });
}
