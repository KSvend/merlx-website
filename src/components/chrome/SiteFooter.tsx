import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

interface SiteFooterProps {
  locale: string;
}

export async function SiteFooter({ locale }: SiteFooterProps) {
  const t = await getTranslations('chrome');

  return (
    <footer
      style={{
        marginTop: 'auto',
        padding: '32px 28px',
        borderTop: '1px solid var(--color-rule)',
        background: 'var(--color-bg)',
        fontFamily: 'var(--font-mono)',
        fontSize: 10,
        color: 'var(--color-ink-mute)',
        letterSpacing: '0.04em',
        display: 'flex',
        justifyContent: 'space-between',
        gap: 24,
        flexWrap: 'wrap',
      }}
    >
      <span>© {new Date().getFullYear()} MERLx</span>
      <div style={{ display: 'flex', gap: 16 }}>
        <Link
          href={`/${locale}/legal/privacy`}
          style={{ color: 'inherit', textDecoration: 'none' }}
        >
          {t('footerPrivacy')}
        </Link>
        <Link href={`/${locale}/legal/terms`} style={{ color: 'inherit', textDecoration: 'none' }}>
          {t('footerTerms')}
        </Link>
        <Link
          href={`/${locale}/legal/cookies`}
          style={{ color: 'inherit', textDecoration: 'none' }}
        >
          {t('footerCookies')}
        </Link>
      </div>
    </footer>
  );
}
