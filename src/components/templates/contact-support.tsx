import Link from "next/link";
import type { PageDefinition } from "../../content/site";

const FAQS = [
  ["How do I choose a programme?", "Start with the role or kind of work you want to move toward. A Yojo advisor can help confirm the right starting point."],
  ["Are programmes available online?", "Yojo publishes both classroom learning in Visakhapatnam and live-online learning. Current availability is confirmed with the team."],
  ["Are schedules and fees listed online?", "Schedules, levels and fees are confirmed during a conversation so the information is current and relevant to your selected programme."],
  ["What does placement support include?", "Where relevant, Yojo can support resume preparation, mock interviews, job referrals and internship programmes. This support does not guarantee employment."],
] as const;

export function ContactSupport({
  page,
  slug,
}: {
  readonly page: PageDefinition;
  readonly slug: string;
}) {
  return (
    <section className="shell section tpl-support">
      <div className="tpl-support__head stack">
        <p className="mono">{page.eyebrow}</p>
        <h1>{page.title}</h1>
        <p>{page.description}</p>
      </div>

      {slug === "contact" && (
        <div className="tpl-support__channels">
          <p className="mono">Reach Yojo directly</p>
          <ul className="stack">
            <li>
              <a href="mailto:info@yojosolutions.com">info@yojosolutions.com</a>
            </li>
            <li>Visakhapatnam, Andhra Pradesh, India</li>
          </ul>
          <p className="tpl-support__note">
            An online enquiry form will appear here once the guarded enquiry service is ready. Until
            then email reaches the team directly.
          </p>
        </div>
      )}

      {slug === "portal" && (
        <p className="tpl-support__note">
          Secure learner sign-in is not live yet. Enrolment questions go through an advisor.
        </p>
      )}

      {slug === "faqs" && (
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
      )}

      <Link className="button button--primary" href={page.action.href}>
        {page.action.label} <span aria-hidden="true">&rarr;</span>
      </Link>
    </section>
  );
}
