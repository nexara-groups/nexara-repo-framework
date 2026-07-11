import type { MetadataRoute } from "next";
import { posts } from "@/content/site-data";

const BASE = "https://risemedicalhub.com";
const pages = ["", "/about", "/services", "/heart-care", "/eecp-therapy", "/diagnostics", "/pharmacy", "/opd", "/doctors", "/health-packages", "/health-camps", "/testimonials", "/resources", "/gallery", "/appointment", "/contact"];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...pages.map((p) => ({ url: `${BASE}${p}`, changeFrequency: "monthly" as const, priority: p === "" ? 1 : p === "/heart-care" || p === "/eecp-therapy" ? 0.9 : 0.7 })),
    ...posts.map((post) => ({ url: `${BASE}/resources/${post.slug}`, lastModified: new Date(post.date), changeFrequency: "yearly" as const, priority: 0.6 })),
  ];
}
