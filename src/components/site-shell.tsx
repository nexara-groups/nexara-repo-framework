import Link from "next/link";
import type { ReactNode } from "react";
import { nav } from "../content/site";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="shell nav-shell">
        <Link className="brand" href="/" aria-label="Yojo Solutions home">
          <img src="/media/brand/yojo-logo.png" width="600" height="136" alt="Yojo Solutions" />
        </Link>
        <details className="nav-menu">
          <summary>Menu <span aria-hidden="true">+</span></summary>
          <nav aria-label="Primary navigation">
            {nav.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}
          </nav>
        </details>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {nav.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}
        </nav>
        <Link className="header-action" href="/contact">Find your programme <span aria-hidden="true">→</span></Link>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div><img src="/media/brand/yojo-logo.png" width="600" height="136" alt="Yojo Solutions" /><p>Focused technology learning and practical organisation support.</p></div>
        <div><p className="footer-title">Learning</p><Link href="/courses">Programmes</Link><Link href="/student-journey">Student trail</Link><Link href="/placement-and-career-services">Career support</Link></div>
        <div><p className="footer-title">Company</p><Link href="/about-us">About</Link><Link href="/contact">Contact</Link><Link href="/services">For organisations</Link></div>
      </div>
    </footer>
  );
}

export function PageFrame({ children }: { children: ReactNode }) {
  return <><SiteHeader /><main>{children}</main><SiteFooter /></>;
}
