import Link from "next/link";
import { DiagnosticsArt, EecpPulseArt, HeroEcg, OpdArt, PharmacyArt } from "@/components/brand-art";
import { Reveal } from "@/components/reveal";
import { contact, departments, services } from "@/content/site-data";

const pathwayArt = [EecpPulseArt, DiagnosticsArt, PharmacyArt, OpdArt];

const serviceDetails = [
  ["Non-invasive", "Monitored sessions", "Outpatient pathway"],
  ["Cardiac studies", "Pathology support", "Clear next steps"],
  ["In-house access", "Medicine guidance", "Closer to your care team"],
  ["Specialist consults", "Time for questions", "A written way forward"],
];

const careSteps = [
  { number: "01", title: "Tell us what is changing", text: "Start with a symptom, an existing report, or simply a concern. You do not need to know the specialty first." },
  { number: "02", title: "Meet the right clinician", text: "Our team helps place your first consultation so you spend less time moving between disconnected doors." },
  { number: "03", title: "Leave with a clear next step", text: "Testing, treatment, medicines, or follow-up are brought into one understandable plan." },
];

function CareHubArt({ idPrefix }: { idPrefix: string }) {
  return (
    <svg className="cs-hub-art" viewBox="0 0 620 620" role="img" aria-label="Four connected care pathways surrounding the Rise Medical Hub">
      <defs>
        <radialGradient id={`${idPrefix}-glow`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#dc5f72" stopOpacity=".24" />
          <stop offset="100%" stopColor="#dc5f72" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle className="cs-hub-glow" cx="310" cy="310" r="150" fill={`url(#${idPrefix}-glow)`} />
      <circle className="cs-hub-orbit cs-hub-orbit-outer" cx="310" cy="310" r="236" />
      <circle className="cs-hub-orbit cs-hub-orbit-inner" cx="310" cy="310" r="156" />
      <path className="cs-hub-axis" d="M310 74V546M74 310H546" />
      <path className="cs-hub-pulse" pathLength="1" d="M74 310H220l16-18 17 18h24l18-58 24 101 19-43h208" />
      <g className="cs-hub-core">
        <circle cx="310" cy="310" r="70" />
        <path d="M310 273v74M273 310h74" />
        <text x="310" y="405">RISE MEDICAL HUB</text>
      </g>
      {[
        { x: 310, y: 74, label: "EECP" },
        { x: 546, y: 310, label: "DIAGNOSTICS" },
        { x: 310, y: 546, label: "PHARMACY" },
        { x: 74, y: 310, label: "OPD" },
      ].map((node, index) => (
        <g className={`cs-hub-node cs-hub-node-${index + 1}`} key={node.label}>
          <circle cx={node.x} cy={node.y} r="26" />
          <circle className="cs-hub-node-dot" cx={node.x} cy={node.y} r="5" />
          <text x={node.x} y={node.y + (node.y < 100 ? -42 : node.y > 500 ? 53 : 5)} textAnchor="middle">{node.label}</text>
        </g>
      ))}
    </svg>
  );
}

export function CareServicesPage() {
  return (
    <>
      <section className="cs-hero">
        <HeroEcg />
        <div className="container cs-hero-grid">
          <Reveal className="cs-hero-copy">
            <span className="eyebrow eyebrow-light">Care services at Rise</span>
            <h1>Care that stays<br /><em>connected.</em></h1>
            <p>Consultations, diagnostics, medicines, and restorative heart care—brought together so the next step feels clear, not scattered.</p>
            <div className="hero-actions">
              <Link className="button button-coral" href="/appointment">Book an appointment <b aria-hidden="true">↗</b></Link>
              <a className="button cs-button-light" href={contact.phoneHref}>Call {contact.phone}</a>
            </div>
            <div className="breadcrumbs"><Link href="/">Home</Link><span>/</span><span>Care services</span></div>
          </Reveal>
          <Reveal className="cs-hero-art" delay={140}><CareHubArt idPrefix="cs-hero" /></Reveal>
        </div>
        <div className="container cs-hero-facts" aria-label="Care services overview">
          <div><strong>04</strong><span>care pathways</span></div>
          <div><strong>08</strong><span>specialties</span></div>
          <div><strong>01</strong><span>connected plan</span></div>
        </div>
      </section>

      <section className="section-pad cs-intro">
        <div className="container cs-intro-grid">
          <Reveal variant="mask"><span className="eyebrow">Where care begins</span><h2>Choose a pathway.<br /><em>We&rsquo;ll connect the rest.</em></h2></Reveal>
          <Reveal className="cs-intro-copy" delay={100}><p>You can begin with the service closest to your need. If you are unsure, begin with an OPD consultation—our team will help guide what follows.</p><a className="text-link" href={contact.phoneHref}>Help me choose <b aria-hidden="true">↗</b></a></Reveal>
        </div>

        <div className="container cs-path-grid">
          {services.map((service, index) => {
            const Art = pathwayArt[index] ?? OpdArt;
            return (
              <Reveal className="cs-path-card" delay={index * 70} key={service.slug}>
                <Link href={`/${service.slug}`} className="cs-path-link" aria-label={`Explore ${service.name}`}>
                  <div className="cs-path-art"><Art /><span className="cs-path-watermark" aria-hidden="true">{service.number}</span></div>
                  <div className="cs-path-copy">
                    <span className="cs-path-number">Pathway {service.number}</span>
                    <h3>{service.name}</h3>
                    <p>{service.detail}</p>
                    <ul>{(serviceDetails[index] ?? []).map((item) => <li key={item}>{item}</li>)}</ul>
                    <span className="text-link">Explore this care <b aria-hidden="true">↗</b></span>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      <section className="section-pad section-mint cs-specialties">
        <div className="container cs-specialty-layout">
          <Reveal className="cs-specialty-heading">
            <span className="eyebrow">Departments & specialties</span>
            <h2>One hub.<br /><em>More complete care.</em></h2>
            <p>Each specialty keeps its depth. The advantage is what happens between them: context travels, next steps connect, and your questions have a clear place to go.</p>
            <Link className="button button-navy" href="/doctors">Meet our doctors <b aria-hidden="true">↗</b></Link>
          </Reveal>
          <div className="cs-specialty-list">
            {departments.map((department, index) => (
              <Reveal className="cs-specialty-row" delay={index * 45} key={department.name}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div><h3>{department.name}</h3><p>{department.short}</p></div>
                {department.note ? <small>{department.note}</small> : null}
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad cs-journey">
        <div className="container section-heading">
          <Reveal variant="mask"><span className="eyebrow">How it works</span><h2>Less runaround.<br /><em>More direction.</em></h2></Reveal>
          <Reveal className="heading-aside" delay={100}><p>Care should not feel like a list of counters. We keep the journey simple, visible, and centred on the next useful decision.</p></Reveal>
        </div>
        <div className="container cs-journey-grid">
          {careSteps.map((step, index) => <Reveal className="cs-journey-step" delay={index * 90} key={step.number}><span>{step.number}</span><div className="cs-step-mark" aria-hidden="true"><i /></div><h3>{step.title}</h3><p>{step.text}</p></Reveal>)}
        </div>
      </section>

      <section className="cs-close">
        <div className="container cs-close-grid">
          <Reveal><span className="eyebrow eyebrow-light">Not sure where to start?</span><h2>Start with a<br /><em>conversation.</em></h2><p>Tell us what you are dealing with. Our care team will help you choose the right first appointment.</p><div className="hero-actions"><Link className="button button-coral" href="/appointment">Book an appointment <b aria-hidden="true">↗</b></Link><a className="button cs-button-light" href={contact.phoneHref}>Call {contact.phone}</a></div></Reveal>
          <Reveal className="cs-close-art" delay={100}><CareHubArt idPrefix="cs-close" /></Reveal>
        </div>
      </section>
    </>
  );
}
