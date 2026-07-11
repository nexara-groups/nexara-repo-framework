"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const words: Array<[string, boolean?]> = [
  ["Good"], ["medicine"], ["listens", true], ["first,"], ["explains", true], ["clearly,"],
  ["and"], ["never"], ["rushes", true], ["a"], ["decision."],
  ["That"], ["is"], ["the"], ["pace"], ["we"], ["keep"], ["—"],
  ["for"], ["every"], ["visit,"], ["every"], ["test,"], ["every"], ["heart.", true],
];

export function HomeManifesto() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ".hm-word",
          { opacity: 0.14 },
          {
            opacity: 1,
            stagger: 0.5,
            ease: "none",
            scrollTrigger: { trigger: ref.current, start: "top 72%", end: "bottom 62%", scrub: true },
          },
        );
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section className="hm-manifesto" ref={ref}>
      <div className="container">
        <span className="eyebrow">How we practice</span>
        <p className="hm-manifesto-text">
          {words.map(([word, em], i) => (
            <span key={i} className={`hm-word${em ? " hm-word-em" : ""}`}>{word}{" "}</span>
          ))}
        </p>
      </div>
    </section>
  );
}
