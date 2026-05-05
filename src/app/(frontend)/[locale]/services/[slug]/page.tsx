import { PageShell } from '@/components/chrome/PageShell';
import { setRequestLocale } from 'next-intl/server';

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export default async function SlugPage({ params }: PageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  return (
    <PageShell locale={locale}>
      <h1>{slug}</h1>
      <p>visual rebuild pending</p>
    </PageShell>
  );
}
