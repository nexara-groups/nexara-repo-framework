import { NextResponse } from "next/server";
import { resolveRequestContext } from "../../../core/context";
import { UserProfileService } from "../../../features/user-profile";
import { bearerToken, getServices } from "../../_services";
import type { AppErrorCode } from "../../../shared/errors";

// OpenNext on Cloudflare runs the Node.js runtime (nodejs_compat), which is the
// Next.js default — so no `export const runtime = "edge"` here.

/**
 * GET /api/me — returns the current user's profile.
 *
 * Demonstrates the full architecture end to end: resolve a RequestContext from
 * the request, construct the sample feature from the repository + RBAC
 * interfaces, and run it. The route never imports a provider SDK and the
 * feature never sees SQL.
 */
export async function GET(request: Request) {
  const { auth, permissions, repositories } = getServices();

  // Authentication is resolved once, here, into a RequestContext.
  const ctx = await resolveRequestContext(bearerToken(request), auth);

  const service = new UserProfileService(repositories.profiles, permissions);

  const result = await service.getCurrentProfile(ctx);
  if (!result.ok) {
    return NextResponse.json(
      { error: result.error.message, code: result.error.code },
      { status: statusFor(result.error.code) },
    );
  }

  return NextResponse.json(result.value);
}

function statusFor(code: AppErrorCode): number {
  switch (code) {
    case "UNAUTHENTICATED":
      return 401;
    case "FORBIDDEN":
      return 403;
    case "NOT_FOUND":
      return 404;
    case "VALIDATION":
      return 400;
    case "CONFLICT":
      return 409;
    default:
      return 500;
  }
}
