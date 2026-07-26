import Link from "next/link";
import { AtlasExperience } from "../components/atlas-experience";
import { PageFrame } from "../components/site-shell";
import { programmes } from "../content/site";

export default function HomePage() {
  return <PageFrame>
    <section className="home-hero" aria-labelledby="home-title">
      <span className="hero-field" aria-hidden="true">YOJO</span>
      <div className="hero-scene"><img src="/media/atlas/atlas-hero-1600.webp" width="1672" height="941" alt="Precision aluminium Learning Atlas with five labelled learning layers" fetchPriority="high" /></div>
      <div className="shell hero-layout"><div className="hero-copy"><p className="kicker">Technology learning, assembled around you</p><h1 id="home-title">Build a path<br />you can prove.</h1><p>Personal guidance, focused learning and placement support, connected as one system.</p><Link className="primary-button" href="/contact">Find your programme <span aria-hidden="true">→</span></Link></div></div>
    </section>
    <section className="premise"><div className="shell premise-grid"><p className="kicker">The Yojo Learning Atlas</p><h2>A course is content.<br />A learning system creates direction.</h2><p>Yojo connects the decisions before training, the work during it and the transition that follows.</p></div></section>
    <AtlasExperience />
    <section className="home-programmes shell" aria-labelledby="home-programmes"><div><p className="kicker">Choose by the work</p><h2 id="home-programmes">Eight published domains.<br />One deliberate starting point.</h2></div><div className="home-programme-list">{programmes.map((programme) => <Link href={`/courses/${programme.slug}`} key={programme.slug}><span>{programme.title}</span><small>{programme.category}</small><b aria-hidden="true">↗</b></Link>)}</div><Link className="text-link" href="/courses">View all programmes <span aria-hidden="true">→</span></Link></section>
    <section className="home-career"><div className="shell career-grid"><img src="/media/generated/student/placement-desk.webp" width="1024" height="1024" alt="A learning desk prepared for a career conversation" /><div><p className="kicker">After the learning</p><h2>Support that helps you explain the work.</h2><p>Resume preparation, mock interviews, job referrals and internship programmes can help prepare the transition when relevant.</p><Link className="secondary-button" href="/placement-and-career-services">Explore career support <span aria-hidden="true">→</span></Link></div></div></section>
  </PageFrame>;
}
