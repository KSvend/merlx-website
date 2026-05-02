export type TenantKind = 'group' | 'studio' | 'network' | 'node' | 'tool';

export interface ParsedTenant {
  kind: TenantKind;
  subdomain: string | null;
  domain: string;
  /** Optics-Suite slug; only set when kind === 'tool'. */
  toolSlug?: string;
}

const RESERVED_SUBDOMAINS: Record<string, TenantKind> = {
  studio: 'studio',
  network: 'network',
};

/**
 * Each tool has its own marketing subdomain. The proxy rewrites these
 * to /optics/[slug] under the studio tenant — so the URL stays at the
 * tool subdomain (good for SEO and future direct-to-app cutovers) while
 * the rendered content is the studio's per-tool marketing page.
 */
const TOOL_SUBDOMAIN_SLUGS: Record<string, string> = {
  prism: 'prism',
  iris: 'iris',
  aperture: 'aperture',
  toctester: 'toc-tester',
  oasis: 'oasis',
  echo: 'echo',
};

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

  const toolSlug = TOOL_SUBDOMAIN_SLUGS[subdomain];
  if (toolSlug) {
    return { kind: 'tool', subdomain, domain: host, toolSlug };
  }

  const reserved = RESERVED_SUBDOMAINS[subdomain];
  if (reserved) {
    return { kind: reserved, subdomain, domain: host };
  }

  return { kind: 'node', subdomain, domain: host };
}
