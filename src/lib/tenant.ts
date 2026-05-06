export type TenantKind = 'group' | 'studio' | 'network' | 'node' | 'learn' | 'tool';

export interface ParsedTenant {
  kind: TenantKind;
  subdomain: string | null;
  domain: string;
  /** Optics-Suite slug; only set when kind === 'tool'. */
  toolSlug?: string;
}

const RESERVED_SUBDOMAINS: Record<string, TenantKind> = {
  // Group canonical hosts. `merlx.*` lets dev hosts (`merlx.localhost.test`)
  // resolve as the group; production uses the bare `merlx.org` 2-label host.
  merlx: 'group',
  www: 'group',
  studio: 'studio',
  network: 'network',
  learn: 'learn',
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

/**
 * Group home URL the logo links to from any tenant. In production this
 * is the bare 2-label host (`https://merlx.org/{locale}`); in dev it
 * resolves to `http://merlx.localhost.test:3000/{locale}` to match the
 * conventional dev hosts file.
 */
export function deriveGroupHomeHref(currentDomain: string, locale: string): string {
  const isDev = process.env.NODE_ENV !== 'production';
  if (isDev) {
    return `http://merlx.localhost.test:3000/${locale}`;
  }
  const parts = currentDomain.split('.');
  const groupHost = parts.length <= 2 ? currentDomain : parts.slice(-2).join('.');
  return `https://${groupHost}/${locale}`;
}

/**
 * Canonical home URL for a sub-tenant (used by the logo's suffix-text
 * link). Returns null for the group tenant since there is no suffix.
 */
export function deriveTenantHomeHref(
  kind: TenantKind | 'unknown',
  subdomain: string | null,
  locale: string,
): string | null {
  if (kind === 'group' || kind === 'unknown') return null;
  const isDev = process.env.NODE_ENV !== 'production';
  let host: string | null = null;
  if (kind === 'studio') host = isDev ? 'studio.localhost.test' : 'studio.merlx.org';
  else if (kind === 'network') host = isDev ? 'network.localhost.test' : 'network.merlx.org';
  else if (kind === 'learn') host = isDev ? 'learn.localhost.test' : 'learn.merlx.org';
  else if (kind === 'node' && subdomain)
    host = isDev ? `${subdomain}.localhost.test` : `${subdomain}.merlx.org`;
  if (!host) return null;
  const protocol = isDev ? 'http' : 'https';
  const port = isDev ? ':3000' : '';
  return `${protocol}://${host}${port}/${locale}`;
}
