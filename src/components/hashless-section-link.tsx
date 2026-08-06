"use client";

import type { AnchorHTMLAttributes, MouseEvent } from "react";

type HashlessSectionLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  targetId: string;
};

export function HashlessSectionLink({ targetId, onClick, ...props }: HashlessSectionLinkProps) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (event.defaultPrevented) return;

    const target = document.getElementById(targetId);
    if (!target) return;

    event.preventDefault();
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });

    window.requestAnimationFrame(() => {
      window.history.replaceState(window.history.state, "", `${window.location.pathname}${window.location.search}`);
    });
  };

  return <a {...props} href={`#${targetId}`} onClick={handleClick} />;
}
