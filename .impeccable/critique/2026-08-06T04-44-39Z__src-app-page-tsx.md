---
target: the Rise Medical Hub site, anchored on the homepage
total_score: 25
max_score: 40
na_heuristics: none
p0_count: 6
p1_count: 8
timestamp: 2026-08-06T04-44-39Z
slug: src-app-page-tsx
---
# Rise Medical Hub — Site Critique

Target: the full Rise Medical Hub experience, anchored on `src/app/page.tsx` and verified against the isolated local site at `127.0.0.1:3011`.

Method: dual-agent (A: /root/design_story_review · B: /root/technical_qa_review)

## Executive verdict

Rise is visually distinctive, thoughtfully written, and technically buildable, but it is not ready to operate as a trustworthy medical authority. Its design confidence currently exceeds its verified clinical, institutional, privacy, and booking proof. The single highest-leverage focus is a named, clinician-owned clinical truth layer that drives every page, schema field, specialty label, schedule, and booking CTA.

## Design-specificity verdict

Strongly authored rather than category-interchangeable. The ECG trace, anatomical teaching illustrations, pulse-based motion, navy/mint/coral palette, Fraunces and Instrument Sans pairing, and repeated “explains before it acts” idea create a recognizable Rise world. The weakness is that this identity is more conceptual than lived: initials, illustrations, animated anatomy, and assertions stand in for real clinician photographs, registrations, facilities, accreditation, governance, and consented patient proof. The homepage also reads more strongly as a cardiac/EECP brand than as the multispecialty gateway described elsewhere.

## Nielsen heuristic score

| # | Heuristic | Score | Finding |
|---|---|---:|---|
| 1 | Visibility of system status | 2/4 | No reliable booking, availability, popup-failure, or confirmation state. |
| 2 | Match with the real world | 3/4 | Excellent plain-language heart education; organizational taxonomy and credential acronyms still leak into the patient journey. |
| 3 | User control and freedom | 2/4 | Call, WhatsApp, breadcrumbs, and edit state exist, but selected doctor or concern is discarded during booking. |
| 4 | Consistency and standards | 3/4 | Strong visual/verbal system; conflicting 4/8/11/6 care models and random doctor order reduce predictability. |
| 5 | Error prevention | 2/4 | Native required fields exist; phone, past date, privacy, draft, and popup protection do not. |
| 6 | Recognition rather than recall | 3/4 | Navigation, filters, chapter rails, and labels are strong; booking makes users remember prior selections. |
| 7 | Flexibility and efficiency | 2/4 | Multiple contact routes exist but none preserves context. |
| 8 | Aesthetic and minimalist design | 3/4 | Distinctive hierarchy; the page is too long and several large choice clusters overload attention. |
| 9 | Error recognition and recovery | 2/4 | A blocked WhatsApp popup can still trigger a false success message. |
| 10 | Help and documentation | 3/4 | Emergency, evidence, FAQ, and support content are unusually good; privacy and named medical ownership are absent. |
| **Total** |  | **25/40** | **Good foundation; significant trust and journey work remains.** |

## Technical audit health

| Dimension | Score | Finding |
|---|---:|---|
| Accessibility | 2/4 | White-on-coral CTA contrast fails AA; no skip link; some mobile targets are undersized. |
| Performance | 3/4 | Static build passes; catch-all pages ship up to 181 kB first-load JavaScript. |
| Responsive | 3/4 | No observed overflow; appointment task is buried and key mobile actions/artwork disappear. |
| Theming | 3/4 | Strong token base with scattered hard-coded supporting colours. |
| Implementation integrity | 2/4 | Coherent UI, but booking, prototype indexing, lint, tests, and deployment drift remain. |
| **Total** | **13/20** | **Acceptable; release hardening required.** |

## Priority findings

### P0 — launch blockers

1. Illustrative testimonials are written like named outcome claims and are included in the public sitemap. Remove or noindex them until real, consented stories exist.
2. The appointment flow sends contact and potentially medical information to WhatsApp without a privacy policy or specific health-data disclosure.
3. “Urgent concerns” are routed to routine support in appointment copy. Emergency symptoms must route explicitly to 108 or the nearest emergency department.
4. Resource pages display “Reviewed” using the publication date and hard-code an unnamed organizational reviewer even though the data model contains no reviewer record.
5. Doctor, phone, hours, service, package, camp, pharmacy, turnaround, and credential claims are published although repository documentation marks many as unverified.
6. ECG screening, EECP eligibility, heart-failure, and absolute lifestyle claims conflict across pages and require named clinician review before publication.

### P1 — major trust and conversion work

1. Create one verified model linking symptom/need → specialty → service → doctor → live schedule → booking value; reconcile the current 4/8/11/6 taxonomies and missing cardiologist mismatch.
2. Preserve doctor, symptom, package, diagnostic, or EECP intent through the form and WhatsApp message. Detect popup failure and never show success without a real handoff.
3. Add clinician portraits, registrations, named medical leadership, verified hours, facility proof, and governance before adding more brand storytelling.
4. Fix white-on-coral contrast, add a skip link, enlarge mobile targets, expose `aria-current`, and keep a primary mobile call/book action visible.
5. Remove or noindex the public `/heart-care-compare` experiment.
6. Rename and clean the stale `nexara-foundation` Cloudflare worker configuration before deployment.
7. Replace the unusable deprecated lint gate and add automated coverage for booking, navigation, metadata, reduced motion, and index control.
8. Shorten the homepage and move symptom-first routing and verified proof above the repeated philosophy/EECP/education chapters.

### P2 — depth, findability, and polish

- Add named author/reviewer profiles, last-reviewed dates, editorial and correction policies, Terms, patient rights, payment/insurance, accessibility, and grievance information.
- Build verified doctor and specialty pages with contextual booking, then complete canonical, breadcrumb, LocalBusiness, Physician, hours, geo, and `sameAs` schema.
- Deepen diagnostics, pharmacy, package, camp, and OPD pages with actual availability, preparation, interpretation, turnaround, fees, contraindications, and schedules.
- Replace illustration-only facility proof with consented real photography; use only documented real reviews.
- Split the catch-all route where useful, throttle reading-progress updates, and verify the full Cloudflare/OpenNext build.

## Cognitive load and storytelling

Six of eight cognitive-load checks fail. The strongest emotional arc is calm promise → “explains before it acts” manifesto → evidence-based heart education. The main emotional drop is trust: “people behind the care” leads to initials, “patient stories” are illustrative, spaces are drawings, timings are representative, and the final handoff sends sensitive context to WhatsApp without accountable ownership.

Recommended flagship narrative: **“From a health question to a clear next step—connected care, explained by people you can trust.”** Rise should lead as Madhurawada’s proof-backed multispecialty gateway; EECP and the Heart Guide should demonstrate its standard of care, not compete to become a second brand.

Recommended homepage sequence:

1. Clear emergency utility and routine-contact separation.
2. One-place-to-start hero with Find the right care and Call/WhatsApp actions.
3. Symptom/need-first router.
4. Named clinical proof and the operational “no test/no unexplained report/written next step” promise.
5. Connected visit journey.
6. Verified services, doctors, hours, and availability.
7. Signature suitability-first EECP story.
8. Named, reviewed Heart Guide and resources.
9. Real local proof, payment/insurance, map, and consented reviews.
10. Contextual booking, call, directions, and emergency close.

## Persona red flags

- Confused first-timer: organizational taxonomy appears before “not sure who to see,” then booking loses the recommendation.
- Deliberate stress tester: malformed phone and past dates are not prevented; blocked WhatsApp can produce false success; doctor order changes between visits.
- Distracted mobile user: booking is visually delayed, autocomplete is absent, draft state is lost, and the persistent desktop booking affordance disappears.

## Positive findings

- A genuinely distinctive, calm medical visual system and coherent voice.
- Exceptional heart-education structure, source visibility, emergency interruption, and cautious EECP service framing.
- Good landmarks, headings, labels, reduced-motion support, responsive foundation, image loading, metadata base, sitemap, robots, FAQ schema, and MedicalClinic/MedicalWebPage foundations.
- Production build and strict typecheck pass; the required mechanical detector reports zero findings on the stable homepage target.

## Minor observations

- The initial hero copy and CTA wait roughly 2.2–2.5 seconds for motion; critical content should be immediately present and animation should embellish it.
- Mobile navigation does not close on Escape and does not expose expanded state clearly.
- Appointment fields begin roughly 1.4 mobile viewports below the top, making the primary task harder to find.
- The About page is beautifully written but institutionally anonymous.
- README, architecture notes, aliases, and audit notes contain stale Nexara-era or already-resolved material.

## Questions / decisions

1. Confirm the recommended primary identity: neighbourhood multispecialty gateway, with heart/EECP as signature proof rather than the first-viewport master brand.
2. Nominate the clinician and operational owner who will approve every medical, roster, schedule, emergency, and service fact.
3. Confirm the definitive clinic legal name, phone, address, hours, emergency scope, roster, fees, registrations, and consent status before any more SEO or production publishing.
