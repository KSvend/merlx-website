import { PageShell } from '@/components/chrome/PageShell';
import { pageHeroesFor } from '@/content/copy/page-heroes';
import { listInsights } from '@/lib/cms';
import { formatLongDate } from '@/lib/format-date';
import { parseTenantHeaders, requireKnownTenant } from '@/lib/tenant-aware';
import config from '@/payload.config';
import { setRequestLocale } from 'next-intl/server';
import { headers } from 'next/headers';
import Link from 'next/link';
import { getPayload } from 'payload';

interface PageProps {
  params: Promise<{ locale: string }>;
}

const CATEGORY_LABEL: Record<string, string> = {
  news: 'News',
  analysis: 'Analysis',
  'field-note': 'Field note',
  methods: 'Methods',
};

const CATEGORY_ACCENT: Record<string, string> = {
  news: 'var(--iris)',
  analysis: 'var(--deep-teal)',
  'field-note': 'var(--ember)',
  methods: 'var(--ember)',
};

export default async function InsightsIndexPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const headerList = await headers();
  const { kind } = parseTenantHeaders(headerList);
  const payload = await getPayload({ config });
  const tenant = await requireKnownTenant(headerList, payload);
  const posts = await listInsights({ tenant, tenantKind: kind, locale });

  const heroCopy = pageHeroesFor(locale).insights;

  return (
    <PageShell locale={locale} pathname="/insights">
      <section className="mx-page-header">
        <div className="mx-container">
          <p className="mx-eyebrow">{heroCopy.eyebrow}</p>
          <h1>
            {heroCopy.headlinePrefix} <em>{heroCopy.headlineEm}</em>
            {heroCopy.headlineSuffix}
          </h1>
          <p className="mx-lead" style={{ maxWidth: '56ch' }}>
            {heroCopy.lead}
          </p>
        </div>
      </section>

      <section className="mx-section mx-section--shell-warm">
        <div className="mx-container">
          {posts.length === 0 ? (
            <p
              style={{
                fontFamily: 'var(--font-display)',
                fontStyle: 'italic',
                fontSize: 24,
                color: 'var(--ink-muted)',
                margin: 0,
              }}
            >
              No insights yet. Drafts are in flight.
            </p>
          ) : (
            <div
              className="mx-card"
              style={{ padding: 0, overflow: 'hidden', background: 'var(--surface)' }}
            >
              {posts.map((post, i) => {
                const accent = CATEGORY_ACCENT[post.category] ?? 'var(--ink-muted)';
                return (
                  <Link
                    key={post.id}
                    href={`/${locale}/insights/${post.slug}`}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '120px 1fr 60px',
                      gap: 24,
                      padding: '28px 32px',
                      alignItems: 'center',
                      borderBottom: i < posts.length - 1 ? '1px solid var(--border-light)' : 'none',
                      transition: 'background var(--motion-default) var(--easing)',
                    }}
                  >
                    <span
                      style={{
                        fontSize: 11,
                        fontFamily: 'var(--font-mono)',
                        color: 'var(--ink-faint)',
                        letterSpacing: '0.5px',
                        textTransform: 'uppercase',
                      }}
                    >
                      {formatLongDate(post.publishedAt, locale)}
                    </span>
                    <div>
                      <span
                        className="mx-tag"
                        style={{
                          background: 'transparent',
                          color: accent,
                          borderColor: accent,
                          marginBottom: 8,
                        }}
                      >
                        {CATEGORY_LABEL[post.category] ?? post.category}
                      </span>
                      <h3
                        style={{
                          fontFamily: 'var(--font-display)',
                          fontStyle: 'italic',
                          fontWeight: 400,
                          fontSize: 24,
                          lineHeight: 1.25,
                          margin: '8px 0 6px',
                          color: 'var(--ink)',
                          letterSpacing: '-0.3px',
                        }}
                      >
                        {post.title}
                      </h3>
                      {post.excerpt ? (
                        <p
                          style={{
                            fontSize: 12,
                            color: 'var(--ink-muted)',
                            margin: 0,
                            lineHeight: 1.5,
                            maxWidth: '64ch',
                          }}
                        >
                          {post.excerpt}
                        </p>
                      ) : null}
                    </div>
                    <span
                      aria-hidden="true"
                      style={{ color: 'var(--ink-muted)', fontSize: 18, justifySelf: 'end' }}
                    >
                      →
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </PageShell>
  );
}
