import Image from "next/image";
import Link from "next/link";
import { nav } from "../../content/site";
import { NavDisclosure } from "./nav-disclosure";

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

        <nav className="site-header__nav" aria-label="Primary">
          <ul className="cluster">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <Link className="button button--primary site-header__cta" href="/contact">
          Find your programme <span aria-hidden="true">&rarr;</span>
        </Link>

        <NavDisclosure />
      </div>
    </header>
  );
}
