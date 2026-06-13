import { isAuthenticated, type RequestContext } from "../../core/context";
import type { PermissionService } from "../../core/rbac";
import type { ProfileRepository } from "../../core/repositories";
import { AppError } from "../../shared/errors";
import { err, ok, type Result } from "../../shared/result";
import type { UpdateProfileInput, UserProfile } from "./user-profile.types";

/**
 * SAMPLE FEATURE — Current User Profile.
 *
 * Exists ONLY to demonstrate the architecture. It composes:
 *   - RequestContext     → who is calling + their tenant (resolved at the edge)
 *   - PermissionService  → may they perform this action (tenant-aware RBAC)
 *   - ProfileRepository  → read/write data WITHOUT any SQL in the service
 *
 * The service contains ZERO SQL and imports no database/auth SDK. All data
 * access goes through the repository interface; all identity through the
 * request context.
 */
export class UserProfileService {
  constructor(
    private readonly profiles: ProfileRepository,
    private readonly permissions: PermissionService,
  ) {}

  /** Get the profile of the currently authenticated user. */
  async getCurrentProfile(ctx: RequestContext): Promise<Result<UserProfile>> {
    if (!isAuthenticated(ctx)) return err(AppError.unauthenticated());

    if (!this.permissions.canInTenant(ctx.user, "profile:read:self", ctx.tenant.tenantId)) {
      return err(AppError.forbidden());
    }

    const profile = await this.profiles.findByUser(ctx.tenant, ctx.user.userId);
    if (!profile) return err(AppError.notFound("Profile not found"));

    return ok(profile);
  }

  /** Update the current user's own profile (self-service fields only). */
  async updateCurrentProfile(
    ctx: RequestContext,
    input: UpdateProfileInput,
  ): Promise<Result<UserProfile>> {
    if (!isAuthenticated(ctx)) return err(AppError.unauthenticated());

    if (!this.permissions.canInTenant(ctx.user, "profile:update:self", ctx.tenant.tenantId)) {
      return err(AppError.forbidden());
    }

    if (input.displayName !== undefined && input.displayName.trim().length === 0) {
      return err(AppError.validation("displayName cannot be empty"));
    }

    const profile = await this.profiles.updateDisplayName(
      ctx.tenant,
      ctx.user.userId,
      input.displayName ?? null,
    );
    if (!profile) return err(AppError.notFound("Profile not found"));

    return ok(profile);
  }
}
