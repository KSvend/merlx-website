import { PageShell } from '@/components/chrome/PageShell';
import { setRequestLocale } from 'next-intl/server';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function UaboutPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <PageShell locale={locale}>
      <h1>about</h1>
      <p>visual rebuild pending</p>
    </PageShell>
  );
}
