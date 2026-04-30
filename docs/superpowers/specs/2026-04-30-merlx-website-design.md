# MERLx Website — Design Spec

**Date:** 2026-04-30
**Author:** Kristian Svendsen (with Claude)
**Status:** Draft for review
**Repo (planned):** `~/github/merlx-website`

---

## 1. Purpose & Audience

### 1.1 Purpose

`merlx.org` is the **marketing and credibility front door** for the MERLx group. It is *not* the entry point for tool users (each tool has its own subdomain and auth). Visitors arriving at the front door should leave with a clear understanding of what MERLx is, decide whether to enter the **Studio** side (tools) or the **Network** side (in-country MERL), and either book a demo, contact the relevant entity, or download a publication.

### 1.2 Primary audience

Donors and programme officers at multilateral or large INGO desks (UNDP, FAO, WFP, ECHO, FCDO, etc.) — the people who decide whether MERLx fits a funding window. Tone, content depth, and visual register are tuned for them.

### 1.3 Reachable secondary audiences

- **Senior MERL / analytics leads** at INGOs and research orgs (technical buyers) — given depth via per-tool methodology pages, BUILT-ON sections, and Publications.
- **Country-office practitioners** — given clarity via per-tool screenshots, capability lists, and case studies.
- **Potential MERLx Network nodes** — given a dedicated `become-a-node` flow on `network.merlx.org`.

---

## 2. Positioning

MERLx is **three layers**, of which only two are foregrounded on the website:

1. **MERLx Studio** — the tech entity. Builds the **Optics Suite**: IRIS, PRISM, Aperture, ToC Tester, OASIS, ECHO. (Foregrounded.)
2. **MERLx Network / The MERL Guild** — a federation of locally owned MERL cooperatives (nodes — e.g., NileX). Each node is an autonomous local entity that does *traditional* MERL in-country (KIIs, FGDs, evaluations, TPM, learning workshops) and uses the Studio's tools as infrastructure. (Foregrounded.)
3. **MERLx Cooperative** — the long-term ownership / governance transformation (12-year, three-ERA arc; Impact Credits, MCPF pension scheme, MSIF social impact fund). **Out of scope for the website at v1**; lives in the Whitepaper only. Will get its own destination later.

The Studio and Network are presented as two distinct entities under one MERLx roof. The website's homepage is a **conglomerate front-door chooser** between them, not a unified marketing page.

### 2.1 Headline & voice

- **Working homepage headline:** "Advanced analytics and MERL for the global development and humanitarian sectors." (Italic-purple flourish on "global development".)
- **Sub-line direction:** Studio = "We build the tools." Network = "Locally owned MERL, in-country."
- **Voice:** editorial, evidence-grade, calm; not promotional. Modeled on the company-profile aesthetic — contemporary serif headings, monospace for labels/eyebrows, sans-serif for chrome.

The company profile's `merlx.ai` framing reflects a current "tech-partner studio" identity. The strategic direction is the broader Studio + Network framing. **The site has to land the broader framing from day one.** The profile copy will need refreshing once the site lands; until then they will briefly contradict each other. Flagged as a content task.

---

## 3. Site Topology

Five distinct kinds of subdomain, all served from one Next.js codebase via host-based tenant resolution.

| Domain | Tenant type | Notes |
|---|---|---|
| `merlx.org` | `group` (singleton) | Front door — the hover-split chooser, About-the-group, aggregate Insights/Publications, Contact, Legal |
| `studio.merlx.org` | `studio` (singleton) | Studio sub-site — Optics Suite, per-tool pages, engagement models, Studio Insights/Publications |
| `network.merlx.org` | `network` (singleton) | Network sub-site — Nodes index, services, become-a-node, Network Insights/Publications |
| `[node].merlx.org` | `node` (many) | Each federated node — `nilex.merlx.org`, future nodes |
| `[tool].merlx.org` | *not in this codebase* | DNS / proxy redirects to actual tool deployments — `prism.merlx.org`, `iris.merlx.org`, `aperture.merlx.org`, `toc.merlx.org`, `oasis.merlx.org`, `echo.merlx.org` |

**Group / Studio / Network / Nodes are the same Next.js app**, distinguished by middleware reading the `Host` header and resolving a `tenants` record from Payload. Each tenant has its own theme accent, content collections, lead routing, and analytics scope.

**Tools are not part of this codebase.** They're separate apps that already exist; the website's per-tool *marketing* page lives at `studio.merlx.org/optics/[tool]` and links out via "Launch tool →" / "Request a demo" CTA. Tool subdomains resolve in one of two patterns depending on each tool's readiness:

| Tool readiness | Subdomain pattern |
|---|---|
| **Publicly hosted** (e.g., Aperture on HF Spaces) | DNS CNAME / redirect → external host. The website is not in the request path. |
| **Not yet publicly hosted** (most tools at v1) | CNAME → the website's Vercel project. `proxy.ts` matches the host and renders a per-tool "Coming soon — request a demo" page (which is just the same Studio per-tool marketing page from `studio.merlx.org/optics/[tool]`, served at the tool subdomain for SEO + future-proofing). When the tool's real deployment goes live, switch the DNS / `proxy.ts` rule to redirect. |

Per-tool readiness at expected launch (subject to change as the Optics Suite matures):

| Tool | Status | At launch |
|---|---|---|
| IRIS | Operational prototype (Brace4Peace) | Coming-soon page |
| PRISM | Beta (Sudan / HoA) | Subject to deploy decision; default coming-soon |
| Aperture | Beta (HF Spaces) | Live redirect to HF Spaces |
| ToC Tester | Beta (workshop-ready) | Subject to deploy; default coming-soon |
| OASIS | Live (Sudan pilot) | Subject to public-access decision; default coming-soon |
| ECHO | Alpha (Android) | Coming-soon page (mobile-only, not a web app) |

---

## 4. Information Architecture (page tree per tenant)

All routes are localised at `/en|/ar|/fr/...`. RTL layout applies under `/ar`.

### 4.1 `merlx.org` (group front door)

```
/                       Hover-split chooser
/about                  About the group (Studio + Network framing)
/insights               Aggregate Insights feed (cross-tenant)
/insights/[slug]
/publications           Aggregate Publications index (cross-tenant)
/publications/[slug]
/contact                One contact form, mentions consortium-delivery caveat
/legal/privacy
/legal/terms
/legal/cookies
```

### 4.2 `studio.merlx.org` (Studio sub-site)

```
/                       Studio home
/optics                 Optics Suite landing — the thesis page
/optics/iris            Per-tool marketing pages
/optics/prism
/optics/aperture
/optics/toc-tester
/optics/oasis
/optics/echo
/engage                 Four ways to engage
/engage/hosted          Engagement-model deep-dives
/engage/pilot
/engage/build-with
/engage/advisory
/principles             5 commitments + 4 beliefs (engineering / product values)
/about                  Team, where we operate, partners, in-the-media widget
/insights
/insights/[slug]
/publications
/publications/[slug]
/contact                Studio-routed contact form
```

### 4.3 `network.merlx.org` (MERL Network sub-site)

```
/                       Network home
/nodes                  Nodes directory with interactive world map
/nodes/[node-slug]      Brief in-network profile, links to [node].merlx.org
/services               What network nodes deliver
/services/[service-slug]
/become-a-node          Node onboarding pitch + criteria + process
/principles             Localisation / conflict-sensitivity ethos
/about                  Governance, MERL Guild framing, relationship to Studio
/insights
/insights/[slug]
/publications
/publications/[slug]
/contact                Network-routed contact form
```

### 4.4 `[node].merlx.org` (each federated node)

```
/                       Node home (node-specific hero, accent, deployments, recent news)
/about                  Team, governance, contact, country/region focus
/deployments            Which Studio tools the node runs
/deployments/[slug]
/case-studies           Node-authored
/case-studies/[slug]
/publications           Node-authored
/publications/[slug]
/news                   Node-only news
/news/[slug]
/contact                Node-routed contact form
```

### 4.5 Cross-tenant rules

- Insights and Publications written to the originating tenant. A `syndicate: true` flag bubbles content up to parent feeds (Network → group; Node → Network → group). Single canonical URL on origin tenant; aggregate pages list with excerpt + attribution and link out.
- Lead form submissions are tagged with the submitting tenant + page for routing.
- Every page is locale-aware. Group / Studio / Network ship trilingual (EN + AR + FR). Nodes pick their primary locale; fallback notice for missing translations.
- `/principles` content is per-tenant: Studio ≠ Network. Two distinct pages.
- Insights on Nodes is **opt-in via a `has_insights` flag** on the tenant record. By default Nodes ship with News + Case Studies + Publications only. Studio + Network always have Insights.

---

## 5. Visual Design

### 5.1 Brand foundation

- **Logo:** Real `MERLx_icon.svg` (canonical at `~/Documents/MERLx/Logo/MERLx_icon.svg`) — orange circle (bottom-left), purple teardrop (centre, pointing down), teal rectangle (right). Used inline as SVG everywhere it appears.
- **Wordmark:** "MERLx" in contemporary serif (Tiempos Headline / GT Sectra), the "x" in purple `#4a3f6b`.
- **Colors (canonical, pulled from the SVG):**
  - Teal `#1a3a34` — the "growth / network" register
  - Orange `#ca5d0f` — the "warmth / Studio / PRISM hot-zone" register
  - Purple `#4a3f6b` — wordmark accent and editorial flourish (e.g., italic-purple "global development")
  - Warm-white field `#fbfaf5` — the page base
  - Ink `#1a1a1a`, ink-soft `#555555`, ink-mute `#8c8779`
  - Rule `#e8e3d4`
- **Typography:** tri-typeface system
  - **Serif** (Tiempos Headline / GT Sectra fallback Georgia) — headings, body, italic flourishes
  - **Monospace** (IBM Plex Mono / JetBrains Mono fallback) — eyebrow labels, page chrome, page numbers, tag rows, data lineage
  - **Sans-serif** (Inter) — chrome, CTAs, navigation, lists

### 5.2 Color side-association

The MERLx mark itself maps to the chooser layout:
- **Studio (left half)** = **orange register** (warmth, building, the PRISM-style compound-risk visualisation that fades in on hover as the background motif). Studio is the umbrella for all six tools — orange is the Studio identity, not specifically PRISM. Eyebrow tag, accent rule, CTA, and the hex-grid background SVG are orange-toned, with darker maroon `#8a2f0a` for hot-zone cells.
- **Network (right half)** = **teal register** (federation, growth, in-country MERL). Eyebrow tag, accent rule, CTA, and the world-map node-pin SVG are teal-toned.
- **Purple** is reserved for wordmark + editorial italic flourishes (e.g., "global development" in the homepage headline).

### 5.3 Homepage chooser interaction

The `merlx.org/` landing implements a **hover-overlay split** (final iteration v16):

- Two halves at 50% width by default, both on the warm-white field.
- Inactive-side dim: `opacity: 0.42; filter: saturate(0.35);`
- Active side on hover: expands to 70% width, z-stacks above the inactive side, gets a barely-perceptible accent-tinted hover background, the themed background SVG fades in, the accent rule grows from 56px to 96px, the CTA lifts with a soft shadow.
- **Asymmetric push:** when **Studio** is hovered, the Network panel translates `+20cqw` rightward (slides partially off-screen — Studio is "shoving" Network offstage). When **Network** is hovered, Studio stays in place; Network simply overlays.
- Content blocks are anchored `left: 0` within their panels, so text always aligns to the left edge of its own panel and never reflows when the panel resizes. Content widths use `cqw` units, locked to half the landing's container width.
- **Background animations are deferred to a v1.1 polish pass.** v1.0 ships with static SVG backgrounds (PRISM hex grid for Studio, world dot-map + node pins for Network).

### 5.4 Per-node visual customisation

Within a strict design system, nodes can configure:
- Accent colour (within an allowed list — currently teal, deeper teal, sage, slate)
- Hero image
- Tagline
- Primary locale (drives default language and RTL/LTR)

Node header reads "[NodeName] | a MERLx node" so federation is always legible.

---

## 6. Content Model (Payload)

### 6.1 Multi-tenancy

Built on `@payloadcms/plugin-multi-tenant` (Payload v3). Every tenant-scoped collection automatically gets a hidden `tenant` relationship field, populated from session, used to filter list queries.

### 6.2 Roles

| Role | Scope |
|---|---|
| **Group admin** | All tenants. Manages the `tenants` collection. |
| **Studio editor** | Studio tenant only. |
| **Network editor** | Network tenant only. |
| **Node admin** | Their own node tenant only. |
| **Translator** | Locale-scoped: can edit translations of any content but cannot change canonical English copy. |

### 6.3 Tenant-scoped collections

| Collection | Tenants | Notes |
|---|---|---|
| `pages` | all | Generic CMS pages (About, Principles, Engage models, Service deep-dives) — locale-aware rich-text + section blocks |
| `tools` | studio | Per-tool marketing pages — name, tagline, status badge, problem, capabilities, screenshots, BUILT-ON, launch URL, demo CTA |
| `engagement_models` | studio | Hosted / Pilot / Build-with / Advisory — fields, accent, criteria, process |
| `nodes` | network | Network directory entries — name, country, accent, status (`active/pipeline/planned`), summary, contact, link to subdomain |
| `services` | network | research, evaluation, TPM, training |
| `deployments` | nodes | Per-node tool deployments — which tool, what data, what client, since when |
| `case_studies` | studio, network, nodes | `syndicate: true` bubbles up |
| `publications` | studio, network, nodes | Authors, year, type, abstract, downloadable PDF, DOI, language |
| `insights_posts` | studio, network, nodes (opt-in) | `category` enum: `news / analysis / field-note / methods` |
| `team_members` | all | |
| `partners` | all | |
| `media_press` | studio, network | "In the media" links |
| `media` | all | Vercel Blob assets, scoped by tenant |

### 6.4 Global collections (group-level only)

| Collection | Notes |
|---|---|
| `tenants` | The tenant table. Fields: domain, type, display name, accent colour, primary locale, supported locales, theme overrides, status, Vercel Blob bucket prefix, `has_insights` flag |
| `users` | Editors, translators, admins. Linked to one or more tenants with role |
| `nav_menus` | Per-tenant navigation, versionable |
| `lead_routes` | Per-tenant routing rules — email inbox, Slack/Google Chat webhook, future CRM pipeline |
| `redirects` | URL redirect map |
| `translations` | UI string translations (chrome, footers, form labels) |

### 6.5 Submission collections

| Collection | Notes |
|---|---|
| `leads` | Form submissions tagged with tenant, page, source UTM, status |

### 6.6 Localisation

- Locales: `en` (default), `ar` (RTL), `fr`.
- Group / Studio / Network ship trilingual.
- Nodes pick `primary_locale` at the tenant record; inherit `en` as fallback. NileX = `ar`.
- Translation pending state renders a minimal locale-fallback notice with deep-link to canonical (English) version.
- Translation workflow: in-Payload editing for marketing copy; JSON export for Publications-grade content where translators need full document context.
- Numerals: locale-formatted via `Intl.NumberFormat`. Dates: locale-formatted via `Intl.DateTimeFormat`. Arabic-Indic numerals on `ar`.

### 6.7 Cross-tenant syndication

Pages with `syndicate: true` (Case Studies, Publications, Insights Posts) are queryable across tenants. Aggregate views on parent tenants list with excerpt + origin attribution; canonical URL stays on origin tenant. Cross-locale fallback: aggregate renders the closest available locale with an "originally published in [language]" note.

### 6.8 Media

- Vercel Blob, single account.
- Per-tenant key prefix `merlx-blob/<tenant-slug>/<collection>/<file>`.
- Public bucket for marketing imagery; private bucket for gated Publication PDFs (rare, but supported).
- Follow established RIKO Blob upload recipe: dotenv + dynamic Payload imports + unique filename. HEAD-vs-GET asymmetry on retrieval — verify with `curl -si` not `curl -I`.

---

## 7. Tech Stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | **Next.js 16 App Router** | Server Components default; client components only where interactivity required (chooser, world map, lang switch) |
| CMS | **Payload v3** | Mounted on Next route handlers in same project; `@payloadcms/plugin-multi-tenant` |
| Database | **Neon Postgres** | Vercel Marketplace integration. Branched per environment |
| Storage | **Vercel Blob** | Single account, per-tenant key prefix |
| Hosting | **Vercel** | Fluid Compute default. `vercel.ts` for project config (rewrites, redirects, headers, crons) |
| DNS | **Vercel Domains** | `merlx.org` + wildcard `*.merlx.org` cert. Per-tool subdomains as CNAME / redirect records pointing to actual tool deployments |
| Email | **Resend** | Transactional. SPF/DKIM on `merlx.org`. Newsletter deferred to v1.1 |
| Auth (admin) | **Payload built-in** | Email + password, MFA optional, role-based |
| Routing middleware | **`proxy.ts`** (Next 16) | Resolves `Host` → tenant. Also handles tool-subdomain redirects |
| i18n routing | **`next-intl`** | Locale prefix routing. RTL via `<html dir>` attribute + Tailwind logical properties |
| Analytics | **Vercel Analytics** | Privacy-respecting, no cookies, no consent banner needed |
| Cookie / consent | **No tracking cookies** | Only essential auth cookies for admins |
| Site search | **Out of scope at v1** | Add Algolia or Pagefind in v1.5 if needed |
| Monitoring | **Sentry** + **Vercel Speed Insights** | |
| Forms | **Server Action → Payload `leads` + Resend** | No third-party form service |
| Spam protection | **Cloudflare Turnstile** | All public forms |
| AI features on the site | **None** | The Optics Suite tools have their own AI; the website doesn't |

### 7.1 Caching strategy

- Marketing pages **statically prerendered** via Next 16 Cache Components / `use cache` with `cacheTag` per-tenant and per-content-type.
- Editor publish → Payload `afterChange` hook → `updateTag()` invalidates the relevant Vercel CDN tags within seconds.
- `cacheLife: weeks` on stable content (homepage, About, Principles); `cacheLife: hours` on Insights feeds; `cacheLife: minutes` on the Network nodes index (pipeline status changes).
- Aggregate pages tagged `aggregate:insights` / `aggregate:publications`; cross-tenant publishes invalidate the aggregate tag too.

### 7.2 Performance budgets

| Metric | Target (95th percentile) |
|---|---|
| LCP | ≤ 1.5 s |
| INP | ≤ 200 ms |
| CLS | ≤ 0.05 |
| Total JS shipped to landing | ≤ 80 kb gzipped |
| Total CSS shipped to landing | ≤ 20 kb gzipped |
| Largest above-the-fold image | ≤ 80 kb (compressed AVIF) |

The chooser is CSS-only (no JS), the SVG backgrounds are inline (no extra requests), the logo is inline SVG. The landing should be among the fastest pages on the site.

### 7.3 Environments + branching

- **Production:** `main` branch → `merlx.org` and all `*.merlx.org`. Auto-deploy on merge.
- **Preview:** every PR gets a preview URL with its own Neon database branch seeded from a sanitised production snapshot. Tenant resolution falls back to an `x-tenant-override` header on `*.vercel.app` previews.
- **Local dev:** Docker Compose for Postgres + a seeded fixture, or a Neon preview branch via `vercel env pull`.

### 7.4 Repo structure

Single Next.js + Payload project (no monorepo). Single Vercel project, single deploy, multi-tenant via host header. Tools' separate apps stay in their existing repos / deployments — they're not pulled in.

---

## 8. Lead Capture & Forms

- **v1:** plain Server Action → Payload `leads` archive + Resend email + Cloudflare Turnstile.
- Lead carries: tenant, page, name, email, organisation, role, country, message, engagement-model interest, tool interest, source UTM, submitted_at, status.
- Routing: `lead_routes` table per tenant defines email inbox + (optional) Slack / Google Chat webhook.
- **v1.5+:** swap the email/Payload sink for HubSpot or Pipedrive integration without changing the form UX.
- Calendly link explicitly **not in scope** at v1.

---

## 9. Build Sequence

Phased plan; each phase ends in a state safe to pause at.

### Phase 0 — Foundation (≈ 2 weeks)

- Fresh repo `~/github/merlx-website`. Old scaffolds (`MERLX.org`, `merlx-web`, `MERLx-ai`, `MERLx`) archived, not deleted.
- Vercel project, Neon Postgres (Marketplace), Vercel Blob.
- Next.js 16 + Payload v3 mounted on shared route handlers. `@payloadcms/plugin-multi-tenant` wired.
- `proxy.ts` host-based tenant resolution. Tenant collection seeded with `group`, `studio`, `network`.
- `next-intl` routing scaffolded with RTL stylesheet pass.
- Design-system tokens. Real `MERLx_icon.svg` checked in.
- CI: lint, type-check, build, Lighthouse-CI gate.

**Exit:** an empty Studio tenant page renders at `studio.localhost.test`, content saves through Payload to Neon, locale switching works, RTL inverts.

### Phase 1 — Group front door (≈ 2 weeks)

- `merlx.org/` chooser (v16 hover-split). The only animated/interactive piece.
- `merlx.org/about`, `/insights`, `/publications`, `/contact`, `/legal/*`.
- Localised through EN minimum; AR + FR slots created with "translation pending" fallback.

**Exit:** merlx.org is publicly visitable, chooser works, contact form lands a `leads` row and an email.

### Phase 2 — Studio sub-site (≈ 2–3 weeks)

- Studio home, Optics Suite thesis page, six per-tool pages (real screenshots from existing tool repos).
- Engage landing + four engagement-model deep-dives.
- Principles, About, Insights, Publications, Studio-routed contact.

**Exit:** Studio sub-site is donor-pitch-quality and could launch on its own.

### Phase 3 — Network sub-site (≈ 2 weeks)

- Network home, Nodes directory with interactive world map, services landing + per-service deep-dives, become-a-node, Principles, About, Insights, Publications, Network-routed contact.

**Exit:** Network sub-site publicly visitable; Nodes index lists NileX with status "Active" once Phase 4 is live.

### Phase 4 — First node: NileX (≈ 2 weeks)

- Tenant record for NileX with `primary_locale = ar`, accent configured.
- DNS for `nilex.merlx.org` → Vercel.
- Standard node content authored (Home, About, Deployments, Case Studies, Publications, News, Contact).
- Bilingual minimum (AR + EN); FR optional.
- Cross-tenant syndication tested.
- Node-admin role tested.

**Exit:** NileX is live; multi-tenant model exercised end-to-end; node onboarding flow documented.

### Phase 5 — Trilingual fill-out (≈ 2 weeks, parallelises with Phase 4)

- All EN copy on Group / Studio / Network translated to AR + FR.
- UI chrome strings localised.
- RTL audit on AR routes — including a flag for whether the chooser's Studio→Network push should mirror to Network→Studio in RTL.
- Numerals and dates locale-formatted.

**Exit:** all three locales render every page; "translation pending" only used where intentional.

**Risk:** translation throughput is the project's biggest variable. Flagged as the largest schedule risk.

### Phase 6 — Pre-launch hardening (≈ 1 week)

- Performance budgets verified.
- Sentry + Vercel Speed Insights.
- Wildcard cert + DNS records.
- SEO per tenant: `sitemap.xml`, `robots.txt`, OpenGraph, JSON-LD (Organisation; each tool as `SoftwareApplication`).
- Accessibility audit pass (WCAG AA): keyboard nav of chooser, focus indicators, alt text, contrast, RTL flow.
- Lead routing end-to-end test.
- Rolling-release safety: feature flag on the chooser interaction so we can fall back to a static side-by-side card layout if the hover-split breaks on an untested browser.

**Exit:** ready for DNS cutover.

### Phase 7 — Launch (≈ days)

- DNS cutover for `merlx.org` and `*.merlx.org`.
- Tool subdomain DNS configured per the readiness table in Section 3. Publicly hosted tools (Aperture) get external redirects; the rest CNAME back to the website's Vercel project where `proxy.ts` resolves the host and renders the per-tool marketing page as a "Coming soon — request a demo" surface.
- Old scaffolds remain archived; no public redirect needed.
- Soft launch announcement.

### Estimated total

≈ **11–13 weeks** of focused work, with translation as the variable.

### Minimum v1.0 (if time-pressured)

Phases 0 + 1 + 2 + Phase 4 with NileX in EN only. Skip Phase 3 (Network condensed to a single `merlx.org/network` page). Skip translations to v1.1. ≈ **6-week** launch.

---

## 10. Out of Scope at v1

- **MERLx Cooperative section** (Impact Credits, MCPF pension, MSIF social impact fund, 3-ERA framing). Lives in the Whitepaper only at v1.
- **The tool apps themselves** — codebases, auth, UX. Website's job is marketing them and routing visitors to them.
- **Migration of existing MERLx web scaffolds** — fresh start, archive old ones.
- **SSO / `app.merlx.org` workspace** for tool users.
- **Embedded live tool previews.**
- **Newsletter signup + email digest.**
- **Site search.**
- **CRM integration** beyond the email + Payload archive sink.
- **Per-node visual customisation beyond accent colour, hero image, and tagline.**
- **AI features on the site** itself.
- **Calendly intro-call booking.**

---

## 11. Risks

| Risk | Mitigation |
|---|---|
| **Translation throughput** is the biggest schedule variable | Translation queue starts during Phase 0; Publications-grade content uses JSON export workflow; "translation pending" fallback guarantees ship-ability |
| **Multi-tenant edge cases** in `@payloadcms/plugin-multi-tenant` × localisation × roles | Layer custom hooks for cross-tenant syndication and per-node accent theming; build node-admin role tests as part of Phase 4 |
| **Chooser interaction on edge browsers** (older Safari, mobile WebView, low-power devices) | Feature flag with static side-by-side card fallback; Phase 6 accessibility & device matrix audit |
| **Profile / website copy contradiction** during transition (profile says "tech-partner studio"; site says "Studio + Network") | Refresh company profile shortly after site launch; until then, profile remains a downloadable artefact under About on Studio sub-site |
| **Tool subdomain DNS pointing at apps in different states of readiness** | For tools not publicly hosted, the subdomain renders the marketing page with "Coming soon — request a demo"; only publicly-ready tools get a real "Launch tool →" link |
| **Node-admin permissions leakage** (a NileX editor seeing other-node draft content) | Explicit test fixtures for tenant scoping in CI; multi-tenant plugin's `req.tenant` enforcement audited before Phase 4 |
| **Performance regression** as content grows | Lighthouse-CI gate on PR; perf budget table in this spec is enforced |
| **Stack newness** — Next.js 16 + Payload v3 + `@payloadcms/plugin-multi-tenant` are all current versions; multi-tenant × localisation × roles has limited public reference implementations | Phase 0 includes a tenant-resolution + locale + role smoke-test fixture; pin major versions and document upgrade path; budget extra hardening time in Phase 6 |
| **NileX content authoring** is a dependency on a separate workstream (NileX team writing the actual Sudan / HoA content, in AR + EN) | Phase 4 assumes EN copy is delivered by NileX before code work starts; AR translation overlaps with Phase 5; if NileX content slips, the Phase 4 timeline slips with it but other phases are unaffected |

---

## 12. Open Items

The following are deferred decisions, not blockers:

- **Whether the chooser's asymmetric Studio→Network push mirrors to Network→Studio in RTL.** Flagged for Phase 5 RTL audit.
- **Final accent-colour palette available to nodes.** Currently teal, deeper teal, sage, slate. To be confirmed when 2nd node is onboarded.
- **Whether `services` and `engagement_models` should remain CMS-edited or move to code-resident MDX once stable.** Default: CMS at v1.
- **Pre-launch performance review** of the inline SVG backgrounds. If the world-map dot count costs LCP, switch to a small CDN-hosted PNG with `Image` priority.
- **Eventual destination of the Cooperative content.** Likely a fourth top-level destination (`cooperative.merlx.org` or a section under `merlx.org/about`) once worker-ownership transition becomes communicable. Out of scope at v1.

---

## 13. Inputs (canonical references)

- `~/Documents/MERLx/MERLx_Company_Profile.pdf` — visual identity, tools list, engagement models, principles
- `~/Documents/MERLx/MERLx_Tech_Stack_Concept_Note.md` — Optics Suite background
- `~/Documents/MERLx/MERLx_Tool_Overview.md` — current canonical tool descriptions
- `~/Documents/MERLx/Blog/MERLx White Paper.docx` — three-layer (Studio / Network / Cooperative) framing, 12-year roadmap
- `~/Documents/MERLx/Logo/MERLx_icon.svg` — canonical logo, real hex colors
- `~/.claude/design-systems/MERLx-design-system.md` — base design system (extended in Section 5 above)
- `~/Documents/Dev/MERLx-website/.superpowers/brainstorm/*/content/landing-v16-color-swap.html` — landing-page final iteration

---

*End of spec.*
