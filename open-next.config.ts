import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// OpenNext adapter config for deploying Next.js 15 to Cloudflare Workers.
// Incremental cache / tag cache can be wired to KV or R2 here later; kept
// minimal for the foundation.
export default defineCloudflareConfig({});
