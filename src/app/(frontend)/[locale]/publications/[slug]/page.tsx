import { PageShell } from '@/components/chrome/PageShell';
import type { AppLocale } from '@/i18n/routing';
import { requireKnownTenant } from '@/lib/tenant-aware';
import config from '@/payload.config';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { getPayload } from 'payload';

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export default async function PublicationDetail({ params }: PageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('feeds');

  const headerList = await headers();
  const payload = await getPayload({ config });
  // Gate-only: group front door surfaces all publications addressable by slug
  await requireKnownTenant(headerList, payload);

  const pubQuery = await payload.find({
    collection: 'publications',
    where: {
      and: [{ slug: { equals: slug } }, { status: { equals: 'published' } }],
    },
    locale: locale as AppLocale,
    limit: 1,
  });

  const pub = pubQuery.docs[0];
  if (!pub) notFound();

  return (
    <PageShell locale={locale}>
      <article style={{ maxWidth: 720, margin: '0 auto', padding: '64px 24px' }}>
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: 'var(--color-ink-mute)',
            marginBottom: 16,
          }}
        >
          {pub.type} · {pub.year}
        </div>
        <h1
          style={{
            fontFamily: 'var(--font-serif)',
            fontWeight: 600,
            fontSize: 32,
            color: 'var(--color-ink)',
            letterSpacing: '-0.012em',
            margin: '0 0 16px',
          }}
        >
          {pub.title}
        </h1>
        {pub.authors && pub.authors.length > 0 && (
          <div
            style={{
              fontFamily: 'var(--font-serif)',
              color: 'var(--color-ink-soft)',
              fontSize: 15,
              marginBottom: 24,
            }}
          >
            {pub.authors.map((a) => a.name).join(', ')}
          </div>
        )}
        {pub.abstract && (
          <p
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 16,
              lineHeight: 1.6,
              color: 'var(--color-ink-soft)',
              marginBottom: 32,
            }}
          >
            {pub.abstract}
          </p>
        )}
        {pub.fileUrl && (
          <a
            href={pub.fileUrl}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '12px 18px',
              background: 'var(--color-teal)',
              color: 'var(--color-bg)',
              borderRadius: 'var(--radius-sm)',
              fontFamily: 'var(--font-sans)',
              fontSize: 13,
              fontWeight: 500,
              textDecoration: 'none',
            }}
          >
            {t('downloadPdf')}
          </a>
        )}
        {pub.doi && (
          <p
            style={{
              marginTop: 24,
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              color: 'var(--color-ink-mute)',
            }}
          >
            DOI: {pub.doi}
          </p>
        )}
      </article>
    </PageShell>
  );
}
