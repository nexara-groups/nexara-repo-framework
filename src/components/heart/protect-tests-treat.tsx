import Link from "next/link";
import { protectHabits, heartTests, heartFaqs } from "@/content/heart-guide";
import { contact } from "@/content/site-data";
import { HeroEcg } from "@/components/brand-art";
import { Reveal } from "@/components/reveal";

// Chapters 06–08 + the closer — simple server-rendered compositions.

// 06 — six habits, numbered value-list in a 2×3 arrangement
export function ProtectHabits() {
  const left = protectHabits.slice(0, 3);
  const right = protectHabits.slice(3);
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
        <div className="hc-habits">
          {[left, right].map((column, columnIndex) => (
            <div className="value-list" key={columnIndex}>
              {column.map((habit, index) => (
                <Reveal key={habit.title} delay={60 * index}>
                  <div>
                    <span>{`0${columnIndex * 3 + index + 1}`}</span>
                    <div>
                      <h3>{habit.title}</h3>
                      <p>{habit.copy}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// 07 — five tests in the camp-row layout: what it sees, when, how it feels
export function HeartTests() {
  return (
    <section className="section-pad" id="tests">
      <div className="container">
        <div className="section-heading">
          <Reveal variant="mask">
            <span className="eyebrow">Chapter 07</span>
            <h2>Tests,<br /><em>decoded.</em></h2>
          </Reveal>
          <div className="heading-aside">
            <Reveal delay={80}>
              <p>None of these hurt. Most are done before your parking ticket needs renewing.</p>
            </Reveal>
          </div>
        </div>
        <div className="camp-list">
          {heartTests.map((test, index) => (
            <Reveal key={test.name} delay={50 * index}>
              <div className="camp-row ht-row">
                <span className="camp-num">{`0${index + 1}`}</span>
                <div>
                  <h3>{test.name}</h3>
                  <p>{test.sees}</p>
                  <p className="ht-when"><small>When it&rsquo;s used:</small> {test.when}</p>
                </div>
                <div className="ht-meta">
                  <span className="camp-cadence">{test.time}</span>
                  <small>{test.feels}</small>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <div className="cta-strip hc-tests-cta">
          <Reveal>
            <span className="eyebrow">On-site diagnostics</span>
            <h2>Every test above,<br /><em>under this roof.</em></h2>
          </Reveal>
          <Reveal delay={100}>
            <Link className="button button-navy" href="/diagnostics">Explore diagnostics <b aria-hidden="true">↗</b></Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// 08 — medicines, procedures, and EECP as the third option (conversion moment)
export function TreatmentPath() {
  return (
    <section className="section-pad" id="treatment">
      <div className="container">
        <div className="section-heading">
          <Reveal variant="mask">
            <span className="eyebrow">Chapter 08</span>
            <h2>Treatment,<br /><em>and the third option.</em></h2>
          </Reveal>
          <div className="heading-aside">
            <Reveal delay={80}>
              <p>Three roads, usually travelled in this order — and one of them needs no theatre at all.</p>
            </Reveal>
          </div>
        </div>
        <div className="hc-treat-grid">
          <Reveal>
            <article className="hc-treat-card">
              <span className="chapter-number">Stage 01</span>
              <h3>Medicines</h3>
              <p>
                Statins quiet the plaque, BP tablets drop the workload, antiplatelets keep blood
                slippery — unglamorous, life-extending, and where nearly everyone starts.
              </p>
            </article>
          </Reveal>
          <Reveal delay={80}>
            <article className="hc-treat-card">
              <span className="chapter-number">Stage 02</span>
              <h3>Procedures</h3>
              <p>
                Angioplasty props a narrowed artery open; bypass builds a detour around it —
                the right call when the anatomy demands it.
              </p>
            </article>
          </Reveal>
          <Reveal delay={160} className="hc-treat-wide">
            <article className="hc-treat-card hc-treat-eecp">
              <span className="chapter-number">Stage 03 — the third option</span>
              <h3>EECP — strengthen the circulation you already have</h3>
              <p>
                When medicines aren&rsquo;t enough and surgery isn&rsquo;t the answer, Enhanced External
                Counterpulsation trains your own vessels to feed the heart better — one quiet hour
                a day, timed to your heartbeat, no anaesthesia, no recovery bed.
              </p>
              <div className="eecp-hero-chips">
                <span>FDA-cleared class</span>
                <span>Non-surgical · no anaesthesia</span>
                <span>35 sessions · 7 weeks</span>
              </div>
              <Link className="button button-coral" href="/eecp-therapy">Explore EECP therapy <b aria-hidden="true">↗</b></Link>
            </article>
          </Reveal>
        </div>
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
            <h2>Twenty minutes of reading.<br /><em>One conversation to act on it.</em></h2>
          </Reveal>
          <Reveal delay={100}>
            <div className="hc-closer-actions">
              <Link className="button button-coral" href="/appointment">Book a heart check <b aria-hidden="true">↗</b></Link>
              <a className="button button-ghost-light" href={contact.phoneHref}>Call {contact.phone}</a>
            </div>
          </Reveal>
        </div>
      </section>
      <section className="section-pad section-mint">
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
