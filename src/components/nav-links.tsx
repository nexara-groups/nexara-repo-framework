"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems } from "@/content/site-data";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function NavLinks() {
  const pathname = usePathname();

  return (
    <>
      {navItems.map((item) => (
        <Link key={item.href} href={item.href} className={isActive(pathname, item.href) ? "nav-on" : undefined}>
          {item.label}
        </Link>
      ))}
    </>
  );
}
