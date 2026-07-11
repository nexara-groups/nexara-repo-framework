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
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.08 },
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
      {children}
    </div>
  );
}
