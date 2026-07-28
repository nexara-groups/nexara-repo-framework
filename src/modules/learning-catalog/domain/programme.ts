/** A single named curriculum unit within a programme. */
export interface ProgrammeModule {
  readonly title: string;
  readonly detail: string;
}

/** The lead trainer surfaced on a programme page. */
export interface ProgrammeTrainer {
  readonly name: string;
  readonly credential: string;
  readonly experience: string;
}

/**
 * Buyer-facing programme facts. Every figure here is INDICATIVE placeholder data
 * benchmarked against comparable Vizag/Hyderabad institutes and must be replaced
 * with confirmed numbers before public launch. Presentation labels it as such.
 */
export interface ProgrammeDetail {
  readonly durationWeeks: number;
  readonly mode: string;
  readonly level: string;
  readonly feeFromInr: number;
  readonly emiFromInr: number;
  readonly nextBatch: string;
  readonly outcomeRoles: readonly string[];
  readonly tools: readonly string[];
  readonly curriculum: readonly ProgrammeModule[];
  readonly trainer: ProgrammeTrainer;
  readonly placementTerms: string;
}

/** Public, provider-independent programme record. */
export interface PublishedProgramme {
  readonly slug: string;
  readonly title: string;
  readonly category: "security" | "infrastructure" | "software-data" | "enterprise";
  readonly summary: string;
  readonly detail: ProgrammeDetail;
}
