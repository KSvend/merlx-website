import { getPayload } from 'payload';
import type { OpticsTool, Page } from '../payload-types';
import config from '../src/payload.config';

interface SeedPage {
  slug: string;
  title: string;
  subtitle?: string;
  body: string;
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
    slug: 'prism',
    name: 'PRISM',
    tagline: 'Predictive crisis-risk maps for fragile contexts.',
    summary:
      'PRISM combines ML forecasting with conflict-systems analysis to score crisis risk down to the H3 hex level, weekly. Used today in the Horn of Africa.',
    description:
      'PRISM (Predictive Risk Intelligence & Simulation Modelling) is an ML platform that produces weekly crisis-risk forecasts at H3 resolution across the Horn of Africa. It integrates ACLED conflict events, IPC food-security phases, climate indicators (CHIRPS rainfall, MODIS vegetation, GloFAS flood), structural features and actor dynamics. Scores are produced at three horizons (1, 3, 6 months) and compared week-over-week to surface escalating cells.',
    status: 'beta',
    externalUrl: 'https://merlx-prism.up.railway.app',
    subdomain: 'prism.merlx.org',
    order: 1,
  },
  {
    slug: 'iris',
    name: 'IRIS',
    tagline: 'Disinformation + hate-speech monitoring across local languages.',
    summary:
      'IRIS scrapes, classifies and visualises disinformation events and hate-speech posts from open social-media sources, with NLP and human-QA pipelines in local languages.',
    description:
      'IRIS pairs an event-extraction pipeline (NLP) with a per-post classifier (ML + LLM QA) for hate-speech monitoring. Output feeds dashboards and weekly reports for early-warning and PVE programmes. Currently deployed against East Africa and Sudan, with localisation in Arabic, Amharic, Somali and Tigrinya.',
    status: 'beta',
    subdomain: 'iris.merlx.org',
    order: 2,
  },
  {
    slug: 'aperture',
    name: 'Aperture',
    tagline: 'Earth-observation indicators for programme MEAL.',
    summary:
      'Aperture turns satellite indicators (NDVI, night-time lights, flood, urban change) into AOI-scoped time-series for evaluators and PVE programmes.',
    description:
      'Aperture lets a non-specialist click an Area of Interest on a map and pull back a time-series of EO indicators — NDVI, night-time lights, flood frequency, urban-change masks. A Claude advisor helps frame interpretation against programme indicators. Built for MEAL teams and humanitarian analysts, deployed on Hugging Face Spaces.',
    status: 'beta',
    subdomain: 'aperture.merlx.org',
    order: 3,
  },
  {
    slug: 'toc-tester',
    name: 'ToC Tester',
    tagline: 'Stress-test theories of change with AI critique.',
    summary:
      'ToC Tester runs your theory of change against a panel of AI critics and historical evaluation data, surfacing likely failure modes before the field tests them for you.',
    description:
      'ToC Tester takes a written theory of change and runs it through a panel of role-played AI critics (donor, beneficiary, evaluator, sceptic) plus a retrieval index of historical evaluations. Output is a structured stress-test report — assumptions to verify, contradictions to resolve, comparable interventions and their outcomes. Designed for proposal-stage MEAL teams.',
    status: 'beta',
    subdomain: 'toctester.merlx.org',
    order: 4,
  },
  {
    slug: 'oasis',
    name: 'OASIS',
    tagline: 'Infrastructure damage + recovery marketplace for Sudan.',
    summary:
      'OASIS maps verified infrastructure damage and connects recovery resources to local actors. First deployment: Sudan, with MERLxLabs as host.',
    description:
      'OASIS combines satellite-derived damage assessment, on-ground verification by Network nodes, and a marketplace for recovery resources (technical assistance, equipment, contractors). Built initially for Sudan post-2023, designed for replication to other recovery contexts. Hosted on MERLxLabs infrastructure.',
    status: 'coming-soon',
    subdomain: 'oasis.merlx.org',
    order: 5,
  },
  {
    slug: 'echo',
    name: 'ECHO',
    tagline: 'Real-time KII assistant for field interviews.',
    summary:
      'ECHO transcribes, translates and structures key-informant interviews live, surfacing follow-up questions and matching against a project knowledge base.',
    description:
      'ECHO is a live KII (Key Informant Interview) assistant — speech-to-text, on-device translation, structured note-capture, and a follow-up-question recommender that compares the live transcript against a project knowledge base. Designed for field researchers conducting interviews in low-bandwidth settings; an online variant for Google Meet / Teams overlays is planned.',
    status: 'coming-soon',
    subdomain: 'echo.merlx.org',
    order: 6,
  },
];

const SEED_PAGES: SeedPage[] = [
  {
    slug: 'about',
    title: 'About MERLx',
    subtitle: 'Two organisations under one roof.',
    body: 'MERLx is two organisations under one roof: an open-tooling tech studio that builds the Optics Suite, and a federation of locally owned MERL cooperatives. The studio builds the tools. The network does the field work.',
    status: 'published',
  },
  {
    slug: 'legal/privacy',
    title: 'Privacy Policy',
    body: 'MERLx collects only the data necessary to operate the website and respond to inquiries. We do not use tracking cookies. Form submissions are stored in our content management system and used solely to route inquiries to the appropriate team. Contact privacy@merlx.org for data subject requests.',
    status: 'published',
  },
  {
    slug: 'legal/terms',
    title: 'Terms of Use',
    body: 'By using merlx.org you agree to these terms. Content on this site is © MERLx unless otherwise noted; redistribution requires attribution. The MERLx Optics Suite tools are governed by their own licenses (linked from each tool page).',
    status: 'published',
  },
  {
    slug: 'legal/cookies',
    title: 'Cookie Policy',
    body: 'merlx.org uses only essential cookies required to operate the admin interface. We do not deploy tracking, analytics, or advertising cookies. Server-side analytics (via Vercel Analytics) operates without identifying individual visitors.',
    status: 'published',
  },
];

const STUDIO_SEED_PAGES: SeedPage[] = [
  {
    slug: 'about',
    title: 'About the Studio',
    subtitle: 'Independent. Conflict-sensitive. Evidence-grade.',
    body: 'MERLx Studio is the engineering arm of MERLx — an independent studio building the Optics Suite, a coordinated set of open analytical tools for monitoring, evaluation, research and early warning in fragile contexts. We pair senior engineering with deep domain knowledge from the MERLx Network. We work openly, document our trade-offs, and retire tools that no longer earn their footprint.',
    status: 'published',
  },
  {
    slug: 'legal/privacy',
    title: 'Studio Privacy Policy',
    body: 'studio.merlx.org collects only the data necessary to operate the website and respond to inquiries. We do not use tracking cookies. Form submissions are stored in our content management system. Tool-specific data handling is documented per tool — see each tool page for its data flow and retention policy. Contact privacy@merlx.org for data subject requests.',
    status: 'published',
  },
  {
    slug: 'legal/terms',
    title: 'Studio Terms of Use',
    body: 'By using studio.merlx.org you agree to these terms. Tool-specific licenses are linked from each tool page; the website itself is © MERLx. Optics Suite tools may be open-source, source-available, or hosted-only depending on the tool — check each tool page for licensing.',
    status: 'published',
  },
];

const NETWORK_SEED_PAGES: SeedPage[] = [
  {
    slug: 'about',
    title: 'About the Network',
    subtitle: 'Federated. Locally owned. Slowly built.',
    body: 'The MERLx Network is a federation of locally owned MERL cooperatives. Each node operates under its own governance, hires locally, and decides locally — sharing methodology, conflict-sensitivity standards, and tooling with the rest of the federation. The Network coordinates; it does not direct. Studio builds the tools; Network nodes do the field work.',
    status: 'published',
  },
  {
    slug: 'legal/privacy',
    title: 'Network Privacy Policy',
    body: 'network.merlx.org collects only the data necessary to operate the website and respond to inquiries. Each individual node operates under its own privacy policy at its own subdomain — those policies govern data collected during fieldwork. Contact privacy@merlx.org for data subject requests at the network coordination level.',
    status: 'published',
  },
  {
    slug: 'legal/terms',
    title: 'Network Terms of Use',
    body: 'By using network.merlx.org you agree to these terms. Network methodology + open methods documents are © MERLx Network with attribution required for redistribution. Per-node terms govern individual engagements.',
    status: 'published',
  },
];

function plainTextToLexical(text: string) {
  return {
    root: {
      type: 'root',
      version: 1,
      format: '',
      indent: 0,
      direction: null,
      children: [
        {
          type: 'paragraph',
          version: 1,
          format: '',
          indent: 0,
          direction: null,
          children: [
            { type: 'text', version: 1, text, format: 0, style: '', mode: 'normal', detail: 0 },
          ],
        },
      ],
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

  console.log('Content seed complete.');
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
