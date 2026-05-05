import { PageShell } from '@/components/chrome/PageShell';
import { PageHero } from '@/components/pages/PageHero';
import { RichTextRenderer } from '@/components/pages/RichTextRenderer';
import { Container, Prose } from '@/components/ui';
import { findPageBySlug } from '@/lib/cms';
import { parseTenantHeaders, requireKnownTenant } from '@/lib/tenant-aware';
import config from '@/payload.config';
import { setRequestLocale } from 'next-intl/server';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { getPayload } from 'payload';
import type { CSSProperties } from 'react';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function AboutPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const headerList = await headers();
  const { kind } = parseTenantHeaders(headerList);

  const payload = await getPayload({ config });
  const tenant = await requireKnownTenant(headerList, payload);
  const page = await findPageBySlug({ tenant, slug: 'about', locale });

  if (!page) notFound();

  const flourishMap: Record<string, string> = {
    group: 'one studio, one network',
    studio: 'we build the tools',
    network: 'locally owned, federated',
    node: 'a MERLx Network node',
  };

  return (
    <PageShell locale={locale} pathname="/about">
      <PageHero
        eyebrow={`About · ${kind === 'group' ? 'MERLx' : kind}`}
        title={page.title}
        flourish={page.subtitle ?? flourishMap[kind] ?? null}
      />
      <BodySection body={page.body} />
    </PageShell>
  );
}

function BodySection({ body }: { body: unknown }) {
  const wrap: CSSProperties = {
    paddingBlock: 'clamp(var(--space-16), 4vw, var(--space-32))',
  };

  return (
    <section style={wrap}>
      <Container width="reading">
        {body ? (
          // biome-ignore lint/suspicious/noExplicitAny: Lexical body shape
          <RichTextRenderer data={body as any} />
        ) : (
          <Prose>
            <p>This page is in preparation. Check back shortly.</p>
          </Prose>
        )}
      </Container>
    </section>
  );
}
