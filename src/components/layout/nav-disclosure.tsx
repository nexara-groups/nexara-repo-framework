"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { nav } from "../../content/site";

export function NavDisclosure() {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
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
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
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
      <div id={panelId} className="nav-disclosure__panel" data-open={open || undefined} hidden={!open}>
        <button
          type="button"
          ref={closeRef}
          className="mono nav-disclosure__close"
          onClick={() => setOpen(false)}
        >
          Close
        </button>
        <nav aria-label="Primary">
          <ul className="stack">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} onClick={() => setOpen(false)}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
