import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata } from 'next';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { DM_Serif_Display, IBM_Plex_Mono, Inter } from 'next/font/google';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';
import '@/app/globals.css';
import { routing } from '@/i18n/routing';

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-inter',
});

const dmSerifDisplay = DM_Serif_Display({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-dm-serif-display',
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
  variable: '--font-ibm-plex-mono',
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const TENANT_TITLE: Record<string, string> = {
  group: 'MERLx',
  studio: 'MERLx Studio',
  network: 'MERLx Network',
  node: 'MERLx Network',
};

const TENANT_DESCRIPTION: Record<string, string> = {
  group: 'Open analytical tools for fragile contexts. A studio + a federated MERL network.',
  studio:
    'An independent studio building the Optics Suite — open AI tools for monitoring, evaluation, research and early warning in fragile contexts.',
  network:
    'A federation of locally owned MERL cooperatives. Federated nodes across Africa, the Andes, MENA, and beyond, working under shared methodology and conflict-sensitivity standards.',
  node: 'A MERLx Network node — locally owned MERL cooperative.',
};

export async function generateMetadata(): Promise<Metadata> {
  const headerList = await headers();
  const kind = headerList.get('x-tenant-kind') ?? 'group';
  const subdomain = headerList.get('x-tenant-subdomain') ?? '';

  let title = TENANT_TITLE[kind] ?? 'MERLx';
  let description = TENANT_DESCRIPTION[kind] ?? TENANT_DESCRIPTION.group;
  if (kind === 'node' && subdomain === 'nilex') {
    title = 'NileX · MERLx Network';
    description = 'Sudan-rooted MERL cooperative. First federated node of the MERLx Network.';
  }

  return {
    title: { default: title, template: `%s · ${title}` },
    description,
    openGraph: { title, description, siteName: title, type: 'website' },
    twitter: { card: 'summary_large_image', title, description },
  };
}

interface LayoutProps {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  const headerList = await headers();
  const tenantKind = headerList.get('x-tenant-kind') ?? 'unknown';

  const fontClass = `${inter.variable} ${dmSerifDisplay.variable} ${ibmPlexMono.variable}`;

  return (
    <html lang={locale} dir={dir} data-tenant={tenantKind} className={fontClass}>
      <body>
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
