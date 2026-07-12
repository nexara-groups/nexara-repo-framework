"use client";

import type { CSSProperties, PointerEvent, ReactNode } from "react";

type SpotlightStyle = CSSProperties & { "--spot-x"?: string; "--spot-y"?: string };

/**
 * Adapted to Rise's token system from the 21st.dev Spotlight Card interaction.
 * Source pattern: https://21st.dev/community/components/berkcangumusisik/spotlight-card/default
 */
export function SpotlightCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  function moveSpotlight(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "touch") return;
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
    event.currentTarget.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
  }

  return <div className={`resource-spotlight ${className}`} onPointerMove={moveSpotlight} style={{ "--spot-x": "50%", "--spot-y": "50%" } as SpotlightStyle}>{children}</div>;
}
