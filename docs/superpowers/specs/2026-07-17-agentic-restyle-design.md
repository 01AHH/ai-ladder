# AGENTIC-inspired landing page restyle — design

**Date:** 2026-07-17
**Status:** Approved in brainstorming; pending spec review
**Scope:** Landing page (`app/page.tsx`) only. The `/tree` page is untouched.

## Context

The landing page is a warm editorial scroll-story: paper background, Instrument Serif
italics, scene-morphing palettes driven by `body.scene-*` classes. The reference is the
v0 "AGENTIC" template (https://v0-modern-agentic.vercel.app) — a modern minimal
AI-platform landing page with a metrics hero, product cards, workflow pipeline, and a
sticky nav with a strong CTA.

Chosen direction (from three mocked options): **keep the editorial identity, borrow
AGENTIC's structure.** Four ingredients were selected: metrics strip, product-style
cards, workflow pipeline, real nav bar. Explicitly rejected: live/status touches
(pulsing dots, LIVE badges), full light-SaaS restyle, dark platform look.

## Goals

- The page reads as a more "designed product" while keeping its editorial soul.
- Consolidate hero navigation: the pipeline replaces the RungIndex table.
- Everything continues to work with the scene-morphing palette variables.

## Non-goals

- No changes to: scene palettes, typography, copy, scroll-story structure, streaming
  demos, footer, `/tree` page, LadderViz.
- No fake SaaS metrics (uptime, task counts).

## Design

### 1. Nav bar (upgrade of `.topbar`)

The fixed topbar becomes a real sticky nav, interactive (today it is largely
`pointer-events: none`):

- **Background:** current scene `--bg` at ~85% opacity with `backdrop-filter: blur(8px)`
  and a bottom hairline in `--rule`. It morphs with the scene like everything else.
- **Left:** existing `TabNav` (Ladder/Tree) + "THE AI LADDER." mark, unchanged.
- **Right:** existing scene readout (kept), plus a new **"Start climbing ↑"** pill —
  accent-filled (`--accent`/`--accent-ink`), mono uppercase, scrolls smoothly to
  `#rung-1`.
- **Mobile (≤600px):** mark hidden (as today), readout compact (as today), CTA pill
  shrinks to "↑ Climb".

### 2. Metrics strip in the hero

A new `HeroMetrics` component rendered between the ledes and the `.note` callout.
Editorial styling: top/bottom rules like `.context`, serif italic numerals
(`--display`), mono uppercase labels (`--mono`), no boxes or shadows.

Metrics (computed from `content/rungs.ts` at render, no hardcoding):

| Numeral | Label |
|---|---|
| `08` | rungs to climb |
| `NN` | tools mapped — count of **distinct** strings across all `rungs[].tools` |
| `01` | step at a time |
| `00` | tracking |

Four metrics on desktop in a single row; 2×2 grid at ≤600px.

### 3. Pipeline replaces RungIndex

- Delete the `RungIndex` component and its `.rung-index`/`.rix-*` CSS.
- New `RungPipeline` component in its place in the hero: a horizontal strip of pill
  chips — `01 Prompting ─ 02 Vibe coding ─ … ─ 08 Integrated` — joined by hairline
  rules (`--rule-2`).
- **Chips:** only the 8 integer-numbered rungs. Sub-rungs (4.5 session limits,
  6.5) render as small tick marks on the connector after their parent chip, with
  tooltips (title attribute) naming them. Chips link to the existing `#rung-N` anchors.
- **Active state:** the chip whose `sceneKey` matches `activeScene` (state already in
  `page.tsx`) fills with `--accent`/`--accent-ink`. `page.tsx` passes `activeScene`
  down.
- **Per-scene hover color:** reuse the `SCENE_COLOR` map from `RungIndex` (move it to
  the new component) for chip hover borders, preserving the current table's colored
  personality.
- **Mobile:** the strip becomes horizontally scrollable (`overflow-x: auto`, no
  wrapping), with scroll snapping on chips and hidden scrollbar.
- The one-line taglines from the old table (`TAGS` map) are dropped from the hero;
  the same information already exists inside each rung section (`rung-plain`,
  `rung-def`). Nothing else references `RungIndex`.

### 4. Product-style card pass (CSS only)

Applied to `.skill-card`, `.inspo-card`, `.seed`, `.repo-cta`, `.defs`, `.note`:

- Corner radius: 12px (from the current 2–4px).
- Ambient shadow: `0 2px 8px` using the scene ink at low opacity. Implemented via a
  new palette token `--shadow-color` (a `<color>`) registered with `@property` and defined per scene
  (dark scenes get a slightly stronger value so the shadow reads on saturated
  backgrounds).
- Hover (interactive cards only — `.skill-card`, `.inspo-card`, `.repo-cta`):
  `translateY(-2px)`, border-color `--accent`, shadow deepens to `0 6px 16px`.
- `.generate` button and `.context-hint` pills gain the same shadow/hover language.
- The accent left-border (3px) on `.seed`, `.repo-cta`, `.defs`, `.note` is kept —
  it is part of the editorial voice.

Note: `.repo-cta` currently references undefined variables `--paper`/`--paper-2`/
`--rule-strong` (a leftover from an older token set). The card pass fixes these to
`--bg-soft`/`--rule` equivalents.

## Files touched

- `app/globals.css` — nav, metrics, pipeline, card pass; delete `.rix-*` block; add
  `--shadow-color` token to `@property` registrations, `:root`, and every `body.scene-*`.
- `app/page.tsx` — render `HeroMetrics` + `RungPipeline` (passing `activeScene`),
  remove `RungIndex`, add CTA pill to the topbar.
- `components/HeroMetrics.tsx` — new.
- `components/RungPipeline.tsx` — new (absorbs `SCENE_COLOR`).
- `components/RungIndex.tsx` — deleted.

## Testing

- Unit (vitest, jsdom): `RungPipeline` renders one chip per integer rung with the
  right anchors, marks the active chip from the `activeScene` prop, renders tick
  marks for sub-rungs; `HeroMetrics` computes the distinct tool count from a fixture
  and from the real content module.
- Manual: scroll the page across all scenes to confirm the nav blur/tint and card
  shadows track the palette morph; check 600px and 420px widths (pipeline scroll,
  metrics 2×2, CTA "↑ Climb"); confirm `prefers-reduced-motion` still disables the
  animated bits; run `npm run build`.

## Error handling

Pure presentational change; no new data or network paths. The only computation
(distinct tool count) operates on static content and cannot fail at runtime.
