# Visual 10/10 + Heart Care Flagship Page — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Raise every page of Rise Medical Hub to 10/10 visual quality, repair the four trust failures found in review, and build a flagship animated `/heart-care` guide page that explains the heart, its conditions, warning signs, tests, and treatments through scroll-driven animation.

**Architecture:** Keep the existing Next.js 15 App Router + GSAP/ScrollTrigger stack. Phase 0 removes lies and dead code (nothing can be 10/10 while the form lies). Phase 1 upgrades the site-wide visual system (real fonts, motion tokens, texture, chrome). Phase 2 builds `/heart-care` as its own route folder with a layered SVG heart, chaptered scrollytelling, and a content model in `src/content/heart-guide.ts`. Phase 3 is QA.

**Tech Stack:** Next.js 15.5, React 19, GSAP 3.15 (ScrollTrigger + MotionPathPlugin, already installed), `next/font/google` (Fraunces + Instrument Sans), hand-authored SVG. No new runtime dependencies.

## Global Constraints

- **No test runner exists and none is added.** Per-task verification = `npm run typecheck` (must pass with zero errors) + live browser check via the dev server (`npm run dev`, port 3000) with the specific checks listed in each task.
- **Every animation must sit inside `gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", ...)`** with a legible static fallback, matching the existing pattern in `eecp-scrolly.tsx`.
- **SSR HTML must be complete and readable before any JS runs.** Animations may transform visible content; they may never be the thing that first makes content visible without the fallback pattern in Task 5.
- **Medical copy rules:** plain language, no outcome promises, every condition/triage section ends with "confirm with a doctor" framing, emergency guidance always names an action ("call 108 or reach the nearest emergency room"), disclaimers use the existing `.note-strip` component style.
- **Color tokens are the existing ones** (`--navy #10203d`, `--coral #dc5f72`, `--mint #dcefeb`, `--mint-deep #a8d4ce`, `--paper #fbfcfa`) plus two new ones added in Task 6: `--blue-venous #6f8fc9` (oxygen-poor blood) and `--gold #d9a441` (caution/borderline states).
- **Copy voice:** existing editorial voice — short serif headlines with one `<em>` italic accent word, eyebrow labels, unhurried tone.
- **Commit after every task** with the message given in the task.
- Existing content data lives in `src/content/site-data.ts`; new heart content goes in `src/content/heart-guide.ts` — pages never hardcode content arrays inline (the EECP page's inline `faqs` array is the pattern to avoid).

---

# Phase 0 — Trust & foundation (a site that lies caps at 5/10)

### Task 1: Delete the Nexara boilerplate

**Files:**
- Delete: `src/core/` (entire), `src/features/` (entire), `src/infrastructure/` (entire), `src/modules/` (entire), `src/app/api/` (entire), `src/app/_services.ts`, `src/shared/` (entire), `scripts/check-architecture.mjs`, `db/` (if template-only — inspect first)
- Modify: `package.json`, `.gitignore`

**Interfaces:** Produces: a repo where `grep -r "supabase\|nexara" src/` returns nothing.

- [x] **Step 1: Confirm nothing in `src/app`, `src/components`, `src/content` imports the doomed directories**

Run: `grep -rE "from ['\"](@/core|@/features|@/infrastructure|@/shared|\.\./core|\.\./\.\./core)" src/app/page.tsx src/app/layout.tsx "src/app/[slug]" src/app/resources src/components src/content`
Expected: no matches. (The only consumers are `src/app/api/me/route.ts` and `src/app/_services.ts`, which are being deleted.)

- [x] **Step 2: Delete the directories and files listed above**

- [x] **Step 3: Clean `package.json`**

Remove dependency `@supabase/supabase-js`. Remove scripts `check:arch`, `cf-typegen`; change `verify` to `"verify": "tsc --noEmit"`. Set `"name": "rise-medical-hub"`, `"description": "Rise Medical Hub — patient-first healthcare in Madhurawada, Visakhapatnam."`. Run `npm install` to update the lockfile.

- [x] **Step 4: Add `tsconfig.tsbuildinfo` to `.gitignore`** and `git rm --cached tsconfig.tsbuildinfo`.

- [x] **Step 5: Verify**

Run: `npm run typecheck` → 0 errors. Run `curl -s -o /dev/null -w '%{http_code}' http://localhost:3000/` → 200.

- [x] **Step 6: Commit** — `chore: remove unused platform boilerplate, rename package`

### Task 2: Make the appointment form honest (WhatsApp handoff)

The form currently drops data on the floor and claims "Request received." Until a real backend exists, the honest, zero-infra fix: compose the request into a prefilled WhatsApp message to the clinic number (already in `contact.whatsappHref`) and say exactly what's happening.

**Files:**
- Modify: `src/components/appointment-form.tsx` (full rewrite below)

**Interfaces:** Consumes `contact` from `@/content/site-data`. No other component changes.

- [x] **Step 1: Rewrite the component**

```tsx
"use client";

import { useState, type FormEvent } from "react";
import { contact } from "@/content/site-data";

export function AppointmentForm() {
  const [handedOff, setHandedOff] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const lines = [
      "Appointment request — Rise Medical Hub",
      `Name: ${data.get("name")}`,
      `Phone: ${data.get("phone")}`,
      data.get("email") ? `Email: ${data.get("email")}` : null,
      data.get("department") ? `Pathway: ${data.get("department")}` : null,
      data.get("date") ? `Preferred date: ${data.get("date")}` : null,
      data.get("note") ? `Note: ${data.get("note")}` : null,
    ].filter(Boolean);
    window.open(`${contact.whatsappHref}?text=${encodeURIComponent(lines.join("\n"))}`, "_blank", "noopener");
    setHandedOff(true);
  }

  if (handedOff) {
    return <div className="form-success"><span className="success-mark">✓</span><span className="eyebrow">Almost there</span><h2>Send the WhatsApp message to finish.</h2><p>We opened WhatsApp with your request pre-filled — press send there and our care team will reply with available times. Nothing reaches us until that message is sent.</p><p>Prefer to talk? Call <a href={contact.phoneHref}>{contact.phone}</a> — the line is answered around the clock.</p><button className="text-link" type="button" onClick={() => setHandedOff(false)}>Edit the request <b aria-hidden="true">↗</b></button></div>;
  }

  return <form className="appointment-form" onSubmit={handleSubmit}>
    <div className="form-heading"><span className="eyebrow">A simple first step</span><h2>Tell us how we can help.</h2><p>Submitting opens WhatsApp with your request pre-filled — you review it and press send. For urgent concerns, call us instead.</p></div>
    <div className="form-grid"><label>Patient name<input name="name" placeholder="Your full name" required /></label><label>Phone number<input name="phone" type="tel" placeholder="+91" required /></label><label>Email address<input name="email" type="email" placeholder="you@example.com" /></label><label>Preferred department<select name="department" defaultValue=""><option value="" disabled>Select a care pathway</option><option>Heart care / EECP</option><option>Diagnostic Services</option><option>Pharmacy Services</option><option>OPD Services</option></select></label><label className="form-span">Preferred date<input name="date" type="date" /></label><label className="form-span">What would you like us to know?<textarea name="note" rows={4} placeholder="Share a little context..." /></label></div>
    <label className="consent"><input type="checkbox" required /> <span>I agree to be contacted by Rise Medical Hub about this request.</span></label><button className="button button-coral" type="submit">Continue on WhatsApp <b aria-hidden="true">↗</b></button>
  </form>;
}
```

- [x] **Step 2: Verify in browser** — fill the form on `/appointment`, submit, confirm a `wa.me` tab opens with the composed text and the success panel says "press send there", not "request received".

- [x] **Step 3: Commit** — `fix: appointment form hands off to WhatsApp instead of silently dropping data`

### Task 3: Stop publishing fabricated medical facts

**Files:**
- Modify: `src/app/[slug]/page.tsx` (DoctorsBody: delete the JSON-LD block, lines ~82–91), `src/app/[slug]/page.tsx` (TestimonialsBody note-strip), `src/app/[slug]/page.tsx` (GalleryBody + `pageMeta.gallery`), `src/components/doctors-directory.tsx` (spotlight quote)

- [x] **Step 1: Delete the `MedicalClinic`/`Physician` JSON-LD** from `DoctorsBody` entirely (the `jsonLd` const and the `<script>` tag). It re-enters only when the roster is verified real — tracked by the existing note-strip.
- [x] **Step 2: Testimonials honesty.** Replace the note-strip text with: `"Illustrative patient stories, shown while we collect consented testimonials from our first patients. Individual outcomes vary — every treatment decision belongs with your doctor."` Change page eyebrow in `pageMeta.testimonials` from `"In their words"` to `"The experience we're building"`.
- [x] **Step 3: Gallery honesty.** Change `pageMeta.gallery` description to `"A visual preview of the Rise environment — concept renders of the spaces we're building, ahead of opening photography."` and add a `.note-strip` after the grid: `"These are design visualisations. Real photography replaces them as each space opens."`
- [x] **Step 4: Spotlight quote.** In `doctors-directory.tsx`, replace the fabricated blockquote with a philosophy statement owned by the clinic, not a person: `"Our rule for every consultation: no test without a reason, no report without an explanation, no visit without a written next step."` and change the attribution line to `<strong>The Rise care team</strong><span>Cardiology & EECP pathway</span>`.
- [x] **Step 5: Verify** — `/doctors` page source (`curl -s localhost:3000/doctors | grep -c "application/ld+json"`) returns 0; testimonials/gallery pages show the new strips.
- [x] **Step 6: Commit** — `fix: remove fabricated physician schema and false consent claims`

### Task 4: SEO plumbing (the invisible half of 10/10)

**Files:**
- Create: `src/app/sitemap.ts`, `src/app/robots.ts`, `src/app/icon.svg`, `src/app/opengraph-image.png` (1200×630 export of the brand mark on navy — generate with the brand ECG line + wordmark), `src/components/clinic-schema.tsx`
- Modify: `src/app/layout.tsx`, `src/components/eecp-body.tsx` (FAQ schema)

- [x] **Step 1: `src/app/sitemap.ts`**

```ts
import type { MetadataRoute } from "next";
import { posts } from "@/content/site-data";

const BASE = "https://risemedicalhub.com";
const pages = ["", "/about", "/services", "/heart-care", "/eecp-therapy", "/diagnostics", "/pharmacy", "/opd", "/doctors", "/health-packages", "/health-camps", "/testimonials", "/resources", "/gallery", "/appointment", "/contact"];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...pages.map((p) => ({ url: `${BASE}${p}`, changeFrequency: "monthly" as const, priority: p === "" ? 1 : p === "/heart-care" || p === "/eecp-therapy" ? 0.9 : 0.7 })),
    ...posts.map((post) => ({ url: `${BASE}/resources/${post.slug}`, lastModified: new Date(post.date), changeFrequency: "yearly" as const, priority: 0.6 })),
  ];
}
```

- [x] **Step 2: `src/app/robots.ts`** — standard allow-all + `sitemap: "https://risemedicalhub.com/sitemap.xml"`.
- [x] **Step 3: `layout.tsx` metadata** — add `metadataBase: new URL("https://risemedicalhub.com")`, `openGraph: { siteName: "Rise Medical Hub", type: "website", locale: "en_IN" }`, `twitter: { card: "summary_large_image" }`.
- [x] **Step 4: `clinic-schema.tsx`** — a server component emitting `MedicalClinic` JSON-LD with **only verifiable facts** (name, address, phone, geo area "Madhurawada, Visakhapatnam", `medicalSpecialty: ["Cardiovascular", "PrimaryCare"]`, opening hours once confirmed — omit until then). Render it in `layout.tsx` body. No physician names.
- [x] **Step 5: FAQ schema on EECP** — in `eecp-body.tsx` render `FAQPage` JSON-LD built from the existing `faqs` array (`.replace(/</g,"\\u003c")` like the removed doctors block did).
- [x] **Step 6: `icon.svg`** — the existing brand mark (circle + cross from `.brand-mark`) as a 64×64 SVG, navy on transparent.
- [x] **Step 7: Verify** — `curl localhost:3000/sitemap.xml` lists all pages + 6 posts; `curl localhost:3000/robots.txt` valid; view-source of `/` shows og tags + clinic schema; `/eecp-therapy` shows FAQPage schema. `npm run typecheck` clean.
- [x] **Step 8: Commit** — `feat: sitemap, robots, icons, OG metadata, honest clinic + FAQ schema`

### Task 5: Fix the three delivery bugs (menu, hidden hero, 1.7MB images)

**Files:**
- Modify: `src/components/site-header.tsx`, `src/components/home-hero.tsx`, `src/components/eecp-hero.tsx`, `src/app/globals.css`, `public/images/*`

- [x] **Step 1: Mobile menu closes on navigation.** Convert the `<details>` menu to a client component pattern: add `"use client"` wrapper component `MobileMenu` (extract from header) holding `const ref = useRef<HTMLDetailsElement>(null)` and `const pathname = usePathname()`; `useEffect(() => { if (ref.current) ref.current.open = false; }, [pathname])`. Header itself stays a server component importing `MobileMenu`.
- [x] **Step 2: Hero content can never be invisible.** In both hero components, the first line inside the matchMedia callback adds a class: `ref.current?.classList.add("is-animating")`. In CSS, author the hidden initial states under that class only (`.hm-hero.is-animating .hm-line-inner { /* GSAP owns it */ }`) and replace the `.from()` tweens on text with `.fromTo()` whose hidden state is applied by GSAP itself at timeline start (GSAP does this already; the real fix is a safety valve): add to both components after building the timeline: `const failsafe = window.setTimeout(() => intro.progress(1), 4000);` cleared in the cleanup. A stalled ticker (background tab, ancient phone) now snaps content visible at 4s.
- [x] **Step 3: Compress images.** `npx sharp-cli` or `cwebp -q 82` each `public/images/*.png` → same-name `.webp` (~120–250KB each), update every `src=".../*.png"` reference (`grep -rl "images/" src/`), delete the PNGs.
- [x] **Step 4: Verify** — mobile viewport (375×812): open menu, tap "About", menu is closed on arrival. Home with DevTools CPU 6× throttle: headline visible ≤4s worst case. `ls -la public/images` all files <300KB.
- [x] **Step 5: Commit** — `fix: mobile menu close-on-nav, hero animation failsafe, webp images`

---

# Phase 1 — Site-wide visual system (the 10/10 pass)

### Task 6: Real typography + extended tokens

Georgia/Arial is the single biggest thing making the site look free. Fraunces (display serif with optical sizing — editorial, warm, medical-trustworthy) + Instrument Sans (geometric-humanist, great at 11–14px UI sizes).

**Files:**
- Modify: `src/app/layout.tsx`, `src/app/globals.css:1-40`

- [x] **Step 1: Load fonts in `layout.tsx`**

```tsx
import { Fraunces, Instrument_Sans } from "next/font/google";

const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-serif", axes: ["opsz"], style: ["normal", "italic"], weight: ["400", "500"] });
const instrument = Instrument_Sans({ subsets: ["latin"], variable: "--font-sans", weight: ["400", "500", "600", "700"] });
// <html lang="en" className={`${fraunces.variable} ${instrument.variable}`}>
```

- [x] **Step 2: Token pass in `globals.css`**

```css
:root {
  /* existing colors stay; add: */
  --blue-venous: #6f8fc9;
  --gold: #d9a441;
  --serif: var(--font-serif), Georgia, serif;
  --sans: var(--font-sans), Arial, sans-serif;
  /* motion tokens (Task 7 consumes) */
  --ease-out: cubic-bezier(.22,.9,.24,1);
  --ease-inout: cubic-bezier(.6,.05,.15,.95);
  --dur-quick: .35s; --dur-base: .7s; --dur-slow: 1.1s;
}
h1, h2 { font-weight: 500; font-variation-settings: "opsz" 72; letter-spacing: -0.02em; }
```

Adjust `h1` clamp to `clamp(52px, 7.4vw, 104px)` (Fraunces runs wider than Georgia). Sweep every page at 375/768/1280 for overflow.

- [x] **Step 3: Verify** — fonts visible in DevTools (`font-family` computed = Fraunces/Instrument Sans), no FOUT (next/font self-hosts), no headline overflow at 375px on `/`, `/eecp-therapy`, `/doctors`. Typecheck clean.
- [x] **Step 4: Commit** — `feat: Fraunces + Instrument Sans typography, motion/color tokens`

### Task 7: Motion system v2 — Reveal variants, heading masks, page transitions

**Files:**
- Modify: `src/components/reveal.tsx`, `src/app/globals.css`
- Create: `src/app/template.tsx`

- [x] **Step 1: Reveal variants.** Extend `Reveal` with `variant?: "rise" | "blur" | "mask"` (default `"rise"`, current behavior). CSS:

```css
.reveal-blur { opacity: 0; filter: blur(14px); transform: translateY(18px); transition: opacity var(--dur-slow) var(--ease-out), filter var(--dur-slow) var(--ease-out), transform var(--dur-slow) var(--ease-out); }
.reveal-blur.is-visible { opacity: 1; filter: blur(0); transform: none; }
.reveal-mask { clip-path: inset(0 0 100% 0); transition: clip-path var(--dur-slow) var(--ease-inout); }
.reveal-mask.is-visible { clip-path: inset(0 0 -8% 0); }
```

All variants gated behind `@media (prefers-reduced-motion: no-preference)`; otherwise `.reveal { opacity: 1; transform: none; }`.

- [x] **Step 2: Page transitions.** `src/app/template.tsx`:

```tsx
"use client";
import { useEffect, useRef, type ReactNode } from "react";
export default function Template({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => { ref.current?.classList.add("page-enter-done"); }, []);
  return <div ref={ref} className="page-enter">{children}</div>;
}
```

```css
@media (prefers-reduced-motion: no-preference) {
  .page-enter { opacity: 0; transform: translateY(14px); }
  .page-enter-done { opacity: 1; transform: none; transition: opacity .5s var(--ease-out), transform .5s var(--ease-out); }
}
```

- [x] **Step 3: Apply `variant="mask"` to every `section-heading` h2 block** (they're all wrapped in `Reveal` already — pass the prop at the ~14 call sites: home flow/pathways headings, services, packages, camps, EECP sections, doctors roster, resources).
- [x] **Step 4: Verify** — navigate between pages: soft rise on each arrival; headings wipe upward on scroll; with OS reduced-motion enabled everything is static and visible. Typecheck clean.
- [x] **Step 5: Commit** — `feat: reveal variants (blur/mask), page enter transitions`

### Task 8: Chrome upgrade — header, footer

**Files:**
- Modify: `src/components/site-header.tsx`, `src/components/site-footer.tsx`, `src/app/globals.css`
- Create: `src/components/header-scroll.tsx` (client)

- [x] **Step 1: Sticky glass header.** `header-scroll.tsx` client component adds `data-scrolled` to `document.body` past 24px (single `scroll` listener, rAF-throttled). CSS: `.site-header { position: sticky; top: 0; transition: box-shadow var(--dur-quick), backdrop-filter var(--dur-quick); backdrop-filter: blur(0); } body[data-scrolled] .site-header { backdrop-filter: blur(14px); background: rgba(251,252,250,.72); box-shadow: 0 1px 0 rgba(16,32,61,.08), 0 12px 32px -24px rgba(16,32,61,.25); }`. Utility bar stays non-sticky.
- [x] **Step 2: Active nav state.** In the nav (client subcomponent with `usePathname`), the current section's link gets `.nav-on` — coral 2px underline offset 6px, animated `text-decoration-color` fade. "Heart care" and "EECP" both highlight under their own paths.
- [x] **Step 3: Nav CTA micro-interaction.** `.nav-cta:hover b { transform: translate(2px,-2px); }` with `transition: transform .25s var(--ease-out)` — the arrow leans into the corner. Apply the same rule globally: `.button:hover b, .text-link:hover b { transform: translate(2px,-2px); }`.
- [x] **Step 4: Footer upgrade.** Add above `footer-top`: a full-width CTA band — navy, the `HeroEcg` line as divider art, serif h2 `"One conversation<br/><em>starts it.</em>"`, coral button to `/appointment`, ghost button `tel:`. Then existing columns. Add to bottom row: `<Link href="/heart-care">Heart guide</Link>`.
- [x] **Step 5: Verify** — scroll any page: header gains glass + shadow; active page underlined in nav; footer band renders on all pages; arrows nudge on hover. Mobile 375px: no horizontal scroll.
- [x] **Step 6: Commit** — `feat: sticky glass header, active nav, footer CTA band`

### Task 9: Depth & texture pass (kill the flatness)

**Files:**
- Modify: `src/app/globals.css`

- [x] **Step 1: Grain on dark sections.** One inline-SVG noise data-URI, applied as `::after` overlay (`opacity:.05; mix-blend-mode:overlay; pointer-events:none`) on `.section-ink`, `.hm-hero`, `.eecp-hero`, `.dr-hero`, `.hm-closer`, footer CTA band.
- [x] **Step 2: Ambient gradient.** On the same dark sections add a fixed radial glow: `background-image: radial-gradient(1200px 600px at 78% -10%, rgba(220,95,114,.14), transparent 60%), radial-gradient(900px 500px at 8% 110%, rgba(168,212,206,.10), transparent 60%);` layered under content.
- [x] **Step 3: Card elevation system.** One shared recipe for `service-card`, `pkg-card`, `blog-card`, `tst-card`, `dept-card`, `lab-card`: resting `border: 1px solid var(--line); box-shadow: 0 1px 2px rgba(16,32,61,.04)`; hover `transform: translateY(-6px); box-shadow: 0 24px 48px -24px rgba(16,32,61,.28); border-color: transparent` with `transition: all var(--dur-quick) var(--ease-out)`. Card images get a slow `scale(1.04)` on hover (`overflow:hidden` on the frame).
- [x] **Step 4: Section rhythm.** Replace flat `.section-pad { padding: 124px 0 }` with fluid `padding: clamp(84px, 11vw, 148px) 0;` and give alternating sections a hairline top rule (`border-top: 1px solid var(--line)`) except colored ones.
- [x] **Step 5: Verify** — home + EECP + doctors: dark sections show subtle grain/glow (zoom a screenshot to confirm), all cards share identical hover physics, no jank while scrolling (DevTools performance: no layout thrash — transforms/opacity only).
- [x] **Step 6: Commit** — `feat: grain + ambient light on dark sections, unified card elevation`

### Task 10: Rescue the thin pages (pharmacy, OPD, contact)

**Files:**
- Modify: `src/app/[slug]/page.tsx` (PharmacyBody, OpdBody as new named bodies replacing generic `ServiceBody` for those slugs; ContactBody), `src/content/site-data.ts` (new data arrays)

- [x] **Step 1: Data.** Add to `site-data.ts`:

```ts
export const pharmacyPoints = [
  { title: "Genuine, tracked stock", copy: "Every medicine sourced from authorised distributors with batch-level tracking — no grey-market stock, ever." },
  { title: "Pharmacist counselling", copy: "Doses, timings, food interactions, and what to do about a missed dose — explained before you leave the counter." },
  { title: "Ready before you are", copy: "Prescriptions from Rise consultations are prepared while you finish — collect on your way out." },
  { title: "Chronic-care refills", copy: "Monthly refill reminders for BP, diabetes, and cardiac medicines, with a call before you run out." },
];
export const opdTimings = [
  { dept: "Cardiology & EECP", days: "Mon–Sat", hours: "10:00–14:00" },
  { dept: "General & Internal Medicine", days: "Mon–Sat", hours: "09:30–13:30" },
  { dept: "Diabetology", days: "Mon–Fri", hours: "17:00–20:00" },
  { dept: "Women's Health", days: "Tue–Sat", hours: "11:00–14:00" },
  { dept: "Pulmonology", days: "Mon–Sat", hours: "18:00–20:30" },
  { dept: "Physiotherapy & Rehab", days: "Mon–Sat", hours: "08:00–13:00" },
];
```

(Timings mirror the doctor roster; keep the existing "being verified" note-strip on both pages.)

- [x] **Step 2: PharmacyBody** — split-detail intro (existing), then a 4-up numbered grid of `pharmacyPoints` (reuse `.value-list` styles), then CtaStrip (`"Ask about a medicine"` → tel).
- [x] **Step 3: OpdBody** — split-detail intro, then an OPD timings table (styled like the EECP compare table) built from `opdTimings` with a "Book this department" link per row → `/appointment`, then the existing 3-point "what to expect", then CtaStrip.
- [x] **Step 4: Contact page** — replace the fake `map-art` with a real embed: `<iframe title="Map to Rise Medical Hub" loading="lazy" src="https://www.google.com/maps?q=${encodeURIComponent(contact.address)}&output=embed" />` in a rounded frame; add an hours strip (from `opdTimings`, condensed) and a "How to find us" line (nearest landmark — confirm with owner, placeholder: "Opposite Madhurawada bus depot; parking on site").
- [x] **Step 5: Verify** — `/pharmacy` and `/opd` each ≥3 substantive sections, no shared-generic-only content; `/contact` shows live map tile; all responsive at 375px. Typecheck clean.
- [x] **Step 6: Commit** — `feat: real pharmacy/OPD content, live map + hours on contact`

### Task 11: Unified image treatment + photography plan

**Files:**
- Modify: `src/app/globals.css`
- Create: `docs/photography-shotlist.md`

- [x] **Step 1: Duotone unifier.** The 5 AI renders look inconsistent. Wrap every content image frame (`.service-card-image`, `.detail-image`, `.page-hero-media`, `.gallery-item`, `.eecp-sticky-media`) with a shared treatment: `filter: saturate(.82) contrast(1.02); ` plus a navy multiply veil `::after { background: linear-gradient(180deg, rgba(16,32,61,.0), rgba(16,32,61,.18)); mix-blend-mode: multiply; }` — one grade across the site.
- [x] **Step 2: Shot list** for the real shoot (12 shots: exterior signage, reception wide, EECP suite with machine, cuffs detail, ECG monitor closeup, consultation two-shot, pharmacy counter, lab bench, corridor, physio space, team candid, Madhurawada street context). Note per shot: replaces which file, orientation, min 2400px.
- [x] **Step 3: Verify** — screenshot home + services side by side: images read as one family. Commit — `feat: unified image grade, photography shot list`

---

# Phase 2 — `/heart-care`: the flagship animated heart guide

Structure: a chaptered long-read. Sticky progress rail. Three custom animated set-pieces (beating anatomical heart, blood-flow scrolly, artery-narrowing scrolly) + animated vitals dials. Everything else uses the site's Reveal system so the page stays performant.

### Task 12: Content model — `src/content/heart-guide.ts`

**Files:**
- Create: `src/content/heart-guide.ts`

**Interfaces:** Produces the exports below; every Task 13–19 component imports from here, never inlines copy.

- [x] **Step 1: Create the file with this exact content**

```ts
export const chapters = [
  { id: "how-it-works", num: "01", title: "How your heart works" },
  { id: "numbers", num: "02", title: "The numbers that matter" },
  { id: "narrowing", num: "03", title: "When arteries narrow" },
  { id: "conditions", num: "04", title: "Conditions, plainly" },
  { id: "warning-signs", num: "05", title: "Warning signs" },
  { id: "protect", num: "06", title: "How to protect it" },
  { id: "tests", num: "07", title: "Tests, decoded" },
  { id: "treatment", num: "08", title: "Treatment & the third option" },
] as const;

export const flowSteps = [
  { title: "Blood returns, oxygen spent", copy: "Used blood from your body streams into the right atrium — the heart's receiving room — carrying carbon dioxide and very little oxygen." },
  { title: "The right side sends it to the lungs", copy: "The right ventricle pushes that blood a short distance — to the lungs — where it drops carbon dioxide and picks up fresh oxygen." },
  { title: "The left side receives it, renewed", copy: "Bright, oxygen-rich blood flows back into the left atrium and down into the left ventricle — the heart's strongest chamber." },
  { title: "One beat sends it everywhere", copy: "The left ventricle contracts and drives oxygen-rich blood through the aorta to every organ — brain, kidneys, muscles, and the heart itself. Four valves keep it all moving one way." },
];

export type Vital = { label: string; reading: string; unit: string; bands: { label: string; range: string; tone: "good" | "watch" | "act" }[]; note: string };
export const vitals: Vital[] = [
  { label: "Blood pressure", reading: "120/80", unit: "mmHg", bands: [ { label: "Healthy", range: "below 120/80", tone: "good" }, { label: "Elevated", range: "120–139 / 80–89", tone: "watch" }, { label: "High — consult", range: "140/90 and above", tone: "act" } ], note: "One high reading is not a diagnosis — patterns over a week are what your doctor reads." },
  { label: "Resting heart rate", reading: "60–100", unit: "beats/min", bands: [ { label: "Typical", range: "60–100", tone: "good" }, { label: "Discuss", range: "consistently outside that, or irregular", tone: "watch" }, { label: "Act", range: "racing or fluttering at rest with dizziness", tone: "act" } ], note: "Fit people often sit below 60 — context matters more than the number." },
  { label: "LDL cholesterol", reading: "<100", unit: "mg/dL", bands: [ { label: "Optimal", range: "below 100", tone: "good" }, { label: "Borderline", range: "100–159", tone: "watch" }, { label: "High — consult", range: "160 and above", tone: "act" } ], note: "Your personal target depends on your overall risk — set it with your doctor." },
  { label: "HbA1c", reading: "<5.7", unit: "%", bands: [ { label: "Typical", range: "below 5.7", tone: "good" }, { label: "Prediabetes", range: "5.7–6.4", tone: "watch" }, { label: "Diabetes range", range: "6.5 and above", tone: "act" } ], note: "Sugar and heart health are one story — high sugar quietly injures arteries." },
];

export type Condition = { name: string; what: string; feelsLike: string; redFlag: string; firstStep: string };
export const conditions: Condition[] = [
  { name: "Coronary artery disease", what: "Cholesterol deposits (plaque) slowly narrow the arteries that feed the heart muscle itself.", feelsLike: "Often nothing for years — then heaviness or breathlessness on exertion.", redFlag: "Chest discomfort appearing at rest, or with less and less effort.", firstStep: "A cardiology review with ECG and echo maps where you stand." },
  { name: "Angina", what: "The heart muscle briefly runs short of blood — a supply-demand gap, usually from narrowed arteries.", feelsLike: "Pressure, tightness, or burning in the chest on exertion or stress, easing with rest.", redFlag: "Episodes becoming more frequent, longer, or arriving at rest — unstable angina is an emergency.", firstStep: "Planned cardiology consultation; describe the pattern — what brings it on, what settles it." },
  { name: "Heart attack", what: "A plaque ruptures and a clot suddenly blocks a coronary artery. Muscle downstream begins to die within minutes.", feelsLike: "Crushing central chest pressure lasting more than a few minutes, sweating, nausea, pain into the arm, jaw, or back.", redFlag: "This IS the red flag. Minutes decide how much muscle survives.", firstStep: "Emergency — call 108 or get to the nearest emergency room. Do not drive yourself. Do not wait to see if it passes." },
  { name: "Heart failure", what: "The heart still beats but pumps less strongly than the body needs — often after years of high BP, diabetes, or a past heart attack.", feelsLike: "Breathlessness on stairs or lying flat, swollen ankles by evening, unusual tiredness.", redFlag: "Waking up gasping, breathless at rest, rapid weight gain over days.", firstStep: "An echo measures pumping strength; modern medicines — and therapies like EECP — genuinely help." },
  { name: "Arrhythmia", what: "The heart's electrical wiring misfires — beats come too fast, too slow, or irregularly. Atrial fibrillation is the most common kind.", feelsLike: "Fluttering, skipped beats, racing episodes, sometimes dizziness.", redFlag: "Palpitations with fainting, chest pain, or breathlessness.", firstStep: "An ECG during symptoms — or a 24-hour Holter — catches the rhythm in the act." },
  { name: "Valve disease", what: "One of the four one-way valves stiffens or leaks, making every beat less efficient.", feelsLike: "Breathlessness, fatigue, sometimes a murmur found on examination.", redFlag: "Fainting or chest tightness with exertion.", firstStep: "An echocardiogram shows each valve opening and closing in real time." },
  { name: "Hypertension", what: "Persistently high pressure in the arteries — the silent workload that thickens heart muscle and stiffens vessels for years before symptoms.", feelsLike: "Usually nothing. That is exactly the problem.", redFlag: "Readings above 180/120, or high readings with headache, vision change, or chest pain — act now.", firstStep: "A week of proper home readings, then a consultation. Treatment is unglamorous and extremely effective." },
  { name: "Cardiomyopathy", what: "Disease of the heart muscle itself — stretched, thickened, or stiffened — sometimes inherited.", feelsLike: "Breathlessness, swelling, palpitations; sometimes found only after a relative's diagnosis.", redFlag: "Fainting during exercise, or sudden cardiac events in young family members.", firstStep: "Echo plus family history; first-degree relatives of a diagnosed person should be screened." },
];

export const emergencySigns = [
  "Pressure, heaviness, or squeezing in the centre of the chest lasting more than a few minutes",
  "Pain spreading to the left arm, jaw, neck, or back",
  "Chest discomfort with cold sweat, nausea, or breathlessness",
  "Sudden breathlessness at rest, or waking up gasping",
  "Fainting, or near-fainting with palpitations",
];
export const plannedSigns = [
  "Discomfort that appears with exertion and eases with rest",
  "New breathlessness on stairs you managed last year",
  "Episodes of fluttering or racing heartbeat",
  "Ankles swelling by evening",
  "You're 35+ with diabetes, high BP, smoking, or family history — and have never had a heart check",
];

export type HeartTest = { name: string; sees: string; when: string; feels: string; time: string };
export const heartTests: HeartTest[] = [
  { name: "ECG", sees: "The heart's electrical rhythm — a 10-second snapshot.", when: "Every cardiac evaluation starts here; also during chest pain or palpitations.", feels: "Stickers on the chest, nothing more.", time: "5 min" },
  { name: "Echocardiogram", sees: "Live ultrasound of chambers, valves, and pumping strength.", when: "Breathlessness, murmurs, after a heart attack, heart-failure checks.", feels: "A probe glides over gel on your chest.", time: "20–30 min" },
  { name: "Treadmill test (TMT)", sees: "How the heart behaves under real exertion.", when: "Exertional chest discomfort with a normal resting ECG.", feels: "A brisk, monitored walk that gets steeper.", time: "30–40 min" },
  { name: "Holter monitor", sees: "Every single beat across 24 hours — a rhythm film, not a snapshot.", when: "Palpitations or dizziness that never seem to happen in the clinic.", feels: "A pocket-sized recorder worn for a day.", time: "24 h" },
  { name: "Blood panel", sees: "Cholesterol, sugar (HbA1c), kidney health — the slow risk factors.", when: "Annually from your mid-30s; sooner with family history.", feels: "One sample, most reports the same day.", time: "10 min" },
];

export const protectHabits = [
  { title: "Walk 30 minutes", copy: "Brisk — talk but can't sing. Beach road at dawn or after sunset both count; so do three 10-minute walks." },
  { title: "Eat for your arteries", copy: "More fish, dal, vegetables, and whole grains; less deep-fried, less salt, easy on sweets. Small swaps, kept forever, beat crash diets." },
  { title: "Leave tobacco behind", copy: "The single most powerful thing a smoker can do for their heart. Risk starts falling within weeks of stopping." },
  { title: "Sleep seven hours", copy: "Chronic short sleep pushes BP and sugar the wrong way. Treat snoring-plus-daytime-sleepiness as a medical question." },
  { title: "Mind the pressure", copy: "Stress hormones tighten arteries. Whatever genuinely unwinds you — prayer, music, a walk with a friend — is cardiology." },
  { title: "Know your numbers", copy: "BP, sugar, cholesterol — once a year. The heart's biggest threats are silent for a decade; testing is how you hear them early." },
];

export const heartFaqs = [
  { q: "Is a heart attack the same as cardiac arrest?", a: "No. A heart attack is a plumbing problem — a blocked artery starving heart muscle. Cardiac arrest is an electrical problem — the heart stops pumping entirely and collapse is immediate. A heart attack can trigger arrest, which is why chest pain needs urgent care." },
  { q: "Is chest pain always on the left side?", a: "No. Cardiac discomfort is most often central — a pressure or heaviness — and can appear in the jaw, back, or arms, or as breathlessness alone, especially in women and people with diabetes." },
  { q: "At what age should heart check-ups start?", a: "For most people, a baseline — BP, sugar, cholesterol, ECG — by 35, earlier with family history, diabetes, or smoking. After that, yearly numbers and a review." },
  { q: "My BP is high only at the clinic. Does it count?", a: "It might not — 'white-coat' readings are common. A week of proper home readings, morning and evening, tells your doctor what's real." },
  { q: "Can I exercise with a heart condition?", a: "Usually yes — movement is medicine — but the dose needs a doctor. After an event, or during therapies like EECP, activity is built up gradually under guidance." },
];
```

- [x] **Step 2: Verify** — `npm run typecheck` clean. Commit — `feat: heart guide content model`

### Task 13: The anatomical heart — `src/components/heart/heart-figure.tsx`

The centrepiece SVG, reused by hero (idle beat) and Chapter 1 scrolly (flow states). Stylized cross-section in brand language — not textbook realism: rounded chamber shapes, hairline outlines, flat fills.

**Files:**
- Create: `src/components/heart/heart-figure.tsx` (server component — pure SVG), `src/app/globals.css` additions

**Interfaces:** Produces `<HeartFigure />` rendering `<svg class="heart-fig" viewBox="0 0 520 560">` containing these **required stable ids/classes** (animation tasks target them):
`#hf-ra`, `#hf-rv`, `#hf-la`, `#hf-lv` (chamber paths) · `#hf-septum` · `#hf-aorta`, `#hf-pa` (pulmonary artery), `#hf-vc` (vena cava), `#hf-pv` (pulmonary veins) — vessel paths with visible stroke centrelines `.hf-lane` (4 lanes: `#lane-in`, `#lane-lungs`, `#lane-return`, `#lane-out`) for particle motion paths · `.hf-valve` ×4 (small paired-leaflet marks) · `.hf-label` ×8 (`<text>` chamber/vessel names, hidden until Chapter 1 reveals them) · `.hf-particle` ×12 `<circle r="4">` (3 per lane) · `#hf-outline` (whole-heart silhouette for the idle beat).

- [x] **Step 1: Author the SVG.** Geometry spec: heart silhouette occupies x 90–430, y 60–480, tilted ~15° left (apex lower-left, matching anatomy). Right chambers (viewer's left… anatomical right = viewer left): `#hf-ra` upper-left rounded quad ~(120,140)-(240,260); `#hf-rv` below it to apex; `#hf-la` upper-right (280,130)-(400,240); `#hf-lv` below-right, drawn with a visibly thicker wall (double outline, 10px gap) — the one anatomical fact the design must show. Vessels: `#hf-vc` enters top-left and bottom-left into RA; `#hf-pa` exits RV upward, branching left/right toward two small stylised lung lobes at the top corners (simple 3-arc shapes, mint fill); `#hf-pv` returns from lungs into LA; `#hf-aorta` arches from LV up and over (the classic candy-cane) exiting top-centre. Fills: venous side `var(--blue-venous)` at 18% opacity, arterial side `var(--coral)` at 16%, strokes `var(--navy)` 1.5px. Lanes are invisible (`stroke: none; fill: none`) paths tracing: in→RA→RV (`#lane-in`), RV→lungs (`#lane-lungs`), lungs→LA→LV (`#lane-return`), LV→aorta→exit (`#lane-out`).
- [x] **Step 2: Idle beat CSS** (used wherever no GSAP takes over): `@media (prefers-reduced-motion: no-preference) { .heart-fig #hf-outline, .heart-fig .hf-chambers { animation: hf-beat 1.9s var(--ease-inout) infinite; transform-origin: 52% 55%; } @keyframes hf-beat { 0%,100% { transform: scale(1); } 12% { transform: scale(1.025); } 24% { transform: scale(.99); } 36% { transform: scale(1); } } }` — a lub-dub, not a balloon.
- [x] **Step 3: Verify** — render `<HeartFigure />` temporarily on `/` (or Storybook-style scratch route `/heart-care` stub), screenshot: four chambers legible, LV wall visibly thicker, beat reads as cardiac rhythm. All required ids present (`curl -s localhost:3000/heart-care | grep -o 'hf-[a-z]*' | sort -u`).
- [x] **Step 4: Commit** — `feat: anatomical heart SVG figure with animation hooks`

### Task 14: Route, hero, chapter rail

**Files:**
- Create: `src/app/heart-care/page.tsx`, `src/components/heart/heart-hero.tsx` (client), `src/components/heart/chapter-rail.tsx` (client)
- Modify: `src/content/site-data.ts` (navItems)

**Interfaces:** `page.tsx` composes: `<HeartHero />` then one `<section id={chapter.id}>` per chapter (bodies from Tasks 15–19), with `<ChapterRail />` fixed at viewport left (desktop only). Metadata: `title: "Heart Care — a complete, plain-language guide"`, description ~150 chars, plus `MedicalWebPage` JSON-LD (`about: { "@type": "MedicalCondition", name: "Cardiovascular health" }`, `lastReviewed` date, `reviewedBy` omitted until a named clinician signs off).

- [x] **Step 1: Hero.** Navy full-viewport (`min-height: 92vh`). Left: eyebrow `"The Rise heart guide"`, h1 `"Know the engine.<br/><em>Own the journey.</em>"`, standfirst: "Everything we wish every patient knew about the heart — how it works, what goes wrong, which signs matter, and what to do next. Twenty minutes, plain language, no jargon." Chips: `8 chapters`, `Doctor-reviewed`, `Telugu · English · Hindi support`. CTA pair: coral `Start reading ↓` (anchors `#how-it-works`), ghost `Book a heart check`. Right: `<HeartFigure />` with idle beat + the site's `HeroEcg` line drawing across behind it (reuse the exact intro pattern from `home-hero.tsx` **including the 4s failsafe from Task 5**).
- [x] **Step 2: ChapterRail.** Fixed left rail (desktop ≥1100px): a vertical hairline, one dot + `01`-style number per chapter from `chapters`. IntersectionObserver marks the active chapter (`.rail-on`: dot fills coral, number ink→navy, title fades in beside it). Click scrolls to the section. Mobile: rail becomes a sticky-top horizontal scroller of chapter pills under the header.
- [x] **Step 3: Nav.** `navItems`: insert `{ href: "/heart-care", label: "Heart care" }` after About; remove `{ href: "/", label: "Home" }` (brand mark already goes home) so the bar stays at 6 items.
- [x] **Step 4: Verify** — `/heart-care` renders hero + 8 empty-but-titled sections; rail tracks scroll and clicks jump correctly; mobile pills scroll; `curl -s localhost:3000/heart-care | grep MedicalWebPage` hits. Typecheck clean.
- [x] **Step 5: Commit** — `feat: heart-care route, hero, chapter rail, nav entry`

### Task 15: Chapter 01 — blood-flow scrolly (the set-piece)

**Files:**
- Create: `src/components/heart/heart-flow-scrolly.tsx` (client)

**Interfaces:** Consumes `flowSteps` from heart-guide and `<HeartFigure />`. Pattern-clone of `eecp-scrolly.tsx` (pin + scrub + stepped copy) — same class conventions (`.s-step`, progress bar) so CSS is shared where possible.

- [x] **Step 1: Build the timeline.** Pinned stage (`start: "top top", end: "+=380%", scrub: 0.7`), four labeled beats mapping to `flowSteps`:
  - **Beat 1 "in":** `#lane-in` particles (blue-venous fill) travel via `motionPath` into RA→RV; `#hf-ra` then `#hf-rv` fill-opacity pulses to .45; labels `Right atrium`, `Right ventricle`, `Vena cava` fade in.
  - **Beat 2 "lungs":** particles ride `#lane-lungs` to the lung lobes; mid-path each particle cross-fades fill `var(--blue-venous)` → `var(--coral)` (the oxygen moment — stagger it so the color change reads); lungs pulse mint; label `Pulmonary artery — the only artery carrying oxygen-poor blood`.
  - **Beat 3 "return":** coral particles ride `#lane-return` into LA→LV; `#hf-lv` double-wall highlights (stroke-width tween 1.5→3); labels `Left atrium`, `Left ventricle — the strongest chamber`.
  - **Beat 4 "out":** LV contracts (scale .96 on `#hf-lv`, transform-origin center), particles fire along `#lane-out` through the aorta and off-canvas with a trailing opacity fade; all 4 `.hf-valve` marks flash coral in sequence; closing label `The aorta — and everywhere else`. End state: full figure labeled, both colors flowing on a gentle infinite loop (`repeat: -1` mini-timeline started on scrolly complete).
- [x] **Step 2: Reduced-motion / mobile fallback:** no pin; the four steps render as a vertical sequence, each step showing a static `<HeartFigure />` variant with that beat's chambers/lanes pre-highlighted via a `data-beat="1..4"` class that CSS paints (fills at final opacity, labels visible). Same information, zero motion.
- [x] **Step 3: Verify** — scroll through: particles visibly change blue→coral at the lungs (the single most important visual fact on the page); each beat's copy card swaps in sync; reduced-motion shows 4 static labeled figures; no dropped frames in DevTools performance (transforms only, no layout properties tweened).
- [x] **Step 4: Commit** — `feat: blood-flow scrollytelling chapter`

### Task 16: Chapter 02 — vitals dials

**Files:**
- Create: `src/components/heart/vitals-dials.tsx` (client)

- [x] **Step 1:** Grid of 4 cards from `vitals`. Each card: an SVG arc gauge (270° track, `stroke-dasharray` fill animated on first intersection — IntersectionObserver, GSAP `drawSVG`-style via dashoffset, 1.1s `--ease-inout`), the big reading in Fraunces (`120/80`), unit small, then the three bands as stacked pills colored by tone (`good`→mint-deep, `watch`→gold, `act`→coral) and the note in `.note-strip` style. Section heading: eyebrow `"Chapter 02"`, h2 `"Four numbers,<br/><em>one dashboard."`
- [x] **Step 2:** Counter tick-up on the reading (reuse the exact counter approach from `home-hero.tsx` stats), skipped under reduced motion (values render statically — they're in the SSR HTML regardless).
- [x] **Step 3: Verify** — dials sweep once when scrolled into view, never re-trigger; tones read correctly; static + complete with JS disabled (`curl -s localhost:3000/heart-care | grep "120/80"` hits). Commit — `feat: vitals dial chapter`

### Task 17: Chapter 03 — artery narrowing scrolly

**Files:**
- Create: `src/components/heart/artery-scrolly.tsx` (client)

- [x] **Step 1: The artery figure.** Horizontal SVG (`viewBox 0 0 900 300`): an artery in long-section — two navy wall lines, lumen between. Layers: `#ar-plaque-top`, `#ar-plaque-bot` (soft gold-to-coral blobs anchored to each wall, `scaleY` 0 at start, transform-origin at the wall), 8 `.ar-cell` coral circles riding an invisible centre lane on `motionPath` in a continuous loop, `#ar-clot` (coral-dark irregular blob, opacity 0), three `.ar-caption` texts.
- [x] **Step 2: Timeline** (pin, `+=300%`, scrub): **Beat 1 — "Years of quiet build-up":** plaque `scaleY` 0→.55, cell loop duration tweens 4s→7s (visibly slower traffic) and cells begin single-file. **Beat 2 — "Angina — demand outruns supply":** a "demand" pulse (background ECG quickens); lumen squeeze to .3; cells bunch upstream (stagger their progress offsets); caption: exertion pain, eases at rest. **Beat 3 — "The emergency":** `#ar-clot` pops to opacity 1 filling the gap, cell loop pauses (timeScale→0), downstream wall section desaturates to grey, caption in coral: "A clot completes the block — this is a heart attack. Minutes matter now." Final card under the stage links Chapter 05 (`Warning signs ↓`).
- [x] **Step 3: Fallback:** three static stacked frames (healthy / narrowed / blocked) painted by `data-beat` classes, reduced-motion + mobile.
- [x] **Step 4: Verify** — the slowdown between beat 0→1 is visible; blockage state clearly grey downstream; captions match beats; fallback frames legible at 375px. Commit — `feat: artery narrowing scrollytelling chapter`

### Task 18: Chapters 04–05 — conditions guide + triage

**Files:**
- Create: `src/components/heart/conditions-guide.tsx` (client — accordion), `src/components/heart/triage-signs.tsx` (server)

- [x] **Step 1: Conditions.** From `conditions`: an accordion list (one open at a time — controlled state, not `<details>`, so open/close animates height via GSAP `auto` tween). Row: `01`-style number, name in serif, one-line `what` always visible. Expanded: three labeled columns — `Feels like` / `Red flag` (coral left-border) / `First step at Rise` (mint panel, links `/appointment` or `/diagnostics` contextually — heart attack row links nothing but renders the emergency copy in coral weight). Heading: `"Eight conditions,<br/><em>without the jargon."` Close with `.note-strip`: "General information, not diagnosis. Symptoms overlap — a doctor puts them in your context."
- [x] **Step 2: Triage.** Two-panel section, ink background. Left panel (coral border-top 4px, pulsing `.pulse-icon`): eyebrow `"Act now — emergency"`, list `emergencySigns`, footer button `tel:108` styled `button-coral` full-width: `"Call 108 now"` plus line "…or reach the nearest emergency room. Do not drive yourself." Right panel (mint border-top): eyebrow `"Book a planned review"`, `plannedSigns`, footer buttons → `/appointment` + clinic tel. Panels `Reveal variant="blur"`. This section also renders **before** Chapter 04 in the rail order? No — keep guide order (05), but the artery chapter's closing link (Task 17) jumps here.
- [x] **Step 3: Verify** — accordion animates smoothly, one open at a time, all 8 conditions present; emergency panel: tel link dials 108; keyboard: accordion rows are `<button>`s, focus visible. Commit — `feat: conditions accordion + emergency/planned triage`

### Task 19: Chapters 06–08 + closer + FAQ

**Files:**
- Create: `src/components/heart/protect-tests-treat.tsx` (server) — three sections + closer in one file (they're simple compositions)
- Modify: `src/app/heart-care/page.tsx` (FAQ schema)

- [x] **Step 1: Protect (06).** Mint section, 6 `protectHabits` as the numbered `value-list` pattern (2×3). Heading `"Six habits.<br/><em>Zero prescriptions."` Sub-line links `/health-packages` ("Know your numbers" → Comprehensive Heart Check).
- [x] **Step 2: Tests (07).** From `heartTests`: 5 rows in the `camp-row` layout style — name (serif) + `sees`, then `when`, then a meta column with `feels` and a `time` chip. Footer CtaStrip variant → `/diagnostics`.
- [x] **Step 3: Treatment (08).** Three-stage stepper: `Medicines` ("Statins quiet the plaque, BP tablets drop the workload, antiplatelets keep blood slippery — unglamorous, life-extending"), `Procedures` ("Angioplasty props a narrowed artery open; bypass builds a detour around it — the right call when anatomy demands it"), `EECP — the third option` (coral-accent card, 2× width: one-paragraph pitch + chips reused from home + button `Explore EECP therapy` → `/eecp-therapy`). This is the page's conversion moment — the whole guide funnels here and to the closer.
- [x] **Step 4: Closer.** Ink section, `HeroEcg`, h2 `"Twenty minutes of reading.<br/><em>One conversation to act on it."` — buttons: `Book a heart check` (coral → `/appointment`), `Call {contact.phone}` (ghost). Then `heartFaqs` as `<details>` list (EECP FAQ styles) + `FAQPage` JSON-LD in `page.tsx` built from `heartFaqs`.
- [x] **Step 5: Verify** — full page scroll top-to-bottom reads as one narrative; every chapter link in the rail lands correctly; FAQ schema present exactly once; typecheck clean.
- [x] **Step 6: Commit** — `feat: protect/tests/treatment chapters, closer, FAQ schema`

### Task 20: Heart page — mobile, reduced-motion, performance hardening

**Files:**
- Modify: all `src/components/heart/*`, `src/app/globals.css`

- [x] **Step 1: Mobile sweep at 375×812 and 768×1024** — pinned scrollies disable below 900px (use `gsap.matchMedia` width conditions: `"(min-width: 900px) and (prefers-reduced-motion: no-preference)"`) and render their static stepped fallbacks; rail pills sticky without covering content; hero heart scales to ~78vw.
- [x] **Step 2: Reduced-motion sweep** — OS setting on: zero pins, zero particles, all content legible, idle heartbeat stops.
- [x] **Step 3: Perf** — Lighthouse on `/heart-care` (mobile): Performance ≥ 90, CLS < 0.05 (pinned sections reserve height via fixed `min-height` on stage), no long tasks > 200ms during scroll, page JS payload delta from GSAP already-paid (no new deps confirmed via `npm ls --depth=0`).
- [x] **Step 4: Commit** — `fix: heart page responsive, reduced-motion, perf hardening`

### Task 21: Weave heart care into the site

**Files:**
- Modify: `src/app/page.tsx`, `src/app/[slug]/page.tsx` (services body + eecp cross-links), `src/content/site-data.ts` (posts cross-link), `src/components/site-footer.tsx` (done in Task 8 — verify)

- [ ] **Step 1: Home feature.** After `HomePathways`, insert a heart-guide teaser band (paper, hairline top): small `<HeartFigure />` (idle beat) left; right: eyebrow `"New — the Rise heart guide"`, h2 `"Your heart,<br/><em>fully explained."`, one line, `text-link` → `/heart-care`.
- [ ] **Step 2: Cross-links.** EECP page "Who it helps" section gains a lead-in line linking the guide's conditions chapter (`/heart-care#conditions`); blog posts `understanding-eecp`, `chest-pain-when-to-worry`, `blood-pressure-basics` each get a takeaway linking `/heart-care`; services page Cardiology dept card links it.
- [ ] **Step 3: Verify** — `/heart-care` reachable from: nav, footer, home teaser, EECP page, 3 posts, services. (Seven inbound paths — flagship treatment.) Commit — `feat: heart guide integrated across site`

---

# Phase 3 — QA & definition of done

### Task 22: Full-site QA sweep

- [ ] **Step 1: Route sweep** — every route from the sitemap returns 200; `/nonexistent` 404s.
- [ ] **Step 2: Lighthouse (mobile emulation)** on `/`, `/heart-care`, `/eecp-therapy`, `/appointment`: Performance ≥ 90, Accessibility ≥ 95, SEO ≥ 95 each. Fix regressions before proceeding.
- [ ] **Step 3: A11y manual pass** — keyboard-only walk of header, doctors filter, conditions accordion, form; focus always visible; `axe` DevTools zero critical issues.
- [ ] **Step 4: The 10/10 visual checklist, per page** (screenshot each at 1280 + 375 and check):
  - Fraunces/Instrument rendering (no Georgia anywhere — computed styles)
  - dark sections show grain + ambient glow
  - identical card hover physics site-wide
  - heading mask reveals firing
  - no orphaned single word in any h1/h2 at 375px
  - every CTA arrow nudges on hover
  - images share the unified grade
- [ ] **Step 5: Content truth audit** — grep for the removed claims: `grep -rn "Shared with patient consent\|Request received" src/` → zero hits; doctors/testimonials/gallery disclaimers present; every medical chapter ends in consult-a-doctor framing.
- [ ] **Step 6: Commit** — `chore: QA sweep fixes` and tag the branch state.

---

## Self-review notes

- **Spec coverage:** visual 10/10 → Tasks 6–11 + 22; trust repairs → 1–5; heart page with heart anatomy explained (13–15), conditions (18), "when to / how to" guidance (16, 18 triage, 19 protect/tests/treatment) → covered; full animations → 13–17 with mandated fallbacks.
- **Type consistency:** `chapters/flowSteps/vitals/conditions/emergencySigns/plannedSigns/heartTests/protectHabits/heartFaqs` defined once in Task 12; Tasks 14–19 consume those exact names. `HeartFigure` ids defined in Task 13 Interfaces; Tasks 15 targets only those ids.
- **Known deferred items (explicitly out of scope):** real backend for the appointment form (WhatsApp handoff is the honest interim), real photography (shot list delivered), verified doctor roster + restored physician schema (blocked on clinic data), Telugu/Hindi versions of the heart guide (worth a follow-up plan with the myauthor agent).
