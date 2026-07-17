"use client";

import type { Theme } from "@/lib/useTheme";

type Props = { theme: Theme; setTheme: (t: Theme) => void };

export function ThemeToggle({ theme, setTheme }: Props) {
  const dark = theme === "dark";
  return (
    <button
      className="theme-toggle"
      aria-label={dark ? "Switch to paper mode" : "Switch to interface mode"}
      onClick={() => setTheme(dark ? "light" : "dark")}
    >
      <span className={dark ? "" : "on"}>Paper {dark ? "○" : "●"}</span>
      <span className="sep">/</span>
      <span className={dark ? "on" : ""}>Interface {dark ? "●" : "○"}</span>
    </button>
  );
}
