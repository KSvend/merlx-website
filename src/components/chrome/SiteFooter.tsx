import type { TenantContext } from '@/lib/tenant-aware';
import Link from 'next/link';
import { BrandMark } from './BrandMark';

const FOOTER_STRINGS: Record<
  string,
  {
    newsletter: string;
    emailPlaceholder: string;
    emailLabel: string;
    subscribe: string;
    rights: string;
    privacy: string;
    terms: string;
    cookies: string;
    getInTouch: string;
    columns: { studio: string; network: string; learn: string; group: string; contact: string };
    groupItems: { about: string; insights: string; publications: string };
    tagGroup: string[];
  }
> = {
  en: {
    newsletter: 'Newsletter',
    emailPlaceholder: 'you@organization.org',
    emailLabel: 'Email address',
    subscribe: 'Subscribe',
    rights: 'All rights reserved.',
    privacy: 'Privacy',
    terms: 'Terms',
    cookies: 'Cookies',
    getInTouch: 'Get in touch',
    columns: {
      studio: 'Studio',
      network: 'Network',
      learn: 'Learn',
      group: 'Group',
      contact: 'Contact',
    },
    groupItems: { about: 'About', insights: 'Insights', publications: 'Publications' },
    tagGroup: ['Intelligence for impact.', 'Expertise for change.'],
  },
  fr: {
    newsletter: 'Newsletter',
    emailPlaceholder: 'vous@organisation.org',
    emailLabel: 'Adresse e-mail',
    subscribe: 'S’abonner',
    rights: 'Tous droits réservés.',
    privacy: 'Confidentialité',
    terms: 'Conditions',
    cookies: 'Cookies',
    getInTouch: 'Nous contacter',
    columns: {
      studio: 'Studio',
      network: 'Network',
      learn: 'Learn',
      group: 'Groupe',
      contact: 'Contact',
    },
    groupItems: { about: 'À propos', insights: 'Analyses', publications: 'Publications' },
    tagGroup: ['Renseignement pour l’impact.', 'Expertise pour le changement.'],
  },
  ar: {
    newsletter: 'النشرة البريدية',
    emailPlaceholder: 'you@organization.org',
    emailLabel: 'البريد الإلكتروني',
    subscribe: 'اشترك',
    rights: 'جميع الحقوق محفوظة.',
    privacy: 'الخصوصية',
    terms: 'الشروط',
    cookies: 'ملفّات تعريف الارتباط',
    getInTouch: 'تواصل معنا',
    columns: {
      studio: 'الاستوديو',
      network: 'الشبكة',
      learn: 'التعلّم',
      group: 'المجموعة',
      contact: 'تواصل',
    },
    groupItems: { about: 'حول', insights: 'رؤى', publications: 'منشورات' },
    tagGroup: ['ذكاء من أجل الأثر.', 'خبرة من أجل التغيير.'],
  },
};

interface SiteFooterProps {
  tenant: TenantContext;
  locale: string;
  nodeName?: string;
  groupHomeHref: string;
  tenantHomeHref: string | null;
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

export function SiteFooter({
  tenant,
  locale,
  nodeName,
  groupHomeHref,
  tenantHomeHref,
}: SiteFooterProps) {
  const t = FOOTER_STRINGS[locale] ?? FOOTER_STRINGS.en;
  const tag = taglineFor(tenant.kind, nodeName, t.tagGroup);
  const columns = columnsFor(tenant.kind, locale, t);

  return (
    <footer className="mx-footer">
      <div className="mx-container">
        <div className="mx-footer-grid">
          <div className="mx-footer-brand">
            <BrandMark
              tenant={tenant.kind === 'unknown' ? 'group' : tenant.kind}
              nodeName={nodeName}
              locale={locale}
              variant="inverse"
              groupHomeHref={groupHomeHref}
              tenantHomeHref={tenantHomeHref}
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
              {t.newsletter}
            </p>
            <form className="mx-footer-newsletter" action={`/${locale}/contact`}>
              <input
                type="email"
                name="email"
                placeholder={t.emailPlaceholder}
                aria-label={t.emailLabel}
              />
              <button type="submit">{t.subscribe}</button>
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
          <span>
            © {new Date().getUTCFullYear()} MERLx. {t.rights}
          </span>
          <div className="mx-footer-bottom-links">
            <Link href={`/${locale}/legal/privacy`}>{t.privacy}</Link>
            <Link href={`/${locale}/legal/terms`}>{t.terms}</Link>
            <Link href={`/${locale}/legal/cookies`}>{t.cookies}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function taglineFor(kind: TenantContext['kind'], nodeName?: string, groupLines?: string[]) {
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
  if (kind === 'learn')
    return (
      <>
        Cooperative onboarding.
        <br />
        Advanced MERL.
      </>
    );
  const [line1, line2] = groupLines ?? ['Intelligence for impact.', 'Expertise for change.'];
  return (
    <>
      {line1}
      <br />
      {line2}
    </>
  );
}

function columnsFor(
  kind: TenantContext['kind'],
  locale: string,
  t: (typeof FOOTER_STRINGS)[string],
): Column[] {
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
        heading: 'Learn',
        items: [
          { label: 'Catalogue', href: 'https://learn.merlx.org', external: true },
          {
            label: 'Tool training',
            href: 'https://learn.merlx.org/catalogue?track=tool-training',
            external: true,
          },
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
        heading: 'Learn',
        items: [
          {
            label: 'Cooperative onboarding',
            href: 'https://learn.merlx.org/catalogue?track=cooperative-onboarding',
            external: true,
          },
          { label: 'Catalogue', href: 'https://learn.merlx.org', external: true },
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
        heading: 'Learn',
        items: [
          { label: 'Catalogue', href: 'https://learn.merlx.org', external: true },
          {
            label: 'Cooperative onboarding',
            href: 'https://learn.merlx.org/catalogue?track=cooperative-onboarding',
            external: true,
          },
        ],
      },
      {
        heading: 'Contact',
        items: [{ label: 'Get in touch', href: `/${locale}/contact` }],
      },
    ];
  }
  if (kind === 'learn') {
    return [
      {
        heading: 'Catalogue',
        items: [
          { label: 'All courses', href: `/${locale}/catalogue` },
          {
            label: 'Cooperative onboarding',
            href: `/${locale}/catalogue?track=cooperative-onboarding`,
          },
          { label: 'Advanced MERL', href: `/${locale}/catalogue?track=advanced-merl` },
          { label: 'Tool training', href: `/${locale}/catalogue?track=tool-training` },
        ],
      },
      {
        heading: 'Network',
        items: [
          { label: 'Network home', href: 'https://network.merlx.org', external: true },
          {
            label: 'Become a node',
            href: 'https://network.merlx.org/become-a-node',
            external: true,
          },
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
        heading: 'Contact',
        items: [
          { label: 'Get in touch', href: `/${locale}/contact` },
          { label: 'learn@merlx.org', href: 'mailto:learn@merlx.org', external: true },
        ],
      },
    ];
  }
  // Group
  return [
    {
      heading: t.columns.group,
      items: [
        { label: t.groupItems.about, href: `/${locale}/about` },
        { label: t.groupItems.insights, href: `/${locale}/insights` },
        { label: t.groupItems.publications, href: `/${locale}/publications` },
      ],
    },
    {
      heading: t.columns.contact,
      items: [
        { label: t.getInTouch, href: `/${locale}/contact` },
        { label: 'hello@merlx.org', href: 'mailto:hello@merlx.org', external: true },
      ],
    },
  ];
}
