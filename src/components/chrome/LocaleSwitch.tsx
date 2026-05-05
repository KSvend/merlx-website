import { routing } from '@/i18n/routing';
import Link from 'next/link';
import type { CSSProperties } from 'react';

interface LocaleSwitchProps {
  currentLocale: string;
  /** Path within the current tenant, without locale prefix (e.g. "/optics/prism"). */
  pathname: string;
  /** Subset of locales offered (some node tenants ship with a smaller set). */
  available?: readonly string[];
}

const LABELS: Record<string, string> = { en: 'EN', ar: 'AR', fr: 'FR' };

export function LocaleSwitch({
  currentLocale,
  pathname,
  available = routing.locales,
}: LocaleSwitchProps) {
  if (available.length < 2) return null;

  const containerStyle: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 'var(--space-2)',
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--text-xxs)',
    letterSpacing: '0.5px',
    color: 'var(--ink-muted)',
  };

  return (
    <div style={containerStyle} aria-label="Language">
      {available.map((loc, index) => {
        const isActive = loc === currentLocale;
        const href = `/${loc}${pathname === '/' ? '' : pathname}`;
        const itemStyle: CSSProperties = {
          color: isActive ? 'var(--ink)' : 'var(--ink-muted)',
          fontWeight: isActive ? 600 : 500,
          textDecoration: 'none',
          padding: 'var(--space-1) var(--space-2)',
          borderRadius: 'var(--radius-sm)',
          transition: 'color var(--motion-default) var(--motion-easing)',
        };
        return (
          <span
            key={loc}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)' }}
          >
            <Link
              href={href}
              style={itemStyle}
              aria-current={isActive ? 'true' : undefined}
              hrefLang={loc}
            >
              {LABELS[loc] ?? loc.toUpperCase()}
            </Link>
            {index < available.length - 1 ? (
              <span aria-hidden="true" style={{ color: 'var(--ink-faint)' }}>
                ·
              </span>
            ) : null}
          </span>
        );
      })}
    </div>
  );
}
