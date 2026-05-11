/**
 * Studio engagement-model copy. Hardcoded JSON in v1; promote to a
 * Payload collection if editorial workflow demands it.
 */

export interface EngagementModel {
  slug: 'hosted' | 'pilot' | 'build-with' | 'advisory' | 'evaluation' | 'tpm-research';
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
      'We host the tools you need from the Optics Suite, configure them against your programme, integrate with your data sources, and give your team weekly outputs. Data stays in instances we run for you on EU infrastructure under standard data-protection terms.',
    bullets: [
      'Hosted Optics Suite instance, configured to your programme',
      'Weekly outputs (briefs, dashboards) co-designed with your MEAL team',
      'EU hosting, standard DP terms, full audit log',
      'Routine model retraining and indicator updates',
    ],
  },
  {
    slug: 'pilot',
    name: 'Pilot and evaluate',
    tagline: 'Bounded pilots that test whether a tool fits your context.',
    fit: 'Programmes considering adoption who want evidence before scaling.',
    description:
      'A 4-12 week pilot of one Optics Suite tool against your operational context. We co-design success criteria with your team, deploy in one geography or programme, and write up an honest evaluation: failure modes, integration costs, and a recommendation on whether to scale.',
    bullets: [
      'Bounded scope (one tool, one geography)',
      'Pre-registered success criteria',
      'Honest evaluation, including reasons not to scale',
      'Pricing scaled to scope. Partial subsidy available for low-resource partners',
    ],
  },
  {
    slug: 'build-with',
    name: 'Build-with',
    tagline: 'Co-build a tool with us in your domain.',
    fit: 'Partners with deep domain knowledge and a problem we should solve openly.',
    description:
      'When the suite is missing a tool that your domain needs, build with us. The result is a new open-source tool that you co-own, with a maintenance commitment from MERLx for an agreed period. Your domain expertise plus our engineering. We retain rights to keep maintaining the tool for the wider field.',
    bullets: [
      'Joint design and engineering sprints (typically 8-20 weeks)',
      'Open-source by default. Co-attribution.',
      'MERLx maintenance window after launch',
      'IP terms agreed up front',
    ],
  },
  {
    slug: 'advisory',
    name: 'Advisory',
    tagline: 'Senior advisors on AI, MEAL and conflict-sensitive data work.',
    fit: 'Teams making strategic data, AI or MEAL decisions who want an outside read.',
    description:
      'Time-boxed senior advisory: design reviews, theory-of-change critique, AI and data strategy, vendor review, evaluation methodology. Day-rate or retainer. Same people who build the tools.',
    bullets: [
      'Day-rate or quarterly retainer',
      'Senior staff only',
      'Output-shaped: written critique, design review, sprint kick-off',
      'We will say no to engagements we cannot do well',
    ],
  },
  {
    slug: 'evaluation',
    name: 'Evaluation',
    tagline: 'Conflict-sensitive evaluations across the programme lifecycle.',
    fit: 'Donors, multilaterals and INGOs commissioning formative, midterm or endline evaluations in fragile and conflict-affected contexts.',
    description:
      'Independent mixed-methods evaluations: document review, KII, FGD, survey, and — where the question warrants — Optics tools as analytical infrastructure (PRISM compound risk, IRIS narrative monitoring, ToC Tester theory-of-change critique). Conflict-sensitive by default. Bilingual reporting. Outputs are auditable: features behind classifications, indicators behind narratives, evidence behind every claim.',
    bullets: [
      'Mixed-methods: KII, FGD, survey, document review',
      'Theory-of-change critique with ToC Tester where useful',
      'Bilingual reporting (English + working language)',
      'DPIA per engagement, IASC and OECD-DAC aligned',
    ],
  },
  {
    slug: 'tpm-research',
    name: 'TPM & Research',
    tagline: 'Third-Party Monitoring, KII rotations and primary research in fragile contexts.',
    fit: 'Donors and implementers needing recurring field verification, baseline / midline / endline studies, or primary research where the field is hard to reach.',
    description:
      'Recurring TPM cycles and primary research delivered through locally anchored teams who own the analysis. On-device KII transcription via ECHO where bandwidth, security or consent demands it. Findings are owned by the country team and signed off jointly. Client receives structured outputs and briefings rather than raw transcripts.',
    bullets: [
      'Recurring TPM cycles, configurable cadence',
      'On-device KII transcription (ECHO) for low-bandwidth or sensitive contexts',
      'Baseline / midline / endline data collection',
      'Locally anchored teams; structured client briefings, not raw transcripts',
    ],
  },
];
