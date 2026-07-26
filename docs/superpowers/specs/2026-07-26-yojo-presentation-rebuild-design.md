# Yojo presentation-layer rebuild — design

Date: 2026-07-26
Status: approved for planning
Scope: `src/app/**`, `src/components/**`, `src/styles/**` (new), `src/content/site.ts`,
`src/modules/learning-catalog/**` (extend, do not rewrite)

## 1. Why

The shipped presentation layer is not recoverable by patching.

**Visual contract breaches** (`AGENTS.md` → "Visual contract"):

- The homepage hero renders `atlas-hero-1600.webp`, whose five plates are blank.
  The contract requires all five labelled plates to be readable in the first
  viewport. The site currently ships zero plate labels.
- That same asset bakes the guide mascot into the hero. The contract places the
  mascot as "a later student-trail element, not a hero distraction".
- Navigation diverges from the approved reference (`Courses / Learning System /
  Student Journey / About / Contact`).

**Defects:**

- `--line-strong` is referenced six times in `src/app/globals.css` and never
  defined. `border: 1px solid var(--line-strong)` is invalid at computed-value
  time, so `.secondary-button`, every catalogue input, and every contact input
  render borderless.
- The contact form POSTs to a `mailto:` action with `encType="text/plain"`.
  Chrome performs no navigation; the form silently does nothing. It also
  presents an enquiry flow as live, which guardrail 7 forbids without a guarded
  module.
- Two disagreeing sources of truth for the eight programmes:
  `src/content/site.ts` (consumed by every page) and
  `StaticPublishedProgrammeRepository` (consumed only by `/api/programmes`).
  Categories and summaries differ between them.

**Quality:**

- `globals.css` is 19 KB minified onto 10 physical lines, with ~60 unnamed
  `clamp()` values and no spacing or type scale.
- Every component's JSX is minified onto single lines.
- `src/app/[slug]/page.tsx` renders fourteen distinct marketing pages from one
  hero-plus-three-cards template.
- The Atlas section fakes 3D by floating `skewY(-6deg)` divs over a photograph
  of an empty case; the perspectives cannot agree.
- Raw `<img>` throughout. No `next/image`, no `srcset`. Mobile downloads the
  1600 px hero although 480 and 960 derivatives exist.
- No font preload. `ibm-plex-mono-500.woff2` ships and is never referenced.
- `layout.tsx` declares no `metadataBase`, no OpenGraph/Twitter, no viewport,
  and no structured data.
- Atlas plate names live inside an `aria-hidden` container, so the five layers
  are decoration to assistive technology.

## 2. Locked decisions

| Decision | Choice |
| --- | --- |
| Styling | Hand-rolled CSS with a real token layer. No new styling dependency. |
| Hero direction | **A — Atlas Rise**, contract-literal. |
| Hero background | Extend the render's own studio; no cut-out asset required. |
| Scope | Full presentation layer. |
| Contact | Honest static contact block. No form until a guarded module exists. |
| Motion | Three tiers: CSS, anime.js v4, GSAP + ScrollTrigger. |
| Motion ambition | Signature-heavy — five set pieces. |

## 3. Non-goals

- No `enquiries`, `student-access`, `events`, or `careers` module.
- No authentication, registration, or persistence work.
- No changes to `src/core/**`, `src/infrastructure/**`, `src/features/**`, or
  `scripts/check-architecture.mjs`.
- No copy rewrite beyond what layout demands. See §12.
- No redesign of the generated image assets themselves.

## 4. Hero composition

The approved artifact is `public/design-reference/atlas-rise-v1.png`. The
implementation reproduces its composition with live UI.

**Background.** `atlas-case-empty` is used, not `atlas-hero` — its manifest
states it exists as an "empty background stage for five live HTML/CSS Learning
Atlas layers". The render is placed full-bleed and art-directed by
`object-position`, and the hero's own canvas colours are matched to the render's
floor and wall tones so the frame edge is invisible. The deep-blue aperture is a
designed part of the render and is kept: it sits behind the case and supplies
depth. No masking, no cut-out asset, no new art.

**Plate geometry.** Five plates are real DOM elements, positioned against the
case using proportions derived from the artifact:

- horizontal span: 17 %–91 % of the case body's width;
- vertical span: from 1.02 × case-height above the rim, down to 0.31 × case
  height below it;
- `skewY(5deg)` so each plate's right edge sits lower than its left, matching
  the render's camera;
- each successive plate steps right by ~3 % of plate width, and stacks in front
  of the one above it.

These are expressed as tokens, not inline magic numbers, so the composition can
be retuned in one place.

**Type and copy.** `YOJO` is set behind the product at ≤ 0.55 opacity so it
supports rather than overpowers. The lower-left lockup is a mono kicker, the
headline, a rule, and exactly one primary call to action.

**Acceptance checks** (§11 turns these into tests):

1. Five plate labels are present as text nodes in the server-rendered HTML.
2. The guide mascot does not appear anywhere in the hero subtree.
3. Exactly one primary CTA exists in the hero.
4. The case is the widest single element in the first viewport.

## 5. Design system

New directory, replacing `src/app/globals.css`:

```
src/styles/
  tokens.css           colour · type scale · spacing · radii · shadow · easing · z-layers
  base.css             reset · @font-face · body · focus-visible · reduced-motion
  compositions.css     shell · grid · stack · cluster · switcher primitives
  components/*.css     one file per component, formatted and commented
  index.css            import manifest, the single file layout.tsx imports
```

**Colour.** Semantic tokens over raw hex: `--surface-paper`, `--surface-raised`,
`--surface-field` (the dark organisation canvas), `--text-primary`,
`--text-muted`, `--text-inverse`, `--line`, `--line-strong` (now defined),
`--accent`, `--accent-quiet`. Each dark-canvas token has a `--surface-field`
scoped override rather than a separate `.organisation` cascade.

**Type.** Onest variable for display and UI; IBM Plex Mono for micro-labels, the
structural device both reference sites lean on. A fluid scale
`--step--2 … --step-8` built from `clamp()` once, then referenced by name. Both
faces preloaded. `ibm-plex-mono-500.woff2` is either used by the mono label
weight or deleted — it will not ship unreferenced.

**Spacing.** An 8 pt-derived fluid scale `--space-3xs … --space-3xl`. No
component declares a raw pixel margin.

**Motion tokens.** `--ease-out-expo`, `--ease-spring`, `--dur-fast|base|slow`,
shared by all three motion tiers so CSS and JS animation feel like one system.

## 6. Motion architecture

Three tiers with non-overlapping responsibilities.

**Tier 0 — CSS. 0 KB.**
Hover, focus, active, disclosure, simple in-view fades via
`animation-timeline: view()` behind an `@supports` guard, and route transitions
via the View Transitions API. Where `animation-timeline` is unsupported, content
renders in its final state — never hidden.

**Tier 1 — anime.js v4. ~18 KB gz, shared client chunk.**
Entrance choreography and discrete timelines. `createTimeline` and `stagger`
with spring easing:

- hero plate assembly (the signature moment — five plates rise and settle);
- section headline stagger;
- programme index row cascade;
- the Atlas chapter counter;
- SVG leader-line draw via `svg.createDrawable`.

anime.js v4 is ESM and tree-shakeable; only the used exports are imported.

**Tier 2 — GSAP 3.13+ with ScrollTrigger. ~70 KB gz, two routes, dynamic.**
Scroll-*scrubbed* and pinned sequences only, where ScrollTrigger's progress
mapping and pinning have no equivalent in the other tiers:

- the Atlas five-chapter pinned scrub on `/`;
- the Student Journey progress meter on `/student-journey`.

Loaded through `next/dynamic` with `ssr: false` so it is a separate chunk that
never blocks first paint and never ships on the other twelve routes.

**Why both libraries.** anime.js is a timeline engine, not a scroll scrubber —
its `onScroll` is a trigger. GSAP's ScrollTrigger is a scrubber and a pinner but
is heavy to load everywhere. Splitting on that boundary means neither is
carrying the other's work, and only two routes pay for tier 2.

**Cleanup.** Tier 1 keeps timeline refs and reverts on unmount. Tier 2 uses
`useGSAP` from `@gsap/react`, which scopes and reverts automatically — required
for React 19 Strict Mode double-invocation.

**Reduced motion.** Enforced at each tier's source, not by hiding output. Tier 0
via the media query. Tiers 1 and 2 check
`matchMedia('(prefers-reduced-motion: reduce)')` and render the final state
without animating. No set piece may be the only way to reach content.

**New dependencies.** `animejs@^4`, `gsap@^3.13`, `@gsap/react@^2`. All three
support React 19 without peer overrides. Guardrail 3 holds: if any install needs
`--force` or `--legacy-peer-deps`, the dependency is dropped, not forced.

## 7. Information architecture

`/`, `/courses`, `/courses/[programme]` and `/student-journey` keep dedicated
pages. The one-size `[slug]` template that currently renders the remaining
fourteen routes identically is replaced by four purpose-built templates:
marketing detail, editorial list, organisation, and contact/support.

| Template | Routes |
| --- | --- |
| Home | `/` |
| Catalogue + detail | `/courses`, `/courses/[programme]` |
| Journey | `/student-journey` |
| Marketing detail | `/about-us`, `/faculty`, `/placement-and-career-services` |
| Editorial list | `/insights`, `/events`, `/careers` |
| Organisation (dark canvas) | `/services` + four service detail routes |
| Contact / support | `/contact`, `/faqs`, `/portal` |

`/portal` states plainly that learner access is not yet live, per guardrail 7.
`/contact` presents real contact routes as links — no form.

Navigation is realigned to the approved reference: Courses, Learning System,
Student Journey, About, Contact, plus the primary CTA.

The dark organisation canvas is where Direction B's language is spent: mono
HUD, indexed rails, dot grid. It is a deliberate second register for the
services side of the business, not a second design system.

## 8. Data flow

Today `src/content/site.ts` and `StaticPublishedProgrammeRepository` both define
the eight programmes and disagree. `learning-catalog` becomes the single source.

- Server components read programmes through
  `getPublicServices().learningCatalogue`. `src/app/_services.ts` is the
  sanctioned edge seam, so this satisfies architecture rule 4 — no page reaches
  into `modules/*/application/` or `modules/*/infrastructure/`.
- `PublishedProgramme` stays provider-free and describes the *catalogue*. It
  gains no `image` field.
- Art direction lives in presentation: a slug-keyed media map next to the
  components that use it. Media is a design concern, not a domain concern.
- `legacySlug` is not promoted to the domain. Legacy URLs are already handled by
  the permanent redirects in `next.config.mjs`.
- `src/content/site.ts` is reduced to page copy definitions only; its
  `programmes` export is deleted.

`Result` from the service is handled at the page boundary: `notFound()` on a
not-found error, and a thrown error otherwise so the App Router error boundary
takes it. No page renders a silent empty state on failure.

## 9. Accessibility

- The five Atlas layers become a real ordered list with visible labels, not an
  `aria-hidden` decoration.
- The pinned Atlas sequence exposes the active chapter through live text, and
  all five chapters remain reachable without scrolling the pin.
- Focus-visible rings are a token, applied globally, never removed.
- Colour pairs on both canvases are checked to WCAG AA (4.5:1 body, 3:1 large).
  The current `--soft: #43546c` on `--paper: #edf1f7` is retained only if it
  measures; otherwise it darkens.
- The mobile navigation stops being a `<details>` element styled as a dialog and
  becomes a disclosure with correct labelling and focus management.

## 10. Performance budget

- Hero image: `next/image` with `priority`, real `srcset` across the existing
  480/960/1600 derivatives, explicit dimensions, no layout shift.
- All other media: `next/image`, lazy by default.
- Fonts preloaded; unreferenced faces removed.
- Tier 1 chunk ≤ 25 KB gz. Tier 2 chunk ≤ 75 KB gz and absent from routes that
  do not use it.
- LCP element on `/` is the hero heading — text, not the image — and must not be
  gated behind any animation.
- Metadata: `metadataBase`, OpenGraph, Twitter, canonical. `Organization` and
  `Course` JSON-LD.

## 11. Guardrail compliance

| Guardrail | How it is met |
| --- | --- |
| 1. `npm run verify` passes | Gate on every step. |
| 2. `npm run build` passes | Gate before hand-off. |
| 3. No `--force` / `--legacy-peer-deps` | Three deps added; a conflict means dropping the dep. |
| 4. No business logic in components | Presentation only; reads go through the service. |
| 5. Tenant-scoped repository reads | No tenant-owned read or write is added. |
| 6. Wiring only in `container.ts` / `_services.ts` | Both untouched. |
| 7. Nothing shown live without a guarded module | Contact form removed; `/portal` explicit. |
| Visual contract | §4 acceptance checks 1–4. |
| Compatibility baseline | Next stays pinned at 15.5.21; lockfile committed. |

Architecture-check rules 1–5 are unaffected: no provider SDK enters
presentation, no SQL is added, no module internals are imported from `src/app`.

## 12. Risks

- **Copy is placeholder-grade.** `site.ts` summaries are one-liners
  ("Cloud and infrastructure learning paths"). Award-grade layout over
  placeholder copy still reads as a template. The design will hold real copy
  when it arrives; the writing is the ceiling, and it is out of scope here.
- **Two motion libraries** means ~90 KB gz on the two routes using both, and two
  vocabularies to keep coherent. Mitigated by the strict tier boundary in §6 and
  the shared motion tokens in §5.
- **`animation-timeline` support.** Firefox still gates scroll-driven CSS
  animations. Tier 0 reveals degrade to final-state content, which is acceptable;
  no content depends on them.
- **The dev server on port 3000 is unusable** — a stale `.next` is serving
  `Cannot find module './611.js'`. Visual verification needs this resolved.

## 13. Sequencing

Ordered so the homepage is reviewable early rather than everything landing at once.

1. Token layer, base styles, fonts, metadata, JSON-LD. Delete `globals.css`.
2. Shell: header, footer, navigation, page frame.
3. Home hero — Direction A, static first, then the tier 1 assembly.
4. Atlas sequence — tier 2 pin and scrub.
5. Catalogue and programme detail, wired to `learning-catalog`.
6. Student Journey.
7. The four remaining templates.
8. Accessibility, performance, and contract-check pass.
9. `npm run verify` and `npm run build`.
