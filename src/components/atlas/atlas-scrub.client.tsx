"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { prefersReducedMotion } from "../../lib/motion/reduced-motion";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Pinning only makes sense once the layout is two columns -- below this
 * width `.atlas__grid` collapses to a single stacked column (see the
 * matching `@media (max-width: 900px)` rule in
 * `src/styles/components/atlas.css`) and a pinned chamber would float over
 * the stacked chapter text instead of sitting beside it. This is the JS half
 * of that breakpoint; keep the two numbers in sync.
 */
const ATLAS_PIN_QUERY = "(min-width: 900px)";

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

      // gsap.matchMedia() creates the pinning ScrollTrigger only while
      // ATLAS_PIN_QUERY matches, and reverts it (un-pinning `.atlas__pin`,
      // clearing the inline styles ScrollTrigger applied) the instant it
      // stops matching -- including on live resize across the boundary, not
      // just on initial render. Because this runs inside useGSAP's own
      // context (we're already executing inside it here), the matchMedia
      // instance itself is torn down for free when the component unmounts.
      const mm = gsap.matchMedia();
      mm.add(ATLAS_PIN_QUERY, () => {
        ScrollTrigger.create({
          trigger: grid,
          start: "top top+=120",
          end: "bottom bottom",
          pin,
          pinSpacing: false,
        });
      });

      // The per-chapter active-state triggers are deliberately *not* gated
      // to the same breakpoint: they only ever move `.atlas__chapter`
      // opacity between 1 and 0.34 (see atlas.css), never lower, so chapter
      // text stays fully readable at every width whether or not the chamber
      // is pinned. Keeping them running below 900px also means the
      // decorative counter keeps tracking scroll position there instead of
      // freezing at "01 / 05" once the pin drops away.
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
