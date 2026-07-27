import Image from "next/image";
import Link from "next/link";
import { AtlasSequence } from "../components/atlas/atlas-sequence";
import { AtlasHero } from "../components/hero/atlas-hero";
import { PageFrame } from "../components/layout/page-frame";
import { ATLAS_LAYERS } from "../content/atlas-layers";
import { CATEGORY_LABELS } from "../content/programme-media";
import { getPublicServices } from "./_services";

export default async function HomePage() {
  const { learningCatalogue } = getPublicServices();
  const result = await learningCatalogue.list();
  if (!result.ok) throw new Error(result.error.message);

  return (
    <PageFrame>
      <AtlasHero layers={ATLAS_LAYERS} />

      <section className="premise surface-field section">
        <div className="shell premise__grid">
          <p className="mono">The Yojo Learning Atlas</p>
          <h2>
            A course is content.
            <br />
            A learning system creates direction.
          </h2>
          <p>
            Yojo connects the decisions before training, the work during it and the transition that
            follows.
          </p>
        </div>
      </section>

      <AtlasSequence layers={ATLAS_LAYERS} />

      <section className="shell section home-programmes" aria-labelledby="home-programmes">
        <p className="mono">Choose by the work</p>
        <h2 id="home-programmes">
          Eight published domains.
          <br />
          One deliberate starting point.
        </h2>
        <ul className="home-programmes__list">
          {result.value.map((programme) => (
            <li key={programme.slug}>
              <Link href={`/courses/${programme.slug}`} className="reveal">
                <span>{programme.title}</span>
                <small className="mono">{CATEGORY_LABELS[programme.category]}</small>
                <b aria-hidden="true">↗</b>
              </Link>
            </li>
          ))}
        </ul>
        <Link className="button button--secondary" href="/courses">
          View all programmes <span aria-hidden="true">→</span>
        </Link>
      </section>

      <section className="section home-career">
        <div className="shell home-career__grid">
          <Image
            src="/media/generated/student/placement-desk.webp"
            alt=""
            width={1024}
            height={1024}
          />
          <div className="stack">
            <p className="mono">After the learning</p>
            <h2>Support that helps you explain the work.</h2>
            <p>
              Resume preparation, mock interviews, job referrals and internship programmes can help
              prepare the transition when relevant.
            </p>
            <Link className="button button--secondary" href="/placement-and-career-services">
              Explore career support <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>
    </PageFrame>
  );
}
