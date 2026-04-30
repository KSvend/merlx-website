import { ChooserHero } from '@/components/chooser/ChooserHero';
import { PageShell } from '@/components/chrome/PageShell';
import { isGroupTenant } from '@/lib/tenant-aware';
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
  if (!isGroupTenant(headerList)) notFound();

  return (
    <PageShell locale={locale}>
      <ChooserHero />
    </PageShell>
  );
}
