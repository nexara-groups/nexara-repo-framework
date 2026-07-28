import Image from "next/image";
import Link from "next/link";
import { BUSINESS_CONTACT, whatsappHref } from "../../content/contact";

const COLUMNS = [
  {
    title: "Learn",
    links: [
      { label: "Courses & Programs", href: "/courses" },
      { label: "Student journey", href: "/student-journey" },
      { label: "Outcomes & placements", href: "/outcomes" },
      { label: "Career support", href: "/placement-and-career-services" },
      { label: "Faculty", href: "/faculty" },
    ],
  },
  {
    title: "Organisations",
    links: [
      { label: "All services", href: "/services" },
      { label: "Cybersecurity services", href: "/cyber-security-services" },
      { label: "IT consulting", href: "/it-consulting-services" },
      { label: "Physical security", href: "/physical-security-services" },
      { label: "Staff augmentation", href: "/staff-augmentation" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about-us" },
      { label: "Webinars & Events", href: "/events" },
      { label: "Blogs & Articles", href: "/blog" },
      { label: "Careers", href: "/careers" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Contact Us", href: "/contact" },
      { label: "FAQs", href: "/faqs" },
      { label: "Login / Register", href: "/login" },
    ],
  },
] as const;

export function SiteFooter() {
  return (
    <footer className="site-footer surface-field">
      <div className="shell site-footer__grid">
        <div className="stack">
          <Image
            className="site-footer__logo"
            src="/media/brand/yojo-logo.png"
            width={600}
            height={136}
            alt="Yojo Solutions"
          />
          <p className="site-footer__desc">
            Practical technology learning, career preparation, cybersecurity, and IT consulting
            from Visakhapatnam.
          </p>
          <div className="site-footer__contact">
            <a href={whatsappHref()} target="_blank" rel="noreferrer">
              WhatsApp {BUSINESS_CONTACT.phoneDisplay}
            </a>
            <a href={BUSINESS_CONTACT.emailHref}>{BUSINESS_CONTACT.email}</a>
          </div>
        </div>

        {COLUMNS.map((column) => (
          <nav key={column.title} aria-label={column.title}>
            <p className="mono site-footer__title">{column.title}</p>
            <ul className="stack">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="shell site-footer__bottom">
        <p>&copy; {new Date().getFullYear()} Yojo Solutions. All rights reserved.</p>
        <p>Cyber Security &amp; IT Consulting Services</p>
      </div>
    </footer>
  );
}
