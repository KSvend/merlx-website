import { PageShell } from '@/components/chrome/PageShell';
import { PageHero } from '@/components/pages/PageHero';
import { RichTextRenderer } from '@/components/pages/RichTextRenderer';
import { Badge, Container } from '@/components/ui';
import { findInsightBySlug } from '@/lib/cms';
import { formatLongDate } from '@/lib/format-date';
import { parseTenantHeaders, requireKnownTenant } from '@/lib/tenant-aware';
import config from '@/payload.config';
import { setRequestLocale } from 'next-intl/server';
import { headers } from 'next/headers';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPayload } from 'payload';

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

const CATEGORY_LABEL: Record<string, string> = {
  news: 'News',
  analysis: 'Analysis',
  'field-note': 'Field note',
  methods: 'Methods',
};

export default async function InsightSlugPage({ params }: PageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const headerList = await headers();
  const { kind } = parseTenantHeaders(headerList);
  const payload = await getPayload({ config });
  const tenant = await requireKnownTenant(headerList, payload);

  const post = await findInsightBySlug({ tenant, tenantKind: kind, slug, locale });
  if (!post) notFound();

  return (
    <PageShell locale={locale} pathname={`/insights/${slug}`}>
      <PageHero
        eyebrow={
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <Badge tone="primary">{CATEGORY_LABEL[post.category] ?? post.category}</Badge>
            <span>{formatLongDate(post.publishedAt, locale)}</span>
          </span>
        }
        title={post.title}
        subtitle={post.excerpt ?? undefined}
        width="standard"
      />

      <section style={{ paddingBlock: 'var(--space-16)' }}>
        <Container width="reading">
          {post.body ? (
            // biome-ignore lint/suspicious/noExplicitAny: Lexical body shape
            <RichTextRenderer data={post.body as any} />
          ) : (
            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'var(--text-base)',
                color: 'var(--ink-muted)',
              }}
            >
              No body yet.
            </p>
          )}
          <div
            style={{
              marginTop: 'var(--space-24)',
              paddingTop: 'var(--space-12)',
              borderTop: '1px solid var(--border-light)',
            }}
          >
            <Link
              href={`/${locale}/insights`}
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'var(--text-sm)',
                color: 'var(--deep-teal)',
                textDecoration: 'underline',
                textDecorationColor: 'var(--deep-teal-dim)',
                textUnderlineOffset: '3px',
              }}
            >
              ← All insights
            </Link>
          </div>
        </Container>
      </section>
    </PageShell>
  );
}
