# Nexara Foundation — Architecture

A lightweight, provider-agnostic foundation for building Nexara modules on **Cloudflare Workers + Next.js 15 + Supabase (today)**, designed so any provider can be swapped later without touching business code.

What this is **not**: no CQRS, no event sourcing, no microservices, no domain aggregates, no saga/mediator patterns, no heavy DDD. The goal is something a small team can hold in their heads.

## 1. Layer diagram

```
                         ┌─────────────────────────────────────────────┐
   HTTP / UI  ───────▶   │  presentation   (Next.js routes, actions)    │
                         └───────────────────────┬─────────────────────┘
                                                 │ depends on
                         ┌───────────────────────▼─────────────────────┐
                         │  application    (services / use-cases)        │
                         │  RequestContext · PermissionService · EventBus│
                         └───────────────────────┬─────────────────────┘
                                                 │ depends on (interfaces only)
                         ┌───────────────────────▼─────────────────────┐
                         │  domain         (entities + repository PORTS) │
                         └───────────────────────▲─────────────────────┘
                                                 │ implements ports
                         ┌───────────────────────┴─────────────────────┐
                         │  infrastructure (repositories w/ SQL, bus,    │
                         │                  provider implementations)    │
                         └───────────────────────┬─────────────────────┘
                                                 │ uses
                         ┌───────────────────────▼─────────────────────┐
                         │  core providers: PlatformProvider ·           │
                         │  DatabaseProvider · AuthProvider              │
                         └───────────────────────┬─────────────────────┘
                                                 │ wrap
                         ┌───────────────────────▼─────────────────────┐
                         │  Cloudflare · Supabase · (future: Neon, D1,   │
                         │  BetterAuth, Clerk, Auth0, AWS)               │
                         └─────────────────────────────────────────────┘

   Composition root: src/core/container.ts  → builds everything, the ONLY
   place concrete providers/implementations are imported.
```

Flow at runtime: `presentation → application → repository (port) → repository impl → DatabaseProvider → Supabase`. Identity is resolved once into a `RequestContext` at the edge and passed down.

## 2. Dependency rules

The single rule: **dependencies point inward, toward interfaces.** Business code depends on contracts; concrete providers are wired only at the composition root.

```
Business Logic  →  Interfaces  →  Provider / Repository Implementations   ✅
Business Logic  →  Supabase SDK / Cloudflare APIs / raw SQL               ❌
```

| From | May depend on | May NOT depend on |
| --- | --- | --- |
| `domain` | `shared`, core *types* (context, rbac, events) | repositories impls, providers, any SDK, Next.js |
| `application` / `features` | `domain`, core interfaces (`*Repository`, `EventBus`, `PermissionService`, `RequestContext`) | `DatabaseProvider`, SQL, any SDK |
| `infrastructure` | `domain`, `core/database` (`DatabaseProvider`), `core/events` | `presentation` |
| `presentation` | `application`, `app/_services` (DI), `next/*` | `infrastructure` directly |
| `core/*/providers` | the provider SDK it wraps | other providers, business code |

These are **mechanically enforced** by `scripts/check-architecture.mjs` (run via `npm run verify`):

1. Only `*/providers/*`, `core/container.ts`, and `app/_services.ts` may import `@supabase/*` or `@opennextjs/cloudflare`.
2. Service layers (`features/**`, `modules/*/application/**`) may not import the database layer or call `.query()`.
3. Every SQL statement under any `infrastructure/` folder must filter by `tenant_id`.

## 3. Module creation guide

Modules are the only place business features live (`WorkHub`, `CRM`, `Projects`, `Marketing`, `Finance`, `Contracts`). The foundation (`core`, `infrastructure`, `shared`) is shared by all of them.

```bash
cp -r src/modules/_template src/modules/work-hub
```

Each module has four layers — `domain/`, `application/`, `infrastructure/`, `presentation/` — described with code skeletons in `src/modules/_template` (read its `README.md` and each folder's `README.md`).

Steps:

1. **domain/** — entities/records + repository interface (port) + any domain events. Pure types.
2. **application/** — a service taking the port + `PermissionService` (+ `EventBus`) in its constructor and a `RequestContext` per call. Authorize, act via the port, return `Result<T>`.
3. **infrastructure/** — implement the port with SQL through `DatabaseProvider`; always filter `tenant_id`.
4. **presentation/** — a thin route handler: resolve context → build service → call use-case → map `Result` to a response.
5. **wire it** in `src/core/container.ts`: construct the repository, add it to `Repositories`/`Services`, and register event handlers.

Keep modules independent: a module must not import another module's internals. If two modules need to react to each other, use the **event bus**.

## 4. Provider implementation guide

A provider wraps a vendor behind a core interface. There are three: `PlatformProvider` (env/KV/queue/cache/scheduler), `DatabaseProvider` (query/transaction), `AuthProvider` (login/session/permission).

To add one (e.g. Neon database):

1. Create `src/core/database/providers/neon-database-provider.ts` implementing `DatabaseProvider`. This file (under `*/providers/*`) is allowed to import the Neon SDK.
2. Translate vendor errors into `AppError` so business code only sees `AppError`.
3. Add a `case "neon"` to `createDatabaseProvider()` in `src/core/container.ts`.
4. Set `DATABASE_PROVIDER=neon`.

No business code changes. The same recipe applies to `AuthProvider` (BetterAuth/Clerk/Auth0) and `PlatformProvider` (AWS). Auth providers receive the `PermissionService` so permission checks stay identical across vendors.

## 5. Repository guide

Repositories are the domain's data-access contracts. Interfaces live in `src/core/repositories` (or a module's `domain/`); SQL-bearing implementations live in `src/infrastructure` (or a module's `infrastructure/`).

Rules:

- Services depend on the **interface**, never the implementation — and never write SQL.
- Implementations run SQL through `DatabaseProvider` (portable across Supabase/Neon/D1).
- Map database rows (snake_case) to domain records (camelCase) inside the repository.
- Return domain records or `null`; throw `AppError` for genuine failures.

### Tenant safety (important)

The platform is multi-tenant. To prevent accidental cross-tenant reads/writes:

- **Every repository method that touches tenant data takes a `TenantContext`** as its first argument. This is a convention across all repositories (`ProfileRepository`, `UserRepository`, and every module repo).
- **Every SQL statement filters by `tenant_id`** using the value from `TenantContext` — never trust an id alone. The guard (rule 3) fails the build if an infrastructure SQL statement omits `tenant_id`.
- `RequestContext.tenant` is derived from the authenticated user's tenant at the edge, and `PermissionService.canInTenant(user, perm, tenantId)` also refuses actions across tenant boundaries.
- For a genuinely global (non-tenant) table, add a `no-tenant` comment inside the SQL to opt that statement out of the check — use sparingly and review carefully.

Example (note both the `TenantContext` parameter and the `tenant_id` predicate):

```ts
async findByUser(tenant: TenantContext, userId: UserId) {
  const { rows } = await this.db.query(
    `select ... from profiles where user_id = $1 and tenant_id = $2 limit 1`,
    [userId, tenant.tenantId],
  );
  ...
}
```

## 6. Event bus guide

A minimal in-process publish/subscribe (`src/core/events`), implemented by `InMemoryEventBus` (`src/infrastructure/events`). It exists so modules can react to each other without importing each other — nothing more. **Not** CQRS, event sourcing, or distributed messaging.

```ts
// define an event (extends DomainEvent)
interface UserCreated extends DomainEvent { type: "UserCreated"; userId: UserId; email: string }

// subscribe at composition time (in container.ts)
events.subscribe<UserCreated>("UserCreated", async (e) => { /* send welcome notification */ });

// publish from a service
await events.publish({ type: "UserCreated", occurredAt: Date.now(), tenantId, userId, email });
```

Runtime note: on Cloudflare Workers each request runs in an isolate, so subscriptions are **per request/isolate** — register handlers in the DI container, not inside request code. For durable or cross-request delivery (retries, fan-out across instances), publish to `PlatformProvider.queue()` instead; the in-memory bus is for synchronous, in-process decoupling only.

Event names known today: `UserCreated`, `TaskCreated`, `NotificationSent` (examples — `TaskCreated` does not imply a Tasks module). Modules add their own by extending `DomainEvent`.

---

### Quick reference

| Concern | Lives in | Swap by |
| --- | --- | --- |
| Runtime/env/KV/queue/cache | `PlatformProvider` | env `PLATFORM_PROVIDER` |
| Data store | `DatabaseProvider` | env `DATABASE_PROVIDER` |
| Identity | `AuthProvider` | env `AUTH_PROVIDER` |
| Authorization | `PermissionService` (RBAC) | edit role→permission map |
| Data access | repositories | implement port in infrastructure |
| Cross-module reactions | `EventBus` | subscribe/publish |
| Request identity + tenant | RequestContext / TenantContext | n/a |
| Wiring | src/core/container.ts | add a case / construct impl |

## 7. Technical SEO & Crawlability Guidelines

Since Nexara platforms serve public and client-facing interfaces, ensuring search engines can fully crawl, index, and rank our modules is a critical requirement. The following standard rules must be followed:

1. **Pathname-Based Routing Only:** 
   * **Rule:** Never use Hash-Based Routing (`#`) for page navigation. Search engine crawlers (like Googlebot) strip hash fragments, making all subpages invisible.
   * **Implementation:** Always use standard, clean URL pathnames (e.g., `/trust/academy`).

2. **Crawlable Navigation Elements:**
   * **Rule:** Always use standard HTML anchor tags (`<a>` or Next.js `<Link>`) for navigating between pages. 
   * **Implementation:** Never trigger page navigation solely via `<button onClick={...}>` or JavaScript handlers. Crawlers do not click buttons or execute custom click script handlers to discover routes. If custom animations are required on transition, intercept the anchor click using `e.preventDefault()`, run the transition, and then trigger the route.

3. **Page-Specific Metadata:**
   * **Rule:** Every page must export page-specific metadata (`title`, `description`, `canonical URL`, and Open Graph tags).
   * **Implementation:** Use the `@shared/seo` helper function `generateMetadata` in every presentation layout or page module to keep tags standardized and prevent search engines from consolidating your pages into the homepage.

4. **Sitemap & Robots Maintenance:**
   * **Rule:** Any public indexable page added to a module must be registered in the dynamic sitemap generator.
   * **Implementation:** Update `src/app/sitemap.ts` to include the route path. Crawler permissions are controlled dynamically via `src/app/robots.ts`.
