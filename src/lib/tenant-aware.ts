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

export function isStudioTenant(headers: Headers): boolean {
  return parseTenantHeaders(headers).kind === 'studio';
}

export function isNetworkTenant(headers: Headers): boolean {
  return parseTenantHeaders(headers).kind === 'network';
}

export function isNodeTenant(headers: Headers): boolean {
  return parseTenantHeaders(headers).kind === 'node';
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
  return requireTenantByKind(headers, payload, 'group', 'merlx.org');
}

export async function requireStudioTenant(headers: Headers, payload: Payload): Promise<Tenant> {
  return requireTenantByKind(headers, payload, 'studio', 'studio.merlx.org');
}

export async function requireNetworkTenant(headers: Headers, payload: Payload): Promise<Tenant> {
  return requireTenantByKind(headers, payload, 'network', 'network.merlx.org');
}

/**
 * Resolve the node tenant matching the request's subdomain. Each node
 * has its own tenant doc keyed by domain (e.g. nilex.merlx.org).
 */
export async function requireNodeTenant(headers: Headers, payload: Payload): Promise<Tenant> {
  if (!isNodeTenant(headers)) notFound();

  const subdomain = headers.get('x-tenant-subdomain') ?? '';
  const tenantDomain = headers.get('x-tenant-domain') ?? '';
  if (!subdomain) notFound();

  const byDomain = await payload.find({
    collection: 'tenants',
    where: { domain: { equals: tenantDomain } },
    limit: 1,
  });
  let tenant: Tenant | undefined = byDomain.docs[0];

  if (!tenant) {
    const byProdDomain = await payload.find({
      collection: 'tenants',
      where: { domain: { equals: `${subdomain}.merlx.org` } },
      limit: 1,
    });
    tenant = byProdDomain.docs[0];
  }

  if (!tenant) notFound();
  return tenant;
}

/**
 * Resolves the request's own tenant if it's the group, studio, or
 * network tenant. 404s otherwise. Used by routes that exist on
 * multiple sub-sites (Insights, Publications, About, Contact).
 */
export async function requireKnownTenant(headers: Headers, payload: Payload): Promise<Tenant> {
  const { kind } = parseTenantHeaders(headers);
  if (kind === 'group') return requireGroupTenant(headers, payload);
  if (kind === 'studio') return requireStudioTenant(headers, payload);
  if (kind === 'network') return requireNetworkTenant(headers, payload);
  if (kind === 'node') return requireNodeTenant(headers, payload);
  notFound();
}

async function requireTenantByKind(
  headers: Headers,
  payload: Payload,
  kind: TenantContext['kind'],
  defaultDomain: string,
): Promise<Tenant> {
  if (parseTenantHeaders(headers).kind !== kind) notFound();

  const tenantDomain = headers.get('x-tenant-domain') ?? defaultDomain;

  const byDomain = await payload.find({
    collection: 'tenants',
    where: { domain: { equals: tenantDomain } },
    limit: 1,
  });
  let tenant: Tenant | undefined = byDomain.docs[0];

  if (!tenant) {
    const byType = await payload.find({
      collection: 'tenants',
      where: { type: { equals: kind } },
      limit: 1,
    });
    tenant = byType.docs[0];
  }

  if (!tenant) notFound();
  return tenant;
}
