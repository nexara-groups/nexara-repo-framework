type ChapterSourceKey =
  | "flow"
  | "vitals"
  | "arteries"
  | "conditions"
  | "warning"
  | "protect"
  | "tests"
  | "treatment";

type Source = { title: string; publisher: string; href: string };

const SOURCES: Record<ChapterSourceKey, Source[]> = {
  flow: [
    { title: "How the heart works", publisher: "US National Heart, Lung, and Blood Institute", href: "https://www.nhlbi.nih.gov/health/heart" },
  ],
  vitals: [
    { title: "2025 high blood pressure guideline", publisher: "American Heart Association", href: "https://professional.heart.org/en/science-news/2025-high-blood-pressure-guideline/top-things-to-know" },
    { title: "Target and resting heart rates", publisher: "American Heart Association", href: "https://www.heart.org/en/healthy-living/exercise-and-physical-activity/fitness-basics/target-heart-rates" },
    { title: "Diabetes tests and diagnosis", publisher: "US National Institute of Diabetes and Digestive and Kidney Diseases", href: "https://www.niddk.nih.gov/health-information/diabetes/overview/tests-diagnosis" },
  ],
  arteries: [
    { title: "Heart attack explained", publisher: "American Heart Association", href: "https://www.heart.org/en/health-topics/heart-attack/heart-attack-explained" },
  ],
  conditions: [
    { title: "What is cardiovascular disease?", publisher: "American Heart Association", href: "https://www.heart.org/en/health-topics/consumer-healthcare/what-is-cardiovascular-disease" },
    { title: "Heart and vascular diseases", publisher: "US National Heart, Lung, and Blood Institute", href: "https://www.nhlbi.nih.gov/science/heart-and-vascular-diseases" },
  ],
  warning: [
    { title: "Warning signs of a heart attack", publisher: "American Heart Association", href: "https://www.heart.org/en/health-topics/heart-attack/warning-signs-of-a-heart-attack" },
    { title: "108 emergency call centre", publisher: "Andhra Pradesh Health, Medical & Family Welfare Department", href: "https://hmfw.ap.gov.in/108-call-center.aspx" },
  ],
  protect: [
    { title: "Cardiovascular diseases: prevention and risk factors", publisher: "World Health Organization", href: "https://www.who.int/news-room/fact-sheets/detail/cardiovascular-diseases-(cvds)" },
    { title: "Physical activity", publisher: "World Health Organization", href: "https://www.who.int/news-room/fact-sheets/detail/physical-activity" },
  ],
  tests: [
    { title: "Electrocardiogram (ECG)", publisher: "American Heart Association", href: "https://www.heart.org/en/health-topics/heart-attack/diagnosing-a-heart-attack/electrocardiogram" },
    { title: "Heart tests", publisher: "US National Heart, Lung, and Blood Institute", href: "https://www.nhlbi.nih.gov/health/heart-tests" },
  ],
  treatment: [
    { title: "2023 chronic coronary disease guideline", publisher: "American Heart Association / American College of Cardiology", href: "https://professional.heart.org/-/media/PHD-Files-2/Science-News/2/2023/2023_chronic_coronary_disease_guideline_slide_set.pdf" },
    { title: "EECP national coverage criteria", publisher: "US Centers for Medicare & Medicaid Services", href: "https://www.cms.gov/medicare-coverage-database/view/ncd.aspx?NCDId=97" },
  ],
};

export function ChapterSources({ chapter, tone = "light" }: { chapter: ChapterSourceKey; tone?: "light" | "dark" }) {
  return (
    <details className={`chapter-sources chapter-sources-${tone}`}>
      <summary>
        <span><small>Evidence</small> Sources for this chapter</span>
        <b aria-hidden="true">+</b>
      </summary>
      <div className="chapter-source-panel">
        <p>Medical sources checked 14 July 2026. Patient education only—not a diagnosis or individual treatment plan.</p>
        <ul>
          {SOURCES[chapter].map((source) => (
            <li key={source.href}>
              <a href={source.href} target="_blank" rel="noreferrer">
                <span><strong>{source.title}</strong><small>{source.publisher}</small></span>
                <b aria-hidden="true">↗</b>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </details>
  );
}
