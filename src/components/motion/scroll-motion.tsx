"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "../../lib/motion/reduced-motion";

gsap.registerPlugin(ScrollTrigger);

export function ScrollMotion({ children }: { readonly children: React.ReactNode }) {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const root = wrapRef.current;
    if (!root) return;

    const context = gsap.context(() => {
      const hero = root.querySelector<HTMLElement>(".security-hero");
      const heroMedia = hero?.querySelector<HTMLElement>(".security-hero__media");
      const heroContent = hero?.querySelector<HTMLElement>(".security-hero__content");

      if (hero && heroMedia && heroContent) {
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: hero,
            start: "top top",
            end: "bottom top",
            scrub: 0.8,
          },
        });
        timeline.to(heroMedia, { scale: 1.07, yPercent: 4, ease: "none" }, 0);
        timeline.to(heroContent, { y: -54, opacity: 0.2, ease: "none" }, 0);
      }

      gsap.utils.toArray<HTMLElement>(".page-hero").forEach((pageHero) => {
        const media = pageHero.querySelector<HTMLElement>(".page-hero__media");
        if (!media) return;
        gsap.to(media, {
          scale: 1.06,
          ease: "none",
          scrollTrigger: {
            trigger: pageHero,
            start: "top top",
            end: "bottom top",
            scrub: 0.75,
          },
        });
      });

      gsap.utils.toArray<HTMLElement>(".domain-matrix__card, .programme-row").forEach((card) => {
        gsap.fromTo(
          card,
          { y: 28, opacity: 0.35 },
          {
            y: 0,
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              start: "top 92%",
              end: "top 68%",
              scrub: 0.35,
            },
          },
        );
      });
    }, root);

    return () => context.revert();
  }, []);

  return <div ref={wrapRef}>{children}</div>;
}
