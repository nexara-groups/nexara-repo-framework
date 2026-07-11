# EECP Education Page Revamp — Design

**Date:** 2026-07-10
**Goal:** Turn `/eecp-therapy` (the clinic's USP page) into a page that educates patients on what EECP is, why it matters, and what a course of treatment feels like — with motion graphics that show the mechanism instead of describing it.

## Approach chosen

Pure SVG + CSS-keyframe animations, server-rendered, no new dependencies, no client JS beyond the existing `Reveal` component. Alternatives considered:

1. **Video embed** — needs produced footage we don't have; heavy; not brand-styled. Rejected for now (can be added later in the mechanism panel slot).
2. **Animation library (Framer Motion / Lottie)** — adds a dependency and client JS to a static marketing page. Rejected.
3. **Inline SVG + CSS keyframes (chosen)** — zero-dependency, matches the site's geometric editorial style, honors the existing `prefers-reduced-motion` global rule automatically.

## Page structure (top → bottom)

1. **Hero** — existing `PageHero`, sharper description naming the therapy and "non-surgical".
2. **Stat strip** — reuses `.stat-row`: 0 cuts/anaesthesia · 35 one-hour sessions · 7 weeks · FDA-cleared class.
3. **Mechanism section (mint)** — "works with your heartbeat": 4 numbered steps + animated diagram: live ECG trace, pulsing heart, three cuff pairs squeezing bottom-up during diastole, blood-flow particles travelling to the heart, synchronized release.
4. **Natural bypass section** — animated diagram of collateral vessels drawing in around a narrowed artery; benefits list framed as "reported in clinical studies".
5. **Who it helps (navy)** — 4 candidate profiles, value-list pattern.
6. **Course section** — 7×5 animated dot grid (35 sessions), what a patient does during the hour.
7. **A session at Rise** — existing sticky-photo chapter story, retained.
8. **Comparison table** — EECP vs interventional options on anaesthesia / stay / recovery / mechanism; explicitly not a decision tool.
9. **FAQ** — native `<details>` accordion, 6 questions, zero JS.
10. **Disclaimer + CTA** — retained coral-rule disclaimer, consultation CTA.

## Components

- `src/components/eecp-diagram.tsx` — `EecpMechanism`, `EecpNaturalBypass`, `EecpCourseGrid` (pure server components).
- `src/components/eecp-body.tsx` — the full page body, extracted from `src/app/[slug]/page.tsx` (which now just imports it).
- CSS appended to `globals.css` under `/* EECP education */`, with rules added to both breakpoints.

## Medical accuracy guardrails

FDA-cleared for chronic stable angina / heart failure; 35 × 1hr over ~7 weeks; ECG-gated diastolic inflation calves→thighs→hips, pre-systolic deflation; benefits phrased as studied outcomes, suitability always deferred to the clinician; disclaimer kept.
