import { PageShell } from '@/components/chrome/PageShell';
import { LandingC } from '@/components/lab/LandingC';
import { isGroupTenant } from '@/lib/tenant-aware';
import { setRequestLocale } from 'next-intl/server';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function LabLandingCPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const headerList = await headers();
  if (process.env.NODE_ENV === 'production') notFound();
  if (!isGroupTenant(headerList)) notFound();

  return (
    <PageShell locale={locale} pathname="/lab/landing-c">
      <LandingC />
    </PageShell>
  );
}
