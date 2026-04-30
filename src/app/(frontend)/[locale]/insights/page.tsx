import { PageShell } from '@/components/chrome/PageShell';
import type { AppLocale } from '@/i18n/routing';
import { buildAggregateInsightsQuery } from '@/lib/aggregate-feed';
import { requireGroupTenant } from '@/lib/tenant-aware';
import config from '@/payload.config';
import { setRequestLocale } from 'next-intl/server';
import { headers } from 'next/headers';
import Link from 'next/link';
import { getPayload } from 'payload';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function InsightsIndex({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const headerList = await headers();
  const payload = await getPayload({ config });
  const tenant = await requireGroupTenant(headerList, payload);

  const where = buildAggregateInsightsQuery({
    tenantKind: 'group',
    tenantId: tenant.id,
  });

  const posts = await payload.find({
    collection: 'insights-posts',
    where,
    locale: locale as AppLocale,
    sort: '-publishedAt',
    limit: 50,
  });

  return (
    <PageShell locale={locale}>
      <article style={{ maxWidth: 880, margin: '0 auto', padding: '64px 24px' }}>
        <h1
          style={{
            fontFamily: 'var(--font-serif)',
            fontWeight: 600,
            fontSize: 38,
            color: 'var(--color-ink)',
            letterSpacing: '-0.014em',
            margin: '0 0 32px',
          }}
        >
          Insights
        </h1>

        {posts.docs.length === 0 ? (
          <p
            style={{
              fontFamily: 'var(--font-serif)',
              color: 'var(--color-ink-mute)',
              fontStyle: 'italic',
            }}
          >
            Nothing published yet. Check back soon.
          </p>
        ) : (
          <ul
            style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: 24,
            }}
          >
            {posts.docs.map((post) => (
              <li
                key={post.id}
                style={{ borderBottom: '1px solid var(--color-rule)', paddingBottom: 24 }}
              >
                <Link
                  href={`/${locale}/insights/${post.slug}`}
                  style={{ textDecoration: 'none', color: 'var(--color-ink)' }}
                >
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 10,
                      letterSpacing: '0.16em',
                      textTransform: 'uppercase',
                      color: 'var(--color-ink-mute)',
                      marginBottom: 8,
                    }}
                  >
                    {post.category} · {new Date(post.publishedAt).toLocaleDateString(locale)}
                  </div>
                  <h2
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontWeight: 600,
                      fontSize: 22,
                      color: 'var(--color-ink)',
                      margin: '0 0 8px',
                    }}
                  >
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p
                      style={{
                        fontFamily: 'var(--font-serif)',
                        color: 'var(--color-ink-soft)',
                        margin: 0,
                      }}
                    >
                      {post.excerpt}
                    </p>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </article>
    </PageShell>
  );
}
