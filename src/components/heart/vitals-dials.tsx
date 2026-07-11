"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { vitals } from "@/content/heart-guide";

// Chapter 02 — four arc gauges that sweep once on first view, with the reading
// ticking up. Values are in the SSR HTML; JS only re-animates what is already
// there, and reduced motion leaves everything static.
export function VitalsDials() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia("(prefers-reduced-motion: no-preference)").matches) return;

    el.classList.add("vd-anim");
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        io.disconnect();
        el.classList.add("vd-on");
        el.querySelectorAll<HTMLElement>(".vd-num").forEach((numEl) => {
          const reading = numEl.dataset.reading ?? "";
          const state = { t: 0 };
          gsap.to(state, {
            t: 1,
            duration: 1.1,
            ease: "power2.out",
            onUpdate() {
              numEl.textContent = reading.replace(/\d+(\.\d+)?/g, (match) => {
                const target = parseFloat(match);
                const value = target * state.t;
                return match.includes(".") ? value.toFixed(1) : String(Math.round(value));
              });
            },
          });
        });
      },
      { threshold: 0.35 },
    );
    io.observe(el.querySelector(".vd-grid") ?? el);
    return () => io.disconnect();
  }, []);

  return (
    <section className="hc-vitals section-mint section-pad" id="numbers" ref={ref}>
      <div className="container">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Chapter 02</span>
            <h2>Four numbers,<br /><em>one dashboard.</em></h2>
          </div>
          <div className="heading-aside">
            <p>
              These four are the dashboard your doctor reads first — and the earliest
              place trouble shows, years before symptoms.
            </p>
          </div>
        </div>
        <div className="vd-grid">
          {vitals.map((vital) => (
            <article className="vd-card" key={vital.label}>
              <div className="vd-dial">
                <svg viewBox="0 0 120 120" aria-hidden="true" focusable="false">
                  <circle className="vd-track" cx="60" cy="60" r="48" />
                  <circle className="vd-arc" cx="60" cy="60" r="48" />
                </svg>
                <div className="vd-dial-read">
                  <strong className="vd-num" data-reading={vital.reading}>{vital.reading}</strong>
                  <small>{vital.unit}</small>
                </div>
              </div>
              <h3>{vital.label}</h3>
              <ul className="vd-bands">
                {vital.bands.map((band) => (
                  <li key={band.label} className={`vd-band vd-${band.tone}`}>
                    <strong>{band.label}</strong>
                    <span>{band.range}</span>
                  </li>
                ))}
              </ul>
              <p className="vd-note">{vital.note}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
