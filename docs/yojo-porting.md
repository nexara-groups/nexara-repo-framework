# Yojo guarded port

## Baseline

- Foundation source: `nexara-groups/nexara-repo-framework`, commit `33c6b34`.
- Runtime: Next.js 15.5.21, React 19, OpenNext/Cloudflare, Supabase seams.
- Architecture gate: `npm run verify` runs the Nexara architecture check and
  strict TypeScript check.
- Release gate: `npm run build` produces the Next production build.
- Approved hero reference: `public/design-reference/atlas-rise-v1.png`.

## Source of content, not architecture

The parent static Yojo site supplies draft copy, route names, and replaceable
visual assets only. It is not a source for runtime, auth, storage, routing, or
deployment decisions.

## Planned application modules

| Module | Responsibility | First guarded capability |
| --- | --- | --- |
| `learning-catalog` | Published programmes and route metadata | Public programme index and detail read model |
| `enquiries` | Training and organisation enquiries | Validated, persisted enquiry submission |
| `student-access` | Registration, login, profile and roles | Authenticated learner account flow |
| `events` | Webinars and registrations | Event listing and registration flow |
| `careers` | Roles and applications | Vacancy and application flow |
| `content` | Articles, FAQs and company material | Managed public content read model |

## Route port order

1. Home and the Learning Atlas visual contract
2. Courses and programme detail pages
3. Student Journey
4. About, Faculty, Articles and FAQs
5. Events, Careers and Contact backed by guarded modules
6. Login/Register backed by the selected `AuthProvider`
7. Organisation services and service detail pages

## Completion definition

A route is not complete merely because it renders. It must have an explicit
place in the Next App Router, a clear data boundary, accurate state language,
and passing `npm run verify`. Any real write requires authorization,
tenant-scoped repository access where applicable, and an acceptance test for
the approved visual composition.
