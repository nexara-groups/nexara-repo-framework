"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { conditions } from "@/content/heart-guide";

// Chapter 04 — eight conditions as a one-open-at-a-time accordion. Panels are
// controlled (buttons, not <details>) so open/close can animate height. SSR
// renders every panel open; JS collapses all but the first on mount, so the
// content is fully readable before hydration and for no-JS readers.

// Where "first step at Rise" points, per condition. Heart attack renders
// emergency copy instead of a link.
function firstStepLink(name: string): { href: string; label: string } | null {
  if (name === "Heart attack") return null;
  if (["Coronary artery disease", "Arrhythmia", "Valve disease", "Cardiomyopathy"].includes(name)) {
    return { href: "/diagnostics", label: "See the tests" };
  }
  return { href: "/appointment", label: "Book a consultation" };
}

export function ConditionsGuide() {
  const [open, setOpen] = useState<number | null>(0);
  const panels = useRef<(HTMLDivElement | null)[]>([]);
  const hydrated = useRef(false);

  useEffect(() => {
    if (hydrated.current) return;
    hydrated.current = true;
    panels.current.forEach((panel, index) => {
      if (panel) gsap.set(panel, { height: index === 0 ? "auto" : 0 });
    });
  }, []);

  function toggle(index: number) {
    const next = open === index ? null : index;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    panels.current.forEach((panel, i) => {
      if (!panel) return;
      const target = i === next ? "auto" : 0;
      if (reduced) gsap.set(panel, { height: target });
      else gsap.to(panel, { height: target, duration: 0.45, ease: "power2.inOut" });
    });
    setOpen(next);
  }

  return (
    <section className="hc-conditions section-pad" id="conditions">
      <div className="container">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Chapter 04</span>
            <h2>Eight conditions,<br /><em>without the jargon.</em></h2>
          </div>
          <div className="heading-aside">
            <p>What each one is, what it feels like, and the sign that says stop reading and act.</p>
          </div>
        </div>
        <div className="cond-list">
          {conditions.map((condition, index) => {
            const link = firstStepLink(condition.name);
            const isOpen = open === index;
            return (
              <div className="cond-row" key={condition.name}>
                <button
                  type="button"
                  className="cond-head"
                  aria-expanded={isOpen}
                  onClick={() => toggle(index)}
                >
                  <span className="cond-num">{`0${index + 1}`}</span>
                  <span className="cond-title">
                    <span className="cond-name">{condition.name}</span>
                    <span className="cond-what">{condition.what}</span>
                  </span>
                  <b className={`cond-plus${isOpen ? " cond-plus-open" : ""}`} aria-hidden="true">+</b>
                </button>
                <div
                  className="cond-panel"
                  ref={(el) => {
                    panels.current[index] = el;
                  }}
                >
                  <div className="cond-cols">
                    <div className="cond-col">
                      <small>Feels like</small>
                      <p>{condition.feelsLike}</p>
                    </div>
                    <div className="cond-col cond-redflag">
                      <small>Red flag</small>
                      <p>{condition.redFlag}</p>
                    </div>
                    <div className={`cond-col cond-first${link ? "" : " cond-first-emergency"}`}>
                      <small>First step at Rise</small>
                      <p>{condition.firstStep}</p>
                      {link ? (
                        <Link className="text-link" href={link.href}>
                          {link.label} <b aria-hidden="true">↗</b>
                        </Link>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <p className="note-strip">
          General information, not diagnosis. Symptoms overlap — a doctor puts them in your context.
        </p>
      </div>
    </section>
  );
}
