import Link from "next/link";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/reveal";
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
  return (
    <main>
      <section className="post-hero">
        <div className="container">
          <Reveal>
            <div className="breadcrumbs"><Link href="/">Home</Link><span>/</span><Link href="/resources">Blog</Link><span>/</span><span>{post.tag}</span></div>
            <span className="blog-tag">{post.tag}</span>
            <h1>{post.title}</h1>
            <span className="blog-meta">{post.readMinutes} min read · {new Date(post.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })} · Rise care team</span>
          </Reveal>
        </div>
      </section>
      <section className="section-pad post-body-wrap">
        <div className="container post-layout">
          <Reveal className="post-body">
            <p className="post-intro">{post.intro}</p>
            {post.sections.map((section) => <div key={section.heading}><h2>{section.heading}</h2><p>{section.body}</p></div>)}
            <p className="note-strip">This article is general health information, not medical advice. For guidance about your own condition, please consult a doctor.</p>
          </Reveal>
          <Reveal className="post-aside" delay={120}>
            <div className="post-takeaways"><span className="eyebrow">Key takeaways</span><ul>{post.takeaways.map((point) => <li key={point}>{point}</li>)}</ul>{post.guideLink ? <Link className="text-link post-guide-link" href={post.guideLink.href}>{post.guideLink.label} <b aria-hidden="true">↗</b></Link> : null}</div>
            <div className="post-cta"><strong>Discuss this with a doctor</strong><small>Unhurried consultations, every day.</small><Link className="button button-coral" href="/appointment">Book a visit <b aria-hidden="true">↗</b></Link></div>
          </Reveal>
        </div>
      </section>
      <section className="section-pad section-mint">
        <div className="container">
          <Reveal><span className="eyebrow">Keep reading</span><h2>More from the<br /><em>health blog.</em></h2></Reveal>
          <div className="blog-grid">{others.map((other, index) => <Reveal key={other.slug} className="blog-card" delay={index * 70}><Link href={`/resources/${other.slug}`}><span className="blog-tag">{other.tag}</span><h3>{other.title}</h3><p>{other.excerpt}</p><span className="blog-meta">{other.readMinutes} min read</span></Link></Reveal>)}</div>
        </div>
      </section>
    </main>
  );
}
