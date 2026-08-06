import Link from "next/link";
import { EecpCourseGrid, EecpNaturalBypass } from "@/components/eecp-diagram";
import { EecpScrolly } from "@/components/eecp-scrolly";
import { HashlessSectionLink } from "@/components/hashless-section-link";
import { Reveal } from "@/components/reveal";
import { contact } from "@/content/site-data";

const suitabilitySignals = [
  { title: "Angina still limits daily life", copy: "Chest pressure or heaviness continues despite guideline-directed medicines and affects walking, stairs, or usual routines." },
  { title: "Another procedure is not the right next step", copy: "A cardiologist or cardiac surgeon has found that coronary anatomy, procedure risk, or other illness makes angioplasty or bypass unsuitable." },
  { title: "Symptoms returned after an earlier procedure", copy: "Angina persists after a stent or bypass and another revascularisation procedure is not considered appropriate." },
];

const reviewSignals = [
  "Significant aortic-valve leakage or an uncontrolled heart rhythm",
  "Uncontrolled blood pressure or decompensated heart failure",
  "Active thrombosis, severe leg-artery disease, or an aortic aneurysm",
  "Bleeding risk, pregnancy, or another condition requiring individual review",
];

const references = [
  {
    tag: "Clinical guideline · 2023",
    title: "AHA/ACC multisociety guideline for chronic coronary disease",
    note: "Places EECP within the broader care pathway for chronic coronary disease and refractory angina—not as a universal replacement for medicines or revascularisation.",
    href: "https://professional.heart.org/-/media/PHD-Files-2/Science-News/2/2023/2023_chronic_coronary_disease_guideline_slide_set.pdf",
  },
  {
    tag: "Coverage criteria · CMS",
    title: "External counterpulsation for severe refractory angina",
    note: "The US Medicare national coverage decision clearly describes specialist selection, disabling refractory angina, and the usual 35-session schedule.",
    href: "https://www.cms.gov/medicare-coverage-database/view/ncd.aspx?NCDId=97&NCDver=2",
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
    tag: "Collateral-function trial · 2009",
    title: "Coronary collateral growth by external counterpulsation",
    note: "A small randomised controlled trial that measured collateral function directly. Useful evidence for a possible mechanism—not proof that every patient grows a new bypass.",
    href: "https://pubmed.ncbi.nlm.nih.gov/19897461/",
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
  { q: "What does the cuff pressure feel like?", a: "Most people describe a strong, rhythmic squeeze rather than pain. Tell the team immediately about pain, numbness, skin irritation, bruising, or any new symptom so the fit, pressure, and session can be reviewed." },
  { q: "Who supervises an EECP session?", a: "A trained clinical team sets up the cuffs and ECG, checks timing and pressure, and monitors symptoms, blood pressure, rhythm, and comfort. The exact staffing and escalation plan are confirmed during your suitability review." },
  { q: "What should I wear and how should I prepare?", a: "Follow the instructions from your treatment team. Comfortable fitted clothing is commonly recommended. Advice about medicines, meals, hydration, and activity should come from the clinician who knows your history." },
  { q: "Should I continue my usual medicines?", a: "Do not stop or change heart medicines for EECP unless your treating clinician specifically tells you to. Medicines and risk-factor treatment usually continue throughout the course." },
  { q: "How is progress measured?", a: "The team compares angina frequency, short-acting nitrate use, walking or activity tolerance, and your own symptom goals with the baseline recorded before treatment. Improvement is assessed individually rather than promised by a particular week." },
  { q: "Can EECP replace bypass surgery or stents?", a: "Not when revascularisation is indicated and suitable. Angioplasty and bypass directly treat coronary anatomy; EECP is a symptom-relief option considered for selected refractory angina when other suitable treatment options are unavailable." },
  { q: "What happens if I feel unwell during treatment?", a: "Tell the team immediately. New chest pain, marked breathlessness, faintness, palpitations, leg pain, or other concerning symptoms need prompt clinical assessment and may require the session to stop." },
];

const featuredReferences = references.filter((_, index) => [0, 2, 4, 9].includes(index));
const additionalReferences = references.filter((reference) => !featuredReferences.includes(reference));

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
      <section className="section-pad eecp-glance" id="suitability">
        <div className="container">
          <div className="section-heading eecp-glance-heading">
            <Reveal variant="mask"><div><span className="eyebrow">Start with suitability</span><h2>Could EECP be<br /><em>considered for you?</em></h2></div></Reveal>
            <Reveal className="heading-aside" delay={90}><p>EECP is not a routine alternative to an indicated stent or bypass. A heart specialist first reviews your symptoms, medicines, coronary anatomy, rhythm, valves, blood pressure, and leg circulation.</p></Reveal>
          </div>
          <Reveal delay={120}>
            <div className="stat-row">
              <div><strong>0</strong><span>Incisions or anaesthesia</span></div>
              <div><strong>1</strong><span>Approximately one hour per session</span></div>
              <div><strong>35</strong><span>Commonly used full course</span></div>
              <div><strong>7</strong><span>About seven weeks at five per week</span></div>
            </div>
          </Reveal>

          <div className="eecp-fit-summary">
            <Reveal className="eecp-fit-panel eecp-fit-panel-positive" delay={100}>
              <span className="chapter-number">01 · May be considered when</span>
              <h3>Symptoms continue after the usual first steps.</h3>
              <ul>
                {suitabilitySignals.map((item) => (
                  <li key={item.title}><strong>{item.title}</strong><span>{item.copy}</span></li>
                ))}
              </ul>
            </Reveal>
            <Reveal className="eecp-fit-panel eecp-fit-panel-review" delay={170}>
              <span className="chapter-number">02 · Needs individual review</span>
              <h3>Non-invasive does not mean suitable for everyone.</h3>
              <ul>{reviewSignals.map((item) => <li key={item}>{item}</li>)}</ul>
              <p><strong>Urgent:</strong> new, worsening, or resting chest pain needs immediate medical assessment—not an EECP booking.</p>
            </Reveal>
          </div>

          <Reveal className="eecp-inline-review" delay={190}>
            <div><strong>Not sure where you fit?</strong><span>A suitability review is a clinical conversation, not a commitment to treatment.</span></div>
            <div className="eecp-inline-actions">
              <Link className="button button-coral" href="/appointment">Request a clinical review <b aria-hidden="true">↗</b></Link>
              <a className="text-link" href={contact.phoneHref}>Call {contact.phone}</a>
            </div>
          </Reveal>

          <nav className="eecp-route" aria-label="EECP page guide">
            <span>Continue through the therapy</span>
            <HashlessSectionLink targetId="how-it-works">01 · How it works</HashlessSectionLink>
            <HashlessSectionLink targetId="benefits">02 · Benefits &amp; limits</HashlessSectionLink>
            <HashlessSectionLink targetId="treatment">03 · Treatment</HashlessSectionLink>
            <HashlessSectionLink targetId="options">04 · Other options</HashlessSectionLink>
            <HashlessSectionLink targetId="questions">05 · Questions</HashlessSectionLink>
            <HashlessSectionLink targetId="evidence">06 · Evidence</HashlessSectionLink>
          </nav>
        </div>
      </section>

      <EecpScrolly />

      <section className="section-pad" id="benefits">
        <div className="container eecp-bypass-grid">
          <Reveal className="eecp-bypass-panel"><EecpNaturalBypass /></Reveal>
          <div className="eecp-bypass-copy">
            <Reveal delay={100}><span className="eyebrow">Potential benefits and clear limits</span><h2>Symptom relief may improve.<br /><em>The narrowing remains.</em></h2><p>By increasing pressure while the heart relaxes and releasing before the next contraction, EECP may support blood flow and vascular function across a treatment course. Response varies, and the therapy does not remove plaque or open a blocked artery.</p></Reveal>
            <Reveal className="eecp-benefit-panels" delay={180}>
              <article>
                <strong>Some patients may experience</strong>
                <ul>
                  <li>Fewer or less severe angina episodes</li>
                  <li>Improved walking or exercise tolerance</li>
                  <li>Lower short-acting nitrate use</li>
                  <li>Better symptom-related quality of life</li>
                </ul>
              </article>
              <article className="eecp-limit-panel">
                <strong>EECP does not</strong>
                <ul>
                  <li>Remove coronary plaque</li>
                  <li>Open a fixed narrowing</li>
                  <li>Replace indicated angioplasty or bypass</li>
                  <li>Guarantee that symptoms will improve</li>
                </ul>
              </article>
              <small>Evidence includes controlled trials and observational registries, but important uncertainty remains. Individual results vary.</small>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section-pad section-mint eecp-treatment" id="treatment">
        <div className="container">
          <div className="section-heading">
            <Reveal variant="mask"><span className="eyebrow">What treatment involves</span><h2>One monitored hour.<br /><em>A course with checkpoints.</em></h2></Reveal>
            <Reveal className="heading-aside" delay={100}><p>A commonly used course is 35 approximately one-hour sessions, usually five days a week for about seven weeks. The schedule and treatment plan are confirmed for the individual patient.</p></Reveal>
          </div>
          <div className="eecp-treatment-course">
            <Reveal className="eecp-course-copy" delay={90}>
              <span className="chapter-number">Across the course</span>
              <h3>Progress is compared with your own starting point.</h3>
              <p>Symptoms, blood pressure, rhythm, skin comfort, activity tolerance, and short-acting nitrate use can be reviewed along the way. A response is recorded—not assumed.</p>
              <div className="eecp-monitor-strip"><span>ECG rhythm</span><span>Blood pressure</span><span>Symptoms</span><span>Cuff and skin comfort</span></div>
            </Reveal>
            <Reveal delay={150}><EecpCourseGrid /></Reveal>
          </div>
          <div className="eecp-visit-grid">
            {[
              { num: "01", title: "Before the session", copy: "The team checks how you feel, prepares the skin and monitoring leads, wraps the cuffs, and confirms the plan for the day." },
              { num: "02", title: "During treatment", copy: "The machine follows the ECG while the team checks cuff timing, pressure, rhythm, blood pressure, symptoms, and comfort." },
              { num: "03", title: "Before you leave", copy: "The cuffs and sensors come off, symptoms and skin comfort are checked, and your response is added to the course record." },
            ].map((item, index) => (
              <Reveal key={item.title} delay={100 + index * 70}>
                <article><span>{item.num}</span><h3>{item.title}</h3><p>{item.copy}</p></article>
              </Reveal>
            ))}
          </div>
          <p className="eecp-treatment-note">Most people leave after the session and return to their day if clinically well. Follow the preparation and activity guidance given by your own treatment team.</p>
        </div>
      </section>

      <section className="section-pad eecp-options" id="options">
        <div className="container eecp-compare">
          <div className="section-heading"><Reveal variant="mask"><span className="eyebrow">In perspective</span><h2>Different tools.<br /><em>Different decisions.</em></h2></Reveal><Reveal className="heading-aside" delay={100}><p>These options are not a ladder and they do not solve the same problem. The plan depends on symptoms, coronary anatomy, clinical risk, urgency, and what has already been tried.</p></Reveal></div>
          <div className="eecp-option-rule" aria-label="How a coronary treatment plan is selected"><span>Symptoms</span><i>+</i><span>anatomy</span><i>+</i><span>risk and urgency</span><b aria-hidden="true">→</b><strong>clinician-selected plan</strong></div>
          <div className="eecp-option-grid">
            {[
              { num: "01", label: "The foundation", title: "Medicines and risk control", copy: "Treat symptoms and lower cardiovascular risk. They usually continue whichever additional option is selected.", signal: "Used for most people with chronic coronary disease" },
              { num: "02", label: "Selected symptom relief", title: "EECP", copy: "May reduce refractory angina symptoms without opening a fixed narrowing. Usually considered when no suitable revascularisation option remains.", signal: "A time-intensive outpatient course" },
              { num: "03", label: "Catheter procedure", title: "Angioplasty", copy: "Uses a balloon and usually a stent to open selected coronary narrowing when the anatomy and clinical situation are appropriate.", signal: "Directly treats coronary anatomy" },
              { num: "04", label: "Cardiac surgery", title: "Bypass surgery", copy: "Creates graft routes around blocked arteries when the pattern of disease, symptoms, and risk make surgery the better option.", signal: "Directly reroutes coronary blood flow" },
            ].map((item, index) => (
              <Reveal key={item.title} delay={70 + index * 60}>
                <article className={`eecp-option-card${item.title === "EECP" ? " eecp-option-selected" : ""}`}>
                  <span>{item.num} · {item.label}</span><h3>{item.title}</h3><p>{item.copy}</p><small>{item.signal}</small>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad section-mint" id="questions">
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
          <Reveal><span className="eyebrow eyebrow-light">Start with a suitability review</span><h2>Could EECP fit your care plan?</h2><p>A clinical review at Rise Medical Hub in Madhurawada comes before any treatment decision.</p></Reveal>
          <Reveal className="eecp-cta-actions" delay={100}><Link className="button button-coral" href="/appointment">Request a clinical review <b aria-hidden="true">↗</b></Link><a className="text-link text-link-light" href={contact.phoneHref}>Call {contact.phone}</a></Reveal>
        </div>
      </section>

      <section className="section-pad eecp-refs" id="evidence">
        <div className="container">
          <div className="section-heading"><Reveal variant="mask"><span className="eyebrow">Guideline, device record &amp; studies</span><h2>Read the evidence.<br /><em>Read its limits too.</em></h2></Reveal><Reveal className="heading-aside" delay={100}><p>These links include a professional guideline, regulatory and coverage records, controlled trials, registries, and evidence reviews. They are different kinds of evidence and should not be treated as equally conclusive.</p></Reveal></div>
          <Reveal className="ref-reg" delay={120}>
            <strong>Regulatory and guideline status</strong>
            <p>Specific external counterpulsation devices have US FDA 510(k) clearance. Clearance means the reviewed device was found substantially equivalent to a predicate device; it is not a guarantee of clinical benefit. The 2023 AHA/ACC guideline gives EECP a Class 2b recommendation: it may be considered for symptom relief in refractory angina when no other treatment options remain. These US regulatory and coverage records do not establish Indian approval, local coverage, or suitability for an individual patient.</p>
          </Reveal>
          <Reveal className="ref-list ref-list-featured" delay={160}>
            {featuredReferences.map((ref) => (
              <div className="ref-item" key={ref.href}>
                <span className="ref-tag">{ref.tag}</span>
                <a className="ref-title" href={ref.href} target="_blank" rel="noopener noreferrer">{ref.title} <b aria-hidden="true">↗</b></a>
                <p>{ref.note}</p>
              </div>
            ))}
          </Reveal>
          <details className="ref-more">
            <summary><span>View six additional studies and records</span><b aria-hidden="true">+</b></summary>
            <div className="ref-list">
              {additionalReferences.map((ref) => (
                <div className="ref-item" key={ref.href}>
                  <span className="ref-tag">{ref.tag}</span>
                  <a className="ref-title" href={ref.href} target="_blank" rel="noopener noreferrer">{ref.title} <b aria-hidden="true">↗</b></a>
                  <p>{ref.note}</p>
                </div>
              ))}
            </div>
          </details>
          <Reveal className="ref-foot" delay={185}><Link className="button button-navy" href="/resources/understanding-eecp">Read the plain-language EECP guide <b aria-hidden="true">↗</b></Link></Reveal>
          <Reveal className="ref-foot" delay={200}><p>Sources checked 17 July 2026. Links open the original publishers, including the American Heart Association, US FDA, CMS, PubMed, and PubMed Central. Rise is not affiliated with them. This page is general education—not a diagnosis, guarantee, or substitute for advice from your own cardiologist.</p></Reveal>
        </div>
      </section>
    </>
  );
}
