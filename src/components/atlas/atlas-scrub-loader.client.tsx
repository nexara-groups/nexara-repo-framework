"use client";

import dynamic from "next/dynamic";

/**
 * `next/dynamic` with `ssr: false` is only permitted inside a Client
 * Component -- Next 15 rejects that combination at build time when it is
 * called from a Server Component ("`ssr: false` is not allowed with
 * `next/dynamic` in Server Components"). `atlas-sequence.tsx` stays a Server
 * Component so the chapters render without any script, and this file is the
 * one small client-only seam that performs the lazy, browser-only import of
 * the GSAP scrub -- keeping GSAP out of the server bundle and out of any
 * route that never renders `AtlasSequence`.
 */
const AtlasScrub = dynamic(() => import("./atlas-scrub.client").then((m) => m.AtlasScrub), {
  ssr: false,
});

export function AtlasScrubLoader() {
  return <AtlasScrub />;
}
