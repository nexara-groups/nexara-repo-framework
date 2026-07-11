import Link from "next/link";
import { emergencySigns, plannedSigns } from "@/content/heart-guide";
import { contact } from "@/content/site-data";
import { Reveal } from "@/components/reveal";

// Chapter 05 — the page's most important information, split by urgency:
// act-now signs (108) versus book-a-review signs. Server component.
export function TriageSigns() {
  return (
    <section className="hc-triage section-ink section-pad" id="warning-signs">
      <div className="container">
        <div className="section-heading">
          <div>
            <span className="eyebrow eyebrow-light">Chapter 05</span>
            <h2>Warning signs,<br /><em>sorted by urgency.</em></h2>
          </div>
          <div className="heading-aside">
            <p>Two lists. One means act this minute; the other means book a proper look this week. Both beat waiting.</p>
          </div>
        </div>
        <div className="triage-grid">
          <Reveal variant="blur">
            <div className="triage-panel triage-emergency">
              <div className="triage-head">
                <span className="pulse-icon" aria-hidden="true" />
                <span className="eyebrow">Act now — emergency</span>
              </div>
              <ul>
                {emergencySigns.map((sign) => (
                  <li key={sign}>{sign}</li>
                ))}
              </ul>
              <a className="button button-coral triage-cta" href="tel:108">Call 108 now <b aria-hidden="true">↗</b></a>
              <p className="triage-foot">
                …or reach the nearest emergency room. Do not drive yourself. Do not wait to see if it passes.
              </p>
            </div>
          </Reveal>
          <Reveal variant="blur" delay={120}>
            <div className="triage-panel triage-planned">
              <div className="triage-head">
                <span className="eyebrow">Book a planned review</span>
              </div>
              <ul>
                {plannedSigns.map((sign) => (
                  <li key={sign}>{sign}</li>
                ))}
              </ul>
              <div className="triage-actions">
                <Link className="button button-coral triage-cta" href="/appointment">Book a heart check <b aria-hidden="true">↗</b></Link>
                <a className="button button-ghost-light triage-cta" href={contact.phoneHref}>Call {contact.phone}</a>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
