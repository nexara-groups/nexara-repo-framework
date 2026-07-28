import Image from "next/image";
import Link from "next/link";
import type { PageDefinition } from "../../content/site";
import { ContactActions } from "../contact/contact-actions";

export function EditorialList({ page }: { readonly page: PageDefinition }) {
  return (
    <>
      <section className="page-hero page-hero--compact">
        <div className="page-hero__media" aria-hidden="true">
          <Image src={page.image} alt="" width={1600} height={1000} priority />
        </div>
        <div className="page-hero__scrim" aria-hidden="true" />
        <div className="shell page-hero__content">
          <div>
            <p className="eyebrow">{page.eyebrow}</p>
            <h1>{page.title}</h1>
            <p>{page.description}</p>
          </div>
        </div>
      </section>
      <section className="shell section tpl-editorial">
        <div className="tpl-editorial__topics">
          {page.focus.map((item) => (
            <article key={item} className="reveal">
              <h2>{item}</h2>
              <p>New material will appear here when it is confirmed and ready to publish.</p>
            </article>
          ))}
        </div>
        <div className="tpl-editorial__state">
          <p>No items are published yet. Ask the team about the next relevant update.</p>
          {page.action.href === "/courses" ? (
            <Link className="button button--secondary" href={page.action.href}>
              {page.action.label}
            </Link>
          ) : (
            <ContactActions compact message={`Hello Yojo Solutions, I would like to ask about ${page.eyebrow.toLowerCase()}.`} />
          )}
        </div>
      </section>
    </>
  );
}
