import type { MetadataRoute } from "next";

/**
 * Dynamic Sitemap Generator.
 * Lists all crawlable routes within the Nexara platform modules.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://nexaragroups.com";

  // Base routes of the application platform.
  // Add new business module index paths here as modules are developed.
  const routes = [
    "",
    // E.g., "trust", "neo", "trust/academy", etc.
  ];

  return routes.map((route) => ({
    url: `${baseUrl}/${route}`.replace(/\/$/, ""),
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));
}
