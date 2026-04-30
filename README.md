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
# Note: dev Postgres runs on host port 5433 to avoid collision with any host-installed postgres.
# DATABASE_URL=postgres://merlx:merlx@localhost:5433/merlx_website
bun run dev
# visit http://localhost:3000/admin and create the first user
bun run seed
```

### Day-to-day

```bash
bun run dev          # start dev server (turbopack)
bun test             # vitest, but you'll usually want `bun run test`
bun run test         # unit tests (vitest)
bun run test:e2e     # E2E tests (playwright)
bun run typecheck    # tsc --noEmit
bun run lint         # biome check
bun run lint:fix     # biome auto-fix
bun run seed         # idempotent: seed group/studio/network tenants
```

### Tenant resolution in dev

`src/proxy.ts` reads the `Host` header. To preview different tenants locally:

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

## Plan + spec

- Spec: `docs/superpowers/specs/2026-04-30-merlx-website-design.md`
- Phase 0 plan: `docs/superpowers/plans/2026-04-30-merlx-website-phase-0-foundation.md`

Future phase plans (1 onward) will be added to `docs/superpowers/plans/` as they're written.
