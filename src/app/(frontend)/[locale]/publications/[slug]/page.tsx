import { PageShell } from '@/components/chrome/PageShell';
import { findPublicationBySlug } from '@/lib/cms';
import { parseTenantHeaders, requireKnownTenant } from '@/lib/tenant-aware';
import config from '@/payload.config';
import { setRequestLocale } from 'next-intl/server';
import { headers } from 'next/headers';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPayload } from 'payload';
import type { CSSProperties } from 'react';

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

const TYPE_LABEL: Record<string, string> = {
  'peer-reviewed': 'Peer-reviewed',
  'working-paper': 'Working paper',
  brief: 'Brief',
  methodology: 'Methodology note',
  report: 'Report',
};

const LANG_LABEL: Record<string, string> = {
  en: 'English',
  ar: 'العربية',
  fr: 'Français',
};

export default async function PublicationSlugPage({ params }: PageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const headerList = await headers();
  const { kind } = parseTenantHeaders(headerList);
  const payload = await getPayload({ config });
  const tenant = await requireKnownTenant(headerList, payload);

  const doc = await findPublicationBySlug({ tenant, tenantKind: kind, slug, locale });
  if (!doc) notFound();

  return (
    <PageShell locale={locale} pathname={`/publications/${slug}`}>
      <section className="mx-page-header">
        <div className="mx-container">
          <p className="mx-eyebrow">
            {TYPE_LABEL[doc.type] ?? doc.type} · {doc.year}
          </p>
          <h1>{doc.title}</h1>
          {doc.abstract ? (
            <p className="mx-lead" style={{ maxWidth: '64ch' }}>
              {doc.abstract}
            </p>
          ) : null}
        </div>
      </section>

      <section className="mx-section">
        <div className="mx-container-narrow">
          <div
            className="mx-card"
            style={{ padding: 32, marginBottom: 32, background: 'var(--surface)' }}
          >
            <p
              className="mx-mono-caption"
              style={{ margin: '0 0 16px', textTransform: 'uppercase' }}
            >
              Citation metadata
            </p>
            <dl style={dlStyle}>
              <dt style={dtStyle}>Authors</dt>
              <dd style={ddStyle}>
                {(doc.authors ?? []).length > 0
                  ? (doc.authors ?? [])
                      .map((a) => (a.affiliation ? `${a.name} (${a.affiliation})` : a.name))
                      .join(', ')
                  : '—'}
              </dd>
              <dt style={dtStyle}>Year</dt>
              <dd style={ddStyle}>{doc.year}</dd>
              <dt style={dtStyle}>Type</dt>
              <dd style={ddStyle}>{TYPE_LABEL[doc.type] ?? doc.type}</dd>
              {doc.language ? (
                <>
                  <dt style={dtStyle}>Language</dt>
                  <dd style={ddStyle}>{LANG_LABEL[doc.language] ?? doc.language}</dd>
                </>
              ) : null}
              {doc.doi ? (
                <>
                  <dt style={dtStyle}>DOI</dt>
                  <dd style={ddStyle}>
                    <a
                      href={`https://doi.org/${doc.doi}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={inlineLinkStyle}
                    >
                      {doc.doi}
                    </a>
                  </dd>
                </>
              ) : null}
            </dl>
          </div>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {doc.fileUrl ? (
              <a
                href={doc.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mx-btn mx-btn--primary"
              >
                Download PDF →
              </a>
            ) : null}
            <Link href={`/${locale}/publications`} className="mx-btn mx-btn--ghost">
              ← All publications
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

const dlStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'minmax(120px, max-content) minmax(0, 1fr)',
  rowGap: 14,
  columnGap: 32,
  margin: 0,
};

const dtStyle: CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontWeight: 500,
  fontSize: 10,
  letterSpacing: '1.5px',
  textTransform: 'uppercase',
  color: 'var(--ink-faint)',
  paddingTop: 2,
};

const ddStyle: CSSProperties = {
  margin: 0,
  fontFamily: 'var(--font-sans)',
  fontSize: 13,
  color: 'var(--ink)',
  lineHeight: 1.55,
};

const inlineLinkStyle: CSSProperties = {
  color: 'var(--deep-teal)',
  textDecoration: 'underline',
  textDecorationColor: 'var(--deep-teal-dim)',
  textUnderlineOffset: 3,
};
