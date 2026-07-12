import Link from "next/link";
import { emergencySigns, plannedSigns } from "@/content/heart-guide";
import { contact } from "@/content/site-data";
import { Reveal } from "@/components/reveal";

// Chapter 05 — the page's most important information, split by urgency:
// act-now signs (108) versus book-a-review signs. Server component.
export function TriageSigns() {
  return (
    <section className="hc-triage section-pad" id="warning-signs">
      <div className="container">
        <div className="triage-alert-grid">
          <div className="triage-alert-copy">
            <span className="eyebrow">Chapter 05 — warning signs</span>
            <h2>Some symptoms<br /><em>are a call.</em></h2>
            <p>Stop reading. Call 108 or get to the nearest emergency room. Do not drive yourself. Do not wait to see if it passes.</p>
            <a className="triage-emergency-button" href="tel:108">Call 108 <b aria-hidden="true">↗</b></a>
          </div>
          <Reveal variant="blur">
            <div className="triage-alert-list">
              {emergencySigns.map((sign, index) => (
                <div key={sign}><span>0{index + 1}</span><p>{sign}</p></div>
              ))}
            </div>
          </Reveal>
        </div>
        <Reveal variant="blur" delay={120}>
          <div className="triage-plan">
            <div className="triage-plan-head">
              <strong>Not a siren?</strong>
              <p>These signs mean book a proper look this week — a planned visit, not a bookmark. Both beat waiting.</p>
              <div className="triage-plan-actions">
                <Link className="button button-coral" href="/appointment">Book a heart check <b aria-hidden="true">↗</b></Link>
                <a className="button button-ghost-light" href={contact.phoneHref}>Call {contact.phone}</a>
              </div>
            </div>
            <ul>
              {plannedSigns.map((sign) => (
                <li key={sign}>{sign}</li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
      <svg className="triage-wave" viewBox="0 0 1440 110" preserveAspectRatio="none" aria-hidden="true"><path d="M0 72 H380 l18 -8 16 8 h240 l15 -56 22 82 20 -34 h270 l18 -8 16 8 h435" /></svg>
    </section>
  );
}
