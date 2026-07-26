# Yojo Presentation-Layer Rebuild — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Yojo marketing site's presentation layer with a token-driven, contract-compliant, three-tier-motion implementation that satisfies the approved hero artifact and the repo's architecture gates.

**Architecture:** All business logic stays where it is — `src/core`, `src/modules/learning-catalog`, and the `_services.ts` seam are untouched except as *consumers*. The rebuild is confined to `src/app/**`, `src/components/**`, `src/content/**`, and a new `src/styles/**`. Presentational components receive data as props; pages do the fetching through `getPublicServices()`. Motion is split into three tiers with non-overlapping jobs so neither animation library carries the other's work.

**Tech Stack:** Next.js 15.5.21 (App Router, RSC), React 19.1.0, hand-rolled CSS with a token layer, anime.js 4.5.0, GSAP 3.15.0 + `@gsap/react` 2.1.2, Vitest 4.1.10.

Spec: `docs/superpowers/specs/2026-07-26-yojo-presentation-rebuild-design.md`

## Global Constraints

Every task's requirements implicitly include this section.

- **Dependency floors are fixed.** Next stays at `15.5.21`, React at `19.1.0`. Do not loosen any range. The lockfile is committed.
- **Never use `--force` or `--legacy-peer-deps`.** If an install requires either, drop the dependency and report it rather than forcing it.
- **`npm run verify` must pass before every commit.** It runs `node scripts/check-architecture.mjs && tsc --noEmit`.
- **`npm run build` must pass before the final hand-off.**
- **No provider SDK imports** (`@supabase/*`, `@opennextjs/cloudflare`) outside `src/core/*/providers`, `src/core/container.ts`, `src/app/_services.ts`.
- **No business logic, SQL, or vendor SDK calls** in React components, route handlers, or server actions.
- **`src/app/**` may not import** `src/modules/*/application/**` or `src/modules/*/infrastructure/**`. Go through `_services.ts` or a presentation handler.
- **Nothing may be presented as live** without a guarded module, a real route, and a persistence/auth decision. This governs contact, enquiry, registration, events, careers, and the student portal.
- **TypeScript is strict** with `verbatimModuleSyntax: true` (use `import type` for type-only imports) and `noUncheckedIndexedAccess: true` (indexing an array yields `T | undefined` — handle it).
- **Copy uses British spelling**, matching existing content: *programme*, *organisation*, *centre*, *specialise*.
- **Visual contract** (`AGENTS.md`): the Atlas briefcase is the dominant central object; all five labelled plates readable in the first viewport; `YOJO` supports rather than overpowers; compact lower-left headline with exactly one primary CTA; the mascot is not a hero element.
- **All motion respects `prefers-reduced-motion: reduce`.** No content may be reachable only via an animation.

---

## File Structure

**Created:**

| Path | Responsibility |
| --- | --- |
| `vitest.config.ts` | Test runner config; node env; `next/image` alias |
| `tests/stubs/next-image.tsx` | Minimal `next/image` stand-in for tests |
| `tests/atlas-layers.test.ts` | The five layers are stable data |
| `tests/hero-contract.test.tsx` | Visual-contract acceptance test |
| `src/styles/index.css` | Import manifest — the only stylesheet `layout.tsx` imports |
| `src/styles/tokens.css` | Colour, type scale, spacing, radii, shadow, easing, z-layers |
| `src/styles/base.css` | Reset, `@font-face`, body, focus rings, reduced-motion |
| `src/styles/compositions.css` | `shell`, `stack`, `cluster`, `grid` layout primitives |
| `src/styles/components/*.css` | One file per component |
| `src/content/atlas-layers.ts` | The five Atlas layers (id, label, headline, body) |
| `src/content/programme-media.ts` | Slug → image map (presentation concern only) |
| `src/lib/motion/reduced-motion.ts` | `prefersReducedMotion()` helper |
| `src/components/layout/*.tsx` | Header, footer, nav disclosure, page frame |
| `src/components/hero/*.tsx` | Atlas hero, plate, client assembly |
| `src/components/atlas/*.tsx` | Atlas sequence shell + GSAP scrub client |
| `src/components/catalogue/*.tsx` | Course ledger, programme card |
| `src/components/journey/*.tsx` | Student trail + GSAP meter client |
| `src/components/templates/*.tsx` | Four page templates |
| `src/components/icons/layer-icons.tsx` | Five inline SVG layer icons |

**Modified:** `package.json`, `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/[slug]/page.tsx`, `src/app/courses/page.tsx`, `src/app/courses/[programme]/page.tsx`, `src/content/site.ts`.

**Deleted:** `src/app/globals.css`, `src/components/atlas-experience.tsx`, `src/components/student-trail.tsx`, `src/components/course-ledger.tsx`, `src/components/site-shell.tsx`, `src/components/route-utility.tsx`.

---

### Task 1: Test harness and the Atlas layer data

**Files:**
- Create: `vitest.config.ts`, `tests/stubs/next-image.tsx`, `src/content/atlas-layers.ts`, `tests/atlas-layers.test.ts`
- Modify: `package.json`

**Interfaces:**
- Consumes: nothing.
- Produces: `ATLAS_LAYERS: readonly AtlasLayer[]`, `type AtlasLayer = { id: AtlasLayerId; label: string; headline: string; body: string }`, `type AtlasLayerId = "guidance" | "curriculum" | "practice" | "feedback" | "placement"`. Consumed by Tasks 4, 5, 6.

- [ ] **Step 1: Install the test runner**

```bash
npm install --save-dev vitest@^4.1.10
```

Expected: completes with no `ERESOLVE` error. If npm reports a peer conflict, **stop** — do not retry with `--force` or `--legacy-peer-deps`. Report the conflict.

- [ ] **Step 2: Add the test scripts**

In `package.json`, add to `"scripts"`:

```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 3: Write the Vitest config**

Create `vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  esbuild: { jsx: "automatic", jsxImportSource: "react" },
  resolve: {
    alias: {
      "next/image": fileURLToPath(new URL("./tests/stubs/next-image.tsx", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts", "tests/**/*.test.tsx"],
  },
});
```

- [ ] **Step 4: Write the `next/image` stub**

Create `tests/stubs/next-image.tsx`. The real `next/image` needs the Next runtime; the contract test only cares which asset is referenced.

```tsx
import type { ImgHTMLAttributes } from "react";

type StubProps = ImgHTMLAttributes<HTMLImageElement> & {
  readonly src: string;
  readonly alt: string;
  readonly priority?: boolean;
  readonly fill?: boolean;
};

export default function Image({ priority: _priority, fill: _fill, ...rest }: StubProps) {
  return <img {...rest} />;
}
```

- [ ] **Step 5: Write the failing test**

Create `tests/atlas-layers.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { ATLAS_LAYERS } from "../src/content/atlas-layers";

describe("ATLAS_LAYERS", () => {
  it("has exactly five layers, matching the approved artifact", () => {
    expect(ATLAS_LAYERS).toHaveLength(5);
  });

  it("preserves the approved label order", () => {
    expect(ATLAS_LAYERS.map((layer) => layer.label)).toEqual([
      "Guidance",
      "Curriculum",
      "Practice",
      "Feedback",
      "Placement Support",
    ]);
  });

  it("gives every layer a unique id and non-empty prose", () => {
    const ids = ATLAS_LAYERS.map((layer) => layer.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const layer of ATLAS_LAYERS) {
      expect(layer.headline.length).toBeGreaterThan(0);
      expect(layer.body.length).toBeGreaterThan(0);
    }
  });
});
```

- [ ] **Step 6: Run the test to verify it fails**

Run: `npm test`
Expected: FAIL — `Failed to resolve import "../src/content/atlas-layers"`.

- [ ] **Step 7: Write the layer data**

Create `src/content/atlas-layers.ts`. Prose is carried over from the existing `atlas-experience.tsx`, which is the only part of that component worth keeping.

```ts
/**
 * The five Learning Atlas layers. This order is a visual contract: the approved
 * hero artifact (`public/design-reference/atlas-rise-v1.png`) shows these five
 * labels, in this sequence, on live plates. Changing the order or the labels is
 * a contract change, not a copy edit — see `tests/hero-contract.test.tsx`.
 */
export type AtlasLayerId = "guidance" | "curriculum" | "practice" | "feedback" | "placement";

export interface AtlasLayer {
  readonly id: AtlasLayerId;
  readonly label: string;
  readonly headline: string;
  readonly body: string;
}

export const ATLAS_LAYERS: readonly AtlasLayer[] = [
  {
    id: "guidance",
    label: "Guidance",
    headline: "Start with your actual position.",
    body: "Clarify your current skills, target role, available time and learning format before choosing a programme.",
  },
  {
    id: "curriculum",
    label: "Curriculum",
    headline: "Make the route visible.",
    body: "Foundations, tools and applied work are placed in a sequence you can understand before you commit.",
  },
  {
    id: "practice",
    label: "Practice",
    headline: "Turn recognition into capability.",
    body: "Labs, exercises and project work reveal what you can use independently and what needs another attempt.",
  },
  {
    id: "feedback",
    label: "Feedback",
    headline: "Create the next useful attempt.",
    body: "Specific review identifies what broke, why it broke and what to improve when you return to the work.",
  },
  {
    id: "placement",
    label: "Placement Support",
    headline: "Prepare the transition.",
    body: "Learning evidence becomes a clearer resume, interview preparation and relevant opportunity support where available.",
  },
];
```

- [ ] **Step 8: Run the test to verify it passes**

Run: `npm test`
Expected: PASS — 3 tests.

If the run fails with a JSX transform error from the stub, add `@vitejs/plugin-react` as a devDependency and register it in `vitest.config.ts` under `plugins`. Do not force the install.

- [ ] **Step 9: Verify the architecture gate still passes**

Run: `npm run verify`
Expected: `Architecture check passed` and no TypeScript errors.

- [ ] **Step 10: Commit**

```bash
git add vitest.config.ts tests package.json package-lock.json src/content/atlas-layers.ts
git commit -m "test: add vitest harness and Atlas layer data"
```

---

### Task 2: Token layer, base styles, and document metadata

**Files:**
- Create: `src/styles/index.css`, `src/styles/tokens.css`, `src/styles/base.css`, `src/styles/compositions.css`
- Modify: `src/app/layout.tsx`
- Delete: `src/app/globals.css`

**Interfaces:**
- Consumes: nothing.
- Produces: the CSS custom-property vocabulary every later task uses — `--surface-*`, `--text-*`, `--line`, `--line-strong`, `--accent*`, `--step--2`…`--step-8`, `--space-3xs`…`--space-3xl`, `--radius-*`, `--shadow-*`, `--ease-*`, `--dur-*`, `--z-*`; and the composition classes `.shell`, `.stack`, `.cluster`.

- [ ] **Step 1: Write the token layer**

Create `src/styles/tokens.css`. Note `--line-strong`, referenced six times by the old stylesheet and never defined — that omission is why every button border and form input currently renders borderless.

```css
:root {
  /* ---- surfaces ------------------------------------------------------ */
  --surface-paper: #eef1f6;
  --surface-raised: #fbfcfe;
  --surface-sunken: #e2e8f1;
  --surface-field: #050f1d;        /* dark organisation canvas */
  --surface-field-raised: #071527;

  /* ---- text ---------------------------------------------------------- */
  --text-primary: #071a36;
  --text-muted: #465a74;           /* darkened from #43546c for AA on paper */
  --text-inverse: #e8eefa;
  --text-inverse-muted: #a4bad8;

  /* ---- lines --------------------------------------------------------- */
  --line: rgba(7, 26, 54, 0.14);
  --line-strong: rgba(7, 26, 54, 0.28);
  --line-inverse: rgba(150, 190, 255, 0.20);

  /* ---- brand --------------------------------------------------------- */
  --brand-blue: #0b3f91;
  --brand-deep: #06285e;
  --accent: #2d8fff;
  --accent-quiet: rgba(45, 143, 255, 0.18);

  /* ---- hero stage: matched to the atlas-case-empty render ------------- */
  --stage-wall: #f2f4f8;
  --stage-floor: #e6ebf2;
  --stage-aperture: #17458c;

  /* ---- fluid type scale ---------------------------------------------- */
  --step--2: clamp(0.69rem, 0.67rem + 0.10vw, 0.75rem);
  --step--1: clamp(0.83rem, 0.79rem + 0.19vw, 0.94rem);
  --step-0:  clamp(1.00rem, 0.95rem + 0.24vw, 1.13rem);
  --step-1:  clamp(1.20rem, 1.13rem + 0.35vw, 1.41rem);
  --step-2:  clamp(1.44rem, 1.33rem + 0.55vw, 1.76rem);
  --step-3:  clamp(1.73rem, 1.56rem + 0.83vw, 2.20rem);
  --step-4:  clamp(2.07rem, 1.83rem + 1.22vw, 2.75rem);
  --step-5:  clamp(2.49rem, 2.13rem + 1.78vw, 3.43rem);
  --step-6:  clamp(2.99rem, 2.48rem + 2.54vw, 4.29rem);
  --step-7:  clamp(3.58rem, 2.87rem + 3.57vw, 5.36rem);
  --step-8:  clamp(4.30rem, 3.30rem + 4.99vw, 6.71rem);

  /* ---- spacing (8pt derived, fluid) ---------------------------------- */
  --space-3xs: clamp(0.25rem, 0.24rem + 0.06vw, 0.31rem);
  --space-2xs: clamp(0.50rem, 0.48rem + 0.12vw, 0.63rem);
  --space-xs:  clamp(0.75rem, 0.71rem + 0.18vw, 0.94rem);
  --space-s:   clamp(1.00rem, 0.95rem + 0.24vw, 1.25rem);
  --space-m:   clamp(1.50rem, 1.43rem + 0.37vw, 1.88rem);
  --space-l:   clamp(2.00rem, 1.90rem + 0.49vw, 2.50rem);
  --space-xl:  clamp(3.00rem, 2.85rem + 0.73vw, 3.75rem);
  --space-2xl: clamp(4.00rem, 3.80rem + 0.98vw, 5.00rem);
  --space-3xl: clamp(6.00rem, 5.32rem + 3.41vw, 9.00rem);

  /* ---- shape and depth ----------------------------------------------- */
  --radius-s: 6px;
  --radius-m: 10px;
  --radius-l: 22px;
  --radius-pill: 999px;
  --shadow-raised: 0 14px 26px rgba(6, 40, 94, 0.15);
  --shadow-float: 0 40px 90px rgba(6, 40, 94, 0.22);

  /* ---- motion (shared by CSS, anime.js and GSAP) --------------------- */
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
  --dur-fast: 180ms;
  --dur-base: 340ms;
  --dur-slow: 620ms;

  /* ---- layout -------------------------------------------------------- */
  --shell-max: 1480px;
  --shell-gutter: clamp(1.25rem, 0.9rem + 1.7vw, 3.25rem);
  --header-h: 78px;

  /* ---- z layers ------------------------------------------------------ */
  --z-stage: 1;
  --z-scene: 2;
  --z-plates: 5;
  --z-copy: 12;
  --z-header: 40;

  color-scheme: light;
}

/* The dark organisation canvas re-points semantic tokens rather than forcing
   every component to carry a `.organisation` variant. */
.surface-field {
  --surface-paper: var(--surface-field);
  --surface-raised: var(--surface-field-raised);
  --surface-sunken: #030b16;
  --text-primary: var(--text-inverse);
  --text-muted: var(--text-inverse-muted);
  --line: var(--line-inverse);
  --line-strong: rgba(150, 190, 255, 0.34);
  --brand-blue: #7ba7ec;
  color-scheme: dark;
}
```

- [ ] **Step 2: Write the base layer**

Create `src/styles/base.css`. `ibm-plex-mono-500.woff2` ships in `public/media/fonts` and was never referenced by the old stylesheet; it is declared here so it is used rather than dead weight.

```css
@font-face {
  font-family: Onest;
  src: url("/media/fonts/onest-latin-variable.woff2") format("woff2");
  font-weight: 100 900;
  font-display: swap;
}
@font-face {
  font-family: "Plex Mono";
  src: url("/media/fonts/ibm-plex-mono-400.woff2") format("woff2");
  font-weight: 400;
  font-display: swap;
}
@font-face {
  font-family: "Plex Mono";
  src: url("/media/fonts/ibm-plex-mono-500.woff2") format("woff2");
  font-weight: 500;
  font-display: swap;
}

*,
*::before,
*::after { box-sizing: border-box; }

html { scroll-behavior: smooth; }

body {
  margin: 0;
  background: var(--surface-paper);
  color: var(--text-primary);
  font-family: Onest, system-ui, sans-serif;
  font-size: var(--step-0);
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}

h1, h2, h3, h4 { margin: 0; text-wrap: balance; font-weight: 500; letter-spacing: -0.05em; line-height: 0.98; }
p { margin: 0; text-wrap: pretty; }
a { color: inherit; text-decoration: none; }
button, input, select, textarea { font: inherit; color: inherit; }
img, svg { display: block; max-width: 100%; }
ul, ol { margin: 0; padding: 0; list-style: none; }

:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 3px;
  border-radius: 2px;
}

.mono {
  font-family: "Plex Mono", ui-monospace, monospace;
  font-size: var(--step--2);
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
}

.visually-hidden {
  position: absolute;
  width: 1px; height: 1px;
  margin: -1px; padding: 0;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 3: Write the composition primitives**

Create `src/styles/compositions.css`:

```css
.shell {
  width: min(var(--shell-max), 100% - (var(--shell-gutter) * 2));
  margin-inline: auto;
}

.stack { display: flex; flex-direction: column; }
.stack > * + * { margin-block-start: var(--stack-gap, var(--space-s)); }

.cluster {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--cluster-gap, var(--space-s));
}

.section { padding-block: var(--space-3xl); }

/* In-view reveal. Degrades to final state where unsupported — never hides
   content behind an animation that may not run. */
@supports (animation-timeline: view()) {
  @media (prefers-reduced-motion: no-preference) {
    .reveal {
      animation: reveal-in linear both;
      animation-timeline: view();
      animation-range: entry 10% cover 34%;
    }
  }
}

@keyframes reveal-in {
  from { opacity: 0; transform: translateY(22px); }
  to   { opacity: 1; transform: none; }
}
```

- [ ] **Step 4: Write the import manifest**

Create `src/styles/index.css`. Component sheets are appended here as later tasks create them.

```css
@import "./tokens.css";
@import "./base.css";
@import "./compositions.css";
```

- [ ] **Step 5: Rewrite the root layout**

Replace `src/app/layout.tsx` entirely:

```tsx
import type { Metadata, Viewport } from "next";
import "../styles/index.css";

const SITE_URL = "https://www.yojosolutions.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Yojo Solutions | A learning path you can prove",
    template: "%s | Yojo Solutions",
  },
  description:
    "Student-first technology and cybersecurity learning with guidance, practical work, feedback and career support.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Yojo Solutions",
    title: "Yojo Solutions | A learning path you can prove",
    description:
      "Guidance, curriculum, practice, feedback and placement support, connected as one learning system.",
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "Yojo Solutions | A learning path you can prove",
    description:
      "Guidance, curriculum, practice, feedback and placement support, connected as one learning system.",
  },
};

export const viewport: Viewport = {
  themeColor: "#06285e",
  colorScheme: "light",
};

const ORGANIZATION_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: "Yojo Solutions",
  url: SITE_URL,
  description:
    "Technology and cybersecurity learning, and IT consulting services for organisations.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Visakhapatnam",
    addressCountry: "IN",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="preload"
          as="font"
          type="font/woff2"
          href="/media/fonts/onest-latin-variable.woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          as="font"
          type="font/woff2"
          href="/media/fonts/ibm-plex-mono-500.woff2"
          crossOrigin="anonymous"
        />
        <script
          type="application/ld+json"
          // Static, developer-authored object — no user input reaches this string.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_SCHEMA) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 6: Delete the old stylesheet**

```bash
git rm src/app/globals.css
```

At this point the site is unstyled and several components reference classes that no longer exist. That is expected; Tasks 3–9 restore them.

- [ ] **Step 7: Verify**

Run: `npm run verify`
Expected: `Architecture check passed` and no TypeScript errors.

- [ ] **Step 8: Commit**

```bash
git add src/styles src/app/layout.tsx
git commit -m "feat: add design token layer and document metadata"
```

---

### Task 3: Site shell — header, footer, accessible navigation

**Files:**
- Create: `src/components/layout/site-header.tsx`, `src/components/layout/site-footer.tsx`, `src/components/layout/nav-disclosure.tsx`, `src/components/layout/page-frame.tsx`, `src/styles/components/site-shell.css`
- Modify: `src/content/site.ts` (nav only), `src/styles/index.css`
- Delete: `src/components/site-shell.tsx`

**Interfaces:**
- Consumes: tokens and compositions from Task 2.
- Produces: `<PageFrame>{children}</PageFrame>`, `<SiteHeader />`, `<SiteFooter />`. Every page in Tasks 4–9 wraps its content in `PageFrame`.

- [ ] **Step 1: Realign the navigation to the approved reference**

In `src/content/site.ts`, replace the `nav` export. The approved artifact shows five items; the shipped six diverge from it.

```ts
export const nav = [
  { label: "Courses", href: "/courses" },
  { label: "Learning System", href: "/#learning-system" },
  { label: "Student Journey", href: "/student-journey" },
  { label: "About", href: "/about-us" },
  { label: "Contact", href: "/contact" },
];
```

- [ ] **Step 2: Write the mobile navigation disclosure**

Create `src/components/layout/nav-disclosure.tsx`. The old build used `<details>` styled as a full-screen dialog, which gives no focus management and mislabels the control.

```tsx
"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { nav } from "../../content/site";

export function NavDisclosure() {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="nav-disclosure">
      <button
        type="button"
        className="mono nav-disclosure__toggle"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
      >
        Menu
      </button>
      <div id={panelId} className="nav-disclosure__panel" data-open={open || undefined} hidden={!open}>
        <button
          type="button"
          ref={closeRef}
          className="mono nav-disclosure__close"
          onClick={() => setOpen(false)}
        >
          Close
        </button>
        <nav aria-label="Primary">
          <ul className="stack">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} onClick={() => setOpen(false)}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Write the header**

Create `src/components/layout/site-header.tsx`:

```tsx
import Image from "next/image";
import Link from "next/link";
import { nav } from "../../content/site";
import { NavDisclosure } from "./nav-disclosure";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="shell site-header__inner">
        <Link className="site-header__brand" href="/" aria-label="Yojo Solutions home">
          <Image
            src="/media/brand/yojo-logo.png"
            width={600}
            height={136}
            alt="Yojo Solutions"
            priority
          />
        </Link>

        <nav className="site-header__nav" aria-label="Primary">
          <ul className="cluster">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <Link className="button button--primary site-header__cta" href="/contact">
          Find your programme <span aria-hidden="true">&rarr;</span>
        </Link>

        <NavDisclosure />
      </div>
    </header>
  );
}
```

- [ ] **Step 4: Write the footer and page frame**

Create `src/components/layout/site-footer.tsx`:

```tsx
import Image from "next/image";
import Link from "next/link";

const COLUMNS = [
  {
    title: "Learning",
    links: [
      { label: "Programmes", href: "/courses" },
      { label: "Student journey", href: "/student-journey" },
      { label: "Career support", href: "/placement-and-career-services" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about-us" },
      { label: "Contact", href: "/contact" },
      { label: "For organisations", href: "/services" },
    ],
  },
] as const;

export function SiteFooter() {
  return (
    <footer className="site-footer surface-field">
      <div className="shell site-footer__grid">
        <div className="stack">
          <Image
            className="site-footer__logo"
            src="/media/brand/yojo-logo.png"
            width={600}
            height={136}
            alt="Yojo Solutions"
          />
          <p>Focused technology learning and practical organisation support.</p>
        </div>
        {COLUMNS.map((column) => (
          <nav key={column.title} aria-label={column.title}>
            <p className="mono site-footer__title">{column.title}</p>
            <ul className="stack">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
    </footer>
  );
}
```

Create `src/components/layout/page-frame.tsx`:

```tsx
import type { ReactNode } from "react";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

export function PageFrame({ children }: { readonly children: ReactNode }) {
  return (
    <>
      <a className="visually-hidden skip-link" href="#main">Skip to content</a>
      <SiteHeader />
      <main id="main">{children}</main>
      <SiteFooter />
    </>
  );
}
```

- [ ] **Step 5: Write the shell stylesheet**

Create `src/styles/components/site-shell.css` with the button system and header/footer layout. Buttons live here because both the header and every page use them.

```css
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-s);
  min-height: 52px;
  padding-inline: var(--space-m);
  border: 1px solid transparent;
  border-radius: var(--radius-m);
  font-weight: 500;
  transition: transform var(--dur-base) var(--ease-out-expo),
              background var(--dur-fast) ease,
              border-color var(--dur-fast) ease;
}
.button--primary { background: var(--brand-deep); color: #fff; box-shadow: var(--shadow-raised); }
.button--primary:hover { background: var(--brand-blue); transform: translateY(-2px); }
.button--secondary { border-color: var(--line-strong); background: var(--surface-raised); color: var(--brand-deep); }
.button--secondary:hover { transform: translateY(-2px); }
.button:active { transform: translateY(1px) scale(0.99); }

.site-header {
  position: sticky;
  top: 0;
  z-index: var(--z-header);
  height: var(--header-h);
  background: color-mix(in srgb, var(--surface-paper) 82%, transparent);
  backdrop-filter: blur(18px);
}
.site-header__inner { display: flex; align-items: center; gap: var(--space-l); height: 100%; }
.site-header__brand img { width: 202px; height: auto; }
.site-header__nav { margin-inline: auto; }
.site-header__nav a { transition: color var(--dur-fast) ease; }
.site-header__nav a:hover { color: var(--brand-blue); }

.nav-disclosure { display: none; }
.nav-disclosure__panel[data-open] {
  position: fixed;
  inset: 0;
  z-index: var(--z-header);
  display: flex;
  flex-direction: column;
  gap: var(--space-l);
  padding: var(--space-xl) var(--shell-gutter);
  background: var(--surface-field);
  color: var(--text-inverse);
  font-size: var(--step-5);
}
.nav-disclosure__close { align-self: flex-end; background: none; border: 0; cursor: pointer; }

.site-footer { padding-block: var(--space-2xl); background: var(--surface-field); color: var(--text-inverse); }
.site-footer__grid { display: grid; grid-template-columns: 2fr 1fr 1fr; gap: var(--space-l); }
.site-footer__logo { width: 210px; height: auto; filter: brightness(0) invert(1); }
.site-footer__title { margin-block-end: var(--space-s); }
.site-footer a:hover { color: #fff; }

.skip-link:focus-visible {
  position: fixed;
  inset-block-start: var(--space-s);
  inset-inline-start: var(--space-s);
  z-index: 100;
  width: auto;
  height: auto;
  clip-path: none;
  padding: var(--space-xs) var(--space-s);
  background: var(--surface-raised);
}

@media (max-width: 900px) {
  .site-header__nav, .site-header__cta { display: none; }
  .nav-disclosure { display: block; margin-inline-start: auto; }
  .site-footer__grid { grid-template-columns: 1fr; }
}
```

Append to `src/styles/index.css`:

```css
@import "./components/site-shell.css";
```

- [ ] **Step 6: Delete the old shell and verify**

```bash
git rm src/components/site-shell.tsx
```

Update the imports in `src/app/page.tsx`, `src/app/[slug]/page.tsx`, `src/app/courses/page.tsx`, and `src/app/courses/[programme]/page.tsx` from `../components/site-shell` to `../components/layout/page-frame` (adjusting relative depth per file).

Run: `npm run verify`
Expected: `Architecture check passed` and no TypeScript errors.

- [ ] **Step 7: Commit**

```bash
git add src/components/layout src/styles src/content/site.ts src/app
git commit -m "feat: rebuild site shell with accessible navigation"
```

---

### Task 4: The Direction A hero, static, with its contract test

**Files:**
- Create: `src/components/icons/layer-icons.tsx`, `src/components/hero/atlas-plate.tsx`, `src/components/hero/atlas-hero.tsx`, `src/styles/components/hero.css`, `tests/hero-contract.test.tsx`
- Modify: `src/app/page.tsx`, `src/styles/index.css`

**Interfaces:**
- Consumes: `ATLAS_LAYERS`, `AtlasLayer`, `AtlasLayerId` (Task 1); `PageFrame` (Task 3); tokens (Task 2).
- Produces: `<AtlasHero layers={ATLAS_LAYERS} />`. Task 5 wraps its plates with the anime.js assembly.

- [ ] **Step 1: Write the failing contract test**

Create `tests/hero-contract.test.tsx`. `docs/yojo-porting.md` requires "an acceptance test for the approved visual composition"; this is it.

```tsx
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { AtlasHero } from "../src/components/hero/atlas-hero";
import { ATLAS_LAYERS } from "../src/content/atlas-layers";

const markup = () => renderToStaticMarkup(<AtlasHero layers={ATLAS_LAYERS} />);

describe("homepage hero visual contract", () => {
  it("renders all five plate labels as live text in the first viewport", () => {
    const html = markup();
    for (const layer of ATLAS_LAYERS) {
      expect(html).toContain(layer.label);
    }
  });

  it("uses the empty-case stage, never the pre-composed hero render", () => {
    const html = markup();
    expect(html).toContain("atlas-case-empty");
    // `atlas-hero.*` bakes blank plates AND the mascot into the raster.
    expect(html).not.toContain("atlas-hero");
  });

  it("keeps the guide mascot out of the hero", () => {
    expect(markup()).not.toContain("/media/atlas/guide");
  });

  it("offers exactly one primary call to action", () => {
    const matches = markup().match(/data-hero-cta/g) ?? [];
    expect(matches).toHaveLength(1);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test`
Expected: FAIL — `Failed to resolve import "../src/components/hero/atlas-hero"`.

- [ ] **Step 3: Write the layer icons**

Create `src/components/icons/layer-icons.tsx`. These reproduce the icons in the approved artifact.

```tsx
import type { ReactNode } from "react";
import type { AtlasLayerId } from "../../content/atlas-layers";

const PATHS: Record<AtlasLayerId, ReactNode> = {
  guidance: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M15.5 8.5 10.8 10.8 8.5 15.5l4.7-2.3z" />
    </>
  ),
  curriculum: (
    <path d="M3 5.5h6.5A2.5 2.5 0 0 1 12 8v11a2 2 0 0 0-2-2H3zM21 5.5h-6.5A2.5 2.5 0 0 0 12 8v11a2 2 0 0 1 2-2h7z" />
  ),
  practice: <path d="m8.5 8-4 4 4 4M15.5 8l4 4-4 4" />,
  feedback: (
    <path d="M20 5H4a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h3v3.2L11 16h9a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1z" />
  ),
  placement: (
    <>
      <rect x="3" y="7.5" width="18" height="12" rx="1.6" />
      <path d="M9 7.5V6a1.6 1.6 0 0 1 1.6-1.6h2.8A1.6 1.6 0 0 1 15 6v1.5" />
    </>
  ),
};

export function LayerIcon({ id }: { readonly id: AtlasLayerId }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" className="layer-icon">
      {PATHS[id]}
    </svg>
  );
}
```

- [ ] **Step 4: Write the plate**

Create `src/components/hero/atlas-plate.tsx`:

```tsx
import type { CSSProperties } from "react";
import type { AtlasLayer } from "../../content/atlas-layers";
import { LayerIcon } from "../icons/layer-icons";

export function AtlasPlate({ layer, index }: { readonly layer: AtlasLayer; readonly index: number }) {
  return (
    <li className="atlas-plate" data-plate={index} style={{ "--plate-index": index } as CSSProperties}>
      <LayerIcon id={layer.id} />
      <span className="atlas-plate__label">{layer.label}</span>
    </li>
  );
}
```

- [ ] **Step 5: Write the hero**

Create `src/components/hero/atlas-hero.tsx`. Data arrives as a prop so the component stays free of `server-only` and remains testable.

```tsx
import Image from "next/image";
import Link from "next/link";
import type { AtlasLayer } from "../../content/atlas-layers";
import { AtlasPlate } from "./atlas-plate";

export function AtlasHero({ layers }: { readonly layers: readonly AtlasLayer[] }) {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <p className="hero__word" aria-hidden="true">Yojo</p>

      <div className="hero__stage">
        <Image
          className="hero__scene"
          src="/media/atlas/atlas-case-empty-1600.webp"
          alt=""
          width={1600}
          height={900}
          sizes="100vw"
          priority
          fetchPriority="high"
        />
      </div>

      <ol className="atlas-plates" aria-label="The five Learning Atlas layers">
        {layers.map((layer, index) => (
          <AtlasPlate key={layer.id} layer={layer} index={index} />
        ))}
      </ol>

      <div className="shell hero__layout">
        <div className="hero__copy">
          <p className="mono hero__kicker">Technology learning, assembled around you</p>
          <h1 id="hero-title">
            Build a path
            <br />
            you can prove.
          </h1>
          <span className="hero__rule" aria-hidden="true" />
          <Link className="button button--primary" href="/contact" data-hero-cta>
            Find your programme <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>

      <p className="mono hero__hud hero__hud--left">Visakhapatnam &middot; Live online</p>
      <p className="mono hero__hud hero__hud--right">Scroll &darr;</p>
    </section>
  );
}
```

- [ ] **Step 6: Write the hero stylesheet**

Create `src/styles/components/hero.css`. The plate geometry uses the proportions in spec §4, expressed as tokens. The stage colours are matched to the render so the image edge is invisible — this is why no cut-out asset is needed.

```css
.hero {
  --case-left: 29%;
  --case-width: 53%;
  --case-rim: 62%;
  --plate-h: 6.1%;
  --plate-step: 4.8%;
  --plate-shift: 1.1%;

  position: relative;
  min-height: calc(100dvh - var(--header-h));
  overflow: hidden;
  isolation: isolate;
  background:
    radial-gradient(1000px 700px at 56% 42%, #fff 0%, rgba(255, 255, 255, 0.8) 32%, rgba(255, 255, 255, 0) 64%),
    linear-gradient(155deg, var(--stage-wall) 0%, #f7f9fc 50%, var(--stage-floor) 100%);
}

.hero__word {
  position: absolute;
  z-index: var(--z-stage);
  inset-block-start: 12%;
  inset-inline-start: 0.5%;
  margin: 0;
  font-size: clamp(12rem, 29vw, 26rem);
  font-weight: 700;
  letter-spacing: -0.09em;
  line-height: 0.78;
  color: #33578f;
  opacity: 0.5;              /* supports the product; never overpowers it */
  user-select: none;
}

.hero__stage { position: absolute; z-index: var(--z-scene); inset: 0; }
.hero__scene {
  width: 124%;
  height: 100%;
  object-fit: cover;
  object-position: 46% 78%;
  margin-inline-start: -8%;
}

.atlas-plates {
  position: absolute;
  z-index: var(--z-plates);
  inset: 0;
  pointer-events: none;
}

.atlas-plate {
  position: absolute;
  inset-inline-start: calc(var(--case-left) + (var(--plate-shift) * var(--plate-index)) + 3%);
  inset-block-start: calc(var(--case-rim) - 20% + (var(--plate-step) * var(--plate-index)));
  z-index: calc(5 + var(--plate-index));
  width: calc(var(--case-width) * 0.74);
  height: var(--plate-h);
  min-height: 44px;
  display: flex;
  align-items: center;
  gap: var(--space-s);
  padding-inline: var(--space-m);
  border: 1px solid rgba(255, 255, 255, 0.9);
  border-radius: var(--radius-s);
  transform: skewY(5deg);
  background: linear-gradient(102deg, rgba(255,255,255,0.98) 0%, rgba(240,246,253,0.93) 46%, rgba(214,227,244,0.88) 100%);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 1),
    inset 0 -1px 0 rgba(148, 174, 208, 0.6),
    var(--shadow-raised);
}

.atlas-plate__label {
  font-size: var(--step-1);
  font-style: italic;
  letter-spacing: -0.012em;
  color: #12407e;
  white-space: nowrap;
}

.layer-icon { width: 21px; height: 21px; flex: none; stroke: #174b93; stroke-width: 1.35; fill: none; }

.hero__layout {
  position: relative;
  z-index: var(--z-copy);
  display: flex;
  align-items: flex-end;
  min-height: calc(100dvh - var(--header-h));
  padding-block-end: var(--space-2xl);
}
.hero__copy { max-width: 27rem; }
.hero__kicker { color: var(--brand-blue); margin-block-end: var(--space-m); }
.hero h1 { font-size: var(--step-7); }
.hero__rule { display: block; width: 66px; height: 3px; margin-block: var(--space-m); background: var(--accent); border-radius: 2px; }

.hero__hud { position: absolute; z-index: var(--z-copy); inset-block-end: var(--space-m); color: var(--text-muted); }
.hero__hud--left { inset-inline-start: var(--shell-gutter); }
.hero__hud--right { inset-inline-end: var(--shell-gutter); }

@media (max-width: 900px) {
  .hero { --case-left: 20%; --case-width: 74%; }
  .hero__scene { object-position: 50% 82%; }
  .atlas-plate__label { font-size: var(--step-0); }
  .hero h1 { font-size: var(--step-6); }
}
```

Append to `src/styles/index.css`:

```css
@import "./components/hero.css";
```

- [ ] **Step 7: Run the contract test to verify it passes**

Run: `npm test`
Expected: PASS — 7 tests total (3 from Task 1, 4 here).

- [ ] **Step 8: Wire the hero into the homepage**

Replace the hero section of `src/app/page.tsx`:

```tsx
import { AtlasHero } from "../components/hero/atlas-hero";
import { PageFrame } from "../components/layout/page-frame";
import { ATLAS_LAYERS } from "../content/atlas-layers";

export default function HomePage() {
  return (
    <PageFrame>
      <AtlasHero layers={ATLAS_LAYERS} />
    </PageFrame>
  );
}
```

The remaining homepage sections are restored in Tasks 6 and 7.

- [ ] **Step 9: Verify**

Run: `npm run verify && npm test`
Expected: architecture check passes, no TypeScript errors, 7 tests pass.

- [ ] **Step 10: Commit**

```bash
git add src/components/hero src/components/icons src/styles src/app/page.tsx tests/hero-contract.test.tsx
git commit -m "feat: implement Direction A hero with visual-contract test"
```

---

### Task 5: Tier 1 motion — anime.js hero assembly

**Files:**
- Create: `src/lib/motion/reduced-motion.ts`, `src/components/hero/hero-assembly.tsx`
- Modify: `src/components/hero/atlas-hero.tsx`, `src/styles/components/hero.css`, `package.json`

**Interfaces:**
- Consumes: `.atlas-plate` elements rendered by Task 4.
- Produces: `prefersReducedMotion(): boolean`; `<HeroAssembly />`, a client component that animates its sibling plates on mount.

- [ ] **Step 1: Install anime.js**

```bash
npm install animejs@^4.5.0
```

Expected: completes with no `ERESOLVE` error. `three` and `@types/three` are **optional** peers and will not be installed.

- [ ] **Step 2: Write the reduced-motion helper**

Create `src/lib/motion/reduced-motion.ts`:

```ts
/**
 * Reads the user's motion preference. Returns `true` during SSR so that any
 * caller defaults to the still, final state rather than an animated one.
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return true;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
```

- [ ] **Step 3: Write the assembly component**

Create `src/components/hero/hero-assembly.tsx`. The plates render in their final position; this animates *from* an offset, so if the script never runs the hero is still correct.

```tsx
"use client";

import { useEffect } from "react";
import { createTimeline, stagger } from "animejs";
import { prefersReducedMotion } from "../../lib/motion/reduced-motion";

export function HeroAssembly() {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const plates = document.querySelectorAll<HTMLElement>(".atlas-plate");
    if (plates.length === 0) return;

    const timeline = createTimeline({ defaults: { ease: "outExpo" } });

    timeline.add(plates, {
      opacity: [0, 1],
      translateY: [56, 0],
      translateX: [-18, 0],
      duration: 900,
      delay: stagger(110, { start: 240 }),
    });

    return () => {
      timeline.pause();
      timeline.revert();
    };
  }, []);

  return null;
}
```

- [ ] **Step 4: Mount it in the hero**

In `src/components/hero/atlas-hero.tsx`, add the import and render it after the plate list:

```tsx
import { HeroAssembly } from "./hero-assembly";
```

```tsx
      </ol>
      <HeroAssembly />
```

- [ ] **Step 5: Add the pre-animation guard**

Plates must start hidden **only** when scripting is available and motion is allowed — otherwise a blocked or failed script would permanently hide the five contract-critical labels.

First, in `src/app/layout.tsx`, add this inline script inside `<head>`, before the JSON-LD block. It only runs when scripting is on:

```tsx
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.add('js-motion')`,
          }}
        />
```

Then append to `src/styles/components/hero.css`:

```css
@media (prefers-reduced-motion: no-preference) {
  .js-motion .atlas-plate { opacity: 0; }
}
```

- [ ] **Step 6: Confirm the contract test still passes**

The contract test renders to static markup with no client script, so plates must still be present and visible there.

Run: `npm test`
Expected: PASS — 7 tests.

- [ ] **Step 7: Verify**

Run: `npm run verify`
Expected: `Architecture check passed` and no TypeScript errors.

- [ ] **Step 8: Commit**

```bash
git add package.json package-lock.json src/lib/motion src/components/hero src/styles src/app/layout.tsx
git commit -m "feat: add anime.js hero plate assembly"
```

---

### Task 6: Tier 2 motion — GSAP Atlas pinned sequence

**Files:**
- Create: `src/components/atlas/atlas-sequence.tsx`, `src/components/atlas/atlas-scrub.client.tsx`, `src/styles/components/atlas.css`
- Modify: `src/app/page.tsx`, `src/styles/index.css`, `package.json`
- Delete: `src/components/atlas-experience.tsx`

**Interfaces:**
- Consumes: `ATLAS_LAYERS` (Task 1), `PageFrame` (Task 3).
- Produces: `<AtlasSequence layers={ATLAS_LAYERS} />`, anchored at `id="learning-system"` for the header link.

- [ ] **Step 1: Install GSAP**

```bash
npm install gsap@^3.15.0 @gsap/react@^2.1.2
```

Expected: completes with no `ERESOLVE` error. `@gsap/react` declares `react: ">=17"`, satisfied by 19.1.0.

- [ ] **Step 2: Write the sequence shell**

Create `src/components/atlas/atlas-sequence.tsx`. The chapters are server-rendered and fully readable without any script.

```tsx
import dynamic from "next/dynamic";
import type { AtlasLayer } from "../../content/atlas-layers";

const AtlasScrub = dynamic(() => import("./atlas-scrub.client").then((m) => m.AtlasScrub), {
  ssr: false,
});

export function AtlasSequence({ layers }: { readonly layers: readonly AtlasLayer[] }) {
  return (
    <section className="atlas section" id="learning-system" aria-labelledby="atlas-title">
      <div className="shell atlas__intro">
        <p className="mono">Open the learning system</p>
        <h2 id="atlas-title">
          Five layers.
          <br />
          One learning route.
        </h2>
        <p>Each layer answers a different learner question. The value is in how they work together.</p>
      </div>

      <div className="shell atlas__grid">
        <ol className="atlas__chapters">
          {layers.map((layer, index) => (
            <li className="atlas__chapter" data-atlas-chapter={index} key={layer.id}>
              <p className="mono atlas__position">
                {String(index + 1).padStart(2, "0")} / 05
              </p>
              <h3>{layer.headline}</h3>
              <p>{layer.body}</p>
              <p className="atlas__name">{layer.label}</p>
            </li>
          ))}
        </ol>

        <div className="atlas__pin">
          <div className="atlas__chamber">
            <span className="atlas__word" aria-hidden="true">Atlas</span>
            <p className="mono atlas__counter" data-atlas-counter aria-live="polite">
              01 / 05
            </p>
          </div>
        </div>
      </div>

      <AtlasScrub />
    </section>
  );
}
```

- [ ] **Step 3: Write the GSAP scrub client**

Create `src/components/atlas/atlas-scrub.client.tsx`. `useGSAP` scopes and reverts automatically, which React 19 Strict Mode's double-invocation requires.

```tsx
"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { prefersReducedMotion } from "../../lib/motion/reduced-motion";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function AtlasScrub() {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      const chapters = gsap.utils.toArray<HTMLElement>("[data-atlas-chapter]");
      const counter = document.querySelector<HTMLElement>("[data-atlas-counter]");
      const pin = document.querySelector<HTMLElement>(".atlas__pin");
      if (chapters.length === 0 || !pin) return;

      ScrollTrigger.create({
        trigger: ".atlas__grid",
        start: "top top+=120",
        end: "bottom bottom",
        pin,
        pinSpacing: false,
      });

      chapters.forEach((chapter, index) => {
        ScrollTrigger.create({
          trigger: chapter,
          start: "top center",
          end: "bottom center",
          onToggle: ({ isActive }) => {
            chapter.dataset.active = isActive ? "true" : "false";
            if (isActive && counter) {
              counter.textContent = `${String(index + 1).padStart(2, "0")} / 05`;
            }
          },
        });
      });
    },
    { scope },
  );

  return <div ref={scope} aria-hidden="true" />;
}
```

- [ ] **Step 4: Write the Atlas stylesheet**

Create `src/styles/components/atlas.css`:

```css
.atlas { background: linear-gradient(160deg, #f8fafc, var(--surface-sunken)); }
.atlas__intro { display: grid; grid-template-columns: 1.4fr 0.8fr; gap: var(--space-2xl); align-items: end; margin-block-end: var(--space-2xl); }
.atlas__intro h2 { grid-column: 1; font-size: var(--step-7); }
.atlas__intro > p:last-child { max-width: 24rem; color: var(--text-muted); }

.atlas__grid { display: grid; grid-template-columns: 0.9fr 1.1fr; gap: var(--space-3xl); align-items: start; }

.atlas__chapter {
  min-height: 62dvh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-block: var(--space-xl);
  border-block-start: 1px solid var(--line);
  opacity: 0.34;
  transition: opacity var(--dur-slow) ease;
}
.atlas__chapter[data-active="true"] { opacity: 1; }
.atlas__chapter h3 { max-width: 33rem; font-size: var(--step-5); }
.atlas__chapter > p { max-width: 27rem; margin-block-start: var(--space-s); color: var(--text-muted); }
.atlas__position { color: var(--brand-blue); margin-block-end: var(--space-s); }
.atlas__name { color: var(--brand-blue); font-size: var(--step--1); margin-block-start: var(--space-s); }

.atlas__pin { display: grid; place-items: center; height: calc(100dvh - 152px); }
.atlas__chamber {
  position: relative;
  width: min(100%, 46rem);
  aspect-ratio: 1.08;
  overflow: hidden;
  border-radius: var(--radius-l);
  background: radial-gradient(circle at 50% 48%, #1c5db8 0%, var(--brand-deep) 48%, #031936 100%);
  box-shadow: var(--shadow-float);
}
.atlas__word {
  position: absolute; inset-block-start: 5%; inset-inline-start: 4%;
  font-size: clamp(5rem, 10vw, 11rem); font-weight: 700; line-height: 0.75;
  letter-spacing: -0.12em; color: rgba(210, 229, 255, 0.16);
}
.atlas__counter { position: absolute; inset-block-end: 7%; inset-inline-start: 6%; color: #b6d4ff; }

/* No pinning below the two-column breakpoint — a sticky pane with nothing
   beside it is worse than a plain stack. */
@media (max-width: 900px) {
  .atlas__intro, .atlas__grid { grid-template-columns: 1fr; gap: var(--space-l); }
  .atlas__chapter { min-height: auto; opacity: 1; }
  .atlas__pin { height: auto; aspect-ratio: 1.08; }
}
```

Append to `src/styles/index.css`:

```css
@import "./components/atlas.css";
```

- [ ] **Step 5: Mount on the homepage and delete the old component**

In `src/app/page.tsx`, add below `<AtlasHero />`:

```tsx
      <AtlasSequence layers={ATLAS_LAYERS} />
```

with `import { AtlasSequence } from "../components/atlas/atlas-sequence";`

```bash
git rm src/components/atlas-experience.tsx
```

- [ ] **Step 6: Verify**

Run: `npm run verify && npm test`
Expected: architecture check passes, no TypeScript errors, 7 tests pass.

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json src/components/atlas src/styles src/app/page.tsx
git commit -m "feat: add GSAP-pinned Atlas learning-system sequence"
```

---

### Task 7: Catalogue and programme detail on `learning-catalog`

**Files:**
- Create: `src/content/programme-media.ts`, `src/components/catalogue/course-ledger.tsx`, `src/styles/components/catalogue.css`
- Modify: `src/app/courses/page.tsx`, `src/app/courses/[programme]/page.tsx`, `src/content/site.ts`, `src/styles/index.css`
- Delete: `src/components/course-ledger.tsx`

**Interfaces:**
- Consumes: `getPublicServices()` from `src/app/_services.ts`; `PublishedProgramme` from `src/modules/learning-catalog`.
- Produces: `programmeImage(slug: string): string`; `CATEGORY_LABELS: Record<PublishedProgramme["category"], string>`; `<CourseLedger programmes={...} />`.

This task resolves the two disagreeing programme sources. `learning-catalog` becomes canonical; `src/content/site.ts` loses its `programmes` export.

- [ ] **Step 1: Write the presentation-side media map**

Create `src/content/programme-media.ts`. Art direction is a presentation concern, so it stays out of the domain type.

```ts
import type { PublishedProgramme } from "../modules/learning-catalog";

const IMAGES: Record<string, string> = {
  cybersecurity: "/media/generated/courses/cybersecurity.webp",
  "ai-machine-learning": "/media/generated/courses/ai-ml.webp",
  networking: "/media/generated/courses/networking.webp",
  cloud: "/media/generated/courses/cloud.webp",
  "software-development": "/media/generated/courses/software.webp",
  sap: "/media/generated/courses/sap.webp",
  databases: "/media/generated/courses/database.webp",
  storage: "/media/generated/courses/storage.webp",
};

const FALLBACK = "/media/generated/courses/software.webp";

export function programmeImage(slug: string): string {
  return IMAGES[slug] ?? FALLBACK;
}

export const CATEGORY_LABELS: Record<PublishedProgramme["category"], string> = {
  security: "Security",
  infrastructure: "Infrastructure",
  "software-data": "Software and data",
  enterprise: "Enterprise",
};
```

- [ ] **Step 2: Write the ledger**

Create `src/components/catalogue/course-ledger.tsx`:

```tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { PublishedProgramme } from "../../modules/learning-catalog";
import { CATEGORY_LABELS, programmeImage } from "../../content/programme-media";

export function CourseLedger({ programmes }: { readonly programmes: readonly PublishedProgramme[] }) {
  const [term, setTerm] = useState("");
  const [category, setCategory] = useState("All");

  const categories = useMemo(
    () => ["All", ...new Set(programmes.map((p) => CATEGORY_LABELS[p.category]))],
    [programmes],
  );

  const matches = useMemo(() => {
    const needle = term.trim().toLowerCase();
    return programmes.filter((p) => {
      const inCategory = category === "All" || CATEGORY_LABELS[p.category] === category;
      const inSearch = `${p.title} ${p.summary}`.toLowerCase().includes(needle);
      return inCategory && inSearch;
    });
  }, [category, programmes, term]);

  return (
    <>
      <div className="catalogue__controls">
        <label htmlFor="programme-search">
          Search programmes
          <input
            id="programme-search"
            value={term}
            onChange={(event) => setTerm(event.target.value)}
            placeholder="Try cybersecurity"
          />
        </label>
        <label htmlFor="programme-category">
          Filter by focus
          <select
            id="programme-category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            {categories.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <p className="mono" aria-live="polite">
          {matches.length} programme{matches.length === 1 ? "" : "s"} shown
        </p>
      </div>

      <ul className="programme-ledger">
        {matches.map((programme, index) => (
          <li key={programme.slug}>
            <Link href={`/courses/${programme.slug}`} className="programme-row reveal">
              <span className="mono">{String(index + 1).padStart(2, "0")}</span>
              <Image src={programmeImage(programme.slug)} alt="" width={280} height={180} />
              <strong>{programme.title}</strong>
              <p>{programme.summary}</p>
              <em className="mono">{CATEGORY_LABELS[programme.category]}</em>
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
```

- [ ] **Step 3: Rewrite the catalogue page against the module**

Replace `src/app/courses/page.tsx`:

```tsx
import { CourseLedger } from "../../components/catalogue/course-ledger";
import { PageFrame } from "../../components/layout/page-frame";
import { getPublicServices } from "../_services";

export const metadata = { title: "Programmes" };

export default async function CoursesPage() {
  const { learningCatalogue } = getPublicServices();
  const result = await learningCatalogue.list();
  if (!result.ok) throw new Error(result.error.message);

  return (
    <PageFrame>
      <section className="catalogue shell section" aria-labelledby="catalogue-title">
        <div className="catalogue__heading">
          <p className="mono">Published programmes</p>
          <h1 id="catalogue-title">
            Choose by the work
            <br />
            you want to do.
          </h1>
          <p>Current level, curriculum, schedule and fee are confirmed with a learning advisor.</p>
        </div>
        <CourseLedger programmes={result.value} />
      </section>
    </PageFrame>
  );
}
```

- [ ] **Step 4: Rewrite the programme detail page**

Replace `src/app/courses/[programme]/page.tsx`:

```tsx
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageFrame } from "../../../components/layout/page-frame";
import { CATEGORY_LABELS, programmeImage } from "../../../content/programme-media";
import { getPublicServices } from "../../_services";

export async function generateStaticParams() {
  const { learningCatalogue } = getPublicServices();
  const result = await learningCatalogue.list();
  return result.ok ? result.value.map((p) => ({ programme: p.slug })) : [];
}

export default async function ProgrammePage({
  params,
}: {
  params: Promise<{ programme: string }>;
}) {
  const { programme: slug } = await params;
  const { learningCatalogue } = getPublicServices();
  const result = await learningCatalogue.findBySlug(slug);
  if (!result.ok) notFound();
  const programme = result.value;

  return (
    <PageFrame>
      <section className="detail-hero section">
        <div className="shell detail-hero__grid">
          <div className="stack">
            <p className="mono">{CATEGORY_LABELS[programme.category]} programme</p>
            <h1>{programme.title}</h1>
            <p>
              {programme.summary} Current level, schedule, curriculum and fee are confirmed with a
              learning advisor.
            </p>
            <Link className="button button--primary" href="/contact">
              Ask about this programme <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
          <Image src={programmeImage(programme.slug)} alt="" width={900} height={700} />
        </div>
      </section>
    </PageFrame>
  );
}
```

- [ ] **Step 5: Remove the duplicate source**

In `src/content/site.ts`, delete the `Programme` type and the `programmes` export. Any remaining importer must be updated to use `learningCatalogue`.

```bash
git rm src/components/course-ledger.tsx
```

- [ ] **Step 6: Write the catalogue stylesheet**

Create `src/styles/components/catalogue.css`:

```css
.catalogue__heading { max-width: 56rem; }
.catalogue h1 { font-size: var(--step-8); }
.catalogue__heading > p:last-child { max-width: 27rem; margin-block-start: var(--space-m); color: var(--text-muted); }

.catalogue__controls {
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: var(--space-s);
  align-items: end;
  margin-block: var(--space-2xl) var(--space-m);
}
.catalogue__controls label { display: grid; gap: var(--space-2xs); color: var(--text-muted); font-size: var(--step--1); }
.catalogue__controls input,
.catalogue__controls select {
  width: 100%;
  height: 52px;
  padding-inline: var(--space-s);
  border: 1px solid var(--line-strong);
  border-radius: var(--radius-m);
  background: var(--surface-raised);
}
.catalogue__controls p { color: var(--brand-blue); }

.programme-ledger { border-block-start: 1px solid var(--line); }
.programme-row {
  display: grid;
  grid-template-columns: 3rem 8rem minmax(11rem, 1fr) 1.2fr 8rem 1.75rem;
  gap: var(--space-m);
  align-items: center;
  padding-block: var(--space-s);
  border-block-end: 1px solid var(--line);
  transition: padding var(--dur-base) var(--ease-out-expo), background var(--dur-base) ease;
}
.programme-row:hover { padding-inline: var(--space-s); background: var(--surface-raised); }
.programme-row img { width: 8rem; height: 4.9rem; object-fit: cover; border-radius: var(--radius-m); }
.programme-row strong { font-size: var(--step-2); font-weight: 500; letter-spacing: -0.04em; }
.programme-row p { color: var(--text-muted); font-size: var(--step--1); }
.programme-row em { color: var(--text-muted); font-style: normal; }

.detail-hero__grid { display: grid; grid-template-columns: 0.9fr 1.1fr; gap: var(--space-2xl); align-items: center; }
.detail-hero__grid h1 { font-size: var(--step-7); }
.detail-hero__grid img { width: 100%; height: auto; border-radius: var(--radius-l); box-shadow: var(--shadow-float); }

@media (max-width: 900px) {
  .catalogue__controls { grid-template-columns: 1fr 1fr; }
  .catalogue__controls p { grid-column: 1 / -1; }
  .programme-row { grid-template-columns: 2rem 6rem 1fr 1.5rem; }
  .programme-row p, .programme-row em { display: none; }
  .detail-hero__grid { grid-template-columns: 1fr; }
}
```

Append to `src/styles/index.css`:

```css
@import "./components/catalogue.css";
```

- [ ] **Step 7: Verify**

Run: `npm run verify && npm test`
Expected: architecture check passes (no `src/app` file reaches into module internals — both pages go through `_services`), no TypeScript errors, 7 tests pass.

- [ ] **Step 8: Commit**

```bash
git add src/components/catalogue src/content src/app/courses src/styles
git commit -m "feat: wire catalogue and programme detail to learning-catalog"
```

---

### Task 8: Student Journey with the GSAP progress meter

**Files:**
- Create: `src/components/journey/student-trail.tsx`, `src/components/journey/journey-meter.client.tsx`, `src/styles/components/journey.css`, `src/app/student-journey/page.tsx`
- Modify: `src/app/[slug]/page.tsx` (drop its `student-journey` special case), `src/styles/index.css`
- Delete: `src/components/student-trail.tsx`

**Interfaces:**
- Consumes: `PageFrame` (Task 3), `prefersReducedMotion` (Task 5), GSAP (Task 6).
- Produces: `<StudentTrail />` at the real route `/student-journey`.

The old build smuggled `student-journey` through the `[slug]` catch-all. It gets a real route.

- [ ] **Step 1: Write the trail**

Create `src/components/journey/student-trail.tsx`:

```tsx
import dynamic from "next/dynamic";

const JourneyMeter = dynamic(() => import("./journey-meter.client").then((m) => m.JourneyMeter), {
  ssr: false,
});

const PHASES = [
  { title: "Find the direction", body: "A guided conversation helps identify the role, domain and learning format that fit your current position." },
  { title: "Build the route", body: "A visible curriculum turns a broad ambition into a sequence of foundations, tools and applied work." },
  { title: "Practice the work", body: "Labs and project activity make the learning concrete and expose the next skills to strengthen." },
  { title: "Review the evidence", body: "Feedback helps sharpen your work, explain your decisions and prepare a stronger next attempt." },
  { title: "Prepare the transition", body: "Resume preparation, mock interviews and relevant opportunity support help you communicate what you can do. This is support, not an employment guarantee." },
] as const;

export function StudentTrail() {
  return (
    <section className="journey section" aria-labelledby="journey-title">
      <div className="shell journey__head">
        <p className="mono">Student transformation</p>
        <h1 id="journey-title">
          A path becomes real
          <br />
          when the work changes.
        </h1>
        <p>Yojo&rsquo;s learner route is designed to make progress visible, useful and easier to explain.</p>
      </div>

      <div className="shell journey__layout">
        <aside className="journey__meter">
          <p className="mono">
            <b data-journey-counter>01</b> / 05
          </p>
        </aside>
        <ol className="journey__steps">
          {PHASES.map((phase, index) => (
            <li key={phase.title} data-journey-step={index}>
              <span className="mono">{String(index + 1).padStart(2, "0")}</span>
              <h2>{phase.title}</h2>
              <p>{phase.body}</p>
            </li>
          ))}
        </ol>
      </div>

      <JourneyMeter />
    </section>
  );
}
```

- [ ] **Step 2: Write the meter client**

Create `src/components/journey/journey-meter.client.tsx`:

```tsx
"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { prefersReducedMotion } from "../../lib/motion/reduced-motion";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function JourneyMeter() {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      const steps = gsap.utils.toArray<HTMLElement>("[data-journey-step]");
      const counter = document.querySelector<HTMLElement>("[data-journey-counter]");
      if (steps.length === 0) return;

      steps.forEach((step, index) => {
        ScrollTrigger.create({
          trigger: step,
          start: "top center",
          end: "bottom center",
          onToggle: ({ isActive }) => {
            step.dataset.active = isActive ? "true" : "false";
            if (isActive && counter) counter.textContent = String(index + 1).padStart(2, "0");
          },
        });
      });
    },
    { scope },
  );

  return <div ref={scope} aria-hidden="true" />;
}
```

- [ ] **Step 3: Create the real route**

Create `src/app/student-journey/page.tsx`:

```tsx
import { PageFrame } from "../../components/layout/page-frame";
import { StudentTrail } from "../../components/journey/student-trail";

export const metadata = { title: "Student journey" };

export default function StudentJourneyPage() {
  return (
    <PageFrame>
      <StudentTrail />
    </PageFrame>
  );
}
```

In `src/app/[slug]/page.tsx`, remove `"student-journey"` from `generateStaticParams` and delete the `if (slug === "student-journey")` branch, so the dedicated route is the only one.

```bash
git rm src/components/student-trail.tsx
```

- [ ] **Step 4: Write the journey stylesheet**

Create `src/styles/components/journey.css`:

```css
.journey__head { max-width: 58rem; }
.journey__head h1 { font-size: var(--step-8); }
.journey__head > p:last-child { max-width: 27rem; margin-block-start: var(--space-m); color: var(--text-muted); }

.journey__layout { display: grid; grid-template-columns: 15rem 1fr; gap: var(--space-3xl); margin-block-start: var(--space-2xl); }
.journey__meter {
  position: sticky;
  inset-block-start: calc(var(--header-h) + var(--space-l));
  align-self: start;
  display: grid;
  place-items: center;
  height: 22rem;
  border-radius: var(--radius-l);
  background: radial-gradient(circle at 50% 48%, #1c5db8, var(--brand-deep) 65%);
  color: #a8ceff;
}
.journey__meter b { color: #fff; }

.journey__steps { border-block-start: 1px solid var(--line); }
.journey__steps li {
  position: relative;
  min-height: 48dvh;
  padding: var(--space-xl) 0 var(--space-xl) 5.25rem;
  border-block-end: 1px solid var(--line);
  opacity: 0.42;
  transition: opacity var(--dur-base) ease;
}
.journey__steps li[data-active="true"] { opacity: 1; }
.journey__steps li > span { position: absolute; inset-inline-start: 0; color: var(--brand-blue); }
.journey__steps h2 { max-width: 40rem; font-size: var(--step-6); }
.journey__steps p { max-width: 31rem; margin-block-start: var(--space-m); color: var(--text-muted); }

@media (max-width: 900px) {
  .journey__layout { grid-template-columns: 1fr; gap: var(--space-l); }
  .journey__meter { position: relative; inset-block-start: auto; height: 12rem; }
  .journey__steps li { min-height: auto; padding-inline-start: 3rem; opacity: 1; }
}
```

Append to `src/styles/index.css`:

```css
@import "./components/journey.css";
```

- [ ] **Step 5: Verify**

Run: `npm run verify && npm test`
Expected: architecture check passes, no TypeScript errors, 7 tests pass.

- [ ] **Step 6: Commit**

```bash
git add src/components/journey src/app/student-journey src/app/[slug] src/styles
git commit -m "feat: give Student Journey a real route and progress meter"
```

---

### Task 9: The four page templates

**Files:**
- Create: `src/components/templates/marketing-detail.tsx`, `src/components/templates/editorial-list.tsx`, `src/components/templates/organisation.tsx`, `src/components/templates/contact-support.tsx`, `src/styles/components/templates.css`
- Modify: `src/app/[slug]/page.tsx`, `src/content/site.ts`, `src/styles/index.css`
- Delete: `src/components/route-utility.tsx`

**Interfaces:**
- Consumes: `PageDefinition` from `src/content/site.ts`, `PageFrame` (Task 3).
- Produces: four template components, each taking `{ page: PageDefinition }`.

This replaces the single hero-plus-three-cards template that currently renders fourteen distinct pages identically.

- [ ] **Step 1: Extend the page definition with a template discriminator**

In `src/content/site.ts`, change `PageDefinition`:

```ts
export type PageTemplate = "marketing" | "editorial" | "organisation" | "support";

export type PageDefinition = {
  title: string;
  eyebrow: string;
  description: string;
  image: string;
  focus: string[];
  action: { label: string; href: string };
  template: PageTemplate;
};
```

Set `template` on every entry in `pages`: `"organisation"` for `services`, `cyber-security-services`, `it-consulting-services`, `physical-security-services`, `staff-augmentation`; `"editorial"` for `insights`, `events`, `careers`; `"support"` for `contact`, `faqs`, `portal`; `"marketing"` for `about-us`, `faculty`, `placement-and-career-services`. Delete the old `kind` field.

- [ ] **Step 2: Write the marketing template**

Create `src/components/templates/marketing-detail.tsx`:

```tsx
import Image from "next/image";
import Link from "next/link";
import type { PageDefinition } from "../../content/site";

export function MarketingDetail({ page }: { readonly page: PageDefinition }) {
  return (
    <>
      <section className="tpl-hero section">
        <div className="shell tpl-hero__grid">
          <div className="stack">
            <p className="mono">{page.eyebrow}</p>
            <h1>{page.title}</h1>
            <p>{page.description}</p>
            <Link className="button button--primary" href={page.action.href}>
              {page.action.label} <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
          <Image src={page.image} alt="" width={1600} height={1000} />
        </div>
      </section>
      <section className="shell section tpl-focus">
        <p className="mono">What this route covers</p>
        <ul className="tpl-focus__grid">
          {page.focus.map((item, index) => (
            <li key={item} className="reveal">
              <span className="mono">{String(index + 1).padStart(2, "0")}</span>
              <h2>{item}</h2>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
```

- [ ] **Step 3: Write the editorial template**

Create `src/components/templates/editorial-list.tsx`. Editorial routes have no published items yet, so this states that plainly rather than implying a populated archive.

```tsx
import Link from "next/link";
import type { PageDefinition } from "../../content/site";

export function EditorialList({ page }: { readonly page: PageDefinition }) {
  return (
    <section className="shell section tpl-editorial">
      <div className="tpl-editorial__head stack">
        <p className="mono">{page.eyebrow}</p>
        <h1>{page.title}</h1>
        <p>{page.description}</p>
      </div>
      <ul className="tpl-editorial__topics">
        {page.focus.map((item) => (
          <li key={item} className="reveal">
            <h2>{item}</h2>
          </li>
        ))}
      </ul>
      <p className="tpl-editorial__state mono">
        No items are published yet. Ask the team about what is coming next.
      </p>
      <Link className="button button--secondary" href={page.action.href}>
        {page.action.label} <span aria-hidden="true">&rarr;</span>
      </Link>
    </section>
  );
}
```

- [ ] **Step 4: Write the organisation template**

Create `src/components/templates/organisation.tsx`. This is where Direction B's dark register is spent.

```tsx
import Image from "next/image";
import Link from "next/link";
import type { PageDefinition } from "../../content/site";

export function Organisation({ page }: { readonly page: PageDefinition }) {
  return (
    <section className="tpl-org surface-field section">
      <div className="shell tpl-org__grid">
        <div className="stack">
          <p className="mono">{page.eyebrow}</p>
          <h1>{page.title}</h1>
          <p>{page.description}</p>
          <Link className="button button--primary" href={page.action.href}>
            {page.action.label} <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
        <div className="tpl-org__panel">
          <Image src={page.image} alt="" width={1600} height={1000} />
        </div>
      </div>
      <ul className="shell tpl-org__index">
        {page.focus.map((item, index) => (
          <li key={item}>
            <i className="mono">{String(index + 1).padStart(2, "0")}</i>
            <b>{item}</b>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

- [ ] **Step 5: Write the contact/support template**

Create `src/components/templates/contact-support.tsx`. The `mailto:` POST form is removed: it does nothing in Chrome, and guardrail 7 forbids presenting an enquiry flow as live without a guarded module.

```tsx
import Link from "next/link";
import type { PageDefinition } from "../../content/site";

const FAQS = [
  ["How do I choose a programme?", "Start with the role or kind of work you want to move toward. A Yojo advisor can help confirm the right starting point."],
  ["Are programmes available online?", "Yojo publishes both classroom learning in Visakhapatnam and live-online learning. Current availability is confirmed with the team."],
  ["Are schedules and fees listed online?", "Schedules, levels and fees are confirmed during a conversation so the information is current and relevant to your selected programme."],
  ["What does placement support include?", "Where relevant, Yojo can support resume preparation, mock interviews, job referrals and internship programmes. This support does not guarantee employment."],
] as const;

export function ContactSupport({
  page,
  slug,
}: {
  readonly page: PageDefinition;
  readonly slug: string;
}) {
  return (
    <section className="shell section tpl-support">
      <div className="tpl-support__head stack">
        <p className="mono">{page.eyebrow}</p>
        <h1>{page.title}</h1>
        <p>{page.description}</p>
      </div>

      {slug === "contact" && (
        <div className="tpl-support__channels">
          <p className="mono">Reach Yojo directly</p>
          <ul className="stack">
            <li>
              <a href="mailto:info@yojosolutions.com">info@yojosolutions.com</a>
            </li>
            <li>Visakhapatnam, Andhra Pradesh, India</li>
          </ul>
          <p className="tpl-support__note">
            An online enquiry form will appear here once the guarded enquiry service is ready. Until
            then email reaches the team directly.
          </p>
        </div>
      )}

      {slug === "portal" && (
        <p className="tpl-support__note">
          Secure learner sign-in is not live yet. Enrolment questions go through an advisor.
        </p>
      )}

      {slug === "faqs" && (
        <div className="tpl-support__faqs">
          {FAQS.map(([question, answer]) => (
            <details key={question}>
              <summary>
                {question}
                <span aria-hidden="true">+</span>
              </summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      )}

      <Link className="button button--primary" href={page.action.href}>
        {page.action.label} <span aria-hidden="true">&rarr;</span>
      </Link>
    </section>
  );
}
```

- [ ] **Step 6: Rewrite the slug route as a template dispatcher**

Replace `src/app/[slug]/page.tsx`:

```tsx
import { notFound } from "next/navigation";
import { PageFrame } from "../../components/layout/page-frame";
import { ContactSupport } from "../../components/templates/contact-support";
import { EditorialList } from "../../components/templates/editorial-list";
import { MarketingDetail } from "../../components/templates/marketing-detail";
import { Organisation } from "../../components/templates/organisation";
import { pages } from "../../content/site";

export function generateStaticParams() {
  return Object.keys(pages).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = pages[slug];
  return page ? { title: page.eyebrow, description: page.description } : {};
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = pages[slug];
  if (!page) notFound();

  return (
    <PageFrame>
      {page.template === "organisation" && <Organisation page={page} />}
      {page.template === "editorial" && <EditorialList page={page} />}
      {page.template === "support" && <ContactSupport page={page} slug={slug} />}
      {page.template === "marketing" && <MarketingDetail page={page} />}
    </PageFrame>
  );
}
```

The legacy-programme-slug branch is deleted: `next.config.mjs` already redirects every `*-trainings.html` path permanently.

```bash
git rm src/components/route-utility.tsx
```

- [ ] **Step 7: Write the template stylesheet**

Create `src/styles/components/templates.css`:

```css
.tpl-hero__grid,
.tpl-org__grid { display: grid; grid-template-columns: 0.9fr 1.1fr; gap: var(--space-2xl); align-items: center; }
.tpl-hero h1, .tpl-org h1, .tpl-editorial h1, .tpl-support h1 { font-size: var(--step-7); }
.tpl-hero__grid p, .tpl-org__grid p { max-width: 27rem; color: var(--text-muted); }
.tpl-hero__grid img { width: 100%; height: auto; max-height: 35rem; object-fit: cover; border-radius: var(--radius-l); box-shadow: var(--shadow-float); }

.tpl-focus__grid { display: grid; grid-template-columns: repeat(3, 1fr); border-block-start: 1px solid var(--line); }
.tpl-focus__grid li { min-height: 14rem; padding: var(--space-m); border-inline-end: 1px solid var(--line); }
.tpl-focus__grid li:first-child { padding-inline-start: 0; }
.tpl-focus__grid li:last-child { border-inline-end: 0; }
.tpl-focus__grid h2 { margin-block-start: var(--space-xl); max-width: 17rem; font-size: var(--step-3); }
.tpl-focus__grid span { color: var(--brand-blue); }

.tpl-editorial__head { max-width: 52rem; }
.tpl-editorial__topics { margin-block: var(--space-2xl); border-block-start: 1px solid var(--line); }
.tpl-editorial__topics li { padding-block: var(--space-m); border-block-end: 1px solid var(--line); }
.tpl-editorial__topics h2 { font-size: var(--step-4); }
.tpl-editorial__state { color: var(--text-muted); margin-block-end: var(--space-l); }

.tpl-org { --shadow-float: 0 40px 90px rgba(0, 0, 0, 0.55); }
.tpl-org__panel { border: 1px solid var(--line); border-radius: var(--radius-l); overflow: hidden; box-shadow: var(--shadow-float); }
.tpl-org__panel img { width: 100%; height: auto; }
.tpl-org__index { margin-block-start: var(--space-2xl); border-block-start: 1px solid var(--line); }
.tpl-org__index li { display: grid; grid-template-columns: 3rem 1fr; gap: var(--space-m); align-items: center; padding-block: var(--space-s); border-block-end: 1px solid var(--line); }
.tpl-org__index i { font-style: normal; color: var(--brand-blue); }
.tpl-org__index b { font-weight: 450; font-size: var(--step-2); letter-spacing: -0.025em; }

.tpl-support__head { max-width: 46rem; }
.tpl-support__channels { margin-block: var(--space-2xl); }
.tpl-support__channels a { color: var(--brand-blue); text-decoration: underline; text-underline-offset: 4px; }
.tpl-support__note { max-width: 34rem; margin-block: var(--space-m) var(--space-l); color: var(--text-muted); }
.tpl-support__faqs { margin-block: var(--space-2xl); border-block-start: 1px solid var(--line); }
.tpl-support__faqs details { border-block-end: 1px solid var(--line); }
.tpl-support__faqs summary { display: flex; justify-content: space-between; gap: var(--space-m); padding-block: var(--space-m); cursor: pointer; font-size: var(--step-3); letter-spacing: -0.045em; }
.tpl-support__faqs summary span { color: var(--brand-blue); }
.tpl-support__faqs details[open] summary span { transform: rotate(45deg); }
.tpl-support__faqs p { max-width: 40rem; margin-block-end: var(--space-m); color: var(--text-muted); }

@media (max-width: 900px) {
  .tpl-hero__grid, .tpl-org__grid { grid-template-columns: 1fr; }
  .tpl-focus__grid { grid-template-columns: 1fr; }
  .tpl-focus__grid li, .tpl-focus__grid li:first-child { min-height: auto; padding: var(--space-m) 0; border-inline-end: 0; border-block-end: 1px solid var(--line); }
  .tpl-focus__grid h2 { margin-block-start: var(--space-s); }
}
```

Append to `src/styles/index.css`:

```css
@import "./components/templates.css";
```

- [ ] **Step 8: Verify**

Run: `npm run verify && npm test`
Expected: architecture check passes, no TypeScript errors, 7 tests pass.

- [ ] **Step 9: Commit**

```bash
git add src/components/templates src/app/[slug] src/content/site.ts src/styles
git commit -m "feat: replace generic slug template with four purpose-built templates"
```

---

### Task 10: Remaining homepage sections, route transitions, and release gate

**Files:**
- Modify: `src/app/page.tsx`, `src/styles/components/hero.css`, `src/styles/base.css`, `src/styles/index.css`
- Create: `src/styles/components/home.css`

**Interfaces:**
- Consumes: everything from Tasks 1–9.
- Produces: the finished homepage and a green release gate.

- [ ] **Step 1: Add the remaining homepage sections**

Replace `src/app/page.tsx`:

```tsx
import Image from "next/image";
import Link from "next/link";
import { AtlasSequence } from "../components/atlas/atlas-sequence";
import { AtlasHero } from "../components/hero/atlas-hero";
import { PageFrame } from "../components/layout/page-frame";
import { ATLAS_LAYERS } from "../content/atlas-layers";
import { CATEGORY_LABELS } from "../content/programme-media";
import { getPublicServices } from "./_services";

export default async function HomePage() {
  const { learningCatalogue } = getPublicServices();
  const result = await learningCatalogue.list();
  if (!result.ok) throw new Error(result.error.message);

  return (
    <PageFrame>
      <AtlasHero layers={ATLAS_LAYERS} />

      <section className="premise surface-field section">
        <div className="shell premise__grid">
          <p className="mono">The Yojo Learning Atlas</p>
          <h2>
            A course is content.
            <br />
            A learning system creates direction.
          </h2>
          <p>
            Yojo connects the decisions before training, the work during it and the transition that
            follows.
          </p>
        </div>
      </section>

      <AtlasSequence layers={ATLAS_LAYERS} />

      <section className="shell section home-programmes" aria-labelledby="home-programmes">
        <p className="mono">Choose by the work</p>
        <h2 id="home-programmes">
          Eight published domains.
          <br />
          One deliberate starting point.
        </h2>
        <ul className="home-programmes__list">
          {result.value.map((programme) => (
            <li key={programme.slug}>
              <Link href={`/courses/${programme.slug}`} className="reveal">
                <span>{programme.title}</span>
                <small className="mono">{CATEGORY_LABELS[programme.category]}</small>
                <b aria-hidden="true">&#8599;</b>
              </Link>
            </li>
          ))}
        </ul>
        <Link className="button button--secondary" href="/courses">
          View all programmes <span aria-hidden="true">&rarr;</span>
        </Link>
      </section>

      <section className="section home-career">
        <div className="shell home-career__grid">
          <Image
            src="/media/generated/student/placement-desk.webp"
            alt=""
            width={1024}
            height={1024}
          />
          <div className="stack">
            <p className="mono">After the learning</p>
            <h2>Support that helps you explain the work.</h2>
            <p>
              Resume preparation, mock interviews, job referrals and internship programmes can help
              prepare the transition when relevant.
            </p>
            <Link className="button button--secondary" href="/placement-and-career-services">
              Explore career support <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>
      </section>
    </PageFrame>
  );
}
```

- [ ] **Step 2: Write the homepage stylesheet**

Create `src/styles/components/home.css`:

```css
.premise__grid { display: grid; grid-template-columns: 1fr 1.75fr 1fr; gap: var(--space-l); align-items: end; }
.premise__grid h2 { font-size: var(--step-8); }
.premise__grid > p:last-child { color: var(--text-muted); }

.home-programmes h2 { font-size: var(--step-7); margin-block: var(--space-s) var(--space-2xl); }
.home-programmes__list { border-block-start: 1px solid var(--line); margin-block-end: var(--space-l); }
.home-programmes__list a {
  display: grid;
  grid-template-columns: 1fr auto 1.6rem;
  gap: var(--space-m);
  align-items: center;
  padding-block: var(--space-m);
  border-block-end: 1px solid var(--line);
  font-size: var(--step-3);
  letter-spacing: -0.04em;
  transition: padding var(--dur-base) var(--ease-out-expo), color var(--dur-fast) ease;
}
.home-programmes__list a:hover { padding-inline-start: var(--space-m); color: var(--brand-blue); }
.home-programmes__list small { color: var(--text-muted); }

.home-career__grid {
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  align-items: center;
  gap: var(--space-2xl);
  padding: var(--space-xl);
  border-radius: var(--radius-l);
  background: var(--surface-sunken);
  box-shadow: var(--shadow-raised);
}
.home-career__grid img { width: 100%; height: auto; border-radius: var(--radius-m); }
.home-career h2 { font-size: var(--step-6); }
.home-career p { max-width: 25rem; color: var(--text-muted); }

@media (max-width: 900px) {
  .premise__grid, .home-career__grid { grid-template-columns: 1fr; }
  .home-programmes__list small { display: none; }
}
```

Append to `src/styles/index.css`:

```css
@import "./components/home.css";
```

- [ ] **Step 3: Add route transitions**

Append to `src/styles/base.css`. This is the View Transitions API — zero JavaScript, and inert where unsupported.

```css
@media (prefers-reduced-motion: no-preference) {
  @view-transition { navigation: auto; }

  ::view-transition-old(root) { animation: vt-out var(--dur-base) var(--ease-out-expo) both; }
  ::view-transition-new(root) { animation: vt-in var(--dur-base) var(--ease-out-expo) both; }
}

@keyframes vt-out { to { opacity: 0; } }
@keyframes vt-in { from { opacity: 0; transform: translateY(10px); } }
```

- [ ] **Step 4: Confirm no dead assets or dead styles remain**

Run:

```bash
grep -rn "atlas-hero\|content/site\"" src/ --include=*.tsx --include=*.ts
```

Expected: no hit references `atlas-hero` (the mascot raster), and no component imports a `programmes` export from `src/content/site`.

Run:

```bash
grep -rn "line-strong" src/styles/
```

Expected: `tokens.css` defines it; other files only reference it.

- [ ] **Step 5: Run the full gate**

Run: `npm run verify && npm test && npm run build`
Expected: architecture check passes, no TypeScript errors, 7 tests pass, production build completes.

If `npm run build` reports an unused-file or missing-module error for a deleted component, fix the stale import and re-run. Do not suppress the error.

- [ ] **Step 6: Commit**

```bash
git add src/app/page.tsx src/styles
git commit -m "feat: complete homepage sections and view transitions"
```

---

## Post-implementation review

Not tasks — checks a reviewer runs against the running site.

- [ ] Hero at 1440×900: all five plate labels legible, case dominant, `YOJO` behind the product, one CTA, no mascot.
- [ ] Hero at 390×844: plates still legible, headline not overlapping the case.
- [ ] `prefers-reduced-motion: reduce` forced: hero plates visible, Atlas chapters all readable, no pinning.
- [ ] JavaScript disabled: every plate label, chapter, and programme row still present.
- [ ] Keyboard only: skip link works, nav disclosure opens/closes with focus moving correctly, Escape closes it, no focus trap.
- [ ] Network panel on `/about-us`: no GSAP chunk downloaded. On `/`: GSAP chunk loads after first paint.
- [ ] Mobile throttled: hero image served from the 480 or 960 derivative, not 1600.
