import Image from "next/image";
import type { PageDefinition } from "../../content/site";
import { ContactActions } from "../contact/contact-actions";

export function MarketingDetail({ page }: { readonly page: PageDefinition }) {
  return (
    <>
      <section className="tpl-hero page-hero">
        <div className="page-hero__media" aria-hidden="true">
          <Image src={page.image} alt="" width={1672} height={941} priority />
        </div>
        <div className="page-hero__scrim" aria-hidden="true" />
        <div className="shell page-hero__content">
          <div>
            <p className="eyebrow">{page.eyebrow}</p>
            <h1>{page.title}</h1>
            <p>{page.description}</p>
            <ContactActions message={`Hello Yojo Solutions, I would like to discuss ${page.eyebrow.toLowerCase()}.`} />
          </div>
        </div>
      </section>
      <section className="shell section tpl-focus" aria-labelledby="route-covers">
        <h2 id="route-covers">What this conversation covers</h2>
        <ul className="tpl-focus__grid">
          {page.focus.map((item) => (
            <li key={item} className="reveal">
              <h3>{item}</h3>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
