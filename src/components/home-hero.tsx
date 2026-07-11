"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const stats = [
  { value: 4, pad: 2, label: "care pathways" },
  { value: 24, suffix: "h", label: "support line" },
  { value: 35, label: "EECP sessions" },
  { value: 1, pad: 2, label: "clear next step" },
];

export function HomeHero() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
        intro
          .from(".hm-hero .eyebrow", { autoAlpha: 0, y: 20, duration: 0.7 }, 0.1)
          .from(".hm-line-inner", { yPercent: 115, duration: 1.15, stagger: 0.15, ease: "power4.out" }, 0.2)
          .from(".hm-hero-foot > *", { autoAlpha: 0, y: 30, duration: 0.9, stagger: 0.12 }, 0.7)
          .from(".hm-stats", { autoAlpha: 0, y: 24, duration: 0.8 }, 1.0);

        // Failsafe: if the ticker stalls (background tab, throttled device),
        // snap the timeline to completion so content is never stuck invisible.
        const failsafe = window.setTimeout(() => intro.progress(1), 4000);

        // The ECG line draws itself across the page, then the dot takes over
        const line = ref.current?.querySelector<SVGGeometryElement>(".hm-ecg-line");
        if (line) {
          const len = line.getTotalLength();
          gsap.set(line, { strokeDasharray: len, strokeDashoffset: len });
          intro.to(line, { strokeDashoffset: 0, duration: 1.7, ease: "power2.inOut" }, 0.5);
        }

        // Stat counters tick up as the strip arrives
        ref.current?.querySelectorAll<HTMLElement>(".hm-stat-num").forEach((el, i) => {
          const target = Number(el.dataset.value ?? "0");
          const pad = Number(el.dataset.pad ?? "0");
          const suffix = el.dataset.suffix ?? "";
          const state = { n: 0 };
          const render = () => {
            const whole = Math.round(state.n);
            el.textContent = `${pad ? String(whole).padStart(pad, "0") : whole}${suffix}`;
          };
          render();
          intro.to(state, { n: target, duration: 1.1, ease: "power2.out", onUpdate: render }, 1.05 + i * 0.08);
        });

        if (process.env.NODE_ENV !== "production") {
          (window as unknown as { __homeHero?: object }).__homeHero = { intro };
        }

        // Scroll exit: the statement recedes as the story begins
        const st = { trigger: ref.current, start: "top top", end: "bottom top", scrub: true } as const;
        gsap.to(".hm-hero-head", { y: -110, autoAlpha: 0.15, ease: "none", scrollTrigger: st });
        gsap.to(".hm-ecg", { y: -40, ease: "none", scrollTrigger: st });

        return () => window.clearTimeout(failsafe);
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section className="hm-hero" ref={ref}>
      <div className="container hm-hero-head">
        <span className="eyebrow eyebrow-light">Rise Medical Hub · Madhurawada, Visakhapatnam</span>
        <h1>
          <span className="hm-line"><span className="hm-line-inner">Your health,</span></span>
          <span className="hm-line"><span className="hm-line-inner"><em>considered.</em></span></span>
        </h1>
      </div>

      <svg className="hm-ecg" viewBox="0 0 1440 200" preserveAspectRatio="none" aria-hidden="true" focusable="false">
        <path className="hm-ecg-line" d="M0 120 H600 l16 -20 18 20 h42 l18 -72 26 124 18 -58 h52 q16 -22 32 0 H1440" />
        <circle className="hm-ecg-dot" r="5" />
      </svg>

      <div className="container hm-hero-foot">
        <p>
          Four care pathways under one roof — EECP therapy, diagnostics, pharmacy, and OPD — with a team
          that explains before it acts, and a clear next step after every visit.
        </p>
        <div className="hm-hero-actions">
          <Link className="button button-coral" href="/appointment">Book an appointment <b aria-hidden="true">↗</b></Link>
          <Link className="button button-ghost-light" href="/eecp-therapy">Explore EECP therapy <b aria-hidden="true">↗</b></Link>
        </div>
      </div>

      <div className="container">
        <div className="hm-stats">
          {stats.map((s) => (
            <div key={s.label}>
              <strong className="hm-stat-num" data-value={s.value} data-pad={s.pad ?? 0} data-suffix={s.suffix ?? ""}>
                {`${s.pad ? String(s.value).padStart(s.pad, "0") : s.value}${s.suffix ?? ""}`}
              </strong>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
