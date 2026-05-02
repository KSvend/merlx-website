import { PageShell } from '@/components/chrome/PageShell';
import { ENGAGEMENT_MODELS } from '@/content/engage';
import { isStudioTenant } from '@/lib/tenant-aware';
import { setRequestLocale } from 'next-intl/server';
import { headers } from 'next/headers';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function EngageLanding({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const headerList = await headers();
  if (!isStudioTenant(headerList)) notFound();

  return (
    <PageShell locale={locale}>
      <article style={{ maxWidth: 880, margin: '0 auto', padding: '64px 24px 96px' }}>
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: 'var(--color-orange)',
            margin: '0 0 18px',
          }}
        >
          Engage
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
            maxWidth: 740,
          }}
        >
          Four ways to work with the Studio.
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
          Pick the engagement that fits your stage and risk appetite. We will tell you honestly when
          a different model would serve your programme better.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {ENGAGEMENT_MODELS.map((model) => (
            <Link
              key={model.slug}
              href={`/${locale}/engage/${model.slug}`}
              style={{
                display: 'grid',
                gridTemplateColumns: '180px 1fr auto',
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
                  fontSize: 26,
                  fontWeight: 600,
                  letterSpacing: '-0.014em',
                }}
              >
                {model.name}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 15,
                  lineHeight: 1.5,
                  color: 'var(--color-ink-soft)',
                }}
              >
                {model.tagline}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10,
                  letterSpacing: '0.06em',
                  color: 'var(--color-orange)',
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
