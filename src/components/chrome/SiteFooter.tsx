import type { TenantContext } from '@/lib/tenant-aware';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import { BrandMark } from './BrandMark';

interface SiteFooterProps {
  tenant: TenantContext;
  locale: string;
  nodeName?: string;
}

export function SiteFooter({ tenant, locale, nodeName }: SiteFooterProps) {
  const wrapperStyle: CSSProperties = {
    background: 'var(--shell-warm)',
    borderTop: '1px solid var(--border-light)',
    marginTop: 'var(--space-48)',
  };

  const innerStyle: CSSProperties = {
    width: '100%',
    maxWidth: '1280px',
    marginInline: 'auto',
    paddingInline: 'clamp(var(--space-8), 4vw, var(--space-12))',
    paddingBlock: 'var(--space-32)',
    display: 'grid',
    gridTemplateColumns: 'minmax(220px, 1fr) auto',
    gap: 'var(--space-16)',
    alignItems: 'start',
  };

  const colsStyle: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, max-content))',
    gap: 'var(--space-16)',
  };

  return (
    <footer style={wrapperStyle}>
      <div style={innerStyle}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
          <BrandMark
            tenant={tenant.kind === 'unknown' ? 'group' : tenant.kind}
            nodeName={nodeName}
            locale={locale}
            asLink={false}
          />
          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 'var(--text-sm)',
              color: 'var(--ink-muted)',
              maxWidth: '38ch',
              lineHeight: 1.5,
            }}
          >
            {taglineFor(tenant.kind, nodeName)}
          </p>
        </div>

        <div style={colsStyle}>
          <FooterColumn title="Studio" items={studioLinks(locale)} />
          <FooterColumn title="Network" items={networkLinks(locale)} />
          <FooterColumn title="Group" items={groupLinks(locale)} />
        </div>
      </div>

      <div
        style={{
          width: '100%',
          maxWidth: '1280px',
          marginInline: 'auto',
          paddingInline: 'clamp(var(--space-8), 4vw, var(--space-12))',
          paddingBlock: 'var(--space-8)',
          borderTop: '1px solid var(--border-light)',
          display: 'flex',
          justifyContent: 'space-between',
          gap: 'var(--space-8)',
          flexWrap: 'wrap',
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--text-xxs)',
          letterSpacing: '0.5px',
          color: 'var(--ink-muted)',
          textTransform: 'uppercase',
        }}
      >
        <span>© {new Date().getUTCFullYear()} MERLx</span>
        <span>Independent · open methods · evidence-grade</span>
      </div>
    </footer>
  );
}

interface ColumnItem {
  href: string;
  label: string;
  external?: boolean;
}

function FooterColumn({ title, items }: { title: string; items: ColumnItem[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontWeight: 500,
          fontSize: 'var(--text-xxs)',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          color: 'var(--ink-muted)',
        }}
      >
        {title}
      </span>
      <ul
        style={{
          listStyle: 'none',
          padding: 0,
          margin: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-3)',
        }}
      >
        {items.map((item) => (
          <li key={`${title}-${item.href}`}>
            <Link
              href={item.href}
              target={item.external ? '_blank' : undefined}
              rel={item.external ? 'noopener noreferrer' : undefined}
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'var(--text-sm)',
                color: 'var(--ink)',
                textDecoration: 'none',
                transition: 'color var(--motion-default) var(--motion-easing)',
              }}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function taglineFor(kind: TenantContext['kind'], nodeName?: string) {
  if (kind === 'studio')
    return 'A studio building the Optics Suite — open AI tooling for monitoring, evaluation, research, and early warning in fragile contexts.';
  if (kind === 'network')
    return 'A federation of locally owned MERL cooperatives. Federated nodes under shared methodology and conflict-sensitivity standards.';
  if (kind === 'node')
    return `${nodeName ?? 'Node'} — a MERLx Network node. Locally owned, federated under shared methodology.`;
  return 'Open analytical tools for fragile contexts. A studio plus a federated MERL network.';
}

function studioLinks(locale: string): ColumnItem[] {
  return [
    { href: 'https://studio.merlx.org', label: 'Studio home', external: true },
    { href: 'https://studio.merlx.org/optics', label: 'Optics Suite', external: true },
    { href: 'https://studio.merlx.org/engage', label: 'Engage', external: true },
    { href: `/${locale}/about`, label: 'About' },
  ];
}

function networkLinks(locale: string): ColumnItem[] {
  return [
    { href: 'https://network.merlx.org', label: 'Network home', external: true },
    { href: 'https://network.merlx.org/nodes', label: 'Nodes', external: true },
    { href: 'https://network.merlx.org/services', label: 'Services', external: true },
    { href: 'https://network.merlx.org/become-a-node', label: 'Become a node', external: true },
  ];
}

function groupLinks(locale: string): ColumnItem[] {
  return [
    { href: `/${locale}`, label: 'Group home' },
    { href: `/${locale}/insights`, label: 'Insights' },
    { href: `/${locale}/publications`, label: 'Publications' },
    { href: `/${locale}/contact`, label: 'Contact' },
    { href: `/${locale}/legal/privacy`, label: 'Privacy' },
    { href: `/${locale}/legal/terms`, label: 'Terms' },
  ];
}
