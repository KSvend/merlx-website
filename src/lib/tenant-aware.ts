import { notFound } from 'next/navigation';
import type { Payload } from 'payload';
import type { Tenant } from '../../payload-types';

export interface TenantContext {
  kind: 'group' | 'studio' | 'network' | 'node' | 'unknown';
  subdomain: string;
  domain: string;
}

export function parseTenantHeaders(headers: Headers): TenantContext {
  const kind = (headers.get('x-tenant-kind') ?? 'unknown') as TenantContext['kind'];
  const subdomain = headers.get('x-tenant-subdomain') ?? '';
  const domain = headers.get('x-tenant-domain') ?? '';
  return { kind, subdomain, domain };
}

export function isGroupTenant(headers: Headers): boolean {
  return parseTenantHeaders(headers).kind === 'group';
}

/**
 * Gate-and-resolve helper for group-tenant-only CMS routes.
 *
 * - Verifies the request is for the group tenant (via `isGroupTenant(headers)`).
 * - Looks up the tenant doc by `domain` header (production path).
 * - Falls back to looking up by `type='group'` if domain match fails (dev/test path —
 *   Playwright's page.goto can't override Host header, so requests come in as
 *   `Host: localhost` which the proxy maps to `kind=group` but stamps
 *   `x-tenant-domain: localhost`, and there's no tenant row with `domain=localhost`).
 * - 404s if any check fails.
 *
 * Returns the resolved Tenant doc.
 */
export async function requireGroupTenant(headers: Headers, payload: Payload): Promise<Tenant> {
  if (!isGroupTenant(headers)) notFound();

  const tenantDomain = headers.get('x-tenant-domain') ?? 'merlx.org';

  const byDomain = await payload.find({
    collection: 'tenants',
    where: { domain: { equals: tenantDomain } },
    limit: 1,
  });
  let tenant: Tenant | undefined = byDomain.docs[0];

  if (!tenant) {
    const byType = await payload.find({
      collection: 'tenants',
      where: { type: { equals: 'group' } },
      limit: 1,
    });
    tenant = byType.docs[0];
  }

  if (!tenant) notFound();
  return tenant;
}
