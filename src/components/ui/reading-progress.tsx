"use client";

import { useEffect, useState } from "react";

/** Compact reading-progress treatment based on 21st.dev scroll-progress patterns. */
export function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const range = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(range > 0 ? Math.min(100, Math.max(0, (window.scrollY / range) * 100)) : 0);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => { window.removeEventListener("scroll", update); window.removeEventListener("resize", update); };
  }, []);

  return <div className="reading-progress" aria-hidden="true"><i style={{ transform: `scaleX(${progress / 100})` }} /></div>;
}
