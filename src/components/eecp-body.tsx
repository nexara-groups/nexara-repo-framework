import Link from "next/link";
import { EecpCourseGrid, EecpNaturalBypass, EecpSessionScene } from "@/components/eecp-diagram";
import { EecpScrolly } from "@/components/eecp-scrolly";
import { Reveal } from "@/components/reveal";

const candidates = [
  { title: "Angina that will not settle", copy: "Chest pain or heaviness that persists even with regular medication, limiting walks, stairs, and daily routines." },
  { title: "Symptoms after stents or bypass", copy: "Discomfort that has returned after an earlier procedure, when another intervention is not the preferred next step." },
  { title: "Heart failure with low pumping strength", copy: "Patients whose hearts pump less strongly than they should, who need support that does not add strain." },
  { title: "When surgery is not an option", copy: "Patients advised against surgery — or who want to explore a non-invasive pathway first, with their cardiologist's guidance." },
];

const references = [
  {
    tag: "Clinical guideline · 2023",
    title: "AHA/ACC multisociety guideline for chronic coronary disease",
    note: "Places EECP within the broader care pathway for chronic coronary disease and refractory angina—not as a universal replacement for medicines or revascularisation.",
    href: "https://www.acc.org/Guidelines/Guidelines/2023/07/20/12/34/Chronic-Coronary-Disease",
  },
  {
    tag: "Regulatory record · FDA",
    title: "FDA 510(k) summary for the EECP Therapy System",
    note: "The device-specific record describing intended use, operation, and reviewed indications. Clearance should not be read as a promise of benefit for every patient.",
    href: "https://www.accessdata.fda.gov/cdrh_docs/pdf2/k020857.pdf",
  },
  {
    tag: "Overview · 2013",
    title: "The Role of Enhanced External Counterpulsation Therapy in Clinical Practice",
    note: "A plain-language review of how EECP works, who it helps, and what the evidence shows. Clinical Medicine & Research (Sharma, Ramsey, Tak).",
    href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC3917995/",
  },
  {
    tag: "Angina trial · 1999",
    title: "MUST-EECP: effect of EECP on exercise-induced ischaemia and anginal episodes",
    note: "The landmark randomised, sham-controlled trial in refractory angina. Journal of the American College of Cardiology (Arora et al.).",
    href: "https://pubmed.ncbi.nlm.nih.gov/10362181/",
  },
  {
    tag: "Heart-failure trial · 2006",
    title: "EECP improves exercise tolerance in patients with chronic heart failure (PEECH)",
    note: "A randomised, controlled trial in stable heart failure with reduced pumping strength. Journal of the American College of Cardiology (Feldman et al.).",
    href: "https://pubmed.ncbi.nlm.nih.gov/16979005/",
  },
  {
    tag: "Long-term outcomes · 2008",
    title: "EECP in chronic refractory angina: long-term follow-up from the international registry",
    note: "Real-world outcomes tracked well beyond the treatment course, from the International EECP Patient Registry (IEPR).",
    href: "https://pubmed.ncbi.nlm.nih.gov/18404725/",
  },
  {
    tag: "Evidence synthesis · 2021",
    title: "Safety and effectiveness of EECP in refractory angina",
    note: "A meta-analysis of 17 studies, useful for reviewing symptom and exercise outcomes while noting the authors' call for larger controlled trials.",
    href: "https://pubmed.ncbi.nlm.nih.gov/35047131/",
  },
  {
    tag: "Cautious review · 2009",
    title: "EECP for stable angina and heart failure: systematic review and economic analysis",
    note: "An important counterweight: it found the controlled evidence insufficient for firm conclusions and documented uncertainty around long-term benefit and adverse events.",
    href: "https://pubmed.ncbi.nlm.nih.gov/19409154/",
  },
];

const faqs = [
  { q: "Does EECP hurt?", a: "No. The cuffs squeeze firmly — most patients describe it as a strong hug on the legs, similar to a blood-pressure cuff. Many read, listen to music, or nap through their sessions." },
  { q: "Is EECP safe?", a: "EECP is non-invasive, and specific prescription devices have FDA 510(k) clearance. That does not make it suitable for everyone. Before starting, a clinician reviews your history and examines you for reasons the treatment may be unsafe or unhelpful." },
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
          <div className="section-heading"><Reveal variant="mask"><span className="eyebrow eyebrow-light">Who it helps</span><h2>Made for the patients<br /><em>with the fewest options.</em></h2></Reveal><Reveal className="heading-aside" delay={100}><p>EECP was designed for people whose symptoms persist — or for whom another procedure is not the right next step. New to these terms? <Link className="text-link text-link-light" href="/heart-care#conditions">The heart guide explains each condition plainly <b aria-hidden="true">↗</b></Link></p></Reveal></div>
          <div className="eecp-who-grid">
            {candidates.map((item, index) => (
              <Reveal key={item.title} delay={80 + index * 80}>
                <span className="chapter-number">{`0${index + 1}`}</span>
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
              </Reveal>
            ))}
          </div>
          <Reveal className="eecp-notfit" delay={120}>
            <strong>When EECP is not advised</strong>
            <p>EECP is gentle, but it is not right for everyone. It is generally avoided in people with significant leaking of the aortic valve, an uncontrolled or very irregular heart rhythm, severe artery disease or a clot in the legs, an aortic aneurysm, uncontrolled high blood pressure, or during pregnancy. A clinician checks for these before recommending a course.</p>
          </Reveal>
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
            <Reveal className="eecp-sticky-media"><EecpSessionScene /><span className="media-label">EECP / monitored outpatient care</span></Reveal>
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

      <section className="section-pad eecp-refs">
        <div className="container">
          <div className="section-heading"><Reveal variant="mask"><span className="eyebrow">Approved &amp; studied</span><h2>Backed by evidence<br /><em>you can read yourself.</em></h2></Reveal><Reveal className="heading-aside" delay={100}><p>We link the original research and the regulatory record so you and your cardiologist can weigh the evidence directly. These are independent, peer-reviewed sources — not our own claims.</p></Reveal></div>
          <Reveal className="ref-reg" delay={120}>
            <strong>Regulatory status</strong>
            <p>Specific external counterpulsation devices have US FDA 510(k) clearance with intended uses that include angina and congestive heart failure. Clearance is device-specific; it is not proof that every patient will benefit. EECP has also been evaluated in controlled trials, registries, guidelines, and evidence reviews—with both encouraging findings and meaningful limitations.</p>
          </Reveal>
          <Reveal className="ref-list" delay={160}>
            {references.map((ref) => (
              <div className="ref-item" key={ref.href}>
                <span className="ref-tag">{ref.tag}</span>
                <a className="ref-title" href={ref.href} target="_blank" rel="noopener noreferrer">{ref.title} <b aria-hidden="true">↗</b></a>
                <p>{ref.note}</p>
              </div>
            ))}
          </Reveal>
          <Reveal className="ref-foot" delay={185}><Link className="button button-navy" href="/resources/understanding-eecp">Read the plain-language EECP guide <b aria-hidden="true">↗</b></Link></Reveal>
          <Reveal className="ref-foot" delay={200}><p>Links open the original publishers, including the American College of Cardiology, US FDA, PubMed, and PubMed Central. Rise is not affiliated with them. This page is for general understanding and is not a substitute for advice from your own cardiologist.</p></Reveal>
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
