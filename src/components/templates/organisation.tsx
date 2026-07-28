import Image from "next/image";
import Link from "next/link";
import type { PageDefinition } from "../../content/site";
import { ContactActions } from "../contact/contact-actions";

export function Organisation({ page }: { readonly page: PageDefinition }) {
  return (
    <>
      <section className="tpl-org page-hero">
        <div className="page-hero__media" aria-hidden="true">
          <Image src={page.image} alt="" width={1672} height={941} priority />
        </div>
        <div className="page-hero__scrim" aria-hidden="true" />
        <div className="shell page-hero__content">
          <div>
            <p className="eyebrow">{page.eyebrow}</p>
            <h1>{page.title}</h1>
            <p>{page.description}</p>
            <ContactActions message={`Hello Yojo Solutions, I would like to discuss ${page.eyebrow.toLowerCase()} for my organisation.`} />
          </div>
        </div>
      </section>
      <section className="section tpl-org__scope">
      <div className="shell tpl-org__grid">
          <h2>Start with the operating requirement.</h2>
          <p>
            The right scope depends on your environment, risk, team, and desired outcome. The first
            conversation should make those boundaries clear.
          </p>
          <ul className="tpl-org__index">
            {page.focus.map((item) => (
              <li key={item}>
                <b>{item}</b>
              </li>
            ))}
          </ul>
        </div>
      </section>
      {page.links && page.links.length > 0 && (
        <section className="section tpl-org__services" aria-labelledby="tpl-org-services-title">
          <div className="shell">
            <h2 id="tpl-org-services-title">Explore each service</h2>
            <ul className="tpl-org__cards">
              {page.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <strong>{link.label}</strong>
                    {link.note && <span>{link.note}</span>}
                    <span className="tpl-org__cards-go" aria-hidden="true">
                      Explore →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}
