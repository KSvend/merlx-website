import { PageShell } from '@/components/chrome/PageShell';
import { EmptyState } from '@/components/pages/EmptyState';
import { PageHero } from '@/components/pages/PageHero';
import { Badge, Container } from '@/components/ui';
import { listInsights } from '@/lib/cms';
import { formatLongDate } from '@/lib/format-date';
import { parseTenantHeaders, requireKnownTenant } from '@/lib/tenant-aware';
import config from '@/payload.config';
import { setRequestLocale } from 'next-intl/server';
import { headers } from 'next/headers';
import Link from 'next/link';
import { getPayload } from 'payload';
import type { CSSProperties } from 'react';

interface PageProps {
  params: Promise<{ locale: string }>;
}

const CATEGORY_LABEL: Record<string, string> = {
  news: 'News',
  analysis: 'Analysis',
  'field-note': 'Field note',
  methods: 'Methods',
};

export default async function InsightsIndexPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const headerList = await headers();
  const { kind } = parseTenantHeaders(headerList);
  const payload = await getPayload({ config });
  const tenant = await requireKnownTenant(headerList, payload);

  const posts = await listInsights({ tenant, tenantKind: kind, locale });

  return (
    <PageShell locale={locale} pathname="/insights">
      <PageHero
        eyebrow="Insights"
        title="Notes from the studio and the network."
        flourish="analysis · methods · field"
      />

      <section style={{ paddingBlock: 'var(--space-16)' }}>
        <Container width="standard">
          {posts.length === 0 ? (
            <EmptyState
              title="No insights yet."
              body="Drafts are in flight. New posts will appear here when published."
            />
          ) : (
            <ul style={listStyle}>
              {posts.map((post) => (
                <li key={post.id} style={itemStyle}>
                  <Link href={`/${locale}/insights/${post.slug}`} style={linkStyle}>
                    <div
                      style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 'var(--space-4)',
                          flexWrap: 'wrap',
                        }}
                      >
                        <Badge tone={badgeToneFor(post.category)}>
                          {CATEGORY_LABEL[post.category] ?? post.category}
                        </Badge>
                        <span style={metaStyle}>{formatLongDate(post.publishedAt, locale)}</span>
                      </div>
                      <h2
                        style={{
                          fontFamily: 'var(--font-sans)',
                          fontWeight: 600,
                          fontSize: 'clamp(18px, 1.6vw, 22px)',
                          letterSpacing: '-0.2px',
                          color: 'var(--ink)',
                          margin: 0,
                          lineHeight: 1.3,
                        }}
                      >
                        {post.title}
                      </h2>
                      {post.excerpt ? (
                        <p
                          style={{
                            fontFamily: 'var(--font-sans)',
                            fontSize: 'var(--text-base)',
                            color: 'var(--ink-light)',
                            lineHeight: 1.55,
                            margin: 0,
                            maxWidth: '64ch',
                          }}
                        >
                          {post.excerpt}
                        </p>
                      ) : null}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Container>
      </section>
    </PageShell>
  );
}

const listStyle: CSSProperties = {
  listStyle: 'none',
  padding: 0,
  margin: 0,
  display: 'flex',
  flexDirection: 'column',
};

const itemStyle: CSSProperties = {
  padding: 'var(--space-12) 0',
  borderBottom: '1px solid var(--border-light)',
};

const linkStyle: CSSProperties = {
  display: 'block',
  textDecoration: 'none',
  color: 'inherit',
};

const metaStyle: CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontWeight: 500,
  fontSize: 'var(--text-xxs)',
  color: 'var(--ink-muted)',
  letterSpacing: '0.5px',
  textTransform: 'uppercase',
};

function badgeToneFor(category: string): 'brand' | 'sand' | 'primary' | 'secondary' | 'neutral' {
  switch (category) {
    case 'analysis':
      return 'primary';
    case 'methods':
      return 'brand';
    case 'field-note':
      return 'sand';
    case 'news':
      return 'secondary';
    default:
      return 'neutral';
  }
}
