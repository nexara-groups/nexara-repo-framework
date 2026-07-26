/**
 * Reads the user's motion preference. Returns `true` during SSR so that any
 * caller defaults to the still, final state rather than an animated one.
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return true;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
