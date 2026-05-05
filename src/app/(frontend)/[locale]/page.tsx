import { PageShell } from '@/components/chrome/PageShell';
import {
  isGroupTenant,
  isNetworkTenant,
  isNodeTenant,
  isStudioTenant,
  parseTenantHeaders,
} from '@/lib/tenant-aware';
import { setRequestLocale } from 'next-intl/server';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const headerList = await headers();
  const { kind, subdomain } = parseTenantHeaders(headerList);
  const known =
    isGroupTenant(headerList) ||
    isStudioTenant(headerList) ||
    isNetworkTenant(headerList) ||
    (isNodeTenant(headerList) && subdomain === 'nilex');
  if (!known) notFound();

  return (
    <PageShell locale={locale}>
      <h1>MERLx</h1>
      <p>
        tenant: {kind}
        {subdomain ? ` · ${subdomain}` : ''}
      </p>
      <p>visual rebuild pending</p>
    </PageShell>
  );
}
