'use client';

import { routing } from '@/i18n/routing';
import { usePathname, useRouter } from 'next/navigation';

interface LocaleSwitchProps {
  currentLocale: string;
}

export function LocaleSwitch({ currentLocale }: LocaleSwitchProps) {
  const router = useRouter();
  const pathname = usePathname();

  const switchTo = (next: string) => {
    const stripped = pathname.replace(/^\/(en|ar|fr)(\/|$)/, '/');
    const target = `/${next}${stripped === '/' ? '' : stripped}`;
    router.push(target);
  };

  return (
    <nav aria-label="Language" style={{ fontFamily: 'var(--font-mono)', fontSize: 10 }}>
      {routing.locales.map((locale, index) => (
        <span key={locale}>
          <button
            type="button"
            onClick={() => switchTo(locale)}
            style={{
              border: 'none',
              background: 'transparent',
              padding: 0,
              cursor: 'pointer',
              color: locale === currentLocale ? 'var(--color-ink)' : 'var(--color-ink-mute)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}
            aria-current={locale === currentLocale ? 'true' : undefined}
          >
            {locale}
          </button>
          {index < routing.locales.length - 1 && (
            <span style={{ color: 'var(--color-ink-mute)' }}> · </span>
          )}
        </span>
      ))}
    </nav>
  );
}
