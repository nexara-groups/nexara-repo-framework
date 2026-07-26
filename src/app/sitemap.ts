import type { MetadataRoute } from "next";
import { pages, programmes } from "../content/site";

const baseUrl = "https://www.yojosolutions.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "courses", "student-journey", ...Object.keys(pages)];
  return [
    ...staticRoutes.map((path) => ({ url: `${baseUrl}/${path}`, lastModified: new Date() })),
    ...programmes.map((programme) => ({ url: `${baseUrl}/courses/${programme.slug}`, lastModified: new Date() })),
  ];
}
