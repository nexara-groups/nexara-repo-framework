import Image from "next/image";
import { CourseLedger } from "../../components/catalogue/course-ledger";
import { PageFrame } from "../../components/layout/page-frame";
import { getPublicServices } from "../_services";

export const metadata = { title: "Programmes" };

export default async function CoursesPage() {
  const { learningCatalogue } = getPublicServices();
  const result = await learningCatalogue.list();
  if (!result.ok) throw new Error(result.error.message);

  return (
    <PageFrame>
      <section className="page-hero page-hero--compact catalogue-hero">
        <div className="page-hero__media" aria-hidden="true">
          <Image
            src="/media/cyber/hero-signal.jpg"
            alt=""
            width={1915}
            height={821}
            priority
          />
        </div>
        <div className="page-hero__scrim" aria-hidden="true" />
        <div className="shell page-hero__content">
          <div>
            <p className="eyebrow">Published programmes</p>
            <h1 id="catalogue-title">Choose by the work you want to do.</h1>
            <p>Current level, curriculum, schedule, and fee are confirmed with an advisor.</p>
          </div>
        </div>
      </section>
      <section className="catalogue shell section" aria-labelledby="catalogue-title">
        <CourseLedger programmes={result.value} />
      </section>
    </PageFrame>
  );
}
