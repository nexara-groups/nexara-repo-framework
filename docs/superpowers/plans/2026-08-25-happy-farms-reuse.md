# Happy Farms Reuse Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add independently selectable, tested framework capabilities distilled from Happy Farms without importing product behavior.

**Architecture:** Shared utilities remain zero-dependency. D1 adds an atomic-batch database extension instead of weakening the existing portable provider contract. Credentials auth, R2 storage, and email are optional provider families selected only when configured by the composition root.

**Tech Stack:** TypeScript strict, Next.js 15, Cloudflare Workers bindings, Vitest, `bcryptjs`, `jose`, `aws4fetch`.

## Global Constraints

- Preserve the architecture guard: only provider and composition-root files import vendor packages.
- Never commit `.env*`, `node_modules`, `tsconfig.tsbuildinfo`, generated Cloudflare types, product names, fixed tenant IDs, or product UI.
- Keep Supabase as the default provider; selecting D1, JWT, R2, or email requires explicit environment configuration.
- New behavior is test-first and each capability is committed separately.

---

### Task 1: Shared safety utilities

**Files:**
- Create: `src/shared/csv.ts`, `src/shared/pagination.ts`, `src/shared/request-origin.ts`, `src/shared/url.ts`, `tests/shared/safety-utilities.test.ts`
- Modify: `src/shared/index.ts`, `package.json`, `package-lock.json`, `.gitignore`

**Interfaces:**
- Produces: `safeCsv(rows)`, `clampPage(value,total,pageSize)`, `paginationRange(total,page,pageSize,itemCount)`, `isCrossSiteRequest(request)`, `httpsUrlOrNull(value)`.

- [ ] **Step 1: Write failing tests**

```ts
expect(safeCsv([["=SUM(1,2)"]])).toContain("'=SUM(1,2)");
expect(clampPage("999", 76, 25)).toBe(4);
expect(isCrossSiteRequest(new Request("https://app.test", { headers: { origin: "https://evil.test" } }))).toBe(true);
expect(httpsUrlOrNull("http://app.test")).toBeNull();
```

- [ ] **Step 2: Run the test and confirm missing-module failure**

Run: `npm test -- tests/shared/safety-utilities.test.ts`

- [ ] **Step 3: Implement the dependency-free helpers and exports**

```ts
export function httpsUrlOrNull(value: string | null | undefined): string | null {
  if (!value) return null;
  try { const url = new URL(value); return url.protocol === "https:" ? url.toString() : null; }
  catch { return null; }
}
```

- [ ] **Step 4: Run focused tests and commit**

Run: `npm test -- tests/shared/safety-utilities.test.ts`

Commit: `Add shared safety utilities`

### Task 2: D1 database provider

**Files:**
- Create: `src/core/database/providers/d1-database-provider.ts`, `tests/core/d1-database-provider.test.ts`
- Modify: `src/core/database/database-provider.interface.ts`, `src/core/database/index.ts`, `src/core/container.ts`, `src/core/platform/providers/cloudflare-platform-provider.ts`, `src/infrastructure/index.ts`

**Interfaces:**
- Produces: `AtomicBatchDatabaseProvider`, `BatchQuery`, `D1DatabaseProvider`, and `DATABASE_PROVIDER=d1` selection.
- Consumes: `DatabaseProvider`, `CloudflareBindings`, `AppError`.

- [ ] **Step 1: Write failing provider tests**

```ts
const result = await provider.batch([{ sql: "update x set role = $1 where tenant_id = $2", params: ["admin", "tenant"] }]);
expect(prepared[0]).toEqual({ sql: "update x set role = ?1 where tenant_id = ?2", values: ["admin", "tenant"] });
expect(result[0]).toEqual({ rows: [], rowCount: 1 });
```

- [ ] **Step 2: Run the test and confirm missing-provider failure**

Run: `npm test -- tests/core/d1-database-provider.test.ts`

- [ ] **Step 3: Add the narrow atomic-batch interface and D1 implementation**

```ts
export interface AtomicBatchDatabaseProvider extends DatabaseProvider {
  batch(queries: readonly BatchQuery[]): Promise<readonly QueryResult[]>;
}
```

- [ ] **Step 4: Select D1 only when configured, run focused tests, and commit**

Run: `npm test -- tests/core/d1-database-provider.test.ts && npm run verify`

Commit: `Add D1 database provider`

### Task 3: Optional D1 JWT credentials provider

**Files:**
- Create: `src/core/auth/credentials-auth-provider.interface.ts`, `src/core/auth/credentials-repository.interface.ts`, `src/core/auth/providers/jwt-auth-provider.ts`, `src/infrastructure/repositories/sql-credentials-repository.ts`, `db/migrations/d1/0001_profiles.sql`, `db/migrations/d1/0002_credentials.sql`, `tests/core/jwt-auth-provider.test.ts`, `tests/core/d1-migrations.test.mjs`
- Modify: `src/core/auth/index.ts`, `src/core/container.ts`, `src/infrastructure/index.ts`, `package.json`, `package-lock.json`

**Interfaces:**
- Produces: `CredentialsAuthProvider` and `JwtAuthProvider` configured by tenant ID, issuer, audience, secret, bcrypt cost, and session lifetimes. Public registration always creates a `member`; elevated roles require an authenticated provisioning flow.
- Consumes: `AtomicBatchDatabaseProvider`, `PermissionService`, `TenantContext`, `AppError`.

- [ ] **Step 1: Write failing auth tests**

```ts
await expect(auth.login({ email: "missing@example.test", password: "wrong" })).rejects.toMatchObject({ code: "UNAUTHENTICATED" });
const request = await auth.requestPasswordReset("member@example.test");
await expect(auth.resetPassword(request!.token, "new-password")).resolves.toBe(true);
```

- [ ] **Step 2: Run the test and confirm missing-provider failure**

Run: `npm test -- tests/core/jwt-auth-provider.test.ts`

- [ ] **Step 3: Implement generic token and credential operations**

```ts
new SignJWT({ tenantId, email, role, sv })
  .setProtectedHeader({ alg: "HS256" })
  .setIssuer(config.issuer)
  .setAudience(config.audience);
```

- [ ] **Step 4: Implement the D1 repository/migration, run focused tests, and commit**

Run: `npm test -- tests/core/jwt-auth-provider.test.ts && npm run verify`

Commit: `Add D1 JWT credentials provider`

### Task 4: Optional R2 image storage provider

**Files:**
- Create: `src/core/storage/storage-provider.interface.ts`, `src/core/storage/providers/r2-storage-provider.ts`, `src/core/storage/index.ts`, `tests/core/r2-storage-provider.test.ts`
- Modify: `src/core/index.ts`, `src/core/container.ts`

**Interfaces:**
- Produces: optional `services.storage` when `STORAGE_PROVIDER=r2` and a `NEXARA_MEDIA` binding exists.
- Consumes: `AppError` and structural R2 binding types.

- [ ] **Step 1: Write failing storage tests**

```ts
await expect(storage.putImage({ tenantId: "tenant", prefix: "events", contentType: "image/svg+xml", bytes: new ArrayBuffer(1) }))
  .rejects.toMatchObject({ code: "VALIDATION" });
```

- [ ] **Step 2: Run the test and confirm missing-provider failure**

Run: `npm test -- tests/core/r2-storage-provider.test.ts`

- [ ] **Step 3: Implement bounded image persistence and controlled key generation**

```ts
const key = `${input.tenantId}/${input.prefix}/${crypto.randomUUID()}.${extension}`;
```

- [ ] **Step 4: Run focused tests and commit**

Run: `npm test -- tests/core/r2-storage-provider.test.ts && npm run verify`

Commit: `Add R2 image storage provider`

### Task 5: Optional transactional email providers

**Files:**
- Create: `src/core/email/email-provider.interface.ts`, `src/core/email/providers/{console,unavailable,recipient-allowlist,resend,brevo,ses}-email-provider.ts`, `src/core/email/index.ts`, `tests/core/email-provider.test.ts`
- Modify: `src/core/index.ts`, `src/core/container.ts`, `package.json`, `package-lock.json`

**Interfaces:**
- Produces: optional `services.email` selected by `EMAIL_PROVIDER`; `STAGING_EMAIL_RECIPIENT_ALLOWLIST` constrains configured staging sends.
- Consumes: `PlatformProvider`, `AppError`, and `aws4fetch` only inside the SES provider.

- [ ] **Step 1: Write failing email tests**

```ts
await expect(blocked.send({ to: "blocked@example.test", subject: "Secret", text: "Secret" })).rejects.toThrow();
expect(loggedOutput).not.toContain("recipient@example.test");
```

- [ ] **Step 2: Run the test and confirm missing-provider failure**

Run: `npm test -- tests/core/email-provider.test.ts`

- [ ] **Step 3: Implement provider ports, safe fallbacks, staging containment, and vendor adapters**

```ts
if (!allowlist.has(message.to.toLowerCase())) throw AppError.forbidden("Staging recipient is not allowlisted");
```

- [ ] **Step 4: Run focused tests, full framework verification, and commit**

Run: `npm test && npm run verify`

Commit: `Add transactional email providers`
