import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { multiTenantPlugin } from '@payloadcms/plugin-multi-tenant';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { buildConfig } from 'payload';
import { collections } from './collections';
import { loadEnv } from './lib/env';

const env = loadEnv();
const dirname = path.dirname(fileURLToPath(import.meta.url));

type ConfigTypes = {
  collections: {
    tenants: { slug: 'tenants' };
    pages: { slug: 'pages' };
    'insights-posts': { slug: 'insights-posts' };
    publications: { slug: 'publications' };
  };
};

export default buildConfig({
  admin: {
    user: 'users',
    importMap: { baseDir: path.resolve(dirname) },
  },
  collections,
  editor: lexicalEditor(),
  secret: env.PAYLOAD_SECRET,
  typescript: {
    outputFile: path.resolve(dirname, '../payload-types.ts'),
  },
  db: postgresAdapter({
    pool: { connectionString: env.DATABASE_URL },
  }),
  sharp: undefined,
  localization: {
    locales: [
      { label: 'English', code: 'en' },
      { label: 'العربية', code: 'ar', rtl: true },
      { label: 'Français', code: 'fr' },
    ],
    defaultLocale: 'en',
    fallback: true,
  },
  plugins: [
    multiTenantPlugin<ConfigTypes>({
      collections: {
        pages: {},
        'insights-posts': {},
        publications: {},
      },
      tenantField: { name: 'tenant' },
      tenantsArrayField: {
        includeDefaultField: false,
      },
      userHasAccessToAllTenants: (user) => user?.role === 'group-admin',
    }),
  ],
});
