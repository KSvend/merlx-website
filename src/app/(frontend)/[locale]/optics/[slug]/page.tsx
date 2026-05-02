import { PageShell } from '@/components/chrome/PageShell';
import { RichTextRenderer } from '@/components/pages/RichTextRenderer';
import type { AppLocale } from '@/i18n/routing';
import { isStudioTenant } from '@/lib/tenant-aware';
import config from '@/payload.config';
import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { headers } from 'next/headers';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPayload } from 'payload';
import type { OpticsTool } from '../../../../../../payload-types';

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const payload = await getPayload({ config });
  const result = await payload.find({
    collection: 'optics-tools',
    where: { slug: { equals: slug } },
    limit: 1,
    locale: locale as AppLocale,
  });
  // biome-ignore lint/suspicious/noExplicitAny: OpticsTool type
  const tool = result.docs[0] as any;
  if (!tool) return {};
  return {
    title: tool.name,
    description: tool.tagline,
    openGraph: { title: tool.name, description: tool.tagline },
  };
}

const STATUS_LABEL: Record<string, string> = {
  live: 'Live',
  beta: 'Beta',
  'coming-soon': 'Coming soon',
};

export default async function OpticsToolPage({ params }: PageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const headerList = await headers();
  if (!isStudioTenant(headerList)) notFound();

  const payload = await getPayload({ config });
  const result = await payload.find({
    collection: 'optics-tools',
    where: { slug: { equals: slug } },
    limit: 1,
    locale: locale as AppLocale,
  });
  const tool = result.docs[0] as OpticsTool | undefined;
  if (!tool) notFound();

  const statusColor =
    tool.status === 'live'
      ? 'var(--color-success, #3BAA7F)'
      : tool.status === 'beta'
        ? 'var(--color-orange)'
        : 'var(--color-ink-mute)';

  return (
    <PageShell locale={locale}>
      <article style={{ maxWidth: 820, margin: '0 auto', padding: '64px 24px 96px' }}>
        <Link
          href={`/${locale}/optics`}
          style={{
            display: 'inline-block',
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            letterSpacing: '0.12em',
            color: 'var(--color-ink-mute)',
            textDecoration: 'none',
            marginBottom: 24,
          }}
        >
          ← Optics Suite
        </Link>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 14 }}>
          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontWeight: 600,
              fontSize: 56,
              letterSpacing: '-0.02em',
              color: 'var(--color-ink)',
              margin: 0,
            }}
          >
            {tool.name}
          </h1>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: statusColor,
              padding: '4px 10px',
              border: `1px solid ${statusColor}`,
              borderRadius: 'var(--radius-pill, 100px)',
            }}
          >
            {STATUS_LABEL[tool.status]}
          </span>
        </div>

        <p
          style={{
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            fontSize: 20,
            lineHeight: 1.5,
            color: 'var(--color-ink-mute)',
            margin: '0 0 36px',
          }}
        >
          {tool.tagline}
        </p>

        {tool.description ? (
          <div
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 17,
              lineHeight: 1.7,
              color: 'var(--color-ink-soft)',
              marginBottom: 48,
            }}
          >
            <RichTextRenderer data={tool.description} />
          </div>
        ) : null}

        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
          {tool.externalUrl ? (
            <a
              href={tool.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '13px 22px',
                background: 'var(--color-orange)',
                color: 'var(--color-bg)',
                borderRadius: 'var(--radius-sm)',
                fontFamily: 'var(--font-sans)',
                fontSize: 13,
                fontWeight: 500,
                textDecoration: 'none',
              }}
            >
              Launch tool ↗
            </a>
          ) : null}
          <Link
            href={`/${locale}/contact?interest=studio&tool=${tool.slug}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '13px 22px',
              border: '1px solid var(--color-rule)',
              color: 'var(--color-ink)',
              borderRadius: 'var(--radius-sm)',
              fontFamily: 'var(--font-sans)',
              fontSize: 13,
              fontWeight: 500,
              textDecoration: 'none',
            }}
          >
            Request a demo →
          </Link>
        </div>

        {tool.subdomain ? (
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              color: 'var(--color-ink-mute)',
              marginTop: 32,
            }}
          >
            {tool.subdomain}
          </p>
        ) : null}
      </article>
    </PageShell>
  );
}
