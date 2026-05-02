import { PageShell } from '@/components/chrome/PageShell';
import { NILEX_NEWS } from '@/content/nilex';
import { isNodeTenant, parseTenantHeaders } from '@/lib/tenant-aware';
import { setRequestLocale } from 'next-intl/server';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function NewsIndex({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const headerList = await headers();
  if (!isNodeTenant(headerList)) notFound();
  const { subdomain } = parseTenantHeaders(headerList);
  if (subdomain !== 'nilex') notFound();

  return (
    <PageShell locale={locale}>
      <article style={{ maxWidth: 880, margin: '0 auto', padding: '64px 24px 96px' }}>
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
          News
        </p>
        <h1
          style={{
            fontFamily: 'var(--font-serif)',
            fontWeight: 600,
            fontSize: 48,
            letterSpacing: '-0.018em',
            lineHeight: 1.1,
            color: 'var(--color-ink)',
            margin: '0 0 56px',
            maxWidth: 760,
          }}
        >
          What NileX is up to.
        </h1>
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
          {NILEX_NEWS.map((n) => (
            <li
              key={n.slug}
              style={{ borderBottom: '1px solid var(--color-rule)', paddingBottom: 24 }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10,
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  color: 'var(--color-ink-mute)',
                }}
              >
                {n.date}
              </span>
              <h2
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontWeight: 600,
                  fontSize: 22,
                  margin: '8px 0',
                  color: 'var(--color-ink)',
                }}
              >
                {n.title}
              </h2>
              <p
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 15,
                  lineHeight: 1.6,
                  color: 'var(--color-ink-soft)',
                  margin: 0,
                }}
              >
                {n.excerpt}
              </p>
            </li>
          ))}
        </ul>
      </article>
    </PageShell>
  );
}
