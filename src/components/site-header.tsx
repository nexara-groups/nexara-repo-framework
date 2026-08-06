import Image from "next/image";
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
            <a className="utility-emergency" href="tel:108"><i className="utility-emergency-dot" aria-hidden="true" />Emergency · 108</a>
            <a className="utility-wa" href={contact.whatsappHref}>WhatsApp us</a>
            <a href={contact.phoneHref}>24hr support · {contact.phone}</a>
          </div>
        </div>
      </div>
      <header className="site-header">
        <div className="container nav-inner">
          <Link className="brand" href="/">
            <Image className="brand-logo-image" src="/rise-medical-hub-logo.png" alt="" width={64} height={64} priority />
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
