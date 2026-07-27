import Image from "next/image";
import Link from "next/link";
import type { PageDefinition } from "../../content/site";

export function MarketingDetail({ page }: { readonly page: PageDefinition }) {
  return (
    <>
      <section className="tpl-hero section">
        <div className="shell tpl-hero__grid">
          <div className="stack">
            <p className="mono">{page.eyebrow}</p>
            <h1>{page.title}</h1>
            <p>{page.description}</p>
            <Link className="button button--primary" href={page.action.href}>
              {page.action.label} <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
          <Image src={page.image} alt="" width={1600} height={1000} />
        </div>
      </section>
      <section className="shell section tpl-focus">
        <p className="mono">What this route covers</p>
        <ul className="tpl-focus__grid">
          {page.focus.map((item, index) => (
            <li key={item} className="reveal">
              <span className="mono">{String(index + 1).padStart(2, "0")}</span>
              <h2>{item}</h2>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
