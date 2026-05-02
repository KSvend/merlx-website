import { PageShell } from '@/components/chrome/PageShell';
import { SERVICES } from '@/content/services';
import { isNetworkTenant } from '@/lib/tenant-aware';
import { setRequestLocale } from 'next-intl/server';
import { headers } from 'next/headers';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function ServicesIndex({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const headerList = await headers();
  if (!isNetworkTenant(headerList)) notFound();

  return (
    <PageShell locale={locale}>
      <article style={{ maxWidth: 980, margin: '0 auto', padding: '64px 24px 96px' }}>
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: 'var(--color-teal)',
            margin: '0 0 18px',
          }}
        >
          Services
        </p>
        <h1
          style={{
            fontFamily: 'var(--font-serif)',
            fontWeight: 600,
            fontSize: 48,
            letterSpacing: '-0.018em',
            lineHeight: 1.1,
            color: 'var(--color-ink)',
            margin: '0 0 18px',
            maxWidth: 720,
          }}
        >
          What network nodes deliver.
        </h1>
        <p
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 17,
            lineHeight: 1.6,
            color: 'var(--color-ink-soft)',
            margin: '0 0 56px',
            maxWidth: 720,
          }}
        >
          Network nodes deliver MERL services under their own governance, with shared methodology
          and cross-node peer review. Services are scoped per engagement; no node delivers all of
          them, and that is the point.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {SERVICES.map((service) => (
            <Link
              key={service.slug}
              href={`/${locale}/services/${service.slug}`}
              style={{
                display: 'grid',
                gridTemplateColumns: '220px 1fr auto',
                alignItems: 'baseline',
                gap: 24,
                padding: '24px 28px',
                border: '1px solid var(--color-rule)',
                borderRadius: 'var(--radius-md)',
                background: 'var(--color-bg)',
                textDecoration: 'none',
                color: 'var(--color-ink)',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 22,
                  fontWeight: 600,
                  letterSpacing: '-0.012em',
                }}
              >
                {service.name}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 14,
                  lineHeight: 1.5,
                  color: 'var(--color-ink-soft)',
                }}
              >
                {service.tagline}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10,
                  letterSpacing: '0.06em',
                  color: 'var(--color-teal)',
                }}
              >
                Read more →
              </span>
            </Link>
          ))}
        </div>
      </article>
    </PageShell>
  );
}
