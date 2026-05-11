import { PageShell } from '@/components/chrome/PageShell';
import { LandingB } from '@/components/lab/LandingB';
import { isGroupTenant } from '@/lib/tenant-aware';
import { setRequestLocale } from 'next-intl/server';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function LabLandingBPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const headerList = await headers();
  if (process.env.NODE_ENV === 'production') notFound();
  if (!isGroupTenant(headerList)) notFound();

  return (
    <PageShell locale={locale} pathname="/lab/landing-b">
      <LandingB />
    </PageShell>
  );
}
