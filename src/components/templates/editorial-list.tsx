import Link from "next/link";
import type { PageDefinition } from "../../content/site";

export function EditorialList({ page }: { readonly page: PageDefinition }) {
  return (
    <section className="shell section tpl-editorial">
      <div className="tpl-editorial__head stack">
        <p className="mono">{page.eyebrow}</p>
        <h1>{page.title}</h1>
        <p>{page.description}</p>
      </div>
      <ul className="tpl-editorial__topics">
        {page.focus.map((item) => (
          <li key={item} className="reveal">
            <h2>{item}</h2>
          </li>
        ))}
      </ul>
      <p className="tpl-editorial__state mono">
        No items are published yet. Ask the team about what is coming next.
      </p>
      <Link className="button button--secondary" href={page.action.href}>
        {page.action.label} <span aria-hidden="true">&rarr;</span>
      </Link>
    </section>
  );
}
