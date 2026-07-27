"use client";

import { useEffect, useRef } from "react";
import { createTimeline, stagger } from "animejs";
import { prefersReducedMotion } from "../../lib/motion/reduced-motion";

/**
 * Animates the `.atlas-plate` elements belonging to *this* hero instance from
 * an offset, settled state into their final, CSS-defined position.
 *
 * `.atlas-plate` in hero.css declares `transform: skewY(5deg) translate(...)`.
 * anime.js writes any transform-component tween (translateX, translateY,
 * scale, etc.) into the element's *inline* `transform` style, which would
 * entirely replace that declaration and leave the plates permanently flat
 * once the entrance finishes (the inline value is only cleared by
 * `.revert()`, which only runs on unmount). To avoid fighting CSS over the
 * `transform` property, this animates the `--plate-x` / `--plate-y` custom
 * properties instead -- confirmed against anime.js v4.5.0's own source
 * (dist/bundles/anime.esm.js: `getTweenType` special-cases `--`-prefixed
 * props as `tweenTypes.CSS_VAR` and renders them via `style.setProperty`,
 * a path that never touches `style.transform`). CSS composes the resting
 * `skewY(5deg) translate(var(--plate-x, 0), var(--plate-y, 0))` from those
 * custom properties, so the skew is always part of what's rendered.
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
      "--plate-y": ["56px", "0px"],
      "--plate-x": ["-18px", "0px"],
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
