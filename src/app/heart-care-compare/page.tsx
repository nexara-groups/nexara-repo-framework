import type { Metadata } from "next";
import { HeartCareAlternative } from "@/components/heart/heart-care-alternative";

export const metadata: Metadata = {
  title: "Heart Care — visual atlas | Rise Medical Hub",
  description: "An alternate visual direction for Rise Medical Hub's heart-care education experience.",
};

export default function HeartCareComparePage() {
  return <HeartCareAlternative />;
}
