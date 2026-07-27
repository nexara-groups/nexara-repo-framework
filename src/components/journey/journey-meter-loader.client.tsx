"use client";

import dynamic from "next/dynamic";

/**
 * `next/dynamic` with `ssr: false` is only permitted inside a Client
 * Component -- Next 15 rejects that combination at build time when it is
 * called from a Server Component ("`ssr: false` is not allowed with
 * `next/dynamic` in Server Components"). `student-trail.tsx` stays a Server
 * Component so every step renders without any script, and this file is the
 * one small client-only seam that performs the lazy, browser-only import of
 * the GSAP meter -- keeping GSAP out of the server bundle and out of any
 * route that never renders `StudentTrail`. Mirrors
 * `src/components/atlas/atlas-scrub-loader.client.tsx`.
 */
const JourneyMeter = dynamic(() => import("./journey-meter.client").then((m) => m.JourneyMeter), {
  ssr: false,
});

export function JourneyMeterLoader() {
  return <JourneyMeter />;
}
