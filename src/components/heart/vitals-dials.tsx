"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { vitals } from "@/content/heart-guide";

// Chapter 02 — the four-gauge dashboard deals itself on scroll: the cards
// open as a stacked deck, then the scrub fans them into an arc rotated about
// a distant bottom pivot (card-fan carousel style). Hover lifts a card clear
// for reading. Arcs sweep and readings tick up on first view. Values live in
// the SSR HTML; mobile and reduced motion get the static grid.
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

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 981px)", () => {
        const scrolly = el.querySelector<HTMLElement>(".vd-scrolly");
        const slots = gsap.utils.toArray<HTMLElement>(".vd-slot", el);
        if (!scrolly || slots.length < 2) return;

        // Fan geometry: each card swings about a pivot ~R below the deck, so
        // its resting pose is rotate(θ) with the matching arc displacement
        // (recentred so the fan's midline stays put in the sticky viewport).
        const ANGLES = [-16, -5.5, 5.5, 16];
        const RADIUS = 1150;
        const poses = ANGLES.map((deg) => {
          const theta = (deg * Math.PI) / 180;
          return {
            x: Math.sin(theta) * RADIUS,
            y: (1 - Math.cos(theta)) * RADIUS - 24,
            rotation: deg,
          };
        });

        // Scroll journey: deck → fan → straight line-up. The fan is the
        // mid-scroll flourish; the section settles with the four cards
        // standing level in a row, holds a beat, then unpins.
        const tl = gsap.timeline({
          defaults: { ease: "power2.inOut" },
          scrollTrigger: {
            trigger: scrolly,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        });
        // Line-up spacing: an even gap, but never wider than the grid box so
        // the outer cards stay inside the container at every viewport.
        const grid = el.querySelector<HTMLElement>(".vd-grid");
        // Even centre-to-centre spacing with a guaranteed gap. The card width
        // (min 262px / 19.5vw) is always < grid/4, so the w+20 branch wins and
        // the four cards never touch — the old formula could collapse to ~w.
        const spacing = () => {
          const w = slots[0]?.offsetWidth ?? 262;
          return Math.min(w + 20, ((grid?.offsetWidth ?? 1100) - w) / 3);
        };
        // Deal the deck into a brief fan…
        slots.forEach((slot, index) => {
          tl.fromTo(
            slot,
            // Deck pose: stacked with a slight shuffle so it reads as cards.
            { x: 0, y: 20, rotation: (index - 1.5) * 2.5 },
            { ...poses[index], duration: 0.5, immediateRender: true },
            index * 0.04,
          );
        });
        // …then settle FAST into an evenly-spaced, level row.
        slots.forEach((slot, index) => {
          tl.to(
            slot,
            { x: () => (index - 1.5) * spacing(), y: 0, rotation: 0, duration: 0.45 },
            0.48 + index * 0.03,
          );
        });
        // Long hold on the spaced row — the row forms in the first ~40% of the
        // scroll, then the reader dwells on four readable cards for the rest,
        // not on the transient stack.
        tl.to({}, { duration: 1.6 });
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
            <div className="vd-grid">
              {vitals.map((vital) => (
                <div className="vd-slot" key={vital.label}>
                <article className="vd-card">
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
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
