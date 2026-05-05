import { PageShell } from '@/components/chrome/PageShell';
import { ContactForm } from '@/components/forms/ContactForm';
import { PageHero } from '@/components/pages/PageHero';
import { Container, Eyebrow } from '@/components/ui';
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
      <PageHero
        eyebrow={`Contact · ${kind === 'group' ? 'MERLx' : kind}`}
        title="Tell us about your work."
        flourish="we will route the conversation"
        subtitle="Considering a pilot, a hosted Optics Suite deployment, an evaluation, or an advisory engagement? Send a brief and we will reply within two working days."
      />

      <section style={{ paddingBlock: 'var(--space-16)' }}>
        <Container width="reading">
          <div style={layoutStyle}>
            <aside style={asideStyle}>
              <Eyebrow>Direct contacts</Eyebrow>
              <ul style={contactListStyle}>
                <ContactRow label="General" value="hello@merlx.org" href="mailto:hello@merlx.org" />
                <ContactRow
                  label="Studio"
                  value="studio@merlx.org"
                  href="mailto:studio@merlx.org"
                />
                <ContactRow
                  label="Network"
                  value="network@merlx.org"
                  href="mailto:network@merlx.org"
                />
              </ul>
              <p style={consortiumNoteStyle}>
                We deliver many engagements as part of consortia with partner INGOs and academic
                institutions. Mention any preferred consortium structure in your message.
              </p>
            </aside>

            <div style={formColStyle}>
              <ContactForm turnstileSiteKey={siteKey} />
            </div>
          </div>
        </Container>
      </section>
    </PageShell>
  );
}

interface ContactRowProps {
  label: string;
  value: string;
  href: string;
}

function ContactRow({ label, value, href }: ContactRowProps) {
  return (
    <li
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-2)',
        paddingBlock: 'var(--space-4)',
        borderBottom: '1px solid var(--border-light)',
      }}
    >
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontWeight: 500,
          fontSize: 'var(--text-xxs)',
          letterSpacing: '0.5px',
          color: 'var(--ink-muted)',
          textTransform: 'uppercase',
        }}
      >
        {label}
      </span>
      <a
        href={href}
        style={{
          fontFamily: 'var(--font-sans)',
          fontSize: 'var(--text-base)',
          color: 'var(--deep-teal)',
          textDecoration: 'underline',
          textDecorationColor: 'var(--deep-teal-dim)',
          textUnderlineOffset: '3px',
        }}
      >
        {value}
      </a>
    </li>
  );
}

const layoutStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'minmax(220px, 280px) minmax(0, 1fr)',
  gap: 'var(--space-16)',
  alignItems: 'flex-start',
};

const asideStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--space-5)',
};

const contactListStyle: CSSProperties = {
  listStyle: 'none',
  padding: 0,
  margin: 0,
  display: 'flex',
  flexDirection: 'column',
};

const consortiumNoteStyle: CSSProperties = {
  fontFamily: 'var(--font-sans)',
  fontSize: 'var(--text-xs)',
  color: 'var(--ink-muted)',
  lineHeight: 1.55,
  margin: 0,
  paddingTop: 'var(--space-4)',
};

const formColStyle: CSSProperties = {
  background: 'var(--surface)',
  border: '1px solid var(--border-light)',
  borderRadius: 'var(--radius-md)',
  padding: 'clamp(var(--space-12), 3vw, var(--space-16))',
};
