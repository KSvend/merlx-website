import { PageShell } from '@/components/chrome/PageShell';
import { NILEX_NEWS } from '@/content/nilex';
import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export default async function NewsSlugPage({ params }: PageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const item = NILEX_NEWS.find((n) => n.slug === slug);
  if (!item) notFound();

  return (
    <PageShell locale={locale} pathname={`/news/${slug}`}>
      <section className="mx-page-header">
        <div className="mx-container">
          <p className="mx-eyebrow">News · {item.date}</p>
          <h1>{item.title}</h1>
          <p className="mx-lead" style={{ maxWidth: '64ch' }}>
            {item.excerpt}
          </p>
        </div>
      </section>

      <section className="mx-section">
        <div className="mx-container-narrow">
          <p
            style={{
              fontFamily: 'var(--font-display)',
              fontStyle: 'italic',
              fontWeight: 400,
              fontSize: 'clamp(20px, 2.2vw, 24px)',
              lineHeight: 1.4,
              color: 'var(--ink)',
              margin: '0 0 32px',
              maxWidth: '52ch',
            }}
          >
            Full version available under our public archive once the editorial process completes.
            For methodology questions, reach out via the contact form.
          </p>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link href={`/${locale}/news`} className="mx-btn mx-btn--ghost">
              ← All news
            </Link>
            <Link href={`/${locale}/contact`} className="mx-btn mx-btn--primary">
              Contact NileX →
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
