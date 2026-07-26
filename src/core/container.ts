import { AppError } from "../shared/errors";
import type { AuthProvider } from "./auth";
import type { DatabaseProvider } from "./database";
import type { PlatformProvider } from "./platform";
import { PermissionService } from "./rbac";
import type { ProfileRepository, UserRepository } from "./repositories";
import type { EventBus } from "./events";
import type { PublishedProgrammeRepository } from "../modules/learning-catalog/domain/published-programme-repository";
import { PublishedProgrammeService } from "../modules/learning-catalog/application/published-programme.service";

// Concrete providers + infrastructure are imported ONLY here, in the
// composition root.
import { CloudflarePlatformProvider, type CloudflareBindings } from "./platform/providers/cloudflare-platform-provider";
import { SupabaseDatabaseProvider } from "./database/providers/supabase-database-provider";
import { SupabaseAuthProvider } from "./auth/providers/supabase-auth-provider";
import { SupabaseProfileRepository, SupabaseUserRepository, InMemoryEventBus } from "../infrastructure";
import { StaticPublishedProgrammeRepository } from "../modules/learning-catalog/infrastructure/static-published-programme-repository";

/**
 * Dependency Injection — the composition root.
 *
 * This is the ONLY module in the codebase that imports concrete provider
 * implementations. Business logic and features receive the interfaces below and
 * never know which provider is behind them. To migrate (Supabase → Neon,
 * Cloudflare → AWS), change the wiring here — nothing else.
 */
/** Tenant-scoped data-access contracts (interfaces only; impls in infrastructure). */
export interface Repositories {
  readonly profiles: ProfileRepository;
  readonly users: UserRepository;
  readonly publishedProgrammes: PublishedProgrammeRepository;
}

export interface Services {
  readonly platform: PlatformProvider;
  readonly database: DatabaseProvider;
  readonly auth: AuthProvider;
  readonly permissions: PermissionService;
  readonly repositories: Repositories;
  readonly events: EventBus;
}

/**
 * Public read-model composition. It intentionally avoids auth/database runtime
 * initialization because this first catalogue adapter is static public content.
 * When a CMS or database adapter replaces it, the wiring remains here.
 */
export interface PublicServices {
  readonly learningCatalogue: PublishedProgrammeService;
}

/**
 * Build the service container from the platform environment.
 *
 * @param env Cloudflare bindings (env vars + KV/Queue). Obtained from the
 *            request context (`getCloudflareContext().env`) at the edge.
 */
export function createServices(env: CloudflareBindings): Services {
  // 1. Platform — selected first; everything else reads config through it.
  const platform = createPlatformProvider(env);

  // 2. RBAC — pure, provider-independent.
  const permissions = new PermissionService();

  // 3. Database.
  const database = createDatabaseProvider(platform);

  // 4. Auth — depends on RBAC for permission verification.
  const auth = createAuthProvider(platform, permissions);

  // 5. Repositories — domain data-access over the DatabaseProvider. Concrete
  //    implementations come from infrastructure; services see interfaces only.
  const repositories: Repositories = {
    profiles: new SupabaseProfileRepository(database),
    users: new SupabaseUserRepository(database),
    publishedProgrammes: new StaticPublishedProgrammeRepository(),
  };

  // 6. Event bus — in-process pub/sub. Register module event handlers here at
  //    composition time (e.g. events.subscribe("UserCreated", handler)).
  const events: EventBus = new InMemoryEventBus();

  return { platform, database, auth, permissions, repositories, events };
}

export function createPublicServices(): PublicServices {
  return {
    learningCatalogue: new PublishedProgrammeService(new StaticPublishedProgrammeRepository()),
  };
}

function createPlatformProvider(env: CloudflareBindings): PlatformProvider {
  const which = (typeof env.PLATFORM_PROVIDER === "string" ? env.PLATFORM_PROVIDER : "cloudflare").toLowerCase();
  switch (which) {
    case "cloudflare":
      return new CloudflarePlatformProvider(env);
    // case "aws": return new AWSPlatformProvider(env);  // future
    default:
      throw AppError.platform(`Unsupported PLATFORM_PROVIDER: ${which}`);
  }
}

function createDatabaseProvider(platform: PlatformProvider): DatabaseProvider {
  const which = (platform.getEnv("DATABASE_PROVIDER") ?? "supabase").toLowerCase();
  switch (which) {
    case "supabase":
      return new SupabaseDatabaseProvider({
        url: platform.requireEnv("SUPABASE_URL"),
        serviceRoleKey: platform.requireEnv("SUPABASE_SERVICE_ROLE_KEY"),
      });
    // case "neon": return new NeonDatabaseProvider({ ... });  // future
    // case "d1":   return new D1DatabaseProvider({ ... });    // future
    default:
      throw AppError.database(`Unsupported DATABASE_PROVIDER: ${which}`);
  }
}

function createAuthProvider(
  platform: PlatformProvider,
  permissions: PermissionService,
): AuthProvider {
  const which = (platform.getEnv("AUTH_PROVIDER") ?? "supabase").toLowerCase();
  switch (which) {
    case "supabase":
      return new SupabaseAuthProvider(
        {
          url: platform.requireEnv("SUPABASE_URL"),
          anonKey: platform.requireEnv("SUPABASE_ANON_KEY"),
        },
        permissions,
      );
    // case "betterauth": return new BetterAuthProvider({ ... }, permissions);  // future
    // case "clerk":      return new ClerkProvider({ ... }, permissions);       // future
    // case "auth0":      return new Auth0Provider({ ... }, permissions);       // future
    default:
      throw AppError.provider(`Unsupported AUTH_PROVIDER: ${which}`);
  }
}
