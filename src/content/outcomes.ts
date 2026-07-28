/**
 * Learner proof data for the Outcomes page and the home proof band.
 *
 * Every figure, partner name, and testimonial below is an INDICATIVE
 * placeholder (`indicative: true`) and must be replaced with verified records
 * before public launch. The page renders an honesty banner saying so — do not
 * remove it while placeholders remain. This is the audit's "money hinge": it is
 * worthless, and actively harmful, if fake numbers ship presented as fact.
 */

export interface OutcomeStat {
  readonly value: string;
  readonly label: string;
  readonly footnote?: string;
  readonly indicative: boolean;
}

export interface OutcomeTestimonial {
  readonly name: string;
  readonly track: string;
  readonly nowAt: string;
  readonly quote: string;
  readonly indicative: boolean;
}

/** Shared so the home proof band and the Outcomes page never disagree. */
export const OUTCOME_STATS: readonly OutcomeStat[] = [
  { value: "600+", label: "learners trained since 2019", indicative: true },
  {
    value: "80%",
    label: "of placement-track learners referred to a hiring partner",
    footnote: "Referral, not a job guarantee. Measurement method being finalised.",
    indicative: true,
  },
  { value: "20+", label: "companies that have interviewed or hired Yojo learners", indicative: true },
  {
    value: "₹3.0–6.0 LPA",
    label: "typical fresher range for placed cybersecurity and cloud learners",
    footnote: "Varies by track, role, and city. Indicative, being verified.",
    indicative: true,
  },
];

export const OUTCOME_TESTIMONIALS: readonly OutcomeTestimonial[] = [
  {
    name: "Placeholder learner name",
    track: "Cybersecurity — SOC Analyst track",
    nowAt: "Placeholder company and role",
    quote:
      "The Splunk labs are what I got asked about in the interview. I had actually triaged the kind of alert they described, so I could answer it properly.",
    indicative: true,
  },
  {
    name: "Placeholder learner name",
    track: "Cloud",
    nowAt: "Placeholder company and role",
    quote:
      "I came from a non-IT job and wasn't sure I could switch. Building in a real AWS account, breaking it, and fixing it is what made it click.",
    indicative: true,
  },
  {
    name: "Placeholder learner name",
    track: "SAP",
    nowAt: "Placeholder company and role",
    quote:
      "We worked on the same screens the client's finance team uses, so the first week on the job wasn't a shock.",
    indicative: true,
  },
];

/** Hiring-partner names need written permission before publishing logos. */
export const OUTCOME_PARTNERS: readonly string[] = [
  "Hiring partner (to be named)",
  "Hiring partner (to be named)",
  "Hiring partner (to be named)",
  "Hiring partner (to be named)",
];
