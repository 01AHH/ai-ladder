# INTERFACE dark mode — design

**Date:** 2026-07-17
**Status:** Approved in brainstorming; pending spec review
**Scope:** Landing page only. `/tree` is untouched. Light mode (the editorial page,
including this morning's AGENTIC restyle) is untouched.

## Context

The user wants a full dark rebrand modeled on the v0 "INTERFACE" template
(https://v0.app/templates/interface-XhGK3naSZPB — dark minimalist agency landing:
Solari/split-flap H1, custom cursor interactions, animated text, GSAP), delivered
**as a dark mode that changes the whole layout**, not a palette swap. The warm
editorial page remains as light/"paper" mode.

Decisions made during brainstorming:

- **Default:** follow `prefers-color-scheme`; a nav toggle overrides, persisted.
- **Dark structure:** kinetic grid one-pager (INTERFACE-faithful) — chosen over a
  dark-dressed scroll story or a hybrid. No 8-scene scroll in dark mode.
- **Content:** full parity. Every rung's content is reachable in dark mode.
- **Motion:** hand-rolled (CSS + WAAPI/rAF + IntersectionObserver). No GSAP —
  ~30kB dependency for effects CSS can do.

## Goals

- Dark mode reads as its own brand: near-black, mono-first, kinetic.
- One content source (`content/rungs.ts` etc.); two presentations, zero duplication.
- Reuse the existing interactive components (streaming demo, context input,
  inspiration gallery, essays) inside the dark panels.

## Non-goals

- No changes to light mode, `/tree`, content files, or the API route.
- No GSAP or other new runtime dependencies.
- No dark variant of the LadderViz/pipeline (they are light-mode furniture; the
  grid *is* dark mode's navigation).

## Design

### 1. Theme system

- `useTheme()` hook (new, `lib/useTheme.ts`): returns `{ theme, setTheme }`.
  Initial value: `localStorage["ladder-theme"]` if set, else
  `matchMedia("(prefers-color-scheme: dark)")`. Setting persists to localStorage
  and toggles the `theme-dark` class on `<html>`. Listens for system-pref changes
  only while no explicit override is stored.
- Flash prevention: a small inline `<script>` in `app/layout.tsx` (before
  hydration) reads localStorage/system pref and sets `theme-dark` on `<html>`.
- `app/page.tsx` becomes a thin switch:
  `theme === "dark" ? <InterfacePage/> : <EditorialPage/>`. The current page JSX
  (header, scenes, footer, scene-scroll effect) moves verbatim into
  `components/EditorialPage.tsx`. Scene-scroll body-class effects run only in
  light mode; dark mode sets a single static `scene-hero`-equivalent (no morphing).

### 2. Dark visual language

- Base `#0A0A0B`; panels `#161618`; hairlines `#2A2A2E`; text `#F5F5F2` /
  `#8B8B88` muted.
- Accent: `#E05B2B` (the editorial `#C7421E` heated up for contrast on black);
  per-rung hover hues reuse the existing `SCENE_COLOR` map values brightened
  (defined as a static map in CSS, one class per sceneKey).
- Type: JetBrains Mono for headings/labels (uppercase, tracked); Inter for body.
  Instrument Serif appears only in panel pull-quotes (seed examples) as a wink to
  paper mode.
- All dark styles live in `app/interface.css`, imported from `app/layout.tsx`,
  every rule namespaced under `html.theme-dark`.

### 3. Dark page structure (`InterfacePage`)

Top to bottom, one viewport-ish sections, no scroll story:

1. **Nav** — same `.topbar` markup, dark-dressed via namespace; the scene readout
   is replaced (dark mode has no scenes) by the **mode toggle**: a two-state
   switch labeled `PAPER ○ / INTERFACE ●`. The toggle also renders in light mode
   next to the scene readout.
2. **Hero** — `SplitFlap` H1 cycling POSSIBLE → PROMPT → BUILD → DELEGATE → CLIMB;
   static one-line lede beneath; the existing `ContextInput` (dark-dressed) since
   it feeds every panel demo.
3. **Rung grid** (`RungGrid`) — 8 cells in a 4×2 grid (2×4 on tablet, 1-column
   accordion on mobile). Sub-rungs 4.5/6.5 render as slim full-width rows after
   their parent's row. Cell: number, mono uppercase name, one-line plain text,
   per-rung hue on hover. Click expands one `RungPanel` (accordion — opening a
   cell closes the previous; panel animates height + staggered content reveal).
4. **Expanded panel** (`RungPanel`) — full parity with a light-mode rung section:
   plain line, definition, tool chips, seed example (serif pull-quote), essay in
   `<details>`, skill shelf (Skills rung), media image, streaming generate demo
   (reusing the same generate/stream components and API as light mode), and the
   inspiration gallery on the Integrated rung. The rung's Socratic bridge line
   closes the panel as flavor text. A "read this rung on paper →" link switches
   to light mode and deep-links to `#rung-N`.
5. **Footer** — existing colophon, dark-dressed, plus one line noting the two
   modes.

### 4. Motion (hand-rolled)

- **SplitFlap** — each character is a flap; cycling runs a per-character 3D
  flip (CSS transform + transition) through intermediate characters to the
  target word, staggered left-to-right; word list cycles every ~3.5s. Under
  `prefers-reduced-motion`: renders the first word statically, no cycling.
- **Reveals** — panel/grid content fades+rises (staggered `translateY`/opacity)
  driven by IntersectionObserver and panel-open events; instant under reduced
  motion.
- **ModeCursor** — dark mode + `(pointer: fine)` only: a small dot/ring following
  the cursor (rAF), swelling into a "CLIMB ↗" chip over grid cells. Hidden
  otherwise; native cursor never fully disabled (`cursor: none` only over the
  grid, restored elsewhere).

### 5. Architecture / files

- Create: `lib/useTheme.ts`, `components/EditorialPage.tsx` (moved JSX),
  `components/interface/InterfacePage.tsx`, `SplitFlap.tsx`, `RungGrid.tsx`,
  `RungPanel.tsx`, `ModeCursor.tsx`, `app/interface.css`.
- Modify: `app/page.tsx` (thin theme switch), `app/layout.tsx` (inline theme
  script + css import), `app/globals.css` (toggle styles for light mode nav).
- Reused unchanged: `ContextInput`, `StreamedOutput`, `InspirationGallery`,
  generate/stream logic (currently inlined in `Rung.tsx` around lines 109–201:
  fetch to `/api/generate`, stream state, `StreamedOutput` render). Extract it
  into a shared `components/GenerateDemo.tsx` used by both `Rung` and
  `RungPanel`, so both pages share one implementation.

### 6. Testing

- Unit (vitest/jsdom): `useTheme` — system-pref initial, override persists,
  stored value wins on next load; `SplitFlap` — renders target word, honors
  reduced motion (static render); `RungGrid`/`RungPanel` — 8 cells + 2 sub-rows,
  one panel open at a time, expanded panel contains the rung's definition, all
  tool chips, and the generate button for every rung (loop over content).
- Manual: both modes × toggle both ways × reload persistence; system-pref
  default with no stored override; streaming demo inside a panel end-to-end;
  mobile 1-column accordion without custom cursor; reduced-motion pass;
  `npm run build`.

## Error handling

Theme read/write wrapped in try/catch (private-mode localStorage). All other
paths reuse existing, already-hardened components (streaming error states carry
over with them).
