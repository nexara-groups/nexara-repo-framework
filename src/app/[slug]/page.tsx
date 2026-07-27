import { notFound } from "next/navigation";
import { PageFrame } from "../../components/layout/page-frame";
import { ContactSupport } from "../../components/templates/contact-support";
import { EditorialList } from "../../components/templates/editorial-list";
import { MarketingDetail } from "../../components/templates/marketing-detail";
import { Organisation } from "../../components/templates/organisation";
import { pages } from "../../content/site";

export function generateStaticParams() {
  return Object.keys(pages).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = pages[slug];
  return page ? { title: page.eyebrow, description: page.description } : {};
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = pages[slug];
  if (!page) notFound();

  return (
    <PageFrame>
      {page.template === "organisation" && <Organisation page={page} />}
      {page.template === "editorial" && <EditorialList page={page} />}
      {page.template === "support" && <ContactSupport page={page} slug={slug} />}
      {page.template === "marketing" && <MarketingDetail page={page} />}
    </PageFrame>
  );
}
