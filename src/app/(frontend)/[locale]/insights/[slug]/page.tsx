import { PageShell } from '@/components/chrome/PageShell';
import { RichTextRenderer } from '@/components/pages/RichTextRenderer';
import type { AppLocale } from '@/i18n/routing';
import { requireGroupTenant } from '@/lib/tenant-aware';
import config from '@/payload.config';
import { setRequestLocale } from 'next-intl/server';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { getPayload } from 'payload';

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export default async function InsightsPost({ params }: PageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const headerList = await headers();
  const payload = await getPayload({ config });
  await requireGroupTenant(headerList, payload);

  const postQuery = await payload.find({
    collection: 'insights-posts',
    where: {
      and: [{ slug: { equals: slug } }, { status: { equals: 'published' } }],
    },
    locale: locale as AppLocale,
    limit: 1,
  });

  const post = postQuery.docs[0];
  if (!post) notFound();

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
          {post.category} · {new Date(post.publishedAt).toLocaleDateString(locale)}
        </div>
        <h1
          style={{
            fontFamily: 'var(--font-serif)',
            fontWeight: 600,
            fontSize: 38,
            color: 'var(--color-ink)',
            letterSpacing: '-0.014em',
            margin: '0 0 24px',
          }}
        >
          {post.title}
        </h1>
        {post.excerpt && (
          <p
            style={{
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic',
              color: 'var(--color-ink-soft)',
              fontSize: 17,
              marginBottom: 32,
            }}
          >
            {post.excerpt}
          </p>
        )}
        <RichTextRenderer data={post.body} />
      </article>
    </PageShell>
  );
}
