"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { prefersReducedMotion } from "../../lib/motion/reduced-motion";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Drives the Atlas chapter scrub: pins the visual chamber for the duration of
 * the chapter list and toggles `data-active` on whichever chapter currently
 * owns the centre of the viewport.
 *
 * Renders a hidden marker rather than `null` so the effect can resolve its
 * own section via `.closest(".atlas")` and scope every query to it -- the
 * same pattern `src/components/hero/hero-assembly.tsx` uses for its plates.
 * Reaching for `document.querySelector(...)` instead would (a) find whatever
 * `.atlas` happens first in the document rather than necessarily this
 * instance's, and (b) do nothing at all if the marker were the only element
 * `useGSAP`'s scope pointed at, since the marker itself carries none of the
 * chapter/counter/pin markup.
 *
 * Returns without creating any ScrollTrigger, never throws, whenever motion
 * is not wanted (`prefersReducedMotion()`) or the expected structure isn't
 * found -- the chapters and pin are already fully readable from server-
 * rendered markup, so there is nothing this effect *must* do to keep the
 * content usable.
 */
export function AtlasScrub() {
  const markerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      const section = markerRef.current?.closest(".atlas");
      if (!section) return;

      const chapters = Array.from(
        section.querySelectorAll<HTMLElement>("[data-atlas-chapter]"),
      );
      const counter = section.querySelector<HTMLElement>("[data-atlas-counter]");
      const pin = section.querySelector<HTMLElement>(".atlas__pin");
      const grid = section.querySelector<HTMLElement>(".atlas__grid");
      if (chapters.length === 0 || !counter || !pin || !grid) return;

      ScrollTrigger.create({
        trigger: grid,
        start: "top top+=120",
        end: "bottom bottom",
        pin,
        pinSpacing: false,
      });

      chapters.forEach((chapter, index) => {
        ScrollTrigger.create({
          trigger: chapter,
          start: "top center",
          end: "bottom center",
          onToggle: ({ isActive }) => {
            chapter.dataset.active = isActive ? "true" : "false";
            if (isActive) {
              counter.textContent = `${String(index + 1).padStart(2, "0")} / 05`;
            }
          },
        });
      });
    },
    { scope: markerRef },
  );

  return <div ref={markerRef} hidden />;
}
