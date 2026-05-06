import { PageShell } from '@/components/chrome/PageShell';
import { ContactForm } from '@/components/forms/ContactForm';
import { parseTenantHeaders } from '@/lib/tenant-aware';
import { getTurnstileConfig } from '@/lib/turnstile';
import { setRequestLocale } from 'next-intl/server';
import { headers } from 'next/headers';
import type { CSSProperties } from 'react';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function ContactPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const headerList = await headers();
  const { kind } = parseTenantHeaders(headerList);

  const turnstile = getTurnstileConfig();
  const siteKey = turnstile.enabled ? turnstile.siteKey : undefined;

  return (
    <PageShell locale={locale} pathname="/contact">
      <section className="mx-page-header">
        <div className="mx-container">
          <p className="mx-eyebrow">Contact · {kind === 'group' ? 'MERLx' : capitalise(kind)}</p>
          <h1>
            Tell us about the <em>programme</em>.
          </h1>
          <p className="mx-lead" style={{ maxWidth: '56ch' }}>
            We read every enquiry. A senior analyst replies within two working days, usually with a
            few questions before a call.
          </p>
        </div>
      </section>

      <section className="mx-section">
        <div className="mx-container">
          <div style={layoutStyle}>
            <aside style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
              <ContactBlock
                eyebrow="Direct"
                items={[
                  { l: 'General', v: 'hello@merlx.org', href: 'mailto:hello@merlx.org' },
                  { l: 'Studio', v: 'studio@merlx.org', href: 'mailto:studio@merlx.org' },
                  { l: 'Network', v: 'network@merlx.org', href: 'mailto:network@merlx.org' },
                  { l: 'Press', v: 'press@merlx.org', href: 'mailto:press@merlx.org' },
                ]}
              />
              <ContactBlock
                eyebrow="What to include"
                items={[
                  { l: 'Programme', v: 'A short description and where it operates.' },
                  { l: 'Question', v: "What you're trying to learn or decide." },
                  { l: 'Timeline', v: 'When you need findings, and when work could start.' },
                  { l: 'Budget', v: 'A rough order of magnitude is helpful, not required.' },
                ]}
              />
              <ContactBlock
                eyebrow="Consortium delivery"
                items={[
                  {
                    l: 'Note',
                    v: 'We deliver many engagements as part of consortia with partner INGOs and academic institutions. Mention any preferred consortium structure in your message.',
                  },
                ]}
              />
            </aside>

            <div className="mx-card" style={{ padding: 40, background: 'var(--surface)' }}>
              <ContactForm turnstileSiteKey={siteKey} />
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

function ContactBlock({
  eyebrow,
  items,
}: {
  eyebrow: string;
  items: { l: string; v: string; href?: string }[];
}) {
  return (
    <div>
      <p className="mx-eyebrow">{eyebrow}</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 0, marginTop: 8 }}>
        {items.map((it, i) => (
          <div
            key={`${eyebrow}-${it.l}`}
            style={{
              display: 'grid',
              gridTemplateColumns: '120px 1fr',
              gap: 24,
              padding: '14px 0',
              borderBottom: i < items.length - 1 ? '1px solid var(--border-light)' : 'none',
            }}
          >
            <span
              style={{
                fontSize: 11,
                color: 'var(--ink-faint)',
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                fontFamily: 'var(--font-sans)',
              }}
            >
              {it.l}
            </span>
            {it.href ? (
              <a href={it.href} style={{ color: 'var(--iris)', fontSize: 14 }}>
                {it.v}
              </a>
            ) : (
              <span style={{ color: 'var(--ink)', fontSize: 14, lineHeight: 1.55 }}>{it.v}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function capitalise(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

const layoutStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'minmax(260px, 320px) minmax(0, 1fr)',
  gap: 64,
  alignItems: 'start',
};
