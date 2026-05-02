import type { AppLocale } from '@/i18n/routing';
import config from '@/payload.config';
import Link from 'next/link';
import { getPayload } from 'payload';
import type { OpticsTool } from '../../../payload-types';

interface StudioHomeProps {
  locale: string;
}

const STATUS_LABEL: Record<string, string> = {
  live: 'Live',
  beta: 'Beta',
  'coming-soon': 'Coming soon',
};

export async function StudioHome({ locale }: StudioHomeProps) {
  const payload = await getPayload({ config });
  const result = await payload.find({
    collection: 'optics-tools',
    sort: 'order',
    limit: 6,
    locale: locale as AppLocale,
  });
  const tools = result.docs as OpticsTool[];

  return (
    <article style={{ maxWidth: 980, margin: '0 auto', padding: '64px 24px 96px' }}>
      <p
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: 'var(--color-orange)',
          margin: '0 0 18px',
        }}
      >
        ● The Tech Studio
      </p>
      <h1
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 60,
          fontWeight: 600,
          letterSpacing: '-0.02em',
          lineHeight: 1.05,
          color: 'var(--color-ink)',
          margin: '0 0 18px',
          maxWidth: 860,
        }}
      >
        Open analytical tools for fragile contexts.
      </h1>
      <p
        style={{
          fontFamily: 'var(--font-serif)',
          fontStyle: 'italic',
          fontSize: 19,
          color: 'var(--color-ink-mute)',
          margin: '0 0 36px',
          maxWidth: 720,
        }}
      >
        An independent studio building the Optics Suite — open AI tools for monitoring, evaluation,
        research and early warning. Conflict-sensitive by design, evidence-grade by default.
      </p>
      <div style={{ display: 'flex', gap: 14, marginBottom: 80, flexWrap: 'wrap' }}>
        <Link
          href={`/${locale}/optics`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '13px 22px',
            background: 'var(--color-orange)',
            color: 'var(--color-bg)',
            borderRadius: 'var(--radius-sm)',
            fontFamily: 'var(--font-sans)',
            fontSize: 13,
            fontWeight: 500,
            textDecoration: 'none',
          }}
        >
          See the Optics Suite →
        </Link>
        <Link
          href={`/${locale}/engage`}
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
          Four ways to engage
        </Link>
      </div>

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
          The Optics Suite — six tools
        </p>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: 18,
          }}
        >
          {tools.map((tool) => (
            <Link
              key={tool.id}
              href={`/${locale}/optics/${tool.slug}`}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
                padding: 20,
                border: '1px solid var(--color-rule)',
                borderRadius: 'var(--radius-md)',
                background: 'var(--color-bg)',
                textDecoration: 'none',
                color: 'var(--color-ink)',
                transition: 'border-color 200ms cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              <div
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: 22,
                    fontWeight: 600,
                    letterSpacing: '-0.012em',
                  }}
                >
                  {tool.name}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 9,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color:
                      tool.status === 'live'
                        ? 'var(--color-success, #3BAA7F)'
                        : tool.status === 'beta'
                          ? 'var(--color-orange)'
                          : 'var(--color-ink-mute)',
                  }}
                >
                  {STATUS_LABEL[tool.status]}
                </span>
              </div>
              <p
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 14,
                  lineHeight: 1.5,
                  color: 'var(--color-ink-soft)',
                  margin: 0,
                }}
              >
                {tool.tagline}
              </p>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10,
                  letterSpacing: '0.06em',
                  color: 'var(--color-orange)',
                  marginTop: 4,
                }}
              >
                Read more →
              </span>
            </Link>
          ))}
        </div>
      </section>
    </article>
  );
}
