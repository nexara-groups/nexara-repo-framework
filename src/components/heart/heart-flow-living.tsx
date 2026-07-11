"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { flowSteps } from "@/content/heart-guide";
import { LivingHeart } from "@/components/heart/living-heart";

// Chapter 01 — "How your heart works" in the Living Organ language: the shared
// luminous canvas heart pulses and flows continuously, while the pinned four-beat
// scroll lights the journey — venous blood in, out to the lungs, back through the
// left heart, one beat out the aorta. Reduced-motion / narrow screens fall back to
// a calm dark stepped read.
export function HeartFlowLiving() {
  const rootRef = useRef<HTMLElement>(null);
  const stageRef = useRef(0);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const steps = Array.from(root.querySelectorAll<HTMLElement>(".s-step"));
    const bar = root.querySelector<HTMLElement>(".s-bar");
    const setActive = (progress: number) => {
      const idx = Math.min(flowSteps.length - 1, Math.floor(progress * flowSteps.length + 0.001));
      steps.forEach((el, i) => el.classList.toggle("s-on", i === idx));
      if (bar) bar.style.transform = `scaleX(${Math.max(0.04, progress)})`;
    };

    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    mm.add("(min-width: 900px) and (prefers-reduced-motion: no-preference)", () => {
      root.classList.add("is-live");
      setActive(0);
      const st = ScrollTrigger.create({
        trigger: root.querySelector(".hc-live-stage") as HTMLElement,
        start: "top top", end: "+=360%", pin: true, scrub: 0.5, anticipatePin: 1,
        onUpdate: (self) => { stageRef.current = self.progress; setActive(self.progress); },
      });
      if (process.env.NODE_ENV !== "production") {
        (window as unknown as { __flowLive?: unknown }).__flowLive = {
          setStage: (p: number) => { stageRef.current = p; setActive(p); },
          st,
        };
      }
      return () => { root.classList.remove("is-live"); st.kill(); };
    });

    return () => mm.revert();
  }, []);

  return (
    <section className="hc-flow-live section-ink" id="how-it-works" ref={rootRef}>
      <div className="container scrolly-heading">
        <span className="eyebrow eyebrow-light">Chapter 01</span>
        <h2>How your heart works,<br /><em>one beat at a time.</em></h2>
        <p>Two pumps, four valves, one loop. Scroll slowly — you&rsquo;re watching a drop of blood make the round trip.</p>
      </div>
      <div className="hc-live-stage">
        <div className="hc-live-grid container">
          <div className="hc-live-art">
            <LivingHeart stageRef={stageRef} />
          </div>
          <div className="hc-live-copy">
            <div className="s-bar-track"><span className="s-bar" /></div>
            <div className="s-steps">
              {flowSteps.map((step, i) => (
                <div key={step.title} className={`s-step${i === 0 ? " s-on" : ""}`}>
                  <span className="chapter-number">{`0${i + 1} / 04`}</span>
                  <h3>{step.title}</h3>
                  <p>{step.copy}</p>
                </div>
              ))}
            </div>
            <div className="scrolly-hint" aria-hidden="true">Keep scrolling <i /></div>
          </div>
        </div>
      </div>

      {/* Reduced-motion / narrow-screen fallback: plain stepped read */}
      <div className="hc-live-fallback container">
        {flowSteps.map((step, i) => (
          <div key={step.title} className="hc-live-fb-step">
            <span className="chapter-number">{`0${i + 1} / 04`}</span>
            <h3>{step.title}</h3>
            <p>{step.copy}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
