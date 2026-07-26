import type { ReactNode } from "react";
import type { AtlasLayerId } from "../../content/atlas-layers";

const PATHS: Record<AtlasLayerId, ReactNode> = {
  guidance: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M15.5 8.5 10.8 10.8 8.5 15.5l4.7-2.3z" />
    </>
  ),
  curriculum: (
    <path d="M3 5.5h6.5A2.5 2.5 0 0 1 12 8v11a2 2 0 0 0-2-2H3zM21 5.5h-6.5A2.5 2.5 0 0 0 12 8v11a2 2 0 0 1 2-2h7z" />
  ),
  practice: <path d="m8.5 8-4 4 4 4M15.5 8l4 4-4 4" />,
  feedback: (
    <path d="M20 5H4a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h3v3.2L11 16h9a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1z" />
  ),
  placement: (
    <>
      <rect x="3" y="7.5" width="18" height="12" rx="1.6" />
      <path d="M9 7.5V6a1.6 1.6 0 0 1 1.6-1.6h2.8A1.6 1.6 0 0 1 15 6v1.5" />
    </>
  ),
};

export function LayerIcon({ id }: { readonly id: AtlasLayerId }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" className="layer-icon">
      {PATHS[id]}
    </svg>
  );
}
