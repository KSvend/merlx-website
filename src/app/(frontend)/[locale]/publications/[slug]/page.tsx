import { PageShell } from '@/components/chrome/PageShell';
import { PageHero } from '@/components/pages/PageHero';
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  Container,
  Eyebrow,
  Prose,
} from '@/components/ui';
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
      <PageHero
        eyebrow={
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <Badge tone="primary">{TYPE_LABEL[doc.type] ?? doc.type}</Badge>
            <span style={monoMetaStyle}>{doc.year}</span>
          </span>
        }
        title={doc.title}
        subtitle={doc.abstract ?? undefined}
      />

      <section style={{ paddingBlock: 'var(--space-16)' }}>
        <Container width="reading">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-12)' }}>
            <Card density="comfortable">
              <CardHeader eyebrow={<Eyebrow>Metadata</Eyebrow>} title="Citation" />
              <CardBody>
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
              </CardBody>
            </Card>

            {doc.abstract ? (
              <div>
                <Eyebrow>Abstract</Eyebrow>
                <div style={{ marginTop: 'var(--space-5)' }}>
                  <Prose>
                    <p>{doc.abstract}</p>
                  </Prose>
                </div>
              </div>
            ) : null}

            <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
              {doc.fileUrl ? (
                <Button
                  variant="primary"
                  href={doc.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Download PDF →
                </Button>
              ) : null}
              <Link href={`/${locale}/publications`} style={backLinkStyle}>
                ← All publications
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </PageShell>
  );
}

const dlStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'minmax(120px, max-content) minmax(0, 1fr)',
  rowGap: 'var(--space-4)',
  columnGap: 'var(--space-8)',
  margin: 0,
};

const dtStyle: CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontWeight: 500,
  fontSize: 'var(--text-xxs)',
  letterSpacing: '0.5px',
  textTransform: 'uppercase',
  color: 'var(--ink-muted)',
  paddingTop: 'var(--space-1)',
};

const ddStyle: CSSProperties = {
  margin: 0,
  fontFamily: 'var(--font-sans)',
  fontSize: 'var(--text-base)',
  color: 'var(--ink)',
  lineHeight: 1.55,
};

const monoMetaStyle: CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontWeight: 500,
  fontSize: 'var(--text-xxs)',
  color: 'var(--ink-muted)',
  letterSpacing: '0.5px',
};

const inlineLinkStyle: CSSProperties = {
  color: 'var(--deep-teal)',
  textDecoration: 'underline',
  textDecorationColor: 'var(--deep-teal-dim)',
  textUnderlineOffset: '3px',
};

const backLinkStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  fontFamily: 'var(--font-sans)',
  fontSize: 'var(--text-sm)',
  color: 'var(--deep-teal)',
  textDecoration: 'underline',
  textDecorationColor: 'var(--deep-teal-dim)',
  textUnderlineOffset: '3px',
  alignSelf: 'center',
};
