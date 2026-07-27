import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageFrame } from "../../../components/layout/page-frame";
import { CATEGORY_LABELS, programmeImage } from "../../../content/programme-media";
import { getPublicServices } from "../../_services";

export async function generateStaticParams() {
  const { learningCatalogue } = getPublicServices();
  const result = await learningCatalogue.list();
  return result.ok ? result.value.map((p) => ({ programme: p.slug })) : [];
}

export default async function ProgrammePage({
  params,
}: {
  params: Promise<{ programme: string }>;
}) {
  const { programme: slug } = await params;
  const { learningCatalogue } = getPublicServices();
  const result = await learningCatalogue.findBySlug(slug);
  if (!result.ok) notFound();
  const programme = result.value;

  return (
    <PageFrame>
      <section className="detail-hero section">
        <div className="shell detail-hero__grid">
          <div className="stack">
            <p className="mono">{CATEGORY_LABELS[programme.category]} programme</p>
            <h1>{programme.title}</h1>
            <p>
              {programme.summary} Current level, schedule, curriculum and fee are confirmed with a
              learning advisor.
            </p>
            <Link className="button button--primary" href="/contact">
              Ask about this programme <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
          <Image src={programmeImage(programme.slug)} alt="" width={900} height={700} />
        </div>
      </section>
    </PageFrame>
  );
}
