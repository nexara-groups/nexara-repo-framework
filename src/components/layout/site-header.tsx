import Image from "next/image";
import Link from "next/link";
import { whatsappHref } from "../../content/contact";
import { authLink } from "../../content/site";
import { NavDisclosure } from "./nav-disclosure";
import { PrimaryNav } from "./primary-nav.client";
import { ThemeToggle } from "./theme-toggle.client";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="shell site-header__inner">
        <Link className="site-header__brand" href="/" aria-label="Yojo Solutions home">
          <Image
            src="/media/brand/yojo-logo.png"
            width={600}
            height={136}
            alt="Yojo Solutions"
            priority
          />
        </Link>

        <PrimaryNav />

        <div className="site-header__actions">
          <ThemeToggle />
          <Link className="site-header__login" href={authLink.href}>
            {authLink.label}
          </Link>
          <a
            className="button button--primary site-header__cta"
            href={whatsappHref("Hello Yojo Solutions, I would like to discuss a programme or service.")}
            target="_blank"
            rel="noreferrer"
          >
            Chat on WhatsApp
          </a>
        </div>

        <NavDisclosure />
      </div>
    </header>
  );
}
