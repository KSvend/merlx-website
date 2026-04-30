# MERLx Website

The public website for MERLx, a Nordic Product Studio for monitoring, evaluation, research, and learning tooling.

## Stack

- Next.js 16 (App Router, Turbopack)
- React 19
- TypeScript (strict mode)
- Biome (lint + format)
- Vitest (unit) + Playwright (e2e)
- Bun as package manager

## Development

```bash
bun install
bun run dev
```

The dev server runs at http://localhost:3000.

## Scripts

- `bun run dev` — start the dev server with Turbopack
- `bun run build` — production build
- `bun run start` — start the production server
- `bun run lint` — Biome check
- `bun run lint:fix` — Biome check with auto-fix
- `bun run format` — Biome format
- `bun run typecheck` — TypeScript no-emit check
- `bun run test` — Vitest unit tests
- `bun run test:watch` — Vitest in watch mode
- `bun run test:e2e` — Playwright e2e tests
- `bun run test:e2e:install` — install Playwright browsers

## Documentation

- Design spec: [`docs/superpowers/specs/2026-04-30-merlx-website-design.md`](./docs/superpowers/specs/2026-04-30-merlx-website-design.md)
- Phase 0 plan: [`docs/superpowers/plans/2026-04-30-merlx-website-phase-0-foundation.md`](./docs/superpowers/plans/2026-04-30-merlx-website-phase-0-foundation.md)
