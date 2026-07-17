# AGENTIC-Inspired Landing Restyle Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restyle the landing page toward the v0 AGENTIC template — sticky nav with CTA, hero metrics strip, horizontal rung pipeline replacing the RungIndex table, product-style card pass — while keeping the editorial identity and scene-morphing palettes.

**Architecture:** Two new client components (`HeroMetrics`, `RungPipeline`) computed from the static `content/rungs.ts`; `RungIndex` is deleted. All visual changes live in `app/globals.css` on the existing palette tokens, plus one new registered token `--shadow-color` defined per scene. `app/page.tsx` wires the new components and the nav CTA.

**Tech Stack:** Next.js 15 (app router, client page), Tailwind not used for these styles (hand-rolled CSS in `globals.css`), Vitest + Testing Library (jsdom).

**Spec:** `docs/superpowers/specs/2026-07-17-agentic-restyle-design.md`

**Commit strategy (user override):** The user asked to build and verify locally BEFORE committing. Do NOT commit after each task. Run tests per task, but make the single feature commit only after Task 7's local verification passes.

---

### Task 1: `HeroMetrics` component (TDD)

**Files:**
- Create: `components/HeroMetrics.tsx`
- Test: `components/HeroMetrics.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
// components/HeroMetrics.test.tsx
import { render, screen } from "@testing-library/react";
import { HeroMetrics, countDistinctTools } from "./HeroMetrics";
import { rungs } from "@/content/rungs";

describe("countDistinctTools", () => {
  it("counts distinct tool strings across rungs", () => {
    const fixture = [{ tools: ["a", "b"] }, { tools: ["b", "c"] }];
    expect(countDistinctTools(fixture)).toBe(3);
  });
});

describe("HeroMetrics", () => {
  it("renders the four metrics with computed values", () => {
    render(<HeroMetrics />);
    const rungCount = rungs.filter((r) => Number.isInteger(r.number)).length;
    expect(screen.getByText("rungs to climb")).toBeInTheDocument();
    expect(
      screen.getByText(String(rungCount).padStart(2, "0"))
    ).toBeInTheDocument();
    expect(screen.getByText("tools mapped")).toBeInTheDocument();
    expect(
      screen.getByText(String(countDistinctTools(rungs)))
    ).toBeInTheDocument();
    expect(screen.getByText("step at a time")).toBeInTheDocument();
    expect(screen.getByText("tracking")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run components/HeroMetrics.test.tsx`
Expected: FAIL — cannot resolve `./HeroMetrics`

- [ ] **Step 3: Write the component**

```tsx
// components/HeroMetrics.tsx
import { rungs } from "@/content/rungs";

export function countDistinctTools(list: { tools: string[] }[]): number {
  return new Set(list.flatMap((r) => r.tools)).size;
}

export function HeroMetrics() {
  const rungCount = rungs.filter((r) => Number.isInteger(r.number)).length;
  const metrics = [
    { n: String(rungCount).padStart(2, "0"), label: "rungs to climb" },
    { n: String(countDistinctTools(rungs)), label: "tools mapped" },
    { n: "01", label: "step at a time", accent: true },
    { n: "00", label: "tracking" },
  ];
  return (
    <div className="metrics" role="list" aria-label="This page in numbers">
      {metrics.map((m) => (
        <div
          className="metric"
          role="listitem"
          key={m.label}
          data-accent={m.accent ? "true" : undefined}
        >
          <span className="metric-n">{m.n}</span>
          <span className="metric-label">{m.label}</span>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run components/HeroMetrics.test.tsx`
Expected: PASS (2 tests)

---

### Task 2: `RungPipeline` component (TDD)

**Files:**
- Create: `components/RungPipeline.tsx`
- Test: `components/RungPipeline.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
// components/RungPipeline.test.tsx
import { render, screen } from "@testing-library/react";
import { RungPipeline } from "./RungPipeline";
import { rungs } from "@/content/rungs";

const mainRungs = rungs.filter((r) => Number.isInteger(r.number));
const subRungs = rungs.filter((r) => !Number.isInteger(r.number));

describe("RungPipeline", () => {
  it("renders one chip per integer rung, linking to its anchor", () => {
    render(<RungPipeline activeScene="hero" />);
    for (const r of mainRungs) {
      const chip = screen.getByRole("link", {
        name: `${String(r.number).padStart(2, "0")} ${r.name}`,
      });
      expect(chip).toHaveAttribute("href", `#rung-${r.number}`);
    }
  });

  it("marks the chip matching activeScene as active", () => {
    render(<RungPipeline activeScene="agents" />);
    const active = screen.getByRole("link", { name: "03 Coding agents" });
    expect(active.className).toContain("active");
    const inactive = screen.getByRole("link", { name: "01 Prompting" });
    expect(inactive.className).not.toContain("active");
  });

  it("renders sub-rungs as tick links with their names", () => {
    render(<RungPipeline activeScene="hero" />);
    for (const s of subRungs) {
      const tick = screen.getByRole("link", {
        name: `${s.number} — ${s.name}`,
      });
      expect(tick).toHaveAttribute("href", `#rung-${s.number}`);
    }
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run components/RungPipeline.test.tsx`
Expected: FAIL — cannot resolve `./RungPipeline`

- [ ] **Step 3: Write the component**

`SCENE_COLOR` moves here from `RungIndex.tsx` (which Task 5 deletes).

```tsx
// components/RungPipeline.tsx
import { rungs } from "@/content/rungs";

const SCENE_COLOR: Record<string, string> = {
  prompting: "#4D6A3A",
  vibe: "#DD7A3E",
  agents: "#3D2858",
  skills: "#3F4F58",
  memory: "#A88B62",
  repo: "#C99A1E",
  apis: "#1F5266",
  integrated: "#D67054",
};

const mainRungs = rungs.filter((r) => Number.isInteger(r.number));
const subRungsAfter = (n: number) =>
  rungs.filter((r) => !Number.isInteger(r.number) && Math.floor(r.number) === n);

export function RungPipeline({ activeScene }: { activeScene: string }) {
  return (
    <nav className="pipeline-wrap" aria-label="Jump to a rung">
      <div className="pipe-head">
        <span className="lead">
          <span className="arrow">↓</span>The eight rungs
        </span>
        <span>Jump to any</span>
      </div>
      <div className="pipeline">
        {mainRungs.map((r, i) => (
          <span key={r.id} className="pipe-seg">
            <a
              className={`pipe-chip${r.sceneKey === activeScene ? " active" : ""}`}
              href={`#rung-${r.number}`}
              style={{
                ["--pipe-color" as string]:
                  SCENE_COLOR[r.sceneKey] ?? "var(--accent)",
              }}
            >
              <span className="pipe-num">
                {String(r.number).padStart(2, "0")}
              </span>
              <span className="pipe-name">{r.name}</span>
            </a>
            {i < mainRungs.length - 1 && (
              <span className="pipe-link">
                {subRungsAfter(r.number).map((s) => (
                  <a
                    key={s.id}
                    className="pipe-tick"
                    href={`#rung-${s.number}`}
                    title={`${s.number} — ${s.name}`}
                    aria-label={`${s.number} — ${s.name}`}
                  />
                ))}
              </span>
            )}
          </span>
        ))}
      </div>
    </nav>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run components/RungPipeline.test.tsx`
Expected: PASS (3 tests)

---

### Task 3: Shadow token + smooth scroll (CSS foundation)

**Files:**
- Modify: `app/globals.css` (token registrations at top, `:root`, every `body.scene-*` block, body transition list)

- [ ] **Step 1: Register the new token**

After the existing `@property --accent-ink` line (line 15), add:

```css
@property --shadow-color { syntax: "<color>"; inherits: true; initial-value: rgba(26,22,18,0.10); }
```

- [ ] **Step 2: Define it in `:root` and every scene**

Add to `:root`: `--shadow-color: rgba(26,22,18,0.10);`

Add one line inside each `body.scene-*` block (darker scenes get stronger shadows so they read on saturated backgrounds):

| Scene block | Line to add |
|---|---|
| `body.scene-hero` | `--shadow-color: rgba(26,22,18,0.10);` |
| `body.scene-prompting` | `--shadow-color: rgba(20,30,12,0.22);` |
| `body.scene-vibe` | `--shadow-color: rgba(42,20,8,0.16);` |
| `body.scene-agents` | `--shadow-color: rgba(10,6,20,0.28);` |
| `body.scene-skills` | `--shadow-color: rgba(8,14,18,0.26);` |
| `body.scene-memory` | `--shadow-color: rgba(35,24,17,0.16);` |
| `body.scene-repo` | `--shadow-color: rgba(42,26,6,0.16);` |
| `body.scene-apis` | `--shadow-color: rgba(4,16,22,0.28);` |
| `body.scene-climax` | `--shadow-color: rgba(0,0,0,0.35);` |
| `body.scene-integrated` | `--shadow-color: rgba(42,18,8,0.18);` |
| `body.scene-step` | `--shadow-color: rgba(26,22,18,0.10);` |

- [ ] **Step 3: Morph it with the other tokens**

In the `body { transition: ... }` list, add:

```css
    --shadow-color 900ms cubic-bezier(.4,0,.2,1),
```

- [ ] **Step 4: Smooth anchor scrolling**

Add near the BASE section:

```css
html { scroll-behavior: smooth; }
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
}
```

- [ ] **Step 5: Sanity check**

Run: `npm run build`
Expected: compiles clean.

---

### Task 4: Nav bar upgrade

**Files:**
- Modify: `app/globals.css` (`.topbar` block, new `.topbar-right` + `.climb-cta`, 600px media block)
- Modify: `app/page.tsx` (header JSX, lines 101–114)

- [ ] **Step 1: Restyle `.topbar`**

Replace the existing `.topbar` rule with:

```css
.topbar {
  position: fixed; top: 0; left: 0; right: 0;
  z-index: 60;
  display: flex; justify-content: space-between; align-items: center;
  padding: 12px 32px;
  background: color-mix(in srgb, var(--bg) 85%, transparent);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--rule);
}
```

(The `pointer-events: none` line is removed — the bar is interactive now.)

- [ ] **Step 2: Add the right group and CTA pill**

Next to the existing `.topbar-left` rule at the bottom of the file, add:

```css
.topbar-right { display: flex; align-items: center; gap: 16px; }
.climb-cta {
  display: inline-flex; align-items: center; gap: 8px;
  background: var(--accent);
  color: var(--accent-ink);
  font-family: var(--mono);
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 999px;
  box-shadow: 0 2px 8px var(--shadow-color);
  transition: transform 200ms, filter 200ms, box-shadow 200ms;
}
.climb-cta:hover {
  transform: translateY(-1px);
  filter: brightness(1.08);
  box-shadow: 0 6px 16px var(--shadow-color);
}
.climb-cta .short { display: none; }
@media (max-width: 600px) {
  .climb-cta { padding: 7px 12px; }
  .climb-cta .full { display: none; }
  .climb-cta .short { display: inline; }
}
```

- [ ] **Step 3: Update the header JSX in `app/page.tsx`**

Replace the `<div className="scene-readout">…</div>` block (lines 108–113) with:

```tsx
        <div className="topbar-right">
          <div className="scene-readout">
            <span className="n">{SCENE_NUMS[activeScene] ?? "00"}</span>
            <span className="sep">/</span>
            <span>07</span>
            <span className="label">{SCENE_LABELS[activeScene] ?? "Start"}</span>
          </div>
          <a className="climb-cta" href="#rung-1">
            <span className="full">Start climbing</span>
            <span className="short">Climb</span>
            <span aria-hidden="true">↑</span>
          </a>
        </div>
```

- [ ] **Step 4: Verify**

Run: `npm run build`
Expected: compiles clean. (Visual check happens in Task 7.)

---

### Task 5: Wire metrics + pipeline into the hero, delete RungIndex

**Files:**
- Modify: `app/page.tsx` (imports; hero JSX)
- Delete: `components/RungIndex.tsx`
- Modify: `app/globals.css` (add `.metrics`/`.pipeline` CSS; delete `.rung-index`/`.rix-*` CSS)

- [ ] **Step 1: Update `app/page.tsx` imports**

```tsx
// remove:
import { RungIndex } from "@/components/RungIndex";
// add:
import { HeroMetrics } from "@/components/HeroMetrics";
import { RungPipeline } from "@/components/RungPipeline";
```

- [ ] **Step 2: Update the hero JSX**

Insert `<HeroMetrics />` between the second `.lede` paragraph and the `.note` aside; replace `<RungIndex />` with `<RungPipeline activeScene={activeScene} />`:

```tsx
            <p className="lede">
              I built this because smart people kept asking me how I use AI
              …(unchanged)…
            </p>

            <HeroMetrics />

            <aside className="note">…(unchanged)…</aside>

            <ContextInput value={context} onChange={setContext} />

            <RungPipeline activeScene={activeScene} />
```

- [ ] **Step 3: Delete the old component**

Run: `rm components/RungIndex.tsx`
Then: `grep -rn "RungIndex" app components` — Expected: no matches.

- [ ] **Step 4: Add metrics CSS**

In `globals.css`, where the deleted RungIndex section was (after the CONTEXT INPUT section):

```css
/* ============================================================
   HERO METRICS — honest numbers, editorial dress
   ============================================================ */
.metrics {
  border-top: 1px solid var(--rule-2);
  border-bottom: 1px solid var(--rule-2);
  padding: 22px 0;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 18px;
  max-width: 760px;
}
.metric { display: flex; flex-direction: column; gap: 6px; }
.metric-n {
  font-family: var(--display);
  font-style: italic;
  font-size: clamp(30px, 3.4vw, 44px);
  line-height: 1;
  color: var(--ink);
}
.metric[data-accent] .metric-n { color: var(--accent); }
.metric-label {
  font-family: var(--mono);
  font-size: 10px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--muted);
}
```

- [ ] **Step 5: Add pipeline CSS, delete `.rung-index`/`.rix-*` CSS**

Delete the whole `RUNG INDEX (TOC)` section (`.rung-index` through `.rix-row:hover .rix-name`), plus the `.rix-row`/`.rix-tag` lines inside the 920px media block and the `.rix-*` lines inside the 600px media block. In its place:

```css
/* ============================================================
   RUNG PIPELINE — horizontal connected chips (replaces TOC)
   ============================================================ */
.pipeline-wrap { margin-top: 1vh; }
.pipe-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 14px 0;
  border-top: 1px solid var(--rule-2);
  font-family: var(--mono);
  font-size: 10px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--muted);
}
.pipe-head .lead { color: var(--ink); }
.pipe-head .lead .arrow { color: var(--accent); margin-right: 6px; }
.pipeline {
  display: flex;
  align-items: center;
  padding: 6px 0 18px 0;
  border-bottom: 1px solid var(--rule);
  overflow-x: auto;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
}
.pipeline::-webkit-scrollbar { display: none; }
.pipe-seg { display: flex; align-items: center; flex: 1 0 auto; }
.pipe-seg:last-child { flex: 0 0 auto; }
.pipe-chip {
  display: inline-flex;
  align-items: baseline;
  gap: 7px;
  border: 1px solid var(--rule-2);
  border-radius: 999px;
  padding: 7px 14px;
  text-decoration: none;
  white-space: nowrap;
  transition: border-color 180ms, background 180ms, transform 180ms;
}
.pipe-chip .pipe-num {
  font-family: var(--mono);
  font-size: 10px;
  letter-spacing: 0.14em;
  color: var(--muted);
}
.pipe-chip .pipe-name {
  font-family: var(--display);
  font-style: italic;
  font-size: 17px;
  color: var(--ink);
}
.pipe-chip:hover {
  border-color: var(--pipe-color, var(--accent));
  transform: translateY(-1px);
}
.pipe-chip.active { background: var(--accent); border-color: var(--accent); }
.pipe-chip.active .pipe-num,
.pipe-chip.active .pipe-name { color: var(--accent-ink); }
.pipe-link {
  flex: 1 1 18px;
  min-width: 14px;
  height: 1px;
  background: var(--rule-2);
  margin: 0 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}
.pipe-tick {
  width: 8px; height: 8px;
  border-radius: 999px;
  border: 1px solid var(--rule-2);
  background: var(--bg);
  transition: border-color 160ms, background 160ms, transform 160ms;
}
.pipe-tick:hover {
  border-color: var(--accent);
  background: var(--accent);
  transform: scale(1.3);
}
```

- [ ] **Step 6: Mobile rules**

In the 600px media block (where the `.rix-*` rules were removed), add:

```css
  .metrics { grid-template-columns: repeat(2, minmax(0, 1fr)); row-gap: 20px; }
  .pipe-chip .pipe-name { font-size: 15px; }
```

- [ ] **Step 7: Run all tests + build**

Run: `npm run test:run && npm run build`
Expected: all tests pass, build clean.

---

### Task 6: Product-style card pass (CSS only)

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1: Callouts and seed**

- `.defs` and `.note`: change `border-radius: 3px` → `border-radius: 12px`; add `box-shadow: 0 2px 8px var(--shadow-color);`
- `.seed`: change `border-radius: 2px` → `border-radius: 12px`; add `box-shadow: 0 2px 8px var(--shadow-color);`

- [ ] **Step 2: Fix `.repo-cta` dead variables + card treatment**

In `.repo-cta`: `background: var(--paper)` → `background: var(--bg-soft)`; `border: 1px solid var(--rule-strong)` → `border: 1px solid var(--rule-2)`; add `border-radius: 12px;` and `box-shadow: 0 2px 8px var(--shadow-color);`.
In `.repo-cta:hover`: `background: var(--paper-2)` → `background: var(--bg-soft)`; `transform: translateY(-1px)` → `translateY(-2px)`; add `box-shadow: 0 6px 16px var(--shadow-color);`.

- [ ] **Step 3: Skill + inspiration cards**

- `.skill-card`: `border-radius: 4px` → `12px`; add `box-shadow: 0 2px 8px var(--shadow-color);`
- `.skill-card:hover`: add `box-shadow: 0 6px 16px var(--shadow-color);`
- `.inspo-card`: `border-radius: 4px` → `12px`; add `box-shadow: 0 2px 8px var(--shadow-color);` and `transition` gains `transform 160ms, box-shadow 160ms`
- `.inspo-card:hover`: add `transform: translateY(-2px); box-shadow: 0 6px 16px var(--shadow-color);`
- `.inspo-media`: add `border-radius: 12px 12px 0 0;` (so media doesn't overflow the rounded card top)

- [ ] **Step 4: Buttons**

- `.generate`: add `box-shadow: 0 2px 8px var(--shadow-color);`; `.generate:hover`: add `box-shadow: 0 6px 16px var(--shadow-color);`
- `.generate[data-state="streaming"]`, `.generate[data-state="done"]`: add `box-shadow: none;`
- `.context-hint button:hover`: add `box-shadow: 0 2px 8px var(--shadow-color);`

- [ ] **Step 5: Build check**

Run: `npm run build`
Expected: clean.

---

### Task 7: Local verification, then commit

**Files:** none (verification + commit)

- [ ] **Step 1: Full test suite**

Run: `npm run test:run`
Expected: all suites pass (graph, state, HeroMetrics, RungPipeline).

- [ ] **Step 2: Run the app locally**

Run: `npm run dev` (background), then verify against http://localhost:3000:

- Hero: metrics strip shows 08 / NN / 01 / 00 with mono labels; pipeline shows 8 chips + 2 ticks (4.5, 6.5); old table gone.
- Nav: translucent paper bar with hairline; tint morphs while scrolling scenes; "Start climbing ↑" scrolls to rung 01; Ladder/Tree tabs still work.
- Chips: hover shows per-scene border color; the in-view rung's chip fills accent as you scroll.
- Cards: skill shelf (rung 04), inspiration gallery, seed boxes, repo CTA (rung 06) — 12px corners, soft shadow, hover lift; shadows visible on dark scenes (agents, apis, climax).
- Mobile widths 600px/420px (devtools): metrics 2×2, pipeline scrolls horizontally, CTA reads "Climb ↑".
- `prefers-reduced-motion`: anchor scroll jumps instantly, existing animation opt-outs intact.

- [ ] **Step 3: Show the user / confirm**

Pause for the user to view http://localhost:3000 before committing (explicit user request).

- [ ] **Step 4: Commit (single feature commit)**

```bash
git add app/globals.css app/page.tsx components/HeroMetrics.tsx components/HeroMetrics.test.tsx components/RungPipeline.tsx components/RungPipeline.test.tsx docs/superpowers/plans/2026-07-17-agentic-restyle.md
git rm components/RungIndex.tsx
git commit -m "feat: AGENTIC-inspired landing restyle — nav CTA, hero metrics, rung pipeline, card pass

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```
