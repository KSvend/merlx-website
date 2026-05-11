/**
 * One-off: push capabilities + builtOn arrays into the optics-tools
 * Payload collection for the six tools. The main seed script is
 * create-only, so these fields stay null on already-seeded rows.
 *
 * Once this runs, /optics/[slug] can read capabilities + builtOn from
 * Payload (CMS-editable) instead of from the TS file fallback.
 *
 * Run with:
 *   bun run --env-file=.env.local scripts/update-optics-fields.ts
 */

import { OPTICS_TOOL_PROFILES } from '@/content/optics-tool-profiles';
import config from '@/payload.config';
import { getPayload } from 'payload';

async function main() {
  const payload = await getPayload({ config });

  const studioTenant = await payload.find({
    collection: 'tenants',
    where: { type: { equals: 'studio' } },
    limit: 1,
  });
  if (studioTenant.docs.length === 0) {
    console.error('Studio tenant not found.');
    process.exit(1);
  }
  const tenantId = studioTenant.docs[0]!.id;

  for (const profile of Object.values(OPTICS_TOOL_PROFILES)) {
    const existing = await payload.find({
      collection: 'optics-tools',
      where: { and: [{ slug: { equals: profile.slug } }, { tenant: { equals: tenantId } }] },
      limit: 1,
    });

    if (existing.docs.length === 0) {
      console.warn(`  - skip: optics-tools/${profile.slug} not in DB`);
      continue;
    }

    const id = existing.docs[0]!.id;
    await payload.update({
      collection: 'optics-tools',
      id,
      data: {
        capabilities: profile.capabilities.map((item) => ({ item })),
        builtOn: profile.builtOn.map((item) => ({ item })),
      },
    });

    console.log(
      `  + updated: optics-tools/${profile.slug} (${profile.capabilities.length} caps, ${profile.builtOn.length} built-on)`,
    );
  }

  console.log('Optics fields update complete.');
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
