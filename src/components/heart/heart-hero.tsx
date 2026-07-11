"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HeroEcg } from "@/components/brand-art";
import { HeartFigure } from "@/components/heart/heart-figure";

export function HeartHero() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
        intro
          .from(".hc-hero .eyebrow", { autoAlpha: 0, y: 20, duration: 0.7 }, 0.1)
          .from(".hc-hero .h-line-inner", { yPercent: 115, duration: 1.1, stagger: 0.14, ease: "power4.out" }, 0.2)
          .from(".hc-hero-copy > p", { autoAlpha: 0, y: 30, duration: 0.9 }, 0.6)
          .from(".hc-hero .eecp-hero-chips span", { autoAlpha: 0, y: 14, duration: 0.5, stagger: 0.07 }, 0.75)
          .from(".hc-hero .hero-actions", { autoAlpha: 0, y: 24, duration: 0.7 }, 0.9)
          .from(".hc-hero-art", { autoAlpha: 0, scale: 0.94, transformOrigin: "center center", duration: 1.2, ease: "power2.out" }, 0.35)
          .from(".hc-hero .eecp-hero-ecg", { autoAlpha: 0, duration: 0.8 }, 0.5);

        // Failsafe: if the ticker stalls (background tab, throttled device),
        // snap the timeline to completion so content is never stuck invisible.
        const failsafe = window.setTimeout(() => intro.progress(1), 4000);

        // Scroll exit: the statement recedes as chapter one arrives
        const st = { trigger: ref.current, start: "top top", end: "bottom top", scrub: true } as const;
        gsap.to(".hc-hero-copy", { y: -120, autoAlpha: 0.15, ease: "none", scrollTrigger: st });
        gsap.to(".hc-hero-art", { y: 90, scale: 0.95, transformOrigin: "center top", ease: "none", scrollTrigger: st });

        return () => window.clearTimeout(failsafe);
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section className="hc-hero" ref={ref}>
      <HeroEcg />
      <div className="container hc-hero-inner">
        <div className="hc-hero-copy">
          <span className="eyebrow">The Rise heart guide</span>
          <h1>
            <span className="h-line"><span className="h-line-inner">Know the engine.</span></span>
            <span className="h-line"><span className="h-line-inner"><em>Own the journey.</em></span></span>
          </h1>
          <p>
            Everything we wish every patient knew about the heart — how it works, what goes wrong,
            which signs matter, and what to do next. Twenty minutes, plain language, no jargon.
          </p>
          <div className="eecp-hero-chips">
            <span>8 chapters</span>
            <span>Doctor-reviewed</span>
            <span>Telugu · English · Hindi support</span>
          </div>
          <div className="hero-actions">
            <a className="button button-coral" href="#how-it-works">Start reading <b aria-hidden="true">↓</b></a>
            <Link className="button button-ghost-light" href="/appointment">Book a heart check <b aria-hidden="true">↗</b></Link>
          </div>
        </div>
        <div className="hc-hero-art">
          <HeartFigure ids={false} />
        </div>
      </div>
    </section>
  );
}
