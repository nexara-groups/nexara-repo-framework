import Link from "next/link";
import { HeroEcg, HomeCrossArt, EecpPulseArt } from "@/components/brand-art";
import { Reveal } from "@/components/reveal";
import { HomeHero } from "@/components/home-hero";
import { HomeMarquee } from "@/components/home-marquee";
import { HomeManifesto } from "@/components/home-manifesto";
import { HomePathways } from "@/components/home-pathways";
import { HeartFigure } from "@/components/heart/heart-figure";
import { contact, doctors } from "@/content/site-data";

const departmentCount = new Set(doctors.map((doc) => doc.department)).size;
const featuredDoctors = doctors.slice(0, 3);

export default function HomePage() {
  return (
    <main>
      <HomeHero />
      <HomeMarquee />
      <HomeManifesto />
      <HomePathways />

      <section className="section-pad hm-team">
        <div className="container section-heading">
          <Reveal variant="mask"><span className="eyebrow">The people behind the care</span><h2>Meet a few of<br /><em>the team.</em></h2></Reveal>
          <Reveal className="heading-aside" delay={100}><p>{doctors.length} specialists across {departmentCount} departments — each with one habit in common: they explain before they act.</p></Reveal>
        </div>
        <div className="container hm-team-grid">
          {featuredDoctors.map((doc, index) => (
            <Reveal key={doc.slug} className="hm-team-card" delay={index * 90}>
              <Link href="/doctors">
                <span className="hm-team-avatar" aria-hidden="true">{doc.initials}</span>
                <strong>{doc.name}</strong>
                <span className="hm-team-role">{doc.role}</span>
                <span className="hm-team-dept">{doc.department}</span>
              </Link>
            </Reveal>
          ))}
        </div>
        <div className="container hm-team-foot">
          <Reveal><Link className="text-link" href="/doctors">Meet all {doctors.length} specialists <b aria-hidden="true">↗</b></Link></Reveal>
        </div>
      </section>

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
            <h2>A selected option<br /><em>for persistent angina.</em></h2>
            <p>For selected patients whose chronic angina persists despite medical therapy—especially when revascularisation is unsuitable or options are exhausted—EECP may offer non-invasive symptom relief.</p>
            <div className="eecp-hero-chips"><span>Cardiologist-selected</span><span>Usually 35 sessions</span><span>Walk in, walk out</span></div>
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
