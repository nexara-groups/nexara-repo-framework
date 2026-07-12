"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const steps = [
  { title: "Cuffs, not catheters", copy: "Three sets of cuffs — like large blood-pressure cuffs — wrap around your calves, thighs, and hips. Nothing enters the body." },
  { title: "A squeeze while the heart rests", copy: "Between beats, while your heart is refilling, the cuffs inflate in a wave from the calves upward — pushing blood back toward the heart at the exact moment it can receive it." },
  { title: "Release before the next beat", copy: "A split second before your heart pumps again, every cuff releases at once. The heart pushes into emptier vessels, so each beat takes less effort." },
  { title: "Guided by your own ECG", copy: "The machine reads your heart rhythm live and times every squeeze and release to it. Your heartbeat leads; the therapy follows." },
];

const cuffRows = [
  { y: 300, label: "Hips", row: "sq2" },
  { y: 382, label: "Thighs", row: "sq1" },
  { y: 464, label: "Calves", row: "sq0" },
];

export function EecpScrolly() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        rootRef.current?.classList.add("is-scrolly");

        const pathLen = (i: number, t: SVGPathElement) => t.getTotalLength();
        gsap.set(".s-ecg", { strokeDasharray: pathLen, strokeDashoffset: pathLen });
        gsap.set(".s-ecg-dot", { opacity: 0 });
        gsap.set(".s-cL", { transformOrigin: "left center" });
        gsap.set(".s-cR", { transformOrigin: "right center" });
        gsap.set(".s-cuff", { opacity: 0, scale: 1.12, transformOrigin: "center center" });
        gsap.set(".s-cuff-label", { opacity: 0 });
        gsap.set(".s-flow", { opacity: 0 });
        gsap.set(".s-ripple", { opacity: 0, transformOrigin: "center center" });
        gsap.set(".s-heart-ring, .s-heart-core", { transformOrigin: "center center" });
        gsap.set(".s-step", { autoAlpha: 0, y: 34 });
        gsap.set(".s-step-0", { autoAlpha: 1, y: 0 });
        gsap.set(".s-bar", { scaleX: 0, transformOrigin: "left center" });

        const tl = gsap.timeline({
          defaults: { ease: "power1.inOut" },
          scrollTrigger: { trigger: ".scrolly-stage", start: "top top", end: "+=340%", pin: true, scrub: 0.7, anticipatePin: 1 },
        });

        // 01 — the cuffs wrap, calves first
        tl.to(".s-cuff", { opacity: 1, scale: 1, duration: 0.8, stagger: 0.12 })
          .to(".s-cuff-label", { opacity: 1, duration: 0.4, stagger: 0.1 }, "<0.3")
          .to(".s-bar", { scaleX: 0.25, duration: 1 }, 0);

        tl.to(".s-step-0", { autoAlpha: 0, y: -34, duration: 0.4 }, "+=0.4")
          .to(".s-step-1", { autoAlpha: 1, y: 0, duration: 0.4 }, "<0.15")
          .addLabel("squeeze");

        // 02 — diastole: squeeze rises calves → thighs → hips, blood travels to the heart
        tl.to(".sq0 rect", { scaleX: 1.3, fill: "#a8d4ce", duration: 0.5 }, "squeeze")
          .to(".sq1 rect", { scaleX: 1.3, fill: "#a8d4ce", duration: 0.5 }, "squeeze+=0.35")
          .to(".sq2 rect", { scaleX: 1.3, fill: "#a8d4ce", duration: 0.5 }, "squeeze+=0.7")
          .to(".s-flow", { opacity: 1, duration: 0.2, stagger: 0.25 }, "squeeze+=0.3")
          .to(".s-flow", { y: -252, duration: 1.4, stagger: 0.25, ease: "power1.in" }, "squeeze+=0.35")
          .to(".s-flow", { opacity: 0, duration: 0.3, stagger: 0.25 }, "squeeze+=1.5")
          .to(".s-heart-ring", { scale: 1.09, stroke: "#a8d4ce", duration: 1.2 }, "squeeze+=0.4")
          .to(".s-bar", { scaleX: 0.5, duration: 1.8 }, "squeeze");

        tl.to(".s-step-1", { autoAlpha: 0, y: -34, duration: 0.4 }, "+=0.3")
          .to(".s-step-2", { autoAlpha: 1, y: 0, duration: 0.4 }, "<0.15")
          .addLabel("release");

        // 03 — pre-systole: everything lets go at once, the heart beats easier
        tl.to(".s-cuff", { scaleX: 1, fill: "#dcefeb", duration: 0.25, ease: "power2.out" }, "release")
          .to(".s-heart-ring", { scale: 1, stroke: "#dc5f72", duration: 0.4 }, "release")
          .to(".s-heart-core", { scale: 1.35, duration: 0.25, ease: "power2.out" }, "release+=0.1")
          .to(".s-heart-core", { scale: 1, duration: 0.5 }, "release+=0.4")
          .to(".s-ripple", { opacity: 0.9, duration: 0.1 }, "release+=0.15")
          .to(".s-ripple", { scale: 3.6, opacity: 0, duration: 1 }, "release+=0.2")
          .to(".s-bar", { scaleX: 0.75, duration: 1.4 }, "release");

        tl.to(".s-step-2", { autoAlpha: 0, y: -34, duration: 0.4 }, "+=0.3")
          .to(".s-step-3", { autoAlpha: 1, y: 0, duration: 0.4 }, "<0.15")
          .addLabel("ecg");

        // 04 — the ECG leads: trace draws itself, the pulse rides it
        tl.to(".s-ecg", { strokeDashoffset: 0, duration: 1.6, ease: "none" }, "ecg")
          .to(".s-ecg-dot", { opacity: 1, duration: 0.15 }, "ecg")
          .to(".s-ecg-dot", { motionPath: { path: ".s-ecg", align: ".s-ecg", alignOrigin: [0.5, 0.5] }, duration: 1.6, ease: "none" }, "ecg")
          .to(".s-bar", { scaleX: 1, duration: 1.8 }, "ecg")
          .to({}, { duration: 0.5 });

        if (process.env.NODE_ENV !== "production") {
          (window as unknown as { __eecpTl?: gsap.core.Timeline }).__eecpTl = tl;
        }
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className="eecp-scrolly" id="how-it-works" ref={rootRef}>
      <div className="container scrolly-heading">
        <span className="eyebrow eyebrow-light">How it works</span>
        <h2>One heartbeat,<br /><em>frame by frame.</em></h2>
        <p>Scroll slowly — this is what happens inside a single heartbeat, and it repeats around 3,600 times over an hour-long session.</p>
      </div>
      <div className="scrolly-stage">
        <div className="scrolly-grid">
          <div className="scrolly-art">
            <svg viewBox="0 0 460 560" role="img" focusable="false" aria-label="Diagram of EECP: cuffs on the calves, thighs, and hips squeeze in sequence while the heart rests, pushing blood back toward the heart, then release before the next beat, all timed to the ECG.">
              <path className="s-ecg" d="M10 84 H120 l14 0 8-22 10 44 9-22 h34 l8-14 8 14 h110 l14 0 8-22 10 44 9-22 h96" />
              <circle className="s-ecg-dot" cx="0" cy="0" r="5" />
              <g>
                <circle className="s-heart-ring" cx="230" cy="168" r="34" />
                <circle className="s-ripple" cx="230" cy="168" r="14" />
                <circle className="s-heart-core" cx="230" cy="168" r="13" />
              </g>
              <text className="s-label" x="278" y="173">Your heart</text>
              <line className="s-vessel" x1="230" y1="206" x2="230" y2="506" />
              {[0, 1, 2].map((i) => (
                <circle key={i} className="s-flow" cx="230" cy="470" r="5" />
              ))}
              {cuffRows.map((cuff) => (
                <g key={cuff.row} className={cuff.row}>
                  <rect className="s-cuff s-cL" x="148" y={cuff.y} width="58" height="52" rx="10" />
                  <rect className="s-cuff s-cR" x="254" y={cuff.y} width="58" height="52" rx="10" />
                  <text className="s-label s-cuff-label" x="330" y={cuff.y + 31}>{cuff.label}</text>
                </g>
              ))}
            </svg>
          </div>
          <div className="scrolly-copy">
            <div className="s-bar-track"><span className="s-bar" /></div>
            <div className="s-steps">
              {steps.map((step, index) => (
                <div key={step.title} className={`s-step s-step-${index}`}>
                  <span className="chapter-number">{`0${index + 1} / 04`}</span>
                  <h3>{step.title}</h3>
                  <p>{step.copy}</p>
                </div>
              ))}
            </div>
            <div className="scrolly-hint" aria-hidden="true">Keep scrolling <i /></div>
          </div>
        </div>
      </div>
    </section>
  );
}
