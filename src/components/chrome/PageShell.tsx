import { deriveGroupHomeHref, deriveTenantHomeHref } from '@/lib/tenant';
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
 *
 * Computes the two brand-link targets (group root + own-tenant root)
 * and passes them through. The logo always points back to the group
 * root; the tenant suffix in the wordmark links to the tenant root.
 */
export async function PageShell({ locale, children, pathname = '/', nodeName }: PageShellProps) {
  const headerList = await headers();
  const tenant = parseTenantHeaders(headerList);
  const resolvedNodeName =
    nodeName ??
    (tenant.kind === 'node' ? (NODE_NAMES[tenant.subdomain] ?? tenant.subdomain) : undefined);

  const groupHomeHref = deriveGroupHomeHref(tenant.domain, locale);
  const tenantHomeHref = deriveTenantHomeHref(tenant.kind, tenant.subdomain || null, locale);

  return (
    <div className="mx-page" data-tenant={tenant.kind}>
      <SiteNav
        tenant={tenant}
        locale={locale}
        pathname={pathname}
        nodeName={resolvedNodeName}
        groupHomeHref={groupHomeHref}
        tenantHomeHref={tenantHomeHref}
      />
      <main className="mx-main">{children}</main>
      <SiteFooter
        tenant={tenant}
        locale={locale}
        nodeName={resolvedNodeName}
        groupHomeHref={groupHomeHref}
        tenantHomeHref={tenantHomeHref}
      />
    </div>
  );
}
