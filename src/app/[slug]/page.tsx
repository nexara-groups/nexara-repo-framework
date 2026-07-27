import { notFound } from "next/navigation";
import Link from "next/link";
import { PageFrame } from "../../components/layout/page-frame";
import { StudentTrail } from "../../components/student-trail";
import { ContactEnquiry, FrequentlyAskedQuestions } from "../../components/route-utility";
import { pages } from "../../content/site";

export function generateStaticParams() { return [...Object.keys(pages), "student-journey"].map((slug) => ({ slug })); }

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (slug === "student-journey") return <PageFrame><StudentTrail /></PageFrame>;
  const page = pages[slug];
  if (!page) notFound();
  return <PageFrame><section className={`route-hero ${page.kind === "organisation" ? "organisation" : ""}`}><div className="route-field" aria-hidden="true">{page.eyebrow.split(" ")[0]}</div><div className="shell route-grid"><div><p className="kicker">{page.eyebrow}</p><h1>{page.title}</h1><p>{page.description}</p><Link className="primary-button" href={page.action.href}>{page.action.label} <span aria-hidden="true">→</span></Link></div><img src={page.image} width="1600" height="1000" alt="" /></div></section><section className="route-focus shell"><p className="kicker">What this route covers</p><div>{page.focus.map((item) => <article key={item}><span aria-hidden="true">+</span><h2>{item}</h2></article>)}</div></section>{slug === "contact" && <ContactEnquiry />}{slug === "faqs" && <FrequentlyAskedQuestions />}</PageFrame>;
}
