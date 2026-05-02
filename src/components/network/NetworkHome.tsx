import { NODES } from '@/content/nodes';
import Link from 'next/link';

interface NetworkHomeProps {
  locale: string;
}

const STATUS_LABEL: Record<string, string> = {
  active: 'Active',
  onboarding: 'Onboarding',
  planned: 'Planned',
};

export function NetworkHome({ locale }: NetworkHomeProps) {
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
        ● The MERL Network
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
        A federation of locally owned MERL cooperatives.
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
        The MERLx Network is a guild of monitoring, evaluation, research and learning practitioners
        — federated across regions, governed locally, working under shared methodology and
        conflict-sensitivity standards.
      </p>
      <div style={{ display: 'flex', gap: 14, marginBottom: 80, flexWrap: 'wrap' }}>
        <Link
          href={`/${locale}/nodes`}
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
          See the nodes →
        </Link>
        <Link
          href={`/${locale}/become-a-node`}
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
          Become a node
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
          Active + onboarding nodes
        </p>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: 18,
          }}
        >
          {NODES.filter((n) => n.status !== 'planned').map((node) => (
            <Link
              key={node.slug}
              href={`/${locale}/nodes/${node.slug}`}
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
                  {node.name}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 9,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: node.status === 'active' ? 'var(--color-teal)' : 'var(--color-ink-mute)',
                  }}
                >
                  {STATUS_LABEL[node.status]}
                </span>
              </div>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10,
                  letterSpacing: '0.04em',
                  color: 'var(--color-ink-mute)',
                }}
              >
                {node.region} · {node.country}
              </span>
              <p
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 14,
                  lineHeight: 1.5,
                  color: 'var(--color-ink-soft)',
                  margin: 0,
                }}
              >
                {node.tagline}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </article>
  );
}
