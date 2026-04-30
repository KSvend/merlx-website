import { BrandMark } from '@/components/BrandMark';
import { LocaleSwitch } from '@/components/LocaleSwitch';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { headers } from 'next/headers';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('scaffold');

  const headerList = await headers();
  const tenantKind = headerList.get('x-tenant-kind') ?? 'unknown';
  const tenantDomain = headerList.get('x-tenant-domain') ?? 'unknown';

  return (
    <main style={{ padding: 24 }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
        <BrandMark size={28} />
        <span
          style={{
            fontFamily: 'var(--font-serif)',
            fontWeight: 600,
            fontSize: 19,
            letterSpacing: '-0.005em',
          }}
        >
          MERL<span style={{ color: 'var(--color-purple)' }}>x</span>
        </span>
        <span style={{ marginInlineStart: 'auto' }}>
          <LocaleSwitch currentLocale={locale} />
        </span>
      </header>

      <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 32 }}>Phase 0 scaffold</h1>
      <table style={{ borderCollapse: 'collapse', marginTop: 12 }}>
        <tbody>
          <tr>
            <th style={{ textAlign: 'start', padding: '4px 12px 4px 0' }}>{t('tenantHeader')}</th>
            <td>
              {tenantKind} ({tenantDomain})
            </td>
          </tr>
          <tr>
            <th style={{ textAlign: 'start', padding: '4px 12px 4px 0' }}>{t('localeHeader')}</th>
            <td>{locale}</td>
          </tr>
          <tr>
            <th style={{ textAlign: 'start', padding: '4px 12px 4px 0' }}>
              {t('directionHeader')}
            </th>
            <td>{locale === 'ar' ? 'rtl' : 'ltr'}</td>
          </tr>
        </tbody>
      </table>
    </main>
  );
}
