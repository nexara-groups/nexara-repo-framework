# Rise Medical Hub Safe-Launch Design

**Date:** 2026-08-06

**Status:** Approved for implementation
**Backup point:** `codex/rise-pre-audit-backup-20260806` at `d655e4d3013013ee1be4d77560f99e313869c4ac`

## Purpose

Make the existing Rise Medical Hub site safe to publish, easier to use, and easier to maintain without throwing away work that will become useful after clinic verification.

The implementation must preserve draft testimonials, operational details, clinician information, and medical-review metadata as structured content. Publishing a verified record later must be a data/configuration change, not a component rewrite. The sole exception is the alternate Heart Guide prototype: `/heart-care-compare` and its dedicated component will be deleted as explicitly requested.

## Product position

Rise is presented primarily as Madhurawada's proof-backed multispecialty gateway: a place that turns a health concern into a clear next step. Heart education and suitability-first EECP remain signature evidence of that care standard, rather than competing as a separate master brand.

The public promise is:

> From a health question to a clear next step — connected care, explained by people you can trust.

## Non-negotiable constraints

- Never invent or silently strengthen a medical, clinician, schedule, licence, accreditation, fee, availability, outcome, or legal claim.
- Unverified content remains available to editors in typed source data but is not emitted as public copy, metadata, schema, sitemap entries, or navigation.
- The UI must have a safe fallback when a field is unverified, such as “Call to confirm current availability.”
- Fictional or illustrative testimonials must never render publicly.
- Medical content without a named reviewer must say “Published,” not “Reviewed,” and must omit reviewer schema.
- Emergency symptoms must direct users to 108 or the nearest emergency department; routine support must be clearly separated.
- WhatsApp is an explicit external handoff, not a confirmed appointment or an internal submission.
- The existing visual identity and authored Heart Guide/EECP experiences remain intact unless a change is required for safety, accessibility, clarity, or performance.
- No deployment or external publishing is part of this implementation.

## Scope decomposition

The work is delivered as five independently testable phases.

### Phase 1 — Publication and clinical-governance layer

Create a small typed governance model for reusable content:

```ts
export type PublicationState = "draft" | "awaiting-verification" | "published";

export type Verification = {
  state: PublicationState;
  verifiedAt?: string;
  verifiedBy?: string;
  sourceNote?: string;
};
```

Records that need independent verification, such as articles and testimonials, include a `publication` field. Clinician-facing records may additionally include field-level verification where public fallback behaviour differs, for example schedule versus biography.

Shared helpers provide the only publication decision points:

```ts
isPublished(verification): boolean
publishedOnly(records): records
getPublicReview(review): review | null
```

The implementation keeps these helpers pure so they can be unit-tested without rendering React.

Public route behaviour:

- Remove `testimonials` from published navigation, static parameters, sitemap and footer.
- A direct request to `/testimonials` returns the standard 404 while its draft data and reusable rendering component remain in the repository.
- Resource articles continue to render, but reviewer copy/schema appears only when a real named reviewer record exists.
- Sitemap generation reads the same published content helpers as routing.
- `/heart-care-compare` and `src/components/heart/heart-care-alternative.tsx` are deleted completely.
- Documentation that calls the comparison route an active exploration is updated to record its removal.

Clinic and doctor information stays reusable. Until the clinic confirms field accuracy, public surfaces avoid exact schedules and unsupported superlatives. They use explicit confirmation language and a single call/booking path.

### Phase 2 — Safety, privacy and resilient booking

Add a permanent `/privacy` page and footer link. The policy must accurately describe the current implementation:

- information entered in the appointment form;
- the fact that the site prepares a WhatsApp message and transfers the user to WhatsApp;
- no claim that Rise received anything until the user sends the message;
- purpose of the information;
- data minimisation advice, including not entering emergency or highly sensitive details;
- contact method for access, correction or deletion enquiries;
- external WhatsApp processing notice;
- clear “owner/legal review recommended” wording in repository documentation, not in alarming public copy.

The appointment interface is redesigned as an explicit handoff:

1. Preserve incoming context from `doctor`, `service`, `package`, `concern`, or `source` query parameters.
2. Display that selection in the form and include it in the prepared WhatsApp text.
3. Add `autocomplete`, `inputMode`, minimum-date and conservative phone validation.
4. Keep the user's values if WhatsApp cannot open.
5. Treat a null return from `window.open()` as failure; show retry, direct WhatsApp link, copy-message and phone alternatives.
6. Announce success/failure through an accessible status region and move focus to it.
7. Never say an appointment is confirmed. State only that WhatsApp was opened and the user must send the prepared message.

Emergency presentation is consistent on the appointment page, contact page and global utility area:

- emergency symptoms → call 108 or visit the nearest emergency department;
- routine scheduling/questions → Rise support number or WhatsApp;
- the medical-information disclaimer does not weaken the emergency instruction.

### Phase 3 — Unified care architecture and contextual conversion

Introduce a single public care taxonomy with stable identifiers. The taxonomy links:

```text
patient need → care area → service → eligible clinician(s) → confirmed availability → booking context
```

Existing marketing pathways, department labels, doctor filters and appointment options must derive from this model. Public counts are computed, never hard-coded.

The doctors experience starts with “What brings you here?” routing before the full roster. Doctor order is deterministic. Every doctor, service, package and EECP suitability CTA carries contextual query parameters into `/appointment`.

Where clinic confirmation is incomplete:

- show “Availability confirmed when you request a visit”;
- do not publish a precise timetable;
- do not imply a cardiologist is present unless the roster contains a verified cardiologist;
- avoid global credential claims that do not apply to every clinician.

No individual doctor-detail routes or local-specialty SEO pages are added until their underlying records meet the published verification state.

### Phase 4 — Homepage story and proof hierarchy

Retain the Rise visual language while reducing repeated editorial climaxes. Critical hero content and the primary action render immediately; motion enhances the composition but does not delay comprehension.

The homepage order becomes:

1. concise emergency/routine-contact utility;
2. clear local multispecialty promise and primary action;
3. need-first care router;
4. verified clinical/operational proof and the “no test without a reason” care standard;
5. connected visit journey;
6. verified services and availability;
7. suitability-first EECP feature;
8. Heart Guide and named/reviewed educational resources;
9. real local proof when supplied;
10. contextual booking, call and directions close.

Sections without verified proof remain reusable but do not render publicly. Illustrated gallery content remains clearly labelled as illustration and is data-driven so real photographs can replace individual assets without layout changes.

### Phase 5 — Accessibility, SEO and release engineering

Permanent accessibility improvements:

- AA-compliant coral/text tokens;
- visible-on-focus skip link and stable `main` target;
- `aria-current="page"` in navigation;
- minimum practical mobile touch targets;
- mobile navigation with explicit expanded state and Escape-to-close behaviour;
- accessible status/focus behaviour in booking;
- reduced-motion behaviour retained.

SEO/index integrity:

- consistent canonicals for published routes;
- sitemap contains only published content;
- truthful author/reviewer/date metadata;
- LocalBusiness/Physician schema emits only verified fields;
- prototype and draft routes are absent rather than merely advertised as hidden.

Release engineering:

- replace deprecated `next lint` with an explicit ESLint command/configuration compatible with Next 15;
- add unit/component coverage for publication filtering, route visibility, metadata, booking handoff failure, contextual booking and navigation accessibility;
- rename the Cloudflare worker from `nexara-foundation` to a Rise-specific identity;
- remove unused Nexara KV/queue/cron bindings only when repository search confirms no consumer;
- update stale README and architecture documentation;
- run the Next production build, typecheck, lint, tests and a bounded browser smoke test;
- do not deploy.

## Data flow

```text
typed source record
  → publication/verification helper
  → public route or safe fallback
  → metadata/schema/sitemap from the same decision
  → contextual CTA query
  → appointment form
  → explicit WhatsApp handoff with retry/fallback
```

No component makes its own independent guess about whether content is verified.

## Error handling

- Unknown or unpublished slugs call `notFound()`.
- Missing reviewer data produces published-date UI and no reviewer schema.
- Missing schedule data produces confirmation language and never an invented time.
- Invalid query context is ignored and the generic care selector remains available.
- Popup failure preserves the completed form and offers actionable alternatives.
- JavaScript-disabled users retain call, WhatsApp direct-link and address options.

## Testing strategy

Tests are written before each behavioural change.

- Pure unit tests cover publication and verification helpers.
- Route/content tests cover removal of testimonials and the comparison route from public lists and sitemap.
- Component tests cover appointment context, validation, blocked-popup recovery and accessible status messaging.
- Accessibility assertions cover skip navigation, current-page state and menu state.
- Static repository checks ensure deleted prototype imports and stale Nexara deployment bindings do not remain.
- Final verification includes `npm run typecheck`, `npm run lint`, `npm test`, `npm run build` and browser checks at desktop/mobile widths.

## Re-enabling preserved content

Future publication is intentionally operational:

1. Replace draft values with clinic-approved facts or a consented testimonial.
2. Record the named verifier/reviewer, source note and ISO verification date.
3. Change the record state to `published`.
4. Run the verification suite.

The existing component, route metadata, schema and sitemap then include the content automatically where applicable. No new page implementation is required.

## Rollback

The immutable return point is branch `codex/rise-pre-audit-backup-20260806`, commit `d655e4d3013013ee1be4d77560f99e313869c4ac`. Implementation occurs only on `codex/rise-audit-implementation-20260806` or an isolated worktree branch derived from it.

## Acceptance criteria

- `/heart-care-compare` source and public route are gone.
- `/testimonials` is not reachable, linked, indexed, included in schema or present in the sitemap, while reusable draft testimonial data/UI remain in source.
- Unnamed medical review is never represented as reviewed.
- Emergency and routine-contact paths cannot be confused.
- Booking preserves origin context and cannot report false WhatsApp success.
- Unverified schedules and institutional facts render safe fallbacks.
- The site has a visible privacy pathway and transparent WhatsApp handoff.
- Primary navigation and booking meet the listed accessibility requirements.
- Production build, typecheck, lint and automated tests pass.
- Cloudflare source configuration no longer refers to the Nexara foundation, but no deployment is performed.
- A future editor can publish a verified testimonial or reviewer record through data changes alone.
