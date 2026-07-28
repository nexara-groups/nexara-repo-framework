import Image from "next/image";
import Link from "next/link";
import { CATEGORY_LABELS, programmeImage } from "../../content/programme-media";
import type { PublishedProgramme } from "../../modules/learning-catalog";

interface ProgrammeItem {
  readonly slug: string;
  readonly title: string;
  readonly category: PublishedProgramme["category"];
}

interface DomainMatrixProps {
  readonly programmes: readonly ProgrammeItem[];
}

export function DomainMatrix({ programmes }: DomainMatrixProps) {
  return (
    <section className="shell section home-programmes" aria-labelledby="home-programmes">
      <div className="home-programmes__header">
        <h2 id="home-programmes">
          Choose by the work
          <br />
          you want to do.
        </h2>
        <p>
          Explore the published domains, then confirm the right level, schedule, and curriculum
          with an advisor.
        </p>
      </div>

      <div className="domain-matrix__grid">
        {programmes.map((programme) => (
          <Link
            key={programme.slug}
            href={`/courses/${programme.slug}`}
            className="domain-matrix__card"
          >
            <Image
              src={programmeImage(programme.slug)}
              alt=""
              width={1200}
              height={800}
              sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw"
            />
            <div className="domain-matrix__content">
              <span className="domain-matrix__category">
                {CATEGORY_LABELS[programme.category]}
              </span>
              <h3 className="domain-matrix__title">{programme.title}</h3>
              <span className="domain-matrix__action">
                View programme <b aria-hidden="true">&rarr;</b>
              </span>
            </div>
          </Link>
        ))}
      </div>

      <div className="domain-matrix__cta">
        <Link className="button button--secondary" href="/courses">
          View all programmes
        </Link>
      </div>
    </section>
  );
}
