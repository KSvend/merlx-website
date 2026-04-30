# MERLx Website — Phase 1: Group Front Door

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a publicly visitable `merlx.org` (group tenant): the v16 hover-split chooser landing page, chrome (nav + footer), CMS-edited static pages (About, Legal), aggregate Insights & Publications feeds (initially empty), and a working contact form that lands leads in Payload + sends an email via Resend.

**Architecture:** Server-rendered React on Next.js 16 App Router. The chooser is CSS-only (no JS for the hover-split animation, just CSS transitions on flex/width and `:hover`). Aggregate feeds use Payload's Local API to query Insights/Publications collections across tenants where `syndicate: true`. The contact form is a Server Action that verifies a Cloudflare Turnstile token, validates with Zod, writes a `leads` row via Payload Local API, and dispatches an email via Resend. All routes are group-tenant-only at this phase: `proxy.ts` 404s the chooser landing on Studio/Network/Node hosts.

**Tech Stack:** Next.js 16 App Router, Payload v3, `next-intl`, Tailwind v4, Resend (transactional email), Cloudflare Turnstile (form anti-spam), Zod (validation). All carried forward from Phase 0.

**Reference spec:** `docs/superpowers/specs/2026-04-30-merlx-website-design.md`
**Reference brainstorm artefact:** the final landing iteration is `landing-v16-color-swap.html` from the brainstorm session — color reassignment is **Studio = orange (warmth / PRISM hot-zone register), Network = teal (federation / growth)**, with **asymmetric Studio→Network push** on hover.

---

## Carry-forward learnings from Phase 0

These are non-negotiable conventions established during Phase 0 execution:

1. **No `.js` extensions on imports** — neither `@/`-aliased nor relative. Turbopack 16 doesn't resolve them.
2. **Imports must be alphabetically sorted** (Biome enforces).
3. **Postgres runs on host port `5433`** (Docker maps `5433:5432`), `.env.local` reflects this.
4. **`proxy.ts` lives at `src/proxy.ts`** (not repo root — Next 16 with `src/` requires it inside `src/`).
5. **App Router `_`-prefixed folders are private (404).** Use route groups `(...)` for private grouping; never `_foo`.
6. **Payload v3 default access for non-auth collections actually denies anonymous reads.** Specify `access: { read: () => true }` on every collection that should serve public reads.
7. **`(payload)/layout.tsx` exists and wraps the admin tree** with `RootLayout` + `handleServerFunctions`. Don't remove or replace.
8. **Tenant headers propagate via request mutation in `proxy.ts`**, then get reflected on the response. The pattern in Phase 0's `src/proxy.ts` is the canonical approach.
9. **`bun run typecheck`, `bun run lint`, `bun run test`, `bun run test:e2e`** must all pass before commit.
10. **Design tokens** are emitted as CSS vars from `globals.css` `@theme` block; the TS module `src/lib/design-tokens.ts` mirrors them as constants for tests / type usage. **Use CSS vars in styles** (`var(--color-orange)`), never raw hex literals.

---

## File Structure

This phase introduces these primary new files. Subsequent tasks reference these paths.

```
merlx-website/
├── src/
│   ├── access/
│   │   └── public-read.ts                   # access helper: anyone reads, only authenticated writes
│   ├── collections/
│   │   ├── Pages.ts                         # generic CMS-edited pages (About, Legal, etc.)
│   │   ├── InsightsPosts.ts                 # blog/news/case-studies (per-tenant scoped via plugin)
│   │   ├── Publications.ts                  # formal outputs (papers, briefs)
│   │   ├── Leads.ts                         # form submissions
│   │   └── index.ts                         # registry — append the four new collections
│   ├── lib/
│   │   ├── tenant-aware.ts                  # helpers: get current tenant kind, gate routes
│   │   ├── aggregate-feed.ts                # cross-tenant query helpers (syndicate-only)
│   │   ├── turnstile.ts                     # Cloudflare Turnstile siteverify wrapper
│   │   └── resend.ts                        # Resend client wrapper
│   ├── components/
│   │   ├── chrome/
│   │   │   ├── SiteNav.tsx                  # group top nav (server component)
│   │   │   ├── SiteFooter.tsx               # group footer
│   │   │   └── PageShell.tsx                # standard page wrapper (header + main + footer)
│   │   ├── chooser/
│   │   │   ├── ChooserHero.tsx              # the v16 hover-split landing component
│   │   │   ├── StudioBackground.tsx         # PRISM hex grid SVG
│   │   │   └── NetworkBackground.tsx        # world dot-map + node pins SVG
│   │   ├── pages/
│   │   │   └── RichTextRenderer.tsx         # renders Payload Lexical content as HTML
│   │   └── forms/
│   │       └── ContactForm.tsx              # client component for the contact form
│   ├── app/
│   │   └── (frontend)/[locale]/
│   │       ├── page.tsx                     # REPLACED — renders ChooserHero on group tenant only
│   │       ├── about/page.tsx               # generic CMS-page renderer for slug 'about'
│   │       ├── insights/
│   │       │   ├── page.tsx                 # aggregate feed listing
│   │       │   └── [slug]/page.tsx          # individual post
│   │       ├── publications/
│   │       │   ├── page.tsx                 # publications table
│   │       │   └── [slug]/page.tsx          # individual publication
│   │       ├── contact/page.tsx             # contact form page
│   │       └── legal/[slug]/page.tsx        # privacy / terms / cookies (CMS-backed)
│   ├── server-actions/
│   │   └── submit-contact.ts                # 'use server' form action
│   └── styles/
│       └── chooser.css                      # the v16 hover-split CSS (could live alongside ChooserHero, kept separate for editor clarity)
├── scripts/
│   └── seed-content.ts                      # seeds About + Legal pages (en at minimum)
└── tests/
    ├── unit/
    │   ├── tenant-aware.test.ts
    │   ├── aggregate-feed.test.ts
    │   ├── turnstile.test.ts
    │   └── i18n-key-parity.test.ts
    └── e2e/
        ├── chooser-hover.spec.ts            # hover dynamics, asymmetric push, accessibility
        ├── group-routes.spec.ts             # /, /about, /insights, /publications, /contact, /legal/* render 200
        ├── contact-form.spec.ts             # submit flow → leads row + email
        └── tenant-gating.spec.ts            # studio/network hosts 404 the group-only routes
```

**Each new file's responsibility, in one line:**

| File | Owns |
|---|---|
| `src/access/public-read.ts` | The `read: () => true` access pattern, packaged so it's not duplicated |
| `src/collections/Pages.ts` | `pages` collection — slug, title, body, group/tenant scope |
| `src/collections/InsightsPosts.ts` | `insights_posts` collection — title, excerpt, body, category, syndicate flag |
| `src/collections/Publications.ts` | `publications` collection — title, authors, year, type, abstract, file |
| `src/collections/Leads.ts` | `leads` collection — submitter, message, tenant + page metadata |
| `src/lib/tenant-aware.ts` | `getCurrentTenant()`, `isGroupTenant()` server helpers from request headers |
| `src/lib/aggregate-feed.ts` | `findInsightsAcrossTenants()`, `findPublicationsAcrossTenants()` |
| `src/lib/turnstile.ts` | `verifyTurnstileToken(token, ip)` against the siteverify endpoint |
| `src/lib/resend.ts` | `sendLeadEmail({ to, subject, html })` |
| `src/components/chrome/SiteNav.tsx` | Top nav with brand mark, links, locale switch |
| `src/components/chrome/SiteFooter.tsx` | Footer: legal links, contact, language note |
| `src/components/chrome/PageShell.tsx` | Standard wrapper: nav above, main content, footer below |
| `src/components/chooser/ChooserHero.tsx` | v16 hover-split — two halves, asymmetric push, accent rule, CTAs |
| `src/components/chooser/StudioBackground.tsx` | PRISM hex grid SVG, orange-toned, opacity-0 by default, opacity-1 on parent hover |
| `src/components/chooser/NetworkBackground.tsx` | World dot-map + node pins SVG, teal-toned, same hover behavior |
| `src/components/pages/RichTextRenderer.tsx` | Renders Payload Lexical JSON to HTML |
| `src/components/forms/ContactForm.tsx` | Client component: Turnstile widget, form fields, submit |
| `src/server-actions/submit-contact.ts` | Server Action: validate, verify Turnstile, write lead, send email |
| `src/styles/chooser.css` | v16 hover dynamics — flex-grow, opacity, filter, transform, transitions |

---

## Conventions

- **Tasks are TDD where it makes sense**: pure functions get unit tests first; UI components get E2E tests after rendering works; CMS collections get smoke tests via the REST API after seeding.
- **Each task ends in a single commit** unless explicitly noted otherwise.
- **Color side-association is locked** (per the v16 brainstorm): Studio = orange, Network = teal. Logo's purple is editorial flourish only.
- **All public copy is locale-aware**. Default locale is `en`; `ar` and `fr` slots may be empty in v1 with a "translation pending" fallback.
- **Group-only routes** (`/`, `/about`, `/insights`, `/publications`, `/contact`, `/legal/*`) only render on the group tenant. Studio / Network / Node hosts 404 them via a small `tenant-aware` gate in each page.

---

## Tasks

### Task 1: `public-read` access helper

**Files:**
- Create: `src/access/public-read.ts`

- [ ] **Step 1: Create the helper**

```typescript
import type { Access } from 'payload';

/**
 * Public-read access: anyone may read; only authenticated users may write.
 * Used on collections that serve content to unauthenticated visitors
 * (Tenants, Pages, Insights, Publications).
 *
 * Required because Payload v3.84's bare default for non-auth collections
 * denies anonymous reads.
 */
export const publicRead: Access = () => true;
```

- [ ] **Step 2: Refactor Tenants collection to use it**

Modify `src/collections/Tenants.ts`. Replace the inline `access: { read: () => true }` with the imported helper:

Change the existing block (around line 5):

```typescript
  access: { read: () => true },
```

To:

```typescript
  access: { read: publicRead },
```

And add the import at the top:

```typescript
import { publicRead } from '@/access/public-read';
```

(Insert in alphabetical order: comes before `import type { CollectionConfig }`.)

- [ ] **Step 3: Confirm tests still pass**

```bash
cd /Users/kmini/github/merlx-website
bun run typecheck
bun run lint
bun run test
bun run test:e2e
```

Expected: all green. The Tenants smoke E2E should still pass since `publicRead` returns `true` exactly like the inline arrow did.

- [ ] **Step 4: Commit**

```bash
git add .
git commit -m "refactor: extract publicRead access helper"
```

---

### Task 2: Pages collection

**Files:**
- Create: `src/collections/Pages.ts`
- Modify: `src/collections/index.ts`
- Test: `tests/e2e/payload-pages.spec.ts`

- [ ] **Step 1: Create the Pages collection**

Create `src/collections/Pages.ts`:

```typescript
import { publicRead } from '@/access/public-read';
import type { CollectionConfig } from 'payload';

export const Pages: CollectionConfig = {
  slug: 'pages',
  access: { read: publicRead },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'status', 'updatedAt'],
  },
  fields: [
    {
      name: 'slug',
      type: 'text',
      required: true,
      index: true,
      admin: { description: 'URL slug — e.g. "about", "legal/privacy"' },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'subtitle',
      type: 'text',
      localized: true,
    },
    {
      name: 'body',
      type: 'richText',
      localized: true,
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
    },
    {
      name: 'seoDescription',
      type: 'textarea',
      localized: true,
      admin: { description: 'Used for OpenGraph + meta description.' },
    },
  ],
};
```

- [ ] **Step 2: Register in collections/index.ts**

Modify `src/collections/index.ts`:

```typescript
import type { CollectionConfig } from 'payload';
import { Pages } from './Pages';
import { Tenants } from './Tenants';
import { Users } from './Users';

export const collections: CollectionConfig[] = [Users, Tenants, Pages];
```

- [ ] **Step 3: Wire Pages into the multi-tenant plugin**

Modify `src/payload.config.ts`. Update the `multiTenantPlugin` config to include `pages`:

Change the existing block:

```typescript
multiTenantPlugin<ConfigTypes>({
  collections: {},
  ...
})
```

To:

```typescript
multiTenantPlugin<ConfigTypes>({
  collections: {
    pages: {},
  },
  ...
})
```

And update the `ConfigTypes` to include pages:

```typescript
type ConfigTypes = {
  collections: {
    tenants: { slug: 'tenants' };
    pages: { slug: 'pages' };
  };
};
```

- [ ] **Step 4: Add an E2E smoke test**

Create `tests/e2e/payload-pages.spec.ts`:

```typescript
import { expect, test } from '@playwright/test';

test('pages collection responds via REST', async ({ request }) => {
  const res = await request.get('/api/pages?depth=0&limit=1');
  expect(res.status()).toBe(200);
  const json = await res.json();
  expect(json).toHaveProperty('docs');
  expect(Array.isArray(json.docs)).toBe(true);
});
```

- [ ] **Step 5: Run all checks**

```bash
bun run typecheck
bun run lint
bun run test
bun run test:e2e
```

Expected: all green. Vitest still 17 passes; Playwright now 12 (was 11 + 1 new).

- [ ] **Step 6: Commit**

```bash
git add .
git commit -m "feat: pages collection (multi-tenant scoped)"
```

---

### Task 3: InsightsPosts and Publications collections

**Files:**
- Create: `src/collections/InsightsPosts.ts`
- Create: `src/collections/Publications.ts`
- Modify: `src/collections/index.ts`
- Modify: `src/payload.config.ts`
- Test: `tests/e2e/payload-content-collections.spec.ts`

- [ ] **Step 1: Create InsightsPosts**

Create `src/collections/InsightsPosts.ts`:

```typescript
import { publicRead } from '@/access/public-read';
import type { CollectionConfig } from 'payload';

export const InsightsPosts: CollectionConfig = {
  slug: 'insights-posts',
  access: { read: publicRead },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'status', 'syndicate', 'updatedAt'],
  },
  fields: [
    {
      name: 'slug',
      type: 'text',
      required: true,
      index: true,
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'excerpt',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'body',
      type: 'richText',
      localized: true,
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      defaultValue: 'analysis',
      options: [
        { label: 'News', value: 'news' },
        { label: 'Analysis', value: 'analysis' },
        { label: 'Field Note', value: 'field-note' },
        { label: 'Methods', value: 'methods' },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      required: true,
    },
    {
      name: 'syndicate',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description:
          'When true, this post bubbles up to parent tenant aggregate feeds (Network → Group, Node → Network → Group).',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
    },
  ],
};
```

- [ ] **Step 2: Create Publications**

Create `src/collections/Publications.ts`:

```typescript
import { publicRead } from '@/access/public-read';
import type { CollectionConfig } from 'payload';

export const Publications: CollectionConfig = {
  slug: 'publications',
  access: { read: publicRead },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'year', 'type', 'syndicate', 'updatedAt'],
  },
  fields: [
    {
      name: 'slug',
      type: 'text',
      required: true,
      index: true,
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'authors',
      type: 'array',
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'affiliation', type: 'text' },
      ],
    },
    {
      name: 'year',
      type: 'number',
      required: true,
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      defaultValue: 'working-paper',
      options: [
        { label: 'Peer-reviewed paper', value: 'peer-reviewed' },
        { label: 'Working paper', value: 'working-paper' },
        { label: 'Brief', value: 'brief' },
        { label: 'Methodology note', value: 'methodology' },
        { label: 'Report', value: 'report' },
      ],
    },
    {
      name: 'abstract',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'doi',
      type: 'text',
    },
    {
      name: 'fileUrl',
      type: 'text',
      admin: { description: 'URL to PDF (Vercel Blob in production).' },
    },
    {
      name: 'language',
      type: 'select',
      defaultValue: 'en',
      options: [
        { label: 'English', value: 'en' },
        { label: 'العربية', value: 'ar' },
        { label: 'Français', value: 'fr' },
      ],
    },
    {
      name: 'syndicate',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
    },
  ],
};
```

- [ ] **Step 3: Register in collections/index.ts**

Modify `src/collections/index.ts`:

```typescript
import type { CollectionConfig } from 'payload';
import { InsightsPosts } from './InsightsPosts';
import { Pages } from './Pages';
import { Publications } from './Publications';
import { Tenants } from './Tenants';
import { Users } from './Users';

export const collections: CollectionConfig[] = [
  Users,
  Tenants,
  Pages,
  InsightsPosts,
  Publications,
];
```

- [ ] **Step 4: Wire into multi-tenant plugin**

Modify `src/payload.config.ts`:

```typescript
type ConfigTypes = {
  collections: {
    tenants: { slug: 'tenants' };
    pages: { slug: 'pages' };
    'insights-posts': { slug: 'insights-posts' };
    publications: { slug: 'publications' };
  };
};
```

```typescript
multiTenantPlugin<ConfigTypes>({
  collections: {
    pages: {},
    'insights-posts': {},
    publications: {},
  },
  ...
})
```

- [ ] **Step 5: E2E smoke**

Create `tests/e2e/payload-content-collections.spec.ts`:

```typescript
import { expect, test } from '@playwright/test';

test.describe('content collections respond via REST', () => {
  test('insights-posts', async ({ request }) => {
    const res = await request.get('/api/insights-posts?depth=0&limit=1');
    expect(res.status()).toBe(200);
    expect(await res.json()).toHaveProperty('docs');
  });

  test('publications', async ({ request }) => {
    const res = await request.get('/api/publications?depth=0&limit=1');
    expect(res.status()).toBe(200);
    expect(await res.json()).toHaveProperty('docs');
  });
});
```

- [ ] **Step 6: Run all checks**

```bash
bun run typecheck
bun run lint
bun run test
bun run test:e2e
```

Expected: 14 E2E tests (12 + 2 new).

- [ ] **Step 7: Commit**

```bash
git add .
git commit -m "feat: insights-posts and publications collections"
```

---

### Task 4: Leads collection

**Files:**
- Create: `src/collections/Leads.ts`
- Modify: `src/collections/index.ts`

The Leads collection is **NOT** tenant-scoped via the multi-tenant plugin (a single inbox for now; can be split per-tenant later). Reads are admin-only; writes are public (so the public form can submit).

- [ ] **Step 1: Create Leads**

Create `src/collections/Leads.ts`:

```typescript
import type { Access, CollectionConfig } from 'payload';

const adminRead: Access = ({ req }) =>
  req.user?.role === 'group-admin' || req.user?.role === 'studio-editor' || req.user?.role === 'network-editor';

export const Leads: CollectionConfig = {
  slug: 'leads',
  access: {
    read: adminRead,
    create: () => true, // anyone can submit
    update: adminRead,
    delete: ({ req }) => req.user?.role === 'group-admin',
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'name', 'organisation', 'tenantOrigin', 'submittedAt', 'status'],
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'organisation', type: 'text' },
    { name: 'role', type: 'text' },
    { name: 'country', type: 'text' },
    { name: 'message', type: 'textarea', required: true },
    {
      name: 'interest',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'Optics Suite (Studio)', value: 'studio' },
        { label: 'Network engagement', value: 'network' },
        { label: 'Hosted instance', value: 'hosted' },
        { label: 'Pilot & evaluate', value: 'pilot' },
        { label: 'Build-with', value: 'build-with' },
        { label: 'Advisory', value: 'advisory' },
      ],
    },
    {
      name: 'tenantOrigin',
      type: 'text',
      required: true,
      admin: { description: 'Which tenant + page the submission came from (e.g., "group:/contact").' },
    },
    {
      name: 'utm',
      type: 'group',
      fields: [
        { name: 'source', type: 'text' },
        { name: 'medium', type: 'text' },
        { name: 'campaign', type: 'text' },
      ],
    },
    {
      name: 'submittedAt',
      type: 'date',
      defaultValue: () => new Date().toISOString(),
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'In progress', value: 'in-progress' },
        { label: 'Resolved', value: 'resolved' },
        { label: 'Spam', value: 'spam' },
      ],
    },
  ],
};
```

- [ ] **Step 2: Register**

Modify `src/collections/index.ts`:

```typescript
import type { CollectionConfig } from 'payload';
import { InsightsPosts } from './InsightsPosts';
import { Leads } from './Leads';
import { Pages } from './Pages';
import { Publications } from './Publications';
import { Tenants } from './Tenants';
import { Users } from './Users';

export const collections: CollectionConfig[] = [
  Users,
  Tenants,
  Pages,
  InsightsPosts,
  Publications,
  Leads,
];
```

- [ ] **Step 3: Verify schema migration**

Restart dev server and confirm Payload boots without errors:

```bash
cd /Users/kmini/github/merlx-website
bun run dev > /tmp/leads-boot.log 2>&1 &
DEV_PID=$!
for i in {1..40}; do
  if curl -sf -o /dev/null http://localhost:3000/admin; then echo READY; break; fi
  sleep 2
done
echo "/api/leads HTTP (anonymous, expecting 403):"
curl -s -o /dev/null -w "%{http_code}\n" "http://localhost:3000/api/leads?limit=1"
echo "boot log tail:"
tail -20 /tmp/leads-boot.log
kill $DEV_PID 2>/dev/null || true
sleep 2
```

Expected: anonymous GET returns 403 (only authenticated admins can read), no boot errors. Leads is in the schema.

- [ ] **Step 4: Run checks + commit**

```bash
bun run typecheck
bun run lint
bun run test
bun run test:e2e
git add .
git commit -m "feat: leads collection (admin-read, public-create)"
```

---

### Task 5: tenant-aware helpers

**Files:**
- Create: `src/lib/tenant-aware.ts`
- Test: `tests/unit/tenant-aware.test.ts`

- [ ] **Step 1: Write the failing tests**

Create `tests/unit/tenant-aware.test.ts`:

```typescript
import { describe, expect, it, vi } from 'vitest';
import { isGroupTenant, parseTenantHeaders } from '../../src/lib/tenant-aware';

describe('parseTenantHeaders', () => {
  it('reads x-tenant-* headers and returns a record', () => {
    const headers = new Headers({
      'x-tenant-kind': 'group',
      'x-tenant-subdomain': '',
      'x-tenant-domain': 'merlx.org',
    });
    expect(parseTenantHeaders(headers)).toEqual({
      kind: 'group',
      subdomain: '',
      domain: 'merlx.org',
    });
  });

  it('defaults to "unknown" when headers are absent', () => {
    expect(parseTenantHeaders(new Headers())).toEqual({
      kind: 'unknown',
      subdomain: '',
      domain: '',
    });
  });
});

describe('isGroupTenant', () => {
  it('returns true for kind=group', () => {
    const headers = new Headers({ 'x-tenant-kind': 'group' });
    expect(isGroupTenant(headers)).toBe(true);
  });
  it('returns false for non-group', () => {
    const headers = new Headers({ 'x-tenant-kind': 'studio' });
    expect(isGroupTenant(headers)).toBe(false);
  });
});
```

- [ ] **Step 2: Run — should fail (module not found)**

```bash
bun run test
```

Expected: FAIL with "Cannot find module".

- [ ] **Step 3: Implement**

Create `src/lib/tenant-aware.ts`:

```typescript
export interface TenantContext {
  kind: 'group' | 'studio' | 'network' | 'node' | 'unknown';
  subdomain: string;
  domain: string;
}

export function parseTenantHeaders(headers: Headers): TenantContext {
  const kind = (headers.get('x-tenant-kind') ?? 'unknown') as TenantContext['kind'];
  const subdomain = headers.get('x-tenant-subdomain') ?? '';
  const domain = headers.get('x-tenant-domain') ?? '';
  return { kind, subdomain, domain };
}

export function isGroupTenant(headers: Headers): boolean {
  return parseTenantHeaders(headers).kind === 'group';
}
```

- [ ] **Step 4: Run — should pass**

```bash
bun run test
```

Expected: 4 new passes (total 21 unit tests).

- [ ] **Step 5: Run lint + typecheck + commit**

```bash
bun run typecheck
bun run lint
git add .
git commit -m "feat: tenant-aware helpers + unit tests"
```

---

### Task 6: SiteNav, SiteFooter, PageShell components

**Files:**
- Create: `src/components/chrome/SiteNav.tsx`
- Create: `src/components/chrome/SiteFooter.tsx`
- Create: `src/components/chrome/PageShell.tsx`

These are server components. They use design tokens via CSS variables.

- [ ] **Step 1: Create SiteNav**

Create `src/components/chrome/SiteNav.tsx`:

```typescript
import { BrandMark } from '@/components/BrandMark';
import { LocaleSwitch } from '@/components/LocaleSwitch';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

interface SiteNavProps {
  locale: string;
}

export async function SiteNav({ locale }: SiteNavProps) {
  const t = await getTranslations('chrome');

  return (
    <nav
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 28px',
        borderBottom: '1px solid var(--color-rule)',
        background: 'var(--color-bg)',
      }}
    >
      <Link
        href={`/${locale}`}
        style={{ display: 'flex', alignItems: 'center', gap: 11, textDecoration: 'none', color: 'var(--color-ink)' }}
      >
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
      </Link>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 22,
          fontFamily: 'var(--font-sans)',
          fontSize: 12,
          color: 'var(--color-ink-soft)',
        }}
      >
        <Link href={`/${locale}/insights`} style={{ color: 'inherit', textDecoration: 'none' }}>
          {t('navInsights')}
        </Link>
        <Link href={`/${locale}/publications`} style={{ color: 'inherit', textDecoration: 'none' }}>
          {t('navPublications')}
        </Link>
        <Link href={`/${locale}/contact`} style={{ color: 'inherit', textDecoration: 'none' }}>
          {t('navContact')}
        </Link>
        <LocaleSwitch currentLocale={locale} />
      </div>
    </nav>
  );
}
```

- [ ] **Step 2: Create SiteFooter**

Create `src/components/chrome/SiteFooter.tsx`:

```typescript
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

interface SiteFooterProps {
  locale: string;
}

export async function SiteFooter({ locale }: SiteFooterProps) {
  const t = await getTranslations('chrome');

  return (
    <footer
      style={{
        marginTop: 'auto',
        padding: '32px 28px',
        borderTop: '1px solid var(--color-rule)',
        background: 'var(--color-bg)',
        fontFamily: 'var(--font-mono)',
        fontSize: 10,
        color: 'var(--color-ink-mute)',
        letterSpacing: '0.04em',
        display: 'flex',
        justifyContent: 'space-between',
        gap: 24,
        flexWrap: 'wrap',
      }}
    >
      <span>© {new Date().getFullYear()} MERLx</span>
      <div style={{ display: 'flex', gap: 16 }}>
        <Link href={`/${locale}/legal/privacy`} style={{ color: 'inherit', textDecoration: 'none' }}>
          {t('footerPrivacy')}
        </Link>
        <Link href={`/${locale}/legal/terms`} style={{ color: 'inherit', textDecoration: 'none' }}>
          {t('footerTerms')}
        </Link>
        <Link href={`/${locale}/legal/cookies`} style={{ color: 'inherit', textDecoration: 'none' }}>
          {t('footerCookies')}
        </Link>
      </div>
    </footer>
  );
}
```

- [ ] **Step 3: Create PageShell**

Create `src/components/chrome/PageShell.tsx`:

```typescript
import { SiteFooter } from './SiteFooter';
import { SiteNav } from './SiteNav';
import type { ReactNode } from 'react';

interface PageShellProps {
  locale: string;
  children: ReactNode;
}

export function PageShell({ locale, children }: PageShellProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <SiteNav locale={locale} />
      <main style={{ flex: 1 }}>{children}</main>
      <SiteFooter locale={locale} />
    </div>
  );
}
```

- [ ] **Step 4: Add the new translation keys**

Modify `src/i18n/messages/en.json`:

```json
{
  "chrome": {
    "siteName": "MERLx",
    "navInsights": "Insights",
    "navPublications": "Publications",
    "navContact": "Contact",
    "footerPrivacy": "Privacy",
    "footerTerms": "Terms",
    "footerCookies": "Cookies"
  },
  "scaffold": {
    "tenantHeader": "Tenant",
    "localeHeader": "Locale",
    "directionHeader": "Direction"
  }
}
```

Modify `src/i18n/messages/ar.json` — add the three footer keys:

```json
{
  "chrome": {
    "siteName": "MERLx",
    "navInsights": "رؤى",
    "navPublications": "منشورات",
    "navContact": "تواصل",
    "footerPrivacy": "الخصوصية",
    "footerTerms": "الشروط",
    "footerCookies": "ملفات تعريف الارتباط"
  },
  "scaffold": {
    "tenantHeader": "المستأجر",
    "localeHeader": "اللغة",
    "directionHeader": "الاتجاه"
  }
}
```

Modify `src/i18n/messages/fr.json`:

```json
{
  "chrome": {
    "siteName": "MERLx",
    "navInsights": "Analyses",
    "navPublications": "Publications",
    "navContact": "Contact",
    "footerPrivacy": "Confidentialité",
    "footerTerms": "Conditions",
    "footerCookies": "Cookies"
  },
  "scaffold": {
    "tenantHeader": "Locataire",
    "localeHeader": "Langue",
    "directionHeader": "Direction"
  }
}
```

- [ ] **Step 5: Run checks + commit**

```bash
bun run typecheck
bun run lint
bun run test
bun run test:e2e
git add .
git commit -m "feat: SiteNav + SiteFooter + PageShell chrome components"
```

---

### Task 7: i18n message-key parity test

**Files:**
- Create: `tests/unit/i18n-key-parity.test.ts`

Per the Phase 0 final review (issue I6), enforce that all locale message files have the same key shape. This test catches translation drift early.

- [ ] **Step 1: Write the test**

Create `tests/unit/i18n-key-parity.test.ts`:

```typescript
import { describe, expect, it } from 'vitest';
import ar from '../../src/i18n/messages/ar.json';
import en from '../../src/i18n/messages/en.json';
import fr from '../../src/i18n/messages/fr.json';

function flattenKeys(obj: unknown, prefix = ''): string[] {
  if (typeof obj !== 'object' || obj === null) return [];
  return Object.entries(obj).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      return flattenKeys(value, path);
    }
    return [path];
  });
}

describe('i18n key parity', () => {
  const enKeys = flattenKeys(en).sort();

  it('ar has the same keys as en', () => {
    const arKeys = flattenKeys(ar).sort();
    expect(arKeys).toEqual(enKeys);
  });

  it('fr has the same keys as en', () => {
    const frKeys = flattenKeys(fr).sort();
    expect(frKeys).toEqual(enKeys);
  });
});
```

- [ ] **Step 2: Update tsconfig.json to allow JSON imports**

The current tsconfig has `resolveJsonModule: true` already (verified at Phase 0 Task 1), so this should just work. Confirm by reading `/Users/kmini/github/merlx-website/tsconfig.json` — line should read `"resolveJsonModule": true`. If missing, add it. If present, no change needed.

- [ ] **Step 3: Run**

```bash
bun run test
```

Expected: 23 unit tests (21 + 2 new).

- [ ] **Step 4: Run checks + commit**

```bash
bun run typecheck
bun run lint
git add .
git commit -m "test: i18n key parity test (catches translation drift)"
```

---

### Task 8: ChooserHero CSS — the v16 hover-split

**Files:**
- Create: `src/styles/chooser.css`
- Modify: `src/app/globals.css` (import the chooser CSS)

The v16 hover-split is CSS-only. Animation lives in a stylesheet alongside the component.

- [ ] **Step 1: Create the chooser stylesheet**

Create `src/styles/chooser.css`:

```css
/* v16 hover-split landing chooser
 * Studio = orange register · Network = teal register
 * Asymmetric push: hovering Studio shoves Network rightward (20cqw).
 * Hovering Network overlays Studio without disturbing it.
 * Content always anchored left within its panel via cqw units.
 */

.chooser {
  position: relative;
  height: 600px;
  container-type: inline-size;
  background: var(--color-bg);
}

.chooser-half {
  position: absolute;
  top: 0;
  width: 50%;
  height: 100%;
  overflow: hidden;
  background: var(--color-bg);
  cursor: pointer;
  z-index: 1;
  transition:
    width 0.55s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.55s cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.55s ease,
    filter 0.55s ease,
    background-color 0.55s ease,
    box-shadow 0.55s ease;
}

.chooser-half--studio {
  left: 0;
  border-right: 1px solid var(--color-rule);
}

.chooser-half--network {
  right: 0;
}

/* Group hover dims inactive */
.chooser:hover .chooser-half {
  opacity: 0.42;
  filter: saturate(0.35);
}

/* Hovered side expands and z-stacks above */
.chooser .chooser-half:hover {
  width: 70%;
  opacity: 1;
  filter: saturate(1.05);
  z-index: 3;
  box-shadow: 0 0 60px rgba(26, 26, 26, 0.06);
}

.chooser-half--studio:hover {
  background: var(--color-orange-tint-hover, #f9eee0);
}

.chooser-half--network:hover {
  background: var(--color-teal-tint-hover, #f3f5ee);
}

/* Asymmetric push: Studio's hover shoves Network rightward */
.chooser-half--studio:hover ~ .chooser-half--network {
  transform: translateX(20cqw);
}

/* Background SVG layer */
.chooser-bg {
  position: absolute;
  inset: 0;
  opacity: 0;
  pointer-events: none;
  overflow: hidden;
  transition: opacity 0.55s ease;
}

.chooser-half:hover .chooser-bg {
  opacity: 1;
}

.chooser-bg svg {
  width: 100%;
  height: 100%;
  display: block;
}

/* Content panel — always left-anchored to the chooser container */
.chooser-content {
  position: absolute;
  top: 0;
  left: 0;
  width: 50cqw;
  height: 100%;
  padding: 64px 44px 48px;
  display: flex;
  flex-direction: column;
  z-index: 2;
}

/* Eyebrow tag */
.chooser-tag {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  margin-bottom: 22px;
  transition: color 0.4s ease;
}

.chooser-half--studio .chooser-tag {
  color: var(--color-orange);
}

.chooser-half--network .chooser-tag {
  color: var(--color-teal);
}

.chooser-tag-swatch {
  width: 9px;
  height: 9px;
  border-radius: 50%;
}

.chooser-half--studio .chooser-tag-swatch {
  background: var(--color-orange);
}

.chooser-half--network .chooser-tag-swatch {
  background: var(--color-teal);
}

/* Name */
.chooser-name {
  font-family: var(--font-serif);
  font-weight: 600;
  font-size: 40px;
  color: var(--color-ink);
  letter-spacing: -0.014em;
  margin: 0 0 8px;
  line-height: 1;
}

.chooser-name em {
  font-style: italic;
  font-weight: 500;
}

.chooser-half--studio:hover .chooser-name em {
  color: var(--color-orange);
}

.chooser-half--network:hover .chooser-name em {
  color: var(--color-teal);
}

.chooser-tagline {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: 15px;
  color: var(--color-ink-mute);
  margin: 0 0 28px;
}

.chooser-rule {
  width: 56px;
  height: 2px;
  margin-bottom: 22px;
  transition: width 0.55s cubic-bezier(0.22, 1, 0.36, 1);
}

.chooser-half--studio .chooser-rule {
  background: var(--color-orange);
}

.chooser-half--network .chooser-rule {
  background: var(--color-teal);
}

.chooser-half:hover .chooser-rule {
  width: 96px;
}

.chooser-body {
  font-family: var(--font-serif);
  font-size: 15px;
  line-height: 1.6;
  color: var(--color-ink-soft);
  margin: 0 0 30px;
  max-width: 480px;
}

.chooser-list {
  list-style: none;
  padding: 0;
  margin: 0 0 32px;
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.04em;
  color: var(--color-ink-soft);
  display: flex;
  flex-direction: column;
  gap: 7px;
  max-width: 480px;
}

.chooser-list li {
  display: flex;
  gap: 11px;
  align-items: baseline;
  padding-bottom: 7px;
  border-bottom: 1px dotted var(--color-rule);
}

.chooser-list-key {
  color: var(--color-ink-mute);
  min-width: 22px;
}

.chooser-half--studio:hover .chooser-list-key {
  color: var(--color-orange);
}

.chooser-half--network:hover .chooser-list-key {
  color: var(--color-teal);
}

.chooser-list-val {
  color: var(--color-ink);
}

.chooser-foot {
  margin-top: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
}

.chooser-cta {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 13px 22px;
  border-radius: var(--radius-sm);
  font-family: var(--font-sans);
  font-size: 12.5px;
  font-weight: 500;
  letter-spacing: 0.01em;
  text-decoration: none;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.chooser-half--studio .chooser-cta {
  background: var(--color-orange);
  color: var(--color-bg);
}

.chooser-half--network .chooser-cta {
  background: var(--color-teal);
  color: var(--color-bg);
}

.chooser-half:hover .chooser-cta {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(26, 26, 26, 0.12);
}

.chooser-domain {
  font-family: var(--font-mono);
  font-size: 10.5px;
  color: var(--color-ink-mute);
  letter-spacing: 0.04em;
}

/* Reduce motion respect */
@media (prefers-reduced-motion: reduce) {
  .chooser-half,
  .chooser-bg,
  .chooser-rule,
  .chooser-cta {
    transition: none;
  }
  .chooser-half--studio:hover ~ .chooser-half--network {
    transform: none;
  }
}
```

- [ ] **Step 2: Add the missing CSS variables to globals.css**

Modify `src/app/globals.css` — add `--color-orange-tint-hover` and `--color-teal-tint-hover` to the existing `@theme` block. The current block has:

```css
@theme {
  --color-bg: #fbfaf5;
  ...
}
```

Add (after `--color-rule`):

```css
  --color-orange-tint-hover: #f9eee0;
  --color-teal-tint-hover: #f3f5ee;
```

(These already exist in `src/lib/design-tokens.ts`. Now they're in the CSS layer too.)

- [ ] **Step 3: Confirm no regressions**

```bash
cd /Users/kmini/github/merlx-website
bun run typecheck
bun run lint
bun run test
bun run test:e2e
```

Expected: all green. The CSS file isn't imported anywhere yet (Task 9 imports it), so visual nothing should change.

- [ ] **Step 4: Commit**

```bash
git add .
git commit -m "feat: chooser.css — v16 hover-split styles"
```

---

### Task 9: Background SVG components

**Files:**
- Create: `src/components/chooser/StudioBackground.tsx`
- Create: `src/components/chooser/NetworkBackground.tsx`

These are inline SVG React components. Static at v1 (animation deferred to v1.1 polish).

- [ ] **Step 1: Create StudioBackground (PRISM hex grid, orange)**

Create `src/components/chooser/StudioBackground.tsx`:

```typescript
/**
 * Studio side background: PRISM-style hex grid.
 * Orange register (warmth, compound risk).
 * Hot-zone cells use the maroon orange-hot variant.
 *
 * v1.0: static. Animation (slow pulse on hot cells) deferred to v1.1.
 */
export function StudioBackground() {
  return (
    <svg viewBox="0 0 600 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <g>
        {/* Row 1 */}
        <polygon points="60,40 100,20 140,40 140,80 100,100 60,80" stroke="var(--color-orange)" strokeWidth="0.7" fill="none" opacity="0.20" />
        <polygon points="140,40 180,20 220,40 220,80 180,100 140,80" fill="var(--color-orange)" opacity="0.05" />
        <polygon points="220,40 260,20 300,40 300,80 260,100 220,80" stroke="var(--color-orange)" strokeWidth="0.7" fill="none" opacity="0.20" />
        <polygon points="300,40 340,20 380,40 380,80 340,100 300,80" fill="var(--color-orange)" opacity="0.05" />
        <polygon points="380,40 420,20 460,40 460,80 420,100 380,80" stroke="var(--color-orange)" strokeWidth="0.7" fill="none" opacity="0.20" />
        <polygon points="460,40 500,20 540,40 540,80 500,100 460,80" fill="var(--color-orange)" opacity="0.05" />
        {/* Row 2 (with hot cell at 4) */}
        <polygon points="20,100 60,80 100,100 100,140 60,160 20,140" stroke="var(--color-orange)" strokeWidth="0.7" fill="none" opacity="0.20" />
        <polygon points="100,100 140,80 180,100 180,140 140,160 100,140" fill="var(--color-orange)" opacity="0.12" />
        <polygon points="180,100 220,80 260,100 260,140 220,160 180,140" fill="var(--color-orange)" opacity="0.05" />
        <polygon points="260,100 300,80 340,100 340,140 300,160 260,140" fill="var(--color-orange)" opacity="0.22" />
        <polygon points="340,100 380,80 420,100 420,140 380,160 340,140" fill="var(--color-orange)" opacity="0.12" />
        <polygon points="420,100 460,80 500,100 500,140 460,160 420,140" stroke="var(--color-orange)" strokeWidth="0.7" fill="none" opacity="0.20" />
        <polygon points="500,100 540,80 580,100 580,140 540,160 500,140" fill="var(--color-orange)" opacity="0.05" />
        {/* Row 3 — peak hot zones */}
        <polygon points="60,160 100,140 140,160 140,200 100,220 60,200" fill="var(--color-orange)" opacity="0.05" />
        <polygon points="140,160 180,140 220,160 220,200 180,220 140,200" fill="var(--color-orange)" opacity="0.12" />
        <polygon points="220,160 260,140 300,160 300,200 260,220 220,200" fill="var(--color-orange)" opacity="0.22" />
        <polygon points="300,160 340,140 380,160 380,200 340,220 300,200" fill="var(--color-orange-hot)" opacity="0.30" />
        <polygon points="380,160 420,140 460,160 460,200 420,220 380,200" fill="var(--color-orange)" opacity="0.22" />
        <polygon points="460,160 500,140 540,160 540,200 500,220 460,200" fill="var(--color-orange)" opacity="0.12" />
        {/* Row 4 */}
        <polygon points="20,220 60,200 100,220 100,260 60,280 20,260" stroke="var(--color-orange)" strokeWidth="0.7" fill="none" opacity="0.20" />
        <polygon points="100,220 140,200 180,220 180,260 140,280 100,260" fill="var(--color-orange)" opacity="0.12" />
        <polygon points="180,220 220,200 260,220 260,260 220,280 180,260" fill="var(--color-orange)" opacity="0.22" />
        <polygon points="260,220 300,200 340,220 340,260 300,280 260,260" fill="var(--color-orange-hot)" opacity="0.30" />
        <polygon points="340,220 380,200 420,220 420,260 380,280 340,260" fill="var(--color-orange)" opacity="0.22" />
        <polygon points="420,220 460,200 500,220 500,260 460,280 420,260" fill="var(--color-orange)" opacity="0.12" />
        <polygon points="500,220 540,200 580,220 580,260 540,280 500,260" stroke="var(--color-orange)" strokeWidth="0.7" fill="none" opacity="0.20" />
        {/* Row 5 */}
        <polygon points="60,280 100,260 140,280 140,320 100,340 60,320" fill="var(--color-orange)" opacity="0.05" />
        <polygon points="140,280 180,260 220,280 220,320 180,340 140,320" fill="var(--color-orange)" opacity="0.12" />
        <polygon points="220,280 260,260 300,280 300,320 260,340 220,320" fill="var(--color-orange)" opacity="0.22" />
        <polygon points="300,280 340,260 380,280 380,320 340,340 300,320" fill="var(--color-orange)" opacity="0.12" />
        <polygon points="380,280 420,260 460,280 460,320 420,340 380,320" fill="var(--color-orange)" opacity="0.05" />
        <polygon points="460,280 500,260 540,280 540,320 500,340 460,320" stroke="var(--color-orange)" strokeWidth="0.7" fill="none" opacity="0.20" />
        {/* Sparser bottom rows */}
        <polygon points="20,340 60,320 100,340 100,380 60,400 20,380" stroke="var(--color-orange)" strokeWidth="0.7" fill="none" opacity="0.20" />
        <polygon points="100,340 140,320 180,340 180,380 140,400 100,380" fill="var(--color-orange)" opacity="0.05" />
        <polygon points="180,340 220,320 260,340 260,380 220,400 180,380" fill="var(--color-orange)" opacity="0.12" />
        <polygon points="260,340 300,320 340,340 340,380 300,400 260,380" fill="var(--color-orange)" opacity="0.05" />
        <polygon points="340,340 380,320 420,340 420,380 380,400 340,380" stroke="var(--color-orange)" strokeWidth="0.7" fill="none" opacity="0.20" />
      </g>
    </svg>
  );
}
```

- [ ] **Step 2: Create NetworkBackground (world dot-map + node pins, teal)**

Create `src/components/chooser/NetworkBackground.tsx`:

```typescript
/**
 * Network side background: stylised world dot-map + node pins.
 * Teal register (federation, growth).
 * Active node (NileX/Sudan) has an outer pulse ring.
 *
 * v1.0: static. Animation (link-draw-in, node pulse) deferred to v1.1.
 */
export function NetworkBackground() {
  // Dot positions for continents (approximate equirectangular projection).
  const continentDots = [
    // North America
    [80, 100], [100, 100], [120, 100], [140, 100],
    [60, 120], [80, 120], [100, 120], [120, 120], [140, 120], [160, 120],
    [80, 140], [100, 140], [120, 140], [140, 140], [160, 140],
    [100, 160], [120, 160], [140, 160],
    // Central + South America
    [140, 180], [160, 200],
    [160, 220], [180, 220],
    [160, 240], [180, 240], [200, 240],
    [180, 260], [200, 260],
    [180, 280], [200, 280],
    [180, 300],
    // Europe
    [280, 100], [300, 100], [320, 100],
    [280, 120], [300, 120], [320, 120], [340, 120],
    [300, 140], [320, 140], [340, 140],
    // Africa
    [280, 160], [300, 160], [320, 160], [340, 160],
    [280, 180], [300, 180], [320, 180], [340, 180],
    [300, 200], [320, 200], [340, 200],
    [300, 220], [320, 220],
    [320, 240],
    [320, 260],
    // Asia
    [360, 100], [380, 100], [400, 100], [420, 100], [440, 100], [460, 100], [480, 100], [500, 100],
    [360, 120], [380, 120], [400, 120], [420, 120], [440, 120], [460, 120], [480, 120], [500, 120],
    [380, 140], [400, 140], [420, 140], [440, 140], [460, 140], [480, 140],
    [400, 160], [420, 160], [440, 160], [460, 160],
    [420, 180], [440, 180],
    // Australia
    [500, 240], [520, 240],
    [500, 260], [520, 260], [540, 260],
  ];

  return (
    <svg viewBox="0 0 600 360" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <g>
        {continentDots.map(([cx, cy]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="2" fill="var(--color-teal)" opacity="0.15" />
        ))}

        {/* Network links (dashed) */}
        <line x1="320" y1="180" x2="180" y2="240" stroke="var(--color-teal)" strokeWidth="0.7" opacity="0.4" strokeDasharray="2 3" />
        <line x1="320" y1="180" x2="335" y2="195" stroke="var(--color-teal)" strokeWidth="0.7" opacity="0.4" strokeDasharray="2 3" />
        <line x1="335" y1="195" x2="180" y2="240" stroke="var(--color-teal)" strokeWidth="0.7" opacity="0.4" strokeDasharray="2 3" />

        {/* NileX (Sudan) — active node */}
        <circle cx="320" cy="180" r="14" fill="none" stroke="var(--color-teal)" strokeWidth="0.6" opacity="0.25" />
        <circle cx="320" cy="180" r="9" fill="none" stroke="var(--color-teal)" strokeWidth="1.2" opacity="0.55" />
        <circle cx="320" cy="180" r="4" fill="var(--color-teal)" />
        <text x="328" y="174" fontFamily="var(--font-mono)" fontSize="8.5" fill="var(--color-ink)" letterSpacing="0.06em" fontWeight="500">
          NILEX · SUDAN
        </text>

        {/* Horn of Africa */}
        <circle cx="335" cy="195" r="7" fill="none" stroke="var(--color-teal)" strokeWidth="1.2" opacity="0.55" />
        <circle cx="335" cy="195" r="3" fill="var(--color-teal)" />
        <text x="343" y="200" fontFamily="var(--font-mono)" fontSize="8.5" fill="var(--color-ink)" letterSpacing="0.06em" fontWeight="500">
          HORN OF AFRICA
        </text>

        {/* Colombia */}
        <circle cx="180" cy="240" r="7" fill="none" stroke="var(--color-teal)" strokeWidth="1.2" opacity="0.55" />
        <circle cx="180" cy="240" r="3" fill="var(--color-teal)" />
        <text x="142" y="258" fontFamily="var(--font-mono)" fontSize="8.5" fill="var(--color-ink)" letterSpacing="0.06em" fontWeight="500">
          COLOMBIA
        </text>
      </g>
    </svg>
  );
}
```

- [ ] **Step 3: Run checks + commit**

```bash
bun run typecheck
bun run lint
git add .
git commit -m "feat: studio + network chooser background SVGs"
```

---

### Task 10: ChooserHero component

**Files:**
- Create: `src/components/chooser/ChooserHero.tsx`
- Modify: `src/i18n/messages/en.json`, `ar.json`, `fr.json` (chooser strings)

- [ ] **Step 1: Add chooser i18n strings — English**

Modify `src/i18n/messages/en.json` — add a `chooser` block:

```json
{
  "chrome": { ... unchanged ... },
  "scaffold": { ... unchanged ... },
  "chooser": {
    "studioTag": "THE TECH STUDIO",
    "studioName": "MERLx Studio",
    "studioTagline": "Open analytical tools for fragile contexts.",
    "studioBody": "An independent studio building the Optics Suite — open AI tools for monitoring, evaluation, research and early warning. Conflict-sensitive by design, evidence-grade by default.",
    "studioBullet1": "The Optics Suite — six tools",
    "studioBullet2": "Engagement: hosted, pilots, build-with, advisory",
    "studioBullet3": "Open data · open stack · open methods",
    "studioCta": "Enter MERLx Studio →",
    "networkTag": "THE MERL NETWORK",
    "networkName": "MERLx Network",
    "networkTagline": "Locally owned MERL, in-country.",
    "networkBody": "A federation of locally owned MERL cooperatives — research, evaluation, third-party monitoring, and field analysis. The MERL Guild: contextually grounded, locally led, globally connected.",
    "networkBullet1": "Active nodes · NileX (Sudan / HoA)",
    "networkBullet2": "Services: research, evaluation, TPM, training",
    "networkBullet3": "Become a node · partner with the network"
  }
}
```

(Preserve the `chrome` and `scaffold` blocks already in the file.)

- [ ] **Step 2: Mirror to ar.json and fr.json**

Add the same `chooser` block to `src/i18n/messages/ar.json` and `src/i18n/messages/fr.json` with translations OR with placeholder English values marked for translation. For v1 minimum:

`ar.json` chooser block:

```json
"chooser": {
  "studioTag": "ستوديو التكنولوجيا",
  "studioName": "MERLx Studio",
  "studioTagline": "أدوات تحليلية مفتوحة للسياقات الهشة.",
  "studioBody": "ستوديو مستقل يبني مجموعة Optics — أدوات ذكاء اصطناعي مفتوحة للرصد والتقييم والبحث والإنذار المبكر.",
  "studioBullet1": "مجموعة Optics — ستة أدوات",
  "studioBullet2": "التعاون: استضافة، تجارب، بناء معًا، استشارات",
  "studioBullet3": "بيانات مفتوحة · حزمة مفتوحة · أساليب مفتوحة",
  "studioCta": "دخول MERLx Studio ←",
  "networkTag": "شبكة MERL",
  "networkName": "MERLx Network",
  "networkTagline": "MERL مملوكة محليًا، داخل البلد.",
  "networkBody": "اتحاد من تعاونيات MERL المملوكة محليًا — البحث والتقييم والرصد من طرف ثالث والتحليل الميداني.",
  "networkBullet1": "العقد النشطة · NileX (السودان / القرن الأفريقي)",
  "networkBullet2": "الخدمات: البحث، التقييم، TPM، التدريب",
  "networkBullet3": "كن عقدة · شارك في الشبكة"
}
```

`fr.json` chooser block:

```json
"chooser": {
  "studioTag": "LE STUDIO TECH",
  "studioName": "MERLx Studio",
  "studioTagline": "Outils analytiques ouverts pour contextes fragiles.",
  "studioBody": "Un studio indépendant qui construit l'Optics Suite — des outils d'IA ouverts pour le suivi, l'évaluation, la recherche et l'alerte précoce.",
  "studioBullet1": "L'Optics Suite — six outils",
  "studioBullet2": "Engagement : hébergé, pilotes, build-with, conseil",
  "studioBullet3": "Données ouvertes · pile ouverte · méthodes ouvertes",
  "studioCta": "Entrer dans MERLx Studio →",
  "networkTag": "LE RÉSEAU MERL",
  "networkName": "MERLx Network",
  "networkTagline": "MERL en propriété locale, sur le terrain.",
  "networkBody": "Une fédération de coopératives MERL en propriété locale — recherche, évaluation, suivi tiers, et analyse de terrain.",
  "networkBullet1": "Nœuds actifs · NileX (Soudan / Corne de l'Afrique)",
  "networkBullet2": "Services : recherche, évaluation, TPM, formation",
  "networkBullet3": "Devenir un nœud · rejoindre le réseau"
}
```

(The i18n parity test from Task 7 will fail if any keys are missing — run it.)

- [ ] **Step 3: Create ChooserHero component**

Create `src/components/chooser/ChooserHero.tsx`:

```typescript
import { NetworkBackground } from './NetworkBackground';
import { StudioBackground } from './StudioBackground';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import '@/styles/chooser.css';

export async function ChooserHero() {
  const t = await getTranslations('chooser');

  return (
    <div className="chooser">
      {/* Studio (left) */}
      <div className="chooser-half chooser-half--studio">
        <div className="chooser-bg">
          <StudioBackground />
        </div>
        <div className="chooser-content">
          <div className="chooser-tag">
            <span className="chooser-tag-swatch" />
            {t('studioTag')}
          </div>
          <h2 className="chooser-name">
            MERL<em>x</em> Studio
          </h2>
          <p className="chooser-tagline">{t('studioTagline')}</p>
          <div className="chooser-rule" />
          <p className="chooser-body">{t('studioBody')}</p>
          <ul className="chooser-list">
            <li>
              <span className="chooser-list-key">→</span>
              <span className="chooser-list-val">{t('studioBullet1')}</span>
            </li>
            <li>
              <span className="chooser-list-key">→</span>
              <span className="chooser-list-val">{t('studioBullet2')}</span>
            </li>
            <li>
              <span className="chooser-list-key">→</span>
              <span className="chooser-list-val">{t('studioBullet3')}</span>
            </li>
          </ul>
          <div className="chooser-foot">
            <Link href="https://studio.merlx.org" className="chooser-cta">
              {t('studioCta')}
            </Link>
            <span className="chooser-domain">studio.merlx.org</span>
          </div>
        </div>
      </div>

      {/* Network (right) */}
      <div className="chooser-half chooser-half--network">
        <div className="chooser-bg">
          <NetworkBackground />
        </div>
        <div className="chooser-content">
          <div className="chooser-tag">
            <span className="chooser-tag-swatch" />
            {t('networkTag')}
          </div>
          <h2 className="chooser-name">
            MERL<em>x</em> Network
          </h2>
          <p className="chooser-tagline">{t('networkTagline')}</p>
          <div className="chooser-rule" />
          <p className="chooser-body">{t('networkBody')}</p>
          <ul className="chooser-list">
            <li>
              <span className="chooser-list-key">→</span>
              <span className="chooser-list-val">{t('networkBullet1')}</span>
            </li>
            <li>
              <span className="chooser-list-key">→</span>
              <span className="chooser-list-val">{t('networkBullet2')}</span>
            </li>
            <li>
              <span className="chooser-list-key">→</span>
              <span className="chooser-list-val">{t('networkBullet3')}</span>
            </li>
          </ul>
          <div className="chooser-foot">
            <Link href="https://network.merlx.org" className="chooser-cta">
              Enter the Network →
            </Link>
            <span className="chooser-domain">network.merlx.org</span>
          </div>
        </div>
      </div>
    </div>
  );
}
```

(Note: the Network CTA text "Enter the Network →" is currently hardcoded English. Add a `networkCta` key to the messages files if you want it localised. For v1 simplicity, hardcoded is acceptable — the Studio CTA gets a translation key as a pattern showcase.)

Actually — for consistency, add `networkCta` to the messages too. Update each `chooser` block:

`en.json`: add `"networkCta": "Enter the Network →"`
`ar.json`: add `"networkCta": "دخول الشبكة ←"`
`fr.json`: add `"networkCta": "Entrer dans le Réseau →"`

And replace the hardcoded English in the component:

```typescript
<Link href="https://network.merlx.org" className="chooser-cta">
  {t('networkCta')}
</Link>
```

- [ ] **Step 4: Run i18n parity test + all checks**

```bash
bun run typecheck
bun run lint
bun run test
```

Expected: i18n key parity test still passes (en/ar/fr all have the same chooser keys).

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "feat: ChooserHero component + chooser i18n strings"
```

---

### Task 11: Wire ChooserHero into the landing page (group tenant only)

**Files:**
- Modify: `src/app/(frontend)/[locale]/page.tsx`
- Test: `tests/e2e/chooser-hover.spec.ts`

- [ ] **Step 1: Replace the placeholder home with the chooser**

Replace `src/app/(frontend)/[locale]/page.tsx`:

```typescript
import { ChooserHero } from '@/components/chooser/ChooserHero';
import { PageShell } from '@/components/chrome/PageShell';
import { isGroupTenant } from '@/lib/tenant-aware';
import { setRequestLocale } from 'next-intl/server';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const headerList = await headers();
  if (!isGroupTenant(headerList)) notFound();

  return (
    <PageShell locale={locale}>
      <ChooserHero />
    </PageShell>
  );
}
```

- [ ] **Step 2: Add an E2E test for chooser hover behaviour**

Create `tests/e2e/chooser-hover.spec.ts`:

```typescript
import { expect, test } from '@playwright/test';

test('chooser renders both halves', async ({ page }) => {
  await page.goto('/en');
  await expect(page.locator('.chooser-half--studio')).toBeVisible();
  await expect(page.locator('.chooser-half--network')).toBeVisible();
  await expect(page.getByRole('link', { name: /MERLx Studio/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /Network/i })).toBeVisible();
});

test('hovering studio expands its width', async ({ page }) => {
  await page.goto('/en');
  const studio = page.locator('.chooser-half--studio');

  const baseBox = await studio.boundingBox();
  await studio.hover();
  // Wait for transition
  await page.waitForTimeout(700);
  const hoverBox = await studio.boundingBox();

  expect(baseBox).not.toBeNull();
  expect(hoverBox).not.toBeNull();
  if (baseBox && hoverBox) {
    expect(hoverBox.width).toBeGreaterThan(baseBox.width);
  }
});

test('hovering studio pushes network rightward', async ({ page }) => {
  await page.goto('/en');
  const studio = page.locator('.chooser-half--studio');
  const network = page.locator('.chooser-half--network');

  const baseNetworkBox = await network.boundingBox();
  await studio.hover();
  await page.waitForTimeout(700);
  const hoverNetworkBox = await network.boundingBox();

  expect(baseNetworkBox).not.toBeNull();
  expect(hoverNetworkBox).not.toBeNull();
  if (baseNetworkBox && hoverNetworkBox) {
    // Network's left edge should be further right
    expect(hoverNetworkBox.x).toBeGreaterThan(baseNetworkBox.x);
  }
});

test('hovering network does NOT push studio', async ({ page }) => {
  await page.goto('/en');
  const studio = page.locator('.chooser-half--studio');
  const network = page.locator('.chooser-half--network');

  const baseStudioBox = await studio.boundingBox();
  await network.hover();
  await page.waitForTimeout(700);
  const hoverStudioBox = await studio.boundingBox();

  expect(baseStudioBox).not.toBeNull();
  expect(hoverStudioBox).not.toBeNull();
  if (baseStudioBox && hoverStudioBox) {
    // Studio's left edge should NOT shift
    expect(hoverStudioBox.x).toBe(baseStudioBox.x);
  }
});
```

- [ ] **Step 3: Run all checks**

```bash
cd /Users/kmini/github/merlx-website
bun run typecheck
bun run lint
bun run test
bun run test:e2e
```

Expected: 4 new E2E tests pass. Total ~17 E2E tests (note: the prior `data-tenant` reflection test from Phase 0 will still pass against the chooser since the chooser renders inside `PageShell` which renders inside the `[locale]/layout.tsx` setting `data-tenant`).

If hover tests are flaky (Playwright sometimes has timing issues with CSS transitions), bump the `waitForTimeout` to 800ms or use Playwright's `toHaveCSS` to wait for `width` to change.

- [ ] **Step 4: Commit**

```bash
git add .
git commit -m "feat: wire ChooserHero into landing page (group tenant only)"
```

---

### Task 12: Tenant gating — Studio/Network/Node hosts 404 the group routes

**Files:**
- Test: `tests/e2e/tenant-gating.spec.ts`

The landing page already 404s on non-group tenants (Task 11 added `notFound()` if `!isGroupTenant`). Add an E2E that proves it.

- [ ] **Step 1: Add the gating test**

Create `tests/e2e/tenant-gating.spec.ts`:

```typescript
import { expect, test } from '@playwright/test';

test('studio host gets 404 on /', async ({ request }) => {
  const res = await request.get('/en', {
    headers: { host: 'studio.localhost.test' },
  });
  expect(res.status()).toBe(404);
});

test('network host gets 404 on /', async ({ request }) => {
  const res = await request.get('/en', {
    headers: { host: 'network.localhost.test' },
  });
  expect(res.status()).toBe(404);
});

test('node host gets 404 on /', async ({ request }) => {
  const res = await request.get('/en', {
    headers: { host: 'nilex.localhost.test' },
  });
  expect(res.status()).toBe(404);
});

test('group host gets 200 on /', async ({ request }) => {
  const res = await request.get('/en', {
    headers: { host: 'localhost.test' },
  });
  expect(res.status()).toBe(200);
});
```

- [ ] **Step 2: Run E2E + commit**

```bash
bun run test:e2e
git add tests/e2e/tenant-gating.spec.ts
git commit -m "test: tenant gating for group-only routes"
```

---

### Task 13: RichTextRenderer + generic CMS Pages routing

**Files:**
- Create: `src/components/pages/RichTextRenderer.tsx`
- Create: `src/app/(frontend)/[locale]/about/page.tsx`
- Create: `src/app/(frontend)/[locale]/legal/[slug]/page.tsx`

- [ ] **Step 1: Create RichTextRenderer**

Payload v3's Lexical editor stores content as a JSON tree. The `@payloadcms/richtext-lexical/react` package provides a renderer.

```bash
cd /Users/kmini/github/merlx-website
bun add @payloadcms/richtext-lexical
```

(Already installed in Phase 0; this is a no-op confirming presence.)

Create `src/components/pages/RichTextRenderer.tsx`:

```typescript
import { RichText } from '@payloadcms/richtext-lexical/react';
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical';

interface RichTextRendererProps {
  data: SerializedEditorState | null | undefined;
}

export function RichTextRenderer({ data }: RichTextRendererProps) {
  if (!data) return null;
  return <RichText data={data} />;
}
```

(If the import path is different in the installed Payload version, check `node_modules/@payloadcms/richtext-lexical/dist/exports/` for the right react export. Adjust if needed.)

- [ ] **Step 2: Create the About page**

Create `src/app/(frontend)/[locale]/about/page.tsx`:

```typescript
import { RichTextRenderer } from '@/components/pages/RichTextRenderer';
import { PageShell } from '@/components/chrome/PageShell';
import { isGroupTenant } from '@/lib/tenant-aware';
import config from '@/payload.config';
import { setRequestLocale } from 'next-intl/server';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { getPayload } from 'payload';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function AboutPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const headerList = await headers();
  if (!isGroupTenant(headerList)) notFound();

  const payload = await getPayload({ config });
  const tenantDomain = headerList.get('x-tenant-domain') ?? 'merlx.org';

  // Find the group tenant ID
  const tenantQuery = await payload.find({
    collection: 'tenants',
    where: { domain: { equals: tenantDomain } },
    limit: 1,
  });
  const tenant = tenantQuery.docs[0];
  if (!tenant) notFound();

  const pageQuery = await payload.find({
    collection: 'pages',
    where: {
      and: [{ slug: { equals: 'about' } }, { tenant: { equals: tenant.id } }, { status: { equals: 'published' } }],
    },
    locale: locale as 'en' | 'ar' | 'fr',
    limit: 1,
  });

  const page = pageQuery.docs[0];
  if (!page) notFound();

  return (
    <PageShell locale={locale}>
      <article style={{ maxWidth: 720, margin: '0 auto', padding: '64px 24px' }}>
        <h1
          style={{
            fontFamily: 'var(--font-serif)',
            fontWeight: 600,
            fontSize: 38,
            color: 'var(--color-ink)',
            letterSpacing: '-0.014em',
            margin: '0 0 12px',
          }}
        >
          {page.title}
        </h1>
        {page.subtitle && (
          <p style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', color: 'var(--color-ink-mute)', fontSize: 16, marginBottom: 32 }}>
            {page.subtitle}
          </p>
        )}
        <RichTextRenderer data={page.body} />
      </article>
    </PageShell>
  );
}
```

- [ ] **Step 3: Create the legal slug page (privacy / terms / cookies)**

Create `src/app/(frontend)/[locale]/legal/[slug]/page.tsx`:

```typescript
import { RichTextRenderer } from '@/components/pages/RichTextRenderer';
import { PageShell } from '@/components/chrome/PageShell';
import { isGroupTenant } from '@/lib/tenant-aware';
import config from '@/payload.config';
import { setRequestLocale } from 'next-intl/server';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { getPayload } from 'payload';

const ALLOWED_SLUGS = ['privacy', 'terms', 'cookies'] as const;

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export default async function LegalPage({ params }: PageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  if (!ALLOWED_SLUGS.includes(slug as (typeof ALLOWED_SLUGS)[number])) notFound();

  const headerList = await headers();
  if (!isGroupTenant(headerList)) notFound();

  const payload = await getPayload({ config });
  const tenantDomain = headerList.get('x-tenant-domain') ?? 'merlx.org';

  const tenantQuery = await payload.find({
    collection: 'tenants',
    where: { domain: { equals: tenantDomain } },
    limit: 1,
  });
  const tenant = tenantQuery.docs[0];
  if (!tenant) notFound();

  const pageQuery = await payload.find({
    collection: 'pages',
    where: {
      and: [
        { slug: { equals: `legal/${slug}` } },
        { tenant: { equals: tenant.id } },
        { status: { equals: 'published' } },
      ],
    },
    locale: locale as 'en' | 'ar' | 'fr',
    limit: 1,
  });

  const page = pageQuery.docs[0];
  if (!page) notFound();

  return (
    <PageShell locale={locale}>
      <article style={{ maxWidth: 720, margin: '0 auto', padding: '64px 24px' }}>
        <h1
          style={{
            fontFamily: 'var(--font-serif)',
            fontWeight: 600,
            fontSize: 32,
            color: 'var(--color-ink)',
            letterSpacing: '-0.012em',
            margin: '0 0 24px',
          }}
        >
          {page.title}
        </h1>
        <RichTextRenderer data={page.body} />
      </article>
    </PageShell>
  );
}
```

- [ ] **Step 4: Run checks + commit**

```bash
bun run typecheck
bun run lint
git add .
git commit -m "feat: about + legal CMS-driven pages"
```

(No E2E test yet because pages don't exist in DB. Task 14 seeds them.)

---

### Task 14: Seed About + Legal pages

**Files:**
- Create: `scripts/seed-content.ts`
- Modify: `package.json`

- [ ] **Step 1: Create the seed script**

Create `scripts/seed-content.ts`:

```typescript
import config from '../src/payload.config';
import { getPayload } from 'payload';

interface SeedPage {
  slug: string;
  title: string;
  subtitle?: string;
  body: string; // plain text — will be wrapped in a Lexical paragraph node
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
      } as Parameters<typeof payload.create>[0]['data'],
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
```

- [ ] **Step 2: Add the script to package.json**

Add to the `scripts` block:

```json
"seed:content": "bun run --env-file=.env.local scripts/seed-content.ts"
```

- [ ] **Step 3: Run the seed**

```bash
cd /Users/kmini/github/merlx-website
bun run seed:content
```

Expected:

```
  + seeded: pages/about
  + seeded: pages/legal/privacy
  + seeded: pages/legal/terms
  + seeded: pages/legal/cookies
Content seed complete.
```

- [ ] **Step 4: Add E2E for the rendered pages**

Append to `tests/e2e/group-routes.spec.ts` (create the file):

```typescript
import { expect, test } from '@playwright/test';

test('about page renders the seeded title', async ({ page }) => {
  await page.goto('/en/about');
  await expect(page.getByRole('heading', { level: 1, name: 'About MERLx' })).toBeVisible();
});

test('legal/privacy renders', async ({ page }) => {
  await page.goto('/en/legal/privacy');
  await expect(page.getByRole('heading', { level: 1, name: 'Privacy Policy' })).toBeVisible();
});

test('legal/terms renders', async ({ page }) => {
  await page.goto('/en/legal/terms');
  await expect(page.getByRole('heading', { level: 1, name: 'Terms of Use' })).toBeVisible();
});

test('legal/cookies renders', async ({ page }) => {
  await page.goto('/en/legal/cookies');
  await expect(page.getByRole('heading', { level: 1, name: 'Cookie Policy' })).toBeVisible();
});

test('legal/unknown 404s', async ({ page }) => {
  const response = await page.goto('/en/legal/unknown', { waitUntil: 'commit' });
  expect(response?.status()).toBe(404);
});
```

- [ ] **Step 5: Run all checks + commit**

```bash
bun run typecheck
bun run lint
bun run test
bun run test:e2e
git add scripts/seed-content.ts package.json tests/e2e/group-routes.spec.ts
git commit -m "feat: seed about + legal pages, E2E coverage"
```

---

### Task 15: aggregate-feed helper + Insights index

**Files:**
- Create: `src/lib/aggregate-feed.ts`
- Test: `tests/unit/aggregate-feed.test.ts`
- Create: `src/app/(frontend)/[locale]/insights/page.tsx`
- Create: `src/app/(frontend)/[locale]/insights/[slug]/page.tsx`

- [ ] **Step 1: Write the unit test for the aggregate query builder**

Create `tests/unit/aggregate-feed.test.ts`:

```typescript
import { describe, expect, it } from 'vitest';
import { buildAggregateInsightsQuery, buildAggregatePublicationsQuery } from '../../src/lib/aggregate-feed';

describe('buildAggregateInsightsQuery', () => {
  it('on group tenant returns syndicated + group-owned posts', () => {
    const q = buildAggregateInsightsQuery({ tenantKind: 'group', tenantId: 1 });
    expect(q).toEqual({
      and: [
        { status: { equals: 'published' } },
        {
          or: [
            { tenant: { equals: 1 } },
            { syndicate: { equals: true } },
          ],
        },
      ],
    });
  });

  it('on studio/network/node tenant returns only own posts', () => {
    const q = buildAggregateInsightsQuery({ tenantKind: 'studio', tenantId: 2 });
    expect(q).toEqual({
      and: [
        { status: { equals: 'published' } },
        { tenant: { equals: 2 } },
      ],
    });
  });
});

describe('buildAggregatePublicationsQuery', () => {
  it('mirrors the insights query shape', () => {
    const q = buildAggregatePublicationsQuery({ tenantKind: 'group', tenantId: 1 });
    expect(q).toEqual({
      and: [
        { status: { equals: 'published' } },
        {
          or: [
            { tenant: { equals: 1 } },
            { syndicate: { equals: true } },
          ],
        },
      ],
    });
  });
});
```

- [ ] **Step 2: Implement**

Create `src/lib/aggregate-feed.ts`:

```typescript
import type { TenantContext } from './tenant-aware';

interface BuildArgs {
  tenantKind: TenantContext['kind'];
  tenantId: number;
}

/**
 * Build a Where clause that returns the right set of Insights posts
 * for a given tenant context.
 *
 * - Group tenant: own posts + any syndicated post from sub-tenants.
 * - Studio / Network / Node: only own posts.
 */
export function buildAggregateInsightsQuery({ tenantKind, tenantId }: BuildArgs) {
  if (tenantKind === 'group') {
    return {
      and: [
        { status: { equals: 'published' } },
        {
          or: [
            { tenant: { equals: tenantId } },
            { syndicate: { equals: true } },
          ],
        },
      ],
    };
  }

  return {
    and: [
      { status: { equals: 'published' } },
      { tenant: { equals: tenantId } },
    ],
  };
}

/**
 * Same query shape as Insights, applied to Publications.
 */
export function buildAggregatePublicationsQuery(args: BuildArgs) {
  return buildAggregateInsightsQuery(args);
}
```

- [ ] **Step 3: Verify unit tests pass**

```bash
bun run test
```

Expected: 3 new tests pass (total 26 unit tests).

- [ ] **Step 4: Create Insights index page**

Create `src/app/(frontend)/[locale]/insights/page.tsx`:

```typescript
import { PageShell } from '@/components/chrome/PageShell';
import { buildAggregateInsightsQuery } from '@/lib/aggregate-feed';
import { isGroupTenant, parseTenantHeaders } from '@/lib/tenant-aware';
import config from '@/payload.config';
import { setRequestLocale } from 'next-intl/server';
import { headers } from 'next/headers';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPayload } from 'payload';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function InsightsIndex({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const headerList = await headers();
  if (!isGroupTenant(headerList)) notFound();

  const tenant = parseTenantHeaders(headerList);
  const payload = await getPayload({ config });

  const tenantQuery = await payload.find({
    collection: 'tenants',
    where: { domain: { equals: tenant.domain } },
    limit: 1,
  });
  const groupTenant = tenantQuery.docs[0];
  if (!groupTenant) notFound();

  const where = buildAggregateInsightsQuery({
    tenantKind: 'group',
    tenantId: groupTenant.id,
  });

  const posts = await payload.find({
    collection: 'insights-posts',
    where,
    locale: locale as 'en' | 'ar' | 'fr',
    sort: '-publishedAt',
    limit: 50,
  });

  return (
    <PageShell locale={locale}>
      <article style={{ maxWidth: 880, margin: '0 auto', padding: '64px 24px' }}>
        <h1
          style={{
            fontFamily: 'var(--font-serif)',
            fontWeight: 600,
            fontSize: 38,
            color: 'var(--color-ink)',
            letterSpacing: '-0.014em',
            margin: '0 0 32px',
          }}
        >
          Insights
        </h1>

        {posts.docs.length === 0 ? (
          <p style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ink-mute)', fontStyle: 'italic' }}>
            Nothing published yet. Check back soon.
          </p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 24 }}>
            {posts.docs.map((post) => (
              <li
                key={post.id}
                style={{ borderBottom: '1px solid var(--color-rule)', paddingBottom: 24 }}
              >
                <Link
                  href={`/${locale}/insights/${post.slug}`}
                  style={{ textDecoration: 'none', color: 'var(--color-ink)' }}
                >
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 10,
                      letterSpacing: '0.16em',
                      textTransform: 'uppercase',
                      color: 'var(--color-ink-mute)',
                      marginBottom: 8,
                    }}
                  >
                    {post.category} · {new Date(post.publishedAt).toLocaleDateString(locale)}
                  </div>
                  <h2
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontWeight: 600,
                      fontSize: 22,
                      color: 'var(--color-ink)',
                      margin: '0 0 8px',
                    }}
                  >
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ink-soft)', margin: 0 }}>
                      {post.excerpt}
                    </p>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </article>
    </PageShell>
  );
}
```

- [ ] **Step 5: Create Insights slug page**

Create `src/app/(frontend)/[locale]/insights/[slug]/page.tsx`:

```typescript
import { RichTextRenderer } from '@/components/pages/RichTextRenderer';
import { PageShell } from '@/components/chrome/PageShell';
import { isGroupTenant } from '@/lib/tenant-aware';
import config from '@/payload.config';
import { setRequestLocale } from 'next-intl/server';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { getPayload } from 'payload';

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export default async function InsightsPost({ params }: PageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const headerList = await headers();
  if (!isGroupTenant(headerList)) notFound();

  const payload = await getPayload({ config });

  const postQuery = await payload.find({
    collection: 'insights-posts',
    where: {
      and: [{ slug: { equals: slug } }, { status: { equals: 'published' } }],
    },
    locale: locale as 'en' | 'ar' | 'fr',
    limit: 1,
  });

  const post = postQuery.docs[0];
  if (!post) notFound();

  return (
    <PageShell locale={locale}>
      <article style={{ maxWidth: 720, margin: '0 auto', padding: '64px 24px' }}>
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: 'var(--color-ink-mute)',
            marginBottom: 16,
          }}
        >
          {post.category} · {new Date(post.publishedAt).toLocaleDateString(locale)}
        </div>
        <h1
          style={{
            fontFamily: 'var(--font-serif)',
            fontWeight: 600,
            fontSize: 38,
            color: 'var(--color-ink)',
            letterSpacing: '-0.014em',
            margin: '0 0 24px',
          }}
        >
          {post.title}
        </h1>
        {post.excerpt && (
          <p style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', color: 'var(--color-ink-soft)', fontSize: 17, marginBottom: 32 }}>
            {post.excerpt}
          </p>
        )}
        <RichTextRenderer data={post.body} />
      </article>
    </PageShell>
  );
}
```

- [ ] **Step 6: Run checks + commit**

```bash
bun run typecheck
bun run lint
bun run test
bun run test:e2e
git add .
git commit -m "feat: aggregate-feed helper + insights index/slug pages"
```

---

### Task 16: Publications index + slug

**Files:**
- Create: `src/app/(frontend)/[locale]/publications/page.tsx`
- Create: `src/app/(frontend)/[locale]/publications/[slug]/page.tsx`

- [ ] **Step 1: Create Publications index**

Create `src/app/(frontend)/[locale]/publications/page.tsx`:

```typescript
import { PageShell } from '@/components/chrome/PageShell';
import { buildAggregatePublicationsQuery } from '@/lib/aggregate-feed';
import { isGroupTenant, parseTenantHeaders } from '@/lib/tenant-aware';
import config from '@/payload.config';
import { setRequestLocale } from 'next-intl/server';
import { headers } from 'next/headers';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPayload } from 'payload';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function PublicationsIndex({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const headerList = await headers();
  if (!isGroupTenant(headerList)) notFound();

  const tenant = parseTenantHeaders(headerList);
  const payload = await getPayload({ config });

  const tenantQuery = await payload.find({
    collection: 'tenants',
    where: { domain: { equals: tenant.domain } },
    limit: 1,
  });
  const groupTenant = tenantQuery.docs[0];
  if (!groupTenant) notFound();

  const where = buildAggregatePublicationsQuery({
    tenantKind: 'group',
    tenantId: groupTenant.id,
  });

  const pubs = await payload.find({
    collection: 'publications',
    where,
    locale: locale as 'en' | 'ar' | 'fr',
    sort: '-year',
    limit: 100,
  });

  return (
    <PageShell locale={locale}>
      <article style={{ maxWidth: 980, margin: '0 auto', padding: '64px 24px' }}>
        <h1
          style={{
            fontFamily: 'var(--font-serif)',
            fontWeight: 600,
            fontSize: 38,
            color: 'var(--color-ink)',
            letterSpacing: '-0.014em',
            margin: '0 0 32px',
          }}
        >
          Publications
        </h1>

        {pubs.docs.length === 0 ? (
          <p style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ink-mute)', fontStyle: 'italic' }}>
            Nothing published yet.
          </p>
        ) : (
          <table style={{ borderCollapse: 'collapse', width: '100%' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--color-rule)' }}>
                <th style={{ textAlign: 'start', padding: '12px 12px 12px 0', fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--color-ink-mute)' }}>
                  Year
                </th>
                <th style={{ textAlign: 'start', padding: '12px', fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--color-ink-mute)' }}>
                  Type
                </th>
                <th style={{ textAlign: 'start', padding: '12px', fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--color-ink-mute)' }}>
                  Title
                </th>
                <th style={{ textAlign: 'start', padding: '12px', fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--color-ink-mute)' }}>
                  Authors
                </th>
              </tr>
            </thead>
            <tbody>
              {pubs.docs.map((pub) => (
                <tr key={pub.id} style={{ borderBottom: '1px solid var(--color-rule)' }}>
                  <td style={{ padding: '14px 12px 14px 0', fontFamily: 'var(--font-mono)', fontSize: 12 }}>{pub.year}</td>
                  <td style={{ padding: '14px 12px', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--color-ink-soft)' }}>{pub.type}</td>
                  <td style={{ padding: '14px 12px' }}>
                    <Link href={`/${locale}/publications/${pub.slug}`} style={{ color: 'var(--color-ink)', textDecoration: 'none', fontWeight: 500 }}>
                      {pub.title}
                    </Link>
                  </td>
                  <td style={{ padding: '14px 12px', fontSize: 13, color: 'var(--color-ink-soft)' }}>
                    {(pub.authors ?? []).map((a) => a.name).join(', ')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </article>
    </PageShell>
  );
}
```

- [ ] **Step 2: Create Publications slug page**

Create `src/app/(frontend)/[locale]/publications/[slug]/page.tsx`:

```typescript
import { PageShell } from '@/components/chrome/PageShell';
import { isGroupTenant } from '@/lib/tenant-aware';
import config from '@/payload.config';
import { setRequestLocale } from 'next-intl/server';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { getPayload } from 'payload';

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export default async function PublicationDetail({ params }: PageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const headerList = await headers();
  if (!isGroupTenant(headerList)) notFound();

  const payload = await getPayload({ config });

  const pubQuery = await payload.find({
    collection: 'publications',
    where: {
      and: [{ slug: { equals: slug } }, { status: { equals: 'published' } }],
    },
    locale: locale as 'en' | 'ar' | 'fr',
    limit: 1,
  });

  const pub = pubQuery.docs[0];
  if (!pub) notFound();

  return (
    <PageShell locale={locale}>
      <article style={{ maxWidth: 720, margin: '0 auto', padding: '64px 24px' }}>
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: 'var(--color-ink-mute)',
            marginBottom: 16,
          }}
        >
          {pub.type} · {pub.year}
        </div>
        <h1
          style={{
            fontFamily: 'var(--font-serif)',
            fontWeight: 600,
            fontSize: 32,
            color: 'var(--color-ink)',
            letterSpacing: '-0.012em',
            margin: '0 0 16px',
          }}
        >
          {pub.title}
        </h1>
        {pub.authors && pub.authors.length > 0 && (
          <div style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-ink-soft)', fontSize: 15, marginBottom: 24 }}>
            {pub.authors.map((a) => a.name).join(', ')}
          </div>
        )}
        {pub.abstract && (
          <p style={{ fontFamily: 'var(--font-serif)', fontSize: 16, lineHeight: 1.6, color: 'var(--color-ink-soft)', marginBottom: 32 }}>
            {pub.abstract}
          </p>
        )}
        {pub.fileUrl && (
          <a
            href={pub.fileUrl}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '12px 18px',
              background: 'var(--color-teal)',
              color: 'var(--color-bg)',
              borderRadius: 'var(--radius-sm)',
              fontFamily: 'var(--font-sans)',
              fontSize: 13,
              fontWeight: 500,
              textDecoration: 'none',
            }}
          >
            Download PDF →
          </a>
        )}
        {pub.doi && (
          <p style={{ marginTop: 24, fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--color-ink-mute)' }}>
            DOI: {pub.doi}
          </p>
        )}
      </article>
    </PageShell>
  );
}
```

- [ ] **Step 3: Add route smoke E2E**

Append to `tests/e2e/group-routes.spec.ts`:

```typescript
test('insights index renders', async ({ page }) => {
  await page.goto('/en/insights');
  await expect(page.getByRole('heading', { level: 1, name: 'Insights' })).toBeVisible();
});

test('publications index renders', async ({ page }) => {
  await page.goto('/en/publications');
  await expect(page.getByRole('heading', { level: 1, name: 'Publications' })).toBeVisible();
});
```

- [ ] **Step 4: Run checks + commit**

```bash
bun run typecheck
bun run lint
bun run test
bun run test:e2e
git add .
git commit -m "feat: publications index/slug + insights/publications smoke E2E"
```

---

### Task 17: Turnstile + Resend wrappers

**Files:**
- Create: `src/lib/turnstile.ts`
- Create: `src/lib/resend.ts`
- Test: `tests/unit/turnstile.test.ts`

- [ ] **Step 1: Add Resend dep**

```bash
cd /Users/kmini/github/merlx-website
bun add resend
```

- [ ] **Step 2: Write the Turnstile unit test**

Create `tests/unit/turnstile.test.ts`:

```typescript
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { verifyTurnstileToken } from '../../src/lib/turnstile';

describe('verifyTurnstileToken', () => {
  const fetchSpy = vi.fn();

  beforeEach(() => {
    vi.stubGlobal('fetch', fetchSpy);
    fetchSpy.mockReset();
    process.env.TURNSTILE_SECRET_KEY = 'test-secret';
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    process.env.TURNSTILE_SECRET_KEY = undefined;
  });

  it('returns true when Cloudflare returns success: true', async () => {
    fetchSpy.mockResolvedValue({ json: async () => ({ success: true }) });
    const result = await verifyTurnstileToken('valid-token', '1.2.3.4');
    expect(result).toBe(true);
    expect(fetchSpy).toHaveBeenCalledOnce();
  });

  it('returns false when Cloudflare returns success: false', async () => {
    fetchSpy.mockResolvedValue({ json: async () => ({ success: false, 'error-codes': ['invalid-input-response'] }) });
    const result = await verifyTurnstileToken('bad-token', '1.2.3.4');
    expect(result).toBe(false);
  });

  it('returns false when secret key is missing', async () => {
    process.env.TURNSTILE_SECRET_KEY = '';
    const result = await verifyTurnstileToken('any-token', '1.2.3.4');
    expect(result).toBe(false);
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});
```

- [ ] **Step 3: Implement turnstile.ts**

Create `src/lib/turnstile.ts`:

```typescript
const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

interface VerifyResponse {
  success: boolean;
  'error-codes'?: string[];
}

/**
 * Verify a Cloudflare Turnstile token via the siteverify endpoint.
 * Returns true if and only if Cloudflare confirms the token is valid.
 *
 * If TURNSTILE_SECRET_KEY is not set, returns false (fail-closed).
 */
export async function verifyTurnstileToken(token: string, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return false;

  const body = new URLSearchParams({
    secret,
    response: token,
    remoteip: ip,
  });

  const res = await fetch(VERIFY_URL, {
    method: 'POST',
    body,
  });
  const json = (await res.json()) as VerifyResponse;
  return json.success === true;
}
```

- [ ] **Step 4: Run unit tests**

```bash
bun run test
```

Expected: 3 new tests pass (total 29 unit tests).

- [ ] **Step 5: Implement resend.ts**

Create `src/lib/resend.ts`:

```typescript
import { Resend } from 'resend';

interface SendLeadEmailArgs {
  to: string;
  from?: string;
  subject: string;
  text: string;
}

export async function sendLeadEmail({
  to,
  from = 'MERLx <hello@merlx.org>',
  subject,
  text,
}: SendLeadEmailArgs): Promise<{ ok: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { ok: false, error: 'RESEND_API_KEY not set' };
  }

  const resend = new Resend(apiKey);

  const result = await resend.emails.send({
    from,
    to,
    subject,
    text,
  });

  if (result.error) {
    return { ok: false, error: result.error.message };
  }
  return { ok: true };
}
```

- [ ] **Step 6: Commit**

```bash
bun run typecheck
bun run lint
git add .
git commit -m "feat: turnstile verifier + resend wrapper"
```

---

### Task 18: Contact form Server Action + ContactForm component + page

**Files:**
- Create: `src/server-actions/submit-contact.ts`
- Create: `src/components/forms/ContactForm.tsx`
- Create: `src/app/(frontend)/[locale]/contact/page.tsx`
- Test: `tests/e2e/contact-form.spec.ts`

- [ ] **Step 1: Create the Server Action**

Create `src/server-actions/submit-contact.ts`:

```typescript
'use server';

import { verifyTurnstileToken } from '@/lib/turnstile';
import { sendLeadEmail } from '@/lib/resend';
import config from '@/payload.config';
import { headers } from 'next/headers';
import { getPayload } from 'payload';
import { z } from 'zod';

const ContactPayload = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email(),
  organisation: z.string().max(200).optional(),
  role: z.string().max(200).optional(),
  country: z.string().max(100).optional(),
  message: z.string().min(10).max(5000),
  interest: z.array(z.string()).optional(),
  turnstileToken: z.string().optional(),
});

export type ContactSubmission = z.infer<typeof ContactPayload>;

export interface ContactResult {
  ok: boolean;
  error?: string;
}

export async function submitContact(input: unknown): Promise<ContactResult> {
  const parsed = ContactPayload.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: 'invalid_input' };
  }
  const data = parsed.data;

  // Verify Turnstile if configured
  if (process.env.TURNSTILE_SECRET_KEY) {
    if (!data.turnstileToken) {
      return { ok: false, error: 'turnstile_required' };
    }
    const headerList = await headers();
    const ip = headerList.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1';
    const valid = await verifyTurnstileToken(data.turnstileToken, ip);
    if (!valid) {
      return { ok: false, error: 'turnstile_invalid' };
    }
  }

  const headerList = await headers();
  const tenantKind = headerList.get('x-tenant-kind') ?? 'unknown';
  const tenantDomain = headerList.get('x-tenant-domain') ?? 'unknown';

  const payload = await getPayload({ config });

  await payload.create({
    collection: 'leads',
    data: {
      name: data.name,
      email: data.email,
      organisation: data.organisation,
      role: data.role,
      country: data.country,
      message: data.message,
      interest: data.interest,
      tenantOrigin: `${tenantKind}:${tenantDomain}/contact`,
      submittedAt: new Date().toISOString(),
      status: 'new',
    },
  });

  // Fire-and-forget email; don't fail the form if email fails (lead is saved)
  const inboxFrom = process.env.NEXT_PUBLIC_SITE_URL?.includes('merlx.org')
    ? 'hello@merlx.org'
    : 'no-reply@merlx.org';
  await sendLeadEmail({
    to: 'hello@merlx.org',
    from: `MERLx Lead Form <${inboxFrom}>`,
    subject: `[merlx.org] New lead from ${data.name}`,
    text: `From: ${data.name} <${data.email}>
Org: ${data.organisation ?? '-'}
Role: ${data.role ?? '-'}
Country: ${data.country ?? '-'}
Origin: ${tenantKind}:${tenantDomain}

${data.message}`,
  });

  return { ok: true };
}
```

- [ ] **Step 2: Create ContactForm component (client)**

Create `src/components/forms/ContactForm.tsx`:

```typescript
'use client';

import { submitContact } from '@/server-actions/submit-contact';
import { useState } from 'react';

interface ContactFormProps {
  turnstileSiteKey?: string;
}

export function ContactForm({ turnstileSiteKey }: ContactFormProps) {
  const [state, setState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  async function handleSubmit(formData: FormData) {
    setState('submitting');
    setErrorMessage('');

    const turnstileToken = formData.get('cf-turnstile-response')?.toString();

    const result = await submitContact({
      name: formData.get('name'),
      email: formData.get('email'),
      organisation: formData.get('organisation') || undefined,
      role: formData.get('role') || undefined,
      country: formData.get('country') || undefined,
      message: formData.get('message'),
      interest: formData.getAll('interest').map(String),
      turnstileToken,
    });

    if (result.ok) {
      setState('success');
    } else {
      setState('error');
      setErrorMessage(result.error ?? 'unknown_error');
    }
  }

  if (state === 'success') {
    return (
      <div style={{ padding: 24, background: 'var(--color-bg-soft, #f6f4ec)', borderRadius: 'var(--radius-md)' }}>
        <p style={{ fontFamily: 'var(--font-serif)', fontSize: 17, color: 'var(--color-ink)', margin: 0 }}>
          Thank you. We'll be in touch within a few working days.
        </p>
      </div>
    );
  }

  return (
    <form action={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 560 }}>
      <Field label="Name *" name="name" required />
      <Field label="Email *" name="email" type="email" required />
      <Field label="Organisation" name="organisation" />
      <Field label="Role" name="role" />
      <Field label="Country" name="country" />

      <label style={labelStyle}>
        <span style={labelTextStyle}>Interest (select any that apply)</span>
        <select name="interest" multiple size={4} style={{ ...inputStyle, height: 'auto' }}>
          <option value="studio">Optics Suite (Studio)</option>
          <option value="network">Network engagement</option>
          <option value="hosted">Hosted instance</option>
          <option value="pilot">Pilot &amp; evaluate</option>
          <option value="build-with">Build-with</option>
          <option value="advisory">Advisory</option>
        </select>
      </label>

      <label style={labelStyle}>
        <span style={labelTextStyle}>Message *</span>
        <textarea
          name="message"
          required
          minLength={10}
          rows={6}
          style={{ ...inputStyle, fontFamily: 'var(--font-serif)', resize: 'vertical' }}
        />
      </label>

      {turnstileSiteKey && (
        <div className="cf-turnstile" data-sitekey={turnstileSiteKey} />
      )}

      <button
        type="submit"
        disabled={state === 'submitting'}
        style={{
          alignSelf: 'flex-start',
          padding: '13px 22px',
          background: 'var(--color-teal)',
          color: 'var(--color-bg)',
          border: 'none',
          borderRadius: 'var(--radius-sm)',
          fontFamily: 'var(--font-sans)',
          fontSize: 13,
          fontWeight: 500,
          cursor: state === 'submitting' ? 'wait' : 'pointer',
          opacity: state === 'submitting' ? 0.6 : 1,
        }}
      >
        {state === 'submitting' ? 'Sending…' : 'Send'}
      </button>

      {state === 'error' && (
        <p style={{ color: 'var(--color-orange-hot, #8a2f0a)', fontFamily: 'var(--font-serif)', fontSize: 14 }}>
          Submission failed: {errorMessage}. Please try again.
        </p>
      )}
    </form>
  );
}

const labelStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
};

const labelTextStyle: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: 10,
  letterSpacing: '0.16em',
  textTransform: 'uppercase',
  color: 'var(--color-ink-mute)',
};

const inputStyle: React.CSSProperties = {
  padding: '10px 12px',
  border: '1px solid var(--color-rule)',
  borderRadius: 'var(--radius-sm)',
  fontFamily: 'var(--font-sans)',
  fontSize: 14,
  color: 'var(--color-ink)',
  background: 'var(--color-bg)',
};

interface FieldProps {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}

function Field({ label, name, type = 'text', required }: FieldProps) {
  return (
    <label style={labelStyle}>
      <span style={labelTextStyle}>{label}</span>
      <input type={type} name={name} required={required} style={inputStyle} />
    </label>
  );
}
```

- [ ] **Step 3: Create the contact page**

Create `src/app/(frontend)/[locale]/contact/page.tsx`:

```typescript
import { ContactForm } from '@/components/forms/ContactForm';
import { PageShell } from '@/components/chrome/PageShell';
import { isGroupTenant } from '@/lib/tenant-aware';
import { setRequestLocale } from 'next-intl/server';
import { headers } from 'next/headers';
import Script from 'next/script';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function ContactPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const headerList = await headers();
  if (!isGroupTenant(headerList)) notFound();

  const turnstileSiteKey = process.env.TURNSTILE_SITE_KEY;

  return (
    <PageShell locale={locale}>
      {turnstileSiteKey && (
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js"
          strategy="afterInteractive"
        />
      )}
      <article style={{ maxWidth: 720, margin: '0 auto', padding: '64px 24px' }}>
        <h1
          style={{
            fontFamily: 'var(--font-serif)',
            fontWeight: 600,
            fontSize: 38,
            color: 'var(--color-ink)',
            letterSpacing: '-0.014em',
            margin: '0 0 16px',
          }}
        >
          Contact
        </h1>
        <p style={{ fontFamily: 'var(--font-serif)', fontSize: 16, lineHeight: 1.6, color: 'var(--color-ink-soft)', marginBottom: 32 }}>
          MERLx currently delivers under consortium arrangements with established delivery
          partners. For framework placements, partner introductions, or specific engagements, send
          us a note.
        </p>
        <ContactForm turnstileSiteKey={turnstileSiteKey} />
      </article>
    </PageShell>
  );
}
```

- [ ] **Step 4: Add E2E for the contact form**

Create `tests/e2e/contact-form.spec.ts`:

```typescript
import { expect, test } from '@playwright/test';

test('contact page renders the form', async ({ page }) => {
  await page.goto('/en/contact');
  await expect(page.getByRole('heading', { level: 1, name: 'Contact' })).toBeVisible();
  await expect(page.locator('input[name="name"]')).toBeVisible();
  await expect(page.locator('input[name="email"]')).toBeVisible();
  await expect(page.locator('textarea[name="message"]')).toBeVisible();
});

test('contact submission lands a leads row (Turnstile not configured in dev)', async ({ page }) => {
  await page.goto('/en/contact');

  await page.locator('input[name="name"]').fill('Test User');
  await page.locator('input[name="email"]').fill('test@example.com');
  await page.locator('textarea[name="message"]').fill('This is a test submission with enough characters.');
  await page.locator('button[type="submit"]').click();

  // The form replaces itself with a success message
  await expect(page.getByText(/Thank you/i)).toBeVisible({ timeout: 10_000 });
});
```

(The success-path test relies on TURNSTILE_SECRET_KEY being unset in dev, which makes the action skip Turnstile verification. In production, with Turnstile keys set, the test would need a real or stubbed token — see notes below.)

- [ ] **Step 5: Run all checks**

```bash
bun run typecheck
bun run lint
bun run test
bun run test:e2e
```

Expected: all green.

- [ ] **Step 6: Commit**

```bash
git add .
git commit -m "feat: contact form (server action + turnstile + resend + page)"
```

---

### Task 19: Lighthouse threshold tightening

**Files:**
- Modify: `lighthouserc.json`

Phase 0 relaxed Lighthouse to "warn" thresholds because the placeholder home was too sparse. Now that the chooser landing exists, re-tighten.

- [ ] **Step 1: Replace `lighthouserc.json`**

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
        "categories:performance": ["error", { "minScore": 0.9 }],
        "categories:accessibility": ["error", { "minScore": 0.95 }],
        "categories:best-practices": ["warn", { "minScore": 0.9 }],
        "first-contentful-paint": ["error", { "maxNumericValue": 1500 }],
        "largest-contentful-paint": ["error", { "maxNumericValue": 1500 }],
        "cumulative-layout-shift": ["error", { "maxNumericValue": 0.05 }],
        "total-blocking-time": ["warn", { "maxNumericValue": 200 }]
      }
    }
  }
}
```

- [ ] **Step 2: Run Lighthouse locally to confirm targets are achievable**

This requires the dev server + the seed data + a production build:

```bash
cd /Users/kmini/github/merlx-website
bun run build
bun run start > /tmp/start.log 2>&1 &
START_PID=$!
sleep 8
bunx --bun @lhci/cli@latest autorun --config=./lighthouserc.json || echo "Lighthouse failed — see report"
kill $START_PID 2>/dev/null || true
sleep 2
```

If Lighthouse fails on perf or LCP, identify the culprit (likely SVG sizes, font loading, or unoptimised images) and either fix or temporarily relax the specific failing assertion. Don't relax `accessibility` (must stay at 0.95) or `cumulative-layout-shift` (must stay at 0.05).

- [ ] **Step 3: Commit**

```bash
git add lighthouserc.json
git commit -m "ci: re-tighten lighthouse thresholds for landing page"
```

---

## Phase 1 exit checklist

When all 19 tasks complete:

- `merlx.org/` (group tenant) renders the v16 hover-split chooser
- Studio half (orange) and Network half (teal) hover-expand correctly; Studio's hover pushes Network rightward; Network's hover does not push Studio
- `/about` renders the seeded About content
- `/legal/privacy`, `/legal/terms`, `/legal/cookies` render the seeded legal content
- `/insights` renders the empty state ("Nothing published yet")
- `/publications` renders the empty state
- `/contact` renders the form and successful submission lands a `leads` row in Payload + (when Resend is configured) sends an email
- All non-group tenant hosts return 404 on these routes
- Lighthouse passes the tightened thresholds
- 29+ unit tests, 28+ E2E tests passing
- All checks (typecheck/lint/test/test:e2e) clean
- Working tree clean

## What's NOT in Phase 1

- Studio sub-site at `studio.merlx.org` (Phase 2)
- Network sub-site at `network.merlx.org` (Phase 3)
- NileX node tenant at `nilex.merlx.org` (Phase 4)
- Trilingual translations of marketing copy (Phase 5; the chooser already has stub translations)
- Sentry / Vercel Speed Insights (Phase 6)
- DNS cutover / launch (Phase 7)
- Animations on the chooser background SVGs (v1.1 polish)
- Site search (v1.5+)
- Newsletter (v1.5+)
- CRM integration (v1.5+)

---

## Self-review

This plan covers Phase 1 of the design spec (Section 9, Phase 1) — group front door routes plus chrome plus the chooser plus the contact form. Mapping to spec requirements:

- ✅ `merlx.org/` v16 hover-split chooser: Tasks 8, 9, 10, 11
- ✅ `/about`: Tasks 13, 14
- ✅ `/insights`, `/insights/[slug]`: Tasks 7, 15
- ✅ `/publications`, `/publications/[slug]`: Task 16
- ✅ `/contact` with form → Resend + Payload: Tasks 17, 18
- ✅ `/legal/privacy`, `/legal/terms`, `/legal/cookies`: Tasks 13, 14
- ✅ Localised through EN at minimum: locale routing inherited from Phase 0
- ✅ Tenant gating (group only): Tasks 11, 12
- ✅ i18n key parity (review I6): Task 7
- ✅ Lighthouse re-tightening: Task 19
- ✅ Public-read access pattern (review I1): Task 1

Type consistency: `TenantContext`, `parseTenantHeaders`, `isGroupTenant` are defined in Task 5 and used identically in Tasks 11, 12, 13, 15, 16, 18. `buildAggregateInsightsQuery` and `buildAggregatePublicationsQuery` are defined in Task 15 and used in Tasks 15, 16. Tenant-scoped collection slugs (`pages`, `insights-posts`, `publications`) match the multi-tenant plugin config (Tasks 2, 3) and the seed scripts (Task 14).

Placeholder scan: no TBD/TODO/XXX/FIXME in step content. Some steps reference "if X happens, do Y" branches — these are explicit fallback paths, not placeholders.
