import type { PublishedProgramme } from "../domain/programme";
import type { PublishedProgrammeRepository } from "../domain/published-programme-repository";

/**
 * Initial adapter for verified public catalogue labels. It is intentionally
 * isolated here so replacing it with a CMS or database repository is wiring,
 * not a rewrite of presentation or use-case code.
 */
export class StaticPublishedProgrammeRepository implements PublishedProgrammeRepository {
  async listPublished(): Promise<readonly PublishedProgramme[]> {
    return PROGRAMMES;
  }

  async findPublishedBySlug(slug: string): Promise<PublishedProgramme | null> {
    return PROGRAMMES.find((programme) => programme.slug === slug) ?? null;
  }
}

const PROGRAMMES: readonly PublishedProgramme[] = [
  { slug: "cybersecurity", title: "Cybersecurity", category: "security", summary: "Security foundations and practical learning." },
  { slug: "ai-machine-learning", title: "AI and Machine Learning", category: "software-data", summary: "Applied data and machine learning foundations." },
  { slug: "networking", title: "Networking", category: "infrastructure", summary: "Network concepts, systems and operations." },
  { slug: "cloud", title: "Cloud", category: "infrastructure", summary: "Cloud and infrastructure learning paths." },
  { slug: "software-development", title: "Software Development", category: "software-data", summary: "Software development foundations and practice." },
  { slug: "sap", title: "SAP", category: "enterprise", summary: "Enterprise systems learning paths." },
  { slug: "databases", title: "Databases", category: "software-data", summary: "Database concepts and practical skills." },
  { slug: "storage", title: "Storage", category: "infrastructure", summary: "Storage systems and infrastructure learning." },
];
