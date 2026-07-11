import Link from "next/link";
import { contact } from "@/content/site-data";
import { MobileMenu } from "@/components/mobile-menu";
import { NavLinks } from "@/components/nav-links";
import { HeaderScroll } from "@/components/header-scroll";

export function SiteHeader() {
  return (
    <>
      <HeaderScroll />
      <div className="utility-bar">
        <div className="container utility-inner">
          <span><i className="status-dot" /> Patient-first care in Madhurawada</span>
          <div className="utility-links">
            <a href={contact.whatsappHref}>WhatsApp us</a>
            <a href={contact.phoneHref}>24hr support · {contact.phone}</a>
          </div>
        </div>
      </div>
      <header className="site-header">
        <div className="container nav-inner">
          <Link className="brand" href="/" aria-label="Rise Medical Hub home">
            <span className="brand-mark" aria-hidden="true"><span /></span>
            <span className="brand-copy"><strong>RISE</strong><small>MEDICAL HUB</small></span>
          </Link>
          <nav className="desktop-nav" aria-label="Primary navigation">
            <NavLinks />
          </nav>
          <Link className="nav-cta" href="/appointment"><span>Book an appointment</span><b aria-hidden="true">↗</b></Link>
          <MobileMenu />
        </div>
      </header>
    </>
  );
}
