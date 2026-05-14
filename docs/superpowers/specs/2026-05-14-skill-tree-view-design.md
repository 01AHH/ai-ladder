# Skill Tree View — Design Spec

> **Date:** 2026-05-14
> **Status:** Approved for planning
> **Author:** Arthur, with Claude (brainstorming session)

## 1. Context

The current AI Ladder site (`/`) is a scroll-driven essay with 8 rungs. It works for readers who want the long-form. It does not work for visitors who:

- Want a glanceable map of "what's actually possible with AI."
- Respond to game-like, interactive surfaces more than to long-form prose.
- Want to self-assess: "where am I on the ladder, what's next?"

This spec defines a **second view** of the same domain — a skill-tree page that visualises capabilities as nodes in a graph, lets visitors click any node for a definition + learning path + resources, and lets them mark nodes "climbed" locally.

## 2. Scope

**In scope (v1):**

- New route `/tree` rendering the skill tree.
- Tab nav (Essay / The tree) at the top of both `/` and `/tree`.
- 12-node graph with 4-region layout and edge typing.
- Side panel that opens on node click with full content per node.
- Soft-gating with `localStorage`-backed "climbed" state.
- Full mobile layout with drag-to-pan.
- New content authored for 6 new nodes (see §11).

**Out of scope:**

- Modifications to the existing essay at `/`. The essay stays exactly as it is.
- Server-side state, accounts, sync between devices.
- Sharing / "show me your tree" social features.
- Animation beyond simple glow / hover transitions.
- Right-to-left or non-English content.

## 3. Routing & navigation

Two top-level routes:

```
/        → existing essay (unchanged)
/tree    → new skill-tree view
```

A **tab pill** sits in the top-left of both routes:

```
┌──────────────────────┐
│  Essay │ The tree │  ← pill, active state pulled from current route
└──────────────────────┘
```

- Same component on both pages.
- Active tab uses warm-gold fill (`#c5b572` at 22% alpha), inactive is dim.
- On `/tree`, the pill sits on the dark stage; on `/`, it sits on warm paper. Same component, theme-aware variants.

The existing wordmark `THE AI LADDER.` and scene readout (`{n}/07 {label}`) on `/` stay where they are. The tab pill goes next to or just under the wordmark — exact placement to be decided in implementation.

## 4. Aesthetic system

**Mood:** dark cosmic, AAA-game polish, hex nodes, glow on the active node, gold accent for cluster lines, color-coded regions. Synthesised from four reference images supplied by the author (Diablo-style hex grid, Orion data viz, Star Wars Jedi: Fallen Order skill tree, generic hub-and-spoke skill wheel).

**Palette:**

| Token | Value | Use |
|---|---|---|
| `--stage-bg` | radial gradient `#1a1d2e → #0d0f1c → #050610` | Stage background |
| `--starfield` | layered 1px radial gradients of `#fff` / `#fff7c2` / `#c2d4ff` / `#ffd76b` | Decorative star dots |
| `--gold` | `#c5b572` | Warm accent, technical-branch lines, tab pill active, button borders |
| `--blue` | `#6db1ff` | Non-technical branch stroke |
| `--orange` | `#ff8c5a` | Critical-learn cluster stroke |
| `--purple` | `#b07dff` | Skills' bridges to branches (dashed) |
| `--text` | `#e8e6f5` | Body text |
| `--text-strong` | `#f5efd1` | Names, headings |
| `--done` | `rgba(125,242,168,0.18)` fill, green stroke | "Climbed" state |

**Typography (reuse from current site):**

- `Instrument Serif` italic — node labels, panel headings.
- `JetBrains Mono` — region labels, meta rows, chips, buttons.
- `Inter` — panel body copy.

**Node visual:**

- Regular hexagon, 2.2px stroke in the region's branch colour, dark `#14172a` fill.
- States:
  - **Default** (available): branch stroke, dark fill.
  - **Climbed**: light-green fill tint + green stroke.
  - **Next-recommended**: warm-cream fill tint + drop-shadow glow.
  - **Locked**: same colours at 0.35 stroke opacity.
- New nodes (content not yet written): dashed border in addition to state styling; this is for the *editing* phase only and is removed before launch.

**Edge styling:**

- Solid in the region's branch colour = required progression.
- Dashed orange = sibling cross-link inside the cluster (Skills ↔ Superpowers ↔ Memory ↔ Knowledge).
- Dashed purple = bridge from cluster into a branch (Skills' reach into both routes).

## 5. Tree structure

12 nodes across 4 regions, 1 root.

### 5.1 Nodes

| ID | Label | Region | New? | Notes |
|---|---|---|---|---|
| `prompting` | Prompting | root | no | Shared start. |
| `cowork` | Claude Cowork | non-technical | **NEW** | Subtitle: *(Claude.ai Projects)* |
| `scheduling` | Scheduling | non-technical | **NEW** | Claude Code scheduled tasks, non-tech access. |
| `connectors` | Connectors | non-technical | **NEW** | Non-technical equivalent of APIs. |
| `skills` | Skills | cluster | no | Central hub. Existing copy needs minor adaptation. |
| `superpowers` | Superpowers | cluster | **NEW** | The framework / skill library concept. |
| `memory` | Memory | cluster + technical | no | Pure cluster node; bridges into technical branch via edges. |
| `knowledge` | Knowledge | cluster | **NEW** | What Superpowers + Memory converge into. |
| `vibe` | Vibe coding | technical | no | |
| `agents` | Coding agents | technical | no | |
| `repo` | Repo | technical | no | Existing Rung 06.5 (CLAUDE.md) folds in as a panel sub-detail. |
| `apis` | APIs | technical | no | |
| `cron` | Cron & scripts | technical | **NEW** | Engineering ops node. |
| `integrated` | Integrated systems | technical | no | Subtitle: *(knowledge-based systems)* |

**Total: 14 nodes.** (Mid-brainstorming I miscounted at 12 — the correct number is 14: 1 root + 3 non-technical + 4 cluster + 6 technical.)

### 5.2 Edges

Solid edges (required progression):

```
prompting → cowork
prompting → vibe
prompting → skills              (root → cluster)

cowork → scheduling             (non-tech spine)
scheduling → connectors

vibe → agents                   (tech spine)
agents → repo
repo → apis
repo → cron
apis → integrated
cron → integrated
```

Cluster cross-links (solid orange — the cluster is a diamond, no horizontal cross-cut):

```
skills → superpowers
skills → memory
superpowers → knowledge
memory → knowledge
```

Bridge edges (dashed purple):

```
superpowers ⇢ cowork            (cluster reach into non-tech)
memory ⇢ agents                 (cluster reach into tech)
memory ⇢ repo                   (cluster reach into tech, secondary)
knowledge ⇢ integrated          (cluster terminus connects to tech terminus)
```

### 5.3 Region map

- **Non-technical** (blue): cowork, scheduling, connectors
- **Cluster** (orange): skills, superpowers, memory, knowledge
- **Technical** (gold): vibe, agents, repo, apis, cron, integrated
- **Root** (cream): prompting

## 6. Node states

Each node is in exactly one state at render time:

| State | Visual | Behaviour |
|---|---|---|
| `available` | Default stroke + dark fill | Clickable. Panel opens. |
| `climbed` | Green tint, green stroke | Clickable. Panel shows "Mark as un-climbed". |
| `next` | Warm-cream tint + glow | Clickable. Same as available, but visually emphasised. |
| `locked` | 0.35 stroke opacity | **Clickable** (per author decision §7). Panel opens with a soft hint at the top. |

**Computing state from `climbed` set:**

```
state(node, climbedSet):
  if node in climbedSet:           return 'climbed'
  if all prereqs(node) in climbed: return 'next' if recommended, else 'available'
  if any prereqs(node) missing:    return 'locked'
```

"Recommended next" is the **first** node by region traversal priority (root → tech → non-tech → cluster) whose prereqs are all met. There is always at most one `next` node visible at a time.

## 7. Gating behaviour

**Soft hint with full content access.** Locked nodes are fully clickable; clicking opens the panel like any other node. The panel includes an extra hint card at the top:

```
┌─────────────────────────────────────────┐
│  ⚠  This rung is easier if you've       │
│     climbed [Coding agents] first.      │
│     [ Jump to Coding agents → ]         │
└─────────────────────────────────────────┘
```

- The hint names the *closest unmet prereq* (not all unmet prereqs).
- "Jump to X" highlights and centres node X in the tree, does not auto-open its panel.
- The hint is dismissable for the session via an X (uses `sessionStorage`, not `localStorage` — author's stated preference is that locked rungs should always be fully readable, but the hint is itself optional).

## 8. Side panel

Opens on node click. Slides in from the right (desktop) or rises from the bottom (mobile).

### 8.1 Sections

In order:

1. **Crumb:** `↑ Rung XX of YY` (font: mono, gold) — *XX is the node's numeric index in its region order, YY is region size.*
2. **Name:** large italic serif with trailing period — e.g., *Skills.*
3. **Tag:** italic serif, secondary colour — e.g., *Behaviour you can install.*
4. **Meta row:** mono caps — `~time to learn` + `Region · branch name` with a coloured dot.
5. **Chips:** tools / tech the rung touches (1-4 chips).
6. **(Locked only) Hint card** — see §7.
7. **§ What it is** — 2-4 sentence definition. Body copy in `Inter`. Supports `*italic*` and `**bold**` via simple markdown.
8. **↑ How to learn it** — ordered list, 2-4 numbered steps. Concrete: "Open X. Do Y. Watch Z fire."
9. **⌁ Resources** — list of external links. Each row: `[source-tag] · [title] · [↗ or ↓ icon]`. Source tags: `github`, `docs`, `video`, `essay`, `talk`. The `essay` source links to the corresponding section on `/` if one exists.
10. **Actions** — 2-button row: **Mark as climbed** (primary, warm-gold fill) and **Read the essay** (secondary outline, hidden for new nodes that have no essay counterpart yet).
11. **Footer note:** `progress saved locally · nothing leaves your browser` (mono, dim).

### 8.2 Close behaviour

- Click outside panel: closes.
- ESC key: closes.
- Click the same node again: closes.
- Panel state does not survive route changes.

### 8.3 "Read the essay" cross-link

Links to the corresponding rung anchor on `/`, e.g. `/#agents`, `/#skills`. For nodes that don't exist in the essay (the 6 new ones), this button is omitted.

## 9. Self-assessment

**Storage:** `localStorage` key `ai-ladder:climbed`, value = JSON array of node IDs.

```ts
type ClimbedState = string[]; // e.g. ["prompting", "vibe", "agents"]
```

**API:**

```ts
function getClimbed(): Set<string>;
function isClimbed(id: string): boolean;
function climb(id: string): void;
function unclimb(id: string): void;
function resetTree(): void;  // exposed in a footer "reset progress" link
```

**No server.** The footer message in the panel makes this explicit: *"progress saved locally · nothing leaves your browser"*. A small "reset progress" link at the bottom of the page clears the key.

## 10. Mobile

Mobile is **not** a static "best on desktop" fallback. It's a full layout with drag-to-pan.

**Layout:**

- Stage fills the viewport.
- Tree is rendered at its native 1400×660 SVG viewBox, scaled to fit-width on first paint.
- User can pinch-zoom (in supported browsers) and drag-pan to navigate.
- Initial centre: the `prompting` root, scrolled into view.

**Pan implementation:**

- Wrap the SVG in a positioned div. Track `(panX, panY, scale)` in component state.
- Touch handlers: `touchstart` → record origin; `touchmove` → update transform; `touchend` → settle.
- Boundary clamping: don't let the user pan the tree fully off-screen — clamp to a 200px overflow allowance on each side.
- Use `transform: translate(panX, panY) scale(scale)` on the SVG container, hardware-accelerated.

**Side panel on mobile:**

- Slides up from the bottom (not the right).
- Takes ~75% of viewport height; remaining 25% is the dimmed tree.
- Drag down to dismiss.

**Tab pill on mobile:**

- Stays in the top-left, smaller (40px height).
- Sticky to viewport so it's reachable while panning.

## 11. New content to write

The author commits to writing fresh content for 6 nodes. The tree ships behind a `comingSoon` flag on these nodes if any are unwritten at launch — they render but the panel shows a "Coming soon · author's note" placeholder instead of full content.

| Node | What to write |
|---|---|
| `cowork` | Definition · how to learn it (3 steps) · 3-5 resources · time-to-learn estimate · tool chips |
| `scheduling` | Same shape |
| `connectors` | Same shape |
| `superpowers` | Same shape; reference the `obra/superpowers` repo as a resource |
| `knowledge` | Same shape; will be the most conceptual node |
| `cron` | Same shape; engineering-ops framing |

Each node's content lives in `content/tree-nodes.ts` as a typed object — see §13.

## 12. Component architecture

New files (proposed):

```
app/
  tree/
    page.tsx                    # /tree route
  layout.tsx                    # existing, may grow a tab pill component
components/
  tree/
    Stage.tsx                   # background, starfield, pan/zoom wrapper
    TreeGraph.tsx               # the SVG, nodes + edges
    HexNode.tsx                 # single hex node (memo'd)
    Edge.tsx                    # single edge path
    SidePanel.tsx               # right-slide (desktop) / bottom-sheet (mobile) panel
    PanelContent.tsx            # the 11 sections from §8
    LegendBar.tsx               # bottom legend
    TabNav.tsx                  # Essay / The tree pill (shared between routes)
    ResetProgress.tsx           # small footer link
content/
  tree-nodes.ts                 # the typed data — see §13
lib/
  tree/
    state.ts                    # localStorage helpers
    graph.ts                    # node/edge data + computed helpers (prereqs, state(), etc.)
    mobile-pan.ts               # pan/zoom hook
```

`Rung.tsx`, `Definitions.tsx`, etc. on `/` are not touched.

## 13. Data model

```ts
// content/tree-nodes.ts
export type Region = 'root' | 'soft' | 'cluster' | 'tech';
export type NodeId =
  | 'prompting' | 'cowork' | 'scheduling' | 'connectors'
  | 'skills' | 'superpowers' | 'memory' | 'knowledge'
  | 'vibe' | 'agents' | 'repo' | 'apis' | 'cron' | 'integrated';

export interface ResourceLink {
  source: 'github' | 'docs' | 'video' | 'essay' | 'talk';
  title: string;
  href: string;
  internal?: boolean;  // true = scroll-to anchor on /, no external arrow
}

export interface TreeNode {
  id: NodeId;
  label: string;
  subtitle?: string;            // e.g. "(Claude.ai Projects)"
  region: Region;
  tag: string;                  // italic tagline
  timeToLearn: string;          // e.g. "~an afternoon"
  chips: string[];              // tool/tech chips
  whatItIs: string;             // markdown-lite (italic / bold)
  howToLearn: string[];         // numbered steps
  resources: ResourceLink[];
  essayAnchor?: string;         // "#agents" — omit if not in essay
  comingSoon?: boolean;         // true => render placeholder until content lands
}

export interface TreeEdge {
  from: NodeId;
  to: NodeId;
  kind: 'spine' | 'cluster' | 'bridge';
  // spine -> solid, branch-coloured by `from` region
  // cluster -> solid orange (cluster region)
  // bridge -> dashed purple
}

export const NODES: Record<NodeId, TreeNode> = { /* ... */ };
export const EDGES: TreeEdge[] = [ /* see §5.2 */ ];
```

**Geometry** is co-located with the graph data — each node gets `(x, y)` in viewBox coordinates. Layout is hand-tuned, not auto-computed.

## 14. Open content questions (deferred to the author)

These do **not** block implementation. Implementation can ship with placeholders.

1. Exact copy for the 6 new nodes (§11).
2. Specific resource links per node — for now, implementation uses 1-2 placeholder rows per node.
3. Rung 06.5 (CLAUDE.md) — folded into the Repo node panel as a "Bonus · structuring your CLAUDE.md" disclosure that reuses copy from `COPY.md` §5 rung 06.5.

## 15. Decisions made during brainstorming

For traceability:

- **Aesthetic direction:** Dark constellation synthesis of four reference images. Not warm-paper, not retro-terminal.
- **Layout:** Two-branch + central Skills cluster + Knowledge as cluster terminus. Picked over straight-ladder and full-network.
- **Gating:** Soft hint with full content access (everything readable regardless of state). Picked over hard-gating and free-roam.
- **Panel:** 11-section layout including definition, 3-step learning path, resources, mark-as-climbed, read-essay cross-link, local-storage reassurance.
- **Scope:** Essay (`/`) is frozen for now. Tree (`/tree`) is the development surface.
- **Mobile:** Full drag-to-pan layout, not a desktop-only notice.
- **Naming:** "Superpowers" kept as-is; "Claude Cowork" defined as "Claude.ai Projects" with that subtitle on the node.

## 16. Acceptance criteria

A v1 ship is acceptable when:

- [ ] `/tree` route exists and is reachable from the tab pill on `/`.
- [ ] All 14 nodes render with correct region colouring and edge wiring per §5.
- [ ] Clicking any node opens the side panel with the 11 sections from §8.
- [ ] Locked nodes are clickable and show the soft-hint card.
- [ ] "Mark as climbed" toggles state and persists across page reloads.
- [ ] "Reset progress" clears the localStorage key.
- [ ] Tree pans by drag on mobile/touch devices and stays within boundary clamps.
- [ ] Side panel becomes a bottom sheet on viewports under 700px.
- [ ] No regressions on `/` — visual diff is identical to pre-change.
- [ ] Lighthouse mobile performance score on `/tree` is no worse than `/`.
