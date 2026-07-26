"use client";

import { useEffect, useRef } from "react";
import { createTimeline, stagger } from "animejs";
import { prefersReducedMotion } from "../../lib/motion/reduced-motion";

/**
 * Animates the `.atlas-plate` elements belonging to *this* hero instance from
 * an offset, settled state into their final, CSS-defined position.
 *
 * Renders a hidden marker rather than `null` so the effect can resolve its
 * own hero via `.closest(".hero")` and scope the plate query to it — this
 * avoids reaching across the whole document and animating plates that
 * belong to some other hero instance on the page.
 */
export function HeroAssembly() {
  const markerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const hero = markerRef.current?.closest(".hero");
    if (!hero) return;

    const plates = hero.querySelectorAll<HTMLElement>(".atlas-plate");
    if (plates.length === 0) return;

    const timeline = createTimeline({ defaults: { ease: "outExpo" } });

    timeline.add(plates, {
      opacity: [0, 1],
      translateY: [56, 0],
      translateX: [-18, 0],
      duration: 900,
      delay: stagger(110, { start: 240 }),
    });

    return () => {
      timeline.pause();
      timeline.revert();
    };
  }, []);

  return <div ref={markerRef} hidden />;
}
