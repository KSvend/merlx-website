export interface Principle {
  number: number;
  title: string;
  body: string;
}

/**
 * Studio engineering commitments — what we promise to deliver.
 */
export const COMMITMENTS: Principle[] = [
  {
    number: 1,
    title: 'Field first, not lab first.',
    body: 'Programme reality sets the architecture. Low bandwidth, limited infrastructure, non-specialist users, noisy data, power that cuts out. Every tool has to work for a programme officer on a modest laptop, or an analyst at a shared CO desk behind a captive portal. We design for sustained programme use, not conference demos.',
  },
  {
    number: 2,
    title: 'Evidence over abstraction.',
    body: 'Every analytical output is auditable. Classifiers show which features drove the call. Narrative reports cite the indicators behind them. ToC Tester critique cites its evidence. We support human judgement; we do not replace it.',
  },
  {
    number: 3,
    title: 'Open and interoperable.',
    body: 'We build on open data standards, open satellite archives (Sentinel, Landsat, MODIS via Copernicus and Planetary Computer), open-source analytical libraries and standard APIs. Clients own their data and their instance. Nothing in our core stack is licence-locked.',
  },
  {
    number: 4,
    title: 'Responsible by default.',
    body: 'Every engagement runs a data-protection impact assessment at inception. We align to IASC operational guidance on data responsibility, OECD-DAC conflict-sensitivity, and Core Humanitarian Standard principles. PII redaction is on by default; data residency and retention are set by the client.',
  },
  {
    number: 5,
    title: 'Plan-driven.',
    body: 'Every change begins with a written plan, reviewed against coding and evaluation standards. We say no to projects we cannot do well. We retire tools that no longer earn their footprint.',
  },
];

/**
 * Studio product beliefs — how we think about the work.
 */
export const BELIEFS: Principle[] = [
  {
    number: 1,
    title: 'Better evidence wins better arguments.',
    body: 'Most analytical tools in this sector are decorative. The bar is evidence that materially shifts a programme decision, not evidence that decorates one already made.',
  },
  {
    number: 2,
    title: 'AI augments, it does not author.',
    body: 'We use machine learning, LLMs and satellite analysis where they earn their place against simpler alternatives. AI augments the analysts, evaluators and programme staff who already do the work.',
  },
  {
    number: 3,
    title: 'Cooperative, not centralised.',
    body: 'Tools are open and portable. Expertise is locally held — anchored through partner cooperatives and in-country teams who own the analysis.',
  },
  {
    number: 4,
    title: 'Speed and care are not opposites.',
    body: 'A weekly forecast two weeks late is decorative. We ship fast, document the trade, and retire the bad version when the better one lands.',
  },
];
