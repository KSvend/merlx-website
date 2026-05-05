import { routing } from '@/i18n/routing';
import Link from 'next/link';

interface LocaleSwitchProps {
  currentLocale: string;
  /** Path within the current tenant, no locale prefix (e.g. "/optics/prism"). */
  pathname: string;
  available?: readonly string[];
}

const LABELS: Record<string, string> = { en: 'EN', ar: 'AR', fr: 'FR' };

export function LocaleSwitch({
  currentLocale,
  pathname,
  available = routing.locales,
}: LocaleSwitchProps) {
  if (available.length < 2) return null;

  return (
    <span className="mx-nav-locale" aria-label="Language">
      {available.map((loc, index) => {
        const isActive = loc === currentLocale;
        const href = `/${loc}${pathname === '/' ? '' : pathname}`;
        return (
          <span key={loc} style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <Link href={href} aria-current={isActive ? 'true' : undefined} hrefLang={loc}>
              {LABELS[loc] ?? loc.toUpperCase()}
            </Link>
            {index < available.length - 1 ? (
              <span aria-hidden="true" className="mx-nav-locale-sep">
                ·
              </span>
            ) : null}
          </span>
        );
      })}
    </span>
  );
}
