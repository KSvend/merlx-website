import { homeCopyFor, type HomeCopy } from '@/content/copy/home';
import Link from 'next/link';
import type { CSSProperties } from 'react';

interface GroupHomeProps {
  locale: string;
  tenantKind: string;
}

export function GroupHome({ locale, tenantKind }: GroupHomeProps) {
  const copy = homeCopyFor(locale);
  return (
    <>
      <Hero copy={copy.hero} />
      <PrinciplesSection copy={copy.principles} />
      <FinalCTA locale={locale} tenantKind={tenantKind} copy={copy.finalCta} />
    </>
  );
}

function Hero({ copy }: { copy: HomeCopy['hero'] }) {
  return (
    <section style={{ padding: '80px 0 48px' }}>
      <div className="mx-container">
        <p className="mx-eyebrow">{copy.eyebrow}</p>
        <h1 className="mx-h1-display" style={{ maxWidth: '20ch' }}>
          <em style={{ color: 'var(--iris)' }}>{copy.headlineEm}</em> {copy.headlineRest}
        </h1>
        <p className="mx-lead" style={{ marginTop: 32, maxWidth: '60ch' }}>
          {copy.body}
        </p>
      </div>
    </section>
  );
}

function PrinciplesSection({ copy }: { copy: HomeCopy['principles'] }) {
  return (
    <section className="mx-section mx-section--shell-warm">
      <div className="mx-container">
        <div className="mx-intro">
          <div>
            <p className="mx-eyebrow">{copy.eyebrow}</p>
            <h2 className="mx-h2-section">
              {copy.headlinePrefix}{' '}
              <em style={{ color: 'var(--teal-light)' }}>{copy.headlineEm}</em>.
            </h2>
          </div>
          <p className="mx-lead">{copy.lead}</p>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 0,
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            background: 'var(--surface)',
          }}
        >
          {copy.items.map((item, i) => (
            <div
              key={item.n}
              style={{
                padding: 32,
                borderRight: i < copy.items.length - 1 ? '1px solid var(--border-light)' : 'none',
              }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  color: 'var(--ink-faint)',
                  letterSpacing: '1.5px',
                  margin: '0 0 24px',
                }}
              >
                {item.n}
              </p>
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontStyle: 'italic',
                  fontWeight: 400,
                  fontSize: 24,
                  margin: '0 0 12px',
                  letterSpacing: '-0.4px',
                  color: 'var(--ink)',
                }}
              >
                {item.title}
              </h3>
              <p style={{ fontSize: 13, lineHeight: 1.55, color: 'var(--ink-muted)', margin: 0 }}>
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA({
  locale,
  tenantKind,
  copy,
}: {
  locale: string;
  tenantKind: string;
  copy: HomeCopy['finalCta'];
}) {
  return (
    <section className="mx-section mx-section--teal">
      <div className="mx-container" style={{ textAlign: 'center' }}>
        <p className="mx-eyebrow" style={{ justifyContent: 'center', display: 'inline-flex' }}>
          {copy.eyebrow}
        </p>
        <h2
          style={{
            fontFamily: 'var(--font-sans)',
            fontWeight: 600,
            fontSize: 'clamp(36px, 4.5vw, 56px)',
            lineHeight: 1.05,
            letterSpacing: '-1px',
            color: 'var(--shell)',
            margin: '12px auto 24px',
            maxWidth: '20ch',
            textWrap: 'balance',
          }}
        >
          {copy.headlinePrefix}{' '}
          <em style={emItalicStyle('var(--teal-light)')}>{copy.headlineEm}</em>.
        </h2>
        <p
          style={{
            fontSize: 16,
            lineHeight: 1.55,
            color: 'rgba(245,243,238,0.78)',
            maxWidth: '52ch',
            margin: '0 auto 32px',
          }}
        >
          {copy.body}
        </p>
        <div
          style={{ display: 'inline-flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}
        >
          <Link href={`/${locale}/contact`} className="mx-btn mx-btn--inverse mx-btn--lg">
            {copy.primary}
          </Link>
          <Link
            href={`/${locale}/publications`}
            className="mx-btn mx-btn--outline-light mx-btn--lg"
          >
            {copy.secondary}
          </Link>
        </div>
        {tenantKind !== 'group' ? (
          <p
            style={{
              marginTop: 32,
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              color: 'rgba(245,243,238,0.55)',
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
            }}
          >
            Tenant: {tenantKind}
          </p>
        ) : null}
      </div>
    </section>
  );
}

const emItalicStyle = (color: string): CSSProperties => ({
  fontFamily: 'var(--font-display)',
  fontStyle: 'italic',
  fontWeight: 400,
  color,
});
