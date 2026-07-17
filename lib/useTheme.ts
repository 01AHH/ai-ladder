"use client";

import { useEffect, useState } from "react";

export type Theme = "dark" | "light";

const KEY = "ladder-theme";

function readTheme(): Theme {
  try {
    const stored = localStorage.getItem(KEY);
    if (stored === "dark" || stored === "light") return stored;
  } catch {}
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

/**
 * Theme state for the landing page. Initializes to "light" so the first
 * client render matches the prerendered (editorial) HTML — the real theme
 * resolves in a post-mount effect. The pre-paint inline script in layout.tsx
 * plus `html.theme-dark .editorial-root { visibility: hidden }` prevent any
 * paper-brand flash for dark visitors. The html-class sync is gated on
 * `resolved` so it never strips the class the inline script already set.
 */
export function useTheme() {
  const [theme, setThemeState] = useState<Theme>("light");
  const [resolved, setResolved] = useState(false);

  useEffect(() => {
    setThemeState(readTheme());
    setResolved(true);
  }, []);

  useEffect(() => {
    if (!resolved) return;
    document.documentElement.classList.toggle("theme-dark", theme === "dark");
  }, [theme, resolved]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      try {
        if (localStorage.getItem(KEY)) return;
      } catch {}
      setThemeState(mq.matches ? "dark" : "light");
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  function setTheme(t: Theme) {
    try {
      localStorage.setItem(KEY, t);
    } catch {}
    setThemeState(t);
  }

  return { theme, setTheme };
}
