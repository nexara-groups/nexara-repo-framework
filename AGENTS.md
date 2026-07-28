# Yojo Port Guardrails

This repository is the only permitted implementation base for the Yojo rebuild.
The sibling static-site directory is an archived visual/content source, never a
shipping implementation target.

## Non-negotiable gates

1. `npm run verify` must pass before any feature is called complete.
2. `npm run build` must pass before a release candidate is presented.
3. Do not use `--force` or `--legacy-peer-deps` to bypass dependency conflicts.
4. Do not place business logic, SQL, vendor SDK imports, or Supabase calls in
   React components, server actions, route handlers, or application services.
5. Every tenant-owned read or write goes through a repository port, accepts a
   `TenantContext`, and filters `tenant_id` in its infrastructure SQL.
6. The only provider wiring point is `src/core/container.ts`; the edge seam is
   `src/app/_services.ts`.
7. No authentication, registration, enquiry, event, job, or course-management
   flow may be represented as live until it has a guarded module, a real route,
   and a persistence/auth decision.

## Required module shape

All Yojo business capabilities live in `src/modules/<name>/` and follow:

`presentation → application → domain`, with `infrastructure` implementing
domain ports. Modules must not import another module's internals; use the event
bus for a cross-module reaction.

## Visual contract

The Yojo Signal system is the active visual contract. It is a professional,
security-first dark editorial language with one cyan signal accent, live
semantic copy, original cyber imagery, and scroll motion tied to the learner
journey.

- The homepage opens with one clear cybersecurity proposition and two honest
  conversion routes: WhatsApp and enquiry.
- The five-stage learner journey is the primary scroll narrative.
- Original media supports the content; interface text is never baked into it.
- Organisation services have an equally credible path without competing with
  the learner story.
- Motion must preserve the reading order and degrade cleanly for reduced-motion
  preferences and touch devices.
- Do not restore retired product-object, mascot, bright-metal, plate, rail, or
  briefcase concepts.

## Compatibility baseline

The upstream Foundation pinned Next 15.3.0 while its allowed OpenNext range
resolved to a release requiring Next 15.5.21+. This port pins Next 15.5.21 and
keeps a lockfile. Do not loosen the dependency range or bypass peer checks.
