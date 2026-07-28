"use client";

import { useEffect, useState } from "react";

type Theme = "dark" | "light";

const STORAGE_KEY = "yojo-theme";
const THEME_EVENT = "yojo-theme-change";

function readTheme(): Theme {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.dataset.theme = theme;
  root.style.colorScheme = theme;
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // The theme still applies for this visit when storage is unavailable.
  }

  const themeMeta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  themeMeta?.setAttribute("content", theme === "light" ? "#f4f8f9" : "#070a0d");

  window.dispatchEvent(new CustomEvent<Theme>(THEME_EVENT, { detail: theme }));
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    setTheme(readTheme());

    const syncTheme = (event: Event) => {
      const nextTheme = (event as CustomEvent<Theme>).detail;
      if (nextTheme === "dark" || nextTheme === "light") {
        setTheme(nextTheme);
      }
    };

    window.addEventListener(THEME_EVENT, syncTheme);
    return () => window.removeEventListener(THEME_EVENT, syncTheme);
  }, []);

  const nextTheme = theme === "dark" ? "light" : "dark";
  const label = `Switch to ${nextTheme} theme`;

  return (
    <button
      type="button"
      className="theme-toggle"
      aria-label={label}
      aria-pressed={theme === "light"}
      title={label}
      onClick={() => applyTheme(readTheme() === "dark" ? "light" : "dark")}
    >
      <span className="theme-toggle__track" aria-hidden="true">
        <svg className="theme-toggle__icon theme-toggle__icon--sun" viewBox="0 0 20 20">
          <circle cx="10" cy="10" r="3.25" />
          <path d="M10 1.75V4M10 16V18.25M1.75 10H4M16 10H18.25M4.17 4.17L5.76 5.76M14.24 14.24L15.83 15.83M15.83 4.17L14.24 5.76M5.76 14.24L4.17 15.83" />
        </svg>
        <svg className="theme-toggle__icon theme-toggle__icon--moon" viewBox="0 0 20 20">
          <path d="M16.2 12.8A7.25 7.25 0 0 1 7.2 3.8A7.25 7.25 0 1 0 16.2 12.8Z" />
        </svg>
        <span className="theme-toggle__thumb" />
      </span>
    </button>
  );
}
