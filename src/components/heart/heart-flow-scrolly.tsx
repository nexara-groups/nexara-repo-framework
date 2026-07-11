"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { flowSteps } from "@/content/heart-guide";
import { HeartFigure } from "@/components/heart/heart-figure";

// Chapter 01 — ride a drop of blood through the heart. Pattern-clone of
// eecp-scrolly (pin + scrub + stepped copy, shared .s-* classes). Below 900px
// or with reduced motion, CSS swaps the pinned stage for four static figures
// pre-painted per beat via data-beat — same information, zero motion.
export function HeartFlowScrolly() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 900px) and (prefers-reduced-motion: no-preference)", () => {
        const root = rootRef.current;
        if (!root) return;
        root.classList.add("is-scrolly");
        // Scope every query to the stage art — the fallback step figures
        // repeat the same classes and must never be animated.
        const art = root.querySelector<HTMLElement>(".hc-flow-art");
        if (!art) return;
        const q = gsap.utils.selector(art);
        const lane = (name: string) => q(`.${name}`)[0] as unknown as SVGPathElement;
        const ride = (laneName: string) => ({
          motionPath: { path: lane(laneName), align: lane(laneName), alignOrigin: [0.5, 0.5] as [number, number] },
          duration: 1.6,
          stagger: 0.18,
          ease: "none" as const,
        });

        gsap.set(q(".hf-label"), { opacity: 0 });
        gsap.set(q(".hf-particle"), { opacity: 0 });
        gsap.set(".s-step", { autoAlpha: 0, y: 34 });
        gsap.set(".s-step-0", { autoAlpha: 1, y: 0 });
        gsap.set(".s-bar", { scaleX: 0, transformOrigin: "left center" });

        // Post-scrolly idle loop: venous and arterial traffic keeps circulating.
        const loop = gsap.timeline({ paused: true, repeat: -1 });
        loop
          .set(q(".hf-particle-in, .hf-particle-return"), { opacity: 1 })
          .fromTo(q(".hf-particle-in"), { opacity: 1 }, { ...ride("lane-in"), duration: 3.4 }, 0)
          .fromTo(q(".hf-particle-return"), { opacity: 1 }, { ...ride("lane-return"), duration: 3.4 }, 0);

        const tl = gsap.timeline({
          defaults: { ease: "power1.inOut" },
          scrollTrigger: {
            trigger: ".hc-flow-stage",
            start: "top top",
            end: "+=380%",
            pin: true,
            scrub: 0.7,
            anticipatePin: 1,
            onLeave: () => loop.play(0),
            onEnterBack: () => loop.pause(0),
          },
        });

        // 01 — used blood streams in: vena cava → RA → RV
        tl.addLabel("in")
          .to(q(".hf-particle-in"), { opacity: 1, duration: 0.2, stagger: 0.15 }, "in")
          .to(q(".hf-particle-in"), ride("lane-in"), "in")
          .to(q(".hf-ra"), { fillOpacity: 0.45, duration: 0.5 }, "in+=0.4")
          .to(q(".hf-rv"), { fillOpacity: 0.45, duration: 0.5 }, "in+=0.8")
          .to(q(".hf-label-vc, .hf-label-ra, .hf-label-rv"), { opacity: 1, duration: 0.4, stagger: 0.15 }, "in+=0.4")
          .to(q(".hf-particle-in"), { opacity: 0, duration: 0.25 }, "in+=1.55")
          .to(".s-bar", { scaleX: 0.25, duration: 1.8 }, "in");

        tl.to(".s-step-0", { autoAlpha: 0, y: -34, duration: 0.4 }, "+=0.3")
          .to(".s-step-1", { autoAlpha: 1, y: 0, duration: 0.4 }, "<0.15")
          .addLabel("lungs");

        // 02 — out to the lungs; mid-path the particles pick up oxygen (blue → coral)
        tl.to(q(".hf-particle-lungs"), { opacity: 1, duration: 0.2, stagger: 0.15 }, "lungs")
          .to(q(".hf-particle-lungs"), ride("lane-lungs"), "lungs")
          .to(q(".hf-particle-lungs"), { fill: "#dc5f72", duration: 0.35, stagger: 0.18 }, "lungs+=0.8")
          .to(q(".hf-lung"), { fillOpacity: 0.95, duration: 0.6 }, "lungs+=0.7")
          .to(q(".hf-label-pa"), { opacity: 1, duration: 0.4 }, "lungs+=0.4")
          .to(q(".hf-particle-lungs"), { opacity: 0, duration: 0.25 }, "lungs+=1.55")
          .to(".s-bar", { scaleX: 0.5, duration: 1.8 }, "lungs");

        tl.to(".s-step-1", { autoAlpha: 0, y: -34, duration: 0.4 }, "+=0.3")
          .to(".s-step-2", { autoAlpha: 1, y: 0, duration: 0.4 }, "<0.15")
          .addLabel("return");

        // 03 — renewed blood returns: lungs → LA → LV; the thick wall gets its moment
        tl.to(q(".hf-particle-return"), { opacity: 1, duration: 0.2, stagger: 0.15 }, "return")
          .to(q(".hf-particle-return"), ride("lane-return"), "return")
          .to(q(".hf-la"), { fillOpacity: 0.45, duration: 0.5 }, "return+=0.4")
          .to(q(".hf-lv"), { fillOpacity: 0.45, duration: 0.5 }, "return+=0.8")
          .to(q(".hf-lv-wall"), { strokeWidth: 3, duration: 0.6 }, "return+=0.8")
          .to(q(".hf-label-pv, .hf-label-la, .hf-label-lv"), { opacity: 1, duration: 0.4, stagger: 0.15 }, "return+=0.4")
          .to(q(".hf-particle-return"), { opacity: 0, duration: 0.25 }, "return+=1.55")
          .to(".s-bar", { scaleX: 0.75, duration: 1.8 }, "return");

        tl.to(".s-step-2", { autoAlpha: 0, y: -34, duration: 0.4 }, "+=0.3")
          .to(".s-step-3", { autoAlpha: 1, y: 0, duration: 0.4 }, "<0.15")
          .addLabel("out");

        // 04 — the beat: LV contracts, valves flash in sequence, blood exits the aorta
        tl.to(q(".hf-lv"), { scale: 0.96, transformOrigin: "center center", duration: 0.35, ease: "power2.out" }, "out")
          .to(q(".hf-lv"), { scale: 1, duration: 0.6 }, "out+=0.5")
          .to(q(".hf-valve path"), { stroke: "#dc5f72", duration: 0.18, stagger: 0.09 }, "out+=0.1")
          .to(q(".hf-valve path"), { stroke: "#10203d", duration: 0.4, stagger: 0.09 }, "out+=0.7")
          .to(q(".hf-particle-out"), { opacity: 1, duration: 0.2, stagger: 0.15 }, "out+=0.2")
          .to(q(".hf-particle-out"), ride("lane-out"), "out+=0.2")
          .to(q(".hf-particle-out"), { opacity: 0, duration: 0.35, stagger: 0.12 }, "out+=1.4")
          .to(q(".hf-label-aorta"), { opacity: 1, duration: 0.4 }, "out+=0.5")
          .to(".s-bar", { scaleX: 1, duration: 1.8 }, "out")
          .to({}, { duration: 0.5 });

        if (process.env.NODE_ENV !== "production") {
          (window as unknown as { __heartFlowTl?: gsap.core.Timeline }).__heartFlowTl = tl;
        }

        return () => {
          root.classList.remove("is-scrolly");
          loop.kill();
        };
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className="hc-flow" id="how-it-works" ref={rootRef}>
      <div className="container scrolly-heading">
        <span className="eyebrow">Chapter 01</span>
        <h2>How your heart works,<br /><em>one beat at a time.</em></h2>
        <p>Two pumps, four valves, one loop. Scroll slowly — you&rsquo;re riding a drop of blood through it.</p>
      </div>
      <div className="hc-flow-stage scrolly-stage">
        <div className="scrolly-grid">
          <div className="scrolly-art hc-flow-art">
            <HeartFigure />
          </div>
          <div className="scrolly-copy">
            <div className="s-bar-track"><span className="s-bar" /></div>
            <div className="s-steps">
              {flowSteps.map((step, index) => (
                <div key={step.title} className={`s-step s-step-${index}`}>
                  <span className="chapter-number">{`0${index + 1} / 04`}</span>
                  <h3>{step.title}</h3>
                  <p>{step.copy}</p>
                  <div className="hc-step-fig" data-beat={index + 1} aria-hidden="true">
                    <HeartFigure ids={false} />
                  </div>
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
