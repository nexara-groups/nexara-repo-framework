"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { nav } from "../../content/site";
import { prefersReducedMotion } from "../../lib/motion/reduced-motion";

gsap.registerPlugin(useGSAP);

/**
 * Desktop primary navigation as an animated mega-menu. Panels live in the DOM at
 * all times (SSR-visible, crawlable) and are revealed via GSAP: the panel eases
 * in, its column headings, items, and feature card stagger, and a highlight
 * glides under whichever item the pointer or keyboard is on. Hover uses a short
 * close delay so travelling from trigger to panel never flickers it shut.
 */
export function PrimaryNav() {
  const rootRef = useRef<HTMLElement>(null);
  const menuId = useId();
  const [open, setOpen] = useState<number | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const focusOnOpen = useRef<number | null>(null);

  const clearClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };
  const scheduleClose = () => {
    clearClose();
    closeTimer.current = setTimeout(() => setOpen(null), 140);
  };

  const moveGlow = (event: { currentTarget: HTMLElement }) => {
    const item = event.currentTarget;
    const body = item.closest<HTMLElement>(".mega__body");
    const glow = body?.querySelector<HTMLElement>(".mega__glow");
    if (!body || !glow) return;
    const b = body.getBoundingClientRect();
    const r = item.getBoundingClientRect();
    gsap.to(glow, {
      x: r.left - b.left,
      y: r.top - b.top,
      width: r.width,
      height: r.height,
      autoAlpha: 1,
      duration: prefersReducedMotion() ? 0 : 0.28,
      ease: "power3.out",
      overwrite: true,
    });
  };

  const hideGlow = (panel: HTMLElement) => {
    const glow = panel.querySelector<HTMLElement>(".mega__glow");
    if (glow) gsap.to(glow, { autoAlpha: 0, duration: 0.2, overwrite: true });
  };

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;
      const reduce = prefersReducedMotion();
      gsap.utils.toArray<HTMLElement>(".mega", root).forEach((panel) => {
        const isOpen = Number(panel.dataset.index) === open;
        gsap.killTweensOf(panel);
        if (reduce) {
          gsap.set(panel, { autoAlpha: isOpen ? 1 : 0, y: 0 });
          return;
        }
        if (isOpen) {
          gsap.to(panel, { autoAlpha: 1, y: 0, duration: 0.28, ease: "power3.out" });
          gsap.fromTo(
            panel.querySelectorAll(".mega__heading, .mega__item, .mega__feature"),
            { autoAlpha: 0, y: 10 },
            { autoAlpha: 1, y: 0, duration: 0.3, ease: "power2.out", stagger: 0.028, delay: 0.04 },
          );
        } else {
          gsap.to(panel, { autoAlpha: 0, y: 12, duration: 0.16, ease: "power2.in" });
        }
      });
    },
    { dependencies: [open], scope: rootRef },
  );

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || open === null) return;
      const trigger = rootRef.current?.querySelector<HTMLButtonElement>(
        `[data-menu-trigger="${open}"]`,
      );
      setOpen(null);
      trigger?.focus();
    };
    const onPointerDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointerDown);
      clearClose();
    };
  }, [open]);

  useEffect(() => {
    if (open === null || focusOnOpen.current !== open) return;
    const focusTimer = window.setTimeout(() => {
      rootRef.current
        ?.querySelector<HTMLElement>(`[data-index="${open}"] a`)
        ?.focus();
      focusOnOpen.current = null;
    }, prefersReducedMotion() ? 0 : 50);
    return () => window.clearTimeout(focusTimer);
  }, [open]);

  return (
    <nav
      ref={rootRef}
      className="site-header__nav"
      aria-label="Primary"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          clearClose();
          setOpen(null);
        }
      }}
    >
      <ul className="cluster">
        {nav.map((group, i) =>
          group.columns ? (
            <li
              key={group.label}
              className="site-header__item site-header__item--menu"
              onMouseEnter={() => {
                clearClose();
                setOpen(i);
              }}
              onMouseLeave={scheduleClose}
            >
              <button
                type="button"
                className="site-header__trigger"
                id={`${menuId}-trigger-${i}`}
                data-menu-trigger={i}
                aria-haspopup="menu"
                aria-controls={`${menuId}-menu-${i}`}
                aria-expanded={open === i}
                data-open={open === i || undefined}
                onClick={() => {
                  clearClose();
                  setOpen((current) => (current === i ? null : i));
                }}
                onKeyDown={(event) => {
                  if (event.key !== "ArrowDown") return;
                  event.preventDefault();
                  clearClose();
                  focusOnOpen.current = i;
                  setOpen(i);
                }}
              >
                {group.label}
                <span className="site-header__caret" aria-hidden="true" />
              </button>

              <div
                id={`${menuId}-menu-${i}`}
                className="mega"
                data-index={i}
                data-cols={group.columns.length}
                data-open={open === i || undefined}
                aria-labelledby={`${menuId}-trigger-${i}`}
                aria-hidden={open !== i}
                onMouseEnter={clearClose}
                onMouseLeave={(e) => {
                  scheduleClose();
                  hideGlow(e.currentTarget);
                }}
              >
                <div className="mega__body">
                  <span className="mega__glow" aria-hidden="true" />
                  <div className="mega__cols">
                    {group.columns.map((col) => (
                      <div key={col.heading} className="mega__col">
                        <p className="mega__heading">{col.heading}</p>
                        <ul>
                          {col.items.map((item) => (
                            <li key={item.href}>
                              <Link
                                className="mega__item"
                                href={item.href}
                                onMouseEnter={moveGlow}
                                onFocus={moveGlow}
                                onClick={() => setOpen(null)}
                              >
                                <span className="mega__item-label">{item.label}</span>
                                {item.note && <span className="mega__item-note">{item.note}</span>}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>

                  {group.feature && (
                    <Link className="mega__feature" href={group.feature.href} onClick={() => setOpen(null)}>
                      <p className="mega__feature-title">{group.feature.title}</p>
                      <p className="mega__feature-body">{group.feature.body}</p>
                      <span className="mega__feature-cta">{group.feature.cta} →</span>
                    </Link>
                  )}
                </div>
              </div>
            </li>
          ) : (
            <li key={group.label} className="site-header__item">
              <Link className="site-header__link" href={group.href ?? "/"}>
                {group.label}
              </Link>
            </li>
          ),
        )}
      </ul>
    </nav>
  );
}
