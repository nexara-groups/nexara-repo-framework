import Image from "next/image";
import Link from "next/link";
import { EecpCourseGrid, EecpNaturalBypass } from "@/components/eecp-diagram";
import { EecpScrolly } from "@/components/eecp-scrolly";
import { Reveal } from "@/components/reveal";

const candidates = [
  { title: "Angina that will not settle", copy: "Chest pain or heaviness that persists even with regular medication, limiting walks, stairs, and daily routines." },
  { title: "Symptoms after stents or bypass", copy: "Discomfort that has returned after an earlier procedure, when another intervention is not the preferred next step." },
  { title: "Heart failure with low pumping strength", copy: "Patients whose hearts pump less strongly than they should, who need support that does not add strain." },
  { title: "When surgery is not an option", copy: "Patients advised against surgery — or who want to explore a non-invasive pathway first, with their cardiologist's guidance." },
];

const faqs = [
  { q: "Does EECP hurt?", a: "No. The cuffs squeeze firmly — most patients describe it as a strong hug on the legs, similar to a blood-pressure cuff. Many read, listen to music, or nap through their sessions." },
  { q: "Is EECP safe?", a: "EECP is a non-invasive, FDA-cleared class of therapy that has been used for decades. Before starting, a clinician reviews your history and examines you to confirm it is suitable for you." },
  { q: "When do patients notice a difference?", a: "It varies. Some patients report easier walking and fewer episodes of chest discomfort partway through the course; for others, changes come later. Your care team tracks your progress session by session." },
  { q: "Can EECP replace bypass surgery or stents?", a: "It is not a replacement in every case — these treat different problems in different ways. EECP is often considered when procedures are not suitable, or when symptoms persist after them. Your cardiologist will advise what fits your condition." },
  { q: "What happens after the 35 sessions?", a: "Your clinician reviews your response and fits the results into your wider care plan — medication, activity, and follow-up. The studied benefits of a completed course have been reported to last well beyond the final session for many patients." },
  { q: "How do I prepare for a session?", a: "Wear comfortable, fitted clothing and have a light meal beforehand. Our team shares simple preparation guidance when your course is scheduled — and answers anything else on the phone." },
];

export function EECPBody() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c") }}
      />
      <section className="section-pad eecp-glance">
        <div className="container">
          <Reveal className="section-heading eecp-glance-heading" variant="mask">
            <div><span className="eyebrow">The therapy at a glance</span><h2>Strong medicine.<br /><em>Gentle delivery.</em></h2></div>
          </Reveal>
          <Reveal delay={120}>
            <div className="stat-row">
              <div><strong>0</strong><span>Cuts, stitches, or anaesthesia</span></div>
              <div><strong>35</strong><span>One-hour sessions</span></div>
              <div><strong>7</strong><span>Weeks, five days a week</span></div>
              <div><strong>FDA</strong><span>Cleared class of therapy</span></div>
            </div>
          </Reveal>
        </div>
      </section>

      <EecpScrolly />

      <section className="section-pad">
        <div className="container eecp-bypass-grid">
          <Reveal className="eecp-bypass-panel"><EecpNaturalBypass /></Reveal>
          <div className="eecp-bypass-copy">
            <Reveal delay={100}><span className="eyebrow">Why it matters</span><h2>Your body builds<br /><em>its own bypass.</em></h2><p>Session after session, the rhythmic push of blood encourages small collateral vessels to open around narrowed arteries — natural detours that keep the heart supplied. That is why EECP is often called the &ldquo;natural bypass.&rdquo;</p></Reveal>
            <Reveal className="benefit-list" delay={180}>
              <strong>Reported across clinical studies of completed courses:</strong>
              <ul>
                <li>Fewer and milder episodes of angina</li>
                <li>Longer walks with less breathlessness</li>
                <li>Reduced reliance on relief medication</li>
                <li>Better energy and quality of daily life</li>
              </ul>
              <small>Individual results vary — your clinician will discuss what is realistic for you.</small>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section-pad section-ink">
        <div className="container">
          <div className="section-heading"><Reveal variant="mask"><span className="eyebrow eyebrow-light">Who it helps</span><h2>Made for the patients<br /><em>with the fewest options.</em></h2></Reveal><Reveal className="heading-aside" delay={100}><p>EECP was designed for people whose symptoms persist — or for whom another procedure is not the right next step.</p></Reveal></div>
          <div className="eecp-who-grid">
            {candidates.map((item, index) => (
              <Reveal key={item.title} delay={80 + index * 80}>
                <span className="chapter-number">{`0${index + 1}`}</span>
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container eecp-course">
          <Reveal><span className="eyebrow">The course</span><h2>One quiet hour a day.<br /><em>Thirty-five days of them.</em></h2><p>A full course is 35 one-hour sessions — five days a week, for about seven weeks. You lie down, the cuffs do the work, and most patients read, listen to music, or simply rest. You walk in, and you walk out; there is no recovery time.</p></Reveal>
          <Reveal delay={150}><EecpCourseGrid /></Reveal>
        </div>
      </section>

      <section className="eecp-intro section-pad section-mint">
        <div className="container eecp-story-grid">
          <div className="eecp-sticky">
            <Reveal className="eecp-sticky-media"><Image src="/images/eecp-treatment.webp" alt="Patient receiving EECP therapy while a clinician monitors the session" fill sizes="(max-width: 900px) 100vw, 48vw" /><span className="media-label">EECP / monitored outpatient care</span></Reveal>
            <div className="eecp-pulse-note"><span className="pulse-icon" aria-hidden="true" /><span><strong>A measured rhythm</strong><small>Care guided by monitoring</small></span></div>
          </div>
          <div className="eecp-story">
            <Reveal><span className="eyebrow">A session at Rise</span><h2>Let every beat<br /><em>have more room.</em></h2><p>At Rise, the therapy is only half the experience. The other half is calm preparation, attentive monitoring, and a team that explains everything before it happens.</p></Reveal>
            <Reveal className="story-chapter" delay={100}><span className="chapter-number">01</span><h3>Arrive with context</h3><p>Your first visit is a conversation — your history, your symptoms, and what you hope to change. A clinician confirms EECP is suitable before a single session is booked.</p><div className="signal-line" aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /><i /></div></Reveal>
            <Reveal className="story-chapter" delay={140}><span className="chapter-number">02</span><h3>Settle into the rhythm</h3><p>Cuffs are wrapped, ECG sensors placed, and the hour begins. You rest while the machine follows your heartbeat — and your care team follows you.</p></Reveal>
            <Reveal className="story-chapter" delay={180}><span className="chapter-number">03</span><h3>Leave with a next step</h3><p>No recovery room, no downtime. You resume your day, and your clinician keeps you posted on progress and how the course fits your wider care plan.</p></Reveal>
            <Reveal className="eecp-disclaimer" delay={220}><strong>Important</strong><p>EECP may not be appropriate for every patient. Please speak with a qualified clinician to understand whether it is suitable for you.</p></Reveal>
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container eecp-compare">
          <div className="section-heading"><Reveal variant="mask"><span className="eyebrow">In perspective</span><h2>Gentler by design.</h2></Reveal><Reveal className="heading-aside" delay={100}><p>A general comparison for understanding — not a decision tool. Different treatments solve different problems, and your cardiologist will advise what fits you.</p></Reveal></div>
          <Reveal delay={140}>
            <table>
              <thead><tr><th scope="col" aria-label="Aspect" /><th scope="col">EECP therapy</th><th scope="col">Angioplasty / bypass</th></tr></thead>
              <tbody>
                <tr><th scope="row">Anaesthesia</th><td>None</td><td>Local or general</td></tr>
                <tr><th scope="row">Hospital stay</th><td>None — walk in, walk out</td><td>Usually one to several days</td></tr>
                <tr><th scope="row">Recovery</th><td>Resume your day immediately</td><td>Days to weeks</td></tr>
                <tr><th scope="row">How it helps</th><td>Strengthens the body&rsquo;s own circulation</td><td>Opens or replaces a blocked vessel</td></tr>
              </tbody>
            </table>
          </Reveal>
        </div>
      </section>

      <section className="section-pad section-mint">
        <div className="container eecp-faq">
          <div className="section-heading"><Reveal variant="mask"><span className="eyebrow">Common questions</span><h2>Asked in our rooms,<br /><em>answered plainly.</em></h2></Reveal></div>
          <div className="faq-list">
            {faqs.map((faq, index) => (
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

      <section className="section-pad section-ink eecp-cta">
        <div className="container cta-strip">
          <Reveal><span className="eyebrow eyebrow-light">Start with a conversation</span><h2>Questions about EECP?</h2></Reveal>
          <Reveal delay={100}><Link className="button button-coral" href="/appointment">Request an EECP consultation <b aria-hidden="true">↗</b></Link></Reveal>
        </div>
      </section>
    </>
  );
}
