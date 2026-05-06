/**
 * Three "scenes" for the landing prototypes — one per main entity
 * (Studio / Network / Learn). Used by the /lab/landing-* pages to
 * cycle through the three with a constant MERLx wordmark anchor.
 */

export interface LandingScene {
  entity: 'studio' | 'network' | 'learn';
  /** Word that fills the slot after MERLx in the wordmark. */
  label: string;
  /** Small mono caption above the headline. */
  eyebrow: string;
  /** Headline that follows MERLx [Label] — describes the entity in one line. */
  headline: string;
  /** Italic flourish word, applied at the end of the headline (DM Serif Display italic). */
  flourish: string;
  /** Body paragraph in the hero. */
  body: string;
  /** Three-bullet list under the body. */
  bullets: string[];
  /** Accent CSS variable used for label + flourish. */
  accent: string;
  /** Dim variant of the accent for tints. */
  accentDim: string;
  cta: { label: string; href: string };
}

export const LANDING_SCENES: LandingScene[] = [
  {
    entity: 'studio',
    label: 'Studio',
    eyebrow: '01 · The tech studio',
    headline: 'Open AI tooling for monitoring, evaluation and early warning,',
    flourish: 'built openly.',
    body: 'An independent studio building the Optics Suite: six AI-native tools for analysts working in conflict, food-insecurity and humanitarian contexts. Methods are open. Outputs ship with their uncertainty.',
    bullets: [
      'IRIS, Aperture, PRISM, ToC Tester, OASIS, ECHO',
      'Earth observation, NLP, compound-risk forecasting',
      'Engagements: hosted, pilot, build-with, advisory',
    ],
    accent: 'var(--ember)',
    accentDim: 'var(--ember-dim)',
    cta: { label: 'Enter MERLx Studio →', href: 'https://studio.merlx.org' },
  },
  {
    entity: 'network',
    label: 'Network',
    eyebrow: '02 · The MERL cooperative',
    headline: 'A cooperative of locally owned MERL practices,',
    flourish: 'in country.',
    body: 'Each node is autonomous and accountable in country. Nodes share methodology, peer review and the Optics Suite as infrastructure. Governance, hiring and partner choice stay local.',
    bullets: [
      'Active node: NileX (Sudan and the Nile basin)',
      'Onboarding: Andes Cooperativa, Sahel Reseau',
      'Services: research, evaluation, TPM, KII, partner support',
    ],
    accent: 'var(--deep-teal)',
    accentDim: 'var(--deep-teal-dim)',
    cta: { label: 'Enter the Network →', href: 'https://network.merlx.org' },
  },
  {
    entity: 'learn',
    label: 'Learn',
    eyebrow: '03 · Courses and curriculum',
    headline: 'Two tracks, one practice —',
    flourish: 'taught by the people who do the work.',
    body: 'Cooperative onboarding for new Network researchers and enumerators. Advanced MERL for donor and INGO programme teams. Same instructor pool, same methodological standards.',
    bullets: [
      'Cooperative-onboarding seats are free for Network nodes',
      'Advanced-MERL cohorts run twice a year. First cohort free.',
      'Tool-training certifications for the Optics Suite',
    ],
    accent: 'var(--iris)',
    accentDim: 'var(--iris-dim)',
    cta: { label: 'Enter MERLx Learn →', href: 'https://learn.merlx.org' },
  },
];

export const SHARED_HEADER = {
  eyebrow: 'A studio, a network and a learning surface',
  brandPrefix: 'MERLx',
};
