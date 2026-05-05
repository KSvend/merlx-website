import { PageShell } from '@/components/chrome/PageShell';
import { NILEX_DEPLOYMENTS } from '@/content/nilex';
import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

const STATUS_COLOR: Record<string, string> = {
  active: 'var(--deep-teal)',
  closed: 'var(--ink-faint)',
  planned: 'var(--iris)',
};

const STATUS_LABEL: Record<string, string> = {
  active: 'ACTIVE DEPLOYMENT',
  closed: 'CLOSED DEPLOYMENT',
  planned: 'PLANNED DEPLOYMENT',
};

export default async function DeploymentSlugPage({ params }: PageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const dep = NILEX_DEPLOYMENTS.find((d) => d.slug === slug);
  if (!dep) notFound();

  return (
    <PageShell locale={locale} pathname={`/deployments/${slug}`}>
      <section className="mx-page-header">
        <div className="mx-container">
          <p className="mx-eyebrow" style={{ color: STATUS_COLOR[dep.status] }}>
            {STATUS_LABEL[dep.status]} · {dep.region}
          </p>
          <h1>
            {dep.name} <em>— with {dep.partner}.</em>
          </h1>
          <p className="mx-lead" style={{ maxWidth: '64ch' }}>
            {dep.summary}
          </p>
        </div>
      </section>

      <section className="mx-section">
        <div className="mx-container-narrow">
          <p className="mx-mono-caption" style={{ margin: '0 0 16px', textTransform: 'uppercase' }}>
            Engagement profile
          </p>
          <p
            style={{
              fontFamily: 'var(--font-display)',
              fontStyle: 'italic',
              fontWeight: 400,
              fontSize: 'clamp(20px, 2.2vw, 24px)',
              lineHeight: 1.4,
              color: 'var(--ink)',
              margin: '0 0 24px',
              maxWidth: '52ch',
            }}
          >
            Detailed engagement profile, methodology, and outputs available under partner NDA. The
            deployment runs under shared MERLx Network methodology, with cross-node peer review on
            all major analytical outputs.
          </p>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link href={`/${locale}/contact`} className="mx-btn mx-btn--primary">
              Talk to NileX →
            </Link>
            <Link href={`/${locale}/deployments`} className="mx-btn mx-btn--ghost">
              ← All deployments
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
