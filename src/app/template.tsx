"use client";

import { useEffect, useRef, type ReactNode } from "react";

export default function Template({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current?.classList.add("page-enter-done");
  }, []);
  return (
    <div ref={ref} className="page-enter">
      {children}
    </div>
  );
}
