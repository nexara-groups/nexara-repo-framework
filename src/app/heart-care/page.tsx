import type { Metadata } from "next";
import { chapters, heartFaqs } from "@/content/heart-guide";
import { HeartHero } from "@/components/heart/heart-hero";
import { ChapterRail } from "@/components/heart/chapter-rail";
import { HeartFlowScrolly } from "@/components/heart/heart-flow-scrolly";
import { VitalsDials } from "@/components/heart/vitals-dials";
import { ArteryScrolly } from "@/components/heart/artery-scrolly";
import { ConditionsGuide } from "@/components/heart/conditions-guide";
import { TriageSigns } from "@/components/heart/triage-signs";
import { ProtectHabits, HeartTests, TreatmentPath, HeartCloser } from "@/components/heart/protect-tests-treat";

const DESCRIPTION =
  "How your heart works, the numbers that matter, warning signs, tests, and treatments — a plain-language guide from Rise Medical Hub, Madhurawada.";

export const metadata: Metadata = {
  title: "Heart Care — a complete, plain-language guide",
  description: DESCRIPTION,
};

// MedicalWebPage schema with only verifiable facts. `reviewedBy` is omitted
// until a named clinician signs off on the content.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "MedicalWebPage",
  name: "Heart Care — a complete, plain-language guide",
  url: "https://risemedicalhub.com/heart-care",
  description: DESCRIPTION,
  about: { "@type": "MedicalCondition", name: "Cardiovascular health" },
  lastReviewed: "2026-07-11",
  inLanguage: "en-IN",
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: heartFaqs.map((faq) => ({
    "@type": "Question",
    name: faq.q,
    acceptedAnswer: { "@type": "Answer", text: faq.a },
  })),
};

export default function HeartCarePage() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <HeartHero />
      <ChapterRail />
      {chapters.map((chapter) => {
        if (chapter.id === "how-it-works") return <HeartFlowScrolly key={chapter.id} />;
        if (chapter.id === "numbers") return <VitalsDials key={chapter.id} />;
        if (chapter.id === "narrowing") return <ArteryScrolly key={chapter.id} />;
        if (chapter.id === "conditions") return <ConditionsGuide key={chapter.id} />;
        if (chapter.id === "warning-signs") return <TriageSigns key={chapter.id} />;
        if (chapter.id === "protect") return <ProtectHabits key={chapter.id} />;
        if (chapter.id === "tests") return <HeartTests key={chapter.id} />;
        return <TreatmentPath key={chapter.id} />;
      })}
      <HeartCloser />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c") }}
      />
    </main>
  );
}
