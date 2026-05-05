import { PageShell } from '@/components/chrome/PageShell';
import { setRequestLocale } from 'next-intl/server';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function UengagePage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <PageShell locale={locale}>
      <h1>engage</h1>
      <p>visual rebuild pending</p>
    </PageShell>
  );
}
