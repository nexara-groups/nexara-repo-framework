import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
import { fileURLToPath } from "node:url";

const projectRoot = fileURLToPath(new URL(".", import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: projectRoot,
  async redirects() {
    return [
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/about-us.html", destination: "/about-us", permanent: true },
      { source: "/courses.html", destination: "/courses", permanent: true },
      { source: "/faculty.html", destination: "/faculty", permanent: true },
      { source: "/events.html", destination: "/events", permanent: true },
      { source: "/insights.html", destination: "/insights", permanent: true },
      { source: "/careers.html", destination: "/careers", permanent: true },
      { source: "/faqs.html", destination: "/faqs", permanent: true },
      { source: "/contact.html", destination: "/contact", permanent: true },
      { source: "/portal.html", destination: "/portal", permanent: true },
      { source: "/student-journey.html", destination: "/student-journey", permanent: true },
      { source: "/services.html", destination: "/services", permanent: true },
      { source: "/cyber-security-trainings.html", destination: "/courses/cybersecurity", permanent: true },
      { source: "/ai-ml-programs.html", destination: "/courses/ai-machine-learning", permanent: true },
      { source: "/networking-trainings.html", destination: "/courses/networking", permanent: true },
      { source: "/cloud-trainings.html", destination: "/courses/cloud", permanent: true },
      { source: "/software-trainings.html", destination: "/courses/software-development", permanent: true },
      { source: "/sap-training.html", destination: "/courses/sap", permanent: true },
      { source: "/sap-trainings.html", destination: "/courses/sap", permanent: true },
      { source: "/sap-traininsg.html", destination: "/courses/sap", permanent: true },
      { source: "/database-trainings.html", destination: "/courses/databases", permanent: true },
      { source: "/storage-trainings.html", destination: "/courses/storage", permanent: true },
      { source: "/placement-and-career-services.html", destination: "/placement-and-career-services", permanent: true },
      { source: "/cyber-security-services.html", destination: "/cyber-security-services", permanent: true },
      { source: "/it-consulting-services.html", destination: "/it-consulting-services", permanent: true },
      { source: "/physical-security-services.html", destination: "/physical-security-services", permanent: true },
      { source: "/staff-augmentation.html", destination: "/staff-augmentation", permanent: true },
      // Bare (extensionless) forms of the legacy programme slugs. These used to
      // be served by a branch in src/app/[slug]/page.tsx that mapped legacySlug
      // -> programme detail; that branch is gone, so the redirect must carry
      // the route now. Mirrors the .html destinations above exactly.
      { source: "/cyber-security-trainings", destination: "/courses/cybersecurity", permanent: true },
      { source: "/ai-ml-programs", destination: "/courses/ai-machine-learning", permanent: true },
      { source: "/networking-trainings", destination: "/courses/networking", permanent: true },
      { source: "/cloud-trainings", destination: "/courses/cloud", permanent: true },
      { source: "/software-trainings", destination: "/courses/software-development", permanent: true },
      { source: "/sap-training", destination: "/courses/sap", permanent: true },
      { source: "/sap-trainings", destination: "/courses/sap", permanent: true },
      { source: "/sap-traininsg", destination: "/courses/sap", permanent: true },
      { source: "/database-trainings", destination: "/courses/databases", permanent: true },
      { source: "/storage-trainings", destination: "/courses/storage", permanent: true },
    ];
  },
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
