import { PageShell } from '@/components/chrome/PageShell';
import { PageHero } from '@/components/pages/PageHero';
import { RichTextRenderer } from '@/components/pages/RichTextRenderer';
import { Container, Prose } from '@/components/ui';
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
      <PageHero
        eyebrow="Legal"
        title={page.title}
        flourish={page.subtitle ?? undefined}
        width="standard"
      />
      <section style={{ paddingBlock: 'var(--space-16)' }}>
        <Container width="reading">
          {page.body ? (
            // biome-ignore lint/suspicious/noExplicitAny: Lexical body shape
            <RichTextRenderer data={page.body as any} />
          ) : (
            <Prose>
              <p>This document is in preparation.</p>
            </Prose>
          )}
        </Container>
      </section>
    </PageShell>
  );
}
