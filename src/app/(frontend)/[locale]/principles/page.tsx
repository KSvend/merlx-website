import { PageShell } from '@/components/chrome/PageShell';
import { NETWORK_BELIEFS, NETWORK_COMMITMENTS } from '@/content/network-principles';
import { BELIEFS, COMMITMENTS } from '@/content/principles';
import { isNetworkTenant, isStudioTenant } from '@/lib/tenant-aware';
import { setRequestLocale } from 'next-intl/server';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function PrinciplesPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const headerList = await headers();
  const isStudio = isStudioTenant(headerList);
  const isNetwork = isNetworkTenant(headerList);
  if (!isStudio && !isNetwork) notFound();

  const commitments = isNetwork ? NETWORK_COMMITMENTS : COMMITMENTS;
  const beliefs = isNetwork ? NETWORK_BELIEFS : BELIEFS;
  const accent = isNetwork ? 'var(--color-teal)' : 'var(--color-orange)';
  const eyebrow = isNetwork ? 'Network principles' : 'Studio principles';

  return (
    <PageShell locale={locale}>
      <article style={{ maxWidth: 1080, margin: '0 auto', padding: '64px 24px 96px' }}>
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: accent,
            margin: '0 0 18px',
          }}
        >
          {eyebrow}
        </p>
        <h1
          style={{
            fontFamily: 'var(--font-serif)',
            fontWeight: 600,
            fontSize: 48,
            letterSpacing: '-0.018em',
            lineHeight: 1.1,
            color: 'var(--color-ink)',
            margin: '0 0 18px',
            maxWidth: 760,
          }}
        >
          Five commitments. Four beliefs. Out loud, written down, reviewed.
        </h1>
        <p
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 17,
            lineHeight: 1.6,
            color: 'var(--color-ink-soft)',
            margin: '0 0 56px',
            maxWidth: 720,
          }}
        >
          What the Studio promises to deliver, and how we think about the work. We change these
          rarely; when we do, we document why.
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
            gap: 56,
          }}
        >
          <section>
            <h2
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: 'var(--color-ink-mute)',
                margin: '0 0 22px',
              }}
            >
              Commitments
            </h2>
            <ol
              style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: 28,
              }}
            >
              {commitments.map((p) => (
                <li key={p.number}>
                  <h3
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: 20,
                      fontWeight: 600,
                      letterSpacing: '-0.012em',
                      color: 'var(--color-ink)',
                      margin: '0 0 6px',
                    }}
                  >
                    <span style={{ color: accent, marginRight: 10 }}>
                      {String(p.number).padStart(2, '0')}
                    </span>
                    {p.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: 15,
                      lineHeight: 1.6,
                      color: 'var(--color-ink-soft)',
                      margin: 0,
                    }}
                  >
                    {p.body}
                  </p>
                </li>
              ))}
            </ol>
          </section>

          <section>
            <h2
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: 'var(--color-ink-mute)',
                margin: '0 0 22px',
              }}
            >
              Beliefs
            </h2>
            <ol
              style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: 28,
              }}
            >
              {beliefs.map((p) => (
                <li key={p.number}>
                  <h3
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontStyle: 'italic',
                      fontSize: 22,
                      fontWeight: 500,
                      letterSpacing: '-0.012em',
                      color: 'var(--color-ink)',
                      margin: '0 0 6px',
                    }}
                  >
                    {p.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: 15,
                      lineHeight: 1.6,
                      color: 'var(--color-ink-soft)',
                      margin: 0,
                    }}
                  >
                    {p.body}
                  </p>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </article>
    </PageShell>
  );
}
