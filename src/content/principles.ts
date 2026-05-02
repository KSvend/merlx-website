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
    title: 'Open by default.',
    body: 'Tools, methods, and data schemas are open-source unless a partner constraint forces otherwise. When constraints exist, we name them and document the trade.',
  },
  {
    number: 2,
    title: 'Conflict-sensitive engineering.',
    body: 'Every tool is reviewed for harm pathways before launch — surveillance risk, dual-use, exclusion, escalation. Reviews are documented and re-run when context shifts.',
  },
  {
    number: 3,
    title: 'Evidence-grade outputs.',
    body: 'Numbers ship with their uncertainty. Models ship with their evaluation. Failure modes are written down before someone has to discover them in the field.',
  },
  {
    number: 4,
    title: 'Local epistemics.',
    body: 'We work with locally-grounded researchers and federated nodes. Methods that strip context for portability — without naming what was lost — do not ship.',
  },
  {
    number: 5,
    title: 'Honest limits.',
    body: 'We say no to projects we cannot do well. We say when a tool does not fit a context. We retire tools that no longer earn their footprint.',
  },
];

/**
 * Studio product beliefs — how we think about the work.
 */
export const BELIEFS: Principle[] = [
  {
    number: 1,
    title: 'Better evidence wins better arguments.',
    body: 'Most analytical tools in this sector are decorative. The bar is to produce evidence that materially shifts a programme decision — not evidence that decorates one already made.',
  },
  {
    number: 2,
    title: 'AI is a tool, not a thesis.',
    body: 'We use machine learning, LLMs, and satellite analysis where they earn their place against simpler alternatives. Every "AI-powered" claim has a falsifiable test behind it.',
  },
  {
    number: 3,
    title: 'Federated, not centralised.',
    body: 'The tools are open and portable. The expertise is locally held by Network nodes and partner organisations. The Studio builds; the Network deploys.',
  },
  {
    number: 4,
    title: 'Speed and care are not opposites.',
    body: 'A weekly forecast that is two weeks late is decorative. We ship fast, document the trade, and retire the bad version when the better one lands.',
  },
];
