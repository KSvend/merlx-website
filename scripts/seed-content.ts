import { getPayload } from 'payload';
import type { Page } from '../payload-types';
import config from '../src/payload.config';

interface SeedPage {
  slug: string;
  title: string;
  subtitle?: string;
  body: string;
  status: 'draft' | 'published';
}

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

  console.log('Content seed complete.');
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
