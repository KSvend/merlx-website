import { PageShell } from '@/components/chrome/PageShell';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Container,
  Eyebrow,
  SectionHeading,
} from '@/components/ui';
import {
  isGroupTenant,
  isNetworkTenant,
  isNodeTenant,
  isStudioTenant,
  parseTenantHeaders,
} from '@/lib/tenant-aware';
import { setRequestLocale } from 'next-intl/server';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import type { CSSProperties } from 'react';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const headerList = await headers();
  const { kind, subdomain } = parseTenantHeaders(headerList);

  // Each tenant kind has its own dedicated home page in later phases.
  // For Phase B we only ship the group home; studio / network / node
  // homes follow in Phases C / D / E. Until then, render the group
  // home for any known tenant so route smoke-tests don't 404.
  const known =
    isGroupTenant(headerList) ||
    isStudioTenant(headerList) ||
    isNetworkTenant(headerList) ||
    (isNodeTenant(headerList) && subdomain === 'nilex');
  if (!known) notFound();

  return (
    <PageShell locale={locale} pathname="/">
      <Hero locale={locale} />
      <PrinciplesStrip />
      <ThreeLayersSection locale={locale} />
      <CTABand locale={locale} kind={kind} />
    </PageShell>
  );
}

/* -------------------------------------------------------------------------- */

function Hero({ locale }: { locale: string }) {
  const wrapperStyle: CSSProperties = {
    background: 'var(--shell)',
    paddingBlock: 'clamp(var(--space-32), 10vw, var(--space-64))',
  };

  const inner: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-16)',
    alignItems: 'flex-start',
  };

  const ctaRow: CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 'var(--space-5)',
  };

  return (
    <section style={wrapperStyle}>
      <Container width="wide">
        <div style={inner}>
          <Eyebrow>MERLx · independent · open-by-default</Eyebrow>
          <SectionHeading
            level={1}
            flourish={<span>global development and humanitarian aid programs</span>}
          >
            Advanced data science and tech-enabled MERL for
          </SectionHeading>
          <div style={ctaRow}>
            <Button variant="primary" href="https://studio.merlx.org">
              Enter MERLx Studio →
            </Button>
            <Button variant="secondary" href="https://network.merlx.org">
              Enter the Network →
            </Button>
            <Button variant="ghost" href={`/${locale}/contact`}>
              Talk to us
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

function PrinciplesStrip() {
  const items: { mono: string; title: string; body: string }[] = [
    {
      mono: '01',
      title: 'Open by default.',
      body: 'Tools, methods, and data schemas are open-source unless a partner constraint forces otherwise.',
    },
    {
      mono: '02',
      title: 'Conflict-sensitive engineering.',
      body: 'Every tool is reviewed for harm pathways before launch — surveillance risk, dual-use, exclusion.',
    },
    {
      mono: '03',
      title: 'Evidence-grade outputs.',
      body: 'Numbers ship with their uncertainty. Models ship with their evaluation.',
    },
    {
      mono: '04',
      title: 'Local epistemics.',
      body: 'Federated nodes hold local knowledge. The Studio builds; the Network deploys.',
    },
  ];

  const wrap: CSSProperties = {
    background: 'var(--shell-warm)',
    paddingBlock: 'clamp(var(--space-24), 6vw, var(--space-40))',
    borderTop: '1px solid var(--border-light)',
    borderBottom: '1px solid var(--border-light)',
  };

  const grid: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: 'var(--space-12)',
  };

  return (
    <section style={wrap}>
      <Container width="wide">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-12)' }}>
          <Eyebrow>How we work</Eyebrow>
          <div style={grid}>
            {items.map((item) => (
              <article
                key={item.mono}
                style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 500,
                    fontSize: 'var(--text-xxs)',
                    color: 'var(--ink-faint)',
                    letterSpacing: '0.5px',
                  }}
                >
                  {item.mono}
                </span>
                <h3
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontWeight: 600,
                    fontSize: 'var(--text-lg)',
                    color: 'var(--ink)',
                    letterSpacing: '-0.2px',
                    margin: 0,
                  }}
                >
                  {item.title}
                </h3>
                <p
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontWeight: 400,
                    fontSize: 'var(--text-base)',
                    lineHeight: 1.55,
                    color: 'var(--ink-light)',
                    margin: 0,
                  }}
                >
                  {item.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

function ThreeLayersSection({ locale }: { locale: string }) {
  const wrap: CSSProperties = {
    paddingBlock: 'clamp(var(--space-32), 8vw, var(--space-48))',
  };

  const grid: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: 'var(--space-10)',
  };

  return (
    <section style={wrap}>
      <Container width="wide">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-16)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
            <Eyebrow>The two front doors</Eyebrow>
            <SectionHeading level={2}>
              One studio building open tools.{' '}
              <span style={{ color: 'var(--ink-muted)' }}>
                One federation of cooperatives running them on the ground.
              </span>
            </SectionHeading>
          </div>

          <div style={grid}>
            <Card href="https://studio.merlx.org">
              <CardHeader
                eyebrow={<Eyebrow color="iris">MERLx Studio</Eyebrow>}
                title="The Optics Suite"
                trailing={<ArrowGlyph />}
              />
              <CardBody>
                Six AI-native tools for monitoring, evaluation, research, and early warning. Earth
                observation, NLP, compound-risk forecasting, theory-of-change testing, KII
                assistance, and damage-and-recovery mapping. Open methods, evidence-grade outputs.
              </CardBody>
            </Card>

            <Card href="https://network.merlx.org">
              <CardHeader
                eyebrow={<Eyebrow color="iris">MERLx Network</Eyebrow>}
                title="Locally owned MERL, in country"
                trailing={<ArrowGlyph />}
              />
              <CardBody>
                A federation of locally owned cooperatives — research, evaluation, third-party
                monitoring, and field analysis under shared methodology. Active node: NileX (Sudan
                and the Nile basin). Onboarding: Andes, Sahel.
              </CardBody>
            </Card>
          </div>

          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 'var(--text-sm)',
              color: 'var(--ink-muted)',
              maxWidth: '64ch',
              margin: 0,
            }}
          >
            MERLx also operates a long-term ownership transition (the MERLx Cooperative). It is{' '}
            <a
              href={`/${locale}/about`}
              style={{
                color: 'var(--deep-teal)',
                textDecoration: 'underline',
                textDecorationColor: 'var(--deep-teal-dim)',
                textUnderlineOffset: '3px',
              }}
            >
              described in the about page
            </a>
            .
          </p>
        </div>
      </Container>
    </section>
  );
}

function ArrowGlyph() {
  return (
    <span
      aria-hidden="true"
      style={{
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--text-xl)',
        color: 'var(--ink-muted)',
        lineHeight: 1,
      }}
    >
      →
    </span>
  );
}

/* -------------------------------------------------------------------------- */

function CTABand({ locale, kind }: { locale: string; kind: string }) {
  const wrap: CSSProperties = {
    background: 'var(--shell-warm)',
    paddingBlock: 'clamp(var(--space-24), 6vw, var(--space-40))',
    borderTop: '1px solid var(--border-light)',
  };

  const inner: CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 'var(--space-12)',
  };

  return (
    <section style={wrap}>
      <Container width="wide">
        <div style={inner}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-3)',
              maxWidth: '46ch',
            }}
          >
            <Eyebrow>Working with MERLx</Eyebrow>
            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontWeight: 500,
                fontSize: 'var(--text-lg)',
                color: 'var(--ink)',
                lineHeight: 1.4,
                margin: 0,
              }}
            >
              Considering a pilot, an evaluation, or a hosted Optics Suite deployment? Send a brief
              and we will route it to the right entity.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
            <Button variant="primary" href={`/${locale}/contact`}>
              Contact us
            </Button>
            <Button variant="secondary" href={`/${locale}/publications`}>
              Browse publications
            </Button>
          </div>
        </div>
        {kind !== 'group' ? (
          <p
            style={{
              marginTop: 'var(--space-10)',
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-xxs)',
              color: 'var(--ink-faint)',
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
            }}
          >
            Tenant: {kind} — dedicated home in a later phase
          </p>
        ) : null}
      </Container>
    </section>
  );
}
