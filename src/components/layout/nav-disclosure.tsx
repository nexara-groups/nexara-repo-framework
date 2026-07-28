"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { authLink, nav } from "../../content/site";
import { ThemeToggle } from "./theme-toggle.client";

export function NavDisclosure() {
  const [open, setOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<number | null>(0);
  const panelId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const wasOpenRef = useRef(false);

  useEffect(() => {
    // Focus Close button when panel opens
    if (open) {
      closeRef.current?.focus();
      wasOpenRef.current = true;
    } else if (wasOpenRef.current) {
      // Restore focus to toggle when panel closes (but only if it was actually open)
      toggleRef.current?.focus();
      wasOpenRef.current = false;
    }

    // Handle Escape key
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        return;
      }
      if (event.key !== "Tab") return;

      const focusable = Array.from(
        panelRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled])',
        ) ?? [],
      ).filter((element) => element.offsetParent !== null);
      const first = focusable[0];
      const last = focusable.at(-1);
      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="nav-disclosure">
      <button
        ref={toggleRef}
        type="button"
        className="mono nav-disclosure__toggle"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
      >
        Menu
      </button>
      <div
        ref={panelRef}
        id={panelId}
        className="nav-disclosure__panel"
        data-open={open || undefined}
        role="dialog"
        aria-label="Site navigation"
        aria-modal="true"
        hidden={!open}
      >
        <div className="nav-disclosure__panel-actions">
          <ThemeToggle />
          <button
            type="button"
            ref={closeRef}
            className="mono nav-disclosure__close"
            onClick={() => setOpen(false)}
          >
            Close
          </button>
        </div>
        <nav aria-label="Primary">
          {nav.map((group, index) => {
            const items = group.columns?.flatMap((column) => column.items) ?? [];
            const groupPanelId = `${panelId}-group-${index}`;
            return (
              <section key={group.label} className="nav-disclosure__group">
                <div className="nav-disclosure__group-row">
                  {group.href ? (
                    <Link
                      className="nav-disclosure__group-title"
                      href={group.href}
                      onClick={() => setOpen(false)}
                    >
                      {group.label}
                    </Link>
                  ) : (
                    <p className="nav-disclosure__group-title">{group.label}</p>
                  )}
                  {items.length > 0 && (
                    <button
                      type="button"
                      className="nav-disclosure__group-toggle"
                      aria-expanded={openGroup === index}
                      aria-controls={groupPanelId}
                      aria-label={`${openGroup === index ? "Hide" : "Show"} ${group.label} links`}
                      onClick={() =>
                        setOpenGroup((current) => (current === index ? null : index))
                      }
                    >
                      <span aria-hidden="true" />
                    </button>
                  )}
                </div>
                {items.length > 0 && (
                  <div id={groupPanelId} hidden={openGroup !== index}>
                    <ul className="nav-disclosure__links">
                      {items.map((link) => (
                        <li key={link.href}>
                          <Link href={link.href} onClick={() => setOpen(false)}>
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </section>
            );
          })}
          <Link
            className="nav-disclosure__login"
            href={authLink.href}
            onClick={() => setOpen(false)}
          >
            {authLink.label}
          </Link>
        </nav>
      </div>
    </div>
  );
}
