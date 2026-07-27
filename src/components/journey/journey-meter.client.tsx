"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { prefersReducedMotion } from "../../lib/motion/reduced-motion";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Drives the Student Journey progress meter: toggles `data-active` on
 * whichever step currently owns the centre of the viewport and advances the
 * sticky counter to match.
 *
 * Renders a hidden marker rather than `null` so the effect can resolve its
 * own section via `.closest(".journey")` and scope every query to it -- the
 * same pattern `src/components/atlas/atlas-scrub.client.tsx` uses. Reaching
 * for `document.querySelector(...)` instead would (a) find whatever
 * `.journey` happens first in the document rather than necessarily this
 * instance's, and (b) do nothing at all if the marker were the only element
 * `useGSAP`'s scope pointed at, since the marker itself carries none of the
 * step/counter markup.
 *
 * Returns without creating any ScrollTrigger, never throws, whenever motion
 * is not wanted (`prefersReducedMotion()`) or the expected structure isn't
 * found -- every step is already fully readable from server-rendered markup,
 * so there is nothing this effect *must* do to keep the content usable.
 *
 * The meter itself is decorative (each step already carries its own visible
 * number in reading order), so `student-trail.tsx` marks it
 * `aria-hidden="true"`. Deliberately no `aria-live` here either -- Task 6 had
 * to remove exactly that from the Atlas counter because it spammed screen
 * readers on every scroll toggle, and this counter is announced from nothing
 * (aria-hidden) so it would be pointless besides.
 */
export function JourneyMeter() {
  const markerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      const section = markerRef.current?.closest(".journey");
      if (!section) return;

      const steps = Array.from(
        section.querySelectorAll<HTMLElement>("[data-journey-step]"),
      );
      const counter = section.querySelector<HTMLElement>("[data-journey-counter]");
      if (steps.length === 0 || !counter) return;

      steps.forEach((step, index) => {
        ScrollTrigger.create({
          trigger: step,
          start: "top center",
          end: "bottom center",
          onToggle: ({ isActive }) => {
            step.dataset.active = isActive ? "true" : "false";
            if (isActive) counter.textContent = String(index + 1).padStart(2, "0");
          },
        });
      });
    },
    { scope: markerRef },
  );

  return <div ref={markerRef} hidden />;
}
