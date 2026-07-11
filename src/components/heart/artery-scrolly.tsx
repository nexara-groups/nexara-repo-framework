"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { arterySteps } from "@/content/heart-guide";

// Chapter 03 — an artery in long-section narrowing over three beats:
// build-up → angina → blockage. Same scrolly conventions as chapter 01
// (pin + scrub + .s-* classes, static data-beat frames as the fallback).

// The artery figure. `ids` follows the HeartFigure convention: only the
// GSAP-animated stage instance carries ids; fallback frames are class-only.
function ArteryFigure({ ids = true }: { ids?: boolean }) {
  const id = (name: string) => (ids ? name : undefined);
  return (
    <svg
      className="artery-fig"
      viewBox="0 0 900 300"
      role="img"
      aria-label="Diagram of a coronary artery in cross-section: plaque builds on the walls, narrows the channel, and a clot finally blocks it"
    >
      {/* Lumen — the open channel */}
      <rect className="ar-lumen" x="40" y="92" width="820" height="116" />

      {/* Walls */}
      <line className="ar-wall" x1="40" y1="90" x2="860" y2="90" />
      <line className="ar-wall" x1="40" y1="210" x2="860" y2="210" />

      {/* Plaque — soft blobs anchored to each wall, scaleY-grown by the beats */}
      <path
        id={id("ar-plaque-top")}
        className="ar-plaque ar-plaque-top"
        d="M330 90 C 380 90 396 148 450 148 C 504 148 520 90 570 90 Z"
      />
      <path
        id={id("ar-plaque-bot")}
        className="ar-plaque ar-plaque-bot"
        d="M350 210 C 396 210 410 156 452 156 C 494 156 508 210 554 210 Z"
      />

      {/* Clot — completes the block at the narrowest point */}
      <path
        id={id("ar-clot")}
        className="ar-clot"
        d="M420 138 C 434 128 458 126 472 134 C 486 128 500 136 498 148 C 506 158 494 170 480 168 C 468 176 446 176 436 166 C 424 164 414 150 420 138 Z"
      />

      {/* Downstream wash — greys out everything past the block in beat 3 */}
      <g id={id("ar-downstream")} className="ar-downstream">
        <rect x="560" y="82" width="300" height="136" />
        <line x1="560" y1="90" x2="860" y2="90" />
        <line x1="560" y1="210" x2="860" y2="210" />
      </g>

      {/* Blood cells riding the centre lane */}
      <path id={id("ar-lane")} className="ar-lane" d="M20 150 H880" />
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <circle key={i} className="ar-cell" r="7" cx="20" cy="150" />
      ))}

      {/* Demand ECG — quickens when the heart works harder */}
      <path
        className="ar-ecg"
        d="M40 46 h60 l8 -12 8 12 h30 l8 -26 12 44 8 -18 h60 l8 -12 8 12 h30 l8 -26 12 44 8 -18 h60"
      />

      {/* Captions per beat */}
      <text className="ar-caption ar-caption-1" x="450" y="262" textAnchor="middle">Plaque narrows the channel</text>
      <text className="ar-caption ar-caption-2" x="450" y="262" textAnchor="middle">Demand rises — supply can&rsquo;t follow</text>
      <text className="ar-caption ar-caption-3" x="450" y="262" textAnchor="middle">A clot completes the block — minutes matter now</text>
    </svg>
  );
}

export function ArteryScrolly() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 900px) and (prefers-reduced-motion: no-preference)", () => {
        const root = rootRef.current;
        if (!root) return;
        root.classList.add("is-scrolly");
        const art = root.querySelector<HTMLElement>(".hc-artery-art");
        if (!art) return;
        const q = gsap.utils.selector(art);
        const lanePath = q(".ar-lane")[0] as unknown as SVGPathElement;

        gsap.set(q(".ar-plaque-top"), { scaleY: 0, transformOrigin: "center top" });
        gsap.set(q(".ar-plaque-bot"), { scaleY: 0, transformOrigin: "center bottom" });
        gsap.set(q(".ar-clot"), { opacity: 0 });
        gsap.set(q(".ar-downstream"), { opacity: 0 });
        gsap.set(q(".ar-caption"), { opacity: 0 });
        gsap.set(".s-step", { autoAlpha: 0, y: 34 });
        gsap.set(".s-step-0", { autoAlpha: 1, y: 0 });
        gsap.set(".s-bar", { scaleX: 0, transformOrigin: "left center" });

        // Continuous traffic: 8 cells looping along the lane, single-file.
        const loop = gsap.to(q(".ar-cell"), {
          motionPath: { path: lanePath, align: lanePath, alignOrigin: [0.5, 0.5] },
          duration: 4,
          ease: "none",
          repeat: -1,
          stagger: { each: 0.5 },
        });
        loop.totalTime(8); // skip the staggered lead-in — traffic already flowing

        const ecgLoop = gsap.fromTo(
          q(".ar-ecg"),
          { strokeDashoffset: 0 },
          { strokeDashoffset: -344, duration: 3, ease: "none", repeat: -1 },
        );

        const tl = gsap.timeline({
          defaults: { ease: "power1.inOut" },
          scrollTrigger: {
            trigger: ".hc-artery-stage",
            start: "top top",
            end: "+=300%",
            pin: true,
            scrub: 0.7,
            anticipatePin: 1,
          },
        });

        // 01 — quiet build-up: plaque grows, traffic visibly slows
        tl.addLabel("build")
          .to(q(".ar-plaque"), { scaleY: 0.55, duration: 1.2 }, "build")
          .to(loop, { timeScale: 0.55, duration: 1 }, "build+=0.2")
          .to(q(".ar-caption-1"), { opacity: 1, duration: 0.4 }, "build+=0.6")
          .to(".s-bar", { scaleX: 0.33, duration: 1.4 }, "build");

        tl.to(".s-step-0", { autoAlpha: 0, y: -34, duration: 0.4 }, "+=0.3")
          .to(".s-step-1", { autoAlpha: 1, y: 0, duration: 0.4 }, "<0.15")
          .addLabel("angina");

        // 02 — demand outruns supply: lumen squeezed to ~a third, ECG quickens
        tl.to(q(".ar-plaque"), { scaleY: 0.78, duration: 1 }, "angina")
          .to(loop, { timeScale: 0.3, duration: 0.8 }, "angina")
          .to(ecgLoop, { timeScale: 1.9, duration: 0.6 }, "angina")
          .to(q(".ar-caption-1"), { opacity: 0, duration: 0.3 }, "angina")
          .to(q(".ar-caption-2"), { opacity: 1, duration: 0.4 }, "angina+=0.4")
          .to(".s-bar", { scaleX: 0.66, duration: 1.4 }, "angina");

        tl.to(".s-step-1", { autoAlpha: 0, y: -34, duration: 0.4 }, "+=0.3")
          .to(".s-step-2", { autoAlpha: 1, y: 0, duration: 0.4 }, "<0.15")
          .addLabel("block");

        // 03 — the emergency: clot pops in, traffic stops, downstream greys out
        tl.to(q(".ar-clot"), { opacity: 1, duration: 0.25, ease: "power2.out" }, "block")
          .to(loop, { timeScale: 0, duration: 0.4 }, "block")
          .to(ecgLoop, { timeScale: 0.6, duration: 0.6 }, "block+=0.4")
          .to(q(".ar-downstream"), { opacity: 0.85, duration: 0.9 }, "block+=0.2")
          .to(q(".ar-caption-2"), { opacity: 0, duration: 0.3 }, "block")
          .to(q(".ar-caption-3"), { opacity: 1, duration: 0.4 }, "block+=0.4")
          .to(".s-bar", { scaleX: 1, duration: 1.4 }, "block")
          .to({}, { duration: 0.4 });

        if (process.env.NODE_ENV !== "production") {
          (window as unknown as { __arteryTl?: gsap.core.Timeline }).__arteryTl = tl;
        }

        return () => {
          root.classList.remove("is-scrolly");
          loop.kill();
          ecgLoop.kill();
        };
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className="hc-flow hc-artery" id="narrowing" ref={rootRef}>
      <div className="container scrolly-heading">
        <span className="eyebrow">Chapter 03</span>
        <h2>When arteries narrow,<br /><em>minutes start to matter.</em></h2>
        <p>The same story sits behind angina and heart attacks. Watch it happen — and notice how late the symptoms arrive.</p>
      </div>
      <div className="hc-artery-stage scrolly-stage">
        <div className="scrolly-grid hc-artery-grid">
          <div className="scrolly-art hc-flow-art hc-artery-art">
            <ArteryFigure />
          </div>
          <div className="scrolly-copy">
            <div className="s-bar-track"><span className="s-bar" /></div>
            <div className="s-steps">
              {arterySteps.map((step, index) => (
                <div key={step.title} className={`s-step s-step-${index}`}>
                  <span className="chapter-number">{`0${index + 1} / 03`}</span>
                  <h3>{step.title}</h3>
                  <p>{step.copy}</p>
                  <div className="hc-step-fig ar-step-fig" data-beat={index + 1} aria-hidden="true">
                    <ArteryFigure ids={false} />
                  </div>
                </div>
              ))}
            </div>
            <div className="ar-next">
              <a className="text-link" href="#warning-signs">Know the warning signs <b aria-hidden="true">↓</b></a>
            </div>
            <div className="scrolly-hint" aria-hidden="true">Keep scrolling <i /></div>
          </div>
        </div>
      </div>
    </section>
  );
}
