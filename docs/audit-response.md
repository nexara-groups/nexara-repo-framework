# Audit Response — Rise Medical Hub

**Re:** Pre-Launch Website Audit (V1.0, 12 July 2026)
**Date:** 14 July 2026 · **Branch:** `codex/rise-medical-hub` · **Commit:** b35a38c

A short record of what we acted on from the audit, what we found to be inaccurate, and what is deliberately deferred. Each audit finding was verified against the actual code before action — not taken at face value.

> **Scope note:** verification was done against current code, which has moved on considerably from the staging snapshot the audit reviewed. A few audit findings were already out of date at audit time.

---

## 1. Fixed

| # | Audit finding | What we did |
|---|---|---|
| 1 | The broken `"...with clarity."` fragment appended after a complete sentence on Diagnostics, Pharmacy & OPD | Root cause was one shared template that bolted a fixed `with clarity.` line onto every service headline. Replaced with a distinct, grammatical two-line heading per service — Diagnostics → "Clear answers, / same day.", Pharmacy → "Medicines you / can trust.", OPD → "Consultations with / room to talk." Each page now has a unique H1/H2. |
| 2 | The `"What to expect"` block was byte-identical on Diagnostics and OPD | The block was hardcoded once and reused. It now takes its copy per page: Diagnostics describes the test experience; OPD describes the consultation experience. No shared text remains. |
| 3–4 | Same hero photos (`diagnostics.webp`, `pharmacy.webp`, `opd-consultation.webp`, `rise-medical-hero.webp`) reused across multiple pages | The five shared raster images were removed and replaced with self-contained, page-specific SVG art (new `SiteArt` component + `PageHero art` prop). Image duplication across pages is eliminated, and alt-text reuse goes with it. |

*Verified live at `nexara-foundation.noisy-sun-dae4.workers.dev` — the fixes serve correctly in production (HTTP 200, corrected copy present).*

---

## 2. Found inaccurate — no action needed

| Audit finding | Reality in code |
|---|---|
| SEO: "No MedicalOrganization / Physician / FAQPage schema" | Incorrect. A `MedicalClinic` schema (a MedicalOrganization subtype) renders globally via `ClinicSchema` in the root layout, and has been in the codebase since **11 July — before the audit date**. Additional `ld+json` exists on the Heart Care, EECP and Resources pages. (A dedicated *FAQPage* type specifically is still worth adding — see §3.) |
| "Header block rendered twice on every page" | Misdiagnosis. There is a single `<header>`; the apparent "second header" is the standard mobile hamburger menu, hidden by CSS at desktop widths. Not a duplication. |

---

## 3. Valid, but deliberately deferred

These findings are correct and accepted, but are not launch-blockers for this pass — most depend on the facility opening, real assets, or the final production domain.

**Content & trust (await real assets / opening day)**
- Doctor photographs (currently initials), medical-council registration numbers, NABH/NABL accreditation, insurance-partner logos.
- Real testimonials and real facility photography — placeholders are honestly labelled meanwhile.
- Named reviewing doctor + "last updated" date on Heart Care and Resources articles.

**Pages & infrastructure to build before go-live**
- Privacy Policy, Terms, Contact and FAQ pages — required before the appointment form collects real patient data.
- Cookie / consent banner (needed once analytics or marketing pixels are added).
- `FAQPage` structured data specifically (the existing Q&A content already qualifies).

**Homepage enhancements**
- A 3-doctor preview strip (the site's strongest asset is currently one click away).
- Credibility stats in the trust bar ("16 specialists · 11 departments").
- A persistent, sitewide emergency CTA (currently only inside the Heart Care guide).

**Technical passes — do on the final domain/hosting**
- Live Lighthouse / PageSpeed (Core Web Vitals) and WCAG 2.2 AA accessibility audit, with particular attention to the scroll-pinned animations on mid-range Android.
- Confirm canonical tags + Search Console once the production domain is chosen (OG/Twitter metadata already points at `risemedicalhub.com`).

**Phase-two scope**
- A real booking engine (calendar + confirmations). Current flow is a lead-gen form handing off to WhatsApp — appropriate for launch.

---

## 4. Bottom line

The audit's headline concern — duplicated and templated content — was real, confirmed in code, and is now resolved at its source (two shared components + image assets). Two of its findings were inaccurate. Everything else is valid and tracked above as a pre-launch punch list rather than an emergency fix, consistent with the audit's own framing of a staging site.
