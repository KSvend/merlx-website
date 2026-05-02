/**
 * Studio engagement-model copy. Hardcoded JSON in v1; promote to a
 * Payload collection if editorial workflow demands it.
 */

export interface EngagementModel {
  slug: 'hosted' | 'pilot' | 'build-with' | 'advisory';
  name: string;
  tagline: string;
  fit: string;
  description: string;
  bullets: string[];
}

export const ENGAGEMENT_MODELS: EngagementModel[] = [
  {
    slug: 'hosted',
    name: 'Hosted',
    tagline: 'Run Optics tools as a hosted service in your programme.',
    fit: 'Donors and INGOs without the engineering capacity to self-host.',
    description:
      'We host the tools you need from the Optics Suite, configure them against your programme, integrate with your data sources, and give your team weekly outputs. Your data stays in instances we run for you on EU-based infrastructure under standard data-protection terms.',
    bullets: [
      'Hosted Optics Suite instance, configured to your programme',
      'Weekly outputs (briefs, dashboards) co-designed with your MEAL team',
      'EU-based hosting, standard DP terms, audit log of accesses',
      'Routine model retraining + indicator-set updates',
    ],
  },
  {
    slug: 'pilot',
    name: 'Pilot & evaluate',
    tagline: 'Bounded pilots that test whether a tool fits your context.',
    fit: 'Programmes considering adoption — wanting evidence before scale.',
    description:
      'A 4-12 week pilot of one Optics Suite tool against your operational context. We co-design success criteria with your team, deploy in a single geography or programme, and produce an honest evaluation report — including failure modes, integration costs, and recommendations on whether to scale.',
    bullets: [
      'Bounded scope (one tool, one geography or programme)',
      'Pre-registered success criteria',
      'Honest evaluation report — including reasons not to scale',
      'Pricing scaled to scope; partial subsidy available for low-resource partners',
    ],
  },
  {
    slug: 'build-with',
    name: 'Build-with',
    tagline: 'Co-build a tool with us in your domain.',
    fit: 'Partners with deep domain knowledge and a problem we should solve openly.',
    description:
      'When the suite is missing a tool that your domain needs, build with us. The result is a new open-source tool that you co-own, with a maintenance commitment from the Studio for an agreed period. Your domain expertise + our engineering. We retain rights to keep maintaining and improving the tool for the wider field.',
    bullets: [
      'Joint design + engineering sprints (typically 8-20 weeks)',
      'Open-source by default; co-attribution',
      'Studio commits to a maintenance window post-launch',
      'IP terms agreed upfront — no surprises later',
    ],
  },
  {
    slug: 'advisory',
    name: 'Advisory',
    tagline: 'Senior advisors on AI, MEAL, and conflict-sensitive data work.',
    fit: 'Teams making strategic data, AI, or MEAL decisions and wanting an outside perspective.',
    description:
      'Time-boxed senior advisory: design reviews, theory-of-change critique, AI/data strategy, vendor review, evaluation methodology. Day-rate or retainer. Same people who build the tools — no juniorisation.',
    bullets: [
      'Day-rate or quarterly retainer',
      'Senior staff only (no juniorisation)',
      'Output-shaped: written critique, design review, sprint kick-off',
      'Conflict-sensitivity built in — we will say no to projects we cannot do well',
    ],
  },
];
