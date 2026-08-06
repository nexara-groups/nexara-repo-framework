"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { arterySteps } from "@/content/heart-guide";
import { ChapterSources } from "@/components/heart/chapter-sources";

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
      viewBox="0 0 900 340"
      role="img"
      aria-label="Diagram of a coronary artery in cross-section: plaque builds on the walls, narrows the channel, and a clot finally blocks it"
    >
      {/* Lumen — the open channel */}
      <rect className="ar-lumen" x="40" y="92" width="820" height="116" />

      {/* Walls */}
      <line className="ar-wall" x1="40" y1="90" x2="860" y2="90" />
      <line className="ar-wall" x1="40" y1="210" x2="860" y2="210" />

      {/* Blood cells riding the centre lane — painted BELOW the plaque, clot,
          and downstream wash so a cell crossing the block slips behind it
          instead of sailing over the top */}
      <path id={id("ar-lane")} className="ar-lane" d="M20 150 H880" />
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <circle key={i} className="ar-cell" r="7" cx="20" cy="150" />
      ))}

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

      {/* Clot — sized to the final lumen gap (plaque at scaleY .78 leaves
          y≈135–168 open) with a ~3px tuck under each plaque hump so it reads
          as a plug, not a blob spilling past the narrowing */}
      <path
        id={id("ar-clot")}
        className="ar-clot"
        d="M424 142 C 434 134 452 132 464 138 C 476 132 490 138 488 148 C 496 156 486 166 474 164 C 464 171 444 170 436 162 C 426 160 418 150 424 142 Z"
      />

      {/* Downstream wash — greys out everything past the block in beat 3 */}
      <g id={id("ar-downstream")} className="ar-downstream">
        <rect x="560" y="82" width="300" height="136" />
        <line x1="560" y1="90" x2="860" y2="90" />
        <line x1="560" y1="210" x2="860" y2="210" />
      </g>

      {/* Demand ECG — quickens when the heart works harder */}
      <path
        className="ar-ecg"
        d="M40 46 h60 l8 -12 8 12 h30 l8 -26 12 44 8 -18 h60 l8 -12 8 12 h30 l8 -26 12 44 8 -18 h60"
      />

      <text className="ar-demand-label" x="850" y="45" textAnchor="end">HEART-MUSCLE DEMAND</text>

      {/* Captions per beat */}
      <text className="ar-caption ar-caption-1" x="450" y="272" textAnchor="middle">Plaque narrows the channel</text>
      <text className="ar-caption ar-caption-2" x="450" y="272" textAnchor="middle">Demand rises — supply can&rsquo;t follow</text>
      <text className="ar-caption ar-caption-3" x="450" y="272" textAnchor="middle">A clot completes the block — minutes matter now</text>

      {/* Orientation key stays visible through every beat. */}
      <g className="ar-orientation">
        <circle cx="72" cy="316" r="4" /><text x="86" y="320">UPSTREAM FLOW</text>
        <path d="M215 316 H338" />
        <circle cx="370" cy="316" r="4" /><text x="384" y="320">NARROWING ZONE</text>
        <path d="M548 316 H670" />
        <circle cx="702" cy="316" r="4" /><text x="716" y="320">DOWNSTREAM MUSCLE</text>
      </g>
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

        gsap.set(q(".ar-plaque-top"), { scaleY: 0.14, transformOrigin: "center top" });
        gsap.set(q(".ar-plaque-bot"), { scaleY: 0.14, transformOrigin: "center bottom" });
        gsap.set(q(".ar-clot"), { opacity: 0 });
        gsap.set(q(".ar-downstream"), { opacity: 0 });
        gsap.set(q(".ar-caption"), { opacity: 0 });
        gsap.set(".s-step", { autoAlpha: 0, y: 34 });
        gsap.set(".s-step-0", { autoAlpha: 1, y: 0 });
        gsap.set(".s-bar", { scaleX: 0, transformOrigin: "left center" });

        // Continuous traffic: 8 cells looping along the lane, single-file.
        // repeat lives INSIDE the stagger so each cell loops its own traversal
        // (evenly spaced conveyor). A whole-tween repeat instead makes cells
        // finish and park stacked at the path end until the cycle restarts —
        // freezing at the block beat then shows a pile past the vessel mouth
        // and no traffic behind the clot.
        const loop = gsap.to(q(".ar-cell"), {
          motionPath: { path: lanePath, align: lanePath, alignOrigin: [0.5, 0.5] },
          duration: 4,
          ease: "none",
          stagger: { each: 0.5, repeat: -1 },
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
            end: "+=225%",
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
          .to(loop, { timeScale: 0, duration: 0.15, ease: "power2.out" }, "block")
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

    // Phone: play each narrowing beat as its figure scrolls into view —
    // plaque grows, traffic slows, the clot pops — instead of static frames.
    // Plain matchMedia + IntersectionObserver (see heart-flow-scrolly note).
    let mobileCleanup: (() => void) | undefined;
    if (window.matchMedia("(max-width: 899px) and (prefers-reduced-motion: no-preference)").matches) {
      const root = rootRef.current;
      if (root) {
        root.classList.add("mob-anim");
        const figs = gsap.utils.toArray<HTMLElement>(".ar-step-fig", root);

        figs.forEach((fig) => {
          const q = gsap.utils.selector(fig);
          gsap.set(q(".ar-plaque"), { scaleY: 0.14 });
          gsap.set(q(".ar-clot"), { opacity: 0 });
          gsap.set(q(".ar-downstream"), { opacity: 0 });
          gsap.set(q(".ar-caption"), { opacity: 0 });
        });

        const loops = new Map<Element, gsap.core.Tween>();
        const cellLoop = (fig: HTMLElement) => {
          const q = gsap.utils.selector(fig);
          const lane = q(".ar-lane")[0] as unknown as SVGPathElement;
          const t = gsap.to(q(".ar-cell"), {
            motionPath: { path: lane, align: lane, alignOrigin: [0.5, 0.5] },
            duration: 4,
            ease: "none",
            stagger: { each: 0.5, repeat: -1 },
          });
          t.totalTime(8);
          return t;
        };

        const playBeat = (fig: HTMLElement, beat: number) => {
          const q = gsap.utils.selector(fig);
          const cells = loops.get(fig) ?? loops.set(fig, cellLoop(fig)).get(fig)!;
          const grow = beat === 1 ? 0.55 : 0.78;
          const tl = gsap.timeline({ defaults: { ease: "power1.inOut" } });
          tl.to(q(".ar-plaque"), { scaleY: grow, duration: 1.2 }, 0)
            .to(q(`.ar-caption-${beat}`), { opacity: 1, duration: 0.4 }, 0.6);
          if (beat === 1) tl.to(cells, { timeScale: 0.55, duration: 1 }, 0.2);
          else if (beat === 2) tl.to(cells, { timeScale: 0.3, duration: 0.8 }, 0);
          else {
            tl.to(q(".ar-clot"), { opacity: 1, duration: 0.25, ease: "power2.out" }, 0.6)
              .to(cells, { timeScale: 0, duration: 0.15, ease: "power2.out" }, 0.6)
              .to(q(".ar-downstream"), { opacity: 0.85, duration: 0.9 }, 0.7);
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
                loops.get(fig)?.play();
              } else {
                loops.get(fig)?.pause();
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
          loops.forEach((t) => t.kill());
        };
      }
    }

    return () => {
      ctx.revert();
      mobileCleanup?.();
    };
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
      <div className="container chapter-sources-wrap"><ChapterSources chapter="arteries" /></div>
    </section>
  );
}
