import { PageShell } from '@/components/chrome/PageShell';
import { isNetworkTenant } from '@/lib/tenant-aware';
import { setRequestLocale } from 'next-intl/server';
import { headers } from 'next/headers';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ locale: string }>;
}

const CRITERIA = [
  'Existing local cooperative or research collective with at least 3 senior practitioners',
  'Demonstrable MERL or peace-building track record (3+ years preferred)',
  'Operations rooted in the region you propose to cover',
  'Willingness to adopt the Network methodology + conflict-sensitivity standards',
  'Local accountability — locally owned and locally governed',
];

const PROCESS = [
  {
    n: 1,
    title: 'Letter of intent',
    body: 'Send us a one-page note about your cooperative, region, and why you want to federate.',
  },
  {
    n: 2,
    title: 'Discovery conversation',
    body: 'A 90-minute call with the Network coordination team to map values, capacity, and overlap.',
  },
  {
    n: 3,
    title: 'Methodology review',
    body: 'Two of our existing nodes review your last three engagements; we share ours.',
  },
  {
    n: 4,
    title: 'Pilot collaboration',
    body: 'A bounded co-engagement (typically 6-12 weeks) under one of our existing partners.',
  },
  {
    n: 5,
    title: 'Onboarding + launch',
    body: 'Network agreement signed; subdomain provisioned; node profile published.',
  },
];

export default async function BecomeANodePage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const headerList = await headers();
  if (!isNetworkTenant(headerList)) notFound();

  return (
    <PageShell locale={locale}>
      <article style={{ maxWidth: 880, margin: '0 auto', padding: '64px 24px 96px' }}>
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: 'var(--color-teal)',
            margin: '0 0 18px',
          }}
        >
          Become a node
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
            maxWidth: 740,
          }}
        >
          We are slowly building a guild, not aggressively growing a franchise.
        </h1>
        <p
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 17,
            lineHeight: 1.6,
            color: 'var(--color-ink-soft)',
            margin: '0 0 48px',
            maxWidth: 740,
          }}
        >
          The Network grows when the right cooperative is ready, not on a calendar. We onboard one
          to two new nodes per year. If your team fits, the process is real and structured — and the
          answer is sometimes "not yet" rather than "no".
        </p>

        <section style={{ marginBottom: 56 }}>
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
            Criteria
          </h2>
          <ul
            style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              fontFamily: 'var(--font-serif)',
              fontSize: 15,
              color: 'var(--color-ink-soft)',
            }}
          >
            {CRITERIA.map((c) => (
              <li key={c} style={{ display: 'flex', gap: 12, alignItems: 'baseline' }}>
                <span style={{ color: 'var(--color-teal)' }}>→</span>
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </section>

        <section style={{ marginBottom: 48 }}>
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
            Process
          </h2>
          <ol
            style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: 22,
            }}
          >
            {PROCESS.map((step) => (
              <li key={step.n}>
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
                  <span style={{ color: 'var(--color-teal)', marginRight: 10 }}>
                    {String(step.n).padStart(2, '0')}
                  </span>
                  {step.title}
                </h3>
                <p
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: 15,
                    lineHeight: 1.6,
                    color: 'var(--color-ink-soft)',
                    margin: 0,
                    paddingLeft: 28,
                  }}
                >
                  {step.body}
                </p>
              </li>
            ))}
          </ol>
        </section>

        <Link
          href={`/${locale}/contact?interest=network&intent=become-a-node`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '13px 22px',
            background: 'var(--color-teal)',
            color: 'var(--color-bg)',
            borderRadius: 'var(--radius-sm)',
            fontFamily: 'var(--font-sans)',
            fontSize: 13,
            fontWeight: 500,
            textDecoration: 'none',
          }}
        >
          Send a letter of intent →
        </Link>
      </article>
    </PageShell>
  );
}
