import { PageShell } from '@/components/chrome/PageShell';
import { setRequestLocale } from 'next-intl/server';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function UopticsPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <PageShell locale={locale}>
      <h1>optics</h1>
      <p>visual rebuild pending</p>
    </PageShell>
  );
}
