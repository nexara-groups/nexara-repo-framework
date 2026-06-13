import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { AppError } from "../../../shared/errors";
import type { PermissionService } from "../../rbac/permission-service";
import { isRole, type Role } from "../../rbac/roles";
import type { Permission } from "../../rbac/permissions";
import type {
  AuthProvider,
  AuthUser,
  Credentials,
  Session,
} from "../auth-provider.interface";

export interface SupabaseAuthConfig {
  url: string;
  anonKey: string;
}

/**
 * SupabaseAuthProvider — the ONLY place Supabase Auth is imported. It maps the
 * Supabase user shape onto the provider-agnostic AuthUser, and delegates all
 * permission decisions to the provider-independent RBAC PermissionService.
 *
 * Convention: a user's tenant and role live in Supabase `app_metadata`
 * (`tenant_id`, `role`). Any provider can satisfy AuthUser the same way.
 */
export class SupabaseAuthProvider implements AuthProvider {
  readonly name = "supabase";

  private readonly client: SupabaseClient;

  constructor(
    config: SupabaseAuthConfig,
    private readonly permissions: PermissionService,
  ) {
    this.client = createClient(config.url, config.anonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }

  async login(credentials: Credentials): Promise<Session> {
    const { data, error } = await this.client.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });
    if (error || !data.session) {
      throw AppError.unauthenticated(error?.message ?? "Login failed");
    }
    return this.toSession(data.session.access_token, data.user, data.session.expires_at);
  }

  async logout(accessToken: string): Promise<void> {
    const { error } = await this.client.auth.admin.signOut(accessToken);
    if (error) throw AppError.provider(`Logout failed: ${error.message}`, error);
  }

  async getCurrentUser(accessToken: string): Promise<AuthUser | null> {
    const { data, error } = await this.client.auth.getUser(accessToken);
    if (error || !data.user) return null;
    return this.toAuthUser(data.user);
  }

  async getSession(accessToken: string): Promise<Session | null> {
    const user = await this.getCurrentUser(accessToken);
    if (!user) return null;
    return { user, accessToken };
  }

  verifyPermission(user: AuthUser, permission: Permission): boolean {
    // Provider-independent: the RBAC service owns the decision.
    return this.permissions.can(user.role, permission);
  }

  // --- mapping helpers (Supabase-specific shape lives only here) ---

  private toSession(
    accessToken: string,
    rawUser: SupabaseUserLike,
    expiresAtSeconds?: number,
  ): Session {
    return {
      user: this.toAuthUser(rawUser),
      accessToken,
      expiresAt: expiresAtSeconds ? expiresAtSeconds * 1000 : undefined,
    };
  }

  private toAuthUser(rawUser: SupabaseUserLike): AuthUser {
    const meta = (rawUser.app_metadata ?? {}) as Record<string, unknown>;
    const tenantId = typeof meta.tenant_id === "string" ? meta.tenant_id : "";
    const roleRaw = typeof meta.role === "string" ? meta.role : "member";
    const role: Role = isRole(roleRaw) ? roleRaw : "member";

    if (!tenantId) {
      throw AppError.provider("Authenticated user is missing tenant_id in app_metadata");
    }
    if (!rawUser.email) {
      throw AppError.provider("Authenticated user is missing an email");
    }

    return {
      userId: rawUser.id,
      tenantId,
      email: rawUser.email,
      role,
      displayName:
        typeof rawUser.user_metadata?.["display_name"] === "string"
          ? (rawUser.user_metadata["display_name"] as string)
          : undefined,
    };
  }
}

/** Narrow structural view of the Supabase user we depend on. */
interface SupabaseUserLike {
  id: string;
  email?: string;
  app_metadata?: Record<string, unknown>;
  user_metadata?: Record<string, unknown>;
}
