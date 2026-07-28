import type { Metadata } from "next";
import { ContactActions } from "../../components/contact/contact-actions";
import { PageFrame } from "../../components/layout/page-frame";
import { FACULTY } from "../../content/faculty";

export const metadata: Metadata = {
  title: "Faculty",
  description:
    "Every Yojo trainer has done the work — incident response, cloud migrations, SAP rollouts — before they stood in a classroom. Meet your trainer before you enrol.",
};

export default function FacultyPage() {
  return (
    <PageFrame>
      <section className="shell section faculty-intro">
        <p className="eyebrow">Faculty</p>
        <h1>The person at the whiteboard has done the job.</h1>
        <p>
          You are paying for who teaches you, not a logo. Every Yojo trainer has shipped real work
          before they stood in a classroom. Ask us who takes your batch and what they have run.
        </p>
        <ContactActions message="Hello Yojo Solutions, I would like to know who teaches my batch." />
      </section>

      <section className="shell section faculty-grid" aria-label="Trainers">
        <ul className="faculty-grid__list">
          {FACULTY.map((member, i) => (
            <li key={i} className="faculty-card">
              <div className="faculty-card__head">
                <p className="faculty-card__name">
                  {member.name}
                  {member.indicative && <span className="outcomes-tag">indicative</span>}
                </p>
                <p className="faculty-card__teaches">{member.teaches}</p>
              </div>
              <blockquote className="faculty-card__quote">{member.quote}</blockquote>
              <dl className="faculty-card__meta">
                <div>
                  <dt>Credential</dt>
                  <dd>{member.credential}</dd>
                </div>
                <div>
                  <dt>Did before</dt>
                  <dd>{member.didBefore}</dd>
                </div>
                <div>
                  <dt>Tools in class</dt>
                  <dd>{member.tools}</dd>
                </div>
              </dl>
            </li>
          ))}
        </ul>
      </section>

      <section className="shell section faculty-note">
        <p>
          We don't have a hundred trainers. We have a small bench of people who have done the work
          and who take a limited number of batches so you get review time. If your trainer isn't
          confirmed for a track yet, we'll tell you straight instead of promising a name we can't
          put in front of you.
        </p>
      </section>
    </PageFrame>
  );
}
