import { BrandMark } from '@/components/BrandMark';
import { LocaleSwitch } from '@/components/LocaleSwitch';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

interface SiteNavProps {
  locale: string;
}

export async function SiteNav({ locale }: SiteNavProps) {
  const t = await getTranslations('chrome');

  return (
    <nav
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 28px',
        borderBottom: '1px solid var(--color-rule)',
        background: 'var(--color-bg)',
      }}
    >
      <Link
        href={`/${locale}`}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 11,
          textDecoration: 'none',
          color: 'var(--color-ink)',
        }}
      >
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
      </Link>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 22,
          fontFamily: 'var(--font-sans)',
          fontSize: 12,
          color: 'var(--color-ink-soft)',
        }}
      >
        <Link href={`/${locale}/insights`} style={{ color: 'inherit', textDecoration: 'none' }}>
          {t('navInsights')}
        </Link>
        <Link href={`/${locale}/publications`} style={{ color: 'inherit', textDecoration: 'none' }}>
          {t('navPublications')}
        </Link>
        <Link href={`/${locale}/contact`} style={{ color: 'inherit', textDecoration: 'none' }}>
          {t('navContact')}
        </Link>
        <LocaleSwitch currentLocale={locale} />
      </div>
    </nav>
  );
}
