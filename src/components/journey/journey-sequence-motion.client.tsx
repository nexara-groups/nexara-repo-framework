"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { prefersReducedMotion } from "../../lib/motion/reduced-motion";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function JourneySequenceMotion() {
  const markerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const section = markerRef.current?.closest<HTMLElement>(".journey-route");
      if (!section) return;

      const cards = Array.from(section.querySelectorAll<HTMLElement>("[data-route-card]"));
      const bridges = Array.from(section.querySelectorAll<HTMLElement>("[data-route-bridge]"));
      if (!cards.length) return;

      cards.forEach((card, index) => {
        const art = card.querySelector<SVGSVGElement>("[data-route-art]");
        const direction = index % 2 === 0 ? -1 : 1;

        gsap.fromTo(
          card,
          {
            x: direction * 74,
            y: 44,
            scale: 0.965,
            opacity: 0.28,
          },
          {
            x: 0,
            y: 0,
            scale: 1,
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              start: "top 88%",
              end: "top 48%",
              scrub: 0.8,
            },
          },
        );

        if (art) {
          const artLines = Array.from(art.querySelectorAll<SVGPathElement>("[data-art-line]"));
          const artNodes = Array.from(art.querySelectorAll<SVGElement>("[data-art-node]"));
          const artPanels = Array.from(art.querySelectorAll<SVGGElement>("[data-art-panel]"));
          const artOrbits = Array.from(art.querySelectorAll<SVGGElement>("[data-art-orbit]"));
          const artFloat = Array.from(art.querySelectorAll<SVGElement>("[data-art-float]"));
          const artScan = art.querySelector<SVGElement>("[data-art-scan]");

          gsap.set(artLines, { strokeDasharray: 1, strokeDashoffset: 1 });
          gsap.set(artNodes, {
            transformOrigin: "center",
            scale: 0.35,
            opacity: 0.18,
          });
          gsap.set(artPanels, { y: 18, opacity: 0.24, scale: 0.965 });

          const artTimeline = gsap.timeline({
            scrollTrigger: {
              trigger: card,
              start: "top 86%",
              end: "top 38%",
              scrub: 0.85,
            },
          });

          artTimeline
            .to(artLines, {
              strokeDashoffset: 0,
              stagger: 0.025,
              ease: "none",
            }, 0)
            .to(artPanels, {
              y: 0,
              opacity: 1,
              scale: 1,
              stagger: 0.035,
              ease: "power2.out",
            }, 0.06)
            .to(artNodes, {
              scale: 1,
              opacity: 1,
              stagger: 0.04,
              ease: "back.out(1.8)",
            }, 0.16);

          if (artScan) {
            artTimeline.fromTo(
              artScan,
              { yPercent: -720, opacity: 0 },
              { yPercent: 720, opacity: 0.84, ease: "none" },
              0,
            );
          }

          if (artOrbits.length) {
            artTimeline.fromTo(
              artOrbits,
              { rotation: -18 },
              { rotation: 14, ease: "none" },
              0,
            );
          }

          if (artFloat.length) {
            artTimeline.fromTo(
              artFloat,
              { x: direction * 18, y: -8 },
              { x: direction * -18, y: 8, ease: "none" },
              0,
            );
          }

          gsap.fromTo(
            art,
            { scale: 0.94, yPercent: -3 },
            {
              scale: 1.015,
              yPercent: 3,
              ease: "none",
              scrollTrigger: {
                trigger: card,
                start: "top bottom",
                end: "bottom top",
                scrub: 1,
              },
            },
          );
        }

        ScrollTrigger.create({
          trigger: card,
          start: "top 54%",
          end: "bottom 46%",
          onToggle: ({ isActive }) => {
            if (isActive) {
              cards.forEach((item, itemIndex) => {
                item.dataset.active = String(itemIndex === index);
                if (itemIndex === index) {
                  item.setAttribute("aria-current", "step");
                } else {
                  item.removeAttribute("aria-current");
                }
              });
            } else {
              card.dataset.active = "false";
              card.removeAttribute("aria-current");
            }
          },
        });
      });

      bridges.forEach((bridge) => {
        const path = bridge.querySelector<SVGPathElement>("[data-route-path]");
        const nodes = Array.from(bridge.querySelectorAll<SVGCircleElement>("[data-route-node]"));
        const mobileLine = bridge.querySelector<HTMLElement>("[data-route-mobile-line]");
        if (!path) return;

        gsap.set(path, { strokeDasharray: 1, strokeDashoffset: 1 });
        gsap.set(nodes, { transformOrigin: "center", scale: 0.45, opacity: 0.32 });
        if (mobileLine) gsap.set(mobileLine, { scaleY: 0, transformOrigin: "top center" });

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: bridge,
            start: "top 82%",
            end: "bottom 48%",
            scrub: 0.9,
          },
        });

        timeline
          .to(path, { strokeDashoffset: 0, ease: "none" }, 0)
          .to(mobileLine, { scaleY: 1, ease: "none" }, 0)
          .to(nodes, {
            scale: 1,
            opacity: 1,
            stagger: 0.28,
            ease: "power2.out",
          }, 0.12);
      });

      return () => {
        cards.forEach((card) => {
          card.removeAttribute("aria-current");
          card.removeAttribute("data-active");
        });
      };
    },
    { scope: markerRef },
  );

  return <div ref={markerRef} hidden />;
}
