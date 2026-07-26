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

`public/design-reference/atlas-rise-v1.png` is the approved homepage hero
composition. It is a reference contract, not a rasterized page background:
logo, navigation, heading, buttons, and labels remain live, semantic UI.

The first rendered homepage must preserve its essential composition:

- the Atlas briefcase is the dominant central object;
- all five labelled plates are readable in the first viewport;
- `YOJO` supports the product rather than overpowering it;
- the compact lower-left headline has one primary call to action;
- the first Guidance chapter continues from the same physical product world;
- the mascot is a later student-trail element, not a hero distraction.

## Compatibility baseline

The upstream Foundation pinned Next 15.3.0 while its allowed OpenNext range
resolved to a release requiring Next 15.5.21+. This port pins Next 15.5.21 and
keeps a lockfile. Do not loosen the dependency range or bypass peer checks.
