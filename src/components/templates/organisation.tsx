import Image from "next/image";
import Link from "next/link";
import type { PageDefinition } from "../../content/site";

export function Organisation({ page }: { readonly page: PageDefinition }) {
  return (
    <section className="tpl-org surface-field section">
      <div className="shell tpl-org__grid">
        <div className="stack">
          <p className="mono">{page.eyebrow}</p>
          <h1>{page.title}</h1>
          <p>{page.description}</p>
          <Link className="button button--primary" href={page.action.href}>
            {page.action.label} <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
        <div className="tpl-org__panel">
          <Image src={page.image} alt="" width={1600} height={1000} />
        </div>
      </div>
      <ul className="shell tpl-org__index">
        {page.focus.map((item, index) => (
          <li key={item}>
            <i className="mono">{String(index + 1).padStart(2, "0")}</i>
            <b>{item}</b>
          </li>
        ))}
      </ul>
    </section>
  );
}
