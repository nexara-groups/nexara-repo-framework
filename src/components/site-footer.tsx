import Link from "next/link";
import { contact, services } from "@/content/site-data";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-top">
        <div>
          <div className="brand brand-footer"><span className="brand-mark" aria-hidden="true"><span /></span><span className="brand-copy"><strong>RISE</strong><small>MEDICAL HUB</small></span></div>
          <p className="footer-intro">A more considered way to find care, ask questions, and take the next step toward better health.</p>
        </div>
        <div className="footer-links">
          <div><span className="footer-label">Explore</span><Link href="/about">About us</Link><Link href="/services">Departments & services</Link><Link href="/doctors">Our doctors</Link><Link href="/testimonials">Patient stories</Link><Link href="/resources">Health blog</Link><Link href="/gallery">Gallery</Link></div>
          <div><span className="footer-label">Care at Rise</span>{services.map((service) => <Link key={service.slug} href={`/${service.slug}`}>{service.name}</Link>)}<Link href="/health-packages">Health packages</Link><Link href="/health-camps">Community camps</Link></div>
          <div><span className="footer-label">Find us</span><a href={contact.phoneHref}>{contact.phone}</a><a href={`mailto:${contact.email}`}>{contact.email}</a><span>{contact.address}</span></div>
        </div>
      </div>
      <div className="container footer-bottom"><span>© {new Date().getFullYear()} Rise Medical Hub</span><span>Designed for clarity, care, and confidence.</span><a href={contact.whatsappHref}>Start a conversation ↗</a></div>
    </footer>
  );
}
