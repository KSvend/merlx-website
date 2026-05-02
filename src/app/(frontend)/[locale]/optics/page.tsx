import { PageShell } from '@/components/chrome/PageShell';
import type { AppLocale } from '@/i18n/routing';
import { isStudioTenant } from '@/lib/tenant-aware';
import config from '@/payload.config';
import { setRequestLocale } from 'next-intl/server';
import { headers } from 'next/headers';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPayload } from 'payload';
import type { OpticsTool } from '../../../../../payload-types';

interface PageProps {
  params: Promise<{ locale: string }>;
}

const STATUS_LABEL: Record<string, string> = {
  live: 'Live',
  beta: 'Beta',
  'coming-soon': 'Coming soon',
};

export default async function OpticsLanding({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const headerList = await headers();
  if (!isStudioTenant(headerList)) notFound();

  const payload = await getPayload({ config });
  const result = await payload.find({
    collection: 'optics-tools',
    sort: 'order',
    limit: 12,
    locale: locale as AppLocale,
  });
  const tools = result.docs as OpticsTool[];

  return (
    <PageShell locale={locale}>
      <article style={{ maxWidth: 980, margin: '0 auto', padding: '64px 24px 96px' }}>
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
          The Optics Suite
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
            maxWidth: 820,
          }}
        >
          Six tools, one thesis: better evidence wins better arguments.
        </h1>
        <p
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 17,
            lineHeight: 1.6,
            color: 'var(--color-ink-soft)',
            margin: '0 0 56px',
            maxWidth: 740,
          }}
        >
          The Optics Suite is a coordinated set of analytical tools for monitoring, evaluation,
          research and early warning in fragile contexts. Each tool stands on its own; together they
          cover the field-research lifecycle from satellite to interview to forecast.
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 22,
          }}
        >
          {tools.map((tool) => (
            <Link
              key={tool.id}
              href={`/${locale}/optics/${tool.slug}`}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                padding: 24,
                border: '1px solid var(--color-rule)',
                borderRadius: 'var(--radius-md)',
                background: 'var(--color-bg)',
                textDecoration: 'none',
                color: 'var(--color-ink)',
                minHeight: 200,
              }}
            >
              <div
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: 26,
                    fontWeight: 600,
                    letterSpacing: '-0.014em',
                  }}
                >
                  {tool.name}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 9,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color:
                      tool.status === 'live'
                        ? 'var(--color-success, #3BAA7F)'
                        : tool.status === 'beta'
                          ? 'var(--color-orange)'
                          : 'var(--color-ink-mute)',
                  }}
                >
                  {STATUS_LABEL[tool.status]}
                </span>
              </div>
              <p
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 15,
                  lineHeight: 1.5,
                  color: 'var(--color-ink-soft)',
                  margin: 0,
                  flex: 1,
                }}
              >
                {tool.tagline}
              </p>
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
