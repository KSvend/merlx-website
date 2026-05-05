import { PageShell } from '@/components/chrome/PageShell';
import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import type { CSSProperties } from 'react';

interface PageProps {
  params: Promise<{ locale: string }>;
}

const STAGES = [
  {
    n: '01',
    t: 'Mutual fit',
    d: 'A short two-call window. We learn what your cooperative does, where it operates, what kind of MERL clients it serves. You learn what the Network expects: methodology, peer review, conflict-sensitivity, no-interference findings.',
  },
  {
    n: '02',
    t: 'Methodology alignment',
    d: 'A focused 8-week period of methodology review. We co-author one piece of work — typically an evaluation or a research brief — with cross-node peer review. The aim is honest assessment of whether the methodology floor matches.',
  },
  {
    n: '03',
    t: 'Tooling integration',
    d: 'If alignment holds, the node connects to the Optics Suite as infrastructure. Training, sandbox access, and shared documentation. Tools become available; methods stay yours.',
  },
  {
    n: '04',
    t: 'First joint engagement',
    d: 'A first joint engagement with the cooperative — usually a co-led delivery for a multilateral or INGO partner. Both sides validate operational fit before formal admission as an active node.',
  },
];

const REQUIREMENTS = [
  'A locally registered cooperative or research collective with a working bench of senior MERL practitioners.',
  'At least three years of independent client delivery (evaluation, research, TPM, or programme MERL).',
  'A pattern of locally led analysis — country teams own findings, not headquarters.',
  'Willingness to publish methodology and (with partner consent) data under shared terms.',
  'Commitment to conflict-sensitivity review on every engagement.',
];

export default async function BecomeANodePage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <PageShell locale={locale} pathname="/become-a-node">
      <section className="mx-page-header">
        <div className="mx-container">
          <p className="mx-eyebrow">Joining the cooperative</p>
          <h1>
            Locally owned. <em>Globally connected</em>.
          </h1>
          <p className="mx-lead" style={{ maxWidth: '64ch' }}>
            We grow the Network by invitation, not application. If your cooperative does excellent
            MERL in a country where the Network has gaps, we'd like to talk.
          </p>
        </div>
      </section>

      <section className="mx-section">
        <div className="mx-container">
          <p className="mx-eyebrow">The onboarding shape</p>
          <h2 className="mx-h2-section">
            Four stages, <em>roughly six months</em>.
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: 0,
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              background: 'var(--surface)',
              marginTop: 32,
            }}
          >
            {STAGES.map((s, i) => (
              <div
                key={s.n}
                style={{
                  padding: 32,
                  borderRight: i < STAGES.length - 1 ? '1px solid var(--border-light)' : 'none',
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
                  STAGE · {s.n}
                </p>
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontStyle: 'italic',
                    fontWeight: 400,
                    fontSize: 26,
                    margin: '0 0 12px',
                    letterSpacing: '-0.4px',
                    color: 'var(--ink)',
                  }}
                >
                  {s.t}
                </h3>
                <p style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--ink-muted)', margin: 0 }}>
                  {s.d}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-section mx-section--shell-warm">
        <div className="mx-container">
          <p className="mx-eyebrow">Floor</p>
          <h2 className="mx-h2-section">
            What we look for, <em>at minimum</em>.
          </h2>

          <ol style={listStyle}>
            {REQUIREMENTS.map((r, i) => (
              <li
                key={r}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '48px 1fr',
                  gap: 24,
                  padding: '20px 0',
                  borderBottom:
                    i < REQUIREMENTS.length - 1 ? '1px solid var(--border-light)' : 'none',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 11,
                    color: 'var(--iris)',
                    letterSpacing: '0.5px',
                    paddingTop: 3,
                  }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p style={{ fontSize: 15, lineHeight: 1.55, color: 'var(--ink)', margin: 0 }}>
                  {r}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-section">
        <div className="mx-container">
          <Link href={`/${locale}/contact`} className="mx-btn mx-btn--primary mx-btn--lg">
            Open a conversation →
          </Link>
        </div>
      </section>
    </PageShell>
  );
}

const listStyle: CSSProperties = {
  listStyle: 'none',
  padding: 0,
  margin: '32px 0 0',
};
