import type { PublishedProgramme } from "./programme";

/**
 * Public catalogue port. This is deliberately provider-free so a static source,
 * a CMS, or a tenant-aware database adapter can be swapped without changing the
 * application service or route handler.
 */
export interface PublishedProgrammeRepository {
  listPublished(): Promise<readonly PublishedProgramme[]>;
  findPublishedBySlug(slug: string): Promise<PublishedProgramme | null>;
}
