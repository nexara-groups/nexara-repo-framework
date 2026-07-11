"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export function Reveal({
  children,
  className = "",
  delay = 0,
  variant = "rise",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  variant?: "rise" | "blur" | "mask";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    // The huge top margin extends the root upward, so anything at or above the
    // viewport counts as intersecting. Without it, a fast fling or anchor jump can
    // move an element from below the viewport to above it in a single frame — no
    // threshold crossing ever fires and the content stays hidden forever. The
    // -12% bottom margin keeps the entrance beat: reveal starts once the element
    // clears the bottom edge of the screen.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "10000px 0px -12% 0px", threshold: 0.08 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const variantClass = variant === "blur" ? "reveal-blur" : variant === "mask" ? "reveal-mask" : "";

  return (
    <div
      ref={ref}
      className={`reveal ${visible ? "is-visible" : ""} ${className} ${variantClass}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {/* The mask clip lives on an inner wrapper: a fully clipped element reports
          zero intersection area in Chromium, so clipping the observed node itself
          means the observer never fires and the content stays hidden. */}
      {variant === "mask" ? <div className="reveal-mask-inner">{children}</div> : children}
    </div>
  );
}
