import { PageShell } from '@/components/chrome/PageShell';
import { RichTextRenderer } from '@/components/pages/RichTextRenderer';
import { isGroupTenant } from '@/lib/tenant-aware';
import config from '@/payload.config';
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical';
import { setRequestLocale } from 'next-intl/server';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { getPayload } from 'payload';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function AboutPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const headerList = await headers();
  if (!isGroupTenant(headerList)) notFound();

  const payload = await getPayload({ config });
  const tenantDomain = headerList.get('x-tenant-domain') ?? 'merlx.org';

  const tenantQuery = await payload.find({
    collection: 'tenants',
    where: { domain: { equals: tenantDomain } },
    limit: 1,
  });
  let tenant = tenantQuery.docs[0];
  if (!tenant) {
    // Fallback: resolve the canonical group tenant by type. The proxy resolves
    // `localhost` to kind='group' but no seeded tenant has domain 'localhost',
    // so a strict domain match fails in dev/test. We've already verified
    // `isGroupTenant` above, so falling back to the group tenant is safe.
    const groupQuery = await payload.find({
      collection: 'tenants',
      where: { type: { equals: 'group' } },
      limit: 1,
    });
    tenant = groupQuery.docs[0];
  }
  if (!tenant) notFound();

  const pageQuery = await payload.find({
    collection: 'pages',
    where: {
      and: [
        { slug: { equals: 'about' } },
        { tenant: { equals: tenant.id } },
        { status: { equals: 'published' } },
      ],
    },
    locale: locale as 'en' | 'ar' | 'fr',
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
            fontSize: 38,
            color: 'var(--color-ink)',
            letterSpacing: '-0.014em',
            margin: '0 0 12px',
          }}
        >
          {page.title}
        </h1>
        {page.subtitle && (
          <p
            style={{
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic',
              color: 'var(--color-ink-mute)',
              fontSize: 16,
              marginBottom: 32,
            }}
          >
            {page.subtitle}
          </p>
        )}
        <RichTextRenderer data={page.body as SerializedEditorState | null | undefined} />
      </article>
    </PageShell>
  );
}
