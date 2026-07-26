/** Public, provider-independent programme record. */
export interface PublishedProgramme {
  readonly slug: string;
  readonly title: string;
  readonly category: "security" | "infrastructure" | "software-data" | "enterprise";
  readonly summary: string;
}
