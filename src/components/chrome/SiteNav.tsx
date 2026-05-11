import type { TenantContext } from '@/lib/tenant-aware';
import Link from 'next/link';
import { BrandMark } from './BrandMark';
import { LocaleSwitch } from './LocaleSwitch';
import { ThemeToggle } from './ThemeToggle';

export interface NavItem {
  href: string;
  label: string;
  external?: boolean;
}

interface SiteNavProps {
  tenant: TenantContext;
  locale: string;
  pathname: string;
  items?: NavItem[];
  nodeName?: string;
  groupHomeHref: string;
  tenantHomeHref: string | null;
}

const NAV_LABELS_BY_LOCALE: Record<string, { tools: string; engage: string; about: string; getInTouch: string }> = {
  en: { tools: 'Tools', engage: 'Engage', about: 'About', getInTouch: 'Get in touch' },
  fr: { tools: 'Outils', engage: 'Collaborer', about: 'À propos', getInTouch: 'Nous contacter' },
  ar: { tools: 'الأدوات', engage: 'تعاون', about: 'حول', getInTouch: 'تواصل معنا' },
};

export function SiteNav({
  tenant,
  locale,
  pathname,
  items,
  nodeName,
  groupHomeHref,
  tenantHomeHref,
}: SiteNavProps) {
  const labels = NAV_LABELS_BY_LOCALE[locale] ?? NAV_LABELS_BY_LOCALE.en;
  const navItems = items ?? defaultItemsFor(tenant.kind, labels);

  return (
    <nav className="mx-nav">
      <div className="mx-nav-inner">
        <BrandMark
          tenant={tenant.kind === 'unknown' ? 'group' : tenant.kind}
          nodeName={nodeName}
          locale={locale}
          groupHomeHref={groupHomeHref}
          tenantHomeHref={tenantHomeHref}
        />
        <div className="mx-nav-links">
          {navItems.map((item) => {
            const fullHref = item.external ? item.href : `/${locale}${item.href}`;
            const active =
              !item.external &&
              (item.href === '/'
                ? pathname === '/'
                : pathname === item.href || pathname.startsWith(`${item.href}/`));
            return (
              <Link
                key={item.href}
                href={fullHref}
                className="mx-nav-link"
                target={item.external ? '_blank' : undefined}
                rel={item.external ? 'noopener noreferrer' : undefined}
                aria-current={active ? 'page' : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
        <div className="mx-nav-actions">
          <LocaleSwitch currentLocale={locale} pathname={pathname} />
          <ThemeToggle />
          <Link
            href={`/${locale}/contact`}
            className="mx-btn mx-btn--primary"
            aria-current={pathname === '/contact' ? 'page' : undefined}
          >
            {labels.getInTouch}
          </Link>
        </div>
      </div>
    </nav>
  );
}

function defaultItemsFor(
  kind: TenantContext['kind'],
  labels: { tools: string; engage: string; about: string },
): NavItem[] {
  switch (kind) {
    case 'studio':
      return [
        { href: '/optics', label: labels.tools },
        { href: '/engage', label: labels.engage },
        { href: '/about', label: labels.about },
      ];
    case 'network':
      return [{ href: '/about', label: labels.about }];
    case 'node':
      return [{ href: '/about', label: labels.about }];
    case 'learn':
      return [{ href: '/about', label: labels.about }];
    default:
      return [
        { href: '/optics', label: labels.tools },
        { href: '/engage', label: labels.engage },
        { href: '/about', label: labels.about },
      ];
  }
}
