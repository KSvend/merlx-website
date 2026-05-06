/**
 * Track + filter metadata for the Learn catalogue.
 */

export const LEARN_TRACKS = {
  'cooperative-onboarding': {
    label: 'Cooperative onboarding',
    audience: 'Network researchers and enumerators',
    accent: 'var(--deep-teal)',
    description:
      'The methodological floor every new Network node clears. Required before joining an active engagement. Free for Network nodes.',
  },
  'continuous-learning': {
    label: 'Continuous learning',
    audience: 'Active Network nodes',
    accent: 'var(--iris)',
    description:
      'Ongoing CPD for active Network analysts and enumerators. Methods deep-dives, language extensions, tool releases.',
  },
  'advanced-merl': {
    label: 'Advanced MERL',
    audience: 'Donor and INGO programme teams',
    accent: 'var(--ember)',
    description:
      'Causal inference for small-n contexts, AI-assisted qualitative coding, theory-of-change stress-testing. Cohort-based, taught by the people who do the work.',
  },
  'tool-training': {
    label: 'Tool training',
    audience: 'Network analysts and Studio engineers',
    accent: 'var(--sand-dark)',
    description:
      'Operator certifications for the Optics Suite. PRISM, IRIS, Aperture, ToC Tester, OASIS, ECHO.',
  },
} as const;

export type LearnTrackKey = keyof typeof LEARN_TRACKS;

export const STATUS_LABEL: Record<string, string> = {
  open: '● OPEN',
  'starting-soon': '◐ STARTING SOON',
  waitlist: '○ WAITLIST',
  closed: '◯ CLOSED',
  'coming-soon': '○ COMING SOON',
};

export const STATUS_COLOR: Record<string, string> = {
  open: 'var(--deep-teal)',
  'starting-soon': 'var(--ember)',
  waitlist: 'var(--iris)',
  closed: 'var(--ink-faint)',
  'coming-soon': 'var(--iris)',
};

export const FORMAT_LABEL: Record<string, string> = {
  'self-paced': 'Self-paced',
  cohort: 'Cohort',
  workshop: 'Workshop',
  hybrid: 'Hybrid',
};

export const LEVEL_LABEL: Record<string, string> = {
  foundation: 'Foundation',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
};

export const LANGUAGE_LABEL: Record<string, string> = {
  en: 'EN',
  ar: 'AR',
  fr: 'FR',
  es: 'ES',
};

export const AUDIENCE_LABEL: Record<string, string> = {
  network: 'Network researchers',
  enumerators: 'Enumerators',
  donors: 'Donors',
  ingo: 'INGO programme staff',
  studio: 'Studio engineers',
};
