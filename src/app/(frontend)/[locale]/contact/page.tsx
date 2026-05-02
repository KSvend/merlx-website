import { PageShell } from '@/components/chrome/PageShell';
import { ContactForm } from '@/components/forms/ContactForm';
import { isGroupTenant } from '@/lib/tenant-aware';
import { getTurnstileConfig } from '@/lib/turnstile';
import { setRequestLocale } from 'next-intl/server';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import Script from 'next/script';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function ContactPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const headerList = await headers();
  if (!isGroupTenant(headerList)) notFound();

  // Both keys must be set together — see getTurnstileConfig() rationale.
  const turnstile = getTurnstileConfig();
  const turnstileSiteKey = turnstile.enabled ? turnstile.siteKey : undefined;

  return (
    <PageShell locale={locale}>
      {turnstileSiteKey && (
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js"
          strategy="afterInteractive"
        />
      )}
      <article style={{ maxWidth: 720, margin: '0 auto', padding: '64px 24px' }}>
        <h1
          style={{
            fontFamily: 'var(--font-serif)',
            fontWeight: 600,
            fontSize: 38,
            color: 'var(--color-ink)',
            letterSpacing: '-0.014em',
            margin: '0 0 16px',
          }}
        >
          Contact
        </h1>
        <p
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 16,
            lineHeight: 1.6,
            color: 'var(--color-ink-soft)',
            marginBottom: 32,
          }}
        >
          MERLx currently delivers under consortium arrangements with established delivery partners.
          For framework placements, partner introductions, or specific engagements, send us a note.
        </p>
        <ContactForm turnstileSiteKey={turnstileSiteKey} />
      </article>
    </PageShell>
  );
}
