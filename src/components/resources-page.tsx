import Link from "next/link";
import { ResourceSignalArt } from "@/components/resource-art";
import { Reveal } from "@/components/reveal";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { contact, posts } from "@/content/site-data";

function ArticleCard({ post, featured = false }: { post: (typeof posts)[number]; featured?: boolean }) {
  return (
    <Reveal className={featured ? "rl-card-wrap rl-card-featured" : "rl-card-wrap"}>
      <SpotlightCard className="rl-card">
        <Link href={`/resources/${post.slug}`}>
          <div className="rl-card-art"><ResourceSignalArt tag={post.tag} compact /><span>{post.tag}</span></div>
          <div className="rl-card-copy">
            <span className="rl-card-meta">{post.readMinutes} min read · {post.sources.length} evidence links</span>
            <h3>{post.title}</h3>
            <p>{post.excerpt}</p>
            <span className="text-link">Read with sources <b aria-hidden="true">↗</b></span>
          </div>
        </Link>
      </SpotlightCard>
    </Reveal>
  );
}

export function ResourcesPage() {
  const topics = Array.from(new Set(posts.map((post) => post.tag)));
  const topicTargets = new Map(topics.map((topic) => [topic, posts.find((post) => post.tag === topic)?.slug]));
  const sourceCount = posts.reduce((total, post) => total + post.sources.length, 0);
  const [featured, ...rest] = posts;
  if (!featured) return null;

  return (
    <>
      <section className="rl-hero">
        <div className="container rl-hero-grid">
          <Reveal className="rl-hero-copy">
            <span className="eyebrow eyebrow-light">The decision library</span>
            <h1>Read past<br /><em>the headline.</em></h1>
            <p>Plain-language health guides with the original research, guidelines, and regulatory records left open for you to inspect.</p>
            <div className="rl-topic-links" aria-label="Resource topics">{topics.map((topic) => <a href={`#topic-${topicTargets.get(topic)}`} key={topic}>{topic}</a>)}</div>
            <div className="breadcrumbs"><Link href="/">Home</Link><span>/</span><span>Resources</span></div>
          </Reveal>
          <Reveal className="rl-hero-art" delay={120}><ResourceSignalArt /></Reveal>
        </div>
        <div className="container rl-hero-stats">
          <div><strong>{String(posts.length).padStart(2, "0")}</strong><span>plain-language guides</span></div>
          <div><strong>{String(sourceCount).padStart(2, "0")}</strong><span>decision links</span></div>
          <div><strong>{String(topics.length).padStart(2, "0")}</strong><span>health topics</span></div>
        </div>
      </section>

      <section className="section-pad rl-guides">
        <div className="container section-heading">
          <Reveal variant="mask"><span className="eyebrow">Start with the question</span><h2>Useful context.<br /><em>Visible evidence.</em></h2></Reveal>
          <Reveal className="heading-aside" delay={100}><p>Each guide separates the practical takeaway from the source material, so you can decide what to discuss with your clinician next.</p></Reveal>
        </div>
        <div className="container rl-bento">
          <ArticleCard post={featured} featured />
          {rest.map((post) => <ArticleCard post={post} key={post.slug} />)}
        </div>
      </section>

      <section className="section-pad section-mint rl-method">
        <div className="container rl-method-grid">
          <Reveal><span className="eyebrow">How to read health evidence</span><h2>Three checks before<br /><em>you make a decision.</em></h2></Reveal>
          <div className="rl-method-list">
            {[
              ["01", "What kind of source is it?", "A guideline, randomised trial, systematic review, and regulatory record answer different questions. We label each one."],
              ["02", "Does it apply to you?", "A study population may not match your condition, medicines, age, or risk. That gap belongs in the consultation."],
              ["03", "What remains uncertain?", "Good decision support includes limits and competing evidence—not only the findings that sound reassuring."],
            ].map(([number, title, copy], index) => <Reveal className="rl-method-row" delay={index * 70} key={number}><span>{number}</span><div><h3>{title}</h3><p>{copy}</p></div></Reveal>)}
          </div>
        </div>
      </section>

      <section className="section-pad section-ink rl-evidence">
        <div className="container section-heading">
          <Reveal variant="mask"><span className="eyebrow eyebrow-light">Source shelf</span><h2>Follow the evidence<br /><em>for yourself.</em></h2></Reveal>
          <Reveal className="heading-aside" delay={100}><p>{sourceCount} direct links to medical societies, public-health agencies, guidelines, trials, and evidence reviews.</p></Reveal>
        </div>
        <div className="container rl-source-groups">
          {posts.map((post, postIndex) => (
            <Reveal delay={postIndex * 45} key={post.slug}>
              <details className="rl-source-group" id={`topic-${post.slug}`} open={postIndex === 0}>
                <summary><span>{String(postIndex + 1).padStart(2, "0")}</span><strong>{post.title}</strong><small>{post.sources.length} sources</small><b aria-hidden="true">+</b></summary>
                <div className="rl-source-list">
                  {post.sources.map((source) => <a href={source.href} target="_blank" rel="noreferrer" key={source.href}><span>{source.type}</span><div><strong>{source.title}</strong><small>{source.publisher}</small><p>{source.note}</p></div><b aria-hidden="true">↗</b></a>)}
                </div>
              </details>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="rl-close"><div className="container rl-close-inner"><Reveal><span className="eyebrow eyebrow-light">Information is a beginning</span><h2>Bring the evidence.<br /><em>Ask the next question.</em></h2><p>A source can inform a decision. It cannot make a personal medical decision for you.</p></Reveal><Reveal delay={100}><Link className="button button-coral" href="/appointment">Talk to a doctor <b aria-hidden="true">↗</b></Link><a className="text-link text-link-light" href={contact.phoneHref}>Call {contact.phone} <b aria-hidden="true">↗</b></a></Reveal></div></section>
    </>
  );
}
