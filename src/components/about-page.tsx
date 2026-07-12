import Link from "next/link";
import { AboutArt, HeroEcg } from "@/components/brand-art";
import { Reveal } from "@/components/reveal";
import { contact } from "@/content/site-data";

const principles = [
  {
    title: "Accessible",
    copy: "Clear pathways, straightforward communication, and care that's easier to reach — in Telugu, English, and Hindi.",
    glyph: (
      <>
        <path className="pr-draw" d="M11 39 C 19 39 19 20 29 20 S 40 12 41 9" />
        <circle className="pr-dot" cx="11" cy="39" r="3" />
        <circle className="pr-dot pr-dot-hot" cx="41" cy="9" r="3" />
      </>
    ),
  },
  {
    title: "Ethical",
    copy: "Respect for your context, informed decisions, and honest medical communication. No test without a reason.",
    glyph: (
      <>
        <line className="pr-draw" x1="24" y1="9" x2="24" y2="38" />
        <line className="pr-draw" x1="15" y1="39" x2="33" y2="39" />
        <line className="pr-draw" x1="11" y1="16" x2="37" y2="16" />
        <line className="pr-draw" x1="11" y1="16" x2="11" y2="21" />
        <path className="pr-draw" d="M6 21 a5 4 0 0 0 10 0" />
        <line className="pr-draw" x1="37" y1="16" x2="37" y2="21" />
        <path className="pr-draw" d="M32 21 a5 4 0 0 0 10 0" />
        <circle className="pr-dot pr-dot-hot" cx="24" cy="12" r="2.4" />
      </>
    ),
  },
  {
    title: "Patient-centric",
    copy: "Every interaction shaped around the person, not the process — with time protected for your questions.",
    glyph: (
      <>
        <circle className="pr-draw" cx="24" cy="24" r="16" />
        <circle className="pr-draw" cx="24" cy="24" r="9" />
        <circle className="pr-dot pr-dot-hot" cx="24" cy="24" r="3" />
      </>
    ),
  },
  {
    title: "Transparent",
    copy: "Reports explained, options compared honestly, and next steps written down before you leave.",
    glyph: (
      <>
        <rect className="pr-draw" x="9" y="11" width="21" height="21" rx="3" />
        <rect className="pr-draw pr-pane" x="19" y="17" width="21" height="21" rx="3" />
        <path className="pr-draw pr-dot-hot" d="M24 28 l4 4 8 -9" />
      </>
    ),
  },
];

const roof = [
  "A dedicated EECP suite with ECG-guided therapy and rehab support.",
  "Same-day diagnostics — cardiac, pathology, and imaging — reviewed in-house.",
  "An in-house pharmacy, so prescriptions are filled before you reach the door.",
  "Consultation rooms designed for conversations, not queues.",
];

export function AboutPage() {
  return (
    <>
      <section className="about-hero">
        <HeroEcg />
        <div className="container about-hero-inner">
          <Reveal className="about-hero-copy">
            <span className="eyebrow eyebrow-light">The Rise approach</span>
            <h1>Care built on trust,<br /><em>not noise.</em></h1>
            <p>Rise Medical Hub brings real medical expertise, modern infrastructure, and an unhurried, patient-first rhythm to Madhurawada and greater Visakhapatnam — so the signal that matters is never lost in the noise.</p>
            <div className="hero-actions">
              <Link className="button button-coral" href="/appointment">Book an appointment <b aria-hidden="true">↗</b></Link>
              <a className="button button-ghost-light" href={contact.phoneHref}>Call {contact.phone}</a>
            </div>
            <div className="breadcrumbs"><Link href="/">Home</Link><span>/</span><span>About</span></div>
          </Reveal>
          <Reveal className="about-hero-art" delay={140}><AboutArt /></Reveal>
        </div>
      </section>

      <section className="section-pad about-belief">
        <div className="container about-belief-grid">
          <Reveal className="about-belief-lead" variant="mask">
            <span className="eyebrow">Why Rise exists</span>
            <h2>Healthcare is not only treatment. It is how people <em>feel</em> along the way.</h2>
          </Reveal>
          <Reveal className="about-belief-body" delay={120}>
            <p>Rise Medical Hub was established with a simple conviction: that accessible, ethical, high-quality care belongs in the neighbourhood, not only in the big hospital across the city. A good care experience begins with being heard — and continues with being guided clearly.</p>
            <p>Our mission is reliable, affordable, patient-centric support built on advanced medical practice and technology, with the human relationship kept firmly at the centre. That is why our signature pathway is EECP — a therapy that asks for patience and precision rather than an operating theatre.</p>
            <p className="about-signature">— The Rise Medical Hub team</p>
          </Reveal>
        </div>
        <div className="container about-stats">
          <Reveal><strong>04</strong><span>care pathways</span></Reveal>
          <Reveal delay={90}><strong>08</strong><span>specialties</span></Reveal>
          <Reveal delay={180}><strong>35</strong><span>sessions per EECP course</span></Reveal>
          <Reveal delay={270}><strong>24h</strong><span>support line</span></Reveal>
        </div>
      </section>

      <section className="section-pad section-mint about-principles-sec">
        <div className="container">
          <div className="section-heading">
            <Reveal variant="mask"><span className="eyebrow">Our promise</span><h2>Modern where it helps.<br /><em>Human where it matters.</em></h2></Reveal>
            <Reveal className="heading-aside" delay={100}><p>Four commitments that shape every decision at Rise — from how a report is explained to how long a consultation runs.</p></Reveal>
          </div>
          <div className="about-principles">
            {principles.map((p, i) => (
              <Reveal className="pr-card" key={p.title} delay={80 + i * 80}>
                <svg className="pr-glyph" viewBox="0 0 48 48" role="img" aria-label={`${p.title} icon`} focusable="false">{p.glyph}</svg>
                <span className="pr-num">{`0${i + 1}`}</span>
                <h3>{p.title}</h3>
                <p>{p.copy}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad about-roof">
        <div className="container about-roof-grid">
          <Reveal className="about-roof-head" variant="mask">
            <span className="eyebrow">Under one roof</span>
            <h2>Built so care<br /><em>doesn&rsquo;t scatter.</em></h2>
            <p>Everything a heart patient needs, kept within a short walk of the same reception — no chasing records across the city.</p>
          </Reveal>
          <div className="about-roof-list">
            {roof.map((line, i) => (
              <Reveal className="about-roof-row" key={i} delay={80 + i * 70}>
                <span className="about-roof-num">{`0${i + 1}`}</span>
                <p>{line}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="about-closer">
        <div className="container about-closer-inner">
          <Reveal className="about-closer-copy">
            <span className="eyebrow eyebrow-light">The people behind the care</span>
            <h2>Care is a conversation.<br /><em>Start one with us.</em></h2>
            <div className="hero-actions">
              <Link className="button button-coral" href="/doctors">See our doctors <b aria-hidden="true">↗</b></Link>
              <Link className="button button-ghost-light" href="/appointment">Book an appointment</Link>
            </div>
          </Reveal>
          <Reveal className="about-closer-meta" delay={120}>
            <a href={contact.phoneHref}><small>Speak to us</small><strong>{contact.phone}</strong></a>
            <a href={`mailto:${contact.email}`}><small>Write to us</small><strong>{contact.email}</strong></a>
            <span><small>Find us</small><strong>Madhurawada, Visakhapatnam</strong></span>
          </Reveal>
        </div>
      </section>
    </>
  );
}
