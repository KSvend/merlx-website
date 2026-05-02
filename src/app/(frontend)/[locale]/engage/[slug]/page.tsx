import { PageShell } from '@/components/chrome/PageShell';
import { ENGAGEMENT_MODELS } from '@/content/engage';
import { isStudioTenant } from '@/lib/tenant-aware';
import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { headers } from 'next/headers';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const model = ENGAGEMENT_MODELS.find((m) => m.slug === slug);
  if (!model) return {};
  return {
    title: `${model.name} engagement`,
    description: model.tagline,
    openGraph: { title: `${model.name} engagement`, description: model.tagline },
  };
}

export default async function EngagementModelPage({ params }: PageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const headerList = await headers();
  if (!isStudioTenant(headerList)) notFound();

  const model = ENGAGEMENT_MODELS.find((m) => m.slug === slug);
  if (!model) notFound();

  return (
    <PageShell locale={locale}>
      <article style={{ maxWidth: 760, margin: '0 auto', padding: '64px 24px 96px' }}>
        <Link
          href={`/${locale}/engage`}
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
          ← Engage
        </Link>

        <h1
          style={{
            fontFamily: 'var(--font-serif)',
            fontWeight: 600,
            fontSize: 52,
            letterSpacing: '-0.018em',
            color: 'var(--color-ink)',
            margin: '0 0 14px',
          }}
        >
          {model.name}
        </h1>
        <p
          style={{
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            fontSize: 19,
            color: 'var(--color-ink-mute)',
            margin: '0 0 36px',
            lineHeight: 1.4,
          }}
        >
          {model.tagline}
        </p>

        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: 'var(--color-orange)',
            margin: '0 0 6px',
          }}
        >
          Best fit
        </p>
        <p
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 16,
            color: 'var(--color-ink-soft)',
            margin: '0 0 36px',
            maxWidth: 640,
          }}
        >
          {model.fit}
        </p>

        <p
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 17,
            lineHeight: 1.7,
            color: 'var(--color-ink-soft)',
            margin: '0 0 36px',
          }}
        >
          {model.description}
        </p>

        <ul
          style={{
            listStyle: 'none',
            padding: 0,
            margin: '0 0 48px',
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            fontFamily: 'var(--font-serif)',
            fontSize: 15,
            color: 'var(--color-ink-soft)',
          }}
        >
          {model.bullets.map((bullet) => (
            <li key={bullet} style={{ display: 'flex', gap: 12, alignItems: 'baseline' }}>
              <span style={{ color: 'var(--color-orange)' }}>→</span>
              <span>{bullet}</span>
            </li>
          ))}
        </ul>

        <Link
          href={`/${locale}/contact?interest=${model.slug}`}
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
          Talk about a {model.name.toLowerCase()} engagement →
        </Link>
      </article>
    </PageShell>
  );
}
