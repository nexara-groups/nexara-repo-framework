import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Business logic stays provider-agnostic; provider SDKs are only pulled in
  // through the implementation files under src/core/<layer>/providers.
  experimental: {
    // Server Actions / Route Handlers run on the Cloudflare Workers runtime
    // via OpenNext. Keep node built-ins out of the edge path.
  },
};

export default nextConfig;

// Enable Cloudflare bindings (KV, Queues, etc.) during `next dev`.
// Safe no-op in environments where the dev platform is unavailable.
initOpenNextCloudflareForDev();
