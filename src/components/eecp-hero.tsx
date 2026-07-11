"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HeroEcg, EecpPulseArt } from "@/components/brand-art";

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
          .from(".h-line-inner", { yPercent: 115, duration: 1.1, stagger: 0.14, ease: "power4.out" }, 0.1)
          .from(".hi", { autoAlpha: 0, y: 36, duration: 0.9, stagger: 0.09 }, 0.35)
          .from(".eecp-hero-chips span", { autoAlpha: 0, y: 14, duration: 0.5, stagger: 0.07 }, "-=0.55")
          .from(".eecp-hero-art svg", { autoAlpha: 0, scale: 0.9, x: 60, transformOrigin: "center center", duration: 1.2, ease: "power2.out" }, 0.3)
          .from(".eecp-hero-card", { autoAlpha: 0, y: 18, duration: 0.6 }, "-=0.45")
          .from(".eecp-hero-ecg", { autoAlpha: 0, duration: 0.8 }, 0.5);

        // The artwork never sits still — slow breathing float
        gsap.to(".art-float", { y: 13, duration: 3.2, ease: "sine.inOut", repeat: -1, yoyo: true, delay: 1.6 });

        // Live BPM readout on the card
        const bpm = ref.current?.querySelector(".bpm-num");
        const bpmTick = bpm
          ? window.setInterval(() => {
              bpm.textContent = String(67 + Math.round(Math.random() * 9));
              gsap.fromTo(bpm, { scale: 1.3 }, { scale: 1, duration: 0.4, transformOrigin: "center center", display: "inline-block" });
            }, 1600)
          : undefined;

        const ring = ref.current?.querySelector<SVGGeometryElement>(".eecp-hero-art .hero-ring");
        if (ring) {
          const len = ring.getTotalLength();
          gsap.set(ring, { strokeDasharray: len, strokeDashoffset: len });
          intro.to(ring, { strokeDashoffset: 0, duration: 1.3, ease: "power2.inOut" }, 0.45);
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
            if (bpmTick) window.clearInterval(bpmTick);
            ref.current?.removeEventListener("pointermove", move);
            ref.current?.removeEventListener("pointerleave", leave);
          };
        }
        return () => { if (bpmTick) window.clearInterval(bpmTick); };
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
            <span className="h-line"><span className="h-line-inner">When medicines aren&rsquo;t enough,</span></span>
            <span className="h-line"><span className="h-line-inner"><em>and surgery isn&rsquo;t the answer.</em></span></span>
          </h1>
          <p className="hi">There is a third option. Enhanced External Counterpulsation helps blood reach your heart using nothing but carefully timed pressure — one quiet hour a day. No theatre, no stitches, no recovery bed.</p>
          <div className="eecp-hero-chips"><span>FDA-cleared class</span><span>Non-surgical · no anaesthesia</span><span>35 sessions · 7 weeks</span></div>
          <div className="hero-actions hi">
            <Link className="button button-coral" href="/appointment">Book an EECP consultation <b aria-hidden="true">↗</b></Link>
            <a className="button button-ghost-light" href="#how-it-works">See how it works <b aria-hidden="true">↓</b></a>
          </div>
          <div className="breadcrumbs hi"><Link href="/">Home</Link><span>/</span><span>EECP Therapy</span></div>
        </div>
        <div className="eecp-hero-art art-xl">
          <EecpPulseArt />
          <div className="eecp-hero-card">
            <span className="pulse-icon" aria-hidden="true" />
            <span><strong>Timed to every beat</strong><small>ECG-guided, all 60 minutes</small></span>
            <span className="bpm-chip"><b className="bpm-num">72</b> bpm</span>
          </div>
        </div>
      </div>
    </section>
  );
}
