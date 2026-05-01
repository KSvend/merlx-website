# merlx-website — Claude operating rules

This file tells Claude how to work on this repo. The user is a senior engineer / consultant; he reads diffs and runs the dev server himself. Optimise for clarity in the work and economy in the process.

## What this repo is

Multi-tenant Next.js 16 + Payload v3 + Tailwind v4 site:
- `merlx.org` (group front door, hover-split chooser)
- `studio.merlx.org`, `network.merlx.org`, `[node].merlx.org`
- Tool subdomains (`prism.*`, `iris.*` etc.) route via DNS to external apps, not in this codebase.

Phase 0 (foundation) is merged. Phase 1 (group front door) executes on `phase-1-group-front-door`. See `docs/superpowers/specs/2026-04-30-merlx-website-design.md` and the matching plan files.

## Design system — MERLx (default-strict)

The MERLx design system at `~/.claude/design-systems/MERLx-design-system.md` is the source of truth for colour, type, radius, spacing, and motion in this repo. Read it before any UI work.

**Rule (default):**
- Use design-system tokens by default — `var(--color-…)`, `var(--font-…)`, `var(--radius-…)`, the established type scale, spacing scale, and motion easing.
- Raw values (hex colours, hardcoded px, ad-hoc easing) are allowed **only** when no token exists for the need, and **must carry a one-line comment** explaining why.
- Never invent tokens silently. If a value recurs, propose adding it to the token set rather than inlining.
- The chooser SVG cutouts are an explicit exception — they imitate external products (PRISM, federated ops console) and must use those products' actual colour identities. Document the exception inline.

If in doubt, prefer token over raw value.

## Execution mode — direct by default

**Default for this repo: edit, run tests, commit.** No subagent review loops on UI tweaks, copy, styling, marketing routes, page scaffolds, or content edits. The dev loop is fast and the user reads diffs.

**Auto-trigger the subagent triple-review flow (`superpowers:subagent-driven-development`) when the work is backend correctness:**
- Payload access rules (`access:` blocks, role gates, public-vs-admin reads)
- Multi-tenant routing and tenant gating (anything that decides what a non-group host can or cannot see)
- Server actions that write to the database, send email, or trigger external integrations
- Authentication / session / cookie / CSRF logic
- Money-touching code (none yet, but applies if added)
- Anything where a silent bug can leak data, expose admin surfaces, or persist incorrect state

For those: implementer + spec reviewer + code-quality reviewer per task, in that order. For everything else: just do the work.

When the user explicitly asks for a deeper review ("check this carefully", "review before merge", "/ultrareview"), follow the request even if it's not on the auto-trigger list.

## Model selection

**Best model by default; downshift when no quality difference is expected.**

- Default to the most capable available Claude model (currently Opus 4.7) for: design judgement, multi-file refactors, debugging, brainstorming, plan-writing, anything ambiguous, and the "implementer" role on backend-correctness tasks.
- Downshift to Sonnet 4.6 (or cheaper) when the task is mechanical and well-specified: applying a known patch, single-file edits with a clear spec, running tests + reporting, mass renames, doc tweaks, lint fixes, copy changes.
- For subagent reviewer roles when the triple-review flow runs: a standard model is fine — reviewers don't need more reasoning than the implementer.
- Never use a cheaper model just to save a few cents on something that needs design judgement. The cost of redoing bad work is higher than the cost of doing it right once.

Heuristic: if you can write a one-paragraph spec that another senior engineer would implement identically, you can downshift. If the task requires you to make a judgement call, don't.

## Testing discipline

Match test density to risk:

| Surface | When to write tests |
| --- | --- |
| Server actions, Payload hooks, access control, multi-tenant gates | Always — unit + at least one E2E asserting the gate works |
| API routes, data-fetching helpers, parsers | Always — unit |
| UI components with non-trivial behaviour (forms, state machines, conditional rendering) | Yes — E2E for the happy path; unit if logic is interesting in isolation |
| UI components that are pure presentation | No, unless asked |
| Pure styling, copy, SVG, layout tweaks | No |
| Bug fixes | Add a regression test if the bug was non-trivial (caused real wrong behaviour, not just a typo). Skip if the fix is mechanical and obvious. |

Don't pad coverage. A test that asserts `expect(component).toBeTruthy()` is worse than no test — it gives false confidence.

## Code conventions (carry-forward from Phase 0)

These are non-negotiable in this repo:

- **No `.js` extensions on TypeScript imports.** Bun + Next 16 + the TypeScript resolver handle this; adding `.js` breaks Vitest.
- **`src/proxy.ts`, not root.** Next 16 looks for the proxy file at `src/proxy.ts` in this project.
- **App Router `_`-prefix folders are private.** Use them for colocated utilities you don't want routed.
- **Payload v3.84 default access denies anonymous reads.** Public collections need an explicit `access.read` rule. The reusable helper is `publicRead` in `src/access/publicRead.ts`.
- **Dev Postgres on port 5433.** Avoids macOS host-Postgres collisions. `docker compose -f docker-compose.dev.yml up -d`. Production `DATABASE_URL` is injected by the Vercel/Neon Marketplace integration.
- **Inline `style={{...}}` with CSS custom properties is the established pattern for design-token-driven styling.** Don't introduce styled-components, emotion, vanilla-extract, or CSS modules unless the task requires it.
- **Tenant gating helpers live in `src/lib/tenant-aware.ts`.** `isGroupTenant(headers)` for gate-only checks; `requireGroupTenant(headers, payload)` when you also need the tenant doc. Don't duplicate the logic.

## Git, branches, safety

- Don't push to remotes unless explicitly asked.
- Don't run destructive git operations (`reset --hard`, `push --force`, `branch -D`, `checkout -- .`) unless explicitly asked.
- Default to feature branches for multi-task work; direct commits on the current branch are fine for one-off edits the user is watching.
- Use the existing `phase-N-...` branch naming convention for big efforts.
- Commits should be small and topical. Never amend a published commit. Don't bypass hooks (`--no-verify`, `--no-gpg-sign`) unless the user asks.

## Visual changes — verification

For UI / visual edits: after committing, briefly describe what visually changed in plain language so the user can sanity-check without running the dev server. Example: "Chooser content now vertically centred; CTA moved up with the block instead of pinning to the bottom."

If the dev server is already running, mention the URL and what to look at. Don't auto-take screenshots or open browsers unless asked.

## What not to do

- Don't add documentation files (`*.md`, READMEs) unless the user asks. The plan and spec files in `docs/superpowers/` are the project's source of truth.
- Don't add dependencies casually. New packages need a clear justification (the existing tool can't do it, or the cost of re-implementing it is high).
- Don't introduce new design abstractions (component libraries, theme providers, custom hooks for trivial things) unless the task requires it. Three similar lines is better than a premature abstraction.
- Don't deploy. Vercel deploys are user-triggered.
- Don't open PRs without being asked.

## When in doubt

Ask one question, then proceed. The user prefers a brief clarification over a wrong assumption, but also prefers a sensible default executed quickly over a five-question intake form.
