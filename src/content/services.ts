export interface NetworkService {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  bullets: string[];
}

export const SERVICES: NetworkService[] = [
  {
    slug: 'merl',
    name: 'MERL programme delivery',
    tagline: 'End-to-end monitoring, evaluation, research and learning for fragile contexts.',
    description:
      'Network nodes deliver MERL programmes from design through close-out — frameworks, indicator systems, baseline / midline / endline studies, and learning products. Every engagement uses locally-grounded methodology with cross-node peer review.',
    bullets: [
      'Inception and design (ToC, indicator framework, evaluation matrix)',
      'Quantitative + qualitative data collection at scale',
      'Mixed-methods analysis with conflict-sensitivity built in',
      'Publication-grade reporting + presentations',
    ],
  },
  {
    slug: 'ewer',
    name: 'Early warning + early response',
    tagline: 'Local-network sensors feeding the Optics Suite forecasting tools.',
    description:
      "Nodes operate the human side of EWER — local sentinels, KII rotations, structured rumour collection — feeding both their own programme dashboards and the Studio's Optics Suite (PRISM, IRIS) with verified ground signal that satellites and social-media scrapers cannot capture alone.",
    bullets: [
      'Local sentinel + KII rotations',
      'Structured rumour and disinfo collection',
      'Validation feeds into PRISM + IRIS pipelines',
      'Weekly briefs co-produced with partners',
    ],
  },
  {
    slug: 'evaluation',
    name: 'Independent evaluation',
    tagline: 'Mid-term, end-line, ex-post, and meta evaluations.',
    description:
      'Nodes lead independent evaluations under their own governance — no Studio interference in findings. We publish methodology and (where partners agree) raw data so the evaluation community can audit, replicate, and build on the work.',
    bullets: [
      'OECD-DAC criteria evaluations',
      'Realist + theory-based methodologies',
      'Open methodology by default',
      'Cross-node peer review for sensitive evaluations',
    ],
  },
  {
    slug: 'kii-research',
    name: 'KII + qualitative research',
    tagline: 'Field research in local languages, structured for downstream use.',
    description:
      'Network research teams conduct key-informant interviews and qualitative studies in local languages, using the ECHO assistant for live structuring + translation. Output is publication-grade and indexed for downstream MERL + analysis tools.',
    bullets: [
      'Multilingual KII rotations across the network',
      'ECHO live-structuring + translation pipeline',
      'Anonymisation + ethics review on every cycle',
      'Output formats matched to partner workflows',
    ],
  },
  {
    slug: 'partner-support',
    name: 'Partner capacity support',
    tagline: 'Embed network methodology in partner organisations.',
    description:
      'Network nodes embed MERL methodology, training, and tooling inside partner organisations — INGOs, donors, ministries — under co-design arrangements. Goal is to leave partners with capacity, not dependence.',
    bullets: [
      'Embedded methodologists for 3-12 months',
      'Custom training + curriculum',
      'Optics Suite onboarding + admin training',
      'Exit reviews and post-engagement audits',
    ],
  },
];
