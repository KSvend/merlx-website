import type { TenantContext } from '@/lib/tenant-aware';
import Link from 'next/link';
import { BrandMark } from './BrandMark';

interface SiteFooterProps {
  tenant: TenantContext;
  locale: string;
  nodeName?: string;
}

interface ColumnItem {
  label: string;
  href: string;
  external?: boolean;
}

interface Column {
  heading: string;
  items: ColumnItem[];
}

export function SiteFooter({ tenant, locale, nodeName }: SiteFooterProps) {
  const tag = taglineFor(tenant.kind, nodeName);
  const columns = columnsFor(tenant.kind, locale);

  return (
    <footer className="mx-footer">
      <div className="mx-container">
        <div className="mx-footer-grid">
          <div className="mx-footer-brand">
            <BrandMark
              tenant={tenant.kind === 'unknown' ? 'group' : tenant.kind}
              nodeName={nodeName}
              locale={locale}
              asLink={false}
              variant="inverse"
            />
            <p className="mx-footer-tag">{tag}</p>
            <p
              style={{
                fontSize: 12,
                color: 'rgba(245,243,238,0.55)',
                margin: '0 0 8px',
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
              }}
            >
              Newsletter
            </p>
            <form className="mx-footer-newsletter" action={`/${locale}/contact`}>
              <input
                type="email"
                name="email"
                placeholder="you@organization.org"
                aria-label="Email address"
              />
              <button type="submit">Subscribe</button>
            </form>
          </div>
          {columns.map((c) => (
            <div key={c.heading}>
              <h4>{c.heading}</h4>
              <ul>
                {c.items.map((item) => (
                  <li key={`${c.heading}-${item.href}`}>
                    {item.external ? (
                      <a href={item.href} target="_blank" rel="noopener noreferrer">
                        {item.label}
                      </a>
                    ) : (
                      <Link href={item.href}>{item.label}</Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mx-footer-bottom">
          <span>© {new Date().getUTCFullYear()} MERLx. All rights reserved.</span>
          <div className="mx-footer-bottom-links">
            <Link href={`/${locale}/legal/privacy`}>Privacy</Link>
            <Link href={`/${locale}/legal/terms`}>Terms</Link>
            <Link href={`/${locale}/legal/cookies`}>Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function taglineFor(kind: TenantContext['kind'], nodeName?: string) {
  if (kind === 'studio')
    return (
      <>
        AI-native MERL,
        <br />
        built openly.
      </>
    );
  if (kind === 'network')
    return (
      <>
        Locally owned MERL,
        <br />
        cooperative under shared methodology.
      </>
    );
  if (kind === 'node')
    return (
      <>
        {nodeName ?? 'Node'},
        <br />a MERLx Network node.
      </>
    );
  return (
    <>
      Intelligence for impact.
      <br />
      Expertise for change.
    </>
  );
}

function columnsFor(kind: TenantContext['kind'], locale: string): Column[] {
  if (kind === 'studio') {
    return [
      {
        heading: 'Optics Suite',
        items: [
          { label: 'IRIS', href: `/${locale}/optics/iris` },
          { label: 'Aperture', href: `/${locale}/optics/aperture` },
          { label: 'PRISM', href: `/${locale}/optics/prism` },
          { label: 'ToC Tester', href: `/${locale}/optics/toc-tester` },
          { label: 'OASIS', href: `/${locale}/optics/oasis` },
          { label: 'ECHO', href: `/${locale}/optics/echo` },
        ],
      },
      {
        heading: 'Studio',
        items: [
          { label: 'Engage', href: `/${locale}/engage` },
          { label: 'Principles', href: `/${locale}/principles` },
          { label: 'Insights', href: `/${locale}/insights` },
          { label: 'About', href: `/${locale}/about` },
        ],
      },
      {
        heading: 'Network',
        items: [
          { label: 'Network home', href: 'https://network.merlx.org', external: true },
          { label: 'Nodes', href: 'https://network.merlx.org/nodes', external: true },
        ],
      },
      {
        heading: 'Contact',
        items: [
          { label: 'Get in touch', href: `/${locale}/contact` },
          { label: 'studio@merlx.org', href: 'mailto:studio@merlx.org', external: true },
        ],
      },
    ];
  }
  if (kind === 'network') {
    return [
      {
        heading: 'Network',
        items: [
          { label: 'Nodes', href: `/${locale}/nodes` },
          { label: 'Services', href: `/${locale}/services` },
          { label: 'Become a node', href: `/${locale}/become-a-node` },
          { label: 'Principles', href: `/${locale}/principles` },
        ],
      },
      {
        heading: 'Studio',
        items: [
          { label: 'Studio home', href: 'https://studio.merlx.org', external: true },
          { label: 'Optics Suite', href: 'https://studio.merlx.org/optics', external: true },
        ],
      },
      {
        heading: 'Insights',
        items: [
          { label: 'Insights', href: `/${locale}/insights` },
          { label: 'About', href: `/${locale}/about` },
        ],
      },
      {
        heading: 'Contact',
        items: [
          { label: 'Get in touch', href: `/${locale}/contact` },
          { label: 'network@merlx.org', href: 'mailto:network@merlx.org', external: true },
        ],
      },
    ];
  }
  if (kind === 'node') {
    return [
      {
        heading: 'Node',
        items: [
          { label: 'Deployments', href: `/${locale}/deployments` },
          { label: 'News', href: `/${locale}/news` },
          { label: 'About', href: `/${locale}/about` },
        ],
      },
      {
        heading: 'Network',
        items: [
          { label: 'All nodes', href: 'https://network.merlx.org/nodes', external: true },
          {
            label: 'Become a node',
            href: 'https://network.merlx.org/become-a-node',
            external: true,
          },
        ],
      },
      {
        heading: 'Studio',
        items: [{ label: 'Studio', href: 'https://studio.merlx.org', external: true }],
      },
      {
        heading: 'Contact',
        items: [{ label: 'Get in touch', href: `/${locale}/contact` }],
      },
    ];
  }
  // Group
  return [
    {
      heading: 'Studio',
      items: [
        { label: 'Studio home', href: 'https://studio.merlx.org', external: true },
        { label: 'Optics Suite', href: 'https://studio.merlx.org/optics', external: true },
        { label: 'Engage', href: 'https://studio.merlx.org/engage', external: true },
      ],
    },
    {
      heading: 'Network',
      items: [
        { label: 'Network home', href: 'https://network.merlx.org', external: true },
        { label: 'Nodes', href: 'https://network.merlx.org/nodes', external: true },
        { label: 'Services', href: 'https://network.merlx.org/services', external: true },
      ],
    },
    {
      heading: 'Group',
      items: [
        { label: 'About', href: `/${locale}/about` },
        { label: 'Insights', href: `/${locale}/insights` },
        { label: 'Publications', href: `/${locale}/publications` },
      ],
    },
    {
      heading: 'Contact',
      items: [
        { label: 'Get in touch', href: `/${locale}/contact` },
        { label: 'hello@merlx.org', href: 'mailto:hello@merlx.org', external: true },
      ],
    },
  ];
}
