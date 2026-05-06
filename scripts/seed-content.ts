import { getPayload } from 'payload';
import type { OpticsTool, Page } from '../payload-types';
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

const SEED_PAGES: SeedPage[] = [
  {
    slug: 'about',
    title: 'About MERLx',
    subtitle: 'two entities, one practice',
    body: [
      'MERLx is two entities under one roof. The Studio is an independent technology studio building analytical tools and infrastructure for humanitarian, peacebuilding and conflict-prevention organisations. The Network is a cooperative of locally owned MERL practices that runs those tools, and traditional MERL, in country.',
      'Together we enable real adaptive programming. Faster context reads. Earlier course corrections. Decisions grounded in local evidence rather than headquarters narrative. Most adaptive-management talk is performative; the bar we hold is whether the next decision actually changes when the signal does.',
      'Localisation is not a translation step at the end. It is built into the language stack, the infrastructure choices, and the governance of every engagement. The Studio designs tools so the people closest to the work can run them. The Network nodes do that work, under their own governance, in their own languages.',
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

  console.log('Content seed complete.');
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
