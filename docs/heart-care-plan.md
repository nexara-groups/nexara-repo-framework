# Heart Care page — plan & handoff

_Last updated: 2026-07-11. Branch: `codex/rise-medical-hub`._

The `/heart-care` flagship guide is **built and working**. This doc captures the
current state, the architecture (so the heart figure and its animation aren't
accidentally broken), what was just done, and the remaining polish items.

---

## 1. Current status — done

- **Full 8-chapter guide** at `/heart-care` — complete, sequential, medically sound
  (audited 2026-07-11, no content gaps or numbering mistakes).
- **Heart SVG rebuilt to industry-standard anatomy** (commit `64d2679`) — replaced the
  old valentine shape with patient-education proportions (domed base, small atria,
  dominant ventricles, single offset apex; clean color-keyed stroked-tube vessels).
- **Blood-flow scrollytelling** (Chapter 01) verified end-to-end with the new geometry.
- Hero, chapter rail, cross-links, and all linked routes (`/appointment`,
  `/diagnostics`, `/eecp-therapy`, `/health-packages`, `tel:108`) confirmed live.

### The chapter arc (all present, ids match `chapters` array + ChapterRail)

| # | id | Component | Notes |
|---|----|-----------|-------|
| 01 | `how-it-works` | `HeartFlowScrolly` | pinned scrolly, blood-flow through the heart |
| 02 | `numbers` | `VitalsDials` | BP, resting HR, LDL, HbA1c arc gauges |
| 03 | `narrowing` | `ArteryScrolly` | pinned scrolly, plaque → angina → heart attack |
| 04 | `conditions` | `ConditionsGuide` | 8-condition accordion ("Eight conditions") |
| 05 | `warning-signs` | `TriageSigns` | emergency (108) vs planned-review triage |
| 06 | `protect` | `ProtectHabits` | 6 habits |
| 07 | `tests` | `HeartTests` | 5 tests |
| 08 | `treatment` | `TreatmentPath` | medicines / procedures / EECP "third option" |
| — | — | `HeartCloser` | closer CTA + FAQ (FAQPage JSON-LD) |

Content lives in `src/content/heart-guide.ts` (chapters, flowSteps, vitals, conditions,
emergencySigns, plannedSigns, heartTests, protectHabits, heartFaqs, arterySteps).
Components never inline copy.

---

## 2. Heart figure architecture — READ BEFORE EDITING THE SVG

`src/components/heart/heart-figure.tsx` is a pure-SVG server component used in three
places, and its ids/classes are the **animation contract** that
`heart-flow-scrolly.tsx` drives. Do not rename these hooks.

- **Props:** `ids` (default true — only the ONE animated instance gets ids; other
  instances pass `ids={false}` to avoid duplicate-id collisions), `lungs` (default true;
  hero passes `lungs={false}`).
- **Consumers:** `HeartHero` (`ids={false} lungs={false}`), `HeartFlowScrolly` (one
  animated `<HeartFigure/>` in `.hc-flow-art` + per-beat fallback figs `ids={false}`),
  and the home teaser in `src/app/page.tsx`.

### Hooks the animation targets (must stay)

- **Chambers** (fill-opacity animated): `.hf-ra .hf-rv .hf-la .hf-lv` (+ ids `#hf-ra` …).
  They **tile** via shared septum + AV-groove borders — adjacent chambers reuse the
  identical border control points (one forward, one reversed). Break that and you get gaps.
- **Vessels** (now stroked tubes): groups `#hf-pa #hf-vc` (blue) and `#hf-aorta #hf-pv`
  (coral), class `hf-vessel` + the id-class. Color is keyed in CSS by
  `.hf-vessel.hf-pa/.hf-vc` (blue) and `.hf-vessel.hf-aorta/.hf-pv` (coral).
- `.hf-lung` ×2, `.hf-lv-wall` (inner arc, strokeWidth animated on beat 3), `.hf-valve
  path` ×4, `#hf-outline`, `#hf-septum`, `.hf-groove`.
- **Motion lanes** (invisible): `.lane-in .lane-lungs .lane-return .lane-out` — particles
  ride these via GSAP MotionPathPlugin. If you move the silhouette, re-fit these.
- **Particles** ×12 (3/lane): `.hf-particle-{in,lungs,return,out}`; `cx/cy` sit at
  `laneStart`. Colors set in CSS (in/lungs blue, return/out coral).
- **Labels** ×8: `.hf-label-{ra,rv,la,lv,aorta,pa,vc,pv}` (opacity revealed per beat).

### Coordinate system

`viewBox="-100 -85 620 560"`. Apex ≈ (178,428), septum-groove crossing ≈ (189,192),
vessels rise to negative y. Labels sit outside the silhouette (extra viewBox margin
gives them room; they're `opacity:0` until animation reveals them).

### CSS

Heart styles: `src/app/globals.css` around lines **823–865** (base), **878–890**
(hero navy override — vessels brighten to `#93b4ef`/`#ff8a9c` on navy, don't force white),
**902–930** (per-beat fallback painting — note beat-2 PA and beat-4 aorta reveal via
**`stroke-opacity`**, not fill-opacity, since vessels are stroked now).

### Fallback / reduced-motion

Below 900px or with reduced motion, the pinned scrollies (`how-it-works`, `narrowing`)
disable and render inline `data-beat` static figures painted by CSS. Keep both paths in
sync when changing beat logic.

---

## 3. Working reference files (not shipped)

Scratch/exploration HTML kept in `docs/` for reference only — they don't touch the app:
`heart-svg-directions-v2.html` (the 4 style directions the current SVG came from),
`heart-hero-concept.html` / `heart-hero-variants.html` (the canvas "Living Organ"
experiment that was tried and **reverted** — the SVG blood-flow version was preferred).

---

## 4. Polish — DONE (commit `1266b28`, 2026-07-12)

1. ~~Anchor offset~~ — `scroll-margin-top` on all 8 chapter ids: 168px base (header 87
   + pill bar 72 = 159 measured), 100px at ≥1100px (header only). In globals.css next to
   the hero heart overrides.
2. ~~Home teaser~~ — verified on paper background: reads clean (pale chamber tints,
   colored vessel tubes, mint lungs).
3. ~~Dead CSS~~ — removed unused `.hc-chapter-title` and the no-op
   `.hc-hero … .hf-lv-wall { fill-opacity }` (lv-wall is a stroked path, fill:none).
4. ~~Lighthouse~~ — prod `/heart-care`: **perf 89, a11y 100, BP 100, SEO 100, CLS 0,
   TBT 50ms** (stable across 2 runs). LCP 3.8s = hero dek `<p>` under simulated slow-4G
   font arrival — pre-existing, fonts already optimal via next/font (variable, subset,
   preloaded). Not caused by the SVG work; further gains would need font-strategy surgery.
5. ~~Vessel top cluster~~ — PA fork branches tapered 14→12 and left branch stopped short
   (ends 112,-30); vena cava re-routed left (ends 84,-26, width 14). `lane-in` +
   `laneStart.in` re-fitted to the new VC (96,-42). Flow animation re-verified end-to-end.

**Note:** `src/app/heart-care-compare/` + `heart-care-alternative.tsx` + the
`.hc-alt` CSS block at the end of globals.css are a separate uncommitted exploration
(alternative heart-care page) — intentionally left out of the polish commit.

---

## 5. Known environment quirk (not a bug)

The headless Browser pane throttles `requestAnimationFrame` when backgrounded and snaps
scroll to top on pinned ScrollTrigger sections — so canvas/animation frames and pinned-
section screenshots can appear blank/reset **in the pane only**. Verify animation by
driving `window.__heartFlowTl` / `__arteryTl` timelines directly, or by reading DOM state;
it all runs normally in a real browser. Don't "fix" a blank pinned screenshot by changing
code — check it's the quirk first.

### Verifying the flow animation quickly
```js
const tl = window.__heartFlowTl;            // exposed in dev
const q = s => document.querySelector('.hc-flow-art ' + s);
tl.progress(0.03); // particle 'in' starts near vena cava (top-left)
tl.progress(0.13); // it has ridden down the lane
tl.progress(0.28); // getComputedStyle(q('.hf-ra')).fillOpacity === '0.45'
tl.progress(0.48); // q('.hf-particle-lungs') fill turns coral (rgb 220,95,114)
tl.progress(0.90); // particle 'out' exits up the aorta
```

---

## 6. Build / verify commands

- `npm run typecheck` — must be clean.
- `npm run dev` (port 3000) — after any `next build`, the dev server's `.next` may be
  clobbered; `rm -rf .next` and restart dev if you see `routes-manifest.json` ENOENT.
- Prod Lighthouse: `npm run build` then `npx next start -p 3001` and run lighthouse there
  (dev-mode perf numbers are meaningless).
