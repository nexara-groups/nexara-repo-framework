# Reusable Framework Capabilities Design

## Goal

Promote proven, vendor-isolated primitives into Nexara Foundation without copying product-specific business modules, tenant data, UI, migrations, deployment configuration, or secrets.

## Scope

The work ships five independent capability commits:

1. Shared safety and list utilities.
2. Cloudflare D1 provider with explicit atomic batching.
3. Optional D1-backed JWT credentials provider.
4. Optional Cloudflare R2 image storage provider.
5. Optional transactional email providers with staging recipient containment.

## Architecture

The existing `DatabaseProvider` remains the portable minimum (`query`, `transaction`, and `dispose`). Atomic batches are expressed by a narrower `AtomicBatchDatabaseProvider` extension. D1 implements that extension; the existing Supabase provider stays usable without making a false atomicity promise.

The credential provider extends `AuthProvider` through a new `CredentialsAuthProvider` interface. It depends on a credentials repository port and does not expose password hashes through the existing profile or user repositories. Its D1 repository depends specifically on the atomic-batch extension because reset and verification redemption must be atomic.

Storage and email are independent core provider families. They are wired only when their matching environment selector is configured, so applications that do not use them do not require an R2 binding or email credentials.

## Public Interfaces

- Shared: `safeCsv`, `clampPage`, `paginationRange`, `isCrossSiteRequest`, and `httpsUrlOrNull`.
- Database: `BatchQuery` and `AtomicBatchDatabaseProvider` alongside `D1DatabaseProvider`.
- Auth: `CredentialsAuthProvider`, `CredentialsRepository`, and `JwtAuthProvider` with configurable tenant, issuer, audience, signing secret, bcrypt cost, and session lifetimes.
- Storage: `StorageProvider` and `R2StorageProvider` for bounded JPEG, PNG, and WebP uploads.
- Email: `EmailProvider`, console/unavailable providers, recipient allowlisting, and Resend/Brevo/SES adapters.

## Security Rules

- CSV values that begin with spreadsheet operators are neutralised before export.
- Browser mutations are rejected only when Fetch Metadata or Origin identifies a cross-site request; non-browser requests without Origin remain valid.
- JWT verification pins `HS256`, issuer, and audience. Reset and email-verification tokens are random, stored only as SHA-256 hashes, expire, and are single-use.
- Password failure handling performs bcrypt work for an unknown email. The production default cost is 12; tests choose a lower explicit cost.
- R2 keys are generated server-side inside validated tenant and prefix scopes. Images have a 10 MiB cap and immutable cache metadata.
- Console email redacts recipient and content. Staging allowlisting rejects malformed configuration and blocked recipients before a provider is called.

## Deliberate Exclusions

- Product modules, route handlers, React components, payment providers, PDF generation, event schemas, email templates, launch checks, and fixed tenant constants.
- Product-specific authentication flows with application-owned session paths or UI; they are not framework sources.
- A generic currency helper. Country-specific money formatting remains product-local until a framework-wide money contract is needed.

## Verification

Every capability starts with a failing Vitest test. The final framework check is `npm test && npm run verify`; the architecture guard must continue to pass and only allowed provider/wiring files may import vendor code.
