import { PageShell } from '@/components/chrome/PageShell';
import { GroupHome } from '@/components/homes/GroupHome';
import { LearnHome } from '@/components/homes/LearnHome';
import { NetworkHome } from '@/components/homes/NetworkHome';
import { NodeHome } from '@/components/homes/NodeHome';
import { StudioHome } from '@/components/homes/StudioHome';
import { listCourses } from '@/lib/learn-cms';
import { parseTenantHeaders, requireLearnTenant } from '@/lib/tenant-aware';
import config from '@/payload.config';
import { setRequestLocale } from 'next-intl/server';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { getPayload } from 'payload';

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

  // Learn home needs course data + per-track counts; load eagerly here.
  let learnPayload: {
    featured: import('../../../../payload-types').Course[];
    countsByTrack: Record<string, number>;
  } | null = null;
  if (kind === 'learn') {
    const payload = await getPayload({ config });
    const tenant = await requireLearnTenant(headerList, payload);
    const all = await listCourses({ tenant, locale });
    const enrolling = all.filter((c) => c.status === 'open' || c.status === 'starting-soon');
    const featured = enrolling.length > 0 ? enrolling : all;
    const countsByTrack = all.reduce<Record<string, number>>((acc, c) => {
      acc[c.track] = (acc[c.track] ?? 0) + 1;
      return acc;
    }, {});
    learnPayload = { featured, countsByTrack };
  }

  return (
    <PageShell locale={locale} pathname="/" nodeName={nodeName}>
      {kind === 'studio' ? (
        <StudioHome locale={locale} />
      ) : kind === 'network' ? (
        <NetworkHome locale={locale} />
      ) : kind === 'node' ? (
        <NodeHome locale={locale} nodeName={nodeName ?? ''} />
      ) : kind === 'learn' && learnPayload ? (
        <LearnHome
          locale={locale}
          featured={learnPayload.featured}
          countsByTrack={learnPayload.countsByTrack}
        />
      ) : (
        <GroupHome locale={locale} tenantKind={kind} />
      )}
    </PageShell>
  );
}
