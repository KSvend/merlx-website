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
}

export function SiteNav({ tenant, locale, pathname, items, nodeName }: SiteNavProps) {
  const navItems = items ?? defaultItemsFor(tenant.kind);

  return (
    <nav className="mx-nav">
      <div className="mx-nav-inner">
        <BrandMark
          tenant={tenant.kind === 'unknown' ? 'group' : tenant.kind}
          nodeName={nodeName}
          locale={locale}
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
            Get in touch
          </Link>
        </div>
      </div>
    </nav>
  );
}

function defaultItemsFor(kind: TenantContext['kind']): NavItem[] {
  switch (kind) {
    case 'studio':
      return [
        { href: '/optics', label: 'Optics Suite' },
        { href: '/engage', label: 'Engage' },
        { href: '/principles', label: 'Principles' },
        { href: '/insights', label: 'Insights' },
        { href: '/about', label: 'About' },
      ];
    case 'network':
      return [
        { href: '/nodes', label: 'Nodes' },
        { href: '/services', label: 'Services' },
        { href: '/become-a-node', label: 'Become a node' },
        { href: '/principles', label: 'Principles' },
        { href: '/insights', label: 'Insights' },
        { href: '/about', label: 'About' },
      ];
    case 'node':
      return [
        { href: '/deployments', label: 'Deployments' },
        { href: '/news', label: 'News' },
        { href: '/about', label: 'About' },
      ];
    case 'learn':
      return [
        { href: '/catalogue', label: 'Catalogue' },
        { href: '/catalogue?track=cooperative-onboarding', label: 'Cooperative onboarding' },
        { href: '/catalogue?track=advanced-merl', label: 'Advanced MERL' },
        { href: '/about', label: 'About' },
      ];
    default:
      return [
        { href: '/about', label: 'About' },
        { href: '/insights', label: 'Insights' },
        { href: '/publications', label: 'Publications' },
      ];
  }
}
