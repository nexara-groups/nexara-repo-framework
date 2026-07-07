---
name: cookie-consent
description: Use when adding a cookie consent banner, cookie/privacy consent, GDPR or India DPDP Act compliance, or Google Analytics / gtag Consent Mode to a website — so analytics cookies only load after the visitor agrees.
---

# Cookie Consent + Google Consent Mode

Drop-in, dependency-free cookie consent for any website: a banner + granular preferences modal wired to **Google Consent Mode v2**, so Google Analytics loads in a *consent-denied* state and sets **no `_ga` cookies until the visitor accepts**. Reject/withdraw actively deletes existing GA cookies. Works with plain HTML, or any framework (drop the assets in `public/`).

Assets live beside this file:
- `assets/gtag-consent-mode.html` — the `<head>` snippet (Consent Mode default = denied)
- `assets/consent.js` — banner + modal + consent wiring (vanilla JS)
- `assets/consent.css` — self-contained styling (theme via `--cc-*` variables)
- `references/compliance-notes.md` — DPDP/GDPR checklist + policy-page requirements

## When to use
- Site uses Google Analytics (gtag.js) and needs consent before tracking
- Requirement mentions: cookie banner, cookie consent, GDPR, DPDP Act 2023, "cookies before consent", consent mode, `_ga` cookies, cookie policy
- Any static or framework site that must not set analytics cookies until opt-in

**Not for:** server-set auth/session cookies (those are strictly necessary), or consent platforms you're already paying for (OneTrust, Cookiebot).

## Install (4 steps)

1. **Head snippet** — put the contents of `assets/gtag-consent-mode.html` in `<head>` of every page that has GA. Replace `G-XXXXXXXXXX` with the real Measurement ID. This is the critical bit: `gtag('consent','default', … 'analytics_storage':'denied' …)` MUST run **before** `gtag('config', …)`.
2. **CSS** — copy `assets/consent.css` into your stylesheet (or `<link>` it) on every page.
3. **JS** — load `assets/consent.js` before `</body>` on every page: `<script src="/consent.js" defer></script>`. It injects the banner/modal and shows the banner on first visit.
4. **Withdrawal link** — DPDP/GDPR require withdrawal to be as easy as consent. Add a footer control anywhere: `<button type="button" onclick="openCookiePreferences()">Cookie Preferences</button>`.

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
