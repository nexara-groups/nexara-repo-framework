import { AppError, err, ok, type Result } from "../../../shared";
import type { PublishedProgramme } from "../domain/programme";
import type { PublishedProgrammeRepository } from "../domain/published-programme-repository";

/** Public read use-cases. No SQL, provider SDK, or framework imports belong here. */
export class PublishedProgrammeService {
  constructor(private readonly programmes: PublishedProgrammeRepository) {}

  async list(): Promise<Result<readonly PublishedProgramme[]>> {
    return ok(await this.programmes.listPublished());
  }

  async findBySlug(slug: string): Promise<Result<PublishedProgramme>> {
    const normalizedSlug = slug.trim();
    if (!normalizedSlug) return err(AppError.validation("Programme slug is required"));

    const programme = await this.programmes.findPublishedBySlug(normalizedSlug);
    if (!programme) return err(AppError.notFound("Programme not found"));
    return ok(programme);
  }
}
