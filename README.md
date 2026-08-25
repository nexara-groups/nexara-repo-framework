# Nexara Foundation V1

A **production-ready platform foundation** — not a product. It is the provider-agnostic base that every future Nexara business module (WorkHub, CRM, Projects, Marketing, Finance, Contracts) is built on. It ships with no business modules by design; what you get is the architecture, the abstractions, the wiring, and one sample feature that proves it all works end to end.

**Stack:** Next.js 15 · React 19 · TypeScript (strict) · Cloudflare Workers via OpenNext · Supabase (initial database + auth) or Cloudflare D1 with JWT credentials.

**Design goal:** business logic never depends on a vendor. Swapping Supabase → Neon, or Cloudflare → AWS, or Supabase Auth → Clerk, changes one wiring file — not your features.

---

## Table of contents

1. [What you get](#1-what-you-get)
2. [The one rule](#2-the-one-rule)
3. [Full repository map](#3-full-repository-map)
4. [The layers in detail](#4-the-layers-in-detail)
5. [The sample feature, end to end](#5-the-sample-feature-end-to-end)
6. [Dependency injection](#6-dependency-injection)
7. [Provider swap matrix](#7-provider-swap-matrix)
8. [Multi-tenancy & tenant safety](#8-multi-tenancy--tenant-safety)
9. [Architecture guard (enforced rules)](#9-architecture-guard-enforced-rules)
10. [Building a new module](#10-building-a-new-module)
11. [Getting started](#11-getting-started)
12. [Scripts](#12-scripts)
13. [What is intentionally NOT here](#13-what-is-intentionally-not-here)
14. [Further docs](#14-further-docs)

---

## 1. What you get

Out of the box this foundation gives you:

- **A provider-agnostic core.** Three vendor abstractions (`PlatformProvider`, `DatabaseProvider`, `AuthProvider`) so the runtime, the database, and the identity provider are all swappable behind interfaces.
- **A repository layer.** Domain data-access contracts (`ProfileRepository`, `UserRepository`) with SQL confined to infrastructure — business services never see SQL.
- **RBAC.** Roles (`owner`/`admin`/`manager`/`member`), permissions, a role→permission map, and a **tenant-aware** permission service, plus readable policy helpers (`canCreateTask`, `canAssignTask`, `canManageUsers`).
- **Request & tenant context.** `RequestContext` resolves identity once at the edge; `TenantContext` scopes every data access to a tenant.
- **A minimal event bus.** In-process `publish`/`subscribe` so modules can react to each other without coupling — no CQRS, no event sourcing.
- **Dependency injection.** A single composition root (`src/core/container.ts`) that builds everything; the only place concrete vendors are imported.
- **A module template.** `src/modules/_template` with `domain/application/infrastructure/presentation` and guides, so new modules are consistent.
- **A mechanical architecture guard.** A script (run in `verify`) that fails the build on provider leakage, SQL in services, or a tenant-unsafe query.
- **A sample feature.** Current-user profile (`GET /api/me`) that uses auth + RBAC + a repository with zero vendor imports and zero SQL in the service.
- **Deploy config.** Next.js 15 + OpenNext + Cloudflare Workers (`wrangler.toml`, `open-next.config.ts`), a SQL migration, and `.env.example`.

The practical payoff: **future migration without rewrites**, a small surface a small team can hold in their heads, and guardrails that keep the architecture from eroding as the codebase grows.

## 2. The one rule

Business logic depends only on interfaces. Vendors sit behind those interfaces and are wired in exactly one place.

```
Business Logic  →  Interfaces  →  Provider / Repository Implementations   ✅ allowed
Business Logic  →  Supabase SDK / Cloudflare APIs / raw SQL               ❌ forbidden
```

This is not just convention — it is [enforced automatically](#9-architecture-guard-enforced-rules).

## 3. Full repository map

```
nexara-foundation/
├─ package.json                 Scripts + deps (Next 15, React 19, supabase-js, OpenNext, wrangler)
├─ tsconfig.json                Strict TS, path aliases (@core, @shared, @features)
├─ next.config.mjs              Next config + OpenNext dev bindings
├─ open-next.config.ts          OpenNext → Cloudflare adapter
├─ wrangler.toml                Worker name, KV, Queue, cron, vars (and D1 migration example)
├─ .env.example                 Env template (Supabase keys, provider selectors)
├─ db/
│  └─ migrations/
│     ├─ 0001_profiles.sql           Supabase/Postgres profiles + SQL bridge
│     └─ d1/                         SQLite-compatible D1 migration stream
├─ docs/
│  └─ architecture.md           Layer diagram + all guides
├─ scripts/
│  └─ check-architecture.mjs    Dependency + repository + tenant-safety guard
└─ src/
   ├─ shared/                   Lowest layer — no dependencies
   │  ├─ result.ts              Result<T,E> (ok/err) — explicit error returns
   │  ├─ errors.ts              AppError + typed error codes
   │  ├─ types.ts               UserId, TenantId, Principal
   │  └─ index.ts
   ├─ core/                     Interfaces + provider-independent logic
   │  ├─ platform/              Cloud Platform Layer
   │  │  ├─ platform-provider.interface.ts   env, KV, queue, cache, scheduler
   │  │  ├─ providers/cloudflare-platform-provider.ts
   │  │  └─ index.ts
   │  ├─ database/              Database Layer (low-level SQL execution)
   │  │  ├─ database-provider.interface.ts   query, transaction, dispose
   │  │  ├─ providers/supabase-database-provider.ts
   │  │  └─ index.ts
   │  ├─ auth/                  Authentication Layer
   │  │  ├─ auth-provider.interface.ts   login, logout, getCurrentUser, getSession, verifyPermission
   │  │  ├─ providers/supabase-auth-provider.ts
   │  │  └─ index.ts
   │  ├─ rbac/                  RBAC Layer (provider-independent)
   │  │  ├─ roles.ts            owner/admin/manager/member + rank helpers
   │  │  ├─ permissions.ts      permission catalog (resource:action)
   │  │  ├─ role-permissions.ts role → permission map (source of truth)
   │  │  ├─ permission-service.ts  can / canInTenant / assertInTenant
   │  │  ├─ policies.ts         canCreateTask / canAssignTask / canManageUsers
   │  │  └─ index.ts
   │  ├─ repositories/          Repository Layer (domain data-access contracts)
   │  │  ├─ profile-repository.interface.ts   ProfileRepository + ProfileRecord
   │  │  ├─ user-repository.interface.ts      UserRepository + UserRecord
   │  │  └─ index.ts
   │  ├─ context/              Request-scoped context
   │  │  ├─ tenant-context.ts   TenantContext + createTenantContext
   │  │  ├─ request-context.ts  RequestContext + resolveRequestContext + isAuthenticated
   │  │  └─ index.ts
   │  ├─ events/               Event Bus (interface + catalog)
   │  │  ├─ event-bus.ts        EventBus, DomainEvent, EventHandler
   │  │  ├─ events.ts           UserCreated / TaskCreated / NotificationSent
   │  │  └─ index.ts
   │  ├─ container.ts           Dependency injection — the composition root
   │  └─ index.ts               Aggregate public surface of core
   ├─ infrastructure/           Concrete, provider-specific implementations
   │  ├─ repositories/
   │  │  ├─ supabase-profile-repository.ts   SQL lives here
   │  │  └─ supabase-user-repository.ts      SQL lives here
   │  ├─ events/
   │  │  └─ in-memory-event-bus.ts           EventBus implementation
   │  └─ index.ts
   ├─ features/
   │  └─ user-profile/          SAMPLE feature (architecture demo; no SQL in service)
   │     ├─ user-profile.service.ts
   │     ├─ user-profile.types.ts
   │     └─ index.ts
   ├─ modules/
   │  └─ _template/             Copy to start a module (domain/application/
   │     ├─ README.md           infrastructure/presentation) + per-layer guides
   │     ├─ domain/README.md
   │     ├─ application/README.md
   │     ├─ infrastructure/README.md
   │     └─ presentation/README.md
   └─ app/                      Next.js App Router
      ├─ _services.ts           Runtime → services seam (getServices, bearerToken)
      ├─ api/me/route.ts        GET /api/me using the sample feature
      ├─ layout.tsx
      └─ page.tsx
```

## 4. The layers in detail

### shared/ — the kernel
Zero-dependency primitives every layer can use. `Result<T,E>` (`ok`/`err`) makes errors explicit at layer boundaries instead of throwing vendor exceptions; `AppError` carries a typed code (`UNAUTHENTICATED`, `FORBIDDEN`, `NOT_FOUND`, `VALIDATION`, `DATABASE`, …) that providers translate their native errors into; `types.ts` holds `UserId`, `TenantId`, `Principal`.

### core/platform — Cloud Platform Layer
`PlatformProvider` abstracts environment variables, KV, queues, scheduled jobs, and cache. `CloudflarePlatformProvider` is the only file that touches Cloudflare binding shapes; a future `AWSPlatformProvider` slots in behind the same interface.

### core/database — Database Layer
`DatabaseProvider` abstracts parameterized SQL (`$1, $2 …`), transactions, and connection lifecycle. `SupabaseDatabaseProvider` is the only place `@supabase/supabase-js` is imported for data access; `D1DatabaseProvider` translates the same parameter convention for Cloudflare D1 and exposes atomic batches. This is the **low-level execution** layer — repositories sit on top of it.

### core/auth — Authentication Layer
`AuthProvider` abstracts login, logout, get current user, get session, and verify permission. `SupabaseAuthProvider` maps the Supabase user onto the provider-agnostic `AuthUser` (tenant + role from `app_metadata`); the optional `JwtAuthProvider` supplies self-hosted email/password auth for D1. Both delegate permission decisions to the RBAC service. Public JWT registration always starts as `member`; elevate roles through an authenticated provisioning flow.

### core/rbac — Authorization
Provider-independent and pure. Roles `owner`/`admin`/`manager`/`member` (with a numeric rank for "at least" checks), a `resource:action` permission catalog, an explicit `ROLE_PERMISSIONS` map (the single source of truth), and `PermissionService` with `can()`, **`canInTenant()`**, and a throwing `assertInTenant()`. Policy helpers (`canCreateTask`, `canAssignTask`, `canManageUsers`) make call sites read like intent.

> `task:*` permissions are RBAC **examples** named in the spec. There is no Tasks module.

### core/repositories — Repository Layer
Domain data-access contracts independent of Supabase. They expose **domain records** (`ProfileRecord`, `UserRecord`), never rows or SDK types, and every tenant-scoped method takes a `TenantContext`. This is the seam that keeps SQL out of services.

### core/context — Request & tenant context
`TenantContext` (the tenant a unit of work is scoped to) and `RequestContext` (`requestId`, `accessToken`, resolved `user`, `tenant`). `resolveRequestContext(token, auth)` turns a token into context **once** at the edge; `isAuthenticated(ctx)` narrows it to a guaranteed-authenticated context. Services receive a context and never re-parse headers.

### core/events — Event Bus
A minimal `EventBus` (`publish`/`subscribe`) so modules can react to each other without importing each other. `DomainEvent` is the base shape; the catalog ships with `UserCreated`, `TaskCreated`, `NotificationSent`. Deliberately **not** CQRS/event-sourcing/distributed messaging.

### infrastructure/ — implementations
Where the concrete, technology-specific code lives: `SupabaseProfileRepository` / `SupabaseUserRepository` (the only place SQL appears, run through `DatabaseProvider`) and `InMemoryEventBus`.

### app/ — presentation
Next.js App Router. `_services.ts` is the seam between the Cloudflare runtime and business logic (`getServices()` reads bindings and builds the container; `bearerToken()` parses the header). `api/me/route.ts` is the sample endpoint.

## 5. The sample feature, end to end

`GET /api/me` (`Authorization: Bearer <token>`) demonstrates the whole architecture:

1. **Route** (`app/api/me/route.ts`) calls `getServices()`, then `resolveRequestContext(bearerToken(request), auth)` to resolve identity once.
2. It constructs `UserProfileService(repositories.profiles, permissions)` — interfaces only, no SDK, no SQL.
3. **Service** checks `permissions.canInTenant(ctx.user, "profile:read:self", ctx.tenant.tenantId)`, then calls `profiles.findByUser(ctx.tenant, ctx.user.userId)`.
4. **Repository** (`infrastructure/.../supabase-profile-repository.ts`) runs the tenant-scoped SQL through `DatabaseProvider` and maps the row to a `ProfileRecord`.
5. The route maps `Result` → HTTP (200, or 401/403/404/400 from the `AppError` code).

Nothing above the repository knows Supabase exists.

## 6. Dependency injection

`createServices(env)` in `src/core/container.ts` is the **composition root** and the only module that imports concrete providers and infrastructure. It builds, in order: the platform provider → RBAC → database provider → auth provider → repositories → event bus, and returns a typed `Services` object:

```ts
interface Services {
  platform: PlatformProvider;
  database: DatabaseProvider;
  auth: AuthProvider;
  permissions: PermissionService;
  repositories: { profiles: ProfileRepository; users: UserRepository };
  events: EventBus;
}
```

Each provider is selected from an environment variable, so swapping is configuration, not code.

## 7. Provider swap matrix

| Concern | Interface | Today | Future (add impl + one `case`) | Selector env |
| --- | --- | --- | --- | --- |
| Runtime/env/KV/queue/cache | `PlatformProvider` | Cloudflare | AWS | `PLATFORM_PROVIDER` |
| Data store | `DatabaseProvider` | Supabase, Cloudflare D1 | Neon | `DATABASE_PROVIDER` |
| Identity | `AuthProvider` | Supabase Auth, JWT credentials | BetterAuth, Clerk, Auth0 | `AUTH_PROVIDER` |
| Authorization | `PermissionService` | RBAC | edit role→permission map | — |
| Data access | repositories | Supabase/Postgres SQL | any SQL backend | — |

Adding a provider = implement the interface in `*/providers/*` (allowed to import the vendor SDK), translate errors to `AppError`, add one `case` in the container, set the env var. No business-code changes.

## 8. Multi-tenancy & tenant safety

The platform is multi-tenant from the first commit. Three layers of protection prevent accidental cross-tenant access:

- **Context:** `RequestContext.tenant` is derived from the authenticated user's tenant at the edge.
- **Authorization:** `PermissionService.canInTenant(user, permission, tenantId)` refuses actions whose tenant doesn't match the actor's.
- **Data access:** every repository method takes a `TenantContext`, and every SQL statement filters by `tenant_id`. The architecture guard fails the build if an `infrastructure/` SQL statement omits `tenant_id` (escape hatch: a `no-tenant` comment for genuinely global tables).

## 9. Architecture guard (enforced rules)

`scripts/check-architecture.mjs` scans `src/` and fails (`npm run verify`) if any of these are violated:

1. **No provider leakage.** Only `*/providers/*`, `container.ts`, and `app/_services.ts` may import `@supabase/*` or `@opennextjs/cloudflare`.
2. **No SQL in services.** Files under `features/**` or a module's `application/**` may not import the database layer or call `.query()`.
3. **Tenant safety.** Every SQL statement under any `infrastructure/` folder must filter by `tenant_id`.

This keeps the architecture honest as the team and codebase grow.

## 10. Building a new module

Modules are the only place business features live. Copy the template:

```bash
cp -r src/modules/_template src/modules/work-hub
```

Each module has four inward-pointing layers:

- **domain/** — entities/records + repository interface (port) + domain events. Pure types.
- **application/** — use-case services taking the port + `PermissionService` (+ `EventBus`) and a `RequestContext` per call. Authorize, act via the port, return `Result<T>`. No SQL.
- **infrastructure/** — implement the port with SQL through `DatabaseProvider`; always filter `tenant_id`.
- **presentation/** — thin route handlers: resolve context → build service → call use-case → map `Result` to a response.

Then wire the repository into `src/core/container.ts` and register any event handlers there. Full skeletons are in each template folder's README; the complete guide is in `docs/architecture.md`.

## 11. Getting started

```bash
npm install
cp .env.example .env.local        # fill in Supabase URL + keys

# For Supabase, apply the schema + SQL bridge:
#   db/migrations/0001_profiles.sql

# For D1, configure the DB binding with migrations_dir = "db/migrations/d1"
# and apply its separate SQLite-compatible stream:
#   wrangler d1 migrations apply DB

npm run dev                        # local dev (Cloudflare bindings via OpenNext)
npm run verify                     # enforce architecture + types
npm run preview                    # build + run on the Workers runtime
npm run deploy                     # deploy to Cloudflare
```

Before deploying, set the `NEXARA_KV` id and the `nexara-jobs` queue in `wrangler.toml`, and push secrets:

```bash
wrangler secret put SUPABASE_SERVICE_ROLE_KEY
wrangler secret put SUPABASE_ANON_KEY
```

### Environment variables

| Variable | Purpose | Example |
| --- | --- | --- |
| `APP_ENV` | environment name | `development` |
| `SUPABASE_URL` | Supabase project URL | `https://xxx.supabase.co` |
| `SUPABASE_ANON_KEY` | client/auth key | — |
| `SUPABASE_SERVICE_ROLE_KEY` | server-only DB key | — |
| `PLATFORM_PROVIDER` | `cloudflare` (· `aws`) | `cloudflare` |
| `DATABASE_PROVIDER` | `supabase` or `d1` | `supabase` |
| `AUTH_PROVIDER` | `supabase` or `jwt` | `supabase` |
| `AUTH_SECRET` | 32+ byte JWT signing secret (`AUTH_PROVIDER=jwt`) | — |
| `AUTH_TENANT_ID` | tenant for JWT credentials (`AUTH_PROVIDER=jwt`) | `tenant_1` |
| `AUTH_ISSUER` / `AUTH_AUDIENCE` | JWT token validation (`AUTH_PROVIDER=jwt`) | `https://app.example.test` |
| `STORAGE_PROVIDER` | `r2` to enable media storage | `r2` |
| `MEDIA_PUBLIC_ORIGIN` | public origin for R2 media | `https://media.example.test` |
| `EMAIL_PROVIDER` | `console`, `unavailable`, `resend`, `brevo`, or `ses` | `console` |
| `EMAIL_FROM` | verified sender for Resend or SES | `Nexara <no-reply@example.test>` |
| `STAGING_EMAIL_RECIPIENT_ALLOWLIST` | comma-separated allowed recipients in staging | `qa@example.test` |

When `DATABASE_PROVIDER=d1`, configure the Cloudflare binding and D1 migration directory in `wrangler.toml` before applying migrations:

```toml
[[d1_databases]]
binding = "DB"
database_name = "your-d1-database-name"
database_id = "your-d1-database-id"
migrations_dir = "db/migrations/d1"
```

## 12. Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Next.js dev server with Cloudflare bindings |
| `npm run build` | Next.js production build |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run check:arch` | Run the architecture guard only |
| `npm run verify` | Guard **then** typecheck — use in CI |
| `npm run preview` | Build with OpenNext and run on the Workers runtime |
| `npm run deploy` | Build and deploy to Cloudflare |
| `npm run cf-typegen` | Generate Cloudflare binding types |

## 13. What is intentionally NOT here

To stay lightweight and understandable for a small team, the foundation deliberately excludes: business modules (CRM, Projects, Marketing, Finance, Contracts), CQRS, event sourcing, microservices, domain aggregates, saga/process managers, mediator patterns, and heavy DDD. Everything here optimizes for **Cloudflare Workers + Next.js 15 + Supabase today**, with clean seams for **future provider replacement**.

## 14. Further docs

- [`docs/architecture.md`](docs/architecture.md) — layer diagram, dependency rules, and the module / provider / repository / event-bus guides.
- [`src/modules/_template/README.md`](src/modules/_template/README.md) — how to create a module, with per-layer code skeletons.
- [`db/migrations/0001_profiles.sql`](db/migrations/0001_profiles.sql) — Supabase/Postgres schema and the `nexara_exec_sql` bridge.
- [`db/migrations/d1/`](db/migrations/d1/) — Cloudflare D1/SQLite profile and credentials schema.
