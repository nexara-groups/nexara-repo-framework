"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HeroEcg, EecpPulseArt } from "@/components/brand-art";
import { HashlessSectionLink } from "@/components/hashless-section-link";

export function EecpHero() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Entrance — plays once
        const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
        intro
          .from(".h-line-inner", { yPercent: 115, duration: 0.72, stagger: 0.08, ease: "power4.out" }, 0.05)
          .from(".hi", { y: 24, duration: 0.5, stagger: 0.04 }, 0.18)
          .from(".eecp-hero-chips span", { y: 10, duration: 0.3, stagger: 0.04 }, 0.34)
          .from(".eecp-hero-art svg", { scale: 0.94, x: 36, transformOrigin: "center center", duration: 0.72, ease: "power2.out" }, 0.16)
          .from(".eecp-hero-card", { y: 12, duration: 0.35 }, 0.48)
          .from(".eecp-hero-ecg", { y: 10, duration: 0.42 }, 0.24);

        // Failsafe: if the ticker stalls (background tab, throttled device),
        // snap the timeline to completion so content is never stuck invisible.
        const failsafe = window.setTimeout(() => intro.progress(1), 2000);

        // The artwork breathes only while the hero is onscreen.
        const floatTween = gsap.to(".art-float", { y: 13, duration: 3.2, ease: "sine.inOut", repeat: -1, yoyo: true, delay: 1.6 });
        ScrollTrigger.create({
          trigger: ref.current,
          start: "top bottom",
          end: "bottom top",
          onEnter: () => floatTween.play(),
          onEnterBack: () => floatTween.play(),
          onLeave: () => floatTween.pause(),
          onLeaveBack: () => floatTween.pause(),
        });

        const ring = ref.current?.querySelector<SVGGeometryElement>(".eecp-hero-art .hero-ring");
        if (ring) {
          const len = ring.getTotalLength();
          gsap.set(ring, { strokeDasharray: len, strokeDashoffset: len });
          intro.to(ring, { strokeDashoffset: 0, duration: 0.8, ease: "power2.inOut" }, 0.28);
        }

        if (process.env.NODE_ENV !== "production") {
          (window as unknown as { __eecpHero?: object }).__eecpHero = { intro, ScrollTrigger };
        }

        // Exit — scroll-scrubbed parallax peel toward the story below
        const st = { trigger: ref.current, start: "top top", end: "bottom top", scrub: true } as const;
        gsap.to(".eecp-hero-copy", { y: -140, autoAlpha: 0.1, ease: "none", scrollTrigger: st });
        gsap.to(".eecp-hero-art", { y: 120, scale: 0.9, transformOrigin: "center top", ease: "none", scrollTrigger: st });
        gsap.fromTo(".eecp-hero-ecg", { opacity: 0.8 }, { yPercent: 45, opacity: 0.25, ease: "none", immediateRender: false, scrollTrigger: st });

        // Pointer parallax on the art
        const art = ref.current?.querySelector(".eecp-hero-art svg");
        if (art) {
          const xTo = gsap.quickTo(art, "x", { duration: 0.6, ease: "power3.out" });
          const yTo = gsap.quickTo(art, "y", { duration: 0.6, ease: "power3.out" });
          const move = (e: PointerEvent) => {
            const r = ref.current!.getBoundingClientRect();
            xTo(((e.clientX - r.left) / r.width - 0.5) * 22);
            yTo(((e.clientY - r.top) / r.height - 0.5) * 16);
          };
          const leave = () => { xTo(0); yTo(0); };
          ref.current?.addEventListener("pointermove", move);
          ref.current?.addEventListener("pointerleave", leave);
          return () => {
            window.clearTimeout(failsafe);
            ref.current?.removeEventListener("pointermove", move);
            ref.current?.removeEventListener("pointerleave", leave);
          };
        }
        return () => {
          window.clearTimeout(failsafe);
        };
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section className="eecp-hero" ref={ref}>
      <HeroEcg />
      <div className="container eecp-hero-inner">
        <div className="eecp-hero-copy">
          <span className="eyebrow hi">Signature care — EECP therapy</span>
          <h1>
            <span className="h-line"><span className="h-line-inner">EECP for</span></span>
            <span className="h-line"><span className="h-line-inner"><em>selected persistent angina.</em></span></span>
          </h1>
          <p className="hi">EECP is a non-invasive symptom-relief option for selected people whose angina continues despite medicines. It is considered when angioplasty or bypass is unsuitable or no further revascularisation option remains.</p>
          <div className="eecp-hero-chips"><span>Selected by a heart specialist</span><span>Non-invasive · no anaesthesia</span><span>Monitored outpatient care</span></div>
          <div className="hero-actions hi">
            <Link className="button button-coral" href="/appointment">Request a suitability review <b aria-hidden="true">↗</b></Link>
            <HashlessSectionLink className="button button-ghost-light" targetId="suitability">Check suitability <b aria-hidden="true">↓</b></HashlessSectionLink>
          </div>
          <div className="breadcrumbs hi"><Link href="/">Home</Link><span>/</span><span>EECP Therapy</span></div>
        </div>
        <div className="eecp-hero-art art-xl">
          <EecpPulseArt />
          <div className="eecp-hero-card">
            <span className="pulse-icon" aria-hidden="true" />
            <span><strong>Timed to each heartbeat</strong><small>ECG guides the cuff sequence</small></span>
            <span className="bpm-chip"><b>ECG</b> timing</span>
          </div>
        </div>
      </div>
    </section>
  );
}
