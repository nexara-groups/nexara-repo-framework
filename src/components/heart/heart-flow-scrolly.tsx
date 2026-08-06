"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { flowSteps } from "@/content/heart-guide";
import { HeartFigure } from "@/components/heart/heart-figure";
import { ChapterSources } from "@/components/heart/chapter-sources";

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
          duration: 1.8,
          stagger: 0.18,
          ease: "none" as const,
        });

        gsap.set(q(".hf-label"), { opacity: 0 });
        gsap.set(q(".hf-particle"), { opacity: 0 });
        gsap.set(q(".hf-lung-exchange"), { strokeOpacity: 0.24 });
        gsap.set(".s-step", { autoAlpha: 0, y: 34 });
        gsap.set(".s-step-0", { autoAlpha: 1, y: 0 });
        gsap.set(".s-bar", { scaleX: 0, transformOrigin: "left center" });

        const tl = gsap.timeline({
          defaults: { ease: "power1.inOut" },
          scrollTrigger: {
            trigger: ".hc-flow-stage",
            start: "top top",
            end: "+=300%",
            pin: true,
            scrub: 0.7,
            anticipatePin: 1,
          },
        });

        // 01 — used blood streams in: vena cava → RA → RV
        tl.addLabel("in")
          .to(q(".hf-particle-in"), { opacity: 1, duration: 0.2, stagger: 0.15 }, "in")
          .to(q(".hf-particle-in"), ride("lane-in"), "in")
          .to(q(".hf-ra"), { fillOpacity: 1, duration: 0.5 }, "in+=0.4")
          .to(q(".hf-rv"), { fillOpacity: 1, duration: 0.5 }, "in+=0.8")
          .to(q(".hf-valve-tricuspid path"), { stroke: "#8eb0ed", duration: 0.35 }, "in+=0.62")
          .to(q(".hf-label-vc, .hf-label-ra, .hf-label-rv"), { opacity: 1, duration: 0.4, stagger: 0.15 }, "in+=0.4")
          .to(q(".hf-particle-in"), { opacity: 0, duration: 0.25 }, "in+=1.55")
          .to(".s-bar", { scaleX: 0.25, duration: 1.8 }, "in");

        tl.to(q(".hf-label-vc, .hf-label-ra, .hf-label-rv"), { opacity: 0, duration: 0.25 }, "+=0.2")
          .to(".s-step-0", { autoAlpha: 0, y: -34, duration: 0.4 }, "<")
          .to(".s-step-1", { autoAlpha: 1, y: 0, duration: 0.4 }, "<0.15")
          .addLabel("lungs");

        // 02 — RV → pulmonary valve → pulmonary arteries → lungs. Blood remains blue
        // on this outward path; oxygenation is shown only at the lung exchange bed.
        tl.to(q(".hf-particle-lungs"), { opacity: 1, duration: 0.2, stagger: 0.15 }, "lungs")
          .to(q(".hf-particle-lungs"), ride("lane-lungs"), "lungs")
          .to(q(".hf-lung"), { fillOpacity: 0.58, duration: 0.6 }, "lungs+=0.65")
          .to(q(".hf-lung-exchange"), { strokeOpacity: 0.82, stroke: "#68a9a9", duration: 0.6 }, "lungs+=0.7")
          .to(q(".hf-valve-pulmonary path"), { stroke: "#8eb0ed", duration: 0.35 }, "lungs+=0.35")
          .to(q(".hf-label-pa"), { opacity: 1, duration: 0.4 }, "lungs+=0.4")
          .to(q(".hf-particle-lungs"), { opacity: 0, duration: 0.25 }, "lungs+=1.55")
          .to(".s-bar", { scaleX: 0.5, duration: 1.8 }, "lungs");

        tl.to(q(".hf-label-pa"), { opacity: 0, duration: 0.25 }, "+=0.2")
          .to(".s-step-1", { autoAlpha: 0, y: -34, duration: 0.4 }, "<")
          .to(".s-step-2", { autoAlpha: 1, y: 0, duration: 0.4 }, "<0.15")
          .addLabel("return");

        // 03 — renewed blood returns: lungs → LA → LV; the thick wall gets its moment
        tl.to(q(".hf-particle-return"), { opacity: 1, duration: 0.2, stagger: 0.15 }, "return")
          .to(q(".hf-particle-return"), ride("lane-return"), "return")
          .to(q(".hf-la"), { fillOpacity: 1, duration: 0.5 }, "return+=0.4")
          .to(q(".hf-lv"), { fillOpacity: 1, duration: 0.5 }, "return+=0.8")
          .to(q(".hf-lv-wall"), { strokeWidth: 3.4, duration: 0.6 }, "return+=0.8")
          .to(q(".hf-lung-exchange"), { stroke: "#df6674", strokeOpacity: 0.68, duration: 0.5 }, "return+=0.2")
          .to(q(".hf-valve-mitral path"), { stroke: "#ff9ba7", duration: 0.35 }, "return+=0.65")
          .to(q(".hf-label-pv, .hf-label-la, .hf-label-lv"), { opacity: 1, duration: 0.4, stagger: 0.15 }, "return+=0.4")
          .to(q(".hf-particle-return"), { opacity: 0, duration: 0.25 }, "return+=1.55")
          .to(".s-bar", { scaleX: 0.75, duration: 1.8 }, "return");

        tl.to(q(".hf-label-pv, .hf-label-la, .hf-label-lv"), { opacity: 0, duration: 0.25 }, "+=0.2")
          .to(".s-step-2", { autoAlpha: 0, y: -34, duration: 0.4 }, "<")
          .to(".s-step-3", { autoAlpha: 1, y: 0, duration: 0.4 }, "<0.15")
          .addLabel("out");

        // 04 — ventricular systole: the muscular heart contracts, the aortic valve opens,
        // and oxygen-rich blood leaves the LV through the aorta.
        tl.to(q(".hf-lv"), { fillOpacity: 1, duration: 0.3 }, "out")
          .to(q(".hf-heart-body"), { scale: 0.982, transformOrigin: "52% 55%", duration: 0.28, ease: "power2.in" }, "out")
          .to(q(".hf-heart-body"), { scale: 1.008, duration: 0.3, ease: "power2.out" }, "out+=0.3")
          .to(q(".hf-heart-body"), { scale: 1, duration: 0.35 }, "out+=0.62")
          .to(q(".hf-valve-aortic path"), { stroke: "#ff9ba7", duration: 0.25 }, "out+=0.1")
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
        };
      });
    }, rootRef);

    // Phone: no pin/scrub (scroll-hijack reads badly on a small screen).
    // Each per-step figure plays its own beat once it scrolls into view —
    // same story, told frame by frame, fully in motion. Plain matchMedia +
    // IntersectionObserver (mirrors VitalsDials; gsap.matchMedia's desktop/
    // mobile split fired unreliably here). gsap still drives the tweens.
    let mobileCleanup: (() => void) | undefined;
    if (window.matchMedia("(max-width: 899px) and (prefers-reduced-motion: no-preference)").matches) {
      const root = rootRef.current;
      if (root) {
        root.classList.add("mob-anim");
        const figs = gsap.utils.toArray<HTMLElement>(".hc-step-fig", root);

        // Baseline: wipe every figure back to a blank heart so the beat can
        // paint in on entry (inline styles override the static-frame CSS).
        figs.forEach((fig) => {
          const q = gsap.utils.selector(fig);
          gsap.set(q(".hf-particle"), { opacity: 0 });
          gsap.set(q(".hf-label"), { opacity: 0 });
          gsap.set(q(".hf-venous"), { fillOpacity: 0.82 });
          gsap.set(q(".hf-arterial"), { fillOpacity: 0.8 });
          gsap.set(q(".hf-lung"), { fillOpacity: 0.27 });
          gsap.set(q(".hf-lung-exchange"), { strokeOpacity: 0.24 });
          gsap.set(q(".hf-lv-wall"), { strokeWidth: 2.4 });
        });

        const rideIn = (q: ReturnType<typeof gsap.utils.selector>, laneName: string) => {
          const path = q(`.${laneName}`)[0] as unknown as SVGPathElement;
          return { motionPath: { path, align: path, alignOrigin: [0.5, 0.5] as [number, number] }, duration: 2, stagger: 0.2, ease: "none" as const };
        };

        const playBeat = (fig: HTMLElement, beat: number) => {
          const q = gsap.utils.selector(fig);
          const tl = gsap.timeline({ defaults: { ease: "power1.inOut" } });
          if (beat === 1) {
            const ride = rideIn(q, "lane-in");
            tl.to(q(".hf-particle-in"), { opacity: 1, duration: 0.2, stagger: 0.14 }, 0)
              .to(q(".hf-particle-in"), { ...ride, repeat: -1 }, 0)
              .to(q(".hf-ra"), { fillOpacity: 1, duration: 0.5 }, 0.3)
              .to(q(".hf-rv"), { fillOpacity: 1, duration: 0.5 }, 0.7)
              .to(q(".hf-valve-tricuspid path"), { stroke: "#8eb0ed", duration: 0.35 }, 0.55)
              .to(q(".hf-label-vc, .hf-label-ra, .hf-label-rv"), { opacity: 1, duration: 0.4, stagger: 0.12 }, 0.3);
          } else if (beat === 2) {
            const ride = rideIn(q, "lane-lungs");
            tl.to(q(".hf-lung"), { fillOpacity: 0.58, duration: 0.6 }, 0)
              .to(q(".hf-lung-exchange"), { strokeOpacity: 0.82, duration: 0.6 }, 0.2)
              .to(q(".hf-particle-lungs"), { opacity: 1, duration: 0.2, stagger: 0.14 }, 0.1)
              .to(q(".hf-particle-lungs"), { ...ride, repeat: -1 }, 0.1)
              .to(q(".hf-valve-pulmonary path"), { stroke: "#8eb0ed", duration: 0.35 }, 0.35)
              .to(q(".hf-label-pa"), { opacity: 1, duration: 0.4 }, 0.4);
          } else if (beat === 3) {
            const ride = rideIn(q, "lane-return");
            tl.to(q(".hf-la"), { fillOpacity: 1, duration: 0.5 }, 0.3)
              .to(q(".hf-lv"), { fillOpacity: 1, duration: 0.5 }, 0.7)
              .to(q(".hf-lv-wall"), { strokeWidth: 3.4, duration: 0.6 }, 0.7)
              .to(q(".hf-lung-exchange"), { stroke: "#df6674", strokeOpacity: 0.68, duration: 0.5 }, 0.15)
              .to(q(".hf-particle-return"), { opacity: 1, duration: 0.2, stagger: 0.14 }, 0)
              .to(q(".hf-particle-return"), { ...ride, repeat: -1 }, 0)
              .to(q(".hf-valve-mitral path"), { stroke: "#ff9ba7", duration: 0.35 }, 0.55)
              .to(q(".hf-label-pv, .hf-label-la, .hf-label-lv"), { opacity: 1, duration: 0.4, stagger: 0.12 }, 0.3);
          } else {
            const ride = rideIn(q, "lane-out");
            tl.to(q(".hf-lv"), { fillOpacity: 1, duration: 0.3 }, 0)
              .to(q(".hf-heart-body"), { scale: 0.982, transformOrigin: "52% 55%", duration: 0.28, ease: "power2.in" }, 0)
              .to(q(".hf-heart-body"), { scale: 1.008, duration: 0.3, ease: "power2.out" }, 0.3)
              .to(q(".hf-heart-body"), { scale: 1, duration: 0.35 }, 0.62)
              .to(q(".hf-valve-aortic path"), { stroke: "#ff9ba7", duration: 0.25 }, 0.1)
              .to(q(".hf-particle-out"), { opacity: 1, duration: 0.2, stagger: 0.14 }, 0.2)
              .to(q(".hf-particle-out"), { ...ride, repeat: -1 }, 0.2)
              .to(q(".hf-label-aorta"), { opacity: 1, duration: 0.4 }, 0.5);
          }
          return tl;
        };

        const timelines = new Map<Element, gsap.core.Timeline>();
        const io = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              const fig = entry.target as HTMLElement;
              if (entry.isIntersecting) {
                if (!timelines.has(fig)) timelines.set(fig, playBeat(fig, Number(fig.dataset.beat)));
                else timelines.get(fig)?.play();
              } else {
                timelines.get(fig)?.pause();
              }
            });
          },
          { threshold: 0.35 },
        );
        figs.forEach((fig) => io.observe(fig));

        mobileCleanup = () => {
          root.classList.remove("mob-anim");
          io.disconnect();
          timelines.forEach((tl) => tl.kill());
        };
      }
    }

    return () => {
      ctx.revert();
      mobileCleanup?.();
    };
  }, []);

  return (
    <section className="hc-flow" id="how-it-works" ref={rootRef}>
      <div className="container scrolly-heading">
        <span className="eyebrow">Chapter 01</span>
        <h2>How your heart works,<br /><em>one beat at a time.</em></h2>
        <p>Two pumps, four valves, one loop. Scroll slowly — you&rsquo;re riding a drop of blood through it.</p>
        <div className="hc-flow-guide" aria-label="How to use this section">
          <span><b>04</b> clear moments</span>
          <span><b>01</b> blood cell to follow</span>
          <span><i aria-hidden="true" /> Scroll to move it</span>
        </div>
      </div>
      <div className="hc-flow-stage scrolly-stage">
        <div className="scrolly-grid">
          <div className="scrolly-art hc-flow-art">
            <HeartFigure uid="flow" teaching />
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
                    <HeartFigure ids={false} teaching uid={`step${index + 1}`} />
                  </div>
                </div>
              ))}
            </div>
            <div className="scrolly-hint" aria-hidden="true">Keep scrolling <i /></div>
          </div>
        </div>
      </div>
      <div className="container chapter-sources-wrap"><ChapterSources chapter="flow" /></div>
    </section>
  );
}
