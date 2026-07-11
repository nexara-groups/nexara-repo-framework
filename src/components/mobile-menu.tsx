"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { navItems } from "@/content/site-data";

export function MobileMenu() {
  const ref = useRef<HTMLDetailsElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (ref.current) ref.current.open = false;
  }, [pathname]);

  return (
    <details className="mobile-menu" ref={ref}>
      <summary aria-label="Open navigation"><span /><span /><span /></summary>
      <nav aria-label="Mobile navigation">
        {navItems.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}
        <Link className="mobile-menu-cta" href="/appointment">Book an appointment <b aria-hidden="true">↗</b></Link>
      </nav>
    </details>
  );
}
