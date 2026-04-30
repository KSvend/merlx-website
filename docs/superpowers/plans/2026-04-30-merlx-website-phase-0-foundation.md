# MERLx Website — Phase 0: Foundation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stand up the empty multi-tenant Next.js 16 + Payload v3 scaffold with host-based tenant resolution, trilingual routing (EN/AR/FR), RTL support, design-system tokens, and CI gates — ready for content phases (1–7) to build on top of.

**Architecture:** Single Next.js 16 App Router project with Payload v3 mounted on shared route handlers. `@payloadcms/plugin-multi-tenant` scopes content collections by tenant. A `proxy.ts` middleware resolves the request's `Host` header to a tenant record and attaches it to request context. `next-intl` handles locale routing with RTL support for Arabic. Design tokens (warm-white field, teal/orange/purple accents, tri-typeface system) live in Tailwind config + CSS variables.

**Tech Stack:** Next.js 16, Payload v3, `@payloadcms/plugin-multi-tenant`, `next-intl`, Tailwind v4, TypeScript, Bun (package manager), Neon Postgres (Vercel Marketplace), Vercel Blob, Playwright (E2E), Vitest (unit), Biome (lint + format), GitHub Actions + Vercel CI.

**Reference spec:** `docs/superpowers/specs/2026-04-30-merlx-website-design.md`

---

## File Structure

Establishing this layout up front so later phases slot in cleanly.

```
merlx-website/
├── .github/
│   └── workflows/
│       └── ci.yml                     # typecheck + lint + test + lighthouse
├── docs/
│   └── superpowers/
│       ├── specs/                     # design specs
│       └── plans/                     # this plan + future phase plans
├── public/
│   └── brand/
│       └── merlx-icon.svg             # canonical brand mark (real, not redrawn)
├── src/
│   ├── app/
│   │   ├── (frontend)/
│   │   │   └── [locale]/
│   │   │       ├── layout.tsx         # locale-aware layout (lang, dir)
│   │   │       └── page.tsx           # placeholder home for each tenant
│   │   ├── (payload)/
│   │   │   ├── admin/
│   │   │   │   └── [[...segments]]/
│   │   │   │       ├── page.tsx       # Payload admin UI mount
│   │   │   │       └── not-found.tsx
│   │   │   └── api/
│   │   │       ├── [...slug]/
│   │   │       │   └── route.ts       # Payload REST API
│   │   │       └── graphql/
│   │   │           └── route.ts       # Payload GraphQL endpoint
│   │   └── globals.css                # design tokens + Tailwind layers
│   ├── collections/
│   │   ├── Tenants.ts                 # the multi-tenant root collection
│   │   ├── Users.ts                   # editors / admins / translators
│   │   └── index.ts                   # collection registry
│   ├── access/
│   │   └── tenants.ts                 # role + tenant access helpers
│   ├── i18n/
│   │   ├── routing.ts                 # next-intl routing config
│   │   ├── request.ts                 # next-intl request config
│   │   └── messages/
│   │       ├── en.json                # UI chrome strings
│   │       ├── ar.json
│   │       └── fr.json
│   ├── lib/
│   │   ├── tenant.ts                  # resolveTenantFromHost helper
│   │   ├── design-tokens.ts           # exported design-token constants
│   │   └── env.ts                     # env-var validation (zod)
│   ├── components/
│   │   ├── BrandMark.tsx              # inline SVG MERLx mark
│   │   └── LocaleSwitch.tsx           # EN / AR / FR
│   └── payload.config.ts              # Payload root config
├── tests/
│   ├── unit/
│   │   ├── tenant.test.ts
│   │   └── design-tokens.test.ts
│   └── e2e/
│       ├── tenant-resolution.spec.ts
│       ├── locale-routing.spec.ts
│       └── rtl.spec.ts
├── proxy.ts                           # Host → tenant resolution (Next 16 middleware successor)
├── playwright.config.ts
├── vitest.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── biome.json
├── package.json
├── vercel.ts                          # Vercel project config (TS, replaces vercel.json)
├── .env.example                       # documented env-var template
├── .env.local                         # gitignored, real secrets
├── .gitignore
├── next.config.ts
├── README.md
└── docker-compose.dev.yml             # local Postgres for dev
```

**Each file's responsibility, in one line:**

| File | Owns |
|---|---|
| `proxy.ts` | Host header → tenant record lookup, attach to request headers |
| `payload.config.ts` | Payload's root config — DB, collections, plugins, locales, admin |
| `src/collections/Tenants.ts` | The tenant table itself (root of multi-tenancy) |
| `src/collections/Users.ts` | Authentication for admin UI; users link to tenants via roles |
| `src/access/tenants.ts` | Role + tenant access policies (used by Payload field-level access) |
| `src/i18n/routing.ts` | Locale list, default locale, locale-prefix config |
| `src/i18n/request.ts` | Per-request locale resolution + messages loader |
| `src/lib/tenant.ts` | `resolveTenantFromHost(host)` — pure function for tests |
| `src/lib/env.ts` | Zod-validated `process.env` accessor |
| `src/lib/design-tokens.ts` | Single source of truth for colors / spacing / fonts |
| `src/components/BrandMark.tsx` | Inline real `MERLx_icon.svg` as React component |
| `src/components/LocaleSwitch.tsx` | EN/AR/FR switcher — used in chrome |
| `tailwind.config.ts` | Reads design-tokens, exposes utility classes + theme |
| `src/app/(frontend)/[locale]/layout.tsx` | Sets `<html lang dir>`, loads messages, applies design system |
| `src/app/(frontend)/[locale]/page.tsx` | Placeholder home that proves the tenant + locale pipeline |
| `vercel.ts` | TS-typed Vercel project config (build command, framework, headers) |
| `vitest.config.ts` | Unit-test runner config |
| `playwright.config.ts` | E2E runner config (3 base URLs for the 3 tenants) |
| `.github/workflows/ci.yml` | typecheck → lint → unit + e2e tests → Lighthouse-CI gate |

---

## Conventions

- **Package manager:** `bun` (matches existing MERLx scaffolds and faster install).
- **Test framework:** Vitest for unit; Playwright for E2E. No Jest.
- **Lint + format:** Biome (single tool replacing ESLint + Prettier — matches the existing MERLX.org scaffold).
- **Commit messages:** Conventional Commits (`feat:`, `fix:`, `chore:`, `test:`, `docs:`, `refactor:`).
- **TDD:** test first, watch fail, implement, watch pass, commit.
- **Commits:** small and frequent. Each task ends in a single commit unless explicitly otherwise.
- **Env vars:** validated through Zod in `src/lib/env.ts`; never read `process.env.*` directly outside that file.

---

## Tasks

### Task 1: Repo bootstrap

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `biome.json`
- Create: `.gitignore`
- Create: `README.md`
- Create: `next.config.ts`
- Create: `tailwind.config.ts`

- [ ] **Step 1: Create the project directory and run `bun init` (Next.js 16 app)**

```bash
cd ~/github
bun create next-app@latest merlx-website --typescript --app --src-dir --import-alias "@/*" --no-tailwind --no-eslint
cd merlx-website
git init
```

Expected: `bun create` scaffolds Next.js 16 with TypeScript, App Router, `src/` directory.

- [ ] **Step 2: Replace generated `package.json` with the project baseline**

Overwrite `package.json` with:

```json
{
  "name": "merlx-website",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "engines": { "node": ">=24" },
  "packageManager": "bun@1.1.0",
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "biome check src tests",
    "lint:fix": "biome check --write src tests",
    "format": "biome format --write src tests",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test",
    "test:e2e:install": "playwright install --with-deps chromium"
  },
  "dependencies": {
    "next": "^16.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@biomejs/biome": "^1.9.4",
    "@types/node": "^22.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@playwright/test": "^1.48.0",
    "typescript": "^5.6.0",
    "vitest": "^2.1.0"
  }
}
```

- [ ] **Step 3: Install dependencies**

```bash
bun install
```

Expected: deps installed, `bun.lockb` created.

- [ ] **Step 4: Replace `tsconfig.json` with strict baseline**

Overwrite `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "ES2022"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] },
    "verbatimModuleSyntax": true
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 5: Create `biome.json`**

```json
{
  "$schema": "https://biomejs.dev/schemas/1.9.4/schema.json",
  "vcs": { "enabled": true, "clientKind": "git", "useIgnoreFile": true },
  "files": { "ignoreUnknown": false, "ignore": [".next", "node_modules", "dist"] },
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 100
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "style": {
        "useImportType": "error",
        "useTemplate": "warn"
      },
      "correctness": {
        "noUnusedImports": "error"
      }
    }
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "single",
      "trailingCommas": "all",
      "semicolons": "always"
    }
  }
}
```

- [ ] **Step 6: Update `.gitignore` to include the standard set**

```gitignore
node_modules/
.next/
.vercel/
.env
.env.local
.env.*.local
*.log
.DS_Store
.idea/
.vscode/
coverage/
playwright-report/
test-results/
.superpowers/
```

- [ ] **Step 7: Initial commit**

```bash
git add .
git commit -m "chore: bootstrap next.js 16 + biome + ts strict"
```

---

### Task 2: Env-var validation

**Files:**
- Create: `src/lib/env.ts`
- Create: `.env.example`
- Create: `.env.local` (gitignored, contents not committed)
- Test: `tests/unit/env.test.ts`

- [ ] **Step 1: Add the zod dependency**

```bash
bun add zod
```

- [ ] **Step 2: Write the failing test**

Create `tests/unit/env.test.ts`:

```typescript
import { describe, expect, it, beforeEach } from 'vitest';

describe('env', () => {
  beforeEach(() => {
    delete process.env.DATABASE_URL;
    delete process.env.PAYLOAD_SECRET;
    delete process.env.NEXT_PUBLIC_SITE_URL;
  });

  it('throws when required env vars are missing', async () => {
    process.env.DATABASE_URL = '';
    const { loadEnv } = await import('../../src/lib/env.js');
    expect(() => loadEnv()).toThrow();
  });

  it('returns parsed env when all required vars are present', async () => {
    process.env.DATABASE_URL = 'postgres://u:p@localhost:5432/db';
    process.env.PAYLOAD_SECRET = 'a'.repeat(32);
    process.env.NEXT_PUBLIC_SITE_URL = 'http://localhost:3000';
    const { loadEnv } = await import('../../src/lib/env.js?cachebust=' + Date.now());
    const env = loadEnv();
    expect(env.DATABASE_URL).toBe('postgres://u:p@localhost:5432/db');
    expect(env.PAYLOAD_SECRET.length).toBeGreaterThanOrEqual(32);
  });
});
```

- [ ] **Step 3: Create `vitest.config.ts`**

```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/unit/**/*.test.ts'],
    globals: false,
  },
});
```

- [ ] **Step 4: Run the test to verify it fails**

```bash
bun test
```

Expected: FAIL — `Cannot find module '../../src/lib/env.js'`.

- [ ] **Step 5: Create `src/lib/env.ts`**

```typescript
import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  PAYLOAD_SECRET: z.string().min(32),
  NEXT_PUBLIC_SITE_URL: z.string().url(),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  RESEND_API_KEY: z.string().optional(),
  TURNSTILE_SECRET_KEY: z.string().optional(),
  TURNSTILE_SITE_KEY: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;

let cached: Env | null = null;

export function loadEnv(): Env {
  if (cached) return cached;
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    throw new Error(`Invalid environment variables:\n${result.error.message}`);
  }
  cached = result.data;
  return cached;
}

export function resetEnvForTests(): void {
  cached = null;
}
```

- [ ] **Step 6: Update test to call `resetEnvForTests` between tests, then re-run**

Replace `tests/unit/env.test.ts`:

```typescript
import { describe, expect, it, beforeEach } from 'vitest';
import { loadEnv, resetEnvForTests } from '../../src/lib/env.js';

describe('env', () => {
  beforeEach(() => {
    resetEnvForTests();
    delete process.env.DATABASE_URL;
    delete process.env.PAYLOAD_SECRET;
    delete process.env.NEXT_PUBLIC_SITE_URL;
  });

  it('throws when required env vars are missing', () => {
    expect(() => loadEnv()).toThrow();
  });

  it('returns parsed env when all required vars are present', () => {
    process.env.DATABASE_URL = 'postgres://u:p@localhost:5432/db';
    process.env.PAYLOAD_SECRET = 'a'.repeat(32);
    process.env.NEXT_PUBLIC_SITE_URL = 'http://localhost:3000';
    const env = loadEnv();
    expect(env.DATABASE_URL).toBe('postgres://u:p@localhost:5432/db');
    expect(env.PAYLOAD_SECRET.length).toBeGreaterThanOrEqual(32);
  });
});
```

```bash
bun test
```

Expected: 2 passes.

- [ ] **Step 7: Create `.env.example`**

```
# Database
DATABASE_URL=postgres://user:password@localhost:5432/merlx_website

# Payload
PAYLOAD_SECRET=                    # 32+ random chars; generate with: openssl rand -hex 32

# Public site
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Email (Phase 1)
RESEND_API_KEY=

# Spam protection (Phase 1)
TURNSTILE_SECRET_KEY=
TURNSTILE_SITE_KEY=
```

- [ ] **Step 8: Commit**

```bash
git add .
git commit -m "feat: env-var validation via zod"
```

---

### Task 3: Local Postgres for dev + Docker Compose

**Files:**
- Create: `docker-compose.dev.yml`

- [ ] **Step 1: Create `docker-compose.dev.yml`**

```yaml
services:
  postgres:
    image: postgres:17-alpine
    container_name: merlx_postgres_dev
    restart: unless-stopped
    environment:
      POSTGRES_USER: merlx
      POSTGRES_PASSWORD: merlx
      POSTGRES_DB: merlx_website
    ports:
      - "5432:5432"
    volumes:
      - merlx_pg_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U merlx"]
      interval: 5s
      timeout: 3s
      retries: 5

volumes:
  merlx_pg_data:
```

- [ ] **Step 2: Start Postgres and confirm it's reachable**

```bash
docker compose -f docker-compose.dev.yml up -d
docker compose -f docker-compose.dev.yml ps
```

Expected: container running, status healthy.

- [ ] **Step 3: Set `DATABASE_URL` in `.env.local`**

Create `.env.local` (NOT committed):

```
DATABASE_URL=postgres://merlx:merlx@localhost:5432/merlx_website
PAYLOAD_SECRET=replace-with-openssl-rand-hex-32
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Generate the secret:

```bash
echo "PAYLOAD_SECRET=$(openssl rand -hex 32)"
```

Paste into `.env.local`.

- [ ] **Step 4: Commit**

```bash
git add docker-compose.dev.yml
git commit -m "chore: docker-compose postgres for local dev"
```

---

### Task 4: Install Payload v3 + DB adapter

**Files:**
- Create: `src/payload.config.ts`
- Create: `src/collections/Users.ts`
- Create: `src/collections/index.ts`
- Modify: `src/app/(payload)/admin/[[...segments]]/page.tsx`
- Modify: `src/app/(payload)/api/[...slug]/route.ts`
- Modify: `src/app/(payload)/api/graphql/route.ts`
- Modify: `next.config.ts`

- [ ] **Step 1: Install Payload + Postgres adapter + rich-text editor**

```bash
bun add payload @payloadcms/db-postgres @payloadcms/richtext-lexical @payloadcms/next sharp graphql
```

- [ ] **Step 2: Create the Users collection**

Create `src/collections/Users.ts`:

```typescript
import type { CollectionConfig } from 'payload';

export const Users: CollectionConfig = {
  slug: 'users',
  admin: { useAsTitle: 'email' },
  auth: true,
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      options: [
        { label: 'Group Admin', value: 'group-admin' },
        { label: 'Studio Editor', value: 'studio-editor' },
        { label: 'Network Editor', value: 'network-editor' },
        { label: 'Node Admin', value: 'node-admin' },
        { label: 'Translator', value: 'translator' },
      ],
    },
  ],
};
```

- [ ] **Step 3: Create the collections registry**

Create `src/collections/index.ts`:

```typescript
import type { CollectionConfig } from 'payload';
import { Users } from './Users.js';

export const collections: CollectionConfig[] = [Users];
```

- [ ] **Step 4: Create the Payload config**

Create `src/payload.config.ts`:

```typescript
import { postgresAdapter } from '@payloadcms/db-postgres';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { buildConfig } from 'payload';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { collections } from './collections/index.js';
import { loadEnv } from './lib/env.js';

const env = loadEnv();
const dirname = path.dirname(fileURLToPath(import.meta.url));

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
});
```

- [ ] **Step 5: Mount the Payload admin route**

Create `src/app/(payload)/admin/[[...segments]]/page.tsx`:

```typescript
import config from '@/payload.config.js';
import { generatePageMetadata, RootPage } from '@payloadcms/next/views';
import type { Metadata } from 'next';

type Args = {
  params: Promise<{ segments?: string[] }>;
  searchParams: Promise<Record<string, string | string[]>>;
};

export const generateMetadata = ({ params, searchParams }: Args): Promise<Metadata> =>
  generatePageMetadata({ config, params, searchParams });

export default function Page({ params, searchParams }: Args) {
  return RootPage({ config, params, searchParams });
}
```

Create `src/app/(payload)/admin/[[...segments]]/not-found.tsx`:

```typescript
import config from '@/payload.config.js';
import { NotFoundPage, generatePageMetadata } from '@payloadcms/next/views';
import type { Metadata } from 'next';

type Args = {
  params: Promise<Record<string, never>>;
  searchParams: Promise<Record<string, string | string[]>>;
};

export const generateMetadata = ({ params, searchParams }: Args): Promise<Metadata> =>
  generatePageMetadata({ config, params, searchParams });

export default function NotFound({ params, searchParams }: Args) {
  return NotFoundPage({ config, params, searchParams });
}
```

- [ ] **Step 6: Mount the Payload REST API**

Create `src/app/(payload)/api/[...slug]/route.ts`:

```typescript
import config from '@/payload.config.js';
import { REST_DELETE, REST_GET, REST_OPTIONS, REST_PATCH, REST_POST } from '@payloadcms/next/routes';

export const GET = REST_GET(config);
export const POST = REST_POST(config);
export const DELETE = REST_DELETE(config);
export const PATCH = REST_PATCH(config);
export const OPTIONS = REST_OPTIONS(config);
```

- [ ] **Step 7: Mount the Payload GraphQL endpoint**

Create `src/app/(payload)/api/graphql/route.ts`:

```typescript
import config from '@/payload.config.js';
import { GRAPHQL_POST, REST_OPTIONS } from '@payloadcms/next/routes';

export const POST = GRAPHQL_POST(config);
export const OPTIONS = REST_OPTIONS(config);
```

- [ ] **Step 8: Update `next.config.ts` to include Payload**

Replace `next.config.ts`:

```typescript
import { withPayload } from '@payloadcms/next/withPayload';
import type { NextConfig } from 'next';

const config: NextConfig = {
  experimental: {
    reactCompiler: false,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
  },
};

export default withPayload(config);
```

- [ ] **Step 9: Run dev server, hit `/admin`, create the first user**

```bash
bun run dev
```

In a browser visit `http://localhost:3000/admin`. Expected: Payload create-first-user form. Create a user with role `group-admin`. Sign in and confirm the admin shell loads.

- [ ] **Step 10: Commit**

```bash
git add .
git commit -m "feat: mount payload v3 with users collection"
```

---

### Task 5: Tenants collection

**Files:**
- Create: `src/collections/Tenants.ts`
- Modify: `src/collections/index.ts`
- Test: `tests/e2e/payload-tenants.spec.ts`

- [ ] **Step 1: Create the Tenants collection**

Create `src/collections/Tenants.ts`:

```typescript
import type { CollectionConfig } from 'payload';

export const Tenants: CollectionConfig = {
  slug: 'tenants',
  admin: { useAsTitle: 'displayName', defaultColumns: ['displayName', 'domain', 'type', 'status'] },
  fields: [
    {
      name: 'domain',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: { description: 'e.g. merlx.org, studio.merlx.org, nilex.merlx.org' },
    },
    {
      name: 'displayName',
      type: 'text',
      required: true,
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Group', value: 'group' },
        { label: 'Studio', value: 'studio' },
        { label: 'Network', value: 'network' },
        { label: 'Node', value: 'node' },
      ],
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pre-launch',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Pre-launch', value: 'pre-launch' },
        { label: 'Archived', value: 'archived' },
      ],
    },
    {
      name: 'primaryLocale',
      type: 'select',
      required: true,
      defaultValue: 'en',
      options: [
        { label: 'English', value: 'en' },
        { label: 'العربية', value: 'ar' },
        { label: 'Français', value: 'fr' },
      ],
    },
    {
      name: 'supportedLocales',
      type: 'select',
      hasMany: true,
      defaultValue: ['en'],
      options: [
        { label: 'English', value: 'en' },
        { label: 'العربية', value: 'ar' },
        { label: 'Français', value: 'fr' },
      ],
    },
    {
      name: 'accentColor',
      type: 'select',
      required: true,
      defaultValue: 'teal',
      options: [
        { label: 'Teal', value: 'teal' },
        { label: 'Orange', value: 'orange' },
        { label: 'Sage', value: 'sage' },
        { label: 'Slate', value: 'slate' },
        { label: 'Deep Teal', value: 'deep-teal' },
      ],
    },
    {
      name: 'tagline',
      type: 'text',
      localized: true,
    },
    {
      name: 'hasInsights',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Whether this tenant publishes Insights. Studio + Network always true; Nodes opt in.',
      },
    },
    {
      name: 'blobBucketPrefix',
      type: 'text',
      required: true,
      admin: { description: 'e.g. merlx-blob/studio. Used to scope media uploads.' },
    },
  ],
};
```

- [ ] **Step 2: Add Tenants to the collections registry**

Modify `src/collections/index.ts`:

```typescript
import type { CollectionConfig } from 'payload';
import { Tenants } from './Tenants.js';
import { Users } from './Users.js';

export const collections: CollectionConfig[] = [Users, Tenants];
```

- [ ] **Step 3: Restart dev server, log in, create a tenant manually to verify**

```bash
# in another terminal
bun run dev
```

Visit `http://localhost:3000/admin`, log in, navigate to **Tenants → Create New**. Fill in:

- domain: `studio.localhost.test`
- displayName: `Studio (local)`
- type: `studio`
- status: `pre-launch`
- primaryLocale: `en`
- supportedLocales: `[en]`
- accentColor: `orange`
- blobBucketPrefix: `merlx-blob-dev/studio`

Save. Confirm the record exists.

- [ ] **Step 4: Install Playwright and create the E2E config**

```bash
bun add -d @playwright/test
bun run test:e2e:install
```

Create `playwright.config.ts`:

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: {
    command: 'bun run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
```

- [ ] **Step 5: Add a Tenants smoke E2E test**

Create `tests/e2e/payload-tenants.spec.ts`:

```typescript
import { expect, test } from '@playwright/test';

test('tenants collection responds via REST', async ({ request }) => {
  const res = await request.get('/api/tenants?depth=0&limit=1');
  expect(res.status()).toBe(200);
  const json = await res.json();
  expect(json).toHaveProperty('docs');
  expect(Array.isArray(json.docs)).toBe(true);
});
```

- [ ] **Step 6: Run the E2E test**

```bash
bun run test:e2e
```

Expected: 1 pass.

- [ ] **Step 7: Commit**

```bash
git add .
git commit -m "feat: tenants collection + smoke e2e"
```

---

### Task 6: `resolveTenantFromHost` helper (pure, unit-tested)

**Files:**
- Create: `src/lib/tenant.ts`
- Test: `tests/unit/tenant.test.ts`

- [ ] **Step 1: Write the failing unit tests**

Create `tests/unit/tenant.test.ts`:

```typescript
import { describe, expect, it } from 'vitest';
import { normalizeHost, parseTenantFromHost } from '../../src/lib/tenant.js';

describe('normalizeHost', () => {
  it('strips port', () => {
    expect(normalizeHost('localhost:3000')).toBe('localhost');
    expect(normalizeHost('studio.merlx.org:8080')).toBe('studio.merlx.org');
  });

  it('lowercases', () => {
    expect(normalizeHost('Studio.MERLX.ORG')).toBe('studio.merlx.org');
  });

  it('returns the host as-is when there is no port', () => {
    expect(normalizeHost('merlx.org')).toBe('merlx.org');
  });
});

describe('parseTenantFromHost', () => {
  it('returns group for the bare apex domain', () => {
    expect(parseTenantFromHost('merlx.org')).toEqual({
      kind: 'group',
      subdomain: null,
      domain: 'merlx.org',
    });
  });

  it('returns studio for studio.merlx.org', () => {
    expect(parseTenantFromHost('studio.merlx.org')).toEqual({
      kind: 'studio',
      subdomain: 'studio',
      domain: 'studio.merlx.org',
    });
  });

  it('returns network for network.merlx.org', () => {
    expect(parseTenantFromHost('network.merlx.org')).toEqual({
      kind: 'network',
      subdomain: 'network',
      domain: 'network.merlx.org',
    });
  });

  it('returns node for any other subdomain', () => {
    expect(parseTenantFromHost('nilex.merlx.org')).toEqual({
      kind: 'node',
      subdomain: 'nilex',
      domain: 'nilex.merlx.org',
    });
  });

  it('handles localhost.test apex as group', () => {
    expect(parseTenantFromHost('localhost.test')).toEqual({
      kind: 'group',
      subdomain: null,
      domain: 'localhost.test',
    });
  });

  it('handles studio.localhost.test as studio', () => {
    expect(parseTenantFromHost('studio.localhost.test')).toEqual({
      kind: 'studio',
      subdomain: 'studio',
      domain: 'studio.localhost.test',
    });
  });

  it('treats www as group, not as a node', () => {
    expect(parseTenantFromHost('www.merlx.org')).toEqual({
      kind: 'group',
      subdomain: 'www',
      domain: 'www.merlx.org',
    });
  });
});
```

- [ ] **Step 2: Run to verify failure**

```bash
bun test
```

Expected: FAIL — module not found.

- [ ] **Step 3: Implement `src/lib/tenant.ts`**

```typescript
export type TenantKind = 'group' | 'studio' | 'network' | 'node';

export interface ParsedTenant {
  kind: TenantKind;
  subdomain: string | null;
  domain: string;
}

const RESERVED_SUBDOMAINS: Record<string, TenantKind> = {
  studio: 'studio',
  network: 'network',
};

const TOOL_SUBDOMAINS = new Set([
  'prism',
  'iris',
  'aperture',
  'toc',
  'oasis',
  'echo',
]);

export function normalizeHost(host: string): string {
  return host.toLowerCase().replace(/:\d+$/, '');
}

export function parseTenantFromHost(rawHost: string): ParsedTenant {
  const host = normalizeHost(rawHost);
  const labels = host.split('.');

  if (labels.length <= 2) {
    return { kind: 'group', subdomain: null, domain: host };
  }

  const subdomain = labels[0]!;

  if (subdomain === 'www') {
    return { kind: 'group', subdomain, domain: host };
  }

  if (TOOL_SUBDOMAINS.has(subdomain)) {
    throw new Error(`Tool subdomain ${subdomain} is not handled by the website tenant resolver`);
  }

  if (RESERVED_SUBDOMAINS[subdomain]) {
    return { kind: RESERVED_SUBDOMAINS[subdomain], subdomain, domain: host };
  }

  return { kind: 'node', subdomain, domain: host };
}
```

- [ ] **Step 4: Run tests**

```bash
bun test
```

Expected: 9 pass.

- [ ] **Step 5: Commit**

```bash
git add src/lib/tenant.ts tests/unit/tenant.test.ts
git commit -m "feat: parseTenantFromHost helper + unit tests"
```

---

### Task 7: `proxy.ts` host-based tenant resolution

**Files:**
- Create: `proxy.ts`
- Test: `tests/e2e/tenant-resolution.spec.ts`

`proxy.ts` is the Next 16 successor to `middleware.ts`. It intercepts every request before routing.

- [ ] **Step 1: Write the failing E2E test**

Create `tests/e2e/tenant-resolution.spec.ts`:

```typescript
import { expect, test } from '@playwright/test';

test('proxy attaches tenant kind header', async ({ request }) => {
  const res = await request.get('/_tenant-debug', {
    headers: { host: 'studio.localhost.test' },
  });
  expect(res.status()).toBe(200);
  const json = await res.json();
  expect(json.kind).toBe('studio');
  expect(json.subdomain).toBe('studio');
});

test('proxy resolves nilex.localhost.test as node', async ({ request }) => {
  const res = await request.get('/_tenant-debug', {
    headers: { host: 'nilex.localhost.test' },
  });
  expect(res.status()).toBe(200);
  const json = await res.json();
  expect(json.kind).toBe('node');
  expect(json.subdomain).toBe('nilex');
});

test('proxy resolves localhost.test as group', async ({ request }) => {
  const res = await request.get('/_tenant-debug', {
    headers: { host: 'localhost.test' },
  });
  expect(res.status()).toBe(200);
  const json = await res.json();
  expect(json.kind).toBe('group');
});
```

- [ ] **Step 2: Create `proxy.ts`**

Create `proxy.ts` at the repo root:

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { parseTenantFromHost } from './src/lib/tenant.js';

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/admin|admin|brand).*)'],
};

export function proxy(request: NextRequest): NextResponse {
  const host = request.headers.get('host') ?? '';

  let tenant;
  try {
    tenant = parseTenantFromHost(host);
  } catch (error) {
    if (error instanceof Error && error.message.includes('Tool subdomain')) {
      return NextResponse.next();
    }
    throw error;
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-tenant-kind', tenant.kind);
  requestHeaders.set('x-tenant-subdomain', tenant.subdomain ?? '');
  requestHeaders.set('x-tenant-domain', tenant.domain);

  return NextResponse.next({ request: { headers: requestHeaders } });
}
```

- [ ] **Step 3: Add a debug route for the test**

Create `src/app/_tenant-debug/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

export async function GET() {
  const headerList = await headers();
  return NextResponse.json({
    kind: headerList.get('x-tenant-kind'),
    subdomain: headerList.get('x-tenant-subdomain'),
    domain: headerList.get('x-tenant-domain'),
  });
}
```

- [ ] **Step 4: Run E2E**

```bash
bun run test:e2e
```

Expected: 3 new tests pass + the earlier Tenants smoke test still passes.

- [ ] **Step 5: Commit**

```bash
git add proxy.ts src/app/_tenant-debug/route.ts tests/e2e/tenant-resolution.spec.ts
git commit -m "feat: proxy.ts host-based tenant resolution"
```

---

### Task 8: `next-intl` for trilingual routing

**Files:**
- Create: `src/i18n/routing.ts`
- Create: `src/i18n/request.ts`
- Create: `src/i18n/messages/en.json`
- Create: `src/i18n/messages/ar.json`
- Create: `src/i18n/messages/fr.json`
- Modify: `next.config.ts`
- Create: `src/app/(frontend)/[locale]/layout.tsx`
- Create: `src/app/(frontend)/[locale]/page.tsx`
- Test: `tests/e2e/locale-routing.spec.ts`

- [ ] **Step 1: Install `next-intl`**

```bash
bun add next-intl
```

- [ ] **Step 2: Create the routing config**

Create `src/i18n/routing.ts`:

```typescript
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'ar', 'fr'] as const,
  defaultLocale: 'en',
  localePrefix: 'always',
});

export type AppLocale = (typeof routing.locales)[number];
```

- [ ] **Step 3: Create the request config**

Create `src/i18n/request.ts`:

```typescript
import { hasLocale } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing.js';

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;
  const messages = (await import(`./messages/${locale}.json`)).default;
  return { locale, messages };
});
```

- [ ] **Step 4: Add starter chrome strings**

Create `src/i18n/messages/en.json`:

```json
{
  "chrome": {
    "siteName": "MERLx",
    "navInsights": "Insights",
    "navPublications": "Publications",
    "navContact": "Contact"
  },
  "scaffold": {
    "tenantHeader": "Tenant",
    "localeHeader": "Locale",
    "directionHeader": "Direction"
  }
}
```

Create `src/i18n/messages/ar.json`:

```json
{
  "chrome": {
    "siteName": "MERLx",
    "navInsights": "رؤى",
    "navPublications": "منشورات",
    "navContact": "تواصل"
  },
  "scaffold": {
    "tenantHeader": "المستأجر",
    "localeHeader": "اللغة",
    "directionHeader": "الاتجاه"
  }
}
```

Create `src/i18n/messages/fr.json`:

```json
{
  "chrome": {
    "siteName": "MERLx",
    "navInsights": "Analyses",
    "navPublications": "Publications",
    "navContact": "Contact"
  },
  "scaffold": {
    "tenantHeader": "Locataire",
    "localeHeader": "Langue",
    "directionHeader": "Direction"
  }
}
```

- [ ] **Step 5: Wire next-intl into Next config**

Replace `next.config.ts`:

```typescript
import { withPayload } from '@payloadcms/next/withPayload';
import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from 'next';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const config: NextConfig = {
  experimental: {
    reactCompiler: false,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
  },
};

export default withPayload(withNextIntl(config));
```

- [ ] **Step 6: Create the locale-aware frontend layout**

Create `src/app/(frontend)/[locale]/layout.tsx`:

```typescript
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import type { ReactNode } from 'react';
import { routing } from '@/i18n/routing.js';
import '@/app/globals.css';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

interface LayoutProps {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  const headerList = await headers();
  const tenantKind = headerList.get('x-tenant-kind') ?? 'unknown';

  return (
    <html lang={locale} dir={dir} data-tenant={tenantKind}>
      <body>
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 7: Create a placeholder home that proves the pipeline**

Create `src/app/(frontend)/[locale]/page.tsx`:

```typescript
import { headers } from 'next/headers';
import { setRequestLocale, getTranslations } from 'next-intl/server';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('scaffold');

  const headerList = await headers();
  const tenantKind = headerList.get('x-tenant-kind') ?? 'unknown';
  const tenantDomain = headerList.get('x-tenant-domain') ?? 'unknown';

  return (
    <main style={{ padding: 24, fontFamily: 'system-ui, sans-serif' }}>
      <h1>MERLx — Phase 0 scaffold</h1>
      <table style={{ borderCollapse: 'collapse', marginTop: 12 }}>
        <tbody>
          <tr>
            <th style={{ textAlign: 'start', padding: '4px 12px 4px 0' }}>{t('tenantHeader')}</th>
            <td>
              {tenantKind} ({tenantDomain})
            </td>
          </tr>
          <tr>
            <th style={{ textAlign: 'start', padding: '4px 12px 4px 0' }}>{t('localeHeader')}</th>
            <td>{locale}</td>
          </tr>
          <tr>
            <th style={{ textAlign: 'start', padding: '4px 12px 4px 0' }}>{t('directionHeader')}</th>
            <td>{locale === 'ar' ? 'rtl' : 'ltr'}</td>
          </tr>
        </tbody>
      </table>
    </main>
  );
}
```

- [ ] **Step 8: Update `proxy.ts` to redirect bare paths to `/<defaultLocale>`**

Replace `proxy.ts`:

```typescript
import createIntlMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { routing } from './src/i18n/routing.js';
import { parseTenantFromHost } from './src/lib/tenant.js';

const intlMiddleware = createIntlMiddleware(routing);

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api|admin|brand).*)'],
};

export function proxy(request: NextRequest): NextResponse {
  const host = request.headers.get('host') ?? '';

  let tenant;
  try {
    tenant = parseTenantFromHost(host);
  } catch (error) {
    if (error instanceof Error && error.message.includes('Tool subdomain')) {
      return NextResponse.next();
    }
    throw error;
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-tenant-kind', tenant.kind);
  requestHeaders.set('x-tenant-subdomain', tenant.subdomain ?? '');
  requestHeaders.set('x-tenant-domain', tenant.domain);

  if (request.nextUrl.pathname.startsWith('/_tenant-debug')) {
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  const intlResponse = intlMiddleware(request);
  intlResponse.headers.set('x-tenant-kind', tenant.kind);
  intlResponse.headers.set('x-tenant-subdomain', tenant.subdomain ?? '');
  intlResponse.headers.set('x-tenant-domain', tenant.domain);
  return intlResponse;
}
```

- [ ] **Step 9: Add the locale-routing E2E test**

Create `tests/e2e/locale-routing.spec.ts`:

```typescript
import { expect, test } from '@playwright/test';

test('bare / redirects to /en', async ({ page }) => {
  const response = await page.goto('/');
  expect(response).not.toBeNull();
  await expect(page).toHaveURL(/\/en$/);
});

test('/en serves English chrome strings', async ({ page }) => {
  await page.goto('/en');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');
  await expect(page.getByText('Tenant')).toBeVisible();
});

test('/fr serves French chrome strings', async ({ page }) => {
  await page.goto('/fr');
  await expect(page.locator('html')).toHaveAttribute('lang', 'fr');
  await expect(page.getByText('Locataire')).toBeVisible();
});

test('/ar serves Arabic + RTL', async ({ page }) => {
  await page.goto('/ar');
  await expect(page.locator('html')).toHaveAttribute('lang', 'ar');
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  await expect(page.getByText('المستأجر')).toBeVisible();
});
```

- [ ] **Step 10: Add a basic globals.css**

Create `src/app/globals.css`:

```css
:root {
  font-family: system-ui, -apple-system, sans-serif;
}

html { box-sizing: border-box; }
*, *::before, *::after { box-sizing: inherit; }
body { margin: 0; }

[dir="rtl"] body { text-align: start; }
```

- [ ] **Step 11: Run E2E + unit tests**

```bash
bun test
bun run test:e2e
```

Expected: all unit tests pass; locale-routing E2E tests all pass; tenant-resolution E2E tests still pass.

- [ ] **Step 12: Commit**

```bash
git add .
git commit -m "feat: next-intl trilingual routing with rtl"
```

---

### Task 9: Design tokens + Tailwind v4

**Files:**
- Create: `src/lib/design-tokens.ts`
- Modify: `src/app/globals.css`
- Modify: `tailwind.config.ts`
- Modify: `package.json`
- Test: `tests/unit/design-tokens.test.ts`

- [ ] **Step 1: Install Tailwind v4**

```bash
bun add -d tailwindcss@^4 @tailwindcss/postcss postcss
```

- [ ] **Step 2: Create the design-tokens module**

Create `src/lib/design-tokens.ts`:

```typescript
export const colors = {
  bg: '#fbfaf5',
  bgSoft: '#f6f4ec',
  ink: '#1a1a1a',
  inkSoft: '#555555',
  inkMute: '#8c8779',
  teal: '#1a3a34',
  tealDeep: '#122a26',
  tealTintHover: '#f3f5ee',
  purple: '#4a3f6b',
  orange: '#ca5d0f',
  orangeTintHover: '#f9eee0',
  orangeHot: '#8a2f0a',
  rule: '#e8e3d4',
  ruleSoft: '#efeae0',
} as const;

export const fonts = {
  serif: '"Tiempos Headline", "GT Sectra Display", Georgia, serif',
  sans: 'Inter, system-ui, -apple-system, sans-serif',
  mono: '"IBM Plex Mono", "JetBrains Mono", ui-monospace, monospace',
} as const;

export const space = {
  px1: '1px',
  px: '1px',
  s1: '4px',
  s2: '8px',
  s3: '12px',
  s4: '16px',
  s5: '20px',
  s6: '24px',
  s8: '32px',
  s10: '40px',
  s12: '48px',
  s16: '64px',
  s20: '80px',
} as const;

export const radii = {
  none: '0',
  sm: '2px',
  md: '4px',
} as const;

export type ColorToken = keyof typeof colors;
export type FontToken = keyof typeof fonts;
export type SpaceToken = keyof typeof space;
export type RadiusToken = keyof typeof radii;
```

- [ ] **Step 3: Write the unit test for token integrity**

Create `tests/unit/design-tokens.test.ts`:

```typescript
import { describe, expect, it } from 'vitest';
import { colors, fonts, radii, space } from '../../src/lib/design-tokens.js';

describe('design tokens', () => {
  it('colors include canonical brand hex values from MERLx_icon.svg', () => {
    expect(colors.teal).toBe('#1a3a34');
    expect(colors.orange).toBe('#ca5d0f');
    expect(colors.purple).toBe('#4a3f6b');
  });

  it('uses warm-white as the page bg, not pure white', () => {
    expect(colors.bg).toBe('#fbfaf5');
    expect(colors.bg.toLowerCase()).not.toBe('#ffffff');
  });

  it('fonts cover the tri-typeface system', () => {
    expect(fonts.serif).toContain('Tiempos');
    expect(fonts.sans).toContain('Inter');
    expect(fonts.mono).toContain('Plex Mono');
  });

  it('exposes a space scale', () => {
    expect(space.s1).toBe('4px');
    expect(space.s4).toBe('16px');
  });

  it('radii are minimal (square edges per company profile)', () => {
    expect(radii.md).toBe('4px');
  });
});
```

- [ ] **Step 4: Run the test**

```bash
bun test
```

Expected: 5 new tests pass.

- [ ] **Step 5: Replace `src/app/globals.css` with the token-driven version**

```css
@import "tailwindcss";

@theme {
  --color-bg: #fbfaf5;
  --color-bg-soft: #f6f4ec;
  --color-ink: #1a1a1a;
  --color-ink-soft: #555555;
  --color-ink-mute: #8c8779;
  --color-teal: #1a3a34;
  --color-teal-deep: #122a26;
  --color-purple: #4a3f6b;
  --color-orange: #ca5d0f;
  --color-orange-hot: #8a2f0a;
  --color-rule: #e8e3d4;

  --font-serif: "Tiempos Headline", "GT Sectra Display", Georgia, serif;
  --font-sans: Inter, system-ui, -apple-system, sans-serif;
  --font-mono: "IBM Plex Mono", "JetBrains Mono", ui-monospace, monospace;

  --radius-sm: 2px;
  --radius-md: 4px;
}

html {
  box-sizing: border-box;
  background: var(--color-bg);
  color: var(--color-ink);
  font-family: var(--font-sans);
}
*, *::before, *::after { box-sizing: inherit; }
body { margin: 0; }

[dir="rtl"] body { text-align: start; }
```

- [ ] **Step 6: Add the PostCSS config (Tailwind v4)**

Create `postcss.config.js`:

```javascript
export default {
  plugins: { '@tailwindcss/postcss': {} },
};
```

- [ ] **Step 7: Verify dev server still serves the page with Tailwind active**

```bash
bun run dev
```

Visit `http://localhost:3000/en`. Expected: warm-white bg, system-ui sans, no console errors.

- [ ] **Step 8: Commit**

```bash
git add .
git commit -m "feat: design tokens + tailwind v4"
```

---

### Task 10: Brand mark + locale switch components

**Files:**
- Copy: `~/Documents/MERLx/Logo/MERLx_icon.svg` → `public/brand/merlx-icon.svg`
- Create: `src/components/BrandMark.tsx`
- Create: `src/components/LocaleSwitch.tsx`
- Modify: `src/app/(frontend)/[locale]/page.tsx`
- Test: `tests/e2e/brand-and-locale-switch.spec.ts`

- [ ] **Step 1: Copy the canonical brand mark**

```bash
mkdir -p public/brand
cp ~/Documents/MERLx/Logo/MERLx_icon.svg public/brand/merlx-icon.svg
```

Verify file size and content:

```bash
ls -la public/brand/merlx-icon.svg
head -5 public/brand/merlx-icon.svg
```

Expected: `<?xml version="1.0" encoding="UTF-8"?>` and a `<svg` tag with viewBox `0 0 303.02 236.75`.

- [ ] **Step 2: Create the BrandMark component (inline SVG, not `<img>`)**

Create `src/components/BrandMark.tsx`:

```typescript
interface BrandMarkProps {
  size?: number;
  className?: string;
}

export function BrandMark({ size = 32, className }: BrandMarkProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 303.02 236.75"
      width={size}
      height={(size * 236.75) / 303.02}
      className={className}
      role="img"
      aria-label="MERLx"
    >
      <rect fill="#1a3a34" x="223.02" width="80" height="227.61" />
      <rect fill="#ca5d0f" x="0" y="137.61" width="90" height="90" rx="45" ry="45" />
      <path
        fill="#4a3f6b"
        d="M148.08,236.75h0l-42.58-102.77c-9.65-24.57,10.73-56.34,40.97-57.21.54-.02,1.08-.02,1.62-.02h0c.54,0,1.08,0,1.62.02,30.24.88,50.62,32.64,40.97,57.21l-42.58,102.77Z"
      />
    </svg>
  );
}
```

- [ ] **Step 3: Create the locale switch**

Create `src/components/LocaleSwitch.tsx`:

```typescript
'use client';

import { usePathname, useRouter } from 'next/navigation';
import { routing } from '@/i18n/routing.js';

interface LocaleSwitchProps {
  currentLocale: string;
}

export function LocaleSwitch({ currentLocale }: LocaleSwitchProps) {
  const router = useRouter();
  const pathname = usePathname();

  const switchTo = (next: string) => {
    const stripped = pathname.replace(/^\/(en|ar|fr)(\/|$)/, '/');
    const target = `/${next}${stripped === '/' ? '' : stripped}`;
    router.push(target);
  };

  return (
    <nav aria-label="Language" style={{ fontFamily: 'var(--font-mono)', fontSize: 10 }}>
      {routing.locales.map((locale, index) => (
        <span key={locale}>
          <button
            type="button"
            onClick={() => switchTo(locale)}
            style={{
              border: 'none',
              background: 'transparent',
              padding: 0,
              cursor: 'pointer',
              color: locale === currentLocale ? 'var(--color-ink)' : 'var(--color-ink-mute)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}
            aria-current={locale === currentLocale ? 'true' : undefined}
          >
            {locale}
          </button>
          {index < routing.locales.length - 1 && <span style={{ color: 'var(--color-ink-mute)' }}> · </span>}
        </span>
      ))}
    </nav>
  );
}
```

- [ ] **Step 4: Use both components on the placeholder home**

Replace `src/app/(frontend)/[locale]/page.tsx`:

```typescript
import { headers } from 'next/headers';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { BrandMark } from '@/components/BrandMark.js';
import { LocaleSwitch } from '@/components/LocaleSwitch.js';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('scaffold');

  const headerList = await headers();
  const tenantKind = headerList.get('x-tenant-kind') ?? 'unknown';
  const tenantDomain = headerList.get('x-tenant-domain') ?? 'unknown';

  return (
    <main style={{ padding: 24 }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
        <BrandMark size={28} />
        <span
          style={{
            fontFamily: 'var(--font-serif)',
            fontWeight: 600,
            fontSize: 19,
            letterSpacing: '-0.005em',
          }}
        >
          MERL<span style={{ color: 'var(--color-purple)' }}>x</span>
        </span>
        <span style={{ marginInlineStart: 'auto' }}>
          <LocaleSwitch currentLocale={locale} />
        </span>
      </header>

      <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 32 }}>Phase 0 scaffold</h1>
      <table style={{ borderCollapse: 'collapse', marginTop: 12 }}>
        <tbody>
          <tr>
            <th style={{ textAlign: 'start', padding: '4px 12px 4px 0' }}>{t('tenantHeader')}</th>
            <td>
              {tenantKind} ({tenantDomain})
            </td>
          </tr>
          <tr>
            <th style={{ textAlign: 'start', padding: '4px 12px 4px 0' }}>{t('localeHeader')}</th>
            <td>{locale}</td>
          </tr>
          <tr>
            <th style={{ textAlign: 'start', padding: '4px 12px 4px 0' }}>{t('directionHeader')}</th>
            <td>{locale === 'ar' ? 'rtl' : 'ltr'}</td>
          </tr>
        </tbody>
      </table>
    </main>
  );
}
```

- [ ] **Step 5: E2E test for brand mark + locale switch**

Create `tests/e2e/brand-and-locale-switch.spec.ts`:

```typescript
import { expect, test } from '@playwright/test';

test('brand mark renders inline SVG with three brand colors', async ({ page }) => {
  await page.goto('/en');
  const svg = page.locator('header svg[role="img"][aria-label="MERLx"]');
  await expect(svg).toBeVisible();
  await expect(svg.locator('rect[fill="#1a3a34"]')).toHaveCount(1);
  await expect(svg.locator('rect[fill="#ca5d0f"]')).toHaveCount(1);
  await expect(svg.locator('path[fill="#4a3f6b"]')).toHaveCount(1);
});

test('locale switch navigates between en/fr/ar', async ({ page }) => {
  await page.goto('/en');
  await page.getByRole('button', { name: 'fr' }).click();
  await expect(page).toHaveURL(/\/fr$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'fr');

  await page.getByRole('button', { name: 'ar' }).click();
  await expect(page).toHaveURL(/\/ar$/);
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
});
```

- [ ] **Step 6: Run E2E**

```bash
bun run test:e2e
```

Expected: 2 new tests pass; previous tests still pass.

- [ ] **Step 7: Commit**

```bash
git add .
git commit -m "feat: brand mark component + locale switch"
```

---

### Task 11: Multi-tenant plugin

**Files:**
- Modify: `src/payload.config.ts`
- Create: `src/access/tenants.ts`
- Modify: `src/collections/Users.ts`

The `@payloadcms/plugin-multi-tenant` plugin is the official tenancy mechanism. We're going to wire it lightly here (no tenant-scoped content collections in Phase 0; the plugin is just configured and available for Phase 1+).

- [ ] **Step 1: Install the plugin**

```bash
bun add @payloadcms/plugin-multi-tenant
```

- [ ] **Step 2: Add tenant linkage on the User collection**

Replace `src/collections/Users.ts`:

```typescript
import type { CollectionConfig } from 'payload';

export const Users: CollectionConfig = {
  slug: 'users',
  admin: { useAsTitle: 'email' },
  auth: true,
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      options: [
        { label: 'Group Admin', value: 'group-admin' },
        { label: 'Studio Editor', value: 'studio-editor' },
        { label: 'Network Editor', value: 'network-editor' },
        { label: 'Node Admin', value: 'node-admin' },
        { label: 'Translator', value: 'translator' },
      ],
    },
    {
      name: 'tenants',
      type: 'array',
      fields: [
        {
          name: 'tenant',
          type: 'relationship',
          relationTo: 'tenants',
          required: true,
        },
      ],
    },
  ],
};
```

- [ ] **Step 3: Create the access helpers**

Create `src/access/tenants.ts`:

```typescript
import type { Access, Where } from 'payload';

export const isGroupAdmin: Access = ({ req }) => req.user?.role === 'group-admin';

export const tenantScopedRead: Access = ({ req }) => {
  if (!req.user) return false;
  if (req.user.role === 'group-admin') return true;

  const tenantIds = (req.user.tenants ?? [])
    .map((entry: { tenant: string | { id: string } }) =>
      typeof entry.tenant === 'string' ? entry.tenant : entry.tenant?.id,
    )
    .filter(Boolean);

  if (tenantIds.length === 0) return false;
  const where: Where = { tenant: { in: tenantIds } };
  return where;
};
```

- [ ] **Step 4: Wire the plugin into `payload.config.ts`**

Replace `src/payload.config.ts`:

```typescript
import { postgresAdapter } from '@payloadcms/db-postgres';
import { multiTenantPlugin } from '@payloadcms/plugin-multi-tenant';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { buildConfig } from 'payload';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { collections } from './collections/index.js';
import { loadEnv } from './lib/env.js';

const env = loadEnv();
const dirname = path.dirname(fileURLToPath(import.meta.url));

type ConfigTypes = {
  collections: { tenants: { slug: 'tenants' } };
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
      collections: {},
      tenantField: { name: 'tenant' },
      tenantsArrayField: {
        includeDefaultField: false,
      },
      userHasAccessToAllTenants: (user) => user?.role === 'group-admin',
    }),
  ],
});
```

The `collections: {}` is intentional for Phase 0 — content collections aren't added yet. The plugin is wired and ready for Phase 1.

- [ ] **Step 5: Restart and verify the admin UI loads with no errors**

```bash
bun run dev
```

Visit `/admin`. Sign in. Open the Tenants list. Open the Users list. Confirm both work.

Confirm Payload prints no warnings about the multi-tenant plugin in the dev console.

- [ ] **Step 6: Run all tests to ensure nothing regressed**

```bash
bun test
bun run test:e2e
```

Expected: all green.

- [ ] **Step 7: Commit**

```bash
git add .
git commit -m "feat: wire multi-tenant plugin (config only, no collections yet)"
```

---

### Task 12: Seed group / studio / network tenants

**Files:**
- Create: `scripts/seed-tenants.ts`
- Modify: `package.json`

- [ ] **Step 1: Create the seed script**

Create `scripts/seed-tenants.ts`:

```typescript
import { getPayload } from 'payload';
import config from '../src/payload.config.js';

const SEED_TENANTS = [
  {
    domain: 'merlx.org',
    displayName: 'MERLx (Group)',
    type: 'group' as const,
    status: 'pre-launch' as const,
    primaryLocale: 'en' as const,
    supportedLocales: ['en', 'ar', 'fr'],
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
    supportedLocales: ['en', 'ar', 'fr'],
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
    supportedLocales: ['en', 'ar', 'fr'],
    accentColor: 'teal' as const,
    hasInsights: true,
    blobBucketPrefix: 'merlx-blob/network',
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
```

- [ ] **Step 2: Add the seed script to `package.json`**

In `package.json` `scripts`, add:

```json
"seed": "bun run --env-file=.env.local scripts/seed-tenants.ts"
```

- [ ] **Step 3: Run the seed**

```bash
bun run seed
```

Expected output:

```
  + seeded: merlx.org
  + seeded: studio.merlx.org
  + seeded: network.merlx.org
Seed complete.
```

- [ ] **Step 4: Verify in admin UI**

Visit `/admin/collections/tenants`. Expected: three tenants visible with correct types and accent colors.

- [ ] **Step 5: Re-run to confirm idempotency**

```bash
bun run seed
```

Expected output:

```
  - skip: merlx.org already exists
  - skip: studio.merlx.org already exists
  - skip: network.merlx.org already exists
Seed complete.
```

- [ ] **Step 6: Commit**

```bash
git add scripts/seed-tenants.ts package.json
git commit -m "feat: seed group/studio/network tenants"
```

---

### Task 13: README + DX docs

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Replace `README.md`**

```markdown
# merlx-website

The MERLx group website. A multi-tenant Next.js 16 + Payload v3 monorepo serving:

- `merlx.org` — group front door (the v16 hover-split chooser between Studio + Network)
- `studio.merlx.org` — the MERLx Studio sub-site (Optics Suite)
- `network.merlx.org` — the MERLx Network sub-site (locally owned MERL cooperatives)
- `[node].merlx.org` — federated node sites (NileX is the first)

Tool subdomains (`prism.merlx.org`, `iris.merlx.org`, etc.) are not part of this codebase. They route to separate tool deployments.

See `docs/superpowers/specs/2026-04-30-merlx-website-design.md` for the full design spec.

## Stack

- Next.js 16 App Router (Turbopack)
- Payload v3 (mounted on Next route handlers)
- `@payloadcms/plugin-multi-tenant`
- `next-intl` (locale prefix routing, RTL for Arabic)
- Tailwind v4 (design tokens via `@theme` directive)
- Postgres (Neon in production, Docker for dev)
- Vercel Blob for media
- Resend for transactional email
- Bun for package management
- Biome for lint + format
- Vitest (unit) + Playwright (E2E)

## Local development

### One-time setup

```bash
bun install
docker compose -f docker-compose.dev.yml up -d
cp .env.example .env.local
# fill PAYLOAD_SECRET (openssl rand -hex 32) and DATABASE_URL into .env.local
bun run dev
# visit http://localhost:3000/admin and create the first user
bun run seed
```

### Day-to-day

```bash
bun run dev          # start dev server (turbopack)
bun test             # unit tests (vitest)
bun run test:e2e     # E2E tests (playwright)
bun run typecheck    # tsc --noEmit
bun run lint         # biome check
bun run lint:fix     # biome auto-fix
```

### Tenant resolution in dev

`proxy.ts` reads the `Host` header. To preview different tenants locally:

- `merlx.localhost.test` → group
- `studio.localhost.test` → studio
- `network.localhost.test` → network
- `nilex.localhost.test` → node (nilex)

Point any `*.localhost.test` to `127.0.0.1` in `/etc/hosts`:

```
127.0.0.1 merlx.localhost.test
127.0.0.1 studio.localhost.test
127.0.0.1 network.localhost.test
127.0.0.1 nilex.localhost.test
```

Then visit `http://studio.localhost.test:3000/en`.

## Layers

MERLx is positioned across three layers, two of which are foregrounded on the website:

1. **MERLx Studio** (this codebase, `studio.*`) — builds the Optics Suite (IRIS, PRISM, Aperture, ToC Tester, OASIS, ECHO).
2. **MERLx Network** (this codebase, `network.*` + `[node].*`) — federation of locally owned MERL cooperatives (NileX, future nodes).
3. **MERLx Cooperative** — long-term worker-ownership transformation (out of scope for v1; see Whitepaper).
```

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs: README with stack + local dev guide"
```

---

### Task 14: GitHub Actions CI + Lighthouse-CI gate

**Files:**
- Create: `.github/workflows/ci.yml`
- Create: `.github/workflows/lighthouse.yml`
- Create: `lighthouserc.json`

- [ ] **Step 1: Create the main CI workflow**

Create `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  typecheck-lint-unit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v2
        with: { bun-version: latest }
      - run: bun install --frozen-lockfile
      - run: bun run lint
      - run: bun run typecheck
      - run: bun test

  e2e:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:17-alpine
        env:
          POSTGRES_USER: merlx
          POSTGRES_PASSWORD: merlx
          POSTGRES_DB: merlx_website
        ports: ['5432:5432']
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    env:
      DATABASE_URL: postgres://merlx:merlx@localhost:5432/merlx_website
      PAYLOAD_SECRET: aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
      NEXT_PUBLIC_SITE_URL: http://localhost:3000
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v2
        with: { bun-version: latest }
      - run: bun install --frozen-lockfile
      - run: bun run test:e2e:install
      - run: bun run build
      - run: bun run test:e2e
```

- [ ] **Step 2: Create the Lighthouse config**

Create `lighthouserc.json`:

```json
{
  "ci": {
    "collect": {
      "startServerCommand": "bun run start",
      "startServerReadyPattern": "Ready in",
      "url": ["http://localhost:3000/en"],
      "numberOfRuns": 3,
      "settings": { "preset": "desktop" }
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.95 }],
        "categories:accessibility": ["error", { "minScore": 0.95 }],
        "categories:best-practices": ["warn", { "minScore": 0.9 }],
        "first-contentful-paint": ["error", { "maxNumericValue": 1500 }],
        "largest-contentful-paint": ["error", { "maxNumericValue": 1500 }],
        "cumulative-layout-shift": ["error", { "maxNumericValue": 0.05 }],
        "total-blocking-time": ["error", { "maxNumericValue": 200 }]
      }
    }
  }
}
```

- [ ] **Step 3: Create the Lighthouse workflow**

Create `.github/workflows/lighthouse.yml`:

```yaml
name: Lighthouse CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:17-alpine
        env:
          POSTGRES_USER: merlx
          POSTGRES_PASSWORD: merlx
          POSTGRES_DB: merlx_website
        ports: ['5432:5432']
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    env:
      DATABASE_URL: postgres://merlx:merlx@localhost:5432/merlx_website
      PAYLOAD_SECRET: aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
      NEXT_PUBLIC_SITE_URL: http://localhost:3000
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v2
        with: { bun-version: latest }
      - run: bun install --frozen-lockfile
      - run: bun run build
      - run: bun run seed
      - name: Run Lighthouse CI
        run: |
          bunx --bun @lhci/cli@latest autorun --config=./lighthouserc.json
```

- [ ] **Step 4: Push to GitHub and observe the workflow run**

```bash
git add .github/workflows/ lighthouserc.json
git commit -m "ci: github actions for typecheck, lint, unit, e2e, lighthouse"
git remote add origin git@github.com:<user>/merlx-website.git
git push -u origin main
```

Expected: both workflows kick off; both pass. Open a draft PR with a trivial change to confirm PR-flow works.

If Lighthouse fails because the placeholder home is too sparse to score well, lower the LCP/FCP thresholds *temporarily* — they're targets for the real landing page, not for the empty scaffold. Re-tighten before Phase 1 ships.

- [ ] **Step 5: Commit any threshold adjustments**

If you adjusted `lighthouserc.json`:

```bash
git add lighthouserc.json
git commit -m "ci: adjust lighthouse thresholds for empty scaffold (revisit phase 1)"
```

---

### Task 15: Vercel project + Neon (deferred to launch readiness)

This task is deliberately last because it requires Vercel CLI authentication and Neon Marketplace provisioning, both of which need a human in the loop. **Plan the steps; execute them when you're ready to deploy a preview.**

**Files:**
- Create: `vercel.ts`

- [ ] **Step 1: Create the Vercel TS project config**

Create `vercel.ts`:

```typescript
import { type VercelConfig } from '@vercel/config/v1';

export const config: VercelConfig = {
  buildCommand: 'bun run build',
  framework: 'nextjs',
  installCommand: 'bun install --frozen-lockfile',
  headers: [
    {
      source: '/(.*)',
      headers: [
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
      ],
    },
  ],
};

export default config;
```

Add the dep:

```bash
bun add -d @vercel/config
```

- [ ] **Step 2: Link the project (manual)**

```bash
bunx vercel link
bunx vercel env pull .env.vercel.local
```

- [ ] **Step 3: Provision Neon via Marketplace (manual)**

In Vercel dashboard → Storage → Marketplace → Neon. Provision a new database. Vercel auto-injects `DATABASE_URL` into the project's env vars. Pull again with `vercel env pull`.

- [ ] **Step 4: Provision Vercel Blob (manual)**

Vercel dashboard → Storage → Blob. Create a new blob store. Vercel auto-injects `BLOB_READ_WRITE_TOKEN`.

- [ ] **Step 5: Add `BLOB_READ_WRITE_TOKEN` to `src/lib/env.ts`**

Modify `src/lib/env.ts` schema to include:

```typescript
BLOB_READ_WRITE_TOKEN: z.string().optional(),
```

- [ ] **Step 6: Trigger a preview deploy**

```bash
bunx vercel
```

Expected: the preview URL serves `/en` with the placeholder scaffold and a working `/admin`. Run the seed against the preview's database (use the `DATABASE_URL` from `vercel env pull`).

- [ ] **Step 7: Commit**

```bash
git add vercel.ts package.json bun.lockb src/lib/env.ts
git commit -m "feat: vercel project config + storage env wiring"
```

---

## Phase 0 exit checklist

When all 15 tasks are complete, the following should be true:

- `bun run dev` serves a placeholder home at `http://localhost:3000/en` (and `/ar`, `/fr`)
- The `<html lang dir>` attributes update per locale; AR is RTL
- Visiting `studio.localhost.test:3000/en` returns the same placeholder, but with `data-tenant="studio"` on `<html>`
- The Payload admin loads at `/admin`, allows creating users and tenants
- `bun run seed` is idempotent; group / studio / network tenants exist
- All unit + E2E tests pass on `bun test` and `bun run test:e2e`
- CI passes on push and on PR
- Lighthouse-CI gate enforces (or is documented as adjusted-pending-Phase-1)
- The repo `README.md` documents stack + local dev + tenant resolution
- A preview Vercel deploy successfully serves the scaffold

---

## What's intentionally NOT in Phase 0

- The hover-split chooser landing — Phase 1
- Aggregate Insights / Publications feeds — Phase 1
- Studio per-tool marketing pages — Phase 2
- Network nodes directory + interactive world map — Phase 3
- NileX node tenant + content — Phase 4
- AR / FR translations of marketing copy — Phase 5
- Sentry, Vercel Speed Insights, accessibility audit, perf-budget verification — Phase 6
- DNS cutover for `merlx.org` and tool subdomains — Phase 7
- The MERLx Cooperative content — out of v1 scope entirely

These belong in their own phase plans. Phase 0 only delivers the multi-tenant scaffold that the rest of the work sits on.
