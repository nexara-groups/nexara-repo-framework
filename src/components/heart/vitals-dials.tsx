"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { vitals } from "@/content/heart-guide";
import { ChapterSources } from "@/components/heart/chapter-sources";

// Chapter 02 — the four-gauge dashboard deals itself on scroll: the cards
// open as a stacked deck, fan into an arc, and then take turns moving into a
// clear reading position before settling into a level comparison row. Arcs
// sweep on first view; clinical values never count through false readings.
// Values live in the SSR HTML;
// mobile and reduced motion get the static grid.
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
      },
      { threshold: 0.35 },
    );
    io.observe(el.querySelector(".vd-grid") ?? el);

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 981px)", () => {
        const scrolly = el.querySelector<HTMLElement>(".vd-scrolly");
        const slots = gsap.utils.toArray<HTMLElement>(".vd-slot", el);
        const cueCount = el.querySelector<HTMLElement>(".vd-motion-count strong");
        const cueBar = el.querySelector<HTMLElement>(".vd-motion-cue i b");
        const grid = el.querySelector<HTMLElement>(".vd-grid");
        if (!scrolly || slots.length < 2) return;

        // Fan geometry: each card swings about a pivot ~R below the deck, so its
        // resting pose is rotate(θ) with the matching arc displacement (recentred
        // so the fan's midline stays put in the sticky viewport).
        const ANGLES = [-15, -5, 5, 15];
        const RADIUS = 1180;
        const poses = ANGLES.map((deg) => {
          const theta = (deg * Math.PI) / 180;
          return { x: Math.sin(theta) * RADIUS, y: (1 - Math.cos(theta)) * RADIUS - 20, rotation: deg };
        });

        // Even centre-to-centre spacing with a guaranteed gap for the final row;
        // the card width is always < grid/4 so the outer cards stay in-container.
        const spacing = () => {
          const w = slots[0]?.offsetWidth ?? 262;
          return Math.min(w + 20, ((grid?.offsetWidth ?? 1100) - w) / 3);
        };

        gsap.set(slots, { willChange: "transform, opacity" });
        gsap.set(el.querySelectorAll(".vd-band, .vd-note"), { opacity: 0, y: 6 });

        // Two clean beats, scrubbed: (1) deal the four cards up into a fan,
        // (2) the fan straightens and spreads into a level comparison row.
        // No stacked-deck pile-up and no one-at-a-time dwell — legible + short.
        const tl = gsap.timeline({
          defaults: { ease: "power2.inOut" },
          scrollTrigger: {
            trigger: scrolly,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.5,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (cueBar) cueBar.style.transform = `scaleX(${(0.12 + self.progress * 0.88).toFixed(3)})`;
              if (cueCount) cueCount.textContent = `0${Math.min(slots.length, Math.floor(self.progress * slots.length) + 1)}`;
            },
          },
        });

        // Beat 1 — deal each card straight to its fan pose (staggered rise).
        slots.forEach((slot, index) => {
          tl.fromTo(
            slot,
            { x: 0, y: 132, rotation: poses[index]!.rotation * 0.3, scale: 0.95, autoAlpha: 0 },
            { ...poses[index], scale: 1, autoAlpha: 1, duration: 0.55, ease: "power3.out", immediateRender: true },
            index * 0.09,
          );
        });
        tl.to(el.querySelectorAll(".vd-band, .vd-note"), { opacity: 1, y: 0, duration: 0.4, stagger: 0.012 }, 0.34);
        tl.to({}, { duration: 0.5 }); // hold — read the fan

        // Beat 2 — straighten and spread into a level comparison row.
        slots.forEach((slot, index) => {
          tl.to(
            slot,
            { x: () => (index - 1.5) * spacing(), y: 0, rotation: 0, scale: 1, autoAlpha: 1, duration: 0.55 },
            index === 0 ? ">" : "<+=0.05",
          );
        });
        tl.to({}, { duration: 0.4 });
      });
    }, el);

    return () => {
      io.disconnect();
      ctx.revert();
    };
  }, []);

  return (
    <section className="hc-vitals section-mint section-pad" id="numbers" ref={ref}>
      <div className="vd-scrolly">
        <div className="vd-sticky">
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
            <div className="vd-motion-cue" aria-hidden="true">
              <span className="vd-motion-count"><strong>01</strong> / 04</span>
              <span>Scroll to compare</span>
              <i><b /></i>
            </div>
            <div className="vd-grid">
              {vitals.map((vital, index) => (
                <div className="vd-slot" data-index={`0${index + 1}`} key={vital.label}>
                <article className="vd-card" tabIndex={0} aria-label={`${vital.label}: ${vital.reading} ${vital.unit}`}>
                  <span className="vd-card-index" aria-hidden="true">0{index + 1}</span>
                  <div className="vd-dial">
                    <svg viewBox="0 0 120 120" aria-hidden="true" focusable="false">
                      <circle className="vd-track" cx="60" cy="60" r="48" />
                      <circle className="vd-arc" cx="60" cy="60" r="48" />
                    </svg>
                    <div className="vd-dial-read">
                      <strong className="vd-num">{vital.reading}</strong>
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
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="container chapter-sources-wrap"><ChapterSources chapter="vitals" /></div>
    </section>
  );
}
