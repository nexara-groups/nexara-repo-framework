import Image from "next/image";
import Link from "next/link";

const COLUMNS = [
  {
    title: "Learning",
    links: [
      { label: "Programmes", href: "/courses" },
      { label: "Student journey", href: "/student-journey" },
      { label: "Career support", href: "/placement-and-career-services" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about-us" },
      { label: "Contact", href: "/contact" },
      { label: "For organisations", href: "/services" },
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
          <p>Focused technology learning and practical organisation support.</p>
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
    </footer>
  );
}
