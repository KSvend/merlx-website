import { getPayload } from 'payload';
import config from '../src/payload.config';

const SEED_TENANTS = [
  {
    domain: 'merlx.org',
    displayName: 'MERLx (Group)',
    type: 'group' as const,
    status: 'pre-launch' as const,
    primaryLocale: 'en' as const,
    supportedLocales: ['en', 'ar', 'fr'] as Array<'en' | 'ar' | 'fr'>,
    accentColor: 'teal' as const,
    hasInsights: true,
    blobBucketPrefix: 'merlx-blob/group',
  },
  {
    domain: 'studio.merlx.org',
    displayName: 'MERLx Studio',
    type: 'studio' as const,
    status: 'pre-launch' as const,
    primaryLocale: 'en' as const,
    supportedLocales: ['en', 'ar', 'fr'] as Array<'en' | 'ar' | 'fr'>,
    accentColor: 'orange' as const,
    hasInsights: true,
    blobBucketPrefix: 'merlx-blob/studio',
  },
  {
    domain: 'network.merlx.org',
    displayName: 'MERLx Network',
    type: 'network' as const,
    status: 'pre-launch' as const,
    primaryLocale: 'en' as const,
    supportedLocales: ['en', 'ar', 'fr'] as Array<'en' | 'ar' | 'fr'>,
    accentColor: 'teal' as const,
    hasInsights: true,
    blobBucketPrefix: 'merlx-blob/network',
  },
  {
    domain: 'nilex.merlx.org',
    displayName: 'NileX',
    type: 'node' as const,
    status: 'pre-launch' as const,
    primaryLocale: 'ar' as const,
    supportedLocales: ['ar', 'en'] as Array<'en' | 'ar' | 'fr'>,
    accentColor: 'teal' as const,
    hasInsights: true,
    blobBucketPrefix: 'merlx-blob/nilex',
  },
  {
    domain: 'learn.merlx.org',
    displayName: 'MERLx Learn',
    type: 'learn' as const,
    status: 'pre-launch' as const,
    primaryLocale: 'en' as const,
    supportedLocales: ['en', 'ar', 'fr'] as Array<'en' | 'ar' | 'fr'>,
    accentColor: 'deep-teal' as const,
    hasInsights: false,
    blobBucketPrefix: 'merlx-blob/learn',
  },
];

async function seed() {
  const payload = await getPayload({ config });

  for (const tenant of SEED_TENANTS) {
    const existing = await payload.find({
      collection: 'tenants',
      where: { domain: { equals: tenant.domain } },
      limit: 1,
    });

    if (existing.docs.length > 0) {
      console.log(`  - skip: ${tenant.domain} already exists`);
      continue;
    }

    await payload.create({ collection: 'tenants', data: tenant });
    console.log(`  + seeded: ${tenant.domain}`);
  }

  console.log('Seed complete.');
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
