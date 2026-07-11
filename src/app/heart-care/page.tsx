import type { Metadata } from "next";
import { chapters } from "@/content/heart-guide";
import { HeartHero } from "@/components/heart/heart-hero";
import { ChapterRail } from "@/components/heart/chapter-rail";
import { HeartFlowScrolly } from "@/components/heart/heart-flow-scrolly";
import { VitalsDials } from "@/components/heart/vitals-dials";

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
        return (
          <section key={chapter.id} id={chapter.id} className="section-pad">
            <div className="container">
              <span className="eyebrow">Chapter {chapter.num}</span>
              <h2 className="hc-chapter-title">{chapter.title}</h2>
            </div>
          </section>
        );
      })}
    </main>
  );
}
