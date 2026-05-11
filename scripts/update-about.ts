/**
 * One-off: refresh the group About page subtitle + body in the current
 * database to match the latest copy in seed-content.ts.
 *
 * The main seed script skips pages that already exist (idempotent
 * create-only), so once an old "Two organisations under one roof"
 * version was seeded it stays put. This script finds the about page
 * for the group tenant and overwrites subtitle + body.
 *
 * Run with:
 *   bun run --env-file=.env.local scripts/update-about.ts
 */

import config from '@/payload.config';
import { getPayload } from 'payload';

function plainTextToLexical(paragraphs: string[]): unknown {
  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      direction: 'ltr',
      children: paragraphs.map((p) => ({
        type: 'paragraph',
        format: '',
        indent: 0,
        version: 1,
        direction: 'ltr',
        textFormat: 0,
        children: [
          {
            type: 'text',
            format: 0,
            style: '',
            text: p,
            mode: 'normal',
            detail: 0,
            version: 1,
          },
        ],
      })),
    },
  };
}

const NEW_SUBTITLE = 'the next-generation MERL practice';
const NEW_BODY = [
  'MERLx is a Spain-based Monitoring, Evaluation, Research & Learning consultancy delivering advanced data science and tech-enabled MERL for global development and humanitarian aid programmes. We combine AI-augmented analytical infrastructure with locally anchored research and conflict-sensitive methodology, working alongside donors, multilaterals, INGOs and implementers across active conflict and fragile-state contexts.',
  'Together with our partners we enable real adaptive programming. Faster context reads. Earlier course corrections. Decisions grounded in local evidence rather than headquarters narrative. Most adaptive-management talk is performative; the bar we hold is whether the next decision actually changes when the signal does.',
  'Localisation is not a translation step at the end. It is built into the language stack, the infrastructure choices, and the governance of every engagement. We design tools so the people closest to the work can run them, and we anchor delivery locally through partners who own the analysis under their own governance, in their own languages.',
  'We work openly, document our trade-offs, and retire tools that no longer earn their footprint. AI augments the analysts, evaluators and programme staff who already do this work. It does not replace their judgement.',
];

async function main() {
  const payload = await getPayload({ config });

  const groupTenant = await payload.find({
    collection: 'tenants',
    where: { domain: { equals: 'merlx.org' } },
    limit: 1,
  });
  if (groupTenant.docs.length === 0) {
    console.error('Group tenant not found.');
    process.exit(1);
  }
  const tenantId = groupTenant.docs[0]!.id;

  const aboutPage = await payload.find({
    collection: 'pages',
    where: { and: [{ slug: { equals: 'about' } }, { tenant: { equals: tenantId } }] },
    limit: 1,
  });
  if (aboutPage.docs.length === 0) {
    console.error('About page not found for group tenant. Run seed:content first.');
    process.exit(1);
  }

  const id = aboutPage.docs[0]!.id;
  await payload.update({
    collection: 'pages',
    id,
    data: {
      subtitle: NEW_SUBTITLE,
      // biome-ignore lint/suspicious/noExplicitAny: Lexical shape isn't typed here
      body: plainTextToLexical(NEW_BODY) as any,
    },
  });

  console.log(`Updated about page (id=${id}) subtitle + body.`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
