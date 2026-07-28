import Image from "next/image";
import Link from "next/link";
import type { PageDefinition } from "../../content/site";
import { BUSINESS_CONTACT, whatsappHref } from "../../content/contact";
import { FAQS } from "../../content/faqs";
import { ContactActions } from "../contact/contact-actions";
import { EnquiryForm } from "../contact/enquiry-form.client";

export function ContactSupport({
  page,
  slug,
}: {
  readonly page: PageDefinition;
  readonly slug: string;
}) {
  return (
    <>
      <section className="page-hero page-hero--compact">
        <div className="page-hero__media" aria-hidden="true">
          <Image src={page.image} alt="" width={1915} height={821} priority />
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

      {slug === "contact" && (
        <section className="shell section tpl-support tpl-support--contact">
          <div className="tpl-support__channels">
            <h2>Reach Yojo directly</h2>
            <a href={whatsappHref()} target="_blank" rel="noreferrer">
              WhatsApp: {BUSINESS_CONTACT.phoneDisplay}
            </a>
            <a href={BUSINESS_CONTACT.emailHref}>{BUSINESS_CONTACT.email}</a>
            <p>{BUSINESS_CONTACT.address}</p>
          </div>
          <EnquiryForm />
        </section>
      )}

      {slug === "login" && (
        <section className="shell section tpl-support">
          <div className="tpl-support__notice">
            <h2>Secure learner access is not live yet.</h2>
            <p>
              The portal will only open when authentication, account storage, and support controls
              are ready. Programme enquiries can continue through an advisor.
            </p>
            <ContactActions compact message="Hello Yojo Solutions, I have a question about learner access or enrolment." />
          </div>
        </section>
      )}

      {slug === "faqs" && (
        <section className="shell section tpl-support">
          <div className="tpl-support__faqs">
            {FAQS.map(([question, answer]) => (
              <details key={question}>
                <summary>
                  {question}
                  <span aria-hidden="true">+</span>
                </summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
          <ContactActions compact message="Hello Yojo Solutions, I have another question about your programmes or services." />
        </section>
      )}

      {slug !== "contact" && slug !== "login" && slug !== "faqs" && (
        <section className="shell section tpl-support">
          <p className="tpl-support__note">
            Current details are confirmed directly so the information remains accurate and relevant.
          </p>
          <Link className="button button--primary" href={page.action.href}>
            {page.action.label}
          </Link>
        </section>
      )}
    </>
  );
}
