# INTERFACE Dark Mode Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A full dark rebrand of the landing page — an INTERFACE-style kinetic grid one-pager (split-flap H1, rung grid with accordion panels, custom cursor) — behind a system-preference theme toggle, with the editorial page unchanged as light mode.

**Architecture:** `page.tsx` becomes a thin theme switch between `EditorialPage` (current JSX, extracted) and a new `components/interface/` tree. Shared logic (markdown rendering, generate demo, rung extras) is extracted from `Rung.tsx` so both presentations use one implementation. Dark styling overrides the existing palette tokens under `html.theme-dark` (in `app/interface.css`), so every reused component auto-darkens; a pre-hydration inline script sets the class flash-free.

**Tech Stack:** Next.js 15 client components, hand-rolled CSS/keyframes (no GSAP), Vitest + Testing Library.

**Spec:** `docs/superpowers/specs/2026-07-17-interface-dark-mode-design.md`

**Commit strategy (user override):** verify locally BEFORE committing. Run tests per task; single feature commit after Task 10's verification.

**Hydration strategy (important):** The page is statically prerendered as the light/editorial page. `useTheme` therefore initializes to `"light"` (matching the server HTML — no hydration mismatch) and resolves the real theme in a post-mount effect. The inline script in `layout.tsx` sets `html.theme-dark` before first paint, and `html.theme-dark .editorial-root { visibility: hidden }` hides the prerendered editorial markup for dark visitors until React swaps in `InterfacePage`. Dark visitors see one dark blank frame, never the paper brand. The class-sync effect in `useTheme` must not run until the theme is resolved, or it would strip the script's class and flash light.

---

### Task 1: Extract markdown helpers + rung extras

**Files:**
- Create: `components/markdown.tsx`, `components/RungExtras.tsx`
- Modify: `components/Rung.tsx`
- Test: `components/markdown.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
// components/markdown.test.tsx
import { render } from "@testing-library/react";
import { renderInlineMarkdown, renderEssay } from "./markdown";

describe("renderInlineMarkdown", () => {
  it("renders bold, italic, and links", () => {
    const { container } = render(
      <p>{renderInlineMarkdown("a **bold** and *ital* and [link](https://x.y)")}</p>
    );
    expect(container.querySelector("strong")?.textContent).toBe("bold");
    expect(container.querySelector("em")?.textContent).toBe("ital");
    expect(container.querySelector("a")?.getAttribute("href")).toBe("https://x.y");
  });
});

describe("renderEssay", () => {
  it("renders headings, paragraphs, and lists", () => {
    const { container } = render(
      <div>{renderEssay("# Title\n\nBody text.\n\n- one\n- two")}</div>
    );
    expect(container.querySelector("h3")?.textContent).toBe("Title");
    expect(container.querySelector("p")?.textContent).toBe("Body text.");
    expect(container.querySelectorAll("li").length).toBe(2);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run components/markdown.test.tsx`
Expected: FAIL — cannot resolve `./markdown`

- [ ] **Step 3: Create `components/markdown.tsx`**

Move `renderInlineMarkdown` (Rung.tsx:48–82), `renderEssay` (Rung.tsx:84–106), and `CLAUDE_MD_SAMPLE` (Rung.tsx:23–46) verbatim into this new file and export all three:

```tsx
// components/markdown.tsx — top of file
export const CLAUDE_MD_SAMPLE = `# CLAUDE.md
... (moved verbatim from Rung.tsx lines 23–46) ...`;

export function renderInlineMarkdown(text: string): React.ReactNode[] {
  // moved verbatim from Rung.tsx lines 48–82
}

export function renderEssay(text: string): React.ReactNode[] {
  // moved verbatim from Rung.tsx lines 84–106
}
```

(The function bodies are moved unchanged — no rewrites.)

- [ ] **Step 4: Create `components/RungExtras.tsx`**

The three conditional blocks from Rung.tsx become components that render `null` when not applicable:

```tsx
// components/RungExtras.tsx
import { renderEssay, CLAUDE_MD_SAMPLE } from "./markdown";

export function EssayBlock({ essay }: { essay?: string }) {
  if (!essay) return null;
  return (
    <details className="essay">
      <summary>
        <span className="essay-eyebrow">§ The long-form</span>
        <span className="essay-title">
          Read the essay: <em>Context Is the Compound Interest of AI</em>
        </span>
        <span className="essay-cue">expand ↓</span>
      </summary>
      <div className="essay-body">{renderEssay(essay)}</div>
    </details>
  );
}

export function ClaudeMdSample({ rungId }: { rungId: string }) {
  if (rungId !== "claude-md") return null;
  return (
    <details className="essay">
      <summary>
        <span className="essay-eyebrow">§ Sample</span>
        <span className="essay-title">
          See a <em>good starter CLAUDE.md</em>
        </span>
        <span className="essay-cue">expand ↓</span>
      </summary>
      <div className="essay-body">{renderEssay(CLAUDE_MD_SAMPLE)}</div>
    </details>
  );
}

export function RepoCta({ rungId }: { rungId: string }) {
  if (rungId !== "repo-structure") return null;
  return (
    <a
      className="repo-cta"
      href="https://github.com/01AHH/ai-ladder"
      target="_blank"
      rel="noreferrer noopener"
    >
      <span className="repo-cta-eyebrow">⌥ This repo, exactly</span>
      <span className="repo-cta-title">
        Browse <em>ai-ladder</em> on GitHub
      </span>
      <span className="repo-cta-blurb">
        The site you&apos;re reading is structured the way the essay describes.
        CLAUDE.md at the root, a /prompts folder, a /.claude/skills folder.
        Clone it. Look at the files. See if the shape matches yours.
      </span>
      <span className="repo-cta-cue">github.com/01AHH/ai-ladder ↗</span>
    </a>
  );
}
```

- [ ] **Step 5: Update `components/Rung.tsx`**

- Delete the moved code (lines 23–106) and add:
  `import { renderInlineMarkdown } from "./markdown";`
  `import { EssayBlock, ClaudeMdSample, RepoCta } from "./RungExtras";`
- Replace the `essayBlock` const with nothing; where `{essayBlock}` was rendered use `<EssayBlock essay={rung.essay} />`.
- Replace `{sampleClaudeMd}` with `<ClaudeMdSample rungId={rung.id} />` and delete the const.
- Replace `{repoCta}` with `<RepoCta rungId={rung.id} />` and delete the const.

- [ ] **Step 6: Run tests**

Run: `npx vitest run`
Expected: all pass (new markdown tests + existing 31).

---

### Task 2: Extract `GenerateDemo`

**Files:**
- Create: `components/GenerateDemo.tsx`
- Modify: `components/Rung.tsx`
- Test: `components/GenerateDemo.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
// components/GenerateDemo.test.tsx
import { render, screen } from "@testing-library/react";
import { GenerateDemo } from "./GenerateDemo";
import { rungs } from "@/content/rungs";

const prompting = rungs.find((r) => r.id === "prompting")!;
const skills = rungs.find((r) => r.id === "skills")!;

describe("GenerateDemo", () => {
  it("renders the default idle label", () => {
    render(<GenerateDemo rung={prompting} getContext={() => ""} />);
    expect(
      screen.getByRole("button", { name: /Generate good personal example/ })
    ).toBeInTheDocument();
  });

  it("renders the skill label on the skills rung", () => {
    render(<GenerateDemo rung={skills} getContext={() => ""} />);
    expect(
      screen.getByRole("button", { name: /Generate my skill/ })
    ).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run components/GenerateDemo.test.tsx`
Expected: FAIL — cannot resolve `./GenerateDemo`

- [ ] **Step 3: Create `components/GenerateDemo.tsx`**

Move the demo state machine out of `Rung.tsx` (lines 109–201: `text`/`state`/`errorMessage` state, `handleGenerate`, `buttonLabel`/`buttonArrow`, the `.generate` button, and the `StreamedOutput` render):

```tsx
// components/GenerateDemo.tsx
"use client";

import { useState } from "react";
import type { Rung as RungType } from "@/content/rungs";
import { StreamedOutput } from "./StreamedOutput";

type State = "idle" | "streaming" | "done" | "error";

type Props = {
  rung: RungType;
  getContext: () => string;
};

export function GenerateDemo({ rung, getContext }: Props) {
  const [text, setText] = useState("");
  const [state, setState] = useState<State>("idle");
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const isClimax = rung.id === "skills";

  async function handleGenerate() {
    const context = getContext();
    if (!context.trim()) {
      document.getElementById("context-input")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      document.querySelector<HTMLInputElement>("#context-input input")?.focus();
      return;
    }

    setText("");
    setErrorMessage(undefined);
    setState("streaming");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ context, rung_id: rung.id }),
      });

      if (!res.ok || !res.body) {
        const msg = await res.text();
        setErrorMessage(msg || "Claude couldn't generate. Try again.");
        setState("error");
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        setText(buf);
      }
      setState("done");
    } catch {
      setErrorMessage("Claude couldn't generate. Try again.");
      setState("error");
    }
  }

  const buttonLabel =
    state === "streaming"
      ? "Streaming…"
      : state === "done"
      ? "Regenerate"
      : isClimax
      ? "Generate my skill"
      : "Generate good personal example for me";
  const buttonArrow = state === "streaming" ? "·" : state === "done" ? "↻" : "→";

  return (
    <>
      <button
        className="generate"
        data-state={state === "idle" ? undefined : state}
        onClick={handleGenerate}
        disabled={state === "streaming"}
      >
        {buttonLabel}
        <span className="arrow">{buttonArrow}</span>
      </button>
      <StreamedOutput text={text} state={state} errorMessage={errorMessage} />
    </>
  );
}
```

- [ ] **Step 4: Update `components/Rung.tsx`**

- Delete the moved state/handler/label code and the `generate`/`stream` consts.
- Remove now-unused imports (`useState`, `StreamedOutput`).
- Add `import { GenerateDemo } from "./GenerateDemo";`
- In both the climax branch and the normal branch, replace
  `{generate}` + `{stream}` with `<GenerateDemo rung={rung} getContext={getContext} />`.

- [ ] **Step 5: Run tests**

Run: `npx vitest run`
Expected: all pass.

---

### Task 3: `useTheme` hook (TDD)

**Files:**
- Create: `lib/useTheme.ts`
- Test: `lib/useTheme.test.ts`

- [ ] **Step 1: Write the failing test**

jsdom has no `matchMedia` — stub it per test.

```ts
// lib/useTheme.test.ts
import { renderHook, act } from "@testing-library/react";
import { useTheme } from "./useTheme";

function stubMatchMedia(dark: boolean) {
  window.matchMedia = ((query: string) => ({
    matches: query.includes("dark") ? dark : false,
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
  })) as unknown as typeof window.matchMedia;
}

describe("useTheme", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove("theme-dark");
  });

  it("follows system preference when nothing is stored", () => {
    stubMatchMedia(true);
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe("dark");
  });

  it("prefers a stored override over system preference", () => {
    stubMatchMedia(true);
    localStorage.setItem("ladder-theme", "light");
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe("light");
  });

  it("persists setTheme and syncs the html class", () => {
    stubMatchMedia(false);
    const { result } = renderHook(() => useTheme());
    act(() => result.current.setTheme("dark"));
    expect(localStorage.getItem("ladder-theme")).toBe("dark");
    expect(document.documentElement.classList.contains("theme-dark")).toBe(true);
    act(() => result.current.setTheme("light"));
    expect(document.documentElement.classList.contains("theme-dark")).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run lib/useTheme.test.ts`
Expected: FAIL — cannot resolve `./useTheme`

- [ ] **Step 3: Create `lib/useTheme.ts`**

```ts
// lib/useTheme.ts
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run lib/useTheme.test.ts`
Expected: PASS (3 tests)

---

### Task 4: `ThemeToggle` component

**Files:**
- Create: `components/ThemeToggle.tsx`
- Test: `components/ThemeToggle.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
// components/ThemeToggle.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeToggle } from "./ThemeToggle";

describe("ThemeToggle", () => {
  it("shows the current mode and switches on click", () => {
    const setTheme = vi.fn();
    render(<ThemeToggle theme="light" setTheme={setTheme} />);
    const btn = screen.getByRole("button", { name: /switch to interface mode/i });
    fireEvent.click(btn);
    expect(setTheme).toHaveBeenCalledWith("dark");
  });

  it("switches back to paper from dark", () => {
    const setTheme = vi.fn();
    render(<ThemeToggle theme="dark" setTheme={setTheme} />);
    fireEvent.click(screen.getByRole("button", { name: /switch to paper mode/i }));
    expect(setTheme).toHaveBeenCalledWith("light");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run components/ThemeToggle.test.tsx`
Expected: FAIL — cannot resolve `./ThemeToggle`

- [ ] **Step 3: Create `components/ThemeToggle.tsx`**

```tsx
// components/ThemeToggle.tsx
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
```

- [ ] **Step 4: Add toggle styles to `app/globals.css`**

Next to `.topbar-right` at the bottom of the file:

```css
.theme-toggle {
  appearance: none;
  background: transparent;
  border: 1px solid var(--rule);
  border-radius: 999px;
  padding: 6px 12px;
  font-family: var(--mono);
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--muted);
  cursor: pointer;
  display: inline-flex;
  gap: 8px;
  align-items: center;
  transition: border-color 160ms, color 160ms;
}
.theme-toggle .on { color: var(--ink); }
.theme-toggle .sep { opacity: 0.4; }
.theme-toggle:hover { border-color: var(--accent); color: var(--accent); }
@media (max-width: 600px) {
  .theme-toggle { padding: 5px 9px; letter-spacing: 0.1em; }
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run components/ThemeToggle.test.tsx`
Expected: PASS (2 tests)

---

### Task 5: Extract `EditorialPage`

**Files:**
- Create: `components/EditorialPage.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Create `components/EditorialPage.tsx`**

Move the ENTIRE current content of `app/page.tsx` into it (the `SCENE_LABELS`/`SCENE_NUMS` maps, the scene-scroll effects, header, hero, rung loop, step scene, footer — verbatim), with these exact changes:

1. Component signature (replaces `export default function Home()`):

```tsx
"use client";

import { useEffect, useRef } from "react";
import { rungs } from "@/content/rungs";
import { ContextInput } from "@/components/ContextInput";
import { Definitions } from "@/components/Definitions";
import { Rung } from "@/components/Rung";
import { Bridge } from "@/components/Bridge";
import { HeroMetrics } from "@/components/HeroMetrics";
import { RungPipeline } from "@/components/RungPipeline";
import { LadderViz } from "@/components/LadderViz";
import { TabNav } from "@/components/tree/TabNav";
import { ThemeToggle } from "@/components/ThemeToggle";
import type { Theme } from "@/lib/useTheme";

type Props = {
  theme: Theme;
  setTheme: (t: Theme) => void;
  context: string;
  setContext: (v: string) => void;
  activeScene: string;
  setActiveScene: (s: string) => void;
};

export function EditorialPage({
  theme,
  setTheme,
  context,
  setContext,
  activeScene,
  setActiveScene,
}: Props) {
```

(`context`, `setContext`, `activeScene`, `setActiveScene` become props instead of local `useState` — the state lifts to `Home` so it survives mode switches. `contextRef` stays local, derived from the `context` prop.)

2. The scene-class body effect gains a cleanup so dark mode doesn't inherit a stale scene class:

```tsx
  useEffect(() => {
    const cls = `scene-${activeScene}`;
    document.body.classList.forEach((c) => {
      if (c.startsWith("scene-") && c !== cls) {
        document.body.classList.remove(c);
      }
    });
    if (!document.body.classList.contains(cls)) {
      document.body.classList.add(cls);
    }
    return () => {
      document.body.classList.forEach((c) => {
        if (c.startsWith("scene-")) document.body.classList.remove(c);
      });
    };
  }, [activeScene]);
```

3. The returned JSX is wrapped in `<div className="editorial-root">…</div>` (one wrapper around the existing fragment content, replacing `<>…</>`).

4. In the header's `.topbar-right`, add the toggle before the CTA:

```tsx
          <ThemeToggle theme={theme} setTheme={setTheme} />
          <a className="climb-cta" href="#rung-1">
```

- [ ] **Step 2: Rewrite `app/page.tsx` as the thin host**

(For this task it renders EditorialPage unconditionally; Task 9 adds the dark branch.)

```tsx
"use client";

import { useRef, useState } from "react";
import { useTheme } from "@/lib/useTheme";
import { EditorialPage } from "@/components/EditorialPage";

export default function Home() {
  const { theme, setTheme } = useTheme();
  const [context, setContext] = useState("");
  const [activeScene, setActiveScene] = useState("hero");
  return (
    <EditorialPage
      theme={theme}
      setTheme={setTheme}
      context={context}
      setContext={setContext}
      activeScene={activeScene}
      setActiveScene={setActiveScene}
    />
  );
}
```

Note: the scroll effect in `EditorialPage` calls `setActiveScene` — it receives it via props, and its `useEffect` dependency array changes from `[activeScene]` to `[activeScene, setActiveScene]`.

- [ ] **Step 3: Verify**

Run: `npx vitest run && npm run build`
Expected: tests pass, build clean.

---

### Task 6: `SplitFlap` (TDD)

**Files:**
- Create: `components/interface/SplitFlap.tsx`
- Test: `components/interface/SplitFlap.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
// components/interface/SplitFlap.test.tsx
import { render } from "@testing-library/react";
import { SplitFlap } from "./SplitFlap";

function stubMatchMedia(reduced: boolean) {
  window.matchMedia = ((query: string) => ({
    matches: query.includes("reduced-motion") ? reduced : false,
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
  })) as unknown as typeof window.matchMedia;
}

describe("SplitFlap", () => {
  it("renders the first word as one flap per character (padded)", () => {
    stubMatchMedia(true);
    const { container } = render(<SplitFlap words={["CLIMB", "POSSIBLE"]} />);
    const flaps = container.querySelectorAll(".flap");
    expect(flaps.length).toBe("POSSIBLE".length); // padded to longest word
    const text = Array.from(flaps).map((f) => f.textContent).join("");
    expect(text.trimEnd()).toBe("CLIMB");
  });

  it("does not cycle under reduced motion", () => {
    vi.useFakeTimers();
    stubMatchMedia(true);
    const { container } = render(
      <SplitFlap words={["CLIMB", "BUILD"]} interval={100} />
    );
    vi.advanceTimersByTime(1000);
    const text = Array.from(container.querySelectorAll(".flap"))
      .map((f) => f.textContent)
      .join("");
    expect(text.trimEnd()).toBe("CLIMB");
    vi.useRealTimers();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run components/interface/SplitFlap.test.tsx`
Expected: FAIL — cannot resolve `./SplitFlap`

- [ ] **Step 3: Create `components/interface/SplitFlap.tsx`**

Deterministic character cycling (no `Math.random` — index-based pseudo-shuffle). Each char element is keyed by position+char so a char change remounts it and replays the CSS flip animation.

```tsx
// components/interface/SplitFlap.tsx
"use client";

import { useEffect, useState } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const FLIP_STEPS = 4;

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

type Props = { words: string[]; interval?: number };

export function SplitFlap({ words, interval = 3500 }: Props) {
  const maxLen = Math.max(...words.map((w) => w.length));
  const pad = (w: string) => w.padEnd(maxLen, " ");
  const [display, setDisplay] = useState(() => pad(words[0]).split(""));
  const [reduced] = useState(prefersReducedMotion);

  useEffect(() => {
    if (reduced || words.length < 2) return;
    let word = 0;
    const timers = new Set<ReturnType<typeof setTimeout>>();
    const later = (fn: () => void, ms: number) => {
      const t = setTimeout(() => {
        timers.delete(t);
        fn();
      }, ms);
      timers.add(t);
    };
    const setChar = (i: number, ch: string) =>
      setDisplay((d) => (d[i] === ch ? d : d.map((c, j) => (j === i ? ch : c))));
    const flipChar = (i: number, target: string, step: number) => {
      if (step >= FLIP_STEPS || target === " ") {
        setChar(i, target);
        return;
      }
      setChar(i, CHARS[(i * 5 + step * 11) % CHARS.length]);
      later(() => flipChar(i, target, step + 1), 55);
    };
    const flipTo = (w: string) =>
      w.split("").forEach((ch, i) => later(() => flipChar(i, ch, 0), i * 70));
    const cycle = setInterval(() => {
      word = (word + 1) % words.length;
      flipTo(pad(words[word]));
    }, interval);
    return () => {
      clearInterval(cycle);
      timers.forEach(clearTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced, interval]);

  return (
    <span className="if-flap" role="text" aria-label={words[0]}>
      {display.map((c, i) => (
        <span
          key={`${i}-${c}`}
          className="flap"
          data-space={c === " " ? "true" : undefined}
          aria-hidden="true"
        >
          {c}
        </span>
      ))}
    </span>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run components/interface/SplitFlap.test.tsx`
Expected: PASS (2 tests)

---

### Task 7: `RungGrid` + `RungPanel` (TDD)

**Files:**
- Create: `components/interface/RungGrid.tsx`, `components/interface/RungPanel.tsx`
- Test: `components/interface/RungGrid.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
// components/interface/RungGrid.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { RungGrid } from "./RungGrid";
import { rungs } from "@/content/rungs";

const mainRungs = rungs.filter((r) => Number.isInteger(r.number));
const subRungs = rungs.filter((r) => !Number.isInteger(r.number));
const noop = () => {};

describe("RungGrid", () => {
  it("renders a cell per integer rung and a slim row per sub-rung", () => {
    const { container } = render(
      <RungGrid getContext={() => "ctx"} onReadOnPaper={noop} />
    );
    expect(container.querySelectorAll(".if-cell").length).toBe(mainRungs.length);
    expect(container.querySelectorAll(".if-sub").length).toBe(subRungs.length);
  });

  it("opens one panel at a time with the rung's full content", () => {
    const { container } = render(
      <RungGrid getContext={() => "ctx"} onReadOnPaper={noop} />
    );
    fireEvent.click(screen.getByRole("button", { name: /01.*Prompting/i }));
    expect(container.querySelectorAll(".if-panel").length).toBe(1);
    const prompting = rungs.find((r) => r.id === "prompting")!;
    // plain renders in the cell AND the open panel — expect 2 while open
    expect(screen.getAllByText(prompting.plain).length).toBe(2);
    for (const t of prompting.tools) {
      expect(screen.getByText(t)).toBeInTheDocument();
    }
    fireEvent.click(screen.getByRole("button", { name: /02.*Vibe coding/i }));
    expect(container.querySelectorAll(".if-panel").length).toBe(1);
    // panel closed — only the cell copy remains
    expect(screen.getAllByText(prompting.plain).length).toBe(1);
  });

  it("every rung's panel carries a generate demo (full parity)", () => {
    const { container } = render(
      <RungGrid getContext={() => "ctx"} onReadOnPaper={noop} />
    );
    for (const r of rungs) {
      const opener = screen.getByRole("button", {
        name: new RegExp(`${String(r.number).replace(".", "\\.")}.*${r.name}`, "i"),
      });
      fireEvent.click(opener);
      expect(container.querySelectorAll(".generate").length).toBe(1);
    }
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run components/interface/RungGrid.test.tsx`
Expected: FAIL — cannot resolve `./RungGrid`

- [ ] **Step 3: Create `components/interface/RungPanel.tsx`**

Full parity: everything a light-mode rung section shows, reusing the shared pieces from Tasks 1–2, closing with the Socratic bridge line and the paper link.

```tsx
// components/interface/RungPanel.tsx
"use client";

import type { Rung as RungType } from "@/content/rungs";
import { renderInlineMarkdown } from "@/components/markdown";
import { EssayBlock, ClaudeMdSample, RepoCta } from "@/components/RungExtras";
import { GenerateDemo } from "@/components/GenerateDemo";
import { InspirationGallery } from "@/components/InspirationGallery";

type Props = {
  rung: RungType;
  getContext: () => string;
  onReadOnPaper: (rungNumber: number) => void;
};

export function RungPanel({ rung, getContext, onReadOnPaper }: Props) {
  return (
    <div className="if-panel" role="region" aria-label={rung.name}>
      <p className="if-panel-plain">{rung.plain}</p>
      <p className="rung-def">{renderInlineMarkdown(rung.definition)}</p>

      {rung.mediaImage && (
        <figure className="rung-media">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={rung.mediaImage.src} alt={rung.mediaImage.alt} loading="lazy" />
          {rung.mediaImage.caption && (
            <figcaption>{rung.mediaImage.caption}</figcaption>
          )}
        </figure>
      )}

      {rung.tools.length > 0 && (
        <div className="rung-tools">
          {rung.tools.map((t) => (
            <span key={t} className="chip">
              {t}
            </span>
          ))}
        </div>
      )}

      {rung.seedExample && (
        <div className="seed">
          <div className="seed-label">Seed example · generic</div>
          <div className="seed-text">{rung.seedExample}</div>
        </div>
      )}

      <RepoCta rungId={rung.id} />
      <EssayBlock essay={rung.essay} />
      <ClaudeMdSample rungId={rung.id} />

      {rung.skills && (
        <div className="shelf">
          {rung.skills.map((s) => (
            <div className="skill-card" key={s.name}>
              <div className="top">
                <span className="tag">{s.tag}</span>
                <span className="name">{s.name}</span>
              </div>
              <div className="trigger">
                <span className="when">Fires when</span>
                {s.trigger}
              </div>
            </div>
          ))}
        </div>
      )}

      <GenerateDemo rung={rung} getContext={getContext} />

      <InspirationGallery rungId={rung.id} />

      {rung.socraticBridge && (
        <p className="if-bridge">{rung.socraticBridge}</p>
      )}
      <button
        className="if-paper-link"
        onClick={() => onReadOnPaper(rung.number)}
      >
        Read this rung on paper →
      </button>
    </div>
  );
}
```

- [ ] **Step 4: Create `components/interface/RungGrid.tsx`**

Rows of 4 main rungs; a panel renders after its row; sub-rungs render as slim rows after their parent's row. Cells carry `data-cursor="climb"` for the custom cursor and a per-scene hue variable.

```tsx
// components/interface/RungGrid.tsx
"use client";

import { useState } from "react";
import { rungs, type Rung as RungType } from "@/content/rungs";
import { RungPanel } from "./RungPanel";

const SCENE_COLOR: Record<string, string> = {
  prompting: "#7FA35E",
  vibe: "#E88B54",
  agents: "#8A6BB8",
  skills: "#7A98A8",
  memory: "#C4A578",
  repo: "#D9B04A",
  apis: "#4E93AC",
  integrated: "#E08468",
};

const mainRungs = rungs.filter((r) => Number.isInteger(r.number));
const subsAfter = (n: number) =>
  rungs.filter((r) => !Number.isInteger(r.number) && Math.floor(r.number) === n);

function chunk<T>(list: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < list.length; i += size) out.push(list.slice(i, i + size));
  return out;
}

type Props = {
  getContext: () => string;
  onReadOnPaper: (rungNumber: number) => void;
};

export function RungGrid({ getContext, onReadOnPaper }: Props) {
  const [openId, setOpenId] = useState<string | null>(null);
  const toggle = (id: string) => setOpenId((cur) => (cur === id ? null : id));

  const cell = (r: RungType, sub = false) => (
    <button
      key={r.id}
      className={`${sub ? "if-sub" : "if-cell"}${openId === r.id ? " open" : ""}`}
      style={{ ["--cell-color" as string]: SCENE_COLOR[r.sceneKey] ?? "#E05B2B" }}
      data-cursor="climb"
      aria-expanded={openId === r.id}
      onClick={() => toggle(r.id)}
    >
      <span className="if-cell-num">
        {Number.isInteger(r.number) ? String(r.number).padStart(2, "0") : r.number}
      </span>
      <span className="if-cell-name">{r.name}</span>
      <span className="if-cell-plain">{r.plain}</span>
    </button>
  );

  const openRung = rungs.find((r) => r.id === openId);
  const panel = (row: RungType[]) =>
    openRung &&
    row.some((r) => r.id === openRung.id) && (
      <RungPanel
        rung={openRung}
        getContext={getContext}
        onReadOnPaper={onReadOnPaper}
      />
    );

  return (
    <div className="if-grid" role="list" aria-label="The eight rungs">
      {chunk(mainRungs, 4).map((row, i) => {
        const subs = row.flatMap((r) => subsAfter(r.number));
        return (
          <div className="if-row" key={i}>
            <div className="if-row-cells">{row.map((r) => cell(r))}</div>
            {panel(row)}
            {subs.map((s) => (
              <div className="if-subwrap" key={s.id}>
                {cell(s, true)}
                {panel([s])}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run components/interface/RungGrid.test.tsx`
Expected: PASS (3 tests)

---

### Task 8: `ModeCursor`

**Files:**
- Create: `components/interface/ModeCursor.tsx`

(No unit test — pure DOM/rAF chrome, covered by Task 10's manual pass.)

- [ ] **Step 1: Create `components/interface/ModeCursor.tsx`**

```tsx
// components/interface/ModeCursor.tsx
"use client";

import { useEffect, useRef, useState } from "react";

export function ModeCursor() {
  const el = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [big, setBig] = useState(false);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setEnabled(true);
    let raf = 0;
    let x = 0;
    let y = 0;
    const onMove = (e: MouseEvent) => {
      x = e.clientX;
      y = e.clientY;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (el.current) {
          el.current.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
        }
      });
    };
    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      setBig(Boolean(t.closest('[data-cursor="climb"]')));
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (!enabled) return null;
  return (
    <div ref={el} className={`mode-cursor${big ? " big" : ""}`} aria-hidden="true">
      <span className="label">CLIMB ↗</span>
    </div>
  );
}
```

- [ ] **Step 2: Type check**

Run: `npx tsc --noEmit -p tsconfig.json`
Expected: clean (component unused until Task 9).

---

### Task 9: `InterfacePage`, `interface.css`, layout script, theme switch

**Files:**
- Create: `components/interface/InterfacePage.tsx`, `app/interface.css`
- Modify: `app/layout.tsx`, `app/page.tsx`

- [ ] **Step 1: Create `components/interface/InterfacePage.tsx`**

```tsx
// components/interface/InterfacePage.tsx
"use client";

import { ContextInput } from "@/components/ContextInput";
import { TabNav } from "@/components/tree/TabNav";
import { ThemeToggle } from "@/components/ThemeToggle";
import type { Theme } from "@/lib/useTheme";
import { SplitFlap } from "./SplitFlap";
import { RungGrid } from "./RungGrid";
import { ModeCursor } from "./ModeCursor";

const FLAP_WORDS = ["POSSIBLE", "PROMPT", "BUILD", "DELEGATE", "CLIMB"];

type Props = {
  theme: Theme;
  setTheme: (t: Theme) => void;
  context: string;
  setContext: (v: string) => void;
};

export function InterfacePage({ theme, setTheme, context, setContext }: Props) {
  const contextRef = { current: context };
  contextRef.current = context;

  function readOnPaper(rungNumber: number) {
    setTheme("light");
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document
          .getElementById(`rung-${rungNumber}`)
          ?.scrollIntoView({ block: "start" });
      });
    });
  }

  return (
    <div className="if-root">
      <ModeCursor />
      <header className="topbar">
        <div className="topbar-left">
          <TabNav theme="dark" />
          <div className="mark">
            THE&nbsp;AI&nbsp;LADDER<span className="dot">.</span>
          </div>
        </div>
        <div className="topbar-right">
          <ThemeToggle theme={theme} setTheme={setTheme} />
        </div>
      </header>

      <main className="if-main">
        <section className="if-hero">
          <SplitFlap words={FLAP_WORDS} />
          <p className="if-lede">
            A field guide to what&apos;s actually possible with AI right now.
            Eight rungs, one ladder — open any of them below.
          </p>
          <ContextInput value={context} onChange={setContext} />
        </section>

        <RungGrid getContext={() => contextRef.current} onReadOnPaper={readOnPaper} />
      </main>

      <footer className="site">
        <div className="colophon">
          Interface mode: set in JetBrains Mono on near-black. Paper mode is
          one toggle away. Open source on{" "}
          <a href="https://github.com/01AHH/ai-ladder">GitHub</a>, MIT licensed.
        </div>
        <div className="wink">
          two brands, one ladder<span className="dot">.</span>
        </div>
      </footer>
    </div>
  );
}
```

- [ ] **Step 2: Create `app/interface.css`**

```css
/* ============================================================
   INTERFACE dark mode — every rule lives under html.theme-dark.
   Reused components (generate, stream, seed, essay, skill-card,
   inspo, chips, context) restyle themselves via the token override.
   ============================================================ */

html.theme-dark body {
  --bg: #0A0A0B;
  --bg-soft: rgba(245,245,242,0.05);
  --ink: #F5F5F2;
  --ink-soft: rgba(245,245,242,0.82);
  --muted: #8B8B88;
  --rule: rgba(245,245,242,0.14);
  --rule-2: rgba(245,245,242,0.30);
  --accent: #E05B2B;
  --accent-ink: #0A0A0B;
  --shadow-color: rgba(0,0,0,0.5);
  background: var(--bg);
  color: var(--ink);
  transition: none;
}

/* hide the prerendered editorial page pre-hydration for dark visitors */
html.theme-dark .editorial-root { visibility: hidden; }

html.theme-dark .if-root { min-height: 100vh; }

/* ---- hero ---- */
html.theme-dark .if-main {
  max-width: 1240px;
  margin: 0 auto;
  padding: 130px 6vw 80px;
}
html.theme-dark .if-hero { padding: 4vh 0 7vh; display: grid; gap: 4vh; }
html.theme-dark .if-flap { display: flex; gap: 6px; flex-wrap: wrap; }
html.theme-dark .flap {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: clamp(40px, 6.4vw, 88px);
  height: clamp(56px, 9vw, 120px);
  background: #161618;
  border: 1px solid #2A2A2E;
  border-radius: 6px;
  font-family: var(--sans);
  font-weight: 800;
  font-size: clamp(30px, 5vw, 72px);
  color: var(--ink);
  animation: flapflip 140ms ease-out;
  backface-visibility: hidden;
}
html.theme-dark .flap[data-space] { background: transparent; border-color: transparent; }
@keyframes flapflip {
  0% { transform: rotateX(-85deg); }
  100% { transform: rotateX(0); }
}
html.theme-dark .if-lede {
  font-family: var(--mono);
  font-size: 13px;
  letter-spacing: 0.06em;
  line-height: 1.7;
  color: var(--muted);
  max-width: 52ch;
  text-transform: uppercase;
}

/* ---- grid ---- */
html.theme-dark .if-grid { display: grid; gap: 10px; cursor: none; }
html.theme-dark .if-row { display: grid; gap: 10px; }
html.theme-dark .if-row-cells {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
}
html.theme-dark .if-cell,
html.theme-dark .if-sub {
  appearance: none;
  text-align: left;
  background: transparent;
  border: 1px solid var(--rule);
  border-radius: 8px;
  padding: 18px 16px;
  color: var(--ink);
  font-family: var(--mono);
  cursor: none;
  transition: border-color 160ms, background 160ms, transform 160ms;
}
html.theme-dark .if-cell:hover,
html.theme-dark .if-sub:hover {
  border-color: var(--cell-color, var(--accent));
  transform: translateY(-2px);
}
html.theme-dark .if-cell.open,
html.theme-dark .if-sub.open {
  background: #161618;
  border-color: var(--cell-color, var(--accent));
}
html.theme-dark .if-cell-num {
  display: block;
  color: var(--accent);
  font-size: 10px;
  letter-spacing: 0.2em;
  margin-bottom: 8px;
}
html.theme-dark .if-cell-name {
  display: block;
  font-size: clamp(13px, 1.3vw, 16px);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  font-weight: 700;
}
html.theme-dark .if-cell-plain {
  display: block;
  font-family: var(--sans);
  font-size: 11px;
  line-height: 1.5;
  color: var(--muted);
  margin-top: 8px;
}
html.theme-dark .if-subwrap { display: grid; gap: 10px; }
html.theme-dark .if-sub {
  display: flex;
  align-items: baseline;
  gap: 14px;
  padding: 12px 16px;
  border-style: dashed;
}
html.theme-dark .if-sub .if-cell-num,
html.theme-dark .if-sub .if-cell-plain { margin: 0; }
html.theme-dark .if-sub .if-cell-name { font-size: 12px; }

/* ---- panel ---- */
html.theme-dark .if-panel {
  border: 1px solid var(--rule);
  border-radius: 10px;
  background: #111113;
  padding: clamp(20px, 3vw, 40px);
  animation: panel-in 320ms cubic-bezier(.22,.61,.36,1);
  display: grid;
  gap: 22px;
  justify-items: start;
}
@keyframes panel-in {
  from { opacity: 0; transform: translateY(-8px); }
}
html.theme-dark .if-panel > * {
  animation: rise 360ms cubic-bezier(.22,.61,.36,1) both;
}
html.theme-dark .if-panel > *:nth-child(2) { animation-delay: 50ms; }
html.theme-dark .if-panel > *:nth-child(3) { animation-delay: 100ms; }
html.theme-dark .if-panel > *:nth-child(4) { animation-delay: 150ms; }
html.theme-dark .if-panel > *:nth-child(n+5) { animation-delay: 200ms; }
@keyframes rise {
  from { opacity: 0; transform: translateY(8px); }
}
html.theme-dark .if-panel-plain {
  font-family: var(--mono);
  font-size: 12px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--accent);
  margin: 0;
}
html.theme-dark .if-panel .rung-def {
  font-family: var(--sans);
  font-size: 17px;
  line-height: 1.6;
  margin: 0;
  max-width: 62ch;
}
html.theme-dark .if-panel .rung-media { margin: 0; }
html.theme-dark .if-panel .rung-tools { margin: 0; }
html.theme-dark .if-panel .seed { margin: 0; }
html.theme-dark .if-panel .essay { margin: 0; width: 100%; }
html.theme-dark .if-panel .repo-cta { margin: 0; }
html.theme-dark .if-panel .stream { max-width: 68ch; }
html.theme-dark .if-panel .shelf { width: 100%; max-width: 680px; }
html.theme-dark .if-panel .inspo { width: 100%; margin-top: 8px; padding-top: 18px; }
html.theme-dark .if-bridge {
  font-family: var(--display);
  font-style: italic;
  font-size: 20px;
  color: var(--muted);
  border-top: 1px solid var(--rule);
  padding-top: 18px;
  margin: 6px 0 0;
  width: 100%;
}
html.theme-dark .if-paper-link {
  appearance: none;
  background: transparent;
  border: 0;
  padding: 0;
  color: var(--accent);
  font-family: var(--mono);
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  cursor: pointer;
}
html.theme-dark .if-paper-link:hover { text-decoration: underline; }

/* ---- custom cursor ---- */
html.theme-dark .mode-cursor {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  width: 14px;
  height: 14px;
  border-radius: 999px;
  background: var(--accent);
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: width 160ms, height 160ms;
}
html.theme-dark .mode-cursor .label {
  display: none;
  font-family: var(--mono);
  font-size: 9px;
  letter-spacing: 0.08em;
  color: var(--accent-ink);
  white-space: nowrap;
}
html.theme-dark .mode-cursor.big { width: 64px; height: 64px; }
html.theme-dark .mode-cursor.big .label { display: block; }

/* ---- responsive ---- */
@media (max-width: 900px) {
  html.theme-dark .if-row-cells { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 600px) {
  html.theme-dark .if-main { padding: 110px 20px 60px; }
  html.theme-dark .if-row-cells { grid-template-columns: minmax(0, 1fr); }
  html.theme-dark .if-grid,
  html.theme-dark .if-cell,
  html.theme-dark .if-sub { cursor: auto; }
}

/* ---- reduced motion ---- */
@media (prefers-reduced-motion: reduce) {
  html.theme-dark .flap,
  html.theme-dark .if-panel,
  html.theme-dark .if-panel > * { animation: none; }
  html.theme-dark .mode-cursor { display: none; }
}
```

- [ ] **Step 3: Update `app/layout.tsx`**

Add the CSS import, and the pre-paint theme script in `<head>`:

```tsx
import "./globals.css";
import "./interface.css";
```

```tsx
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem("ladder-theme");if(t==="dark"||(!t&&matchMedia("(prefers-color-scheme: dark)").matches))document.documentElement.classList.add("theme-dark")}catch(e){}`,
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
```

- [ ] **Step 4: Update `app/page.tsx` to the full switch**

```tsx
"use client";

import { useState } from "react";
import { useTheme } from "@/lib/useTheme";
import { EditorialPage } from "@/components/EditorialPage";
import { InterfacePage } from "@/components/interface/InterfacePage";

export default function Home() {
  const { theme, setTheme } = useTheme();
  const [context, setContext] = useState("");
  const [activeScene, setActiveScene] = useState("hero");

  if (theme === "dark") {
    return (
      <InterfacePage
        theme={theme}
        setTheme={setTheme}
        context={context}
        setContext={setContext}
      />
    );
  }
  return (
    <EditorialPage
      theme={theme}
      setTheme={setTheme}
      context={context}
      setContext={setContext}
      activeScene={activeScene}
      setActiveScene={setActiveScene}
    />
  );
}
```

- [ ] **Step 5: Verify**

Run: `npx vitest run && npm run build`
Expected: all tests pass, build clean.

---

### Task 10: Local verification, then commit

**Files:** none (verification + commit)

- [ ] **Step 1: Full test suite + build**

Run: `npm run test:run && npm run build`
Expected: all suites pass, clean build.

- [ ] **Step 2: Run locally and verify** (dev server: `npm run dev`, http://localhost:3000)

- Light (no stored theme, light OS pref): editorial page identical to before, toggle visible next to the readout, reads `Paper ● / Interface ○`.
- Toggle → Interface: near-black one-pager; split-flap H1 cycling POSSIBLE→PROMPT→BUILD→DELEGATE→CLIMB; context input; 8 cells + 2 dashed sub-rows.
- Open each rung: panel expands after its row with definition, tools, seed/essay/sample/repo-CTA where applicable, skill shelf on 04, generate demo, inspiration gallery, bridge line; only one panel open.
- Streaming demo end-to-end inside a panel (needs context filled).
- "Read this rung on paper →": switches to light and lands on the right rung.
- Reload in dark: stays dark, no paper flash (check with devtools network throttling).
- DevTools emulate `prefers-color-scheme: dark` + clear localStorage: dark by default.
- Custom cursor: dot follows, swells to CLIMB ↗ over cells; absent on touch emulation.
- Mobile 600px: 1-column accordion, no custom cursor.
- Reduced motion: static first word, no panel animations, no cursor.
- `/tree` unaffected in both themes.

- [ ] **Step 3: Pause for the user to view before committing** (explicit user preference)

- [ ] **Step 4: Commit and push**

```bash
git add -A
git commit -m "feat: INTERFACE dark mode — kinetic grid one-pager behind theme toggle

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
git push
```
