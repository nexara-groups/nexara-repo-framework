import type { MetadataRoute } from "next";
import { pages } from "../content/site";
import { getPublicServices } from "./_services";

const baseUrl = "https://www.yojosolutions.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = ["", "courses", "student-journey", ...Object.keys(pages)];
  const staticEntries = staticRoutes.map((path) => ({
    url: `${baseUrl}/${path}`,
    lastModified: new Date(),
  }));

  try {
    const { learningCatalogue } = getPublicServices();
    const result = await learningCatalogue.list();
    if (!result.ok) {
      console.error(
        "Sitemap: failed to load programme catalogue, falling back to static routes. Programmes will be missing from sitemap.",
        result.error
      );
      return staticEntries;
    }

    const programmeEntries = result.value.map((programme) => ({
      url: `${baseUrl}/courses/${programme.slug}`,
      lastModified: new Date(),
    }));

    return [...staticEntries, ...programmeEntries];
  } catch (error) {
    console.error(
      "Sitemap: exception while loading programme catalogue, falling back to static routes. Programmes will be missing from sitemap.",
      error
    );
    return staticEntries;
  }
}
