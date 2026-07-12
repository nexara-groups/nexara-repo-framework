import Link from "next/link";
import { notFound } from "next/navigation";
import { ResourceSignalArt } from "@/components/resource-art";
import { Reveal } from "@/components/reveal";
import { ReadingProgress } from "@/components/ui/reading-progress";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { posts } from "@/content/site-data";

export function generateStaticParams() { return posts.map((post) => ({ post: post.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ post: string }> }) {
  const { post: slug } = await params;
  const post = posts.find((item) => item.slug === slug);
  return post ? { title: post.title, description: post.excerpt } : {};
}

export default async function PostPage({ params }: { params: Promise<{ post: string }> }) {
  const { post: slug } = await params;
  const post = posts.find((item) => item.slug === slug);
  if (!post) notFound();
  const others = posts.filter((item) => item.slug !== post.slug).slice(0, 3);
  const published = new Date(post.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    author: { "@type": "Organization", name: "Rise Medical Hub" },
    reviewedBy: { "@type": "Organization", name: "Rise Medical Hub care team" },
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <ReadingProgress />
      <section className="ra-hero">
        <div className="container ra-hero-grid">
          <Reveal className="ra-hero-copy">
            <div className="breadcrumbs"><Link href="/">Home</Link><span>/</span><Link href="/resources">Resources</Link><span>/</span><span>{post.tag}</span></div>
            <span className="blog-tag">{post.tag}</span>
            <h1>{post.title}</h1>
            <p>{post.excerpt}</p>
            <div className="ra-meta"><span>{post.readMinutes} min read</span><span>{post.sources.length} evidence links</span><span>Reviewed {published}</span></div>
          </Reveal>
          <Reveal className="ra-hero-art" delay={120}><ResourceSignalArt tag={post.tag} /></Reveal>
        </div>
      </section>

      <section className="section-pad ra-article-wrap">
        <div className="container ra-layout">
          <article className="ra-body">
            <Reveal><p className="ra-intro">{post.intro}</p></Reveal>
            {post.sections.map((section, index) => <Reveal className="ra-section" delay={index * 45} key={section.heading}><span>{String(index + 1).padStart(2, "0")}</span><h2>{section.heading}</h2><p>{section.body}</p></Reveal>)}
            <Reveal className="ra-limit"><strong>What this page cannot decide</strong><p>This guide is general health information, not a diagnosis or treatment recommendation. Your symptoms, examination, reports, medicines, and preferences change the decision.</p></Reveal>
          </article>
          <aside className="ra-aside">
            <Reveal>
              <div className="ra-takeaways"><span className="eyebrow">Decision notes</span><ul>{post.takeaways.map((point) => <li key={point}>{point}</li>)}</ul>{post.guideLink ? <Link className="text-link" href={post.guideLink.href}>{post.guideLink.label} <b aria-hidden="true">↗</b></Link> : null}</div>
              <div className="ra-review"><span className="ra-review-dot" aria-hidden="true" /><div><strong>Evidence-linked</strong><small>Every external source is listed below by type and publisher.</small></div></div>
              <Link className="button button-coral" href="/appointment">Discuss with a doctor <b aria-hidden="true">↗</b></Link>
            </Reveal>
          </aside>
        </div>
      </section>

      <section className="section-pad section-ink ra-sources">
        <div className="container section-heading">
          <Reveal variant="mask"><span className="eyebrow eyebrow-light">Evidence &amp; further reading</span><h2>Check the source.<br /><em>Then ask what fits.</em></h2></Reveal>
          <Reveal className="heading-aside" delay={100}><p>These links open the original publisher. They are selected to show the basis, context, and—where relevant—the uncertainty behind this guide.</p></Reveal>
        </div>
        <div className="container ra-source-list">
          {post.sources.map((source, index) => <Reveal delay={index * 55} key={source.href}><a href={source.href} target="_blank" rel="noreferrer"><span className="ra-source-num">{String(index + 1).padStart(2, "0")}</span><div><span className="ra-source-type">{source.type}</span><h3>{source.title}</h3><small>{source.publisher}</small><p>{source.note}</p></div><b aria-hidden="true">↗</b></a></Reveal>)}
        </div>
      </section>

      <section className="section-pad section-mint ra-related">
        <div className="container"><Reveal><span className="eyebrow">Keep reading</span><h2>Take the next<br /><em>useful question.</em></h2></Reveal>
          <div className="ra-related-grid">{others.map((other) => <Reveal key={other.slug}><SpotlightCard className="ra-related-card"><Link href={`/resources/${other.slug}`}><div className="ra-related-art"><ResourceSignalArt tag={other.tag} compact /></div><span className="blog-tag">{other.tag}</span><h3>{other.title}</h3><p>{other.excerpt}</p><span className="text-link">Read with sources <b aria-hidden="true">↗</b></span></Link></SpotlightCard></Reveal>)}</div>
        </div>
      </section>
    </main>
  );
}
