import { PageShell } from '@/components/chrome/PageShell';
import { RichTextRenderer } from '@/components/pages/RichTextRenderer';
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
      <section className="mx-page-header">
        <div className="mx-container">
          <p className="mx-eyebrow">
            {CATEGORY_LABEL[post.category] ?? post.category} ·{' '}
            {formatLongDate(post.publishedAt, locale)}
          </p>
          <h1>{post.title}</h1>
          {post.excerpt ? (
            <p className="mx-lead" style={{ maxWidth: '64ch' }}>
              {post.excerpt}
            </p>
          ) : null}
        </div>
      </section>

      <section className="mx-section">
        <div className="mx-container-narrow">
          {post.body ? (
            // biome-ignore lint/suspicious/noExplicitAny: Lexical body shape
            <RichTextRenderer data={post.body as any} />
          ) : (
            <p className="mx-lead">No body yet.</p>
          )}

          <div
            style={{
              marginTop: 64,
              paddingTop: 24,
              borderTop: '1px solid var(--border-light)',
            }}
          >
            <Link href={`/${locale}/insights`} className="mx-link-arrow">
              ← All insights
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
