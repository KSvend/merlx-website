import { getPayload } from 'payload';
import type { Course, InsightsPost, OpticsTool, Page } from '../payload-types';
import config from '../src/payload.config';

interface SeedPage {
  slug: string;
  title: string;
  subtitle?: string;
  /** Single string = one paragraph. Array = multi-paragraph body. */
  body: string | string[];
  status: 'draft' | 'published';
}

interface SeedTool {
  slug: string;
  name: string;
  tagline: string;
  summary: string;
  description: string;
  status: 'live' | 'beta' | 'coming-soon';
  externalUrl?: string;
  subdomain?: string;
  order: number;
}

interface SeedCourse {
  slug: string;
  title: string;
  tagline: string;
  track: 'cooperative-onboarding' | 'continuous-learning' | 'advanced-merl' | 'tool-training';
  audience: Array<'network' | 'enumerators' | 'donors' | 'ingo' | 'studio'>;
  level: 'foundation' | 'intermediate' | 'advanced';
  language: Array<'en' | 'ar' | 'fr' | 'es'>;
  duration: string;
  format: 'self-paced' | 'cohort' | 'workshop' | 'hybrid';
  instructor?: string;
  instructorAffiliation?: string;
  prerequisites?: string[];
  learningOutcomes: string[];
  outline: { title: string; summary?: string; duration?: string }[];
  description: string | string[];
  certifies: boolean;
  requiredForNodeAdmission?: boolean;
  price: {
    model: 'free' | 'free-network' | 'seat' | 'cohort' | 'subscription';
    amount?: string;
    note?: string;
  };
  cohort?: {
    startsOn?: string;
    endsOn?: string;
    enrolmentDeadline?: string;
    cohortSize?: string;
  };
  status: 'open' | 'starting-soon' | 'waitlist' | 'closed' | 'coming-soon';
  order: number;
}

const SEED_TOOLS: SeedTool[] = [
  {
    slug: 'iris',
    name: 'IRIS',
    tagline: 'Information risk intelligence.',
    summary:
      'Automated monitoring and classification of hate speech, disinformation and violent-extremism narratives across social media and online platforms. Analysts get a map-based timeline and a chat assistant for triage.',
    description:
      'IRIS pairs an event-extraction pipeline with per-post classifiers fine-tuned for East African use cases. It runs in Arabic, Somali, English, Swahili, Amharic, Oromo, Tigrinya and Kinyarwanda, with new languages added as Network nodes need them. Inference runs on standard CPU infrastructure; PII redaction is on by default. Output feeds dashboards, weekly reports, and the analyst chat for narrative search and briefing.',
    status: 'beta',
    subdomain: 'iris.merlx.org',
    order: 1,
  },
  {
    slug: 'prism',
    name: 'PRISM',
    tagline: 'Compound risk and forecasting.',
    summary:
      'A compound-risk platform that brings conflict, socioeconomic, environmental, health and coping-capacity data onto a single spatial grid. Forecasts and narrative summaries are generated on top.',
    description:
      'PRISM (Predictive Risk Intelligence and Simulation Modelling) integrates ACLED conflict events, WFP food-price indicators, IPC food-security phases, climate signals (NDVI, evapotranspiration, GloFAS flood), governance indices and an armed-actor ontology. Scores are produced at H3 resolution across multiple horizons and compared week-over-week to surface escalating cells.',
    status: 'beta',
    externalUrl: 'https://merlx-prism.up.railway.app',
    subdomain: 'prism.merlx.org',
    order: 2,
  },
  {
    slug: 'aperture',
    name: 'Aperture',
    tagline: 'Satellite analysis for non-specialists.',
    summary:
      "Satellite analysis for programme teams who don't run a GIS. Click a location, set a date range, and get an environmental and situational read back as a PDF report.",
    description:
      'Aperture lets a non-specialist click an area of interest on a map and pull back a time-series of EO indicators: vegetation (NDVI), surface water (MNDWI), built-up area (NDBI), radar backscatter for all-weather structural change, and active fires from FIRMS / VIIRS. A Claude advisor frames interpretation against programme indicators. Built for MEAL teams and humanitarian analysts.',
    status: 'beta',
    subdomain: 'aperture.merlx.org',
    order: 3,
  },
  {
    slug: 'toc-tester',
    name: 'ToC Tester',
    tagline: 'Theory of change, run as a simulation.',
    summary:
      "A simulation engine and AI critic for Theories of Change. Build a causal map, run scenarios, and get critique anchored in your project's own evidence before the design is locked.",
    description:
      'ToC Tester runs Theories of Change as Fuzzy Cognitive Maps. You build the causal map, clamp an assumption, and watch the impact cascade. The Critical Friend panel generates unintended consequences anchored in a project-specific evidence corpus. Sensitivity analysis covers every causal edge. Workshop-grade UI with auto-layout, undo/redo and a presentation mode.',
    status: 'beta',
    subdomain: 'toctester.merlx.org',
    order: 4,
  },
  {
    slug: 'oasis',
    name: 'OASIS',
    tagline: 'Where to go first, ranked.',
    summary:
      'Geospatial infrastructure for post-conflict recovery planning. OASIS pulls in facility, activity, displacement and response data, scores coverage gaps on a hex grid, and ranks where programme planners should go first.',
    description:
      'OASIS ingests facility, activity, displacement and response data from open humanitarian sources and client feeds, deduplicates facility records across sources, and scores them against configurable need profiles. Distance-decay coverage scoring runs on an H3 hex grid, output as a priority list with admin-level rollups against any country COD-AB boundaries. CSV and GeoJSON export for QGIS, ArcGIS and downstream dashboards.',
    status: 'live',
    subdomain: 'oasis.merlx.org',
    order: 5,
  },
  {
    slug: 'echo',
    name: 'ECHO',
    tagline: 'Offline-first AI for field interviews.',
    summary:
      'An AI assistant that runs entirely on the phone. No cloud call at interview time. Built for Khartoum without power, South Kordofan without 3G, and reception centres where no data can leave the device.',
    description:
      'ECHO is an offline-first key-informant interview assistant. Speech transcription runs on-device in real time. An on-device language model proposes follow-up probes and gap-spotting suggestions during the interview itself. Dynamic form evaluation runs in a built-in expression engine. Pluggable model registry for English and multilingual stacks.',
    status: 'beta',
    subdomain: 'echo.merlx.org',
    order: 6,
  },
];

interface SeedInsight {
  slug: string;
  title: string;
  excerpt: string;
  body: string[];
  category: 'news' | 'analysis' | 'field-note' | 'methods';
  publishedAt: string;
  syndicate?: boolean;
}

const SEED_INSIGHTS: SeedInsight[] = [
  {
    slug: 'the-aid-reset-and-what-it-means-for-merl',
    title: 'The aid reset and what it means for MERL',
    excerpt:
      'Donors are doing less, differently. Budgets are tightening just as climate shocks, protracted crises, and geopolitical fragmentation intensify. Most MERL systems were not built for this.',
    body: [
      'The global aid system is undergoing what senior UN leaders call a "humanitarian reset" — a fundamental reconfiguration in response to shrinking budgets, rising needs, and a crisis of legitimacy and trust. Less money, more crises. No return to the pre-2015 aid model. Pressure to simplify and re-wire delivery chains.',
      'MERL and TPM now face a triple mandate: deliver more, faster; localise leadership and capacity; digitise and de-risk. Yet the business model and institutional incentives around MERL have barely changed. International firms still dominate larger contracts. Local researchers are often engaged at the bottom of the value chain. Tools and datasets remain project-bound and siloed.',
      'This is the space MERLx is designed for: AI-augmented analytical infrastructure that helps teams read context faster and adapt programming earlier, with locally anchored partners at the centre of analysis and interpretation rather than at the bottom of the value chain.',
      'For donor and INGO programme teams, the practical question is no longer "can we add AI to MERL?" — it is "which MERL functions can be re-architected so that signals arrive in time to change the next decision?". That is the bar we hold ourselves to.',
    ],
    category: 'analysis',
    publishedAt: '2026-04-22T00:00:00.000Z',
    syndicate: true,
  },
  {
    slug: 'conflict-sensitive-merl-what-do-no-harm-requires',
    title: 'Conflict-sensitive MERL: what "do no harm" actually requires',
    excerpt:
      'Conflict-sensitivity is a discipline, not a checkbox. A short note on what we actually do at engagement inception and why explainability matters in fragile contexts.',
    body: [
      'Conflict-sensitivity is often invoked and rarely operationalised. In our practice, every engagement starts with a data-protection impact assessment, alignment to IASC operational guidance on data responsibility, and OECD-DAC conflict-sensitivity and Core Humanitarian Standard principles. Informed consent, distress-referral and takedown protocols are documented per deployment.',
      'When AI sits anywhere in the workflow, explainability is not an add-on. Classifier outputs that affect named individuals pass a human-in-the-loop review before release. Narrative reports cite the indicators behind them. Forecasts ship with confidence intervals and the underlying signals they rest on. PII redaction is on by default. Data residency is set by the client, not the vendor.',
      'In fragile contexts the architecture itself has to adapt. ECHO runs entirely on-device with no cloud call at interview time — built for Khartoum without power, South Kordofan without 3G, and reception centres where no data can leave the device. None of this is sufficient on its own. It is the floor we will not drop below, and it is the reason we pass on engagements where the floor would be lower.',
    ],
    category: 'methods',
    publishedAt: '2026-05-04T00:00:00.000Z',
    syndicate: true,
  },
];

const SEED_PAGES: SeedPage[] = [
  {
    slug: 'about',
    title: 'About MERLx',
    subtitle: 'the next-generation MERL practice',
    body: [
      'MERLx is a Spain-based Monitoring, Evaluation, Research & Learning consultancy delivering advanced data science and tech-enabled MERL for global development and humanitarian aid programmes. We combine AI-augmented analytical infrastructure with locally anchored research and conflict-sensitive methodology, working alongside donors, multilaterals, INGOs and implementers across active conflict and fragile-state contexts.',
      'Together with our partners we enable real adaptive programming. Faster context reads. Earlier course corrections. Decisions grounded in local evidence rather than headquarters narrative. Most adaptive-management talk is performative; the bar we hold is whether the next decision actually changes when the signal does.',
      'Localisation is not a translation step at the end. It is built into the language stack, the infrastructure choices, and the governance of every engagement. We design tools so the people closest to the work can run them, and we anchor delivery locally through partners who own the analysis under their own governance, in their own languages.',
      'We work openly, document our trade-offs, and retire tools that no longer earn their footprint. AI augments the analysts, evaluators and programme staff who already do this work. It does not replace their judgement.',
    ],
    status: 'published',
  },
  {
    slug: 'legal/privacy',
    title: 'Privacy Policy',
    body: [
      'MERLx collects only the data necessary to operate the website and respond to enquiries. We do not use tracking cookies. Vercel Analytics provides aggregate page-view counts without identifying individual visitors.',
      'Form submissions are stored in our content management system and used solely to route enquiries to the appropriate team (Studio, Network, or a specific node). We retain enquiry records for 24 months for follow-up purposes, then delete them.',
      'Per-tool data handling is documented on each tool page. Tools deployed for partners run under partner-set data-residency and retention policies, agreed at engagement scoping.',
      'Contact privacy@merlx.org for data-subject requests.',
    ],
    status: 'published',
  },
  {
    slug: 'legal/terms',
    title: 'Terms of Use',
    body: [
      'By using merlx.org you agree to these terms. Content on this site is © MERLx unless otherwise noted; redistribution requires attribution.',
      'Optics Suite tools are governed by their own licences, linked from each tool page. Tools may be open-source, source-available, or hosted-only depending on the tool.',
      'Network methodology documents are © MERLx Network and require attribution on redistribution.',
    ],
    status: 'published',
  },
  {
    slug: 'legal/cookies',
    title: 'Cookie Policy',
    body: [
      'merlx.org uses only essential cookies required to operate the admin interface and remember locale preference. We do not deploy tracking, analytics, or advertising cookies.',
      'Vercel Analytics operates server-side without identifying individual visitors. There is no tracking pixel and no cross-site identifier.',
    ],
    status: 'published',
  },
];

const STUDIO_SEED_PAGES: SeedPage[] = [
  {
    slug: 'about',
    title: 'About the Studio',
    subtitle: 'a partner for tech-enabled global development',
    body: [
      'MERLx is an independent studio building analytical tools and infrastructure for humanitarian, peacebuilding and conflict-prevention organisations. Our work helps teams read context faster, adapt programming earlier, and ground decisions in real evidence. AI augments the analysts, evaluators and programme staff who already do this work. It does not replace their judgement.',
      'We are a technology partner across the full programme cycle: analytical infrastructure, data collection, monitoring, research, evaluation and decision support, instrumented so programme teams can iterate and adapt in real time. The portfolio grows with the work; when a programme or research question needs a bespoke build, we take that on too.',
      'We work openly. Open data standards, open satellite archives, open-source models, standard APIs. Clients own their data and their instance. Nothing in our core stack is licence-locked.',
      'We are conflict-sensitive by default. Every engagement runs a data-protection impact assessment at inception. We align to IASC operational guidance on data responsibility, OECD-DAC conflict-sensitivity, and Core Humanitarian Standard principles. PII redaction is on by default; data residency is set by the client.',
      'Real adaptive programming is the goal. Tools that ship continuously, signals that arrive in time to change the next decision, and findings that name what would change our minds. We retire tools that no longer earn their footprint.',
    ],
    status: 'published',
  },
  {
    slug: 'legal/privacy',
    title: 'Studio Privacy Policy',
    body: [
      'studio.merlx.org collects only the data necessary to operate the website and respond to enquiries. We do not use tracking cookies.',
      'Form submissions are stored in our content management system. Tool-specific data handling is documented per tool. See each tool page for its data flow and retention policy.',
      'For tools deployed for partners, data residency and retention follow the partner contract. PII redaction is on by default across the suite.',
      'Contact privacy@merlx.org for data-subject requests.',
    ],
    status: 'published',
  },
  {
    slug: 'legal/terms',
    title: 'Studio Terms of Use',
    body: [
      'By using studio.merlx.org you agree to these terms. The website itself is © MERLx; tool-specific licences are linked from each tool page.',
      'Optics Suite tools may be open-source, source-available, or hosted-only depending on the tool. Check each tool page for licensing.',
    ],
    status: 'published',
  },
];

const NILEX_SEED_PAGES: SeedPage[] = [
  {
    slug: 'about',
    title: 'About NileX',
    subtitle: 'Sudan-rooted MERL, evidence for the Nile basin',
    body: [
      'NileX is a Sudan-based cooperative of researchers, evaluators and conflict analysts. We design and deliver MERL programmes for humanitarian and development partners across Sudan, South Sudan and the wider Nile basin, under local governance and shared MERLx Network methodology.',
      'NileX is the first MERLx Network node. We share methodology, conflict-sensitivity standards, peer review and the Optics Suite as infrastructure with other cooperatives in the Network. Governance, hiring, pricing and partner choice stay with us.',
      'We work primarily in Arabic, with English and Sudanese local languages on every cycle. Bilingual reporting is standard. KII rotations run with on-device transcription where the field calls for it; classifiers run in Arabic, Somali and the Tigrinya–Amharic–Oromo set across the Horn.',
      'Our practice covers MERL design and delivery, conflict-sensitive evaluation, KII research, OASIS programme implementation, and cross-border field operations across Sudan, South Sudan and Chad. Findings are owned by NileX. The Studio does not interfere.',
    ],
    status: 'published',
  },
];

const LEARN_SEED_PAGES: SeedPage[] = [
  {
    slug: 'about',
    title: 'About MERLx Learn',
    subtitle: 'two tracks, one practice',
    body: [
      'MERLx Learn is the learning side of MERLx. Two tracks share one practice: the cooperative-onboarding track for Network researchers and enumerators, and the advanced-MERL track for donor and INGO programme teams.',
      'Cooperative onboarding is the floor every new Network node clears. Methodology alignment, conflict-sensitivity, KII protocol, ethics, tooling. The same curriculum that lets a new cooperative join the Network as an active node, available to enumerators on every active engagement.',
      'Advanced MERL is for the people who commission and oversee evaluations. Causal inference for small-n contexts, theory-of-change stress-testing, AI-assisted qualitative coding, conflict-sensitive evaluation design. Cohort-based, taught by the people who actually do the work.',
      'Findings, certificates and learner records are governed by the same data-protection standards as the rest of MERLx. PII redaction on by default. Data residency follows the cooperative or partner contract.',
    ],
    status: 'published',
  },
  {
    slug: 'legal/privacy',
    title: 'Learn Privacy Policy',
    body: [
      'learn.merlx.org collects only the data necessary to operate the catalogue and respond to enrolment enquiries. Course progress and completion records, when an LMS is wired, are stored under the same data-protection standards as the rest of MERLx.',
      'Learner records can be exported on request. Contact privacy@merlx.org for data-subject requests.',
    ],
    status: 'published',
  },
  {
    slug: 'legal/terms',
    title: 'Learn Terms of Use',
    body: [
      'By enrolling on a MERLx Learn course you agree to the course-specific terms shown at enrolment. Course materials are © MERLx unless otherwise noted; redistribution requires attribution and is restricted for paid courses.',
      'Certificates are issued at MERLx discretion against the published completion criteria. Cooperative-onboarding certificates are recognised for Network admission.',
    ],
    status: 'published',
  },
];

const SEED_COURSES: SeedCourse[] = [
  // Cooperative onboarding track — required floor for new Network nodes.
  {
    slug: 'merl-foundations',
    title: 'MERL foundations for cooperative practice',
    tagline:
      'The methodological floor every new Network node and enumerator clears before fieldwork.',
    track: 'cooperative-onboarding',
    audience: ['network', 'enumerators'],
    level: 'foundation',
    language: ['en', 'ar'],
    duration: '12 hours self-paced',
    format: 'self-paced',
    prerequisites: [],
    learningOutcomes: [
      'State the four MERLx commitments and what they mean operationally.',
      'Distinguish monitoring, evaluation, research and learning, and pick the right method for the question.',
      'Run a basic theory-of-change exercise with a programme team.',
      'Write findings that pass cross-node peer review.',
    ],
    outline: [
      { title: 'What we mean by MERL', summary: 'Definitions, why each side of MERL matters, where the field gets it wrong.', duration: '90 min' },
      { title: 'The four commitments', summary: 'Field first, evidence over abstraction, open and interoperable, responsible by default.', duration: '2 hr' },
      { title: 'Theory of Change in practice', summary: 'How to run a ToC workshop. Common failure modes.', duration: '2 hr' },
      { title: 'Indicators that earn their place', summary: 'When to add an indicator, when to retire one, what auditable outputs look like.', duration: '90 min' },
      { title: 'Findings that survive peer review', summary: 'Writing for cross-node review. Confidence intervals, sensitivity analysis, naming what would change your mind.', duration: '2 hr' },
      { title: 'Capstone: peer review of a real engagement brief', duration: '2 hr' },
    ],
    description: [
      'A foundational course for new Network researchers and enumerators. Required reading before joining an active engagement.',
      'Self-paced and bilingual. The capstone is a peer-reviewed write-up of a real (anonymised) engagement brief from a Network node.',
    ],
    certifies: true,
    requiredForNodeAdmission: true,
    price: { model: 'free-network', amount: 'Free for Network nodes', note: 'Available to non-Network learners on request.' },
    status: 'open',
    order: 1,
  },
  {
    slug: 'conflict-sensitivity',
    title: 'Conflict sensitivity for evaluators',
    tagline: 'Harm-pathway thinking, do-no-harm protocols, dual-use review.',
    track: 'cooperative-onboarding',
    audience: ['network', 'ingo'],
    level: 'foundation',
    language: ['en', 'ar', 'fr'],
    duration: '6 hours self-paced',
    format: 'self-paced',
    learningOutcomes: [
      'Run a harm-pathway review on a proposed evaluation design.',
      'Identify dual-use risk in data-collection instruments.',
      'Document do-no-harm decisions in a way that survives a partner audit.',
    ],
    outline: [
      { title: 'Why conflict sensitivity is structural, not a checkbox', duration: '60 min' },
      { title: 'Harm pathways: surveillance, escalation, exclusion, dual use', duration: '2 hr' },
      { title: 'OECD-DAC conflict-sensitivity in practice', duration: '90 min' },
      { title: 'Documentation standard: what to write down, when to re-run', duration: '90 min' },
    ],
    description:
      'Built around real cases from Network engagements. Two of the case studies are from contexts where the evaluation itself almost did harm; we walk through what the team did and what we would do differently.',
    certifies: true,
    requiredForNodeAdmission: true,
    price: { model: 'free-network', amount: 'Free for Network nodes' },
    status: 'open',
    order: 2,
  },
  {
    slug: 'kii-protocol',
    title: 'KII protocol and field ethics',
    tagline:
      'Running key-informant interviews to a standard that survives editorial review and ethics approval.',
    track: 'cooperative-onboarding',
    audience: ['enumerators', 'network'],
    level: 'foundation',
    language: ['en', 'ar'],
    duration: '8 hours self-paced + 1 facilitator session',
    format: 'hybrid',
    learningOutcomes: [
      'Design a KII guide that produces analysable transcripts.',
      'Run an interview that respects informed consent and distress-referral.',
      'Use ECHO on-device for live transcription and follow-up probes.',
      'Anonymise transcripts to a standard that passes IRB review.',
    ],
    outline: [
      { title: 'What a KII is, and what it is not', duration: '60 min' },
      { title: 'Designing the KII guide', duration: '2 hr' },
      { title: 'Informed consent in protracted-displacement settings', duration: '90 min' },
      { title: 'On-device transcription with ECHO', duration: '2 hr' },
      { title: 'Anonymisation and ethics review', duration: '90 min' },
      { title: 'Live practice session with a facilitator', duration: '90 min' },
    ],
    description:
      'Practical course built for enumerators rotating into KII work. The hybrid format pairs self-paced modules with a single live facilitator session per cohort.',
    certifies: true,
    requiredForNodeAdmission: true,
    price: { model: 'free-network', amount: 'Free for Network nodes' },
    status: 'open',
    order: 3,
  },
  // Tool training track
  {
    slug: 'prism-operator',
    title: 'PRISM operator certification',
    tagline: 'Run PRISM analyses, interpret forecasts, brief partners.',
    track: 'tool-training',
    audience: ['network', 'studio'],
    level: 'intermediate',
    language: ['en'],
    duration: '8 hours self-paced',
    format: 'self-paced',
    prerequisites: ['MERL foundations or equivalent.'],
    learningOutcomes: [
      'Configure a PRISM analysis for a new geography.',
      'Read a compound-risk forecast against a baseline and explain the dimensional contributions.',
      'Brief a partner on what the forecast does and does not say.',
    ],
    outline: [
      { title: 'What PRISM is and what it is not', duration: '45 min' },
      { title: 'The five dimensions', summary: 'Conflict, socioeconomic, environmental, health, coping capacity.', duration: '2 hr' },
      { title: 'Reading the spatial grid', duration: '90 min' },
      { title: 'Forecast horizon and uncertainty', duration: '90 min' },
      { title: 'Briefing partners', duration: '90 min' },
    ],
    description:
      'Required for Network analysts running PRISM in production. Covers configuration, interpretation and the limits of the forecasts.',
    certifies: true,
    price: { model: 'free-network', amount: 'Free for Network nodes' },
    status: 'open',
    order: 10,
  },
  {
    slug: 'iris-classifier-tuning',
    title: 'IRIS classifier tuning for new languages',
    tagline:
      'How to extend IRIS classifiers to a new language without dropping precision on the existing set.',
    track: 'tool-training',
    audience: ['network', 'studio'],
    level: 'advanced',
    language: ['en'],
    duration: '6 weeks cohort',
    format: 'cohort',
    prerequisites: ['Working Python. Familiarity with HuggingFace Transformers.'],
    learningOutcomes: [
      'Set up an annotation pipeline for a new language.',
      'Fine-tune XLM-RoBERTa against the new dataset.',
      'Audit the classifier for harm pathways and bias.',
      'Ship the classifier into a production IRIS instance.',
    ],
    outline: [
      { title: 'Annotation protocol', duration: 'Week 1' },
      { title: 'Dataset curation', duration: 'Week 2' },
      { title: 'Fine-tuning XLM-RoBERTa', duration: 'Week 3' },
      { title: 'Evaluation and bias audit', duration: 'Week 4' },
      { title: 'Production deployment', duration: 'Week 5' },
      { title: 'Capstone review', duration: 'Week 6' },
    ],
    description:
      'Cohort-based deep-dive for senior engineers and analysts. Limited to two cohorts per year.',
    certifies: true,
    price: { model: 'cohort', amount: 'Free first cohort, €1,800 thereafter', note: 'Subsidised seats for Network nodes.' },
    cohort: { startsOn: '13 Oct 2026', endsOn: '24 Nov 2026', enrolmentDeadline: '06 Oct 2026', cohortSize: '12 participants' },
    status: 'starting-soon',
    order: 11,
  },
  // Advanced MERL — donors and INGOs
  {
    slug: 'causal-inference-small-n',
    title: 'Causal inference in small-n humanitarian contexts',
    tagline:
      'When randomisation is impossible and the n is in the dozens, what does credible attribution look like?',
    track: 'advanced-merl',
    audience: ['donors', 'ingo'],
    level: 'advanced',
    language: ['en'],
    duration: '8 weeks cohort',
    format: 'cohort',
    instructor: 'Senior MERL methodologist',
    prerequisites: ['Working knowledge of impact evaluation. Comfort reading regression output.'],
    learningOutcomes: [
      'Pick the right quasi-experimental design for a small-n context.',
      'Run a synthetic-control evaluation end-to-end.',
      'Critique a causal claim under cross-examination.',
      'Document a causal evaluation so a sceptical reviewer can audit it.',
    ],
    outline: [
      { title: 'Why classical RCTs do not transfer', duration: 'Week 1' },
      { title: 'Difference-in-differences in fragile contexts', duration: 'Week 2' },
      { title: 'Synthetic-control methods', duration: 'Week 3' },
      { title: 'Regression-discontinuity when the cutoff is fuzzy', duration: 'Week 4' },
      { title: 'Bayesian inference with informative priors', duration: 'Week 5' },
      { title: 'Realist evaluation and mechanism-based claims', duration: 'Week 6' },
      { title: 'Writing causal findings for a sceptical reader', duration: 'Week 7' },
      { title: 'Capstone: peer-reviewed mini-evaluation', duration: 'Week 8' },
    ],
    description: [
      'Cohort-based course for senior MEAL leads, evaluation commissioners, and donor MERL staff. Two cohorts per year.',
      'The capstone is a peer-reviewed mini-evaluation against a real (anonymised) programme dataset. Capstones from previous cohorts have been published as Network methodology notes with author consent.',
    ],
    certifies: true,
    price: { model: 'cohort', amount: 'Free first cohort, €2,400 thereafter', note: 'Two subsidised seats per cohort for low-resource partners.' },
    cohort: { startsOn: '03 Nov 2026', endsOn: '22 Dec 2026', enrolmentDeadline: '20 Oct 2026', cohortSize: '16 participants' },
    status: 'starting-soon',
    order: 20,
  },
  {
    slug: 'toc-stress-testing',
    title: 'Theory of change, run as a simulation',
    tagline:
      'Stop drawing static ToC diagrams. Run them as Fuzzy Cognitive Maps and see how the impact actually cascades.',
    track: 'advanced-merl',
    audience: ['donors', 'ingo', 'network'],
    level: 'intermediate',
    language: ['en'],
    duration: '4 hours workshop',
    format: 'workshop',
    learningOutcomes: [
      'Build a causal map of a programme theory of change.',
      'Clamp an assumption and see how the impact cascades.',
      'Generate unintended consequences with the Critical Friend AI panel.',
      'Document sensitivity analysis so the design review survives a sceptic.',
    ],
    outline: [
      { title: 'Why static ToCs fail', duration: '30 min' },
      { title: 'Building the FCM', duration: '90 min' },
      { title: 'Running scenarios', duration: '60 min' },
      { title: 'Critical Friend critique', duration: '60 min' },
    ],
    description:
      'A four-hour facilitated workshop that uses ToC Tester to stress-test your real programme design. Brings ToC Tester into the workshop, not as a demo.',
    certifies: false,
    price: { model: 'cohort', amount: '€450 per seat', note: 'Free for Network nodes. Discounts for organisations sending three or more.' },
    status: 'open',
    order: 21,
  },
  {
    slug: 'ai-assisted-qual-coding',
    title: 'AI-assisted qualitative coding without losing your method',
    tagline:
      'How to use LLMs in qualitative coding without losing methodological rigour or auditability.',
    track: 'advanced-merl',
    audience: ['donors', 'ingo', 'network'],
    level: 'intermediate',
    language: ['en'],
    duration: '6 hours self-paced',
    format: 'self-paced',
    learningOutcomes: [
      'Pick where AI helps in a qualitative coding pipeline and where it harms.',
      'Set up a coding protocol that uses LLM suggestions without anchoring the human coder.',
      'Audit AI-coded transcripts to a standard that passes peer review.',
    ],
    outline: [
      { title: 'What LLMs are good at, what they are not', duration: '60 min' },
      { title: 'Two-pass coding: human first, LLM critic', duration: '2 hr' },
      { title: 'Audit standards for AI-assisted coding', duration: '90 min' },
      { title: 'Worked example: ECHO transcripts to coded themes', duration: '90 min' },
    ],
    description:
      'Practical course on using LLMs as critics in qualitative coding without losing methodological rigour. Worked through real ECHO transcripts.',
    certifies: true,
    price: { model: 'seat', amount: '€220', note: 'Free for Network nodes.' },
    status: 'open',
    order: 22,
  },
];

const NETWORK_SEED_PAGES: SeedPage[] = [
  {
    slug: 'about',
    title: 'About the Network',
    subtitle: 'cooperative, not franchised',
    body: [
      'The MERLx Network is a cooperative of locally owned MERL practices. Each node operates under its own governance, hires locally, and decides locally. Nodes share methodology, conflict-sensitivity standards, peer review and tooling with the rest of the cooperative. The Network coordinates; it does not direct.',
      'The Studio builds the Optics Suite. The Network does the field work — research, evaluation, third-party monitoring, KII rotations, and analysis under shared methodology. Together we enable real adaptive programming, with the practice running where the programme runs.',
      'Localisation is the structural commitment. Multilingual classifiers in IRIS, on-device transcription in ECHO, Arabic and Sudanese local languages on every NileX cycle, French and Wolof rotations across the Sahel. Country teams own analytical findings. Headquarters does not rewrite them.',
      'Onboarding is a six-month process: methodology alignment, peer review, tooling integration, then a first joint engagement. We grow by invitation, not application. New nodes join when there is partner demand and a cooperative we trust to do the work.',
    ],
    status: 'published',
  },
  {
    slug: 'legal/privacy',
    title: 'Network Privacy Policy',
    body: [
      'network.merlx.org collects only the data necessary to operate the website and respond to enquiries. Each individual node operates under its own privacy policy at its own subdomain. Those policies govern data collected during fieldwork.',
      'Contact privacy@merlx.org for data-subject requests at the Network coordination level. For per-node fieldwork data, contact the node directly.',
    ],
    status: 'published',
  },
  {
    slug: 'legal/terms',
    title: 'Network Terms of Use',
    body: [
      'By using network.merlx.org you agree to these terms. Network methodology and open-methods documents are © MERLx Network. Redistribution requires attribution.',
      'Per-node engagement terms govern individual contracts. Contact the node directly for those terms.',
    ],
    status: 'published',
  },
];

function plainTextToLexical(text: string | string[]) {
  const paragraphs = Array.isArray(text) ? text : [text];
  return {
    root: {
      type: 'root',
      version: 1,
      format: '',
      indent: 0,
      direction: null,
      children: paragraphs.map((p) => ({
        type: 'paragraph',
        version: 1,
        format: '',
        indent: 0,
        direction: null,
        children: [
          { type: 'text', version: 1, text: p, format: 0, style: '', mode: 'normal', detail: 0 },
        ],
      })),
    },
  };
}

async function seed() {
  const payload = await getPayload({ config });

  const groupTenant = await payload.find({
    collection: 'tenants',
    where: { domain: { equals: 'merlx.org' } },
    limit: 1,
  });
  if (groupTenant.docs.length === 0) {
    console.error('Group tenant not found. Run `bun run seed` first to seed tenants.');
    process.exit(1);
  }
  const tenantId = groupTenant.docs[0]!.id;

  for (const page of SEED_PAGES) {
    const existing = await payload.find({
      collection: 'pages',
      where: { and: [{ slug: { equals: page.slug } }, { tenant: { equals: tenantId } }] },
      limit: 1,
    });

    if (existing.docs.length > 0) {
      console.log(`  - skip: pages/${page.slug} already exists`);
      continue;
    }

    await payload.create({
      collection: 'pages',
      data: {
        slug: page.slug,
        title: page.title,
        subtitle: page.subtitle,
        body: plainTextToLexical(page.body),
        status: page.status,
        tenant: tenantId,
      } as Omit<Page, 'id' | 'createdAt' | 'updatedAt'>,
    });
    console.log(`  + seeded: pages/${page.slug}`);
  }

  for (const post of SEED_INSIGHTS) {
    const existing = await payload.find({
      collection: 'insights-posts',
      where: { and: [{ slug: { equals: post.slug } }, { tenant: { equals: tenantId } }] },
      limit: 1,
    });

    if (existing.docs.length > 0) {
      console.log(`  - skip: insights-posts/${post.slug} already exists`);
      continue;
    }

    await payload.create({
      collection: 'insights-posts',
      data: {
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        body: plainTextToLexical(post.body),
        category: post.category,
        publishedAt: post.publishedAt,
        syndicate: post.syndicate ?? false,
        status: 'published',
        tenant: tenantId,
      } as Omit<InsightsPost, 'id' | 'createdAt' | 'updatedAt'>,
    });
    console.log(`  + seeded: insights-posts/${post.slug}`);
  }

  // Seed studio content under the studio tenant
  const studioTenant = await payload.find({
    collection: 'tenants',
    where: { type: { equals: 'studio' } },
    limit: 1,
  });
  if (studioTenant.docs.length === 0) {
    console.warn('Studio tenant not found — skipping studio content seed.');
  } else {
    const studioId = studioTenant.docs[0]!.id;

    for (const page of STUDIO_SEED_PAGES) {
      const existing = await payload.find({
        collection: 'pages',
        where: { and: [{ slug: { equals: page.slug } }, { tenant: { equals: studioId } }] },
        limit: 1,
      });
      if (existing.docs.length > 0) {
        console.log(`  - skip: studio/pages/${page.slug} already exists`);
        continue;
      }
      await payload.create({
        collection: 'pages',
        data: {
          slug: page.slug,
          title: page.title,
          subtitle: page.subtitle,
          body: plainTextToLexical(page.body),
          status: page.status,
          tenant: studioId,
        } as Omit<Page, 'id' | 'createdAt' | 'updatedAt'>,
      });
      console.log(`  + seeded: studio/pages/${page.slug}`);
    }

    for (const tool of SEED_TOOLS) {
      const existing = await payload.find({
        collection: 'optics-tools',
        where: { and: [{ slug: { equals: tool.slug } }, { tenant: { equals: studioId } }] },
        limit: 1,
      });
      if (existing.docs.length > 0) {
        console.log(`  - skip: optics-tools/${tool.slug} already exists`);
        continue;
      }
      await payload.create({
        collection: 'optics-tools',
        data: {
          slug: tool.slug,
          name: tool.name,
          tagline: tool.tagline,
          summary: plainTextToLexical(tool.summary),
          description: plainTextToLexical(tool.description),
          status: tool.status,
          externalUrl: tool.externalUrl,
          subdomain: tool.subdomain,
          order: tool.order,
          tenant: studioId,
        } as Omit<OpticsTool, 'id' | 'createdAt' | 'updatedAt'>,
      });
      console.log(`  + seeded: optics-tools/${tool.slug}`);
    }
  }

  // Seed network content under the network tenant
  const networkTenant = await payload.find({
    collection: 'tenants',
    where: { type: { equals: 'network' } },
    limit: 1,
  });
  if (networkTenant.docs.length === 0) {
    console.warn('Network tenant not found — skipping network content seed.');
  } else {
    const networkId = networkTenant.docs[0]!.id;
    for (const page of NETWORK_SEED_PAGES) {
      const existing = await payload.find({
        collection: 'pages',
        where: { and: [{ slug: { equals: page.slug } }, { tenant: { equals: networkId } }] },
        limit: 1,
      });
      if (existing.docs.length > 0) {
        console.log(`  - skip: network/pages/${page.slug} already exists`);
        continue;
      }
      await payload.create({
        collection: 'pages',
        data: {
          slug: page.slug,
          title: page.title,
          subtitle: page.subtitle,
          body: plainTextToLexical(page.body),
          status: page.status,
          tenant: networkId,
        } as Omit<Page, 'id' | 'createdAt' | 'updatedAt'>,
      });
      console.log(`  + seeded: network/pages/${page.slug}`);
    }
  }

  // Seed nilex content under the nilex node tenant
  const nilexTenant = await payload.find({
    collection: 'tenants',
    where: { domain: { equals: 'nilex.merlx.org' } },
    limit: 1,
  });
  if (nilexTenant.docs.length === 0) {
    console.warn('NileX tenant not found — skipping nilex content seed.');
  } else {
    const nilexId = nilexTenant.docs[0]!.id;
    for (const page of NILEX_SEED_PAGES) {
      const existing = await payload.find({
        collection: 'pages',
        where: { and: [{ slug: { equals: page.slug } }, { tenant: { equals: nilexId } }] },
        limit: 1,
      });
      if (existing.docs.length > 0) {
        console.log(`  - skip: nilex/pages/${page.slug} already exists`);
        continue;
      }
      await payload.create({
        collection: 'pages',
        data: {
          slug: page.slug,
          title: page.title,
          subtitle: page.subtitle,
          body: plainTextToLexical(page.body),
          status: page.status,
          tenant: nilexId,
        } as Omit<Page, 'id' | 'createdAt' | 'updatedAt'>,
      });
      console.log(`  + seeded: nilex/pages/${page.slug}`);
    }
  }

  // Seed learn content + courses under the learn tenant
  const learnTenant = await payload.find({
    collection: 'tenants',
    where: { type: { equals: 'learn' } },
    limit: 1,
  });
  if (learnTenant.docs.length === 0) {
    console.warn('Learn tenant not found — skipping learn content seed.');
  } else {
    const learnId = learnTenant.docs[0]!.id;
    for (const page of LEARN_SEED_PAGES) {
      const existing = await payload.find({
        collection: 'pages',
        where: { and: [{ slug: { equals: page.slug } }, { tenant: { equals: learnId } }] },
        limit: 1,
      });
      if (existing.docs.length > 0) {
        console.log(`  - skip: learn/pages/${page.slug} already exists`);
        continue;
      }
      await payload.create({
        collection: 'pages',
        data: {
          slug: page.slug,
          title: page.title,
          subtitle: page.subtitle,
          body: plainTextToLexical(page.body),
          status: page.status,
          tenant: learnId,
        } as Omit<Page, 'id' | 'createdAt' | 'updatedAt'>,
      });
      console.log(`  + seeded: learn/pages/${page.slug}`);
    }

    for (const course of SEED_COURSES) {
      const existing = await payload.find({
        collection: 'courses',
        where: { and: [{ slug: { equals: course.slug } }, { tenant: { equals: learnId } }] },
        limit: 1,
      });
      if (existing.docs.length > 0) {
        console.log(`  - skip: courses/${course.slug} already exists`);
        continue;
      }
      await payload.create({
        collection: 'courses',
        data: {
          slug: course.slug,
          title: course.title,
          tagline: course.tagline,
          track: course.track,
          audience: course.audience,
          level: course.level,
          language: course.language,
          duration: course.duration,
          format: course.format,
          instructor: course.instructor,
          instructorAffiliation: course.instructorAffiliation,
          prerequisites: (course.prerequisites ?? []).map((item) => ({ item })),
          learningOutcomes: course.learningOutcomes.map((outcome) => ({ outcome })),
          outline: course.outline,
          description: plainTextToLexical(course.description),
          certifies: course.certifies,
          requiredForNodeAdmission: course.requiredForNodeAdmission ?? false,
          price: course.price,
          cohort: course.cohort,
          status: course.status,
          order: course.order,
          tenant: learnId,
        } as Omit<Course, 'id' | 'createdAt' | 'updatedAt'>,
      });
      console.log(`  + seeded: courses/${course.slug}`);
    }
  }

  console.log('Content seed complete.');
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
