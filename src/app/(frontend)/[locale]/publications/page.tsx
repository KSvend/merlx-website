import { PageShell } from '@/components/chrome/PageShell';
import { EmptyState } from '@/components/pages/EmptyState';
import { PageHero } from '@/components/pages/PageHero';
import { Badge, Container } from '@/components/ui';
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
      <PageHero
        eyebrow="Publications"
        title="Working papers, briefs, and peer-reviewed research."
        flourish="open-access by default"
      />

      <section style={{ paddingBlock: 'var(--space-16)' }}>
        <Container width="standard">
          {docs.length === 0 ? (
            <EmptyState
              title="No publications yet."
              body="The first cohort of working papers is in review."
            />
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={thStyle}>Year</th>
                    <th style={thStyle}>Type</th>
                    <th style={thStyle}>Title</th>
                    <th style={thStyle}>Authors</th>
                    <th style={thStyle} aria-hidden="true" />
                  </tr>
                </thead>
                <tbody>
                  {docs.map((doc) => (
                    <tr key={doc.id} style={trStyle}>
                      <td style={{ ...tdStyle, ...monoCellStyle }}>{doc.year}</td>
                      <td style={tdStyle}>
                        <Badge tone="primary">{TYPE_LABEL[doc.type] ?? doc.type}</Badge>
                      </td>
                      <td style={tdStyle}>
                        <Link href={`/${locale}/publications/${doc.slug}`} style={titleLinkStyle}>
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
                            style={pdfLinkStyle}
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
        </Container>
      </section>
    </PageShell>
  );
}

const tableStyle: CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  fontFamily: 'var(--font-sans)',
  fontSize: 'var(--text-base)',
  color: 'var(--ink)',
};

const thStyle: CSSProperties = {
  textAlign: 'start',
  fontFamily: 'var(--font-mono)',
  fontWeight: 500,
  fontSize: 'var(--text-xxs)',
  letterSpacing: '0.5px',
  textTransform: 'uppercase',
  color: 'var(--ink-muted)',
  padding: 'var(--space-4) var(--space-6)',
  borderBottom: '1px solid var(--border-light)',
};

const trStyle: CSSProperties = { borderBottom: '1px solid var(--border-light)' };

const tdStyle: CSSProperties = {
  padding: 'var(--space-6)',
  verticalAlign: 'top',
  fontSize: 'var(--text-base)',
};

const monoCellStyle: CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: 'var(--text-sm)',
  letterSpacing: '0.5px',
  color: 'var(--ink-muted)',
  whiteSpace: 'nowrap',
};

const titleLinkStyle: CSSProperties = {
  color: 'var(--ink)',
  textDecoration: 'underline',
  textDecorationColor: 'var(--border)',
  textUnderlineOffset: '3px',
  fontWeight: 500,
};

const pdfLinkStyle: CSSProperties = {
  fontFamily: 'var(--font-sans)',
  fontWeight: 500,
  fontSize: 'var(--text-sm)',
  color: 'var(--deep-teal)',
  textDecoration: 'underline',
  textDecorationColor: 'var(--deep-teal-dim)',
  textUnderlineOffset: '3px',
  whiteSpace: 'nowrap',
};
