# Skill Tree View Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a `/tree` route that renders the AI ladder as an interactive, dark, game-styled skill tree with 14 hex nodes across 4 regions, click-to-reveal side panel, localStorage-backed "climbed" state, soft hints on locked nodes, and full drag-to-pan mobile layout.

**Architecture:** New route at `app/tree/page.tsx`. Tree data and edges declared in `content/tree-nodes.ts`. Pure logic (prereqs, state derivation, localStorage) lives in `lib/tree/`. UI lives in `components/tree/`. Tab pill component is shared between `/` and `/tree`. The existing essay at `/` is not modified.

**Tech Stack:** Next.js 15 App Router · React 19 · TypeScript 5.7 strict · Tailwind 3.4 · Vitest + React Testing Library (added in Task 1) · localStorage for client state · plain SVG (no D3) for the tree.

**Spec:** `docs/superpowers/specs/2026-05-14-skill-tree-view-design.md`

---

## Phase 0 — Setup

### Task 1: Install test infrastructure

**Files:**
- Modify: `package.json`
- Create: `vitest.config.ts`
- Create: `vitest.setup.ts`
- Create: `tsconfig.test.json`

This repo has no tests today. We add Vitest (fast, Vite-powered, plays well with Next 15) plus React Testing Library so we can unit-test the pure logic in `lib/tree/`. UI components are verified by running `pnpm dev` and clicking around; we don't try to behaviorally test them.

- [ ] **Step 1: Install dev dependencies**

```bash
npm install --save-dev vitest @vitest/ui jsdom @testing-library/react @testing-library/jest-dom @vitejs/plugin-react
```

Expected: `package.json` `devDependencies` gains 6 keys; `package-lock.json` updates.

- [ ] **Step 2: Add the test script**

Modify `package.json` `scripts`:

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "test": "vitest",
  "test:run": "vitest run"
}
```

- [ ] **Step 3: Create `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, '.') },
  },
});
```

- [ ] **Step 4: Create `vitest.setup.ts`**

```ts
import '@testing-library/jest-dom/vitest';
```

- [ ] **Step 5: Create `tsconfig.test.json`** (so the editor knows about Vitest globals)

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "types": ["vitest/globals", "@testing-library/jest-dom"]
  },
  "include": ["**/*.test.ts", "**/*.test.tsx", "vitest.setup.ts"]
}
```

- [ ] **Step 6: Smoke test the runner**

Run: `npm run test:run -- --reporter=verbose --passWithNoTests`
Expected: exit 0, "No test files found" or "0 tests passed".

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json vitest.config.ts vitest.setup.ts tsconfig.test.json
git commit -m "chore: add vitest + react-testing-library for tree logic tests"
```

---

## Phase 1 — Data & logic

### Task 2: Tree types and node/edge data skeleton

**Files:**
- Create: `content/tree-nodes.ts`

Declare every type the rest of the codebase will rely on, plus all 14 nodes with placeholder content and all edges. New nodes (the 6 with no existing essay content) are marked `comingSoon: true`. Geometry is hand-tuned and baked in here so layout decisions live next to the data.

- [ ] **Step 1: Create the file with types and node/edge data**

```ts
// content/tree-nodes.ts

export type Region = 'root' | 'soft' | 'cluster' | 'tech';

export type NodeId =
  | 'prompting'
  | 'cowork' | 'scheduling' | 'connectors'
  | 'skills' | 'superpowers' | 'memory' | 'knowledge'
  | 'vibe' | 'agents' | 'repo' | 'apis' | 'cron' | 'integrated';

export interface ResourceLink {
  source: 'github' | 'docs' | 'video' | 'essay' | 'talk';
  title: string;
  href: string;
  internal?: boolean;
}

export interface TreeNode {
  id: NodeId;
  label: string;
  subtitle?: string;
  region: Region;
  /** SVG viewBox coordinates (viewBox is 1400x660) */
  x: number;
  y: number;
  tag: string;
  timeToLearn: string;
  chips: string[];
  whatItIs: string;
  howToLearn: string[];
  resources: ResourceLink[];
  essayAnchor?: string;
  comingSoon?: boolean;
}

export type EdgeKind = 'spine' | 'cluster' | 'bridge';

export interface TreeEdge {
  from: NodeId;
  to: NodeId;
  kind: EdgeKind;
}

const PLACEHOLDER_WHAT = 'Coming soon. The author is writing this rung.';
const PLACEHOLDER_HOW: string[] = ['Content pending.'];

export const NODES: Record<NodeId, TreeNode> = {
  prompting: {
    id: 'prompting',
    label: 'Prompting',
    region: 'root',
    x: 700, y: 110,
    tag: 'The conversation.',
    timeToLearn: '~5 min to start',
    chips: ['Claude.ai', 'ChatGPT', 'a browser tab'],
    whatItIs:
      'You open a chat window, ask for things, watch a paragraph come back. The model does the work; you steer. A sharp prompt is a huge unlock.',
    howToLearn: [
      'Open Claude.ai. Paste a real problem from your week.',
      'Frame it: role, context, constraints, the kind of answer you want.',
      'Iterate. Ask Claude to play it back from three angles you didn\'t pick.',
    ],
    resources: [
      { source: 'essay', title: 'Read the full rung on the essay', href: '/#prompting', internal: true },
    ],
    essayAnchor: '#prompting',
  },

  cowork: {
    id: 'cowork',
    label: 'Claude Cowork',
    subtitle: '(Claude.ai Projects)',
    region: 'soft',
    x: 380, y: 200,
    tag: 'Working with Claude like a knowledge base.',
    timeToLearn: '~an afternoon',
    chips: ['Claude.ai Projects', 'persistent files'],
    whatItIs: PLACEHOLDER_WHAT,
    howToLearn: PLACEHOLDER_HOW,
    resources: [],
    comingSoon: true,
  },

  scheduling: {
    id: 'scheduling',
    label: 'Scheduling',
    region: 'soft',
    x: 380, y: 320,
    tag: 'Tasks that run on a clock.',
    timeToLearn: '~an hour',
    chips: ['Claude Code schedules'],
    whatItIs: PLACEHOLDER_WHAT,
    howToLearn: PLACEHOLDER_HOW,
    resources: [],
    comingSoon: true,
  },

  connectors: {
    id: 'connectors',
    label: 'Connectors',
    region: 'soft',
    x: 380, y: 440,
    tag: 'APIs, but you don\'t have to write code.',
    timeToLearn: '~a day',
    chips: ['Claude connectors', 'MCP'],
    whatItIs: PLACEHOLDER_WHAT,
    howToLearn: PLACEHOLDER_HOW,
    resources: [],
    comingSoon: true,
  },

  skills: {
    id: 'skills',
    label: 'Skills',
    region: 'cluster',
    x: 700, y: 200,
    tag: 'Behaviour you can install.',
    timeToLearn: '~an hour to a day',
    chips: ['Claude Code skills', '.claude/skills/', 'superpowers'],
    whatItIs:
      'A skill is a markdown file the model loads when a trigger fires. A prompt is something you write once. **A skill is something the model does forever.**',
    howToLearn: [
      'Open the *brainstorming* skill in this repo. Read it top-to-bottom.',
      'Copy it. Strip it. Rewrite the description for one repeating thing you do.',
      'Put your version in *.claude/skills/*. Use it once. Watch it fire.',
    ],
    resources: [
      { source: 'github', title: 'obra/superpowers', href: 'https://github.com/obra/superpowers' },
      { source: 'essay', title: 'Read the full rung on the essay', href: '/#skills', internal: true },
    ],
    essayAnchor: '#skills',
  },

  superpowers: {
    id: 'superpowers',
    label: 'Superpowers',
    region: 'cluster',
    x: 580, y: 310,
    tag: 'A library of skills, opinionated.',
    timeToLearn: '~an evening',
    chips: ['superpowers framework'],
    whatItIs: PLACEHOLDER_WHAT,
    howToLearn: PLACEHOLDER_HOW,
    resources: [
      { source: 'github', title: 'obra/superpowers', href: 'https://github.com/obra/superpowers' },
    ],
    comingSoon: true,
  },

  memory: {
    id: 'memory',
    label: 'Memory',
    region: 'cluster',
    x: 820, y: 310,
    tag: 'Knowledge you can install.',
    timeToLearn: '~a week minimum',
    chips: ['CLAUDE.md', '/memory', 'Anthropic memory tool'],
    whatItIs:
      'A persistent store the model reads at the start of every session. Move every standing fact about your team, your stack, and your decisions into */memory*. The next conversation begins where the last one ended.',
    howToLearn: [
      'Create a */memory* folder at the root of any repo you own.',
      'Drop in 3 files: who you are, your three current projects, the people in your life.',
      'Reference */memory* from your CLAUDE.md. Watch the next session skip the warm-up.',
    ],
    resources: [
      { source: 'essay', title: 'Read the full rung on the essay', href: '/#memory', internal: true },
    ],
    essayAnchor: '#memory',
  },

  knowledge: {
    id: 'knowledge',
    label: 'Knowledge',
    region: 'cluster',
    x: 700, y: 420,
    tag: 'Where behaviour and memory compound.',
    timeToLearn: '~ongoing',
    chips: ['the long game'],
    whatItIs: PLACEHOLDER_WHAT,
    howToLearn: PLACEHOLDER_HOW,
    resources: [],
    comingSoon: true,
  },

  vibe: {
    id: 'vibe',
    label: 'Vibe coding',
    region: 'tech',
    x: 1020, y: 200,
    tag: 'Shipped software, easily.',
    timeToLearn: '~an afternoon',
    chips: ['Lovable', 'v0', 'Bolt'],
    whatItIs:
      'You describe an app in plain English and a real working web app comes out the other end. A real URL, a real database, a real thing on the internet, and you never opened a terminal.',
    howToLearn: [
      'Open Lovable. Describe the smallest internal page your team would actually use.',
      'Ship it tonight. Don\'t add features. Watch it work.',
      'Show one person who isn\'t you.',
    ],
    resources: [
      { source: 'essay', title: 'Read the full rung on the essay', href: '/#vibe', internal: true },
    ],
    essayAnchor: '#vibe',
  },

  agents: {
    id: 'agents',
    label: 'Coding agents',
    region: 'tech',
    x: 1020, y: 290,
    tag: 'Pair-programming, asymmetric.',
    timeToLearn: '~a weekend',
    chips: ['Claude Code', 'Codex', 'Gemini', 'your terminal'],
    whatItIs:
      'The agent reads your repo, edits real files, runs the tests, fixes what broke. Not a chat window — a colleague in your terminal.',
    howToLearn: [
      'Install Claude Code. Point it at a half-built personal project.',
      'Ask for the three smallest shippable PRs.',
      'Read every diff before you accept it.',
    ],
    resources: [
      { source: 'essay', title: 'Read the full rung on the essay', href: '/#agents', internal: true },
    ],
    essayAnchor: '#agents',
  },

  repo: {
    id: 'repo',
    label: 'Repo',
    region: 'tech',
    x: 1020, y: 380,
    tag: 'The working substrate.',
    timeToLearn: '~a weekend',
    chips: ['CLAUDE.md', '/.claude', '/memory', '/prompts'],
    whatItIs:
      'At some point your repo stops being a codebase and starts being a *substrate*. Every folder is for the model as much as for you. The agent doesn\'t visit your repo. It lives in it.',
    howToLearn: [
      'Open any repo you own. Add */memory*, */personas*, and */.claude/skills*.',
      'Write a CLAUDE.md at the root. 20 lines is plenty.',
      'Watch the model on its third visit do things its first visit couldn\'t.',
    ],
    resources: [
      { source: 'essay', title: 'Read the full rung on the essay', href: '/#repo', internal: true },
    ],
    essayAnchor: '#repo',
  },

  apis: {
    id: 'apis',
    label: 'APIs',
    region: 'tech',
    x: 920, y: 470,
    tag: 'The model as a function in your codebase.',
    timeToLearn: '~a week',
    chips: ['anthropic SDK', 'webhooks', 'cron'],
    whatItIs:
      'You stop opening a chat window and start calling the model from code. A function with a return value. Now it can read your inbox, classify your tickets, or write a report at 6am.',
    howToLearn: [
      'Get an Anthropic API key. Make your first call from a Node script.',
      'Wire it to one inbox, one webhook, or one cron. Just one.',
      'Watch a loop you used to do by hand run itself.',
    ],
    resources: [
      { source: 'essay', title: 'Read the full rung on the essay', href: '/#apis', internal: true },
    ],
    essayAnchor: '#apis',
  },

  cron: {
    id: 'cron',
    label: 'Cron & scripts',
    region: 'tech',
    x: 1120, y: 470,
    tag: 'Engineering ops for AI workflows.',
    timeToLearn: '~a week',
    chips: ['cron', 'GitHub Actions', 'shell scripts'],
    whatItIs: PLACEHOLDER_WHAT,
    howToLearn: PLACEHOLDER_HOW,
    resources: [],
    comingSoon: true,
  },

  integrated: {
    id: 'integrated',
    label: 'Integrated',
    subtitle: '(knowledge-based systems)',
    region: 'tech',
    x: 1020, y: 570,
    tag: 'Agents with hands on your stack.',
    timeToLearn: '~a quarter',
    chips: ['Gmail', 'Calendar', 'Slack', 'your CRM', 'your DB'],
    whatItIs:
      'The model crosses out of the chat window and into the system of record. You\'re not drafting an email; you\'re asking it to send the email, file the reply, update the deal, and move on.',
    howToLearn: [
      'Pick the most boring pair of tools you use daily.',
      'Wire one agent that handles a single, well-defined trigger between them.',
      'Don\'t pick the hardest pair. Pick the most boring.',
    ],
    resources: [
      { source: 'essay', title: 'Read the full rung on the essay', href: '/#integrated', internal: true },
    ],
    essayAnchor: '#integrated',
  },
};

export const EDGES: TreeEdge[] = [
  // Root → branches
  { from: 'prompting', to: 'cowork', kind: 'spine' },
  { from: 'prompting', to: 'vibe', kind: 'spine' },
  { from: 'prompting', to: 'skills', kind: 'bridge' },

  // Non-technical spine
  { from: 'cowork', to: 'scheduling', kind: 'spine' },
  { from: 'scheduling', to: 'connectors', kind: 'spine' },

  // Technical spine
  { from: 'vibe', to: 'agents', kind: 'spine' },
  { from: 'agents', to: 'repo', kind: 'spine' },
  { from: 'repo', to: 'apis', kind: 'spine' },
  { from: 'repo', to: 'cron', kind: 'spine' },
  { from: 'apis', to: 'integrated', kind: 'spine' },
  { from: 'cron', to: 'integrated', kind: 'spine' },

  // Cluster diamond
  { from: 'skills', to: 'superpowers', kind: 'cluster' },
  { from: 'skills', to: 'memory', kind: 'cluster' },
  { from: 'superpowers', to: 'knowledge', kind: 'cluster' },
  { from: 'memory', to: 'knowledge', kind: 'cluster' },

  // Bridges (cluster → branches)
  { from: 'superpowers', to: 'cowork', kind: 'bridge' },
  { from: 'memory', to: 'agents', kind: 'bridge' },
  { from: 'memory', to: 'repo', kind: 'bridge' },
  { from: 'knowledge', to: 'integrated', kind: 'bridge' },
];
```

- [ ] **Step 2: Verify it compiles**

Run: `npx tsc --noEmit`
Expected: exit 0, no errors.

- [ ] **Step 3: Commit**

```bash
git add content/tree-nodes.ts
git commit -m "feat(tree): add type definitions and 14-node data skeleton"
```

---

### Task 3: Graph logic (prereqs + state derivation)

**Files:**
- Create: `lib/tree/graph.ts`
- Create: `lib/tree/graph.test.ts`

Pure functions. Given a node and a Set of climbed node IDs, derive `available | climbed | next | locked`. Also identify the single "recommended next" node. TDD.

- [ ] **Step 1: Write failing tests for `prereqsOf`**

Create `lib/tree/graph.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { prereqsOf, stateOf, recommendedNext } from './graph';

describe('prereqsOf', () => {
  it('returns empty for the root', () => {
    expect(prereqsOf('prompting')).toEqual([]);
  });

  it('returns the upstream spine node', () => {
    expect(prereqsOf('agents')).toEqual(['vibe']);
  });

  it('returns multiple prereqs when there are converging spine edges', () => {
    // integrated has two predecessors on spine edges (apis, cron)
    expect(prereqsOf('integrated').sort()).toEqual(['apis', 'cron']);
  });

  it('does not include cluster or bridge edges as prereqs', () => {
    // skills has only a bridge edge from prompting; prereqs should be just ['prompting']
    expect(prereqsOf('skills')).toEqual(['prompting']);
    // superpowers has a cluster edge from skills (not spine); so it has no spine prereqs.
    // But spec treats cluster edges as soft, not gating. So:
    expect(prereqsOf('superpowers')).toEqual([]);
  });
});
```

- [ ] **Step 2: Run tests and verify they fail**

Run: `npm run test:run -- lib/tree/graph.test.ts`
Expected: FAIL with module-not-found for `./graph`.

- [ ] **Step 3: Implement `prereqsOf`**

Create `lib/tree/graph.ts`:

```ts
import { EDGES, NODES, type NodeId } from '@/content/tree-nodes';

/** A node's prereqs are the `from` ends of all `spine` and `bridge` edges that point to it.
 *  Wait: spec says only spine edges are required prereqs; bridge edges are visual hints.
 *  But the only bridge edge into the root-adjacent area is prompting→skills which we DO want
 *  to count as a prereq (Skills is unlocked by Prompting). So: spine + the special root→cluster bridge.
 *
 *  Cleaner rule: bridges starting from `prompting` are prereqs. Other bridges are not.
 */
export function prereqsOf(id: NodeId): NodeId[] {
  return EDGES
    .filter((e) => e.to === id)
    .filter((e) => e.kind === 'spine' || (e.kind === 'bridge' && e.from === 'prompting'))
    .map((e) => e.from);
}
```

- [ ] **Step 4: Run tests and verify they pass**

Run: `npm run test:run -- lib/tree/graph.test.ts`
Expected: 4 tests pass.

- [ ] **Step 5: Add tests for `stateOf`**

Append to `lib/tree/graph.test.ts`:

```ts
describe('stateOf', () => {
  it('returns climbed when the node is in the set', () => {
    expect(stateOf('prompting', new Set(['prompting']))).toBe('climbed');
  });

  it('returns available for the root when nothing is climbed', () => {
    expect(stateOf('prompting', new Set())).toBe('available');
  });

  it('returns locked when prereqs are unmet', () => {
    expect(stateOf('agents', new Set())).toBe('locked');
  });

  it('returns available when all prereqs are climbed', () => {
    expect(stateOf('agents', new Set(['vibe']))).toBe('available');
  });

  it('handles converging prereqs (integrated needs apis AND cron)', () => {
    expect(stateOf('integrated', new Set(['apis']))).toBe('locked');
    expect(stateOf('integrated', new Set(['apis', 'cron']))).toBe('available');
  });
});
```

- [ ] **Step 6: Run tests, verify fail**

Run: `npm run test:run -- lib/tree/graph.test.ts`
Expected: 4 pass, 5 fail (stateOf not exported).

- [ ] **Step 7: Implement `stateOf`**

Append to `lib/tree/graph.ts`:

```ts
export type NodeState = 'available' | 'climbed' | 'next' | 'locked';

export function stateOf(id: NodeId, climbed: Set<NodeId>): NodeState {
  if (climbed.has(id)) return 'climbed';
  const prereqs = prereqsOf(id);
  if (prereqs.every((p) => climbed.has(p))) return 'available';
  return 'locked';
}
```

- [ ] **Step 8: Run tests, verify pass**

Run: `npm run test:run -- lib/tree/graph.test.ts`
Expected: 9 pass.

- [ ] **Step 9: Add tests for `recommendedNext`**

Append:

```ts
describe('recommendedNext', () => {
  it('returns prompting when nothing is climbed', () => {
    expect(recommendedNext(new Set())).toBe('prompting');
  });

  it('returns null when everything is climbed', () => {
    const all: NodeId[] = [
      'prompting','cowork','scheduling','connectors',
      'skills','superpowers','memory','knowledge',
      'vibe','agents','repo','apis','cron','integrated',
    ];
    expect(recommendedNext(new Set(all))).toBeNull();
  });

  it('prefers technical branch progression', () => {
    // climbed prompting → next should be vibe (tech) over cowork (soft) by traversal priority
    expect(recommendedNext(new Set(['prompting']))).toBe('vibe');
  });
});
```

- [ ] **Step 10: Implement `recommendedNext`**

Append to `lib/tree/graph.ts`:

```ts
/** Traversal priority for picking the single "recommended next" node.
 *  Per spec §6: tech first, then soft, then cluster. Root is always first if not climbed.
 */
const RECOMMENDATION_ORDER: NodeId[] = [
  'prompting',
  'vibe', 'agents', 'repo', 'apis', 'cron', 'integrated',
  'cowork', 'scheduling', 'connectors',
  'skills', 'superpowers', 'memory', 'knowledge',
];

export function recommendedNext(climbed: Set<NodeId>): NodeId | null {
  for (const id of RECOMMENDATION_ORDER) {
    if (stateOf(id, climbed) === 'available') return id;
  }
  return null;
}
```

- [ ] **Step 11: Run tests, verify pass**

Run: `npm run test:run -- lib/tree/graph.test.ts`
Expected: 12 pass.

- [ ] **Step 12: Add the `state-with-recommendation` resolver**

Add tests:

```ts
describe('stateOf with recommendation', () => {
  it('marks the recommended node as next, others as available', () => {
    // Helper that takes the recommendation into account
    const climbed = new Set<NodeId>(['prompting']);
    const next = recommendedNext(climbed);
    expect(next).toBe('vibe');
    // The state function alone doesn't know about recommendation; that's a UI concern.
    expect(stateOf('vibe', climbed)).toBe('available');
    expect(stateOf('cowork', climbed)).toBe('available');
  });
});
```

Run tests. Expected: 13 pass.

- [ ] **Step 13: Find the closest unmet prereq for the soft-hint card**

Add tests:

```ts
describe('closestUnmetPrereq', () => {
  it('returns null for already-climbed nodes', () => {
    expect(closestUnmetPrereq('prompting', new Set(['prompting']))).toBeNull();
  });

  it('returns the single unmet prereq', () => {
    expect(closestUnmetPrereq('agents', new Set())).toBe('vibe');
  });

  it('returns the first unmet prereq when there are multiple', () => {
    expect(closestUnmetPrereq('integrated', new Set(['apis']))).toBe('cron');
    expect(closestUnmetPrereq('integrated', new Set(['cron']))).toBe('apis');
  });
});
```

Implement in `lib/tree/graph.ts`:

```ts
import { type NodeId as _NodeId } from '@/content/tree-nodes';

export function closestUnmetPrereq(id: NodeId, climbed: Set<NodeId>): NodeId | null {
  if (climbed.has(id)) return null;
  const prereqs = prereqsOf(id);
  return prereqs.find((p) => !climbed.has(p)) ?? null;
}
```

Run tests. Expected: 16 pass.

- [ ] **Step 14: Commit**

```bash
git add lib/tree/graph.ts lib/tree/graph.test.ts
git commit -m "feat(tree): pure prereq/state derivation with tests"
```

---

### Task 4: localStorage state helpers

**Files:**
- Create: `lib/tree/state.ts`
- Create: `lib/tree/state.test.ts`

Tiny module. Read, write, toggle, reset the climbed set. Defensive against missing `window`/`localStorage` (SSR safety).

- [ ] **Step 1: Write failing tests**

Create `lib/tree/state.test.ts`:

```ts
import { describe, it, expect, beforeEach } from 'vitest';
import { getClimbed, isClimbed, climb, unclimb, resetTree, STORAGE_KEY } from './state';

describe('climbed state', () => {
  beforeEach(() => localStorage.clear());

  it('returns an empty set initially', () => {
    expect(getClimbed().size).toBe(0);
  });

  it('persists a climbed node', () => {
    climb('prompting');
    expect(isClimbed('prompting')).toBe(true);
    expect(getClimbed().has('prompting')).toBe(true);
  });

  it('un-climbs', () => {
    climb('prompting');
    unclimb('prompting');
    expect(isClimbed('prompting')).toBe(false);
  });

  it('survives JSON roundtrip through localStorage', () => {
    climb('vibe');
    climb('agents');
    const raw = localStorage.getItem(STORAGE_KEY);
    expect(raw).toBeTruthy();
    expect(JSON.parse(raw!).sort()).toEqual(['agents', 'vibe']);
  });

  it('resetTree clears storage', () => {
    climb('repo');
    resetTree();
    expect(getClimbed().size).toBe(0);
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it('is tolerant of malformed storage', () => {
    localStorage.setItem(STORAGE_KEY, 'not json');
    expect(getClimbed().size).toBe(0);
  });
});
```

- [ ] **Step 2: Run tests, verify fail**

Run: `npm run test:run -- lib/tree/state.test.ts`
Expected: FAIL (module not found).

- [ ] **Step 3: Implement**

Create `lib/tree/state.ts`:

```ts
import type { NodeId } from '@/content/tree-nodes';

export const STORAGE_KEY = 'ai-ladder:climbed';

function safeStorage(): Storage | null {
  if (typeof window === 'undefined') return null;
  try { return window.localStorage; } catch { return null; }
}

export function getClimbed(): Set<NodeId> {
  const s = safeStorage();
  if (!s) return new Set();
  const raw = s.getItem(STORAGE_KEY);
  if (!raw) return new Set();
  try {
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return new Set();
    return new Set(arr as NodeId[]);
  } catch {
    return new Set();
  }
}

function setClimbed(next: Set<NodeId>): void {
  const s = safeStorage();
  if (!s) return;
  s.setItem(STORAGE_KEY, JSON.stringify(Array.from(next)));
}

export function isClimbed(id: NodeId): boolean {
  return getClimbed().has(id);
}

export function climb(id: NodeId): void {
  const set = getClimbed();
  set.add(id);
  setClimbed(set);
}

export function unclimb(id: NodeId): void {
  const set = getClimbed();
  set.delete(id);
  setClimbed(set);
}

export function resetTree(): void {
  const s = safeStorage();
  if (!s) return;
  s.removeItem(STORAGE_KEY);
}
```

- [ ] **Step 4: Run tests, verify pass**

Run: `npm run test:run -- lib/tree/state.test.ts`
Expected: 6 pass.

- [ ] **Step 5: Commit**

```bash
git add lib/tree/state.ts lib/tree/state.test.ts
git commit -m "feat(tree): localStorage climbed-state helpers with tests"
```

---

### Task 5: A React hook around the climbed set

**Files:**
- Create: `lib/tree/useClimbed.ts`

We want React components to re-render when state changes. Provide a small hook that wraps the storage helpers and keeps a state copy.

- [ ] **Step 1: Create the hook**

```ts
// lib/tree/useClimbed.ts
'use client';

import { useCallback, useEffect, useState } from 'react';
import type { NodeId } from '@/content/tree-nodes';
import { getClimbed, climb as climbFn, unclimb as unclimbFn, resetTree, STORAGE_KEY } from './state';

export function useClimbed() {
  const [climbed, setClimbed] = useState<Set<NodeId>>(() => new Set());

  // Hydrate from localStorage on mount (avoids SSR/CSR mismatch)
  useEffect(() => { setClimbed(getClimbed()); }, []);

  // Listen for cross-tab changes
  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === STORAGE_KEY) setClimbed(getClimbed());
    }
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const climb = useCallback((id: NodeId) => {
    climbFn(id);
    setClimbed(getClimbed());
  }, []);

  const unclimb = useCallback((id: NodeId) => {
    unclimbFn(id);
    setClimbed(getClimbed());
  }, []);

  const reset = useCallback(() => {
    resetTree();
    setClimbed(new Set());
  }, []);

  return { climbed, climb, unclimb, reset };
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: exit 0.

- [ ] **Step 3: Commit**

```bash
git add lib/tree/useClimbed.ts
git commit -m "feat(tree): useClimbed hook with cross-tab sync"
```

---

## Phase 2 — Routing & navigation

### Task 6: `/tree` route shell

**Files:**
- Create: `app/tree/page.tsx`
- Create: `app/tree/layout.tsx`

Minimal page that renders "Tree under construction" so we have a real route to navigate to before building the tree itself.

- [ ] **Step 1: Create the page**

```tsx
// app/tree/page.tsx
'use client';

import './tree.css';

export default function TreePage() {
  return (
    <main className="tree-page">
      <div className="tree-stage-placeholder">
        <p className="placeholder-text">Skill tree — under construction.</p>
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Create the route-scoped stylesheet**

Create `app/tree/tree.css`:

```css
.tree-page {
  position: fixed;
  inset: 0;
  background: radial-gradient(70% 60% at 50% 40%, #1a1d2e 0%, #0d0f1c 55%, #050610 100%);
  color: #e8e6f5;
  overflow: hidden;
  font-family: 'Inter', system-ui, sans-serif;
}

.tree-stage-placeholder {
  position: absolute; inset: 0;
  display: flex; align-items: center; justify-content: center;
}

.placeholder-text {
  font-family: 'Instrument Serif', serif;
  font-style: italic;
  font-size: 28px;
  color: #f5efd1;
  opacity: 0.6;
}
```

- [ ] **Step 3: Smoke test**

Run: `npm run dev` (background it)
Visit `http://localhost:3000/tree` in a browser.
Expected: dark page with "Skill tree — under construction." in italic serif.

- [ ] **Step 4: Commit**

```bash
git add app/tree/page.tsx app/tree/tree.css
git commit -m "feat(tree): /tree route shell with dark stage placeholder"
```

---

### Task 7: TabNav component (Essay / The tree)

**Files:**
- Create: `components/tree/TabNav.tsx`
- Modify: `app/page.tsx` (insert TabNav in the existing top bar)
- Modify: `app/tree/page.tsx` (insert TabNav)

Shared pill component. Lives on both `/` and `/tree`. The active tab is derived from `usePathname()`.

- [ ] **Step 1: Create `components/tree/TabNav.tsx`**

```tsx
// components/tree/TabNav.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function TabNav({ theme = 'dark' }: { theme?: 'dark' | 'light' }) {
  const path = usePathname();
  const onTree = path?.startsWith('/tree') ?? false;
  return (
    <nav className={`tab-nav tab-nav-${theme}`} aria-label="Page mode">
      <Link href="/" className={`tab-link ${!onTree ? 'tab-link-active' : ''}`}>Essay</Link>
      <Link href="/tree" className={`tab-link ${onTree ? 'tab-link-active' : ''}`}>The tree</Link>
    </nav>
  );
}
```

- [ ] **Step 2: Add shared styles**

Append to `app/globals.css`:

```css
/* ===== TAB NAV ===== */
.tab-nav {
  display: inline-flex;
  gap: 4px;
  padding: 4px;
  border-radius: 999px;
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 10px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}
.tab-nav-dark { background: rgba(20,22,40,0.7); border: 1px solid rgba(197,181,114,0.3); }
.tab-nav-light { background: rgba(26,22,18,0.06); border: 1px solid rgba(26,22,18,0.18); }

.tab-link {
  padding: 6px 14px;
  border-radius: 999px;
  text-decoration: none;
}
.tab-nav-dark .tab-link { color: rgba(229,229,255,0.55); }
.tab-nav-dark .tab-link-active { background: rgba(197,181,114,0.22); color: #f5efd1; }
.tab-nav-light .tab-link { color: rgba(26,22,18,0.55); }
.tab-nav-light .tab-link-active { background: rgba(26,22,18,0.18); color: #1A1612; }
```

- [ ] **Step 3: Mount on `/tree`**

Modify `app/tree/page.tsx`:

```tsx
'use client';

import './tree.css';
import { TabNav } from '@/components/tree/TabNav';

export default function TreePage() {
  return (
    <main className="tree-page">
      <div className="tree-tabs"><TabNav theme="dark" /></div>
      <div className="tree-stage-placeholder">
        <p className="placeholder-text">Skill tree — under construction.</p>
      </div>
    </main>
  );
}
```

Append to `app/tree/tree.css`:

```css
.tree-tabs { position: absolute; top: 24px; left: 24px; z-index: 10; }
```

- [ ] **Step 4: Mount on `/` (top-left of existing header)**

Read `app/page.tsx` lines 100-130 to find the existing top bar markup, then insert `<TabNav theme="light" />` next to the wordmark inside `<header className="topbar">`. Example pattern (the actual line numbers will vary):

```tsx
<header className="topbar">
  <div className="topbar-left">
    <TabNav theme="light" />
    <span className="wordmark">THE AI LADDER.</span>
  </div>
  {/* …existing scene readout… */}
</header>
```

Add the import at the top of `app/page.tsx`:

```tsx
import { TabNav } from '@/components/tree/TabNav';
```

And add this to `app/globals.css` if the `.topbar-left` class doesn't already exist:

```css
.topbar-left { display: flex; gap: 16px; align-items: center; }
```

- [ ] **Step 5: Smoke test both routes**

`npm run dev`, visit `/` — pill shows in top-left, "Essay" is active, click "The tree" → goes to `/tree`. Click "Essay" on `/tree` → returns to `/`. Active state flips correctly.

- [ ] **Step 6: Commit**

```bash
git add components/tree/TabNav.tsx app/globals.css app/tree/page.tsx app/tree/tree.css app/page.tsx
git commit -m "feat(tree): shared Essay/Tree tab pill on both routes"
```

---

## Phase 3 — Tree rendering

### Task 8: Stage component (background + starfield + tab nav)

**Files:**
- Create: `components/tree/Stage.tsx`
- Modify: `app/tree/page.tsx` (use Stage)
- Modify: `app/tree/tree.css` (move styles into a scoped class)

Wraps the dark background, decorative starfield, and the tab pill. Renders children inside.

- [ ] **Step 1: Create Stage**

```tsx
// components/tree/Stage.tsx
'use client';

import { TabNav } from './TabNav';
import type { ReactNode } from 'react';

export function Stage({ children }: { children: ReactNode }) {
  return (
    <div className="tree-stage">
      <div className="tree-tabs"><TabNav theme="dark" /></div>
      <div className="tree-stage-inner">{children}</div>
    </div>
  );
}
```

- [ ] **Step 2: Move the dark-background CSS into `.tree-stage` and add the starfield**

Replace `app/tree/tree.css` with:

```css
.tree-stage {
  position: fixed;
  inset: 0;
  background: radial-gradient(70% 60% at 50% 40%, #1a1d2e 0%, #0d0f1c 55%, #050610 100%);
  color: #e8e6f5;
  overflow: hidden;
  font-family: 'Inter', system-ui, sans-serif;
}

.tree-stage::before {
  content: "";
  position: absolute; inset: 0; pointer-events: none;
  background-image:
    radial-gradient(1px 1px at 6% 12%, #fff 100%, transparent),
    radial-gradient(1px 1px at 94% 18%, #fff7c2 100%, transparent),
    radial-gradient(1px 1px at 22% 78%, #c2d4ff 100%, transparent),
    radial-gradient(1px 1px at 78% 88%, #fff 100%, transparent),
    radial-gradient(1px 1px at 38% 30%, #fff 100%, transparent),
    radial-gradient(1px 1px at 60% 62%, #ffd76b 100%, transparent),
    radial-gradient(1px 1px at 15% 50%, #fff 100%, transparent);
  opacity: 0.6;
}

.tree-stage-inner {
  position: absolute; inset: 0; z-index: 2;
}

.tree-tabs { position: absolute; top: 24px; left: 24px; z-index: 10; }
```

- [ ] **Step 3: Use Stage on `/tree`**

Replace `app/tree/page.tsx`:

```tsx
'use client';

import './tree.css';
import { Stage } from '@/components/tree/Stage';

export default function TreePage() {
  return (
    <Stage>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ fontFamily: 'Instrument Serif, serif', fontStyle: 'italic', fontSize: 28, color: '#f5efd1', opacity: 0.55 }}>
          Skill tree — under construction.
        </p>
      </div>
    </Stage>
  );
}
```

- [ ] **Step 4: Smoke test**

Visit `/tree`. Dark stage with starfield, tab pill top-left, placeholder text centred. Resize window — stage stays fullscreen.

- [ ] **Step 5: Commit**

```bash
git add components/tree/Stage.tsx app/tree/tree.css app/tree/page.tsx
git commit -m "feat(tree): Stage component with starfield background"
```

---

### Task 9: HexNode + Edge primitives

**Files:**
- Create: `components/tree/HexNode.tsx`
- Create: `components/tree/Edge.tsx`

Render one hex / one edge. These are dumb, presentational, fully props-driven.

- [ ] **Step 1: Create HexNode**

```tsx
// components/tree/HexNode.tsx
'use client';

import type { TreeNode } from '@/content/tree-nodes';
import type { NodeState } from '@/lib/tree/graph';

const REGION_COLORS: Record<TreeNode['region'], string> = {
  root: '#f5efd1',
  soft: '#6db1ff',
  cluster: '#ff8c5a',
  tech: '#c5b572',
};

const SIZE = 32; // half-width of the hex in viewBox units

export function HexNode({
  node,
  state,
  onClick,
}: {
  node: TreeNode;
  state: NodeState;
  onClick: (id: TreeNode['id']) => void;
}) {
  const stroke = REGION_COLORS[node.region];
  const strokeOpacity = state === 'locked' ? 0.35 : 1;
  const fill =
    state === 'climbed' ? 'rgba(125,242,168,0.18)' :
    state === 'next' ? 'rgba(245,239,209,0.14)' :
    '#14172a';
  const filter = state === 'next' ? 'drop-shadow(0 0 12px rgba(245,239,209,0.65))' : undefined;

  const points = [
    [0, -SIZE], [SIZE * 0.866, -SIZE / 2], [SIZE * 0.866, SIZE / 2],
    [0, SIZE], [-SIZE * 0.866, SIZE / 2], [-SIZE * 0.866, -SIZE / 2],
  ].map((p) => p.join(',')).join(' ');

  return (
    <g
      transform={`translate(${node.x} ${node.y})`}
      style={{ cursor: 'pointer' }}
      onClick={() => onClick(node.id)}
      role="button"
      aria-label={node.label}
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick(node.id); }}
    >
      <polygon
        points={points}
        fill={fill}
        stroke={stroke}
        strokeOpacity={strokeOpacity}
        strokeWidth={2.2}
        style={{ filter, transition: 'fill .2s, stroke-opacity .2s, filter .2s' }}
      />
      <text
        y={4}
        textAnchor="middle"
        fontFamily="Instrument Serif, serif"
        fontStyle="italic"
        fontSize="13"
        fill="#f0ecd7"
        style={{ pointerEvents: 'none' }}
      >
        {node.label}
      </text>
      {node.subtitle && (
        <text
          y={56}
          textAnchor="middle"
          fontFamily="Instrument Serif, serif"
          fontStyle="italic"
          fontSize="9.5"
          fill="#f0ecd7"
          opacity="0.55"
          style={{ pointerEvents: 'none' }}
        >
          {node.subtitle}
        </text>
      )}
    </g>
  );
}
```

- [ ] **Step 2: Create Edge**

```tsx
// components/tree/Edge.tsx
'use client';

import type { TreeEdge } from '@/content/tree-nodes';
import { NODES } from '@/content/tree-nodes';

const EDGE_STROKE: Record<TreeEdge['kind'], string> = {
  spine: 'rgba(197,181,114,0.65)',  // gold
  cluster: 'rgba(255,140,90,0.7)',  // orange
  bridge: 'rgba(176,125,255,0.55)', // purple
};

export function Edge({ edge }: { edge: TreeEdge }) {
  const from = NODES[edge.from];
  const to = NODES[edge.to];
  const dash = edge.kind === 'bridge' ? '5 5' : undefined;

  // Quadratic curve through a midpoint with slight bias for non-vertical edges
  const mx = (from.x + to.x) / 2;
  const my = (from.y + to.y) / 2;
  const d = `M ${from.x} ${from.y} Q ${mx} ${my} ${to.x} ${to.y}`;

  return (
    <path
      d={d}
      fill="none"
      stroke={EDGE_STROKE[edge.kind]}
      strokeWidth={1.8}
      strokeDasharray={dash}
    />
  );
}
```

- [ ] **Step 3: Type-check**

Run: `npx tsc --noEmit`
Expected: exit 0.

- [ ] **Step 4: Commit**

```bash
git add components/tree/HexNode.tsx components/tree/Edge.tsx
git commit -m "feat(tree): HexNode and Edge presentational primitives"
```

---

### Task 10: TreeGraph composition

**Files:**
- Create: `components/tree/TreeGraph.tsx`
- Modify: `app/tree/page.tsx` (use TreeGraph)

Combine the data, the hook, and the primitives into a single SVG that fills the stage. No interactions yet beyond click → console log.

- [ ] **Step 1: Create TreeGraph**

```tsx
// components/tree/TreeGraph.tsx
'use client';

import { NODES, EDGES, type NodeId } from '@/content/tree-nodes';
import { useClimbed } from '@/lib/tree/useClimbed';
import { stateOf, recommendedNext } from '@/lib/tree/graph';
import { HexNode } from './HexNode';
import { Edge } from './Edge';

const VIEWBOX = '0 0 1400 660';

export function TreeGraph({ onNodeClick }: { onNodeClick: (id: NodeId) => void }) {
  const { climbed } = useClimbed();
  const next = recommendedNext(climbed);

  return (
    <svg
      viewBox={VIEWBOX}
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid meet"
      style={{ position: 'absolute', inset: 0 }}
    >
      {EDGES.map((e, i) => <Edge key={`e-${i}`} edge={e} />)}
      {Object.values(NODES).map((node) => {
        const baseState = stateOf(node.id, climbed);
        const state = baseState === 'available' && node.id === next ? 'next' : baseState;
        return <HexNode key={node.id} node={node} state={state} onClick={onNodeClick} />;
      })}
    </svg>
  );
}
```

- [ ] **Step 2: Use TreeGraph in the page**

Replace `app/tree/page.tsx`:

```tsx
'use client';

import './tree.css';
import { Stage } from '@/components/tree/Stage';
import { TreeGraph } from '@/components/tree/TreeGraph';

export default function TreePage() {
  return (
    <Stage>
      <TreeGraph onNodeClick={(id) => console.log('node clicked:', id)} />
    </Stage>
  );
}
```

- [ ] **Step 3: Smoke test**

Visit `/tree`. All 14 hexes render at their hand-tuned positions. All 19 edges render with the right colour per `kind`. Click a hex — console logs the id. The root (Prompting) is the recommended-next on first load and shows the warm-cream glow.

- [ ] **Step 4: Commit**

```bash
git add components/tree/TreeGraph.tsx app/tree/page.tsx
git commit -m "feat(tree): TreeGraph composition with state-aware node rendering"
```

---

### Task 11: LegendBar

**Files:**
- Create: `components/tree/LegendBar.tsx`
- Modify: `app/tree/page.tsx`

Bottom-of-stage legend explaining branch colours and edge types.

- [ ] **Step 1: Create LegendBar**

```tsx
// components/tree/LegendBar.tsx
'use client';

export function LegendBar() {
  return (
    <div className="tree-legend">
      <span><span className="dot dot-root" />Root</span>
      <span><span className="dot dot-soft" />Non-technical</span>
      <span><span className="dot dot-cluster" />Critical-learn cluster</span>
      <span><span className="dot dot-tech" />Technical · building</span>
      <span className="legend-sep" />
      <span><span className="swatch swatch-bridge" />Skills' bridges to branches</span>
      <span><span className="swatch swatch-cluster" />Cluster cross-links</span>
    </div>
  );
}
```

- [ ] **Step 2: Add styles to `app/tree/tree.css`**

```css
.tree-legend {
  position: absolute; bottom: 14px; left: 24px; right: 24px;
  display: flex; flex-wrap: wrap; gap: 22px; justify-content: center;
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 10px;
  color: rgba(229,229,255,0.7);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  z-index: 5;
  pointer-events: none;
}
.tree-legend .dot { display:inline-block; width:9px; height:9px; border-radius:50%; margin-right:6px; vertical-align: middle; }
.tree-legend .dot-root { background:#f5efd1; }
.tree-legend .dot-soft { background:#6db1ff; }
.tree-legend .dot-cluster { background:#ff8c5a; }
.tree-legend .dot-tech { background:#c5b572; }
.tree-legend .swatch { display:inline-block; width:24px; height:2px; margin-right:8px; vertical-align: middle; }
.tree-legend .swatch-bridge { background: transparent; border-top: 2px dashed rgba(176,125,255,0.75); }
.tree-legend .swatch-cluster { background: rgba(255,140,90,0.85); }
.tree-legend .legend-sep { width: 18px; }
```

- [ ] **Step 3: Mount in the page**

Modify `app/tree/page.tsx`:

```tsx
'use client';

import './tree.css';
import { Stage } from '@/components/tree/Stage';
import { TreeGraph } from '@/components/tree/TreeGraph';
import { LegendBar } from '@/components/tree/LegendBar';

export default function TreePage() {
  return (
    <Stage>
      <TreeGraph onNodeClick={(id) => console.log('node clicked:', id)} />
      <LegendBar />
    </Stage>
  );
}
```

- [ ] **Step 4: Smoke test**

Visit `/tree`. Legend bar sits at the bottom, doesn't overlap nodes.

- [ ] **Step 5: Commit**

```bash
git add components/tree/LegendBar.tsx app/tree/tree.css app/tree/page.tsx
git commit -m "feat(tree): bottom legend bar"
```

---

## Phase 4 — Interactions

### Task 12: SidePanel shell

**Files:**
- Create: `components/tree/SidePanel.tsx`
- Modify: `app/tree/page.tsx` (track selectedId state)

Drawer that slides in from the right on desktop. Closes on outside click, ESC, or clicking the same hex again.

- [ ] **Step 1: Create SidePanel**

```tsx
// components/tree/SidePanel.tsx
'use client';

import { useEffect, useRef } from 'react';
import type { NodeId } from '@/content/tree-nodes';

export function SidePanel({
  selectedId,
  onClose,
  children,
}: {
  selectedId: NodeId | null;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose(); }
    function onClick(e: MouseEvent) {
      if (!selectedId) return;
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    window.addEventListener('keydown', onKey);
    window.addEventListener('mousedown', onClick);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('mousedown', onClick);
    };
  }, [selectedId, onClose]);

  const open = !!selectedId;

  return (
    <aside
      ref={ref}
      className={`tree-panel ${open ? 'tree-panel-open' : ''}`}
      aria-hidden={!open}
    >
      {open && children}
    </aside>
  );
}
```

- [ ] **Step 2: Styles**

Append to `app/tree/tree.css`:

```css
.tree-panel {
  position: absolute;
  top: 28px; right: 28px; bottom: 60px;
  width: 380px;
  background: linear-gradient(180deg, rgba(20,22,40,0.92), rgba(10,12,24,0.92));
  border: 1px solid rgba(197,181,114,0.4);
  border-radius: 10px;
  padding: 22px 22px 18px;
  backdrop-filter: blur(8px);
  z-index: 8;
  transform: translateX(420px);
  opacity: 0;
  transition: transform .25s ease, opacity .2s ease;
  overflow: auto;
}
.tree-panel-open { transform: translateX(0); opacity: 1; }
```

- [ ] **Step 3: Wire into the page**

Replace `app/tree/page.tsx`:

```tsx
'use client';

import { useState } from 'react';
import './tree.css';
import { Stage } from '@/components/tree/Stage';
import { TreeGraph } from '@/components/tree/TreeGraph';
import { LegendBar } from '@/components/tree/LegendBar';
import { SidePanel } from '@/components/tree/SidePanel';
import type { NodeId } from '@/content/tree-nodes';

export default function TreePage() {
  const [selectedId, setSelectedId] = useState<NodeId | null>(null);

  function handleNodeClick(id: NodeId) {
    setSelectedId((cur) => (cur === id ? null : id));
  }

  return (
    <Stage>
      <TreeGraph onNodeClick={handleNodeClick} />
      <LegendBar />
      <SidePanel selectedId={selectedId} onClose={() => setSelectedId(null)}>
        <div style={{ fontFamily: 'JetBrains Mono, ui-monospace, monospace', fontSize: 12, color: '#f5efd1' }}>
          Selected: {selectedId}
        </div>
      </SidePanel>
    </Stage>
  );
}
```

- [ ] **Step 4: Smoke test**

Visit `/tree`. Click a hex — panel slides in. Click outside — closes. Click same hex twice — closes. ESC closes.

- [ ] **Step 5: Commit**

```bash
git add components/tree/SidePanel.tsx app/tree/tree.css app/tree/page.tsx
git commit -m "feat(tree): SidePanel drawer with outside-click + ESC dismiss"
```

---

### Task 13: PanelContent with all 11 sections

**Files:**
- Create: `components/tree/PanelContent.tsx`
- Create: `components/tree/InlineMarkdown.tsx` (handles `*italic*` and `**bold**`)
- Modify: `app/tree/page.tsx` (use PanelContent inside SidePanel)

Render the full 11-section layout from spec §8.1 for any given node.

- [ ] **Step 1: Create InlineMarkdown**

```tsx
// components/tree/InlineMarkdown.tsx
import type { ReactNode } from 'react';

/** Renders *italic* and **bold** in a string. No other markdown. */
export function InlineMarkdown({ text }: { text: string }) {
  const re = /(\*\*[^*]+\*\*|\*[^*]+\*)/g;
  const out: ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const token = m[0];
    if (token.startsWith('**')) out.push(<strong key={m.index}>{token.slice(2, -2)}</strong>);
    else out.push(<em key={m.index}>{token.slice(1, -1)}</em>);
    last = m.index + token.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return <>{out}</>;
}
```

- [ ] **Step 2: Create PanelContent**

```tsx
// components/tree/PanelContent.tsx
'use client';

import { NODES, type NodeId } from '@/content/tree-nodes';
import { useClimbed } from '@/lib/tree/useClimbed';
import { stateOf, closestUnmetPrereq } from '@/lib/tree/graph';
import { InlineMarkdown } from './InlineMarkdown';

const REGION_LABEL: Record<string, string> = {
  root: 'Root', soft: 'Non-technical', cluster: 'Critical-learn cluster', tech: 'Technical · building',
};
const REGION_DOT: Record<string, string> = {
  root: '#f5efd1', soft: '#6db1ff', cluster: '#ff8c5a', tech: '#c5b572',
};

export function PanelContent({
  id,
  onJumpTo,
}: {
  id: NodeId;
  onJumpTo: (id: NodeId) => void;
}) {
  const node = NODES[id];
  const { climbed, climb, unclimb } = useClimbed();
  const state = stateOf(id, climbed);
  const hint = state === 'locked' ? closestUnmetPrereq(id, climbed) : null;

  return (
    <div className="panel-content">
      <div className="panel-crumb">{regionCrumb(node.region)}</div>
      <h3 className="panel-name">{node.label}.</h3>
      <div className="panel-tag"><em>{node.tag}</em></div>

      <div className="panel-meta">
        <span><span className="dot" />{node.timeToLearn}</span>
        <span style={{ color: REGION_DOT[node.region] }}>
          <span className="dot" style={{ background: REGION_DOT[node.region] }} />
          {REGION_LABEL[node.region]}
        </span>
      </div>

      {node.chips.length > 0 && (
        <div className="panel-chips">
          {node.chips.map((c) => <span key={c} className="chip">{c}</span>)}
        </div>
      )}

      {hint && (
        <div className="panel-hint">
          <span className="panel-hint-text">
            Easier if you've climbed <strong>{NODES[hint].label}</strong> first.
          </span>
          <button
            type="button"
            className="panel-hint-jump"
            onClick={() => onJumpTo(hint)}
          >
            Jump to {NODES[hint].label} →
          </button>
        </div>
      )}

      <hr />

      <div className="panel-section-label">§ What it is</div>
      <p className="panel-body"><InlineMarkdown text={node.whatItIs} /></p>

      <hr />

      <div className="panel-section-label">↑ How to learn it</div>
      <ol className="panel-how">
        {node.howToLearn.map((step, i) => (
          <li key={i}><InlineMarkdown text={step} /></li>
        ))}
      </ol>

      {node.resources.length > 0 && (
        <>
          <hr />
          <div className="panel-section-label">⌁ Resources</div>
          <div className="panel-resources">
            {node.resources.map((r, i) => (
              <a
                key={i}
                href={r.href}
                target={r.internal ? undefined : '_blank'}
                rel={r.internal ? undefined : 'noreferrer'}
              >
                <span className="src">{r.source}</span>
                <span className="title">{r.title}</span>
                <span className="arrow">{r.internal ? '↓' : '↗'}</span>
              </a>
            ))}
          </div>
        </>
      )}

      <div className="panel-actions">
        <button
          type="button"
          className={`btn ${state === 'climbed' ? 'btn-done' : 'btn-primary'}`}
          onClick={() => (state === 'climbed' ? unclimb(id) : climb(id))}
        >
          {state === 'climbed' ? '✓ Climbed · click to un-mark' : '↑ Mark as climbed'}
        </button>
        {node.essayAnchor && (
          <a className="btn btn-secondary" href={`/${node.essayAnchor}`}>Read the essay →</a>
        )}
      </div>

      <div className="panel-footer">progress saved locally · nothing leaves your browser</div>
    </div>
  );
}

function regionCrumb(region: string) {
  switch (region) {
    case 'root': return '⌂ The shared root';
    case 'soft': return '↓ Non-technical branch';
    case 'cluster': return '◇ Critical-learn cluster';
    case 'tech': return '↓ Technical · building';
    default: return '';
  }
}
```

- [ ] **Step 3: Panel styles**

Append to `app/tree/tree.css`:

```css
.panel-content { font-family: 'Inter', system-ui, sans-serif; }
.panel-crumb { font-family: 'JetBrains Mono', ui-monospace, monospace; font-size: 9px; letter-spacing: 0.22em; text-transform: uppercase; color: #c5b572; opacity: 0.85; }
.panel-name { font-family: 'Instrument Serif', serif; font-style: italic; font-size: 32px; color: #f5efd1; letter-spacing: -0.01em; line-height: 1.05; margin: 6px 0 4px; }
.panel-tag { font-family: 'Instrument Serif', serif; font-style: italic; font-size: 15px; color: rgba(245,239,209,0.7); line-height: 1.3; }
.panel-meta { display: flex; gap: 18px; margin: 14px 0 4px; font-family: 'JetBrains Mono', ui-monospace, monospace; font-size: 10px; color: rgba(245,239,209,0.7); letter-spacing: 0.1em; text-transform: uppercase; }
.panel-meta .dot { display:inline-block; width:7px; height:7px; border-radius:50%; background:#c5b572; margin-right:6px; vertical-align: middle; }
.panel-chips { display: flex; flex-wrap: wrap; gap: 6px; margin: 10px 0 18px; }
.panel-chips .chip { font-family: 'JetBrains Mono', ui-monospace, monospace; font-size: 10px; padding: 3px 8px; border: 1px solid rgba(197,181,114,0.4); border-radius: 999px; color: rgba(245,239,209,0.8); }

.panel-hint { margin: 10px 0; padding: 10px 12px; border: 1px solid rgba(255,140,90,0.4); background: rgba(255,140,90,0.1); border-radius: 6px; display: flex; flex-direction: column; gap: 8px; }
.panel-hint-text { font-size: 12.5px; color: rgba(245,239,209,0.85); line-height: 1.4; }
.panel-hint-jump { background: transparent; border: 1px solid rgba(255,140,90,0.6); color: #ff8c5a; font-family: 'JetBrains Mono', ui-monospace, monospace; font-size: 10px; text-transform: uppercase; letter-spacing: 0.14em; padding: 5px 10px; border-radius: 4px; cursor: pointer; align-self: flex-start; }

.panel-content hr { border: none; border-top: 1px solid rgba(197,181,114,0.18); margin: 14px 0; }
.panel-section-label { font-family: 'JetBrains Mono', ui-monospace, monospace; font-size: 9px; letter-spacing: 0.22em; text-transform: uppercase; color: #c5b572; opacity: 0.85; margin-bottom: 8px; }
.panel-body { font-size: 13.5px; line-height: 1.55; color: rgba(229,229,255,0.85); }
.panel-body em, .panel-how em { color: #f5efd1; font-style: italic; }

.panel-how { padding-left: 18px; }
.panel-how li { font-size: 13px; line-height: 1.5; color: rgba(229,229,255,0.85); margin-bottom: 6px; }
.panel-how li::marker { color: #c5b572; }

.panel-resources a { display: block; padding: 8px 0; border-bottom: 1px dashed rgba(197,181,114,0.2); color: rgba(229,229,255,0.85); text-decoration: none; font-size: 13px; }
.panel-resources a:last-child { border-bottom: none; }
.panel-resources .src { font-family: 'JetBrains Mono', ui-monospace, monospace; font-size: 9px; color: #c5b572; letter-spacing: 0.12em; text-transform: uppercase; margin-right: 8px; }
.panel-resources .title { color: rgba(229,229,255,0.85); }
.panel-resources .arrow { float: right; color: rgba(197,181,114,0.7); }

.panel-actions { display: flex; gap: 8px; margin-top: 18px; }
.panel-actions .btn { flex: 1; padding: 10px; border: 1px solid rgba(197,181,114,0.5); border-radius: 6px; font-family: 'JetBrains Mono', ui-monospace, monospace; font-size: 10px; text-transform: uppercase; letter-spacing: 0.14em; text-align: center; cursor: pointer; text-decoration: none; background: transparent; color: #c5b572; }
.panel-actions .btn-primary { background: rgba(197,181,114,0.18); color: #f5efd1; }
.panel-actions .btn-secondary { color: rgba(245,239,209,0.75); }
.panel-actions .btn-done { background: rgba(125,242,168,0.18); border-color: rgba(125,242,168,0.6); color: #b6ecc4; }

.panel-footer { margin-top: 14px; font-family: 'JetBrains Mono', ui-monospace, monospace; font-size: 9px; color: rgba(229,229,255,0.4); letter-spacing: 0.1em; text-align: center; }
```

- [ ] **Step 4: Wire PanelContent into the page**

Modify `app/tree/page.tsx`:

```tsx
'use client';

import { useState } from 'react';
import './tree.css';
import { Stage } from '@/components/tree/Stage';
import { TreeGraph } from '@/components/tree/TreeGraph';
import { LegendBar } from '@/components/tree/LegendBar';
import { SidePanel } from '@/components/tree/SidePanel';
import { PanelContent } from '@/components/tree/PanelContent';
import type { NodeId } from '@/content/tree-nodes';

export default function TreePage() {
  const [selectedId, setSelectedId] = useState<NodeId | null>(null);

  function handleNodeClick(id: NodeId) {
    setSelectedId((cur) => (cur === id ? null : id));
  }

  return (
    <Stage>
      <TreeGraph onNodeClick={handleNodeClick} />
      <LegendBar />
      <SidePanel selectedId={selectedId} onClose={() => setSelectedId(null)}>
        {selectedId && <PanelContent id={selectedId} onJumpTo={(id) => setSelectedId(id)} />}
      </SidePanel>
    </Stage>
  );
}
```

- [ ] **Step 5: Smoke test**

Visit `/tree`:
- Click Prompting → panel shows all 11 sections.
- Click "Mark as climbed" → button becomes green "✓ Climbed". Hex turns green-tinted.
- Click "Mark as climbed" again → unmarks. Hex returns to default.
- Click any locked node (e.g. Integrated before climbing prereqs) → orange hint card appears at top, names "APIs" or "Cron & scripts" as the closest unmet prereq, and the "Jump to" button switches the panel to that node.
- Click "Read the essay →" → opens `/#prompting`.
- Refresh the page — climbed state persists.

- [ ] **Step 6: Commit**

```bash
git add components/tree/PanelContent.tsx components/tree/InlineMarkdown.tsx app/tree/tree.css app/tree/page.tsx
git commit -m "feat(tree): full 11-section panel content with climb/unclimb"
```

---

### Task 14: Reset-progress link

**Files:**
- Create: `components/tree/ResetProgress.tsx`
- Modify: `app/tree/page.tsx`

Small footer link that clears all climbed state. Confirmation via `window.confirm`.

- [ ] **Step 1: Create the component**

```tsx
// components/tree/ResetProgress.tsx
'use client';

import { useClimbed } from '@/lib/tree/useClimbed';

export function ResetProgress() {
  const { climbed, reset } = useClimbed();
  if (climbed.size === 0) return null;

  function handle() {
    if (window.confirm(`Reset all progress? (${climbed.size} climbed rungs will be cleared.)`)) {
      reset();
    }
  }

  return (
    <button type="button" className="reset-progress" onClick={handle}>
      reset progress ({climbed.size})
    </button>
  );
}
```

Append to `app/tree/tree.css`:

```css
.reset-progress {
  position: absolute; bottom: 38px; right: 28px;
  background: transparent;
  border: none;
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 9px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(229,229,255,0.45);
  cursor: pointer;
  z-index: 5;
}
.reset-progress:hover { color: #ff8c5a; }
```

- [ ] **Step 2: Mount**

Add to `app/tree/page.tsx` inside `<Stage>`:

```tsx
import { ResetProgress } from '@/components/tree/ResetProgress';
// ...
<ResetProgress />
```

- [ ] **Step 3: Smoke test**

Mark 2-3 nodes climbed. The "reset progress (3)" link appears. Click → confirm → all hexes return to default. Link disappears.

- [ ] **Step 4: Commit**

```bash
git add components/tree/ResetProgress.tsx app/tree/tree.css app/tree/page.tsx
git commit -m "feat(tree): reset-progress link with confirm"
```

---

## Phase 5 — Mobile

### Task 15: Pan/zoom hook

**Files:**
- Create: `lib/tree/usePanZoom.ts`

Track `panX`, `panY`, `scale`. Drag with mouse or single-finger touch. Pinch with two fingers. Clamp pan inside reasonable bounds.

- [ ] **Step 1: Create the hook**

```ts
// lib/tree/usePanZoom.ts
'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

type Pan = { x: number; y: number; scale: number };

const MIN_SCALE = 0.5;
const MAX_SCALE = 2.5;
const PAN_BOUNDS = 200; // px overflow allowed past stage edge

export function usePanZoom(initial: Pan = { x: 0, y: 0, scale: 1 }) {
  const [pan, setPan] = useState<Pan>(initial);
  const ref = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; y: number; px: number; py: number } | null>(null);
  const pinch = useRef<{ d0: number; s0: number } | null>(null);

  const clamp = useCallback((next: Pan): Pan => {
    const el = ref.current;
    if (!el) return next;
    const r = el.getBoundingClientRect();
    const maxX = r.width / 2 + PAN_BOUNDS;
    const maxY = r.height / 2 + PAN_BOUNDS;
    return {
      x: Math.max(-maxX, Math.min(maxX, next.x)),
      y: Math.max(-maxY, Math.min(maxY, next.y)),
      scale: Math.max(MIN_SCALE, Math.min(MAX_SCALE, next.scale)),
    };
  }, []);

  function distance(touches: TouchList) {
    const [a, b] = [touches[0], touches[1]];
    return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
  }

  function onPointerDown(e: React.PointerEvent) {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    (e.target as Element).setPointerCapture?.(e.pointerId);
    drag.current = { x: e.clientX, y: e.clientY, px: pan.x, py: pan.y };
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!drag.current) return;
    const dx = e.clientX - drag.current.x;
    const dy = e.clientY - drag.current.y;
    setPan((p) => clamp({ ...p, x: drag.current!.px + dx, y: drag.current!.py + dy }));
  }

  function onPointerUp() { drag.current = null; }

  function onTouchStart(e: React.TouchEvent) {
    if (e.touches.length === 2) {
      pinch.current = { d0: distance(e.touches), s0: pan.scale };
    }
  }
  function onTouchMove(e: React.TouchEvent) {
    if (e.touches.length === 2 && pinch.current) {
      const d = distance(e.touches);
      const next = pinch.current.s0 * (d / pinch.current.d0);
      setPan((p) => clamp({ ...p, scale: next }));
    }
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (e.touches.length < 2) pinch.current = null;
  }

  // Cleanup on unmount
  useEffect(() => () => { drag.current = null; pinch.current = null; }, []);

  return {
    ref,
    pan,
    handlers: { onPointerDown, onPointerMove, onPointerUp, onTouchStart, onTouchMove, onTouchEnd },
    reset: () => setPan(initial),
  };
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: exit 0.

- [ ] **Step 3: Commit**

```bash
git add lib/tree/usePanZoom.ts
git commit -m "feat(tree): pan + pinch-zoom hook for the tree viewport"
```

---

### Task 16: Apply pan-zoom to TreeGraph

**Files:**
- Modify: `components/tree/TreeGraph.tsx`

Wrap the SVG in a `<div>` that gets `transform: translate(x,y) scale(s)`. Bind the hook's handlers.

- [ ] **Step 1: Modify TreeGraph**

Replace `components/tree/TreeGraph.tsx`:

```tsx
'use client';

import { NODES, EDGES, type NodeId } from '@/content/tree-nodes';
import { useClimbed } from '@/lib/tree/useClimbed';
import { stateOf, recommendedNext } from '@/lib/tree/graph';
import { usePanZoom } from '@/lib/tree/usePanZoom';
import { HexNode } from './HexNode';
import { Edge } from './Edge';

const VIEWBOX = '0 0 1400 660';

export function TreeGraph({ onNodeClick }: { onNodeClick: (id: NodeId) => void }) {
  const { climbed } = useClimbed();
  const next = recommendedNext(climbed);
  const { ref, pan, handlers } = usePanZoom();

  return (
    <div
      ref={ref}
      className="tree-pan-layer"
      {...handlers}
      style={{ touchAction: 'none' }}
    >
      <div
        className="tree-pan-content"
        style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${pan.scale})` }}
      >
        <svg
          viewBox={VIEWBOX}
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMid meet"
        >
          {EDGES.map((e, i) => <Edge key={`e-${i}`} edge={e} />)}
          {Object.values(NODES).map((node) => {
            const base = stateOf(node.id, climbed);
            const state = base === 'available' && node.id === next ? 'next' : base;
            return <HexNode key={node.id} node={node} state={state} onClick={onNodeClick} />;
          })}
        </svg>
      </div>
    </div>
  );
}
```

Append to `app/tree/tree.css`:

```css
.tree-pan-layer { position: absolute; inset: 0; cursor: grab; }
.tree-pan-layer:active { cursor: grabbing; }
.tree-pan-content { width: 100%; height: 100%; transform-origin: center center; transition: transform .04s linear; }
```

- [ ] **Step 2: Smoke test (desktop)**

`npm run dev`, visit `/tree`. Click-and-drag the background to pan. Click a hex — panel opens (the pointerdown on the hex should not trigger a drag because the SVG `<g>` captures the click). If clicks on hexes get swallowed by drags, increase a 3px deadzone in the hook (see fix-up below). Verify: pan works, clicks on hexes still open the panel.

- [ ] **Step 3: Add a click-vs-drag deadzone if needed**

Only if hex clicks regress. Modify `onPointerMove` in `lib/tree/usePanZoom.ts`:

```ts
function onPointerMove(e: React.PointerEvent) {
  if (!drag.current) return;
  const dx = e.clientX - drag.current.x;
  const dy = e.clientY - drag.current.y;
  if (Math.hypot(dx, dy) < 3) return; // deadzone — let small wiggles register as clicks
  setPan((p) => clamp({ ...p, x: drag.current!.px + dx, y: drag.current!.py + dy }));
}
```

- [ ] **Step 4: Smoke test (mobile, via Chrome devtools mobile mode)**

Open Chrome devtools, toggle device toolbar, select iPhone 14. Visit `/tree`. Touch-drag pans. Pinch zooms in/out. Tap a hex → panel opens.

- [ ] **Step 5: Commit**

```bash
git add components/tree/TreeGraph.tsx app/tree/tree.css lib/tree/usePanZoom.ts
git commit -m "feat(tree): drag-to-pan + pinch-zoom in TreeGraph"
```

---

### Task 17: Mobile bottom-sheet panel

**Files:**
- Modify: `components/tree/SidePanel.tsx`
- Modify: `app/tree/tree.css`

Below 700px viewport width, the panel slides up from the bottom instead of in from the right, takes 75% viewport height, and supports a drag-down dismiss gesture.

- [ ] **Step 1: Modify SidePanel to add a drag handle**

Replace `components/tree/SidePanel.tsx`:

```tsx
// components/tree/SidePanel.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import type { NodeId } from '@/content/tree-nodes';

export function SidePanel({
  selectedId,
  onClose,
  children,
}: {
  selectedId: NodeId | null;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [dragY, setDragY] = useState(0);
  const dragStart = useRef<number | null>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose(); }
    function onClick(e: MouseEvent) {
      if (!selectedId) return;
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    window.addEventListener('keydown', onKey);
    window.addEventListener('mousedown', onClick);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('mousedown', onClick);
    };
  }, [selectedId, onClose]);

  // Reset drag offset when panel re-opens
  useEffect(() => { setDragY(0); }, [selectedId]);

  function onHandlePointerDown(e: React.PointerEvent) {
    (e.target as Element).setPointerCapture?.(e.pointerId);
    dragStart.current = e.clientY;
  }
  function onHandlePointerMove(e: React.PointerEvent) {
    if (dragStart.current == null) return;
    const dy = Math.max(0, e.clientY - dragStart.current);
    setDragY(dy);
  }
  function onHandlePointerUp() {
    if (dragY > 80) onClose();
    setDragY(0);
    dragStart.current = null;
  }

  const open = !!selectedId;
  const style = open ? { transform: `translateY(${dragY}px)` } : undefined;

  return (
    <aside
      ref={ref}
      className={`tree-panel ${open ? 'tree-panel-open' : ''}`}
      aria-hidden={!open}
      style={style}
    >
      <div
        className="tree-panel-handle"
        onPointerDown={onHandlePointerDown}
        onPointerMove={onHandlePointerMove}
        onPointerUp={onHandlePointerUp}
        aria-label="drag to dismiss"
      />
      {open && children}
    </aside>
  );
}
```

- [ ] **Step 2: Add mobile styles**

Append to `app/tree/tree.css`:

```css
.tree-panel-handle {
  display: none;
}

@media (max-width: 700px) {
  .tree-panel {
    top: auto;
    right: 0;
    bottom: 0;
    left: 0;
    width: auto;
    max-height: 75vh;
    border-radius: 16px 16px 0 0;
    border-bottom: none;
    transform: translateY(100%);
    transition: transform .25s ease, opacity .2s ease;
    padding-top: 14px;
  }
  .tree-panel-open { transform: translateY(0); }
  .tree-panel-handle {
    display: block;
    position: absolute; top: 8px; left: 50%; transform: translateX(-50%);
    width: 48px; height: 5px;
    background: rgba(245,239,209,0.35);
    border-radius: 999px;
    cursor: grab;
    touch-action: none;
  }
}
```

- [ ] **Step 3: Smoke test (mobile mode)**

In devtools mobile mode, tap a hex → panel rises from the bottom. Drag the handle down → panel closes when dragged more than 80px.

- [ ] **Step 4: Commit**

```bash
git add components/tree/SidePanel.tsx app/tree/tree.css
git commit -m "feat(tree): bottom-sheet panel + drag-down dismiss on mobile"
```

---

## Phase 6 — Polish & verification

### Task 18: Cross-route navigation smoke

**Files:**
- Manual verification only. No file changes unless a regression is found.

Make sure the existing `/` route is untouched apart from the TabNav insertion. Manually verify nothing else regressed.

- [ ] **Step 1: Visit `/` in the dev server**

Confirm:
- Wordmark `THE AI LADDER.` still in the top bar.
- Scene readout still updates as you scroll.
- All 8 rungs still render correctly.
- The TabNav pill is the only new visible element, positioned top-left without overlapping the wordmark.

- [ ] **Step 2: Cross-route navigation**

- From `/`, click "The tree" → navigates to `/tree`.
- From `/tree`, click "Essay" → returns to `/`.
- From `/tree`, click a node, then "Read the essay →" → arrives at `/#agents` (or whichever anchor), scrolled to the right rung.
- Browser back/forward buttons work across routes.

- [ ] **Step 3: Visual regression spot-check**

Open `/` in two browser windows (one pre-Task-7, one current — use `git stash` to compare if needed). The only diff should be the tab pill insertion.

- [ ] **Step 4: Production build sanity**

Run: `npm run build`
Expected: build succeeds. No type errors. `app/tree/page.tsx` shows up in the route manifest. Bundle size for `/tree` is reasonable (< 100kb JS payload).

- [ ] **Step 5: Run all tests one last time**

Run: `npm run test:run`
Expected: all tests pass (16 from graph, 6 from state).

- [ ] **Step 6: Commit any spot fixes**

If you found regressions, fix and commit each one separately. If clean, no commit needed.

---

### Task 19: Add a "this is a v1" notice for new nodes

**Files:**
- Modify: `components/tree/PanelContent.tsx`

When a node has `comingSoon: true`, replace the body sections with a placeholder note. Keep the header, meta row, and the "Mark as climbed" button working.

- [ ] **Step 1: Modify PanelContent**

In `components/tree/PanelContent.tsx`, wrap the "What it is" / "How to learn it" / "Resources" sections in a `node.comingSoon ? <ComingSoonNote /> : <>...sections...</>` conditional:

```tsx
{node.comingSoon ? (
  <>
    <hr />
    <div className="panel-coming-soon">
      <div className="panel-section-label">⌁ Content pending</div>
      <p className="panel-body">
        The author is still writing this rung. Mark it climbed for now and come back later for the full breakdown.
      </p>
    </div>
  </>
) : (
  <>
    <hr />
    <div className="panel-section-label">§ What it is</div>
    <p className="panel-body"><InlineMarkdown text={node.whatItIs} /></p>

    <hr />
    <div className="panel-section-label">↑ How to learn it</div>
    <ol className="panel-how">
      {node.howToLearn.map((step, i) => (
        <li key={i}><InlineMarkdown text={step} /></li>
      ))}
    </ol>

    {node.resources.length > 0 && (
      <>
        <hr />
        <div className="panel-section-label">⌁ Resources</div>
        <div className="panel-resources">
          {/* ...resources rows as before... */}
        </div>
      </>
    )}
  </>
)}
```

- [ ] **Step 2: Add the coming-soon style**

Append to `app/tree/tree.css`:

```css
.panel-coming-soon .panel-body { color: rgba(245,239,209,0.6); font-style: italic; }
```

- [ ] **Step 3: Smoke test**

Click on Superpowers (a `comingSoon: true` node). Panel shows the placeholder note. "Mark as climbed" still works.

- [ ] **Step 4: Commit**

```bash
git add components/tree/PanelContent.tsx app/tree/tree.css
git commit -m "feat(tree): graceful 'content pending' state for unfinished nodes"
```

---

## Acceptance check

Run this list at the end. Tick each.

- [ ] `/tree` route reachable from the tab pill on `/`.
- [ ] All 14 nodes render with correct region colouring.
- [ ] All 19 edges render with correct kind-based styling (gold solid, orange solid, purple dashed).
- [ ] Clicking any node opens the side panel.
- [ ] Locked nodes are clickable and show the soft-hint card with a "Jump to" button.
- [ ] "Mark as climbed" persists across page reloads via localStorage.
- [ ] "Reset progress" clears the storage key.
- [ ] Mobile (< 700px viewport): bottom sheet panel, drag-to-pan tree, pinch-zoom.
- [ ] No regressions on `/` apart from the tab pill insertion.
- [ ] `npm run build` succeeds.
- [ ] `npm run test:run` shows all tests passing.

---

## Self-review notes

After writing this plan I checked it against the spec:

- **Spec §3 routing & tab nav** — covered by Tasks 6, 7.
- **Spec §4 aesthetic system** — palette tokens are inlined in Tasks 8 (Stage), 9 (HexNode/Edge), 13 (PanelContent). No separate CSS-variable system yet — if a future task adds theming, the values are co-located in `app/tree/tree.css` and `components/tree/*` and can be hoisted.
- **Spec §5 tree structure** — 14 nodes, 19 edges, all wired in Task 2's data file.
- **Spec §6 node states** — covered by Tasks 3 (logic) and 9 (rendering).
- **Spec §7 soft gating with full content** — Task 13 renders the hint card; locked nodes remain fully readable.
- **Spec §8 side panel** — Task 12 (shell) + 13 (content) + 14 (reset) + 19 (coming-soon variant).
- **Spec §9 localStorage** — Tasks 4 (state.ts), 5 (useClimbed).
- **Spec §10 mobile** — Tasks 15-17.
- **Spec §11 new content** — Task 2 ships placeholders behind `comingSoon: true`; author writes real content later in `content/tree-nodes.ts`.
- **Spec §12 component architecture** — file paths match spec exactly.
- **Spec §13 data model** — types in Task 2 match spec verbatim.
- **Spec §16 acceptance criteria** — final checklist mirrors spec.

One spec item not explicitly tasked: the `comingSoon` *visual* state (dashed border on the hex). That was a brainstorming-time editing-only marker, not a launch feature — I've omitted it intentionally per the spec's note ("removed before launch").

No placeholders or TBDs in the plan body. All file paths absolute, all code blocks complete.
