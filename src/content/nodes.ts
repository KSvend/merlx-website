/**
 * Cooperative MERL Network nodes. Static content in v1 — promote to a
 * Payload collection when more than 5 nodes are operational.
 */

export interface NetworkNode {
  slug: string;
  name: string;
  region: string;
  country: string;
  status: 'active' | 'onboarding' | 'planned';
  primaryLocale: 'en' | 'ar' | 'fr';
  tagline: string;
  description: string;
  capabilities: string[];
  subdomain?: string;
  externalUrl?: string;
}

export const NODES: NetworkNode[] = [
  {
    slug: 'nilex',
    name: 'NileX',
    region: 'Horn of Africa',
    country: 'Sudan',
    status: 'active',
    primaryLocale: 'ar',
    tagline: 'MERL cooperative for Sudan and the wider Nile basin.',
    description:
      'NileX is the first MERLx Network node: a Sudan-based cooperative of researchers, evaluators and conflict analysts working across Sudan, South Sudan and the wider Nile basin. NileX runs MERL programmes for humanitarian and development partners with full local accountability, hosts MERLxLabs (the OASIS recovery marketplace), and contributes data to the Optics Suite.',
    capabilities: [
      'MERL design and delivery',
      'Conflict-sensitive evaluation',
      'KII research in Arabic and Sudanese local languages',
      'OASIS programme implementation',
      'Cross-border field operations (Sudan, South Sudan, Chad)',
    ],
    subdomain: 'nilex.merlx.org',
  },
  {
    slug: 'andes',
    name: 'Andes Cooperativa',
    region: 'Andean region',
    country: 'Colombia',
    status: 'onboarding',
    primaryLocale: 'en',
    tagline: 'MERL and peace-building expertise across the Andean region.',
    description:
      'Onboarding cooperative based in Bogotá, with delivery teams across Colombia, Ecuador and Peru. Specialises in post-conflict transition monitoring, illicit-economy research, and indigenous-community-led MERL.',
    capabilities: [
      'Post-conflict transition monitoring',
      'Illicit economy and governance research',
      'Indigenous-community MERL methodology',
      'Spanish, Quechua and Aymara field research',
    ],
  },
  {
    slug: 'sahel',
    name: 'Sahel Reseau',
    region: 'West Africa',
    country: 'Senegal',
    status: 'onboarding',
    primaryLocale: 'fr',
    tagline: 'Francophone Sahel evaluation and early-warning network.',
    description:
      'Onboarding cooperative based in Dakar, with delivery teams across Senegal, Mali, Burkina Faso and Niger. Specialises in violent-extremism early warning, climate-fragility monitoring, and pastoralist livelihoods evaluation.',
    capabilities: [
      'Violent-extremism early warning',
      'Climate-fragility monitoring',
      'Pastoralist livelihoods MERL',
      'French, Wolof, Hausa and Bambara field research',
    ],
  },
  {
    slug: 'mena',
    name: 'MENA Methods',
    region: 'Levant + MENA',
    country: 'Jordan',
    status: 'planned',
    primaryLocale: 'ar',
    tagline: 'Levant and broader MENA research collaborative. Onboarding 2026.',
    description:
      'Planned MERLx Network node in Amman, with operating reach across Jordan, Lebanon, Iraq and Syria. Focus areas: protracted-displacement research, refugee-host-community evaluation, and stabilisation programme MERL.',
    capabilities: [
      'Protracted-displacement research',
      'Refugee-host-community evaluation',
      'Stabilisation programme MERL',
      'Arabic, Kurdish and Levantine local languages',
    ],
  },
];
