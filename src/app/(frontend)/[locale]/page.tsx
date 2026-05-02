import { ChooserHero } from '@/components/chooser/ChooserHero';
import { PageShell } from '@/components/chrome/PageShell';
import { StudioHome } from '@/components/studio/StudioHome';
import { isGroupTenant, isStudioTenant } from '@/lib/tenant-aware';
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
  if (!isGroupTenant(headerList)) notFound();

  return (
    <PageShell locale={locale}>
      <ChooserHero />
    </PageShell>
  );
}
