# Phase 3 — Network sub-site at network.merlx.org

**Spec:** §4.3 + §9 Phase 3
**Branch:** `phase-3-network`
**Estimated:** 2 weeks
**Phase 2 baseline:** studio.merlx.org shipped; tenant helpers, SiteNav variants, requireKnownTenant pattern proven.

## Goal

Build the Network sub-site. Donor / partner can read home → nodes (NileX visible) → services → become-a-node and understand what the federation is and how to join.

## Out of scope

- Individual node tenants like `nilex.merlx.org` (Phase 4).
- Promoting `nodes` to a Payload collection — static content for v1; promote when 5+ nodes are real.
- Trilingual translation (Phase 5 stub).

## Routes

```
network.merlx.org/
  /                       NetworkHome
  /nodes                  Nodes directory
  /nodes/[slug]           Per-node profile
  /services               Services landing
  /services/[slug]        Per-service deep-dive
  /become-a-node          Onboarding pitch + criteria
  /principles             Network's commitments
  /about                  Governance + relationship to Studio
  /insights, /insights/[slug]
  /publications, /publications/[slug]
  /contact
```

## Tasks

### Task 1: Network content data (nodes, services, principles)
**Files:** `src/content/nodes.ts`, `src/content/services.ts`, `src/content/network-principles.ts`

- `nodes.ts`: NileX (active, AR primary, Sudan), plus 3-4 placeholder/onboarding nodes.
- `services.ts`: 4-6 service categories (MERL, EWER, KIIs, evaluation, partner support, etc.).
- `network-principles.ts`: Network-flavored commitments (federation, local epistemics, conflict-sensitivity) + beliefs.

### Task 2: NetworkHome
Hero + active-nodes preview + services strip + CTA to /become-a-node.

### Task 3: /nodes index + /nodes/[slug]
Index lists all nodes with status pills (active / onboarding). Detail page renders per-node profile with link out to that node's subdomain when ready.

### Task 4: /services index + /services/[slug]
Index lists all services. Detail page renders deep-dive description.

### Task 5: /become-a-node
Pitch + criteria + 5-step process + CTA to /contact.

### Task 6: /principles (network variant)
Branch on tenant kind in the existing `/principles` page so studio + network each show their own set.

### Task 7: SiteNav network variant
Extend SiteNav to render network nav links + teal `MERLx Network` brand mark when kind === 'network'.

### Task 8: Tenant gating + walkthrough E2E
Extend `tenant-gating.spec.ts` for network-only routes 404 on group/studio. New `network-routes.spec.ts` for the network walkthrough.

### Task 9: Final polish + merge

## Exit checklist

- network.merlx.org/ renders NetworkHome
- /nodes lists NileX (active) + onboarding placeholders
- /nodes/nilex renders NileX profile
- /services lists 4-6 services with deep-dives
- /become-a-node renders the pitch
- /principles works on both studio and network with the right copy
- /about, /insights, /publications, /contact work for network tenant
- All non-network hosts 404 on /nodes, /services, /become-a-node
- 50+ E2E tests passing
- typecheck/lint clean
