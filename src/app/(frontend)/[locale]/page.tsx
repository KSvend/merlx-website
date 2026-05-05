import { PageShell } from '@/components/chrome/PageShell';
import { GroupHome } from '@/components/homes/GroupHome';
import { NetworkHome } from '@/components/homes/NetworkHome';
import { NodeHome } from '@/components/homes/NodeHome';
import { StudioHome } from '@/components/homes/StudioHome';
import { parseTenantHeaders } from '@/lib/tenant-aware';
import { setRequestLocale } from 'next-intl/server';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ locale: string }>;
}

const NODE_NAMES: Record<string, string> = {
  nilex: 'NileX',
};

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const headerList = await headers();
  const { kind, subdomain } = parseTenantHeaders(headerList);

  if (kind === 'node' && !NODE_NAMES[subdomain]) notFound();
  if (kind === 'unknown') notFound();

  const nodeName = kind === 'node' ? (NODE_NAMES[subdomain] ?? subdomain) : undefined;

  return (
    <PageShell locale={locale} pathname="/" nodeName={nodeName}>
      {kind === 'studio' ? (
        <StudioHome locale={locale} />
      ) : kind === 'network' ? (
        <NetworkHome locale={locale} />
      ) : kind === 'node' ? (
        <NodeHome locale={locale} nodeName={nodeName ?? ''} />
      ) : (
        <GroupHome locale={locale} tenantKind={kind} />
      )}
    </PageShell>
  );
}
