import { BrandMark } from '@/components/BrandMark';
import { LocaleSwitch } from '@/components/LocaleSwitch';
import { parseTenantHeaders } from '@/lib/tenant-aware';
import { getTranslations } from 'next-intl/server';
import { headers } from 'next/headers';
import Link from 'next/link';

interface SiteNavProps {
  locale: string;
}

interface NavLink {
  href: string;
  label: string;
}

export async function SiteNav({ locale }: SiteNavProps) {
  const t = await getTranslations('chrome');
  const headerList = await headers();
  const { kind } = parseTenantHeaders(headerList);

  const links: NavLink[] = (() => {
    if (kind === 'studio') {
      return [
        { href: `/${locale}/optics`, label: 'Optics Suite' },
        { href: `/${locale}/engage`, label: 'Engage' },
        { href: `/${locale}/principles`, label: 'Principles' },
        { href: `/${locale}/about`, label: 'About' },
        { href: `/${locale}/insights`, label: t('navInsights') },
        { href: `/${locale}/publications`, label: t('navPublications') },
        { href: `/${locale}/contact`, label: t('navContact') },
      ];
    }
    return [
      { href: `/${locale}/insights`, label: t('navInsights') },
      { href: `/${locale}/publications`, label: t('navPublications') },
      { href: `/${locale}/contact`, label: t('navContact') },
    ];
  })();

  const accentColor = kind === 'studio' ? 'var(--color-orange)' : 'var(--color-purple)';
  const projectSubtitle = kind === 'studio' ? 'Studio' : null;

  return (
    <header>
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
            alignItems: 'baseline',
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
            MERL<span style={{ color: accentColor }}>x</span>
          </span>
          {projectSubtitle ? (
            <span
              style={{
                fontFamily: 'var(--font-serif)',
                fontStyle: 'italic',
                fontWeight: 400,
                fontSize: 16,
                color: 'var(--color-ink-mute)',
                marginLeft: 2,
              }}
            >
              {projectSubtitle}
            </span>
          ) : null}
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
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{ color: 'inherit', textDecoration: 'none' }}
            >
              {link.label}
            </Link>
          ))}
          <LocaleSwitch currentLocale={locale} />
        </div>
      </nav>
    </header>
  );
}
