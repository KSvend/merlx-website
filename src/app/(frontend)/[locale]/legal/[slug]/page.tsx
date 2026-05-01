import { PageShell } from '@/components/chrome/PageShell';
import { RichTextRenderer } from '@/components/pages/RichTextRenderer';
import type { AppLocale } from '@/i18n/routing';
import { requireGroupTenant } from '@/lib/tenant-aware';
import config from '@/payload.config';
import { setRequestLocale } from 'next-intl/server';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { getPayload } from 'payload';

const ALLOWED_SLUGS = ['privacy', 'terms', 'cookies'] as const;

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export default async function LegalPage({ params }: PageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  if (!ALLOWED_SLUGS.includes(slug as (typeof ALLOWED_SLUGS)[number])) notFound();

  const headerList = await headers();
  const payload = await getPayload({ config });
  const tenant = await requireGroupTenant(headerList, payload);

  const pageQuery = await payload.find({
    collection: 'pages',
    where: {
      and: [
        { slug: { equals: `legal/${slug}` } },
        { tenant: { equals: tenant.id } },
        { status: { equals: 'published' } },
      ],
    },
    locale: locale as AppLocale,
    limit: 1,
  });

  const page = pageQuery.docs[0];
  if (!page) notFound();

  return (
    <PageShell locale={locale}>
      <article style={{ maxWidth: 720, margin: '0 auto', padding: '64px 24px' }}>
        <h1
          style={{
            fontFamily: 'var(--font-serif)',
            fontWeight: 600,
            fontSize: 32,
            color: 'var(--color-ink)',
            letterSpacing: '-0.012em',
            margin: '0 0 24px',
          }}
        >
          {page.title}
        </h1>
        <RichTextRenderer data={page.body} />
      </article>
    </PageShell>
  );
}
