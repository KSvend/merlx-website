import { parseTenantHeaders } from '@/lib/tenant-aware';
import { headers } from 'next/headers';
import type { ReactNode } from 'react';
import { SiteFooter } from './SiteFooter';
import { SiteNav } from './SiteNav';

interface PageShellProps {
  locale: string;
  children: ReactNode;
  /** Path within the current tenant, leading slash. Defaults to '/'. */
  pathname?: string;
  /** Override the node display name (otherwise inferred from subdomain). */
  nodeName?: string;
}

const NODE_NAMES: Record<string, string> = {
  nilex: 'NileX',
};

/**
 * PageShell — top-level frame for every (frontend) route. Reads tenant
 * headers, renders SiteNav + SiteFooter, and gives the page body a
 * full-width container with a `shell` background.
 */
export async function PageShell({ locale, children, pathname = '/', nodeName }: PageShellProps) {
  const headerList = await headers();
  const tenant = parseTenantHeaders(headerList);
  const resolvedNodeName =
    nodeName ??
    (tenant.kind === 'node' ? (NODE_NAMES[tenant.subdomain] ?? tenant.subdomain) : undefined);

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--shell)',
        color: 'var(--ink)',
      }}
    >
      <SiteNav tenant={tenant} locale={locale} pathname={pathname} nodeName={resolvedNodeName} />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>{children}</main>
      <SiteFooter tenant={tenant} locale={locale} nodeName={resolvedNodeName} />
    </div>
  );
}
