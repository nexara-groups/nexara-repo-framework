# Module template

Copy this folder to create a new module:

```
cp -r src/modules/_template src/modules/<module-name>
```

This is the standard shape for every Nexara business module — **WorkHub, CRM, Projects, Marketing, Finance, Contracts**. The foundation itself stays in `src/core`, `src/infrastructure`, and `src/shared`; modules are the *only* place business features live.

> The existing `src/features/user-profile` predates this template and is kept as a minimal end-to-end sample. New modules use this four-folder layout.

## The four folders

A module is split into four layers. Dependencies point **inward only**: `presentation → application → domain`, with `infrastructure` implementing the domain's ports. Domain never imports the other three.

```
<module>/
  domain/          Pure business types + contracts. No SQL, no SDK, no framework.
  application/     Use-case services. Orchestrate domain + repositories + events.
  infrastructure/  Concrete adapters (repositories with SQL, event handlers).
  presentation/    Entry points: Next.js route handlers, server actions, UI.
```

| Layer | May import | May NOT import |
| --- | --- | --- |
| `domain` | `src/shared`, `src/core/context`, `src/core/rbac` (types), `src/core/events` (event types) | repositories' impls, providers, Supabase, Cloudflare, Next.js |
| `application` | `domain`, `src/core` interfaces (repositories, `EventBus`, `PermissionService`, `RequestContext`) | any SDK, SQL, `DatabaseProvider`, provider impls |
| `infrastructure` | `domain`, `src/core/database` (the `DatabaseProvider`), `src/core/events` | nothing app-specific from `presentation` |
| `presentation` | `application`, `src/app/_services` (DI), `next/*` | `domain` internals, `infrastructure` directly |

## Rules (enforced by `scripts/check-architecture.mjs`)

1. **No provider SDKs in business code.** Only `*/providers/*`, `container.ts`, and `app/_services.ts` may import `@supabase/*` or `@opennextjs/cloudflare`.
2. **No SQL in application services.** SQL lives in `infrastructure` repositories, behind a domain repository interface.
3. **Tenant-scoped data access.** Every repository method that reads or writes tenant data takes a `TenantContext`, and every SQL statement filters by `tenant_id`.

## How to build a module (recipe)

1. **domain/** — define entities/records and a repository *interface* (the port). Add any module event types extending `DomainEvent`.
2. **application/** — write a service that takes the repository interface + `PermissionService` (+ `EventBus` if it emits events) in its constructor, and a `RequestContext` per call. Check permissions with `permissions.canInTenant(...)`. Return `Result<T>`.
3. **infrastructure/** — implement the repository interface using the injected `DatabaseProvider`. This is the only file with SQL. Always filter by `tenant_id`.
4. **presentation/** — a route handler that calls `getServices()`, builds a `RequestContext` via `resolveRequestContext`, constructs the service, and maps `Result` → HTTP.
5. **wire it** — construct the repository in `src/core/container.ts` (the composition root) and expose it on `Services`. Register any event handlers there too.

See `domain/`, `application/`, `infrastructure/`, and `presentation/` READMEs for per-layer code skeletons, and `docs/architecture.md` for the full guide.
