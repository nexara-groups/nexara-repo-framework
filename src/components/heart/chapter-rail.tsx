"use client";

import { useEffect, useState } from "react";
import { chapters } from "@/content/heart-guide";

// Chapters whose section sits on a dark (ink) background — the fixed rail
// swaps to light text while one of these is active so it stays readable.
const DARK_CHAPTERS = new Set(["warning-signs"]);

export function ChapterRail() {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const targets = [
      ...chapters.map((c) => document.getElementById(c.id)),
      document.querySelector<HTMLElement>(".hc-hero"),
    ].filter((el): el is HTMLElement => Boolean(el));
    if (!targets.length) return;

    // A thin observation band just above the viewport's midline: whichever
    // section crosses it is the active chapter. The hero clears the state so
    // the rail fades out at the top of the page.
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          setActive(el.id || null);
        }
      },
      { rootMargin: "-42% 0px -52% 0px" },
    );
    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const tone = active && DARK_CHAPTERS.has(active) ? "dark" : "light";

  return (
    <>
      <nav
        className={`chapter-rail${active ? " rail-live" : ""}`}
        data-tone={tone}
        aria-label="Guide chapters"
      >
        {chapters.map((c) => (
          <a key={c.id} href={`#${c.id}`} className={active === c.id ? "rail-on" : undefined}>
            <i aria-hidden="true" />
            <b>{c.num}</b>
            <span>{c.title}</span>
          </a>
        ))}
      </nav>
      <nav className="rail-pills" aria-label="Guide chapters">
        {chapters.map((c) => (
          <a key={c.id} href={`#${c.id}`} className={active === c.id ? "rail-on" : undefined}>
            {c.num} · {c.title}
          </a>
        ))}
      </nav>
    </>
  );
}
