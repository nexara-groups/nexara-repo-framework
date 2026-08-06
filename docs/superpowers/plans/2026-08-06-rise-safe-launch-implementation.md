# Rise Medical Hub Safe-Launch Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the approved Rise Medical Hub experience into a safe, testable, data-governed public site while preserving reusable draft content and an immutable rollback point.

**Architecture:** Add a publication layer that becomes the only source for public routes, content selectors, metadata, schema, and sitemap output. Add a canonical patient-need taxonomy and pure booking-context functions, then keep appointment submission as an explicit, failure-safe WhatsApp handoff. Make focused homepage, accessibility, medical-copy, SEO, and Cloudflare changes without replacing the visual system.

**Tech Stack:** Next.js 15.5.18 App Router, React 19.1, TypeScript 5.6, GSAP, Vitest 4, Testing Library, ESLint 9, OpenNext for Cloudflare.

## Global Constraints

- Work only from the implementation branch derived from backup commit `d655e4d3013013ee1be4d77560f99e313869c4ac`.
- Never deploy or change external services.
- Never invent or strengthen a medical, legal, clinician, schedule, licence, accreditation, fee, availability, outcome, or consent claim.
- Keep illustrative testimonials and unverified clinic records as typed draft data; do not expose them through public routes, navigation, metadata, schema, sitemap, or rendered copy.
- Delete `/heart-care-compare`, `heart-care-alternative.tsx`, and their dedicated `.hc-alt*` CSS completely.
- Preserve the current visual identity and Heart Guide/EECP interactions unless safety, accessibility, clarity, or performance requires a change.
- Follow red-green-refactor for behavioural changes and make focused commits.
- Future publication of verified testimonials, clinicians, schedules, packages, and reviewer records must be a data/state change rather than component reconstruction.

## File responsibility map

### New source files

- `src/content/publication.ts` — publication, review, and verified-field types plus selectors.
- `src/content/site-routes.ts` — canonical route registry, metadata source, and catch-all visibility.
- `src/content/care-taxonomy.ts` — stable patient needs, care areas, sources, and relationship selectors.
- `src/content/safety.ts` — emergency and routine-contact contracts.
- `src/lib/appointment.ts` — context parsing, URL building, phone/date validation, and message construction.
- `src/lib/seo.ts` and `src/lib/schema.ts` — pure metadata and structured-data builders.
- `src/lib/navigation.ts` — current-path matching.
- `src/components/care-need-router.tsx` — reusable need-first router.
- `src/components/emergency-routine-notice.tsx` — consistent emergency/routine presentation.
- `src/components/main-content.tsx` and `src/components/skip-link.tsx` — bypass-navigation contract.
- `src/components/appointment-page-content.tsx` and `src/app/appointment/page.tsx` — query-aware booking route.
- `src/app/privacy/page.tsx`, `src/app/terms/page.tsx`, and `src/app/medical-information/page.tsx` — policy routes.
- `docs/privacy-owner-review.md` — concrete owner/legal-review checklist kept outside public copy.
- `eslint.config.mjs`, `vitest.config.ts`, and `src/test/setup.ts` — quality gates.

### Existing responsibilities retained

- `src/content/site-data.ts` retains all authored records and gains publication/field-verification data.
- `src/app/[slug]/page.tsx` remains the shared presentation layer for simple catch-all content but no longer owns appointment query handling.
- Existing homepage, Heart Guide, EECP, services, and art components remain the design system.
- `src/app/globals.css` remains the single style layer; changes are token- and component-scoped.

---

### Task 1: Add deterministic test and lint gates

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Create: `eslint.config.mjs`
- Create: `vitest.config.ts`
- Create: `src/test/setup.ts`
- Create: `src/test/harness.test.tsx`

**Interfaces:**
- Produces: `npm test`, `npm run lint`, `npm run verify`, jsdom component tests, and `@/` alias resolution.

- [ ] **Step 1: Record the failing baseline**

```bash
npm test
npm run lint
```

Expected: missing test script and deprecated interactive `next lint` failure.

- [ ] **Step 2: Install quality dependencies**

```bash
npm install --save-dev eslint@^9.39.1 eslint-config-next@15.5.18 @eslint/eslintrc@^3.3.1 vitest@4.1.10 jsdom@^26.1.0 @testing-library/react@^16.3.0 @testing-library/jest-dom@^6.9.1 @testing-library/user-event@^14.6.1
```

- [ ] **Step 3: Add scripts and flat ESLint configuration**

Use these scripts:

```json
{
  "lint": "eslint . --max-warnings=0",
  "test": "vitest run",
  "test:watch": "vitest",
  "typecheck": "tsc --noEmit",
  "verify": "npm run typecheck && npm run lint && npm test"
}
```

Create `eslint.config.mjs`:

```js
import { FlatCompat } from "@eslint/eslintrc";
import { fileURLToPath } from "node:url";

const baseDirectory = fileURLToPath(new URL(".", import.meta.url));
const compat = new FlatCompat({ baseDirectory });

export default [
  { ignores: [".next/**", ".open-next/**", "node_modules/**", "outputs/**", "coverage/**"] },
  ...compat.config({ extends: ["next/core-web-vitals", "next/typescript"] }),
];
```

- [ ] **Step 4: Add Vitest setup and a DOM smoke test**

```ts
// vitest.config.ts
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  esbuild: { jsx: "automatic" },
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  test: { environment: "jsdom", setupFiles: ["./src/test/setup.ts"], restoreMocks: true },
});
```

```ts
// src/test/setup.ts
import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";
afterEach(() => cleanup());
```

```tsx
// src/test/harness.test.tsx
import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";

it("runs DOM assertions under jsdom", () => {
  render(<button type="button">Safe launch</button>);
  expect(screen.getByRole("button", { name: "Safe launch" })).toBeVisible();
});
```

- [ ] **Step 5: Make current source pass lint without hiding actionable errors**

Run `npm run lint`, fix reported errors, and rerun until exit 0. Do not disable rules globally.

- [ ] **Step 6: Verify and commit**

```bash
npm test
npm run lint
npm run typecheck
git add package.json package-lock.json eslint.config.mjs vitest.config.ts src/test
git commit -m "Add deterministic test and lint gates"
```

---

### Task 2: Create publication governance and route visibility

**Files:**
- Create: `src/content/publication.ts`
- Create: `src/content/publication.test.ts`
- Create: `src/content/site-routes.ts`
- Create: `src/content/site-routes.test.ts`
- Modify: `src/content/site-data.ts`
- Modify: `src/app/[slug]/page.tsx`
- Modify: `src/app/sitemap.ts`
- Modify: `src/components/site-footer.tsx`

**Interfaces:**
- Produces: `PublicationState`, `Verification`, `MedicalReview`, `isPublished`, `publishedOnly`, `getPublicReview`, public content arrays, and route-registry selectors.

- [ ] **Step 1: Write failing publication tests**

```ts
expect(isPublished({ state: "published" })).toBe(true);
expect(isPublished({ state: "draft" })).toBe(false);
expect(isPublished({ state: "awaiting-verification" })).toBe(false);
expect(publishedOnly(records).map((item) => item.id)).toEqual(["first", "third"]);
expect(records).toEqual(originalRecords);
expect(getPublicReview(undefined)).toBeNull();
expect(getPublicReview(awaitingReview)).toBeNull();
expect(getPublicReview(namedPublishedReview)?.reviewerName).toBe("Dr. Asha Rao");
```

Run `npm test -- src/content/publication.test.ts` and expect module-not-found failure.

- [ ] **Step 2: Implement the pure governance contract**

```ts
export type PublicationState = "draft" | "awaiting-verification" | "published";
export type Verification = {
  state: PublicationState;
  verifiedAt?: string;
  verifiedBy?: string;
  sourceNote?: string;
};
export type GovernedRecord = { publication: Verification };
export type MedicalReview = {
  reviewerName: string;
  reviewerRole?: string;
  reviewedAt: string;
  publication: Verification;
};
export const isPublished = (verification: Verification) => verification.state === "published";
export const publishedOnly = <T extends GovernedRecord>(records: readonly T[]) =>
  records.filter((record) => isPublished(record.publication));
export const getPublicReview = (review?: MedicalReview | null) =>
  review && isPublished(review.publication) ? review : null;
```

- [ ] **Step 3: Govern existing content without deleting draft values**

Extend doctors, laboratory categories, packages, programmes, pharmacy points, schedules, testimonials, and posts with `publication: Verification`; add `review?: MedicalReview` to posts.

Use these initial states:

```ts
// Published educational posts retain sources but have no review object.
publication: { state: "published", sourceNote: "Evidence-linked public education" }

// Illustrative testimonials never render publicly.
publication: { state: "draft", sourceNote: "Consented patient words required before publication" }

// Exact operational and roster claims wait for clinic confirmation.
publication: { state: "awaiting-verification", sourceNote: "Clinic confirmation required before public use" }
```

Export `publishedDoctors`, `publishedLabCategories`, `publishedHealthPackages`, `publishedCommunityPrograms`, `publishedPharmacyPoints`, `publishedOpdTimings`, `publishedTestimonials`, and `publishedPosts` through `publishedOnly`.

- [ ] **Step 4: Write failing route-registry tests**

```ts
expect(getPublishedSiteRoute("testimonials")).toBeUndefined();
expect(getPublishedCatchAllParams()).not.toContainEqual({ slug: "testimonials" });
expect(getPublishedSiteRoutes().map((route) => route.href)).not.toContain("/testimonials");
```

Pass one published testimonial into the pure registry selector and assert that `/testimonials` reappears without component changes.

- [ ] **Step 5: Implement one route registry**

```ts
export type SiteRoute = {
  slug: string;
  href: `/${string}` | "/";
  title: string;
  description: string;
  catchAll: boolean;
  contentGate?: "published-testimonial";
  sitemap: { changeFrequency: "monthly" | "yearly"; priority: number };
};

export function getPublishedSiteRoutes(
  testimonialRecords = publishedTestimonials,
): readonly SiteRoute[];

export function getPublishedSiteRoute(
  slug: string,
  testimonialRecords = publishedTestimonials,
): SiteRoute | undefined;
```

Include every catch-all page plus dedicated `/heart-care`, `/appointment`, `/privacy`, `/terms`, and `/medical-information`. The testimonial route uses the content gate.

- [ ] **Step 6: Wire catch-all routing, footer, and sitemap**

- Replace local slug/metadata publication decisions with the registry.
- Keep `TestimonialsBody` and draft data reusable, but call `notFound()` while gated.
- Hide the footer Patient stories link while unpublished.
- Generate sitemap URLs from governed routes and `publishedPosts` only.

- [ ] **Step 7: Verify and commit**

```bash
npm test -- src/content/publication.test.ts src/content/site-routes.test.ts
npm run typecheck
git add src/content/publication.ts src/content/publication.test.ts src/content/site-routes.ts src/content/site-routes.test.ts src/content/site-data.ts 'src/app/[slug]/page.tsx' src/app/sitemap.ts src/components/site-footer.tsx
git commit -m "Add governed public content and routes"
```

---

### Task 3: Remove prototype content and make medical publishing truthful

**Files:**
- Create: `src/lib/seo.ts`
- Create: `src/lib/seo.test.ts`
- Create: `src/lib/schema.ts`
- Create: `src/lib/schema.test.ts`
- Create: `src/test/repository-contracts.test.ts`
- Modify: `src/app/resources/[post]/page.tsx`
- Modify: `src/components/resources-page.tsx`
- Modify: `src/components/clinic-schema.tsx`
- Modify: `src/app/heart-care/page.tsx`
- Modify: `src/content/site-data.ts`
- Modify: `src/content/heart-guide.ts`
- Modify: `src/app/globals.css`
- Modify: `docs/heart-care-plan.md`
- Delete: `src/app/heart-care-compare/page.tsx`
- Delete: `src/components/heart/heart-care-alternative.tsx`

**Interfaces:**
- Produces: `buildRouteMetadata`, `buildPostMetadata`, `buildMedicalWebPageSchema`, and `buildClinicSchema`.

- [ ] **Step 1: Write failing metadata/schema tests**

```ts
expect(buildPostMetadata(post).alternates?.canonical).toBe(`/resources/${post.slug}`);
expect(buildMedicalWebPageSchema(post)).not.toHaveProperty("reviewedBy");
expect(buildMedicalWebPageSchema(reviewedPost)).toMatchObject({
  reviewedBy: { "@type": "Person", name: "Dr. Asha Rao" },
});
expect(buildClinicSchema(unverifiedClinic)).not.toHaveProperty("telephone");
```

Assert that every published route has a canonical and unpublished posts produce no params, cards, related items, schema, or sitemap entry.

- [ ] **Step 2: Implement truthful metadata and schema builders**

MedicalWebPage schema always includes headline, description, URL, publisher, and publication date. It includes `dateModified` and `reviewedBy` only from a named published review. Resource UI renders `Reviewed <date>` only with that review; otherwise it renders `Published <date>`.

Model clinic schema inputs explicitly:

```ts
export type GovernedValue<T> = { value: T; publication: Verification };
export type ClinicProfile = {
  name: GovernedValue<string>;
  url: GovernedValue<string>;
  telephone: GovernedValue<string>;
  address: GovernedValue<{
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: "IN";
  }>;
  areaServed: GovernedValue<string>;
  medicalSpecialty: GovernedValue<readonly string[]>;
};
```

Brand name, URL, and area served can remain published. Keep telephone, address, and specialties out of JSON-LD until owner confirmation; their existing visible contact use remains conservative and loses all unverified 24-hour language.

- [ ] **Step 3: Correct known medical-copy contradictions**

- EECP resource: use selected refractory-angina wording where symptoms persist despite guideline-directed therapy and no suitable revascularisation option remains.
- Heart FAQ: recommend risk-based BP, glucose, and cholesterol assessment; do not recommend routine ECG screening for every asymptomatic adult by 35.
- Heart-failure guide: remove the broad claim that EECP generally helps heart failure.
- Walking article: replace “side-effect list of zero” with low-risk-for-many wording and symptom/condition caveats.
- Keep health packages non-public until their ECG/package claims receive clinical review.

- [ ] **Step 4: Write the failing prototype-removal contract**

Assert that active `src/`, `globals.css`, and `docs/heart-care-plan.md` contain none of:

```ts
["heart-care-compare", "heart-care-alternative", ".hc-alt"]
```

- [ ] **Step 5: Delete the prototype footprint**

Delete the comparison route/component, remove the full `.hc-alt*` CSS block, and record its pre-launch removal in `docs/heart-care-plan.md`. Historical committed plans/specifications remain outside the active-source contract scan.

- [ ] **Step 6: Verify and commit**

```bash
npm test -- src/lib/seo.test.ts src/lib/schema.test.ts src/test/repository-contracts.test.ts
npm run typecheck
npm run build
git add -A
git commit -m "Remove prototype content and correct medical publishing"
```

---

### Task 4: Add privacy, medical-information, terms, and emergency routing

**Files:**
- Create: `src/content/safety.ts`
- Create: `src/components/emergency-routine-notice.tsx`
- Create: `src/components/emergency-routine-notice.test.tsx`
- Create: `src/app/privacy/page.tsx`
- Create: `src/app/terms/page.tsx`
- Create: `src/app/medical-information/page.tsx`
- Create: `src/app/privacy/page.test.tsx`
- Create: `docs/privacy-owner-review.md`
- Modify: `src/components/site-header.tsx`
- Modify: `src/components/site-footer.tsx`
- Modify: `src/app/[slug]/page.tsx`
- Modify: `src/app/sitemap.ts`
- Modify: `src/app/globals.css`

**Interfaces:**
- Produces: `safetyRouting` and reusable `EmergencyRoutineNotice` compact/panel variants.
- Consumes: centralized `contact` values.

- [ ] **Step 1: Write failing safety and privacy tests**

```tsx
expect(screen.getByRole("link", { name: /call 108/i })).toHaveAttribute("href", "tel:108");
expect(screen.getByText(/nearest emergency department/i)).toBeVisible();
expect(screen.queryByText(/24hr|around the clock/i)).not.toBeInTheDocument();
```

Privacy tests must find every collected field, purpose, WhatsApp transfer, “nothing reaches Rise until you send,” data-minimisation advice, external processing, and access/correction/deletion contact method.

- [ ] **Step 2: Create the shared safety contract**

```ts
export const safetyRouting = {
  emergency: {
    label: "Emergency symptoms",
    phone: "108",
    phoneHref: "tel:108",
    instruction: "Call 108 or go to the nearest emergency department.",
  },
  routine: {
    label: "Routine appointments and questions",
    phone: contact.phone,
    phoneHref: contact.phoneHref,
    whatsappHref: contact.whatsappHref,
  },
} as const;
```

Compact and panel layouts render the same destinations.

- [ ] **Step 3: Add accurate policy pages**

- `/privacy` describes the current WhatsApp workflow and user rights/contact route without claiming legal review.
- `/medical-information` explains general-information limits, named-review rules, sources, corrections, emergencies, and personal clinical decisions.
- `/terms` covers site use, no appointment guarantee, external services/links, intellectual property, changes, and contact.
- Add canonical metadata, registry/sitemap entries, and footer Trust links.

- [ ] **Step 4: Add the owner review record**

`docs/privacy-owner-review.md` states that owner/legal review is required before deployment and lists exact confirmations: legal entity, data contact, retention/deletion process, WhatsApp account ownership, grievance contact, cancellation policy, and policy effective date.

- [ ] **Step 5: Replace unsafe emergency/routine wording**

- Keep “Emergency · 108”; replace “24hr support” with “Call Rise”.
- Place the shared emergency notice before routine appointment/contact actions.
- Remove “urgent concerns, call us,” “answered around the clock,” and equivalent copy.

- [ ] **Step 6: Verify and commit**

```bash
npm test -- src/components/emergency-routine-notice.test.tsx src/app/privacy/page.test.tsx
npm run typecheck
git add src/content/safety.ts src/components/emergency-routine-notice.tsx src/components/emergency-routine-notice.test.tsx src/app/privacy src/app/terms src/app/medical-information docs/privacy-owner-review.md src/components/site-header.tsx src/components/site-footer.tsx 'src/app/[slug]/page.tsx' src/app/sitemap.ts src/app/globals.css
git commit -m "Add privacy and safe emergency routing"
```

---

### Task 5: Build canonical care and booking-context contracts

**Files:**
- Create: `src/content/care-taxonomy.ts`
- Create: `src/content/care-taxonomy.test.ts`
- Create: `src/lib/appointment.ts`
- Create: `src/lib/appointment.test.ts`
- Modify: `src/content/site-data.ts`

**Interfaces:**
- Produces: `PatientNeed`, `BookingCatalog`, public care selectors, `parseBookingContext`, `appointmentHref`, `buildAppointmentMessage`, `buildWhatsAppHref`, `PHONE_PATTERN`, `isValidAppointmentPhone`, and `clinicDateISO`.

- [ ] **Step 1: Write failing taxonomy tests**

Use these exact stable need IDs:

```ts
[
  "heart-concern",
  "doctor-consultation",
  "test-or-report",
  "medicine-or-refill",
  "preventive-check",
  "not-sure",
]
```

Assert unique IDs, valid service references, deterministic order, public-only options, and the fallback `Availability confirmed when you request a visit.`

- [ ] **Step 2: Implement the canonical need model**

```ts
export type ServiceId = "eecp-therapy" | "diagnostics" | "pharmacy" | "opd";
export type PatientNeed = {
  id: string;
  label: string;
  short: string;
  serviceId: ServiceId;
  publication: Verification;
};
```

Map the six needs to existing service IDs. Acute heart-symptom copy directs emergencies to 108 before routine routing.

- [ ] **Step 3: Write failing appointment-contract tests**

Cover unknown keys, array values, empty/control-character/overlength values, Unicode, deterministic key order, public catalog resolution, consent, omitted empty fields, phone validation, URL encoding, and Asia/Kolkata dates.

```ts
export const BOOKING_CONTEXT_KEYS = ["doctor", "service", "package", "concern", "source"] as const;
export type AppointmentSearchParams = Record<string, string | string[] | undefined>;
```

- [ ] **Step 4: Implement pure booking functions**

Phone acceptance after removing spaces/hyphens is:

```ts
/^(?:\+91)?[6-9]\d{9}$/
```

`buildAppointmentMessage` includes `Consent to contact: Yes`, validated context labels, and never “confirmed” or “appointment received”. `clinicDateISO` formats using `timeZone: "Asia/Kolkata"`.

- [ ] **Step 5: Verify and commit**

```bash
npm test -- src/content/care-taxonomy.test.ts src/lib/appointment.test.ts
npm run typecheck
git add src/content/care-taxonomy.ts src/content/care-taxonomy.test.ts src/lib/appointment.ts src/lib/appointment.test.ts src/content/site-data.ts
git commit -m "Add canonical care and booking contracts"
```

---

### Task 6: Make appointment handoff explicit and failure-safe

**Files:**
- Create: `src/components/appointment-page-content.tsx`
- Create: `src/components/appointment-page-content.test.tsx`
- Create: `src/app/appointment/page.tsx`
- Modify: `src/components/appointment-form.tsx`
- Create: `src/components/appointment-form.test.tsx`
- Modify: `src/app/[slug]/page.tsx`
- Modify: `src/app/globals.css`

**Interfaces:**
- Consumes: validated `BookingContext`, `minimumDate`, safety routing, and appointment helpers.
- Produces: dedicated `/appointment` and `AppointmentForm({ context, minimumDate })`.

- [ ] **Step 1: Write failing component tests**

Cover context display/message, autocomplete, telephone mode/pattern, minimum date, named consent, direct WhatsApp and phone fallbacks, blocked/throwing popup, value preservation, retry, copy/manual-copy, accessible focus/status, and truthful success wording.

- [ ] **Step 2: Implement a persistent handoff state machine**

```ts
type HandoffState =
  | { kind: "idle" }
  | { kind: "blocked"; href: string; message: string }
  | { kind: "opened"; href: string; message: string }
  | { kind: "copied"; href: string; message: string }
  | { kind: "copy-failed"; href: string; message: string };
```

Open synchronously from the user gesture:

```ts
const popup = window.open("", "_blank");
if (!popup) return setHandoff({ kind: "blocked", href, message });
popup.opener = null;
popup.location.href = href;
setHandoff({ kind: "opened", href, message });
```

Catch errors as blocked. Keep the form mounted and focus a `role="status"`, `aria-live="polite"`, `tabIndex={-1}` result region.

- [ ] **Step 3: Add semantic form safeguards**

- Use `autoComplete="name"`, `autoComplete="tel"`, and `autoComplete="email"`.
- Use `inputMode="tel"`, `pattern={PHONE_PATTERN}`, `minLength={10}`, and `maxLength={14}`.
- Apply `min={minimumDate}` to the date input.
- Consent uses `name="consent"`, `value="yes"`, `required`, and links `/privacy`.
- The note asks users not to enter emergency or highly sensitive information.

- [ ] **Step 4: Extract the dedicated appointment route**

The route validates `searchParams` against the public catalog, computes `clinicDateISO(new Date())`, and passes validated selections to `AppointmentPageContent`. Remove appointment handling from `[slug]/page.tsx` and add canonical `/appointment` metadata.

- [ ] **Step 5: Verify and commit**

```bash
npm test -- src/components/appointment-form.test.tsx src/components/appointment-page-content.test.tsx src/lib/appointment.test.ts
npm run typecheck
git add src/components/appointment-form.tsx src/components/appointment-form.test.tsx src/components/appointment-page-content.tsx src/components/appointment-page-content.test.tsx src/app/appointment 'src/app/[slug]/page.tsx' src/app/globals.css
git commit -m "Fix appointment context and WhatsApp recovery"
```

---

### Task 7: Connect patient needs, doctors, services, packages, and EECP

**Files:**
- Create: `src/components/care-need-router.tsx`
- Create: `src/components/care-need-router.test.tsx`
- Modify: `src/components/doctors-directory.tsx`
- Create: `src/components/doctors-directory.test.tsx`
- Modify: `src/app/[slug]/page.tsx`
- Modify: `src/components/care-services-page.tsx`
- Modify: `src/components/eecp-hero.tsx`
- Modify: `src/components/eecp-body.tsx`
- Modify: `src/components/heart/triage-signs.tsx`
- Modify: `src/components/heart/protect-tests-treat.tsx`
- Modify: `src/components/site-header.tsx`
- Modify: `src/components/mobile-menu.tsx`
- Modify: `src/components/site-footer.tsx`
- Modify: `src/content/site-data.ts`
- Create: `src/components/gallery-page.tsx`
- Create: `src/components/gallery-page.test.tsx`

**Interfaces:**
- Consumes: public needs/records and `appointmentHref`.
- Produces: stable need links, deterministic roster, safe availability, and contextual CTAs.

- [ ] **Step 1: Write failing router and doctor tests**

Assert that need links contain `/doctors?concern=<id>`, the router precedes the roster, two renders keep identical doctor order, unverified schedules/credentials are absent, and each public doctor CTA contains its slug/source.

- [ ] **Step 2: Implement the reusable need router**

Render six public needs as real links. The heart card includes the emergency distinction; the not-sure card routes to general consultation.

- [ ] **Step 3: Refactor the doctors experience**

- Remove `shuffled`, `Math.random`, and the private concerns array.
- Render `CareNeedRouter` before the roster.
- Expose `DoctorsDirectory({ records = publishedDoctors, initialConcern })` so tests and future preview tooling can inject governed fixtures without changing public defaults.
- Use public records in deterministic source order.
- If none are published, render a calm confirmation panel with routine contact actions and no draft bios.
- Replace global qualification claims and hard-coded counts with public selector output.
- Accept and validate `searchParams.concern` in the catch-all route, passing only a public need ID to the directory.

- [ ] **Step 4: Wire every high-intent CTA**

Use these source IDs:

```ts
"header" | "footer" | "home" | "home-close" | "doctors" |
"service-page" | "health-packages" | "eecp" | "resources" | "heart-guide"
```

Doctor links include `doctor`; packages include `package`; services include `service`; EECP suitability uses `service=eecp-therapy`; need routes include `concern`. High-intent CTAs no longer use bare `/appointment`.

- [ ] **Step 5: Gate unverified operational sections**

Render cards/tables only from public arrays. Empty arrays show `Details are being confirmed. Call Rise before you plan your visit.` Draft records remain in source.

Move the gallery array out of `[slug]/page.tsx` and model replaceable media as a discriminated union:

```ts
export type GalleryItem =
  | { id: string; caption: string; mediaType: "illustration"; art: SiteArtKind; publication: Verification }
  | { id: string; caption: string; mediaType: "photo"; src: string; alt: string; publication: Verification };
```

`GalleryPage` renders a visible “Illustration” label for current art records and a Next Image for published photo records. A future editor can replace one record without changing layout code. Test both branches and confirm unpublished media is absent.

- [ ] **Step 6: Verify and commit**

```bash
npm test -- src/components/care-need-router.test.tsx src/components/doctors-directory.test.tsx src/components/gallery-page.test.tsx src/lib/appointment.test.ts
npm run typecheck
git add src/components/care-need-router.tsx src/components/care-need-router.test.tsx src/components/doctors-directory.tsx src/components/doctors-directory.test.tsx src/components/gallery-page.tsx src/components/gallery-page.test.tsx src/content/site-data.ts 'src/app/[slug]/page.tsx' src/components/care-services-page.tsx src/components/eecp-hero.tsx src/components/eecp-body.tsx src/components/heart/triage-signs.tsx src/components/heart/protect-tests-treat.tsx src/components/site-header.tsx src/components/mobile-menu.tsx src/components/site-footer.tsx
git commit -m "Connect patient needs to contextual booking"
```

---

### Task 8: Distil the homepage around proof-backed clarity

**Files:**
- Modify: `src/components/home-hero.tsx`
- Modify: `src/app/page.tsx`
- Create: `src/app/home-page.test.tsx`
- Modify: `src/components/home-pathways.tsx`
- Modify: `src/components/home-manifesto.tsx`
- Modify: `src/app/globals.css`
- Delete: `src/app/template.tsx`

**Interfaces:**
- Consumes: `CareNeedRouter`, public selectors, and contextual appointment links.
- Produces: immediate hero content and the approved story hierarchy.

- [ ] **Step 1: Write a failing hierarchy test**

Prove that hero promise/actions are in initial markup, the need router precedes pathways, no fixed 35-session/24-hour/doctor/department proof appears, unpublished team proof is absent, EECP/close CTAs carry context, and `HomeMarquee` is not rendered.

- [ ] **Step 2: Update the hero without hiding critical content**

Use:

```text
H1: One place to turn a health question into a clear next step.
Deck: Consultations, diagnostics, medicines and suitability-first heart care — connected by a team that explains before it acts.
Primary CTA: Find the right care
Secondary CTA: Call or WhatsApp
```

Remove doctor/department/35-session/24h statistics. GSAP may animate decorative art/ECG, but never apply delayed `autoAlpha: 0` to headline, deck, or primary actions.

- [ ] **Step 3: Recompose existing homepage sections**

```text
HomeHero
CareNeedRouter
HomeManifesto care standard
HomePathways
connected visit flow
EECP suitability feature
Heart Guide/resources feature
published clinician proof when available
contextual close
```

Do not render `HomeMarquee`; keep its file reusable. Hide the team block while `publishedDoctors` is empty.

- [ ] **Step 4: Remove page-wide hidden entrance state**

Delete `src/app/template.tsx` and remove `.page-enter`/`.page-enter-done` styles. Retain reduced-motion and reveal fallbacks.

- [ ] **Step 5: Verify and commit**

```bash
npm test -- src/app/home-page.test.tsx src/components/care-need-router.test.tsx
npm run typecheck
git add -A
git commit -m "Distil the homepage around patient needs"
```

---

### Task 9: Complete navigation, contrast, focus, touch, and scroll accessibility

**Files:**
- Create: `src/lib/navigation.ts`
- Create: `src/lib/navigation.test.ts`
- Create: `src/components/main-content.tsx`
- Create: `src/components/main-content.test.tsx`
- Create: `src/components/skip-link.tsx`
- Create: `src/components/skip-link.test.tsx`
- Modify: `src/app/layout.tsx`
- Modify: all public route roots under `src/app/`
- Modify: `src/components/nav-links.tsx`
- Create: `src/components/nav-links.test.tsx`
- Modify: `src/components/mobile-menu.tsx`
- Create: `src/components/mobile-menu.test.tsx`
- Modify: `src/components/ui/reading-progress.tsx`
- Modify: `src/app/globals.css`
- Create: `src/test/accessibility-styles.test.ts`

**Interfaces:**
- Produces: one focusable `main#main-content`, skip navigation, current-page state, controlled mobile menu, AA action token, 44px controls, and rAF-throttled reading progress.

- [ ] **Step 1: Write failing navigation/main tests**

Test exact/descendant matching without prefix collisions, one `aria-current="page"`, skip target, controlled expanded state, Escape close/focus return, and pathname close.

- [ ] **Step 2: Implement the shared main and skip contract**

```tsx
export function MainContent({ children, className }: Props) {
  return <main id="main-content" tabIndex={-1} className={className}>{children}</main>;
}
export function SkipLink() {
  return <a className="skip-link" href="#main-content">Skip to main content</a>;
}
```

Every public page renders exactly one `MainContent`.

- [ ] **Step 3: Replace mobile `<details>` with a controlled button**

Use `aria-expanded`, `aria-controls="mobile-navigation"`, dynamic Open/Close label, Escape listener, pathname-close effect, and trigger-focus restoration.

- [ ] **Step 4: Add semantic action and focus tokens**

```css
--coral-action: #b4475b;
--focus-ring: #0b6f63;
```

Keep decorative `--coral`. White on `#b4475b` is approximately 5.26:1. Apply the action token to text-bearing coral controls. Add visible `:focus-visible`, skip-link reveal, and minimum 44×44 mobile controls.

- [ ] **Step 5: Throttle reading progress**

Schedule scroll/resize updates through one `requestAnimationFrame` and cancel the queued frame during cleanup.

- [ ] **Step 6: Verify and commit**

```bash
npm test -- src/lib/navigation.test.ts src/components/main-content.test.tsx src/components/skip-link.test.tsx src/components/nav-links.test.tsx src/components/mobile-menu.test.tsx src/test/accessibility-styles.test.ts
npm run typecheck
npm run lint
git add src/lib/navigation.ts src/lib/navigation.test.ts src/components/main-content.tsx src/components/main-content.test.tsx src/components/skip-link.tsx src/components/skip-link.test.tsx src/app src/components/nav-links.tsx src/components/nav-links.test.tsx src/components/mobile-menu.tsx src/components/mobile-menu.test.tsx src/components/ui/reading-progress.tsx src/app/globals.css src/test/accessibility-styles.test.ts
git commit -m "Improve global navigation and accessibility"
```

---

### Task 10: Clean SEO, Cloudflare configuration, and active documentation

**Files:**
- Modify: `src/app/sitemap.ts`
- Modify: `src/components/clinic-schema.tsx`
- Modify: `wrangler.toml`
- Modify: `next.config.mjs`
- Modify: `open-next.config.ts`
- Modify: `.env.example`
- Modify: `README.md`
- Modify: `docs/architecture.md`
- Modify: `docs/audit-response.md`
- Modify: `src/test/repository-contracts.test.ts`

**Interfaces:**
- Consumes: governed routes/posts/clinic schema and package scripts.
- Produces: Rise-specific release configuration and accurate maintainer documentation.

- [ ] **Step 1: Extend failing repository contracts**

Active source/config/docs contain none of:

```text
nexara-foundation
NEXARA_KV
NEXARA_QUEUE
nexara-jobs
SUPABASE_SERVICE_ROLE_KEY
PLATFORM_PROVIDER
DATABASE_PROVIDER
AUTH_PROVIDER
```

Assert that README commands match `package.json` scripts.

- [ ] **Step 2: Reduce Cloudflare source configuration**

```toml
name = "rise-medical-hub"
main = ".open-next/worker.js"
compatibility_date = "2026-08-06"
compatibility_flags = ["nodejs_compat"]

[assets]
directory = ".open-next/assets"
binding = "ASSETS"
```

Remove the unused OpenNext dev initializer from `next.config.mjs`. Keep `open-next.config.ts` minimal and Rise-specific. `.env.example` states that no runtime application variables are currently required.

- [ ] **Step 3: Replace stale documentation**

README covers actual setup, scripts, governed publication, WhatsApp handoff, policies, Cloudflare build without deployment, and rollback. Architecture covers App Router, governance, taxonomy, booking flow, schema/sitemap sources, and test gates. Mark old deployment verification in `docs/audit-response.md` as historical.

- [ ] **Step 4: Verify and commit**

```bash
npm test -- src/test/repository-contracts.test.ts src/lib/seo.test.ts src/lib/schema.test.ts
npm run verify
npm run build
git add wrangler.toml next.config.mjs open-next.config.ts .env.example README.md docs/architecture.md docs/audit-response.md src/app/sitemap.ts src/components/clinic-schema.tsx src/test/repository-contracts.test.ts
git commit -m "Clean Rise release configuration and documentation"
```

---

### Task 11: Full review and production verification

**Files:**
- Modify: only files required by concrete review findings.
- Create: `docs/safe-launch-verification.md`

**Interfaces:**
- Produces: independent spec-compliance review, code-quality review, and reproducible evidence without deployment.

- [ ] **Step 1: Run the complete automated gate from a clean tree**

```bash
npm run verify
npm run build
npm ls --depth=0
git diff --check
git status --short
```

Expected: every command exits 0 and the implementation is clean before browser evidence is recorded.

- [ ] **Step 2: Run repository safety searches**

```bash
rg -n "heart-care-compare|heart-care-alternative|\.hc-alt" src docs/heart-care-plan.md
rg -n "nexara-foundation|NEXARA_KV|NEXARA_QUEUE|nexara-jobs" wrangler.toml next.config.mjs open-next.config.ts README.md docs/architecture.md
rg -n "Reviewed|reviewedBy" src/app src/components src/content
```

Expected: first two searches have no active matches; review references appear only behind named published-review logic.

- [ ] **Step 3: Run desktop/mobile browser smoke checks**

- Homepage desktop and 390px mobile, immediate hero, no overflow.
- Skip link, keyboard navigation, mobile menu Escape/focus.
- `/testimonials` and `/heart-care-compare` return 404.
- `/privacy`, `/terms`, and `/medical-information` render and are linked.
- `/appointment?concern=not-sure&source=home` preserves context.
- Popup-allowed and blocked states; values survive; retry/copy/direct/phone work.
- Emergency actions use `tel:108`; routine actions use Rise contact.
- Unverified doctor/schedule/package/camp content does not render.
- Heart Guide and resources remain readable and sourced.

- [ ] **Step 4: Request independent spec and code review**

Dispatch one reviewer against the approved design and one against implementation quality. Fix evidence-backed P0/P1 findings, rerun focused tests, then the full gate.

- [ ] **Step 5: Record verification evidence and commit**

`docs/safe-launch-verification.md` records command results, route/viewport checks, unresolved owner/clinician confirmations, backup/implementation branches, and that no deployment occurred.

```bash
git add docs/safe-launch-verification.md
git commit -m "Document Rise safe-launch verification"
```

## Execution mode

Use subagent-driven development. Each task receives implementation, specification-compliance review, and code-quality review before dependent work continues. Parallelize only tasks that do not share files or unpublished interfaces.
