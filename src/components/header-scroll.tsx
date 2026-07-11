"use client";

import { useEffect } from "react";

const SCROLL_THRESHOLD = 24;

export function HeaderScroll() {
  useEffect(() => {
    let ticking = false;

    const applyState = () => {
      ticking = false;
      if (window.scrollY > SCROLL_THRESHOLD) {
        document.body.setAttribute("data-scrolled", "");
      } else {
        document.body.removeAttribute("data-scrolled");
      }
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(applyState);
    };

    applyState();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.body.removeAttribute("data-scrolled");
    };
  }, []);

  return null;
}
