import Image from "next/image";
import Link from "next/link";
import { HeroEcg } from "@/components/brand-art";
import { contact, services } from "@/content/site-data";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-cta">
        <HeroEcg />
        <div className="container footer-cta-inner">
          <h2>One conversation<br /><em>starts it.</em></h2>
          <div>
            <Link className="button button-coral" href="/appointment">Book an appointment <b aria-hidden="true">↗</b></Link>
            <a className="button button-ghost-light" href={contact.phoneHref}>Call {contact.phone}</a>
          </div>
        </div>
      </div>
      <div className="container footer-top">
        <div>
          <Link className="brand brand-footer" href="/"><Image className="brand-logo-image brand-logo-footer" src="/rise-medical-hub-logo.png" alt="" width={112} height={112} /><span className="brand-copy"><strong>RISE</strong><small>MEDICAL HUB</small></span></Link>
          <p className="footer-intro">A more considered way to find care, ask questions, and take the next step toward better health.</p>
        </div>
        <div className="footer-links">
          <div><span className="footer-label">Explore</span><Link href="/about">About us</Link><Link href="/services">Departments & services</Link><Link href="/doctors">Our doctors</Link><Link href="/testimonials">Patient stories</Link><Link href="/resources">Health blog</Link><Link href="/gallery">Gallery</Link></div>
          <div><span className="footer-label">Care at Rise</span>{services.map((service) => <Link key={service.slug} href={`/${service.slug}`}>{service.name}</Link>)}<Link href="/health-packages">Health packages</Link><Link href="/health-camps">Community camps</Link></div>
          <div><span className="footer-label">Find us</span><a href={contact.phoneHref}>{contact.phone}</a><a href={`mailto:${contact.email}`}>{contact.email}</a><span>{contact.address}</span></div>
        </div>
      </div>
      <div className="container footer-bottom"><span>© {new Date().getFullYear()} Rise Medical Hub</span><span>Designed for clarity, care, and confidence.</span><Link href="/heart-care">Heart guide</Link><a href={contact.whatsappHref}>Start a conversation ↗</a></div>
    </footer>
  );
}
