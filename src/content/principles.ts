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
    body: 'Tools, methods and data schemas are open-source unless a partner constraint forces otherwise. When a constraint exists, we name it and document the trade.',
  },
  {
    number: 2,
    title: 'Conflict-sensitive engineering.',
    body: 'Every tool is reviewed for harm pathways before launch: surveillance risk, dual-use, exclusion, escalation. Reviews are documented and re-run when the context shifts.',
  },
  {
    number: 3,
    title: 'Numbers ship with uncertainty.',
    body: 'Confidence intervals on every estimate, sensitivity analysis on every causal claim. Models ship with the evaluation that produced them. Failure modes are written down before the field discovers them.',
  },
  {
    number: 4,
    title: 'Local epistemics.',
    body: 'We work with locally-grounded researchers and Network nodes. Methods that strip context for portability without naming what was lost do not ship.',
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
    body: 'Most analytical tools in this sector are decorative. The bar is evidence that materially shifts a programme decision, not evidence that decorates one already made.',
  },
  {
    number: 2,
    title: 'AI is a tool, not a thesis.',
    body: 'We use machine learning, LLMs and satellite analysis where they earn their place against simpler alternatives. Every "AI-powered" claim has a falsifiable test behind it.',
  },
  {
    number: 3,
    title: 'Cooperative, not centralised.',
    body: 'Tools are open and portable. Expertise is locally held by Network nodes and partner organisations. The Studio builds; the Network deploys.',
  },
  {
    number: 4,
    title: 'Speed and care are not opposites.',
    body: 'A weekly forecast two weeks late is decorative. We ship fast, document the trade, and retire the bad version when the better one lands.',
  },
];
