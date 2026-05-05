import type { TenantContext } from '@/lib/tenant-aware';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import { BrandMark } from './BrandMark';
import { LocaleSwitch } from './LocaleSwitch';

export interface NavItem {
  href: string;
  label: string;
  /** External tool subdomain — opens in new tab. */
  external?: boolean;
}

interface SiteNavProps {
  tenant: TenantContext;
  locale: string;
  /** Path within the current tenant, leading slash, no locale prefix. */
  pathname: string;
  /** Optional override of the auto-derived nav items. */
  items?: NavItem[];
  /** Node display name when tenant.kind === 'node'. */
  nodeName?: string;
}

export function SiteNav({ tenant, locale, pathname, items, nodeName }: SiteNavProps) {
  const navItems = items ?? defaultItemsFor(tenant.kind);

  const wrapperStyle: CSSProperties = {
    background: 'var(--surface)',
    borderBottom: '1px solid var(--border-light)',
    position: 'sticky',
    top: 0,
    zIndex: 50,
  };

  const innerStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 'var(--space-8)',
    height: '64px',
    width: '100%',
    maxWidth: '1280px',
    marginInline: 'auto',
    paddingInline: 'clamp(var(--space-8), 4vw, var(--space-12))',
  };

  const linksStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-6)',
    fontFamily: 'var(--font-sans)',
    fontWeight: 500,
    fontSize: 'var(--text-sm)',
  };

  return (
    <header style={wrapperStyle}>
      <div style={innerStyle}>
        <BrandMark
          tenant={tenant.kind === 'unknown' ? 'group' : tenant.kind}
          nodeName={nodeName}
          locale={locale}
        />
        <nav aria-label="Primary" style={linksStyle}>
          {navItems.map((item) => {
            const fullHref = item.external ? item.href : `/${locale}${item.href}`;
            const active =
              !item.external &&
              (item.href === '/'
                ? pathname === '/'
                : pathname === item.href || pathname.startsWith(`${item.href}/`));

            const linkStyle: CSSProperties = {
              color: active ? 'var(--ink)' : 'var(--ink-muted)',
              padding: 'var(--space-3) 0',
              textDecoration: 'none',
              borderBottom: `2px solid ${active ? 'var(--deep-teal)' : 'transparent'}`,
              transition: 'color var(--motion-default) var(--motion-easing)',
            };

            return (
              <Link
                key={item.href}
                href={fullHref}
                style={linkStyle}
                target={item.external ? '_blank' : undefined}
                rel={item.external ? 'noopener noreferrer' : undefined}
                aria-current={active ? 'page' : undefined}
              >
                {item.label}
              </Link>
            );
          })}
          <LocaleSwitch currentLocale={locale} pathname={pathname} />
        </nav>
      </div>
    </header>
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
        { href: '/publications', label: 'Publications' },
        { href: '/about', label: 'About' },
        { href: '/contact', label: 'Contact' },
      ];
    case 'network':
      return [
        { href: '/nodes', label: 'Nodes' },
        { href: '/services', label: 'Services' },
        { href: '/become-a-node', label: 'Become a node' },
        { href: '/principles', label: 'Principles' },
        { href: '/insights', label: 'Insights' },
        { href: '/publications', label: 'Publications' },
        { href: '/about', label: 'About' },
        { href: '/contact', label: 'Contact' },
      ];
    case 'node':
      return [
        { href: '/deployments', label: 'Deployments' },
        { href: '/news', label: 'News' },
        { href: '/publications', label: 'Publications' },
        { href: '/about', label: 'About' },
        { href: '/contact', label: 'Contact' },
      ];
    default:
      return [
        { href: '/about', label: 'About' },
        { href: '/insights', label: 'Insights' },
        { href: '/publications', label: 'Publications' },
        { href: '/contact', label: 'Contact' },
      ];
  }
}
