import Link from "next/link";
import { protectHabits, heartFaqs } from "@/content/heart-guide";
import { contact } from "@/content/site-data";
import { HeroEcg } from "@/components/brand-art";
import { Reveal } from "@/components/reveal";
import { ChapterSources } from "@/components/heart/chapter-sources";
import { HeartTestsGuide } from "@/components/heart/heart-tests-guide";

// Chapters 06–08 + the closer — simple server-rendered compositions.

const habitStarts = [
  "Start with a 10-minute walk after one meal.",
  "Add colour to half your plate most days.",
  "Ask for a quit plan instead of relying on willpower.",
  "Protect the same sleep and wake window.",
  "Use two quiet minutes to slow your breathing.",
  "Record trends—not a single alarming number.",
];

function HabitVisual({ index }: { index: number }) {
  const common = { fill: "none", strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg className={`habit-visual habit-visual-${index + 1}`} viewBox="0 0 84 84" aria-hidden="true">
      <circle className="habit-orbit" cx="42" cy="42" r="37" />
      {index === 0 ? (
        <>
          <circle className="habit-fill" cx="49" cy="20" r="5" />
          <path className="habit-line" d="M47 27 38 41l12 9 8 17M39 40l-12 11M50 50 37 66" {...common} />
          <path className="habit-accent" d="M18 66c9-4 16-3 24 0s15 3 24-1" {...common} />
        </>
      ) : index === 1 ? (
        <>
          <circle className="habit-line habit-plate" cx="42" cy="43" r="24" {...common} />
          <path className="habit-line" d="M42 19v48M18 43h48" {...common} />
          <path className="habit-accent habit-leaf" d="M43 42c4-13 14-17 23-14-1 10-8 18-23 14Z" />
          <path className="habit-fill" d="M24 31c7-5 13-4 18 4-7 6-14 5-18-4Z" />
        </>
      ) : index === 2 ? (
        <>
          <path className="habit-line" d="M20 51h39c5 0 8 3 8 7s-3 7-8 7H20" {...common} />
          <path className="habit-accent" d="M17 20 67 70" {...common} />
          <path className="habit-smoke" d="M52 44c-4-5 6-8 1-14s7-8 2-15" {...common} />
          <path className="habit-fill" d="M20 51h13v14H20Z" />
        </>
      ) : index === 3 ? (
        <>
          <path className="habit-fill habit-moon" d="M56 19c-13 4-19 18-13 30 5 11 18 16 29 10-7 11-21 16-34 9-15-8-19-27-10-41 6-9 18-13 28-8Z" />
          <path className="habit-accent habit-star" d="m27 22 2 5 5 2-5 2-2 5-2-5-5-2 5-2Z" />
          <path className="habit-line" d="M18 68h49" {...common} />
        </>
      ) : index === 4 ? (
        <>
          <circle className="habit-line" cx="42" cy="42" r="23" {...common} />
          <circle className="habit-accent habit-breath" cx="42" cy="42" r="14" {...common} />
          <circle className="habit-fill" cx="42" cy="42" r="4" />
          <path className="habit-line" d="M42 8v8M42 68v8M8 42h8M68 42h8" {...common} />
        </>
      ) : (
        <>
          <path className="habit-line" d="M18 64V45m16 19V34m16 30V24m16 40V15" {...common} />
          <path className="habit-accent" d="M15 28c11 0 15 9 24 9s13-13 28-13" {...common} />
          <circle className="habit-fill" cx="67" cy="24" r="5" />
        </>
      )}
    </svg>
  );
}

// 06 — six practical habits with an original, code-drawn visual cue.
export function ProtectHabits() {
  return (
    <section className="section-pad section-mint" id="protect">
      <div className="container">
        <div className="section-heading">
          <Reveal variant="mask">
            <span className="eyebrow">Chapter 06</span>
            <h2>Six habits.<br /><em>Zero prescriptions.</em></h2>
          </Reveal>
          <div className="heading-aside">
            <Reveal delay={80}>
              <p>
                Most heart protection never touches a pharmacy. Start with one, keep it a month, add the next.
                The sixth is the easiest — <Link className="text-link" href="/health-packages">book a heart check <b aria-hidden="true">↗</b></Link>
              </p>
            </Reveal>
          </div>
        </div>
        <div className="hc-habit-grid">
          {protectHabits.map((habit, index) => (
            <Reveal key={habit.title} delay={55 * index}>
              <article className="hc-habit-card">
                <div className="hc-habit-card-head">
                  <span>{`0${index + 1}`}</span>
                  <HabitVisual index={index} />
                </div>
                <h3>{habit.title}</h3>
                <p>{habit.copy}</p>
                <small>{habitStarts[index]}</small>
              </article>
            </Reveal>
          ))}
        </div>
        <ChapterSources chapter="protect" />
      </div>
    </section>
  );
}

// 07 — five tests in the camp-row layout: what it sees, when, how it feels
export function HeartTests() {
  return <HeartTestsGuide />;
}

// 08 — treatment pathways. These are clinician-selected options, not sequential stages.
export function TreatmentPath() {
  return (
    <section className="section-pad" id="treatment">
      <div className="container">
        <div className="section-heading">
          <Reveal variant="mask">
            <span className="eyebrow">Chapter 08</span>
            <h2>Treatment,<br /><em>chosen by need — not stage.</em></h2>
          </Reveal>
          <div className="heading-aside">
            <Reveal delay={80}>
              <p>Medicines, EECP, and revascularisation are not rungs on one ladder. The right path depends on symptoms, coronary anatomy, risk, and urgency.</p>
            </Reveal>
          </div>
        </div>
        <div className="hc-treatment-rule" aria-label="How a treatment path is selected">
          <span>Symptoms</span><i aria-hidden="true">+</i><span>coronary anatomy</span><i aria-hidden="true">+</i><span>risk and urgency</span><b aria-hidden="true">→</b><strong>clinician-selected plan</strong>
        </div>
        <div className="hc-treat-grid">
          <Reveal>
            <article className="hc-treat-card">
              <span className="chapter-number">01 · The foundation</span>
              <h3>Medicines</h3>
              <p>
                Guideline-directed medicines and risk-factor control are the foundation for most
                people. They usually continue whether EECP or revascularisation is later selected.
              </p>
              <div className="hc-path-signal"><small>Selected by</small><span>Diagnosis, risk factors and treatment goals</span></div>
              <Link className="hc-path-link" href="/appointment">Discuss your heart risk <b aria-hidden="true">↗</b></Link>
            </article>
          </Reveal>
          <Reveal delay={80}>
            <article className="hc-treat-card hc-treat-eecp">
              <span className="chapter-number">02 · A selected non-invasive option</span>
              <h3>EECP — for selected refractory angina</h3>
              <p>
                EECP may be considered to relieve symptoms when chronic angina persists despite
                medical therapy and other treatment options are unsuitable or exhausted. It is
                not a routine bridge before angioplasty or bypass.
              </p>
              <div className="hc-path-signal"><small>Selected by</small><span>Persistent symptoms, suitability and cardiology review</span></div>
              <Link className="hc-path-link" href="/eecp-therapy">Explore EECP therapy <b aria-hidden="true">↗</b></Link>
            </article>
          </Reveal>
          <Reveal delay={160}>
            <article className="hc-treat-card">
              <span className="chapter-number">03 · When anatomy or risk requires it</span>
              <h3>Angioplasty or bypass</h3>
              <p>
                Revascularisation may be recommended when coronary anatomy, symptoms, or clinical
                risk make a procedure the better option. EECP must never delay emergency assessment
                or an indicated procedure.
              </p>
              <div className="hc-path-signal"><small>Selected by</small><span>Anatomy, symptoms, urgency and procedure risk</span></div>
              <Link className="hc-path-link" href="/appointment">Book a cardiology review <b aria-hidden="true">↗</b></Link>
            </article>
          </Reveal>
        </div>
        <p className="hc-treat-note">
          <strong>Important:</strong> This is a decision framework, not a treatment sequence. Chest pain at rest, worsening symptoms, or a suspected heart attack needs urgent medical assessment — not an EECP appointment.
        </p>
        <ChapterSources chapter="treatment" />
      </div>
    </section>
  );
}

// Closer — ink band + FAQ list (FAQPage JSON-LD lives in page.tsx)
export function HeartCloser() {
  return (
    <>
      <section className="hc-closer section-ink section-pad">
        <HeroEcg />
        <div className="container hc-closer-inner">
          <Reveal>
            <span className="eyebrow eyebrow-light">The next step</span>
            <h2>You know what matters.<br /><em>One conversation turns it into a plan.</em></h2>
          </Reveal>
          <Reveal delay={100}>
            <div className="hc-closer-actions">
              <Link className="button button-coral" href="/appointment">Book a heart check <b aria-hidden="true">↗</b></Link>
              <a className="button button-ghost-light" href={contact.phoneHref}>Call {contact.phone}</a>
            </div>
          </Reveal>
        </div>
      </section>
      <section className="section-pad section-mint hc-faq">
        <div className="container eecp-faq">
          <div className="section-heading">
            <Reveal variant="mask">
              <span className="eyebrow">Heart questions</span>
              <h2>Asked in our rooms,<br /><em>answered plainly.</em></h2>
            </Reveal>
          </div>
          <div className="faq-list">
            {heartFaqs.map((faq, index) => (
              <Reveal key={faq.q} delay={60 + index * 50}>
                <details>
                  <summary><span>{faq.q}</span><b aria-hidden="true">+</b></summary>
                  <p>{faq.a}</p>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
