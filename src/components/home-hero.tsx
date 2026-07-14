"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HeartFigure } from "@/components/heart/heart-figure";

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
        // The beat word hides in its mask until the spike throws it up —
        // set immediately so it never flashes during the flat-line phase.
        gsap.set(".hm-line-beat .hm-line-inner", { yPercent: 115 });
        const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
        intro
          .from(".hm-hero .eyebrow", { autoAlpha: 0, y: 20, duration: 0.7 }, 0.1)
          .from(".hm-line-calm .hm-line-inner", { yPercent: 115, duration: 1.15, ease: "power4.out" }, 0.2)
          .from(".hm-hero-art", { autoAlpha: 0, scale: 0.9, transformOrigin: "center center", duration: 1.3, ease: "power2.out" }, 0.45)
          .from(".hm-hero-foot > *", { autoAlpha: 0, y: 30, duration: 0.9, stagger: 0.12 }, 2.2)
          .from(".hm-stats", { autoAlpha: 0, y: 24, duration: 0.8 }, 2.5);

        // Failsafe: if the ticker stalls (background tab, throttled device),
        // snap the timeline to completion so content is never stuck invisible.
        const failsafe = window.setTimeout(() => intro.progress(1), 5000);

        // The trace tells the brand story in three phases: it draws FLAT and
        // unhurried; strikes the R-spike in one fast punch — and that punch
        // throws the word "considered." up out of its mask; then settles out.
        // Fractions are path-length positions of the spike (measured, not tuned).
        const line = ref.current?.querySelector<SVGGeometryElement>(".hm-ecg-line");
        if (line) {
          const len = line.getTotalLength();
          const FLAT_END = 0.417, SPIKE_END = 0.574;
          gsap.set(line, { strokeDasharray: len, strokeDashoffset: len });
          intro
            .to(line, { strokeDashoffset: len * (1 - FLAT_END), duration: 1.3, ease: "power1.inOut" }, 0.5)
            .to(line, { strokeDashoffset: len * (1 - SPIKE_END), duration: 0.26, ease: "power4.in" }, ">0.12")
            .to(".hm-line-beat .hm-line-inner", { yPercent: 0, duration: 0.85, ease: "power4.out" }, "<0.05")
            .fromTo(".hm-hero h1 em", { textShadow: "0 0 42px rgba(220,95,114,.85)" }, { textShadow: "0 0 0px rgba(220,95,114,0)", duration: 1.1, ease: "power2.out" }, "<0.15")
            .to(line, { strokeDashoffset: 0, duration: 0.9, ease: "power2.out" }, ">-0.1");
        }

        // Engagement: an echo-dot rides the trace under the cursor. Cross the
        // spike and it flares — visitors can literally play the heartbeat.
        const echo = ref.current?.querySelector<SVGCircleElement>(".hm-ecg-echo");
        const hero = ref.current;
        let removeEcho: (() => void) | undefined;
        if (line && echo && hero && window.matchMedia("(pointer: fine)").matches) {
          const len = line.getTotalLength();
          const pos = { p: 0.5 };
          let lastP = pos.p;
          const place = () => {
            const pt = line.getPointAtLength(pos.p * len);
            gsap.set(echo, { attr: { cx: pt.x, cy: pt.y } });
            const spike = pos.p > 0.42 && pos.p < 0.58;
            if (spike !== (lastP > 0.42 && lastP < 0.58) && spike) {
              gsap.fromTo(echo, { scale: 1 }, { scale: 2.4, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out", transformOrigin: "center" });
            }
            lastP = pos.p;
          };
          const glide = gsap.quickTo(pos, "p", { duration: 0.45, ease: "power3.out", onUpdate: place });
          const onMove = (e: PointerEvent) => {
            const rect = hero.getBoundingClientRect();
            gsap.to(echo, { autoAlpha: 1, duration: 0.3 });
            glide(Math.min(0.99, Math.max(0.01, (e.clientX - rect.left) / rect.width)));
          };
          const onLeave = () => gsap.to(echo, { autoAlpha: 0, duration: 0.5 });
          hero.addEventListener("pointermove", onMove);
          hero.addEventListener("pointerleave", onLeave);
          removeEcho = () => {
            hero.removeEventListener("pointermove", onMove);
            hero.removeEventListener("pointerleave", onLeave);
          };
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

        return () => {
          window.clearTimeout(failsafe);
          removeEcho?.();
        };
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section className="hm-hero" ref={ref}>
      <div className="container hm-hero-head">
        <div className="hm-hero-headline">
          <span className="eyebrow eyebrow-light">Rise Medical Hub · Madhurawada, Visakhapatnam</span>
          <h1>
            <span className="hm-line hm-line-calm"><span className="hm-line-inner">Your health,</span></span>
            <span className="hm-line hm-line-beat"><span className="hm-line-inner"><em>considered.</em></span></span>
          </h1>
        </div>
        <div className="hm-hero-art" aria-hidden="true">
          <span className="hm-hero-orbit" />
          <HeartFigure ids={false} lungs={false} uid="home" />
        </div>
      </div>

      <svg className="hm-ecg" viewBox="0 0 1440 200" preserveAspectRatio="none" aria-hidden="true" focusable="false">
        <path className="hm-ecg-line" d="M0 120 H600 l16 -20 18 20 h42 l18 -72 26 124 18 -58 h52 q16 -22 32 0 H1440" />
        <circle className="hm-ecg-dot" r="5" />
        <circle className="hm-ecg-echo" r="4" />
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
