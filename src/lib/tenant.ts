export type TenantKind = 'group' | 'studio' | 'network' | 'node';

export interface ParsedTenant {
  kind: TenantKind;
  subdomain: string | null;
  domain: string;
}

const RESERVED_SUBDOMAINS: Record<string, TenantKind> = {
  studio: 'studio',
  network: 'network',
};

const TOOL_SUBDOMAINS = new Set(['prism', 'iris', 'aperture', 'toc', 'oasis', 'echo']);

export function normalizeHost(host: string): string {
  return host.toLowerCase().replace(/:\d+$/, '');
}

export function parseTenantFromHost(rawHost: string): ParsedTenant {
  const host = normalizeHost(rawHost);
  const labels = host.split('.');

  if (labels.length <= 2) {
    return { kind: 'group', subdomain: null, domain: host };
  }

  const subdomain = labels[0];
  if (!subdomain) {
    return { kind: 'group', subdomain: null, domain: host };
  }

  if (subdomain === 'www') {
    return { kind: 'group', subdomain, domain: host };
  }

  if (TOOL_SUBDOMAINS.has(subdomain)) {
    throw new Error(`Tool subdomain ${subdomain} is not handled by the website tenant resolver`);
  }

  const reserved = RESERVED_SUBDOMAINS[subdomain];
  if (reserved) {
    return { kind: reserved, subdomain, domain: host };
  }

  return { kind: 'node', subdomain, domain: host };
}
