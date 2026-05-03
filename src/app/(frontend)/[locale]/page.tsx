import { PageShell } from '@/components/chrome/PageShell';
import { WorldLanding } from '@/components/landing/WorldLanding';
import { NetworkHome } from '@/components/network/NetworkHome';
import { NilexHome } from '@/components/nilex/NilexHome';
import { StudioHome } from '@/components/studio/StudioHome';
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
  if (isStudioTenant(headerList)) {
    return (
      <PageShell locale={locale}>
        <StudioHome locale={locale} />
      </PageShell>
    );
  }
  if (isNetworkTenant(headerList)) {
    return (
      <PageShell locale={locale}>
        <NetworkHome locale={locale} />
      </PageShell>
    );
  }
  if (isNodeTenant(headerList)) {
    const { subdomain } = parseTenantHeaders(headerList);
    if (subdomain === 'nilex') {
      return (
        <PageShell locale={locale}>
          <NilexHome locale={locale} />
        </PageShell>
      );
    }
    notFound();
  }
  if (!isGroupTenant(headerList)) notFound();

  return (
    <PageShell locale={locale}>
      <WorldLanding locale={locale} />
    </PageShell>
  );
}
