import { PageShell } from '@/components/chrome/PageShell';
import { listPublications } from '@/lib/cms';
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

const TYPE_LABEL: Record<string, string> = {
  'peer-reviewed': 'Peer-reviewed',
  'working-paper': 'Working paper',
  brief: 'Brief',
  methodology: 'Methodology note',
  report: 'Report',
};

export default async function PublicationsIndexPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const headerList = await headers();
  const { kind } = parseTenantHeaders(headerList);
  const payload = await getPayload({ config });
  const tenant = await requireKnownTenant(headerList, payload);
  const docs = await listPublications({ tenant, tenantKind: kind, locale });

  return (
    <PageShell locale={locale} pathname="/publications">
      <section className="mx-page-header">
        <div className="mx-container">
          <p className="mx-eyebrow">Publications</p>
          <h1>
            Working papers, briefs, <em>peer-reviewed research</em>.
          </h1>
          <p className="mx-lead" style={{ maxWidth: '56ch' }}>
            Open-access by default. Methodology notes, evaluation reports and journal articles from
            the Studio and the Network.
          </p>
        </div>
      </section>

      <section className="mx-section">
        <div className="mx-container">
          {docs.length === 0 ? (
            <p
              style={{
                fontFamily: 'var(--font-display)',
                fontStyle: 'italic',
                fontSize: 24,
                color: 'var(--ink-muted)',
                margin: 0,
              }}
            >
              The first cohort of publications is in review.
            </p>
          ) : (
            <div
              className="mx-card"
              style={{ padding: 0, overflow: 'hidden', background: 'var(--surface)' }}
            >
              <table style={tableStyle}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <th style={thStyle}>Year</th>
                    <th style={thStyle}>Type</th>
                    <th style={thStyle}>Title</th>
                    <th style={thStyle}>Authors</th>
                    <th style={thStyle} aria-hidden="true" />
                  </tr>
                </thead>
                <tbody>
                  {docs.map((doc, i) => (
                    <tr
                      key={doc.id}
                      style={{
                        borderBottom:
                          i < docs.length - 1 ? '1px solid var(--border-light)' : 'none',
                      }}
                    >
                      <td style={{ ...tdStyle, ...monoCellStyle }}>{doc.year}</td>
                      <td style={tdStyle}>
                        <span className="mx-tag mx-tag--teal">
                          {TYPE_LABEL[doc.type] ?? doc.type}
                        </span>
                      </td>
                      <td style={tdStyle}>
                        <Link
                          href={`/${locale}/publications/${doc.slug}`}
                          style={{
                            color: 'var(--ink)',
                            fontWeight: 500,
                            textDecoration: 'underline',
                            textDecorationColor: 'var(--border)',
                            textUnderlineOffset: 3,
                          }}
                        >
                          {doc.title}
                        </Link>
                      </td>
                      <td style={{ ...tdStyle, color: 'var(--ink-muted)' }}>
                        {(doc.authors ?? []).map((a) => a.name).join(', ') || '—'}
                      </td>
                      <td style={tdStyle}>
                        {doc.fileUrl ? (
                          <a
                            href={doc.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mx-link-arrow"
                          >
                            PDF →
                          </a>
                        ) : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </PageShell>
  );
}

const tableStyle: CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: 13,
};

const thStyle: CSSProperties = {
  padding: '14px 24px',
  textAlign: 'left',
  fontSize: 10,
  fontWeight: 500,
  textTransform: 'uppercase',
  letterSpacing: '1.5px',
  color: 'var(--ink-faint)',
  fontFamily: 'var(--font-sans)',
};

const tdStyle: CSSProperties = { padding: '18px 24px', verticalAlign: 'top' };

const monoCellStyle: CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: 12,
  color: 'var(--ink-muted)',
  whiteSpace: 'nowrap',
};
