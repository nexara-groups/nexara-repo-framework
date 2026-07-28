import type { Metadata } from "next";
import { ContactActions } from "../../components/contact/contact-actions";
import { PageFrame } from "../../components/layout/page-frame";
import {
  OUTCOME_PARTNERS,
  OUTCOME_STATS,
  OUTCOME_TESTIMONIALS,
} from "../../content/outcomes";

export const metadata: Metadata = {
  title: "Outcomes and placements",
  description:
    "How many learners Yojo has trained and placed, who hires from us, and what past learners say — with indicative figures clearly labelled while they are verified.",
};

export default function OutcomesPage() {
  return (
    <PageFrame>
      <section className="shell section outcomes-intro">
        <p className="eyebrow">Outcomes and placements</p>
        <h1>Where our learners actually ended up.</h1>
        <p>
          Real proof beats promises. Below: how many we have trained and placed, who hires from
          us, and what past learners say — in their words. Numbers marked as indicative are being
          verified; we would rather show you a placeholder we admit to than a statistic we made up.
        </p>
      </section>

      <section className="shell outcomes-honesty" role="note">
        <p>
          <strong>Some figures below are still being audited and are shown as indicative.</strong>{" "}
          We will not present a number as fact until we can back it up with records. If a stat has
          no source yet, assume it is a working estimate — and ask us for the real one.
        </p>
      </section>

      <section className="shell section outcomes-stats" aria-label="Training and placement figures">
        <dl className="outcomes-stats__grid">
          {OUTCOME_STATS.map((stat) => (
            <div key={stat.label}>
              <dt>
                {stat.value}
                {stat.indicative && <span className="outcomes-tag">indicative</span>}
              </dt>
              <dd>{stat.label}</dd>
              {stat.footnote && <p className="outcomes-stats__note">{stat.footnote}</p>}
            </div>
          ))}
        </dl>
      </section>

      <section className="shell section outcomes-voices" aria-labelledby="outcomes-voices-title">
        <h2 id="outcomes-voices-title">Learners, in their own words</h2>
        <ul className="outcomes-voices__grid">
          {OUTCOME_TESTIMONIALS.map((t, i) => (
            <li key={i} className="outcomes-quote">
              <blockquote>{t.quote}</blockquote>
              <p className="outcomes-quote__who">
                <strong>{t.name}</strong>
                {t.indicative && <span className="outcomes-tag">indicative</span>}
              </p>
              <p className="outcomes-quote__meta">
                {t.track} · now at {t.nowAt}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="shell section outcomes-partners" aria-labelledby="outcomes-partners-title">
        <h2 id="outcomes-partners-title">Companies that have interviewed or hired our learners</h2>
        <p className="outcomes-partners__intro">
          We are getting written permission to name each hiring partner. Until then we will walk
          you through the list on a call rather than post logos we cannot verify.
        </p>
        <ul className="outcomes-partners__grid">
          {OUTCOME_PARTNERS.map((name, i) => (
            <li key={i}>{name}</li>
          ))}
        </ul>
      </section>

      <section className="shell section outcomes-terms">
        <h2>What we promise, in plain words</h2>
        <p>
          We provide placement support: resume preparation, mock interviews, and referrals to
          hiring partners — the terms in writing before you enrol. We do not guarantee a job, and
          we would distrust anyone who does. Your interviews are yours to win. Our job is to make
          sure you walk in ready and in front of the right people.
        </p>
        <ContactActions message="Hello Yojo Solutions, I would like to know if my track has a batch open." />
      </section>
    </PageFrame>
  );
}
