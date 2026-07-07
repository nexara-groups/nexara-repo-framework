---
name: cookie-consent
description: Use when adding a cookie consent banner, cookie/privacy consent, GDPR or India DPDP Act compliance, or Google Analytics / gtag Consent Mode to a website — so analytics cookies only load after the visitor agrees.
---

# Cookie Consent + Google Consent Mode

Drop-in, dependency-free cookie consent for any website: a banner + granular preferences modal wired to **Google Consent Mode v2**, so Google Analytics loads in a *consent-denied* state and sets **no `_ga` cookies until the visitor accepts**. Reject/withdraw actively deletes existing GA cookies.

The **logic, UX pattern, and compliance** are universal (all sites). Two interchangeable implementations share the same `cc-*` CSS and `cc-consent` storage key — pick by stack:

| Your site | Use |
|-----------|-----|
| Static HTML / multi-page / no framework | **Vanilla** — `assets/` |
| React / Next.js / (adapt for Vue etc.) | **Component** — `react/` |

Assets beside this file:
- `assets/gtag-consent-mode.html` — `<head>` snippet (Consent Mode default = denied), plain HTML
- `assets/consent.js` — banner + modal + wiring, vanilla JS
- `assets/consent.css` — self-contained styling, theme via `--cc-*` variables (**used by both variants**)
- `react/CookieConsent.tsx` — React/Next.js banner + modal component
- `react/GoogleAnalytics.tsx` — Next.js GA4 + Consent Mode wiring (`next/script`)
- `references/compliance-notes.md` — DPDP/GDPR checklist + policy-page requirements

## When to use
- Site uses Google Analytics (gtag.js) and needs consent before tracking
- Requirement mentions: cookie banner, cookie consent, GDPR, DPDP Act 2023, "cookies before consent", consent mode, `_ga` cookies, cookie policy
- Any static or framework site that must not set analytics cookies until opt-in

**Not for:** server-set auth/session cookies (those are strictly necessary), or consent platforms you're already paying for (OneTrust, Cookiebot).

## Install — vanilla (static HTML)

1. **Head snippet** — put `assets/gtag-consent-mode.html` in `<head>` of every GA page. Replace `G-XXXXXXXXXX` with the real Measurement ID. Critical: `gtag('consent','default', … 'analytics_storage':'denied' …)` MUST run **before** `gtag('config', …)`.
2. **CSS** — copy/`<link>` `assets/consent.css` on every page.
3. **JS** — load `assets/consent.js` before `</body>`: `<script src="/consent.js" defer></script>`. It injects the banner/modal and shows it on first visit.
4. **Withdrawal link** — add a footer control: `<button type="button" onclick="openCookiePreferences()">Cookie Preferences</button>`.

## Install — React / Next.js (App Router)

1. Copy `react/CookieConsent.tsx` and `react/GoogleAnalytics.tsx` into your components, and `assets/consent.css` into your styles (`import` it in the layout).
2. In `app/layout.tsx`: `<GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID!} />` (loads the Consent Mode default before GA) and `<CookieConsent />` inside `<body>`.
3. **Withdrawal link:** `import { openCookiePreferences } from '@/components/CookieConsent'` → `<button onClick={openCookiePreferences}>Cookie Preferences</button>`.

Both variants persist to the same `localStorage['cc-consent']` and require a **Privacy Policy** + **Cookie Policy** page (see `references/compliance-notes.md`).

## How it works (verify these)
- Before consent: **zero `_ga*` cookies** (`document.cookie` is empty of them). Confirm in DevTools → Application → Cookies.
- Accept → `_ga` + `_ga_<id>` appear; choice saved to `localStorage['cc-consent']`.
- Reject / toggle-off + save → GA cookies deleted, `analytics_storage: denied`.
- Consent persists across pages/visits via the head snippet re-reading `localStorage`.

## Customize
- **Theme:** override `--cc-*` custom properties (`--cc-accent`, `--cc-bg`, `--cc-card-bg`, `--cc-radius`, …) at the top of `consent.css` to match the brand.
- **Copy & links:** edit the `CONFIG` object at the top of `consent.js` (`storeKey`, `privacyUrl`, `cookieUrl`, `analyticsLabel`).
- **More categories** (ads, marketing): add another `.cc-row` + toggle in `consent.js`, store its boolean in the record, and call `gtag('consent','update', { ad_storage: … })` in `save()`.

## Common mistakes
- Consent default placed **after** `gtag('config')` → cookies fire before consent. It must come first.
- Forgetting the head snippet on some pages → GA runs unconsented there.
- Treating this as full compliance: you still need a **Privacy Policy** and **Cookie Policy** page, and (for DPDP) a named **Grievance Officer**. See `references/compliance-notes.md`.
- The generated policy/consent text is a template, not legal advice — have it reviewed for the target jurisdiction.
