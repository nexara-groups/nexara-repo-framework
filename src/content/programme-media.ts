import type { PublishedProgramme } from "../modules/learning-catalog";

const IMAGES: Record<string, string> = {
  cybersecurity: "/media/generated/courses/cybersecurity.webp",
  "ai-machine-learning": "/media/generated/courses/ai-ml.webp",
  networking: "/media/generated/courses/networking.webp",
  cloud: "/media/generated/courses/cloud.webp",
  "software-development": "/media/generated/courses/software.webp",
  sap: "/media/generated/courses/sap.webp",
  databases: "/media/generated/courses/database.webp",
  storage: "/media/generated/courses/storage.webp",
};

const FALLBACK = "/media/generated/courses/software.webp";

export function programmeImage(slug: string): string {
  return IMAGES[slug] ?? FALLBACK;
}

export const CATEGORY_LABELS: Record<PublishedProgramme["category"], string> = {
  security: "Security",
  infrastructure: "Infrastructure",
  "software-data": "Software and data",
  enterprise: "Enterprise",
};
