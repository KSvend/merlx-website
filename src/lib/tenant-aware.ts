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
