import { PageShell } from '@/components/chrome/PageShell';
import { RichTextRenderer } from '@/components/pages/RichTextRenderer';
import { findPageBySlug } from '@/lib/cms';
import { requireKnownTenant } from '@/lib/tenant-aware';
import config from '@/payload.config';
import { setRequestLocale } from 'next-intl/server';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { getPayload } from 'payload';

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

const ALLOWED_SLUGS = new Set(['privacy', 'terms', 'cookies']);

export default async function LegalSlugPage({ params }: PageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  if (!ALLOWED_SLUGS.has(slug)) notFound();

  const headerList = await headers();
  const payload = await getPayload({ config });
  const tenant = await requireKnownTenant(headerList, payload);
  const page = await findPageBySlug({ tenant, slug: `legal/${slug}`, locale });
  if (!page) notFound();

  return (
    <PageShell locale={locale} pathname={`/legal/${slug}`}>
      <section className="mx-page-header">
        <div className="mx-container">
          <p className="mx-eyebrow">Legal</p>
          <h1>{page.title}</h1>
          {page.subtitle ? (
            <p className="mx-lead" style={{ maxWidth: '56ch' }}>
              {page.subtitle}
            </p>
          ) : null}
        </div>
      </section>

      <section className="mx-section">
        <div className="mx-container-narrow">
          {page.body ? (
            // biome-ignore lint/suspicious/noExplicitAny: Lexical body shape
            <RichTextRenderer data={page.body as any} />
          ) : (
            <p className="mx-lead">This document is in preparation.</p>
          )}
        </div>
      </section>
    </PageShell>
  );
}
