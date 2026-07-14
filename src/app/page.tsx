import Link from "next/link";
import { HeroEcg, HomeCrossArt, EecpPulseArt } from "@/components/brand-art";
import { Reveal } from "@/components/reveal";
import { HomeHero } from "@/components/home-hero";
import { HomeMarquee } from "@/components/home-marquee";
import { HomeManifesto } from "@/components/home-manifesto";
import { HomePathways } from "@/components/home-pathways";
import { HeartFigure } from "@/components/heart/heart-figure";
import { contact } from "@/content/site-data";

export default function HomePage() {
  return (
    <main>
      <HomeHero />
      <HomeMarquee />
      <HomeManifesto />
      <HomePathways />

      <section className="hm-guide section-pad">
        <div className="container hm-guide-grid">
          <Reveal className="hm-guide-art"><HeartFigure ids={false} uid="home" /></Reveal>
          <Reveal delay={120}>
            <span className="eyebrow">New — the Rise heart guide</span>
            <h2>Your heart,<br /><em>fully explained.</em></h2>
            <p>How it works, what goes wrong, which signs matter, and what to do next — eight animated chapters in plain language.</p>
            <Link className="text-link" href="/heart-care">Read the heart guide <b aria-hidden="true">↗</b></Link>
          </Reveal>
        </div>
      </section>

      <section className="eecp-feature section-pad">
        <div className="container eecp-feature-grid">
          <Reveal className="eecp-feature-art"><EecpPulseArt /></Reveal>
          <Reveal className="eecp-feature-copy" delay={120}>
            <span className="eyebrow eyebrow-light">Our signature pathway</span>
            <h2>A third option<br /><em>for your heart.</em></h2>
            <p>When medicines aren&rsquo;t enough and surgery isn&rsquo;t the answer, EECP offers a non-surgical, FDA-cleared way to help blood reach the heart — one quiet hour a day, no recovery bed.</p>
            <div className="eecp-hero-chips"><span>Non-surgical</span><span>35 sessions · 7 weeks</span><span>Walk in, walk out</span></div>
            <div className="signal-line" aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /><i /></div>
            <Link className="button button-coral" href="/eecp-therapy">Explore EECP Therapy <b aria-hidden="true">↗</b></Link>
          </Reveal>
        </div>
      </section>

      <section className="section-pad hm-flow">
        <div className="container section-heading">
          <Reveal variant="mask"><span className="eyebrow">How a visit flows</span><h2>Three moves,<br /><em>one rhythm.</em></h2></Reveal>
          <Reveal className="heading-aside" delay={100}><p>Good healthcare is more than a single visit. It is a sequence of thoughtful moments, made easier to navigate.</p></Reveal>
        </div>
        <div className="container hm-flow-grid">
          <Reveal className="hm-flow-item"><span className="hm-flow-num" aria-hidden="true">01</span><h3>Listen</h3><p>Start with your story, your symptoms, and the questions you want answered.</p></Reveal>
          <Reveal className="hm-flow-item" delay={110}><span className="hm-flow-num" aria-hidden="true">02</span><h3>Understand</h3><p>Use consultation and diagnostics to make the next decision with confidence.</p></Reveal>
          <Reveal className="hm-flow-item" delay={220}><span className="hm-flow-num" aria-hidden="true">03</span><h3>Move forward</h3><p>Leave with a clear plan, the right support, and a team you can reach.</p></Reveal>
        </div>
      </section>

      <section className="hm-closer">
        <HeroEcg />
        <div className="container hm-closer-grid">
          <Reveal>
            <span className="eyebrow eyebrow-light">Begin at Rise</span>
            <h2>Ready when<br /><em>you are.</em></h2>
            <p>Walk in with a question, a report, or a referral — leave with a plan. Our care team is one call away, any hour.</p>
            <div className="hm-closer-actions">
              <Link className="button button-coral" href="/appointment">Book an appointment <b aria-hidden="true">↗</b></Link>
              <a className="button button-ghost-light" href={contact.phoneHref}>Call {contact.phone}</a>
            </div>
            <div className="hm-closer-meta">
              <span>{contact.address}</span>
              <a href={`https://maps.google.com/?q=${encodeURIComponent(contact.address)}`}>Open in Maps <b aria-hidden="true">↗</b></a>
            </div>
          </Reveal>
          <Reveal className="hm-closer-art" delay={140}><HomeCrossArt /></Reveal>
        </div>
      </section>
    </main>
  );
}
