import Link from "next/link";
import { notFound } from "next/navigation";
import { AboutPage } from "@/components/about-page";
import { AppointmentForm } from "@/components/appointment-form";
import { HeroEcg, OpdArt } from "@/components/brand-art";
import { CareServicesPage } from "@/components/care-services-page";
import { DoctorsDirectory } from "@/components/doctors-directory";
import { EECPBody } from "@/components/eecp-body";
import { EecpHero } from "@/components/eecp-hero";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { ResourcesPage } from "@/components/resources-page";
import { SiteArt, type SiteArtKind } from "@/components/site-art";
import { contact, services, doctors, labCategories, healthPackages, communityPrograms, testimonials, pharmacyPoints, opdTimings } from "@/content/site-data";

const slugs = ["about", "services", "eecp-therapy", "diagnostics", "pharmacy", "opd", "doctors", "health-packages", "health-camps", "testimonials", "resources", "gallery", "appointment", "contact"];

const pageMeta: Record<string, { eyebrow: string; title: string; description: string; art?: SiteArtKind; accent?: "mint" | "coral" | "navy" }> = {
  about: { eyebrow: "The Rise approach", title: "Care built on trust, not noise.", description: "Rise Medical Hub brings medical expertise, modern infrastructure, and a patient-first rhythm to the care journey.", accent: "mint" },
  services: { eyebrow: "Care services at Rise", title: "Care that stays connected.", description: "Consultations, diagnostics, medicines, and restorative heart care brought together at Rise Medical Hub in Madhurawada, Visakhapatnam.", accent: "navy" },
  "eecp-therapy": { eyebrow: "Signature care", title: "EECP Therapy for selected persistent angina", description: "A cardiologist-selected, non-invasive option for chronic refractory angina when medical therapy has not been enough and revascularisation is unsuitable or options are exhausted.", art: "eecp", accent: "navy" },
  diagnostics: { eyebrow: "Diagnostic & laboratory services", title: "Clarity for the next decision.", description: "Cardiac diagnostics, pathology, and imaging — precise answers with a human pace, most reports the same day.", art: "diagnostics", accent: "mint" },
  pharmacy: { eyebrow: "Pharmacy services", title: "Medication access, made easier.", description: "A reliable in-house pharmacy experience shaped around authenticity, guidance, and patient safety.", art: "pharmacy", accent: "coral" },
  opd: { eyebrow: "Out-patient department", title: "Start with a conversation.", description: "Consultations across specialties that make room for questions, context, and a clear plan forward.", art: "opd", accent: "mint" },
  doctors: { eyebrow: "The people behind the care", title: "Meet the team you can talk to.", description: "Physicians and specialists who explain before they act — with time protected for your questions.", art: "opd", accent: "coral" },
  "health-packages": { eyebrow: "Preventive care", title: "Small checks. Meaningful peace of mind.", description: "Considered health packages that tell you what to check, when to check it, and what your numbers mean.", art: "diagnostics", accent: "mint" },
  "health-camps": { eyebrow: "Community care", title: "Care that reaches further.", description: "Screening camps, workplace drives, and awareness programmes that bring preventive care closer to the community.", art: "community", accent: "coral" },
  testimonials: { eyebrow: "The experience we're building", title: "The care, as patients tell it.", description: "Unhurried consultations, clear explanations, and carefully selected heart-care pathways — told by the people who experienced them.", accent: "mint" },
  resources: { eyebrow: "The decision library", title: "Read past the headline.", description: "Plain-language health guides with direct links to guidelines, clinical trials, regulatory records, and evidence reviews.", accent: "navy" },
  gallery: { eyebrow: "Inside Rise", title: "A calmer environment for care.", description: "An illustrated view of connected consultation, diagnostics, therapy, and pharmacy spaces at Rise.", art: "environment", accent: "mint" },
  appointment: { eyebrow: "Book your visit", title: "Your next step starts here.", description: "Share a few details and our team will help confirm the right pathway and available time.", accent: "coral" },
  contact: { eyebrow: "We are here to help", title: "Find your way to Rise.", description: "Call, write, or visit us in Madhurawada. Our team is ready to help you take the next step.", accent: "mint" },
};

export function generateStaticParams() { return slugs.map((slug) => ({ slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = pageMeta[slug];
  if (!page) return {};
  if (slug === "eecp-therapy") {
    return {
      title: page.title,
      description: page.description,
      alternates: { canonical: "/eecp-therapy" },
      openGraph: {
        title: page.title,
        description: page.description,
        url: "/eecp-therapy",
      },
    };
  }
  return { title: page.title, description: page.description };
}

function StandardPage({ slug }: { slug: string }) {
  const page = pageMeta[slug];
  if (!page) return null;
  const body =
    slug === "about" ? <AboutPage />
    : slug === "services" ? <CareServicesPage />
    : slug === "doctors" ? <DoctorsBody />
    : slug === "health-packages" ? <PackagesBody />
    : slug === "health-camps" ? <CampsBody />
    : slug === "testimonials" ? <TestimonialsBody />
    : slug === "resources" ? <ResourcesPage />
    : slug === "gallery" ? <GalleryBody />
    : slug === "appointment" ? <AppointmentBody />
    : slug === "contact" ? <ContactBody />
    : slug === "pharmacy" ? <PharmacyBody />
    : slug === "opd" ? <OpdBody />
    : <ServiceBody slug={slug} />;
  return <main>{slug === "eecp-therapy" ? <EecpHero /> : slug === "doctors" || slug === "services" || slug === "resources" || slug === "about" ? null : <PageHero eyebrow={page.eyebrow} title={page.title} description={page.description} art={page.art} accent={page.accent} />}{body}</main>;
}

function CtaStrip({ eyebrow, title, href, label }: { eyebrow: string; title: string; href: string; label: string }) {
  return <section className="section-pad section-ink"><div className="container cta-strip"><Reveal><span className="eyebrow eyebrow-light">{eyebrow}</span><h2>{title}</h2></Reveal><Reveal delay={100}>{href.startsWith("tel:") ? <a className="button button-coral" href={href}>{label} <b aria-hidden="true">↗</b></a> : <Link className="button button-coral" href={href}>{label} <b aria-hidden="true">↗</b></Link>}</Reveal></div></section>;
}

function DoctorsBody() {
  const deptCount = new Set(doctors.map((doc) => doc.department)).size;
  return <>
    <section className="dr-hero">
      <HeroEcg />
      <div className="container dr-hero-inner">
        <Reveal className="dr-hero-copy">
          <span className="eyebrow eyebrow-light">The people behind the care</span>
          <h1>Doctors who<br /><em>make time.</em></h1>
          <p>From cardiothoracic surgery to newborn care — {doctors.length} specialists with one habit in common: they explain before they act. Consultations at Rise are scheduled so your questions fit inside them.</p>
          <div className="dr-hero-stats">
            <span><strong>{doctors.length}</strong><small>specialists</small></span>
            <span><strong>{deptCount}</strong><small>departments</small></span>
            <span><strong>MS · MCh · DNB</strong><small>board-trained faculty</small></span>
          </div>
          <div className="hero-actions"><Link className="button button-coral" href="/appointment">Book an appointment <b aria-hidden="true">↗</b></Link><a className="button button-ghost-light" href={contact.phoneHref}>Call {contact.phone}</a></div>
          <div className="breadcrumbs"><Link href="/">Home</Link><span>/</span><span>Our doctors</span></div>
        </Reveal>
        <Reveal className="dr-hero-art" delay={140}><OpdArt /></Reveal>
      </div>
    </section>
    <div className="hm-marquee dr-marquee" aria-hidden="true">
      <div className="hm-marquee-track">
        {(["a", "b"] as const).map((key) => (
          <div className="hm-marquee-half" key={key}>
            {Array.from(new Set(doctors.map((doc) => doc.department))).map((dept) => (
              <span className="hm-marquee-item" key={dept}>{dept}<i className="hm-marquee-dot" /></span>
            ))}
          </div>
        ))}
      </div>
    </div>
    <DoctorsDirectory />
    <CtaStrip eyebrow="Ready when you are" title="One conversation starts it." href="/appointment" label="Request an appointment" />
  </>;
}

function PackagesBody() {
  return <>
    <section className="section-pad"><div className="container section-heading"><Reveal variant="mask"><span className="eyebrow">Choose a check-up</span><h2>Four packages.<br /><em>Zero guesswork.</em></h2></Reveal><Reveal className="heading-aside" delay={100}><p>Each package ends the same way: a doctor sits with you, explains every number, and writes down what — if anything — to do next.</p></Reveal></div>
    <div className="container pkg-grid">{healthPackages.map((pkg, index) => <Reveal key={pkg.slug} className={`pkg-card${pkg.highlight ? " pkg-card-hot" : ""}`} delay={index * 80}>
      {pkg.highlight ? <span className="pkg-flag">Most chosen</span> : null}
      <h3>{pkg.name}</h3><p className="pkg-tagline">{pkg.tagline}</p>
      <p className="pkg-ideal"><small>Ideal for</small>{pkg.idealFor}</p>
      <ul className="pkg-inclusions">{pkg.inclusions.map((item) => <li key={item}>{item}</li>)}</ul>
      <span className="pkg-duration">{pkg.duration}</span>
      <Link className={`button ${pkg.highlight ? "button-coral" : "button-navy"}`} href="/appointment">Book this package <b aria-hidden="true">↗</b></Link>
    </Reveal>)}</div>
    <div className="container"><p className="note-strip">Inclusions and current pricing are confirmed when you book — call {contact.phone} for today&rsquo;s rates and preparation guidance (most panels need 10–12 hours of fasting).</p></div></section>
    <CtaStrip eyebrow="For teams & families" title="Group check-ups, arranged." href={contact.phoneHref} label={`Call ${contact.phone}`} />
  </>;
}

function CampsBody() {
  return <>
    <section className="section-pad"><div className="container section-heading"><Reveal variant="mask"><span className="eyebrow">Standing programmes</span><h2>Prevention,<br /><em>brought closer.</em></h2></Reveal><Reveal className="heading-aside" delay={100}><p>Good screening should not require a hospital visit. These programmes carry Rise&rsquo;s standard of care into colonies, offices, and classrooms.</p></Reveal></div>
    <div className="container camp-list">{communityPrograms.map((prog, index) => <Reveal key={prog.name} className="camp-row" delay={index * 70}><span className="camp-num">{String(index + 1).padStart(2, "0")}</span><div><h3>{prog.name}</h3><p>{prog.short}</p></div><span className="camp-cadence">{prog.cadence}</span></Reveal>)}</div></section>
    <section className="section-pad section-mint"><div className="container detail-points"><Reveal variant="mask"><span className="eyebrow">How a camp works</span><h2>Three steps to<br /><em>bring us over.</em></h2></Reveal><div className="point-list"><Reveal delay={80}><span>01</span><p>Tell us about your community, workplace, or institution and preferred dates.</p></Reveal><Reveal delay={150}><span>02</span><p>We plan the screening mix — BP, sugar, ECG, consultations — for your group size.</p></Reveal><Reveal delay={220}><span>03</span><p>Every participant leaves with results explained and a clear follow-up path.</p></Reveal></div></div></section>
    <CtaStrip eyebrow="Host a camp" title="Invite Rise to your community." href={contact.phoneHref} label={`Call ${contact.phone}`} />
  </>;
}

function TestimonialsBody() {
  return <>
    <section className="section-pad"><div className="container tst-grid">{testimonials.map((t, index) => <Reveal key={t.name} className="tst-card" delay={index * 70}><span className="tst-mark" aria-hidden="true">&ldquo;</span><blockquote>{t.quote}</blockquote><footer><strong>{t.name}</strong><small>{t.context}</small></footer></Reveal>)}</div>
    <div className="container"><p className="note-strip">Illustrative patient stories, shown while we collect consented testimonials from our first patients. Individual outcomes vary — every treatment decision belongs with your doctor.</p></div></section>
    <CtaStrip eyebrow="Write your own" title="Start with one conversation." href="/appointment" label="Book an appointment" />
  </>;
}

// Shared split-detail intro used by every /services/:slug body (EECP has its own hero, so it never renders this).
function ServiceIntro({ slug }: { slug: string }) {
  const service = services.find((item) => item.slug === slug);
  if (!service) return null;
  const h = service.heading;
  return <section className="section-pad"><div className="container split-detail"><Reveal className="detail-copy"><span className="eyebrow">{service.name}</span><h2>{h ? <>{h.lead}<br /><em>{h.accent}</em></> : service.short}</h2><p>{service.detail}</p><a className="button button-navy" href="/appointment">Request a visit <b aria-hidden="true">↗</b></a></Reveal><Reveal className="detail-image" delay={120}><SiteArt kind={service.art} label={service.name} /></Reveal></div></section>;
}

// "What to expect" 3-point block. Copy is passed in so each pathway reads as its own
// experience — a diagnostics visit and an OPD consultation are different, and shouldn't
// share one block of text.
function WhatToExpect({ lead, accent, points }: { lead: string; accent: string; points: string[] }) {
  return <section className="section-pad section-mint"><div className="container detail-points"><Reveal variant="mask"><span className="eyebrow">What to expect</span><h2>{lead}<br /><em>{accent}</em></h2></Reveal><div className="point-list">{points.map((point, i) => <Reveal key={i} delay={80 + i * 70}><span>{String(i + 1).padStart(2, "0")}</span><p>{point}</p></Reveal>)}</div></div></section>;
}

function ServiceBody({ slug }: { slug: string }) {
  const service = services.find((item) => item.slug === slug);
  if (!service) return null;
  if (slug === "eecp-therapy") return <EECPBody />;
  return <>
    <ServiceIntro slug={slug} />
    {slug === "diagnostics" ? <section className="section-pad section-ink"><div className="container section-heading"><Reveal variant="mask"><span className="eyebrow eyebrow-light">The laboratory</span><h2>What we test,<br /><em>under one roof.</em></h2></Reveal><Reveal className="heading-aside" delay={100}><p>Most pathology reports are ready the same day, and every cardiac study is reviewed by a physician before it reaches you.</p></Reveal></div><div className="container lab-grid">{labCategories.map((cat, index) => <Reveal key={cat.name} className="lab-card" delay={index * 70}><span className="lab-note">{cat.note}</span><h3>{cat.name}</h3><ul>{cat.tests.map((test) => <li key={test}>{test}</li>)}</ul></Reveal>)}</div></section> : null}
    <WhatToExpect
      lead="A test that explains"
      accent="itself."
      points={[
        "Know what the scan or blood work involves before you arrive.",
        "A technician walks you through each step, at your pace.",
        "Most reports land the same day — every cardiac study physician-reviewed.",
      ]}
    />
  </>;
}

function PharmacyBody() {
  return <>
    <ServiceIntro slug="pharmacy" />
    <section className="section-pad section-mint"><div className="container value-grid"><Reveal><span className="eyebrow">The pharmacy standard</span><h2>Dispensed with<br /><em>due diligence.</em></h2></Reveal><div className="value-list">{pharmacyPoints.map((point, index) => <Reveal key={point.title} delay={80 + index * 70}><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{point.title}</h3><p>{point.copy}</p></div></Reveal>)}</div></div></section>
    <CtaStrip eyebrow="Ask about a medicine" title="Our pharmacists pick up the phone." href={contact.phoneHref} label={`Call ${contact.phone}`} />
  </>;
}

function OpdBody() {
  return <>
    <ServiceIntro slug="opd" />
    <section className="section-pad"><div className="container opd-table"><div className="section-heading"><Reveal variant="mask"><span className="eyebrow">OPD timings</span><h2>Plan your visit<br /><em>by department.</em></h2></Reveal><Reveal className="heading-aside" delay={100}><p>Six departments, staggered across the day so mornings and evenings both have room for you.</p></Reveal></div>
      <Reveal delay={140}><table><thead><tr><th scope="col">Department</th><th scope="col">Days</th><th scope="col">Timings</th><th scope="col" aria-label="Booking link" /></tr></thead><tbody>{opdTimings.map((row) => <tr key={row.dept}><th scope="row">{row.dept}</th><td>{row.days}</td><td>{row.hours}</td><td><Link href="/appointment">Book ↗</Link></td></tr>)}</tbody></table></Reveal>
      <p className="note-strip">Timings are representative while we finalise the roster — please confirm when booking.</p>
    </div></section>
    <WhatToExpect
      lead="A visit that makes"
      accent="room for you."
      points={[
        "Tell the front desk your symptom or concern — we route you from there.",
        "Meet the right specialist, with time built in for your questions.",
        "Leave with medicines, tests, or a follow-up plan already arranged.",
      ]}
    />
    <CtaStrip eyebrow="Skip the queue" title="Request a slot before you arrive." href="/appointment" label="Book an OPD visit" />
  </>;
}

function GalleryBody() {
  const art = [
    { kind: "community" as const, caption: "Consultations with room for family" },
    { kind: "eecp" as const, caption: "The EECP suite" },
    { kind: "diagnostics" as const, caption: "Same-day diagnostics" },
    { kind: "opd" as const, caption: "Unhurried OPD rooms" },
    { kind: "pharmacy" as const, caption: "The in-house pharmacy" },
  ];
  return <section className="section-pad"><div className="container gallery-grid">{art.map((item, index) => <Reveal key={item.kind} className={`gallery-item gallery-item-${index + 1}`} delay={index * 70}><SiteArt kind={item.kind} label={item.caption} /><span className="gallery-cap">{item.caption}</span></Reveal>)}</div><div className="container"><p className="note-strip">Illustrated views of the care experience. Real, consented Rise photography can replace them as each space opens.</p></div></section>;
}

function AppointmentBody() {
  return <section className="section-pad form-section"><div className="container form-layout"><Reveal className="form-aside"><span className="eyebrow">A little less friction</span><h2>Bring your questions.<br /><em>We will bring the time.</em></h2><p>Tell us what you need and we will help you find the right pathway. For urgent concerns, please call our support line directly.</p><a className="support-line" href={contact.phoneHref}><span className="pulse-icon" aria-hidden="true" /><span><small>24hr support</small><strong>{contact.phone}</strong></span></a></Reveal><Reveal className="form-panel" delay={120}><AppointmentForm /></Reveal></div></section>;
}

function ContactBody() {
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(contact.address)}&output=embed`;
  return <section className="section-pad"><div className="container contact-grid">
    <Reveal className="contact-copy">
      <span className="eyebrow">Come by, call, or write</span>
      <h2>We are here<br /><em>to help.</em></h2>
      <p>Our team can help with appointment requests, service questions, and directions to Rise Medical Hub.</p>
      <div className="contact-details">
        <a href={contact.phoneHref}><small>Phone</small><strong>{contact.phone}</strong></a>
        <a href={`mailto:${contact.email}`}><small>Email</small><strong>{contact.email}</strong></a>
        <span><small>Location</small><strong>{contact.address}</strong></span>
      </div>
      <p className="note-strip">How to find us: ask for the Rise Medical Hub building on the main Madhurawada road — parking available on site.</p>
      <div className="contact-hours">
        <span className="eyebrow">OPD hours</span>
        <ul>{opdTimings.map((row) => <li key={row.dept}><strong>{row.dept}</strong><small>{row.days} · {row.hours}</small></li>)}</ul>
        <p className="note-strip">Timings are representative while we finalise the roster — please confirm when booking.</p>
      </div>
    </Reveal>
    <Reveal className="contact-map" delay={120}>
      <iframe title="Map to Rise Medical Hub" src={mapSrc} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
      <div className="map-caption"><span>Rise Medical Hub</span><a href={`https://maps.google.com/?q=${encodeURIComponent(contact.address)}`}>Open directions ↗</a></div>
    </Reveal>
  </div></section>;
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!slugs.includes(slug)) notFound();
  return <StandardPage slug={slug} />;
}
