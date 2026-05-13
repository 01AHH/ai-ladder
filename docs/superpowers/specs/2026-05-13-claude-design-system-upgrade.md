# Claude Design — System Upgrade Reference

> **Date:** 2026-05-13
> **Source:** Handoff bundle from Claude Design (`claude.ai/design`) at
> `https://api.anthropic.com/v1/design/h/IUAUnW_FbbMDSGOaqCtReQ`
> **Status:** Captured. Implementation pending. Open questions below — read before touching code.
> **Implementation rule from user:** Take **colours and layout only**. Preserve everything in the current site that isn't referenced. Anything new in this design that isn't in the current site, **ask before adding**.

---

## What this is

A scroll-driven, scene-morphing redesign of the AI Ladder. The current site is an editorial single column on warm paper. The new design extends that into a multi-scene experience where the entire palette (background, ink, accent) **smoothly transitions** as the reader scrolls, with each rung occupying its own coloured "room."

The original Tufte/zine voice is preserved, but the medium becomes scene flow rather than newspaper column. Reference point given by the user during the design chat: `superpower.com`-style scroll flow.

## Bundle contents (extracted to `/tmp/ai-ladder-design/learn-to-claude/`)

- `README.md` — handoff instructions
- `chats/chat1.md` — original editorial v1 spec from Claude Design
- `chats/chat2.md` — three pivots (SaaS reject → scroll-flow → bolder palettes + index + literal ladder)
- `project/AI Ladder.html` — final v3 prototype (2266 lines)
- `project/AI Ladder v1 - editorial.html` — preserved v1 for A/B reference
- `project/uploads/` — two pasted screenshots the user uploaded (Dei, Mondly), used as
  inspiration references and then explicitly rejected as "do not do this"

## Design story (compressed)

1. **v1 editorial** — Tufte cream paper, vermillion accent, fixed left rail with ticks, vertical column. Six rungs (later realised seven needed).
2. **v2 scroll-flow** — Pivoted to *Superpower.com* style: full-bleed scenes, page background morphs scene-to-scene via registered CSS custom properties, sticky numerals.
3. **v3 final** — Bolder saturated palettes (deep moss, warm coral, plum, mustard, petrol teal, ink+gold, terracotta), a **rung index TOC** in the hero (clickable, each row has a left bar tinted to its scene's signature colour), and a **literal SVG ladder graphic** pinned to the right edge with a climber that slides between rungs as you scroll.

User's last words on the design: *"this is looking better, can do better contrasting colours like 7 and 6 / can we have the initial intro also help people quickly get to the sections / I also want to feel this page more. can we follow some design down which shows us scrolling down the page."* The final v3 answered all three.

---

## The colour system (verbatim)

Each scene has its own palette applied to `<body>` via a `scene-*` class. Transitions are powered by `@property` registered custom properties with a 900ms `cubic-bezier(.4,0,.2,1)` ease.

### Registered custom properties

```css
@property --bg       { syntax: "<color>"; inherits: true; initial-value: #F2EBDB; }
@property --bg-soft  { syntax: "<color>"; inherits: true; initial-value: rgba(26,22,18,0.04); }
@property --ink      { syntax: "<color>"; inherits: true; initial-value: #1A1612; }
@property --muted    { syntax: "<color>"; inherits: true; initial-value: #6B5F50; }
@property --rule     { syntax: "<color>"; inherits: true; initial-value: rgba(26,22,18,0.18); }
@property --rule-2   { syntax: "<color>"; inherits: true; initial-value: rgba(26,22,18,0.40); }
@property --accent   { syntax: "<color>"; inherits: true; initial-value: #C7421E; }
@property --accent-ink { syntax: "<color>"; inherits: true; initial-value: #1A1612; }
```

### Per-scene palettes

| Scene | Rung | Background | Ink | Muted | Accent | Accent-ink |
|---|---|---|---|---|---|---|
| `scene-hero` | (start) | `#F2EBDB` cream | `#1A1612` | `#6B5F50` | `#C7421E` vermillion | `#FFFFFF` |
| `scene-prompting` | 1 | `#4D6A3A` deep moss | `#F0EBD8` | `#B5C0A0` | `#F0E5A0` pale yellow | `#2A3818` |
| `scene-vibe` | 2 | `#DD7A3E` warm coral | `#2A1408` | `#6E3618` | `#14213D` deep navy | `#F2EBDB` |
| `scene-agents` | 3 | `#3D2858` plum | `#E2D8F0` | `#9E8FBC` | `#F2C8C0` blush | `#14110D` |
| `scene-repo` | 4 | `#C99A1E` mustard saffron | `#2A1A06` | `#6B4818` | `#2A1A06` deep brown | `#F0E5C0` |
| `scene-apis` | 5 | `#1F5266` petrol teal | `#D8E6EC` | `#7AA0AC` | `#E07B3E` ember | `#14110D` |
| `scene-climax` | 6 | `#14110D` ink black | `#F2EBDB` | `#998D78` | `#E5A642` gold | `#14110D` |
| `scene-integrated` | 7 | `#D67054` terracotta | `#2A1208` | `#6B3220` | `#14110D` ink | `#F2EBDB` |
| `scene-step` | (close) | `#F2EBDB` cream | `#1A1612` | `#6B5F50` | `#C7421E` vermillion | `#F2EBDB` |

### Transition behaviour

```css
body {
  transition:
    --bg 900ms cubic-bezier(.4,0,.2,1),
    --bg-soft 900ms cubic-bezier(.4,0,.2,1),
    --ink 900ms cubic-bezier(.4,0,.2,1),
    --muted 900ms cubic-bezier(.4,0,.2,1),
    --rule 900ms cubic-bezier(.4,0,.2,1),
    --rule-2 900ms cubic-bezier(.4,0,.2,1),
    --accent 900ms cubic-bezier(.4,0,.2,1),
    --accent-ink 900ms cubic-bezier(.4,0,.2,1);
}
```

Scene class is toggled via JS on scroll: pick the element whose center is closest to viewport center at 40% viewport height.

---

## Type system

```css
--display: "Instrument Serif", "Times New Roman", serif;
--sans:    "Inter", system-ui, sans-serif;
--mono:    "JetBrains Mono", ui-monospace, Menlo, monospace;
```

Note: **Inter replaces Source Serif** as the body font in this version. The current site uses Source Serif 4. Decision needed.

Hierarchy:
- Hero h1: `clamp(56px, 9.2vw, 132px)`, Inter 800
- Rung numeral: `clamp(180px, 24vw, 320px)`, Instrument italic
- Rung name: `clamp(40px, 5.2vw, 72px)`, Inter 800 with italic `<em>` colour-shifted to accent
- Bridge line: `clamp(36px, 5.2vw, 64px)`, Instrument italic
- Body: 17px / 1.55 Inter

---

## Layout system

### Persistent chrome

- **Topbar (fixed, top)** — `THE AI LADDER.` mark on left + scene readout `XX / 07 · LABEL` on right
- **Side ladder viz (fixed, right edge)** — Literal SVG ladder with 9 crossbars (hero, 7 rungs, step). A "climber" bar with two end-cap dots slides between bars as the active scene changes. Hidden below 1100px.

### Scene shell

```css
.scene {
  position: relative;
  min-height: 100vh;
  padding: 16vh 0 12vh 0;
}
.scene-inner {
  max-width: 1240px;
  margin: 0 auto;
  padding: 0 6vw;
}
```

### Bridges between scenes

Between every scene is a `<div class="bridge">` containing a small uptag (`↑ RUNG TWO`) and a large italic Socratic line. The bridge sits in its own scroll position so the palette transitions while reading it.

```css
.bridge { padding: 14vh 0 16vh 0; text-align: center; }
.bridge .line {
  font-family: var(--display);
  font-style: italic;
  font-size: clamp(36px, 5.2vw, 64px);
  max-width: 22ch;
  text-wrap: balance;
}
```

### Rung scene (asymmetric two-column)

```css
.rung .scene-inner {
  display: grid;
  grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.15fr);
  gap: clamp(40px, 6vw, 96px);
  align-items: start;
}
.rung-stage {
  position: sticky;       /* numeral pins while body scrolls */
  top: 16vh;
  align-self: start;
}
```

Left column (sticky) holds the meta, oversized numeral, name, and tool chips. Right column scrolls with the definition, seed, generate button, and stream.

### Hero rung-index (TOC)

Below the context input. Seven rows, each with:
- Column 1 (60px): mono number `01`
- Column 2 (1fr): Instrument-italic rung name
- Column 3 (1.4fr): one-line tag
- Column 4 (36px): hover-animated arrow `↗`

Each row has a 4px-wide left bar tinted to its scene colour via inline `style="--rix-color: #4D6A3A;"`. On hover the bar widens to 8px, the row inset increases, and the name + arrow shift to that scene's colour.

### Climax scene

```css
.climax .scene-inner {
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
  gap: clamp(48px, 7vw, 120px);
}
.climax .rung-numeral {
  font-size: clamp(220px, 30vw, 420px);
  margin-left: -0.06em;   /* bleeds left */
}
```

Right side replaces the seed with a "skill shelf" — three stacked `.skill-card`s, each with a top row (`SKILL · 01` tag + monospace name) and a trigger description prefixed with `FIRES WHEN`. The generate button outputs a styled `.skill-file` with a coloured header bar and monospace body, not a plain paragraph.

---

## What's NEW in this design (decisions needed)

Below are things the new design introduces that **don't exist in the current site**. Per the user's instruction, none of these should be added without explicit approval.

1. **Per-rung palette scenes.** Each rung gets its own background colour, not just the climax. The whole page morphs.
2. **Bridges between rungs.** A separate scroll section between every rung with a Socratic italic line (`What if it had hands?`, etc.). The current site has bridge hooks in data but doesn't render them as full-page beats.
3. **Rung index in the hero.** A clickable seven-row TOC under the context input with each row tinted to its scene colour.
4. **Literal SVG ladder graphic on the right.** Two rails + nine crossbars + a sliding climber bar. Replaces the current left-rail tick pattern.
5. **Sticky numerals.** Numeral pins to the top of the viewport while the body content scrolls past it.
6. **Tool chips on each rung.** Pill-shaped chips listing the tools (`Claude Code`, `Cursor`, `your terminal`). Currently rendered as plain text in the definition.
7. **Hero subtitle uses Inter 800 with italic display `<em>`** for "climb." Current hero uses Instrument italic only.
8. **Inter as the body font** (replacing Source Serif 4 in body copy). Display + mono fonts unchanged.
9. **Coloured generate buttons** — `background: var(--accent); color: var(--accent-ink);` (filled pill). Current site uses transparent text-with-arrow.
10. **"Generate my skill" outputs a styled file**, not a paragraph. The climax stream becomes a header-bar `.skill-file` with mono body, not a regular `.stream`.
11. **Topbar scene readout** — `04 / 07 · REPO STRUCTURE` updates live as you scroll.
12. **Skip-style "↳ try" example pills** under the context input that pre-fill the textarea.
13. **Status indicator on context input** — `UNREAD` / `FILED` colour-shifted by state.
14. **Step list rendered as the final scene** (`#step`) — currently exists but as a regular section, not its own coloured scene.
15. **Tweaks panel** (accent swatches, density toggle, italic on/off, intensity bold/soft). User's saved preferences from the design tool: `accent: "#B8852A"`, `density: "compact"`, `italics: true`. Optional dev affordance.

## What's in the current site but NOT referenced in the new design

These should be **preserved** since the rule is "don't remove things just because the new design didn't include them."

- **Inspiration galleries per rung** (`InspirationGallery` component, `content/inspiration.ts` with image/video/YouTube/Loom support) — entirely absent from the new design.
- **The `<details>` essay block** on rung 4 (Repo structure) showing the full "Context Is the Compound Interest of AI" essay — absent from new design.
- **Open-source colophon line** (the "MIT licensed, fork it, bring your own key" footer wink) — the new design's footer is shorter and doesn't carry this language.
- **Rate-limiting copy** in the API error path ("Try again in Xh, or clone the repo and run it yourself with your own key") — backend behaviour only.

## What matches between current and new

- Seven rungs in the same order
- Knowledge systems / Skills as the dark climax at rung 6
- Streaming generate button on every rung
- Context input at the top
- "Now pick one" step list at the bottom
- Footer with "the repo is the content" wink

---

## Component mapping (from chat1 — for the Next.js port)

```
.context block      → ContextInput.tsx
.rung section       → Rung.tsx (props: index, name, definition, seed, variant)
.stream + streamer  → StreamedOutput.tsx
ladder-viz SVG      → new LadderViz.tsx
rung-index nav      → new RungIndex.tsx (lives in hero)
.bridge             → new Bridge.tsx (one per rung pair)
scene class swap    → effect in app/page.tsx using IntersectionObserver
@property colours   → globals.css
```

---

## Open questions for the user before implementing

Save these for the implementation session. Don't guess.

1. **Adopt the per-scene palette morph?** This is the single biggest visual change. The current site is editorial-cream throughout (with one dark-mode climax). The new design treats every rung as its own coloured room. Adopt fully, or adopt only the climax + transitions and keep cream for the others?
2. **Swap Source Serif body font for Inter?** Big typography shift. Editorial → modern-magazine.
3. **Render bridges as full-bleed beats between rungs?** Today the bridges are hooks stored in `Rung.bridgeTarget` but never rendered as their own scroll-beats. The new design makes them load-bearing.
4. **Add the literal SVG ladder + climber on the right?** Replaces or augments the current `LeftRail` tick column.
5. **Add the rung-index TOC in the hero?** Useful navigation, makes the page legible before scrolling. New surface area.
6. **Make the climax output a styled skill file** instead of a paragraph? Backend prompt change required.
7. **Add tool chips on each rung?** Small but visible addition.
8. **Filled-pill generate buttons?** Visual identity shift; current is minimal text.
9. **Topbar scene readout?** Adds a fixed top chrome element.

## Files to reference when implementing

- `/tmp/ai-ladder-design/learn-to-claude/project/AI Ladder.html` — the prototype, full source
- `/tmp/ai-ladder-design/learn-to-claude/project/AI Ladder v1 - editorial.html` — v1 fallback
- `/tmp/ai-ladder-design/learn-to-claude/chats/chat1.md` — original design direction
- `/tmp/ai-ladder-design/learn-to-claude/chats/chat2.md` — iteration to v3

> The `/tmp/` location is volatile across reboots. If we wait long to implement, copy the bundle into `docs/design-handoff-2026-05-13/` first.
