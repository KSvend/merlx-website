import { PageShell } from '@/components/chrome/PageShell';
import { RichTextRenderer } from '@/components/pages/RichTextRenderer';
import { findPageBySlug } from '@/lib/cms';
import { parseTenantHeaders, requireKnownTenant } from '@/lib/tenant-aware';
import config from '@/payload.config';
import { setRequestLocale } from 'next-intl/server';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { getPayload } from 'payload';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function AboutPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const headerList = await headers();
  const { kind } = parseTenantHeaders(headerList);

  const payload = await getPayload({ config });
  const tenant = await requireKnownTenant(headerList, payload);
  const page = await findPageBySlug({ tenant, slug: 'about', locale });

  if (!page) notFound();

  const heroLine = renderHeroTitle(page.title, page.subtitle, kind);

  return (
    <PageShell locale={locale} pathname="/about">
      <section className="mx-page-header">
        <div className="mx-container">
          <p className="mx-eyebrow">About · {kind === 'group' ? 'MERLx' : capitalise(kind)}</p>
          <h1>{heroLine}</h1>
          <p className="mx-lead" style={{ maxWidth: '56ch' }}>
            {leadFor(kind)}
          </p>
        </div>
      </section>

      <section className="mx-section">
        <div className="mx-container-narrow">
          {page.body ? (
            // biome-ignore lint/suspicious/noExplicitAny: Lexical body shape
            <RichTextRenderer data={page.body as any} />
          ) : (
            <p className="mx-lead">This page is in preparation. Check back shortly.</p>
          )}
        </div>
      </section>
    </PageShell>
  );
}

function renderHeroTitle(title: string, subtitle: string | null | undefined, kind: string) {
  const flourish = subtitle ?? defaultFlourish(kind);
  return (
    <>
      {title} <em>{flourish}</em>.
    </>
  );
}

function defaultFlourish(kind: string): string {
  if (kind === 'studio') return 'a partner for tech-enabled global development';
  if (kind === 'network') return 'a cooperative of MERL practices';
  if (kind === 'node') return 'a MERLx Network node';
  return 'one studio, one network';
}

function leadFor(kind: string): string {
  if (kind === 'studio')
    return 'MERLx is an independent studio building analytical tools and infrastructure for humanitarian, peacebuilding and conflict-prevention organisations. Our work helps teams read context faster, adapt programming earlier, and ground decisions in real evidence. AI augments the analysts, evaluators and programme staff who already do this work. It does not replace their judgement.';
  if (kind === 'network')
    return 'A cooperative of locally owned MERL practices. Each node is autonomous and accountable in country, working under shared methodology and conflict-sensitivity standards.';
  if (kind === 'node')
    return 'A MERLx Network node. Locally owned MERL, working in cooperative under shared methodology and conflict-sensitivity standards.';
  return 'MERLx is two entities under one roof. The Studio builds the Optics Suite. The Network is a cooperative of locally owned MERL practices that runs those tools, and traditional MERL, in country.';
}

function capitalise(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
