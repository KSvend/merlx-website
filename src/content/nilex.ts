/**
 * NileX node-specific content. NileX is the first MERLx Network node
 * and the AR-primary tenant; this content is the editorial floor used
 * until the node admins author their own copy via Payload.
 */

export interface NodeDeployment {
  slug: string;
  name: string;
  partner: string;
  region: string;
  status: 'active' | 'closed' | 'planned';
  summary: string;
}

export interface NodeNewsItem {
  slug: string;
  date: string;
  title: string;
  excerpt: string;
}

export const NILEX_HERO = {
  eyebrow: 'NileX · MERLx Network node · Sudan',
  title: 'Sudan-rooted MERL, evidence for the Nile basin.',
  tagline:
    'NileX is a Sudan-based cooperative of researchers, evaluators and conflict analysts. We design and deliver MERL programmes for humanitarian and development partners across Sudan, South Sudan and the wider Nile basin, under local governance and shared MERLx Network methodology.',
  primaryCta: 'See active deployments',
  secondaryCta: 'Talk to NileX',
};

export const NILEX_DEPLOYMENTS: NodeDeployment[] = [
  {
    slug: 'oasis-sudan',
    name: 'OASIS · Sudan',
    partner: 'MERLxLabs',
    region: 'Sudan, multi-state',
    status: 'active',
    summary:
      'Damage-and-recovery marketplace across Khartoum, Darfur and Kordofan. Pairs satellite-derived damage assessments with NileX field-verified records.',
  },
  {
    slug: 'horn-ewer',
    name: 'Horn EWER consortium',
    partner: 'IGAD CEWARN + INGO consortium',
    region: 'Sudan + Eritrea border',
    status: 'active',
    summary:
      'Local sentinel network feeding both partner dashboards and the Studio Optics Suite (PRISM, IRIS) with verified ground signal.',
  },
  {
    slug: 'south-sudan-meal',
    name: 'South Sudan MEAL framework',
    partner: 'INGO consortium',
    region: 'Upper Nile + Jonglei',
    status: 'active',
    summary:
      'Mixed-methods MEAL framework for a 4-year humanitarian-development nexus programme. Inception complete; first-cycle field rotation underway.',
  },
  {
    slug: 'nile-water-research',
    name: 'Nile basin water-resource study',
    partner: 'Multilateral research foundation',
    region: 'Sudan + South Sudan + Ethiopia border',
    status: 'planned',
    summary:
      'Cross-border KII research on water-resource pressure points along the Nile basin. Field protocol approved; deployment Q3 2026.',
  },
];

export const NILEX_NEWS: NodeNewsItem[] = [
  {
    slug: '2026-04-network-onboarding',
    date: '2026-04-15',
    title: 'NileX joins the MERLx Network as the first member node',
    excerpt:
      'NileX is the first cooperative to fully join the MERLx Network. Methodology and tooling integration is complete. Cross-node peer review pilots begin in May.',
  },
  {
    slug: '2026-03-oasis-launch',
    date: '2026-03-22',
    title: 'OASIS · Sudan moves from inception to first field rotation',
    excerpt:
      'After six months of co-design with partners, OASIS damage-and-recovery records now flow into the live marketplace. Phase 1 covers Khartoum and El Fasher.',
  },
  {
    slug: '2026-02-arabic-methodology',
    date: '2026-02-10',
    title: 'NileX publishes Arabic-language MERL methodology series',
    excerpt:
      'Eight-paper series on conflict-sensitive evaluation methodology for Arabic-language MERL practitioners. CC-BY-SA.',
  },
];
