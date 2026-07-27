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
      <section className="catalogue shell section" aria-labelledby="catalogue-title">
        <div className="catalogue__heading">
          <p className="mono">Published programmes</p>
          <h1 id="catalogue-title">
            Choose by the work
            <br />
            you want to do.
          </h1>
          <p>Current level, curriculum, schedule and fee are confirmed with a learning advisor.</p>
        </div>
        <CourseLedger programmes={result.value} />
      </section>
    </PageFrame>
  );
}
