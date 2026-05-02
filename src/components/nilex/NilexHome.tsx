import { NILEX_DEPLOYMENTS, NILEX_HERO, NILEX_NEWS } from '@/content/nilex';
import Link from 'next/link';

interface NilexHomeProps {
  locale: string;
}

const STATUS_LABEL: Record<string, string> = {
  active: 'Active',
  closed: 'Closed',
  planned: 'Planned',
};

export function NilexHome({ locale }: NilexHomeProps) {
  const activeDeployments = NILEX_DEPLOYMENTS.filter((d) => d.status === 'active').slice(0, 3);
  const recentNews = NILEX_NEWS.slice(0, 3);

  return (
    <article style={{ maxWidth: 980, margin: '0 auto', padding: '64px 24px 96px' }}>
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
        ● {NILEX_HERO.eyebrow}
      </p>
      <h1
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 56,
          fontWeight: 600,
          letterSpacing: '-0.02em',
          lineHeight: 1.05,
          color: 'var(--color-ink)',
          margin: '0 0 18px',
          maxWidth: 860,
        }}
      >
        {NILEX_HERO.title}
      </h1>
      <p
        style={{
          fontFamily: 'var(--font-serif)',
          fontStyle: 'italic',
          fontSize: 18,
          color: 'var(--color-ink-mute)',
          margin: '0 0 36px',
          maxWidth: 720,
          lineHeight: 1.5,
        }}
      >
        {NILEX_HERO.tagline}
      </p>
      <div style={{ display: 'flex', gap: 14, marginBottom: 80, flexWrap: 'wrap' }}>
        <Link
          href={`/${locale}/deployments`}
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
          {NILEX_HERO.primaryCta} →
        </Link>
        <Link
          href={`/${locale}/contact?interest=network&node=nilex`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '13px 22px',
            border: '1px solid var(--color-rule)',
            color: 'var(--color-ink)',
            borderRadius: 'var(--radius-sm)',
            fontFamily: 'var(--font-sans)',
            fontSize: 13,
            fontWeight: 500,
            textDecoration: 'none',
          }}
        >
          {NILEX_HERO.secondaryCta}
        </Link>
      </div>

      <section style={{ marginBottom: 64 }}>
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: 'var(--color-ink-mute)',
            margin: '0 0 18px',
          }}
        >
          Active deployments
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {activeDeployments.map((d) => (
            <div
              key={d.slug}
              style={{
                display: 'grid',
                gridTemplateColumns: '220px 1fr auto',
                alignItems: 'baseline',
                gap: 24,
                padding: '20px 24px',
                border: '1px solid var(--color-rule)',
                borderRadius: 'var(--radius-md)',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 18,
                  fontWeight: 600,
                  letterSpacing: '-0.012em',
                  color: 'var(--color-ink)',
                }}
              >
                {d.name}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 14,
                  lineHeight: 1.5,
                  color: 'var(--color-ink-soft)',
                }}
              >
                {d.summary}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 9,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'var(--color-teal)',
                }}
              >
                {STATUS_LABEL[d.status]}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: 'var(--color-ink-mute)',
            margin: '0 0 18px',
          }}
        >
          Recent news
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {recentNews.map((n) => (
            <Link
              key={n.slug}
              href={`/${locale}/news/${n.slug}`}
              style={{
                display: 'block',
                padding: '16px 0',
                borderBottom: '1px solid var(--color-rule)',
                textDecoration: 'none',
                color: 'var(--color-ink)',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10,
                  letterSpacing: '0.12em',
                  color: 'var(--color-ink-mute)',
                  textTransform: 'uppercase',
                }}
              >
                {n.date}
              </span>
              <h3
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontWeight: 600,
                  fontSize: 20,
                  letterSpacing: '-0.012em',
                  margin: '6px 0 8px',
                }}
              >
                {n.title}
              </h3>
              <p
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 14,
                  lineHeight: 1.5,
                  color: 'var(--color-ink-soft)',
                  margin: 0,
                }}
              >
                {n.excerpt}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </article>
  );
}
