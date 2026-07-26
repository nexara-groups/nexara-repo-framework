import "server-only";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { createPublicServices, createServices, type PublicServices, type Services } from "../core";
import type { CloudflareBindings } from "../core/platform/providers/cloudflare-platform-provider";

/**
 * Edge/runtime adapter: pulls the Cloudflare bindings out of the request
 * context and builds the service container. This is the seam between the
 * Cloudflare runtime and provider-agnostic business logic. Route handlers and
 * server actions call `getServices()`; they never touch bindings directly.
 */
export function getServices(): Services {
  const { env } = getCloudflareContext();
  return createServices(env as unknown as CloudflareBindings);
}

/** Public read composition that does not need an authenticated Worker runtime. */
export function getPublicServices(): PublicServices {
  return createPublicServices();
}

/** Extract a bearer token from an incoming request's Authorization header. */
export function bearerToken(request: Request): string | null {
  const header = request.headers.get("authorization") ?? "";
  const match = /^Bearer\s+(.+)$/i.exec(header);
  return match ? match[1]!.trim() : null;
}
