"use client";

import dynamic from "next/dynamic";

const JourneySequenceMotion = dynamic(
  () =>
    import("./journey-sequence-motion.client").then((module) => module.JourneySequenceMotion),
  { ssr: false },
);

export function JourneySequenceMotionLoader() {
  return <JourneySequenceMotion />;
}
