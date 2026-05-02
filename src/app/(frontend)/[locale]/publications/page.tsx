import { PageShell } from '@/components/chrome/PageShell';
import type { AppLocale } from '@/i18n/routing';
import { buildAggregatePublicationsQuery } from '@/lib/aggregate-feed';
import { parseTenantHeaders, requireKnownTenant } from '@/lib/tenant-aware';
import config from '@/payload.config';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { headers } from 'next/headers';
import Link from 'next/link';
import { getPayload } from 'payload';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function PublicationsIndex({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('feeds');

  const headerList = await headers();
  const payload = await getPayload({ config });
  const tenant = await requireKnownTenant(headerList, payload);
  const { kind } = parseTenantHeaders(headerList);

  const where = buildAggregatePublicationsQuery({
    tenantKind: kind,
    tenantId: tenant.id,
  });

  const pubs = await payload.find({
    collection: 'publications',
    where,
    locale: locale as AppLocale,
    sort: '-year',
    limit: 100,
  });

  return (
    <PageShell locale={locale}>
      <article style={{ maxWidth: 1040, margin: '0 auto', padding: '64px 24px' }}>
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
          {t('publicationsHeading')}
        </h1>

        {pubs.docs.length === 0 ? (
          <p
            style={{
              fontFamily: 'var(--font-serif)',
              color: 'var(--color-ink-mute)',
              fontStyle: 'italic',
            }}
          >
            {t('emptyPublications')}
          </p>
        ) : (
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontFamily: 'var(--font-serif)',
              fontSize: 15,
              color: 'var(--color-ink)',
            }}
          >
            <thead>
              <tr
                style={{
                  borderBottom: '1px solid var(--color-rule)',
                  textAlign: 'start',
                }}
              >
                <th
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 10,
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    color: 'var(--color-ink-mute)',
                    fontWeight: 500,
                    padding: '12px 12px 12px 0',
                    textAlign: 'start',
                  }}
                >
                  {t('tableYear')}
                </th>
                <th
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 10,
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    color: 'var(--color-ink-mute)',
                    fontWeight: 500,
                    padding: '12px',
                    textAlign: 'start',
                  }}
                >
                  {t('tableType')}
                </th>
                <th
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 10,
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    color: 'var(--color-ink-mute)',
                    fontWeight: 500,
                    padding: '12px',
                    textAlign: 'start',
                  }}
                >
                  {t('tableTitle')}
                </th>
                <th
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 10,
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    color: 'var(--color-ink-mute)',
                    fontWeight: 500,
                    padding: '12px',
                    textAlign: 'start',
                  }}
                >
                  {t('tableAuthors')}
                </th>
              </tr>
            </thead>
            <tbody>
              {pubs.docs.map((pub) => (
                <tr key={pub.id} style={{ borderBottom: '1px solid var(--color-rule)' }}>
                  <td
                    style={{
                      padding: '16px 12px 16px 0',
                      fontFamily: 'var(--font-mono)',
                      fontSize: 13,
                      color: 'var(--color-ink-soft)',
                      verticalAlign: 'top',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {pub.year}
                  </td>
                  <td
                    style={{
                      padding: '16px 12px',
                      fontFamily: 'var(--font-mono)',
                      fontSize: 10,
                      letterSpacing: '0.16em',
                      textTransform: 'uppercase',
                      color: 'var(--color-ink-mute)',
                      verticalAlign: 'top',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {pub.type}
                  </td>
                  <td style={{ padding: '16px 12px', verticalAlign: 'top' }}>
                    <Link
                      href={`/${locale}/publications/${pub.slug}`}
                      style={{
                        fontFamily: 'var(--font-serif)',
                        color: 'var(--color-ink)',
                        textDecoration: 'none',
                        fontWeight: 500,
                      }}
                    >
                      {pub.title}
                    </Link>
                  </td>
                  <td
                    style={{
                      padding: '16px 12px',
                      fontFamily: 'var(--font-serif)',
                      color: 'var(--color-ink-soft)',
                      fontSize: 14,
                      verticalAlign: 'top',
                    }}
                  >
                    {pub.authors && pub.authors.length > 0
                      ? pub.authors.map((a) => a.name).join(', ')
                      : ''}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </article>
    </PageShell>
  );
}
