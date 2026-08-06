"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { chapters } from "@/content/heart-guide";

// Chapters whose section sits on a dark (ink) background — the fixed rail
// swaps to light text while one of these is active so it stays readable.
const DARK_CHAPTERS = new Set(["warning-signs"]);

export function ChapterRail() {
  const [active, setActive] = useState<string | null>(null);
  const [journeyFinished, setJourneyFinished] = useState(false);
  const [railProgress, setRailProgress] = useState(0);
  const pillsRef = useRef<HTMLElement>(null);

  const updateRailProgress = useCallback(() => {
    const rail = pillsRef.current;
    if (!rail) return;
    const max = rail.scrollWidth - rail.clientWidth;
    setRailProgress(max > 0 ? rail.scrollLeft / max : 1);
  }, []);

  useEffect(() => {
    const targets = [
      ...chapters.map((c) => document.getElementById(c.id)),
      document.querySelector<HTMLElement>(".hc-hero"),
      document.querySelector<HTMLElement>(".hc-closer"),
      document.querySelector<HTMLElement>(".hc-faq"),
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
          if (el.classList.contains("hc-closer") || el.classList.contains("hc-faq")) {
            setJourneyFinished(true);
            setActive(null);
          } else if (el.classList.contains("hc-hero")) {
            setJourneyFinished(false);
            setActive(null);
          } else {
            setJourneyFinished(false);
            setActive(el.id || null);
          }
        }
      },
      { rootMargin: "-42% 0px -52% 0px" },
    );
    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const rail = pillsRef.current;
    if (!rail) return;
    updateRailProgress();
    const resize = new ResizeObserver(updateRailProgress);
    resize.observe(rail);
    return () => resize.disconnect();
  }, [updateRailProgress]);

  useEffect(() => {
    if (!active) return;
    const rail = pillsRef.current;
    const activeLink = rail?.querySelector<HTMLAnchorElement>(`a[href="#${active}"]`);
    if (!activeLink) return;
    activeLink.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    const timer = window.setTimeout(updateRailProgress, 420);
    return () => window.clearTimeout(timer);
  }, [active, updateRailProgress]);

  const moveRail = (direction: -1 | 1) => {
    const rail = pillsRef.current;
    if (!rail) return;
    rail.scrollBy({ left: direction * rail.clientWidth * 0.68, behavior: "smooth" });
  };

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
      <div className={`rail-pills-shell${journeyFinished ? " rail-finished" : ""}`}>
        <nav ref={pillsRef} className="rail-pills" aria-label="Guide chapters" onScroll={updateRailProgress}>
          {chapters.map((c) => (
            <a key={c.id} href={`#${c.id}`} className={active === c.id ? "rail-on" : undefined}>
              {c.num} · {c.title}
            </a>
          ))}
        </nav>
        <div className="rail-pills-progress">
          <span>Chapter progress</span>
          <i aria-hidden="true"><b style={{ transform: `scaleX(${Math.max(.08, railProgress)})` }} /></i>
          <button type="button" onClick={() => moveRail(-1)} aria-label="Show previous chapters">←</button>
          <button type="button" onClick={() => moveRail(1)} aria-label="Show next chapters">→</button>
        </div>
      </div>
    </>
  );
}
