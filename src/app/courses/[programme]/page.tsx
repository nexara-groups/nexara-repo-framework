import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ContactActions } from "../../../components/contact/contact-actions";
import { PageFrame } from "../../../components/layout/page-frame";
import { CATEGORY_LABELS, programmeImage } from "../../../content/programme-media";
import { getPublicServices } from "../../_services";

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export async function generateStaticParams() {
  const { learningCatalogue } = getPublicServices();
  const result = await learningCatalogue.list();
  return result.ok ? result.value.map((p) => ({ programme: p.slug })) : [];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ programme: string }>;
}) {
  const { programme: slug } = await params;
  const { learningCatalogue } = getPublicServices();
  const result = await learningCatalogue.findBySlug(slug);
  return result.ok
    ? {
        title: result.value.title,
        description: result.value.summary,
      }
    : {};
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
  const { detail } = programme;

  const facts = [
    { label: "Duration", value: `${detail.durationWeeks} weeks` },
    { label: "Mode", value: detail.mode },
    { label: "Level", value: detail.level },
    { label: "Fee from", value: `${inr.format(detail.feeFromInr)} · EMI from ${inr.format(detail.emiFromInr)}/mo` },
  ];

  return (
    <PageFrame>
      <section className="detail-hero page-hero">
        <div className="page-hero__media" aria-hidden="true">
          <Image src={programmeImage(programme.slug)} alt="" width={1200} height={800} priority />
        </div>
        <div className="page-hero__scrim" aria-hidden="true" />
        <div className="shell page-hero__content">
          <div>
            <nav className="detail-crumb" aria-label="Breadcrumb">
              <Link href="/courses">Courses</Link>
              <span aria-hidden="true"> / </span>
              <span>{programme.title}</span>
            </nav>
            <p className="eyebrow">{CATEGORY_LABELS[programme.category]} programme</p>
            <h1>{programme.title}</h1>
            <p>{programme.summary}</p>
            <p className="detail-batch">{detail.nextBatch}</p>
            <ContactActions message={`Hello Yojo Solutions, I would like to book a free demo class for the ${programme.title} programme.`} />
          </div>
        </div>
      </section>

      <section className="shell section detail-facts" aria-label="Programme facts">
        <dl className="detail-facts__grid">
          {facts.map((fact) => (
            <div key={fact.label}>
              <dt>{fact.label}</dt>
              <dd>{fact.value}</dd>
            </div>
          ))}
        </dl>
        <p className="detail-facts__note">
          Fees, EMI and batch dates are indicative and confirmed with a learning advisor before
          you enrol.
        </p>
      </section>

      <section className="shell section detail-panels">
        <div className="detail-panel" aria-labelledby="detail-roles-title">
          <h2 id="detail-roles-title">Roles you can target</h2>
          <ul className="detail-tags">
            {detail.outcomeRoles.map((role) => (
              <li key={role}>{role}</li>
            ))}
          </ul>
        </div>
        <div className="detail-panel" aria-labelledby="detail-tools-title">
          <h2 id="detail-tools-title">Tools you will use</h2>
          <ul className="detail-tags detail-tags--quiet">
            {detail.tools.map((tool) => (
              <li key={tool}>{tool}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="shell section detail-curriculum" aria-labelledby="detail-curriculum-title">
        <h2 id="detail-curriculum-title">What you will learn</h2>
        <ol>
          {detail.curriculum.map((module) => (
            <li key={module.title}>
              <strong>{module.title}</strong>
              <p>{module.detail}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="shell section detail-assurance">
        <div className="detail-panel" aria-labelledby="detail-trainer-title">
          <h2 id="detail-trainer-title">Who teaches</h2>
          <p className="detail-trainer__name">{detail.trainer.name}</p>
          <p className="detail-trainer__meta">{detail.trainer.credential}</p>
          <p className="detail-trainer__meta">{detail.trainer.experience}</p>
        </div>
        <div className="detail-panel" aria-labelledby="detail-placement-title">
          <h2 id="detail-placement-title">Placement support</h2>
          <p>{detail.placementTerms}</p>
          <Link className="detail-placement__link" href="/outcomes">
            See placement outcomes →
          </Link>
        </div>
      </section>

      <section className="shell section detail-cta" aria-label="Next step">
        <h2>Book a free demo class before you decide</h2>
        <p>Sit in on a live session, meet the trainer, and get the exact fee and next batch date.</p>
        <ContactActions message={`Hello Yojo Solutions, I would like to book a free demo class for the ${programme.title} programme.`} />
      </section>
    </PageFrame>
  );
}
