# Phase 2 — Studio sub-site at studio.merlx.org

**Spec:** `docs/superpowers/specs/2026-04-30-merlx-website-design.md` §4.2 + §9 Phase 2
**Branch:** `phase-2-studio`
**Estimated:** 2–3 weeks
**Phase 1 baseline:** all group-tenant routes shipped (chooser, /about, /legal, /insights, /publications, /contact). Phase 1 conventions documented in `CLAUDE.md` and the Phase 1 plan's "carry-forward" notes — read both before starting.

## Goal

Build the Studio sub-site at `studio.merlx.org`. Donor-pitch-quality at exit: a donor or programme officer should be able to read the home → optics → one per-tool page → engage and decide whether to talk to us.

## Out of scope

- `prism.merlx.org` / `iris.merlx.org` / etc. live tool deployments. Those remain external; Phase 2 only adds the per-tool *marketing* pages at `studio.merlx.org/optics/[tool]` and the proxy rules so the bare tool subdomains render the same marketing page until each tool's real deployment is ready.
- Trilingual copy (EN authoring only; AR + FR stubs). Translation fills out in Phase 5.
- Network sub-site (Phase 3), NileX node (Phase 4).

## Routes added in Phase 2

```
studio.merlx.org/
  /                           Studio home
  /optics                     Optics Suite landing — thesis page
  /optics/iris                Per-tool marketing pages
  /optics/prism
  /optics/aperture
  /optics/toc-tester
  /optics/oasis
  /optics/echo
  /engage                     Four ways to engage (overview)
  /engage/hosted              Engagement-model deep-dives
  /engage/pilot
  /engage/build-with
  /engage/advisory
  /principles                 5 commitments + 4 beliefs
  /about                      Team, partners, where we operate
  /insights                   Studio-tenant insights feed
  /insights/[slug]
  /publications
  /publications/[slug]
  /contact                    Studio-routed contact form
```

Tool subdomains (proxy rules only, no new routes):

```
prism.merlx.org      → renders studio.merlx.org/optics/prism with cosmetic host swap
iris.merlx.org       → renders studio.merlx.org/optics/iris
aperture.merlx.org   → /optics/aperture
toctester.merlx.org  → /optics/toc-tester
oasis.merlx.org      → /optics/oasis
echo.merlx.org       → /optics/echo
```

## Carry-forward conventions from Phase 1

- All routes go under `src/app/(frontend)/[locale]/...`. Locale routing inherited.
- Tenant gating via `src/lib/tenant-aware.ts`. Studio routes use a new helper `isStudioTenant(headers)` (mirror of `isGroupTenant`) for cheap gates and `requireStudioTenant(headers, payload)` for routes that need the tenant doc.
- Inline-style `style={{...}}` with CSS custom properties is the design-token pattern (no styled-components, no CSS modules).
- Payload v3.84 default access denies anonymous reads — use the `publicRead` helper on every public collection.
- No `.js` extensions on TS imports.
- Studio tenant slug is `studio`; Studio tenant doc already exists from Phase 0 seed.
- Studio register: orange / ember / iris (per MERLx design guide §2 + chooser side-association).
- Test density per `CLAUDE.md` §Testing: server actions + tenant gates always; UI state machines yes; pure presentation no.

## Tasks

### Task 1: Studio tenant helpers (`isStudioTenant`, `requireStudioTenant`)
**Files:**
- Modify: `src/lib/tenant-aware.ts`
- Test: `tests/unit/tenant-aware.test.ts`

Add `isStudioTenant(headers)` (kind === 'studio') and `requireStudioTenant(headers, payload)` (gate + resolve tenant doc, fallback to type=studio for dev). Mirror exactly the group-tenant helpers' shape.

Acceptance: unit tests assert each gate behaves correctly across `kind=group`/`studio`/`network`/`unknown`.

### Task 2: OpticsTools Payload collection
**Files:**
- Create: `src/collections/OpticsTools.ts`
- Modify: `src/collections/index.ts`, `src/payload.config.ts`
- Generated: `payload-types.ts`

Tenant-scoped collection with fields: `slug` (text, required, unique-per-tenant), `name`, `tagline`, `summary` (richText), `description` (richText), `screenshots` (array of upload), `status` (select: live | beta | coming-soon), `external_url` (text, optional — where the live tool lives if any), `subdomain` (text, optional — e.g., `prism.merlx.org`), `order` (number, default 0). Access: `read = publicRead`; admin write only.

Acceptance: collection registered, types generated, admin UI shows the fields, anonymous reads return docs.

### Task 3: Seed OpticsTool entries
**Files:**
- Modify: `scripts/seed-content.ts`

Six entries — PRISM, IRIS, Aperture, ToC Tester, OASIS, ECHO. Each gets a slug, name, tagline, status, subdomain, and a placeholder summary that the user can edit later. No screenshots in v1 (uses placeholder card art).

Acceptance: `bun run seed` populates the studio tenant with 6 OpticsTool docs; rerunning is idempotent.

### Task 4: Studio chrome — `StudioNav` + `StudioFooter` (or extend `SiteNav`)
**Files:**
- Modify: `src/components/chrome/SiteNav.tsx`, `src/components/chrome/SiteFooter.tsx` (read tenant kind, render studio variant when kind === 'studio')

Studio variant: orange brand mark accent, top-right nav links go to Studio routes (Optics Suite, Engage, Principles, About, Insights, Publications, Contact). Footer keeps the tri-tenant cross-link strip.

Acceptance: rendering on studio tenant shows studio nav links; rendering on group tenant unaffected.

### Task 5: Studio home (`/`)
**Files:**
- Create: `src/app/(frontend)/[locale]/page.tsx` — extend the existing chooser logic so when `isStudioTenant(headers)` is true, render `<StudioHome />`; otherwise keep the existing group chooser.
- Create: `src/components/studio/StudioHome.tsx`

Hero with one-liner thesis + CTA; "Optics Suite — six tools" preview row (cards from OpticsTools collection); "Four ways to engage" preview; recent Studio insights teaser; primary CTA to /contact.

Acceptance: studio host renders the home; group host still gets the chooser.

### Task 6: `/optics` Optics Suite thesis landing
**Files:**
- Create: `src/app/(frontend)/[locale]/optics/page.tsx`
- Create: `src/components/studio/OpticsGrid.tsx`

Server component reads OpticsTools from Payload, renders the thesis copy + the six tools as a grid of cards (status pill, name, tagline, "Read more →"). Studio-tenant gated.

Acceptance: page renders the 6 cards in `order` ascending.

### Task 7: `/optics/[slug]` per-tool detail pages
**Files:**
- Create: `src/app/(frontend)/[locale]/optics/[slug]/page.tsx`
- Create: `src/components/studio/OpticsToolPage.tsx`

Resolves OpticsTools by slug + studio tenant. Renders name, tagline, summary, description, screenshots gallery, status pill, "Launch tool →" / "Request a demo" CTAs (the latter routes to `/contact?interest=studio&tool=<slug>`). 404 if not found.

Acceptance: each of the 6 tool slugs returns 200; an unknown slug 404s.

### Task 8: Tool-subdomain proxy rules
**Files:**
- Modify: `src/proxy.ts`

Add host pattern matching for the six tool subdomains. Each rewrites internally to `/[locale]/optics/[slug]` (rewrite, not redirect — so the URL stays at the tool subdomain for SEO and future-proofing). Add `x-tenant-kind: studio` and `x-tenant-domain: studio.merlx.org` headers so existing tenant gating logic accepts the request.

Acceptance: `prism.merlx.org` returns the same content as `studio.merlx.org/en/optics/prism` with the URL bar showing the prism subdomain.

### Task 9: `/engage` overview + 4 deep-dive pages
**Files:**
- Create: `src/app/(frontend)/[locale]/engage/page.tsx`
- Create: `src/app/(frontend)/[locale]/engage/[slug]/page.tsx`
- Modify: `src/collections/Pages.ts` so engagement-model copy can be CMS-driven (or hardcode JSON in `src/content/engage.ts` if Pages collection is too heavyweight).

Decision (in this plan, not deferred): hardcoded JSON in `src/content/engage.ts` for v1 — copy is short and editorial, doesn't need a CMS round-trip. Pages collection stays for /about-style long-form pages.

Acceptance: `/engage` lists the four models; each `/engage/[slug]` renders its deep-dive with a CTA back to /contact.

### Task 10: `/principles` page
**Files:**
- Create: `src/app/(frontend)/[locale]/principles/page.tsx`
- Create: `src/content/principles.ts` (5 commitments + 4 beliefs as static JSON)

Two columns: 5 engineering commitments left, 4 product beliefs right. DM Serif Display for the commitment headings (per MERLx editorial rules), Inter for the body.

Acceptance: page renders both columns; hardcoded copy is editorial-quality v1.

### Task 11: `/about` (Studio variant)
**Files:**
- Create: `src/app/(frontend)/[locale]/about/page.tsx` — extend existing About to switch on tenant kind.
- Modify: existing About page or split into `AboutGroup.tsx` / `AboutStudio.tsx` server components.

Studio About: team list, where-we-operate map (small inline SVG using the same Natural Earth setup as the chooser, restricted to operating regions), partners strip, in-the-media widget (placeholder ok in v1).

Acceptance: studio host shows Studio About; group host still shows group About.

### Task 12: Studio Insights + Publications routes
**Files:**
- Modify: `src/lib/aggregate-feed.ts` — already exists; verify it filters by tenant correctly.
- Create: `src/app/(frontend)/[locale]/insights/page.tsx` — extend to studio tenant (or branch on tenant kind in existing route).

Reuse Phase 1 insights/publications routes as much as possible. Studio tenant just sees its own scope. The aggregate-feed helper already supports per-tenant queries.

Acceptance: studio /insights renders studio-tenant posts only; same for /publications.

### Task 13: Studio contact route
**Files:**
- Modify: `src/app/(frontend)/[locale]/contact/page.tsx` — gate accepts studio tenant too.
- Modify: `src/server-actions/submit-contact.ts` — `tenantOrigin` already records the kind; no changes needed.

Studio contact pre-fills `interest = ['studio']` if URL has `?interest=studio` (so the per-tool "Request a demo" CTA can link in with context).

Acceptance: studio host /contact renders the form; submitting lands a leads row with `tenantOrigin: studio:studio.merlx.org/contact`.

### Task 14: Tenant gating coverage
**Files:**
- Test: `tests/e2e/tenant-gating.spec.ts` — extend with studio-only routes returning 404 on group/network/unknown hosts.

### Task 15: Studio E2E happy path
**Files:**
- Test: `tests/e2e/studio-routes.spec.ts` (new)

Walks the donor flow: studio home → optics → one per-tool page → engage → contact. Asserts headings render, CTAs are present, 200s throughout.

### Task 16: Lighthouse re-check on Studio home + /optics
**Files:**
- Modify: `lighthouserc.json` — add the studio routes to the URL list.

Run locally; if any threshold breaks (perf 0.9, FCP/LCP 1500ms, CLS 0.05), identify the cause (likely OpticsTools card images if real screenshots land before this task — defer image optimisation as a sub-task).

### Task 17: Final polish + commit
- Verify all 6 tool subdomains rewrite correctly via `proxy.ts`.
- Verify both group + studio chooser links cross-route correctly (group → studio.merlx.org/optics, studio → merlx.org).
- Working tree clean.

## Phase 2 exit checklist

- `studio.merlx.org/` renders the Studio home
- `studio.merlx.org/optics` lists six tools
- Each `/optics/[slug]` renders a usable per-tool marketing page
- `prism.merlx.org` (etc.) renders the same per-tool page
- `/engage` lists four models with deep-dives
- `/principles` renders editorial copy
- `/about` (studio variant) renders team + partners + map
- `/insights` and `/publications` show studio-tenant content
- `/contact` (studio-routed) submits to `leads` with studio tenantOrigin
- All non-studio hosts 404 on these routes
- 33+ unit tests / 38+ E2E tests passing
- typecheck/lint/test/test:e2e clean
- Lighthouse passes the existing thresholds

## What's NOT in Phase 2

- Network sub-site (Phase 3)
- NileX node tenant (Phase 4)
- Trilingual translations of the new copy (Phase 5; AR/FR stubs only)
- Real tool screenshots (placeholder cards in v1; user supplies real screenshots between v1 and v1.5)
- Sentry / Speed Insights (Phase 6)
- DNS cutover for tool subdomains (manual; Phase 7)
- Cross-tenant search

## Self-review

Mapping back to spec §4.2:

| Route | Task |
| --- | --- |
| `/` (Studio home) | Task 5 |
| `/optics` | Task 6 |
| `/optics/[slug]` × 6 | Tasks 2, 3, 7 |
| `/engage` + `/engage/[slug]` × 4 | Task 9 |
| `/principles` | Task 10 |
| `/about` | Task 11 |
| `/insights`, `/insights/[slug]` | Task 12 |
| `/publications`, `/publications/[slug]` | Task 12 |
| `/contact` | Task 13 |
| Tool subdomain proxy | Task 8 |
| Tenant gating | Tasks 1, 14 |
| Studio chrome | Task 4 |

No unimplemented spec sections from §4.2. No new features beyond spec.

Type/file consistency: `isStudioTenant` / `requireStudioTenant` follow the group helpers' shape; OpticsTools collection follows the existing `Pages` / `InsightsPosts` / `Publications` shape; routes mirror the Phase 1 file layout under `(frontend)/[locale]/...`.
