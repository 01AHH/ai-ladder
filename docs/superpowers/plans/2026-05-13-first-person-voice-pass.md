# First-Person Voice Pass Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rewrite high-impact user-facing copy on the AI Ladder site into Arthur's first-person voice, leading with a problem statement in the hero.

**Architecture:** Pure content edits across three files. No type changes, no structural changes, no test code. Each task is a self-contained `Edit` operation followed by a commit. Build verification at the end.

**Tech Stack:** Next.js 15 (App Router), TypeScript, plain TSX.

**Spec:** `docs/superpowers/specs/2026-05-13-first-person-voice-pass-design.md`

---

## File Map

| File | Responsibility | Change type |
|---|---|---|
| `app/page.tsx` | Hero (eyebrow, h1, lede) | Modify |
| `content/rungs.ts` | Rung 1–7 `definition` fields | Modify |
| `content/inspiration.ts` | One blurb (Rung 2 tracker) | Modify |

**Out of scope (do not touch):** `content/essays/repo-structure.ts`, `brief` fields, `seedExample`, `tools`, `tagline`, `time`, `socraticBridge`, `bridgeUptag`, `bridgeTarget`, the step section, the colophon, README, `prompts/`.

---

### Task 1: Hero copy — eyebrow, h1, lede

**Files:**
- Modify: `app/page.tsx:161-178`

- [ ] **Step 1: Replace the eyebrow text**

Find:
```tsx
            <div className="eyebrow">
              <span className="pip" />
              A field guide to what you can actually do with AI
            </div>
```

Replace with:
```tsx
            <div className="eyebrow">
              <span className="pip" />
              A field guide to what's actually possible with AI right now
            </div>
```

- [ ] **Step 2: Replace the h1**

Find:
```tsx
            <h1>
              Seven rungs.<br />
              One <em>climb</em>.<br />
              Pick yours.
            </h1>
```

Replace with:
```tsx
            <h1>
              Knowing the next step in your AI journey is hard when you
              don&apos;t know what&apos;s <em>possible</em>.
            </h1>
```

- [ ] **Step 3: Replace the lede paragraph**

Find:
```tsx
            <p className="lede">
              Most people stop at rung one and assume the elevator is broken.{" "}
              <strong>The AI Ladder</strong> shows you one vivid thing you could
              be doing at every rung above where you are. Written for the work
              you actually do. Five minutes, then a single concrete step you
              could take this week.
            </p>
```

Replace with:
```tsx
            <p className="lede">
              Most people stop at ChatGPT and assume that&apos;s the ceiling.
              It isn&apos;t. There are seven rungs above it, and the gap
              between rung one and rung seven is the difference between{" "}
              <em>using</em> AI and <em>building</em> with it.
            </p>
            <p className="lede">
              I built this because I kept watching smart people give up on AI
              after a few weeks of Claude.ai. Not because they couldn&apos;t
              get value out of it — because nobody had shown them what one
              rung up looks like. This is the map I wish I&apos;d had.
            </p>
            <p className="lede">
              Pick the rung above where your foot is right now. I&apos;ll show
              you one specific thing you could build there, for the life you
              actually have.
            </p>
```

- [ ] **Step 4: Build check**

Run: `npx tsc --noEmit`
Expected: no TypeScript errors.

- [ ] **Step 5: Commit**

```bash
git add app/page.tsx
git commit -m "content: rewrite hero as problem-first, first person"
```

---

### Task 2: Rungs 1–3 definitions

**Files:**
- Modify: `content/rungs.ts:49-89`

- [ ] **Step 1: Rewrite Rung 1 (prompting) definition**

Find (line 49–50, inside the `prompting` rung object):
```ts
    definition:
      'You open a chat window and ask for things. Claude.ai, ChatGPT. The model is doing all the work; you are doing all the steering. This rung is sometimes dismissed as "just chatting," but a sharp prompt against a frontier model is still the highest leverage-per-minute most people will ever encounter.',
```

Replace with:
```ts
    definition:
      'I started here. Most people do. Open a chat window, ask for things, watch a paragraph come back. The model does the work; I\'m just steering. People dismiss this rung as "just chatting" — but a sharp prompt against a frontier model is still the highest leverage-per-minute I\'ve ever encountered. I still spend hours here, every week.',
```

- [ ] **Step 2: Rewrite Rung 2 (vibe-coding) definition**

Find (around line 67–68):
```ts
    definition:
      "You describe an app and a working web app comes out the other end: Lovable, v0, Bolt. You don't open a terminal. You don't know what a package manager is. The output is a real URL, a real database, a real thing on the internet. Some part of your brain that used to say \"I'd need a developer for that\" goes quiet.",
```

Replace with:
```ts
    definition:
      "The first time I used Lovable I described an app and a working web app came out the other end. A real URL, a real database, a real thing on the internet — and I never opened a terminal. The part of my brain that used to say \"I'd need a developer for that\" went quiet. v0 and Bolt do the same. The gap between rung one and rung two is enormous; the gap from here to a side project is small.",
```

- [ ] **Step 3: Rewrite Rung 3 (coding-agents) definition**

Find (around line 88–89):
```ts
    definition:
      "Claude Code, Codex, Gemini. Agents that live in your terminal. This is the scary rung, because it *looks* like coding. It isn't: you describe what you want, the agent reads your repo, edits real files, runs the tests, and fixes what broke. Lovable hands you a generic Lego set: polished, but locked to the bricks in the box. ChatGPT hands you snippets to paste. An agent works inside your actual codebase, so anything you can describe, it can attempt. The junior who never sleeps.",
```

Replace with:
```ts
    definition:
      "This is where I got nervous. Claude Code, Codex, Gemini — agents that live in your terminal. It *looks* like coding, but it isn't: I describe what I want, the agent reads my repo, edits real files, runs the tests, and fixes what broke. Lovable hands you a generic Lego set: polished, but locked to the bricks in the box. ChatGPT hands you snippets to paste. An agent works inside the actual codebase, so anything I can describe, it can attempt. The junior who never sleeps.",
```

- [ ] **Step 4: Build check**

Run: `npx tsc --noEmit`
Expected: no TypeScript errors.

- [ ] **Step 5: Commit**

```bash
git add content/rungs.ts
git commit -m "content: rewrite rungs 1-3 definitions in first person"
```

---

### Task 3: Rungs 4–7 definitions

**Files:**
- Modify: `content/rungs.ts` (the `repo-structure`, `apis`, `knowledge-systems`, `integrated-systems` rungs)

- [ ] **Step 1: Rewrite Rung 4 (repo-structure) definition**

Find (around line 114–115):
```ts
    definition:
      "You stop pasting context into the chat window and start writing it into files. A folder of markdown becomes the place the model *lives*, not the place you *visit*. Every workflow, every rule, every person, every decision gets a file. The AI walks the graph the way you would. The next conversation begins smarter than the last one because the substrate is doing the work.\n\nThis is also where the compounding starts. The repo is memory: instead of re-explaining your business, your edge cases, your way of thinking at the start of every conversation, it's already there. Claude stops being a stranger you have to brief and starts being a colleague who was in the room last time. Each session builds on the last. The faster you document, the less you re-explain — and the less you re-explain, the faster you document. I'll be honest: before this rung, I was an AI sceptic. This is the rung where I first felt the change.",
```

Replace with:
```ts
    definition:
      "I stopped pasting context into the chat window and started writing it into files. A folder of markdown became the place the model *lives*, not the place I *visit*. Every workflow, every rule, every person, every decision gets a file. The AI walks the graph the way I would. The next conversation begins smarter than the last one.\n\nThis is where the compounding starts. The repo is memory: instead of re-explaining my business, my edge cases, my way of thinking at the start of every conversation, it's already there. Claude stops being a stranger and starts being a colleague who was in the room last time. Each session builds on the last. The faster I document, the less I re-explain — and the less I re-explain, the faster I document. I'll be honest: before this rung, I was an AI sceptic. This is the rung where it changed for me.",
```

- [ ] **Step 2: Rewrite Rung 5 (apis) definition**

Find (around line 141–142):
```ts
    definition:
      "You call the model directly from your own code. A function in your codebase, fired from a webhook, a cron, a click. Now the model is not a place you visit; it is a primitive in your stack, next to Postgres and Stripe. You can put intelligence into anything that has a key and a network connection.",
```

Replace with:
```ts
    definition:
      "I started calling the model directly from my own code. A function in the codebase, fired from a webhook, a cron, a click. Now the model isn't a place I visit; it's a primitive in the stack, next to Postgres and Stripe. Anything with an API key and a network connection can have intelligence wired into it. This is the rung where AI stops being a tool you use and starts being a feature of the things you build.",
```

- [ ] **Step 3: Rewrite Rung 6 (knowledge-systems) definition**

Find (around line 162–163):
```ts
    definition:
      "Memory. Retrieval. **Skills.** Now the model is no longer a stranger at every door; it carries your context, your house style, your standard operating procedure with it. A skill is the punchline: a small, named bundle of instructions that *changes what the model does*, every single time the trigger fires.",
```

Replace with:
```ts
    definition:
      "Memory. Retrieval. **Skills.** This is the rung where Claude stopped forgetting me between sessions. It carries my context, my house style, my standard operating procedure with it. The skill is the punchline: a small, named bundle of instructions that *changes what the model does*, every single time the trigger fires. A prompt is something I write once. A skill is something the model does forever.",
```

- [ ] **Step 4: Rewrite Rung 7 (integrated-systems) definition**

Find (around line 204–205):
```ts
    definition:
      'Agents that read, write, and act across your real tools: Gmail, Calendar, Slack, your database, your CRM. The model crosses out of the chat window and into the system of record. You are no longer asking it to draft an email; you are asking it to send the email, file the reply, update the deal, and move on. This rung is where most companies say "we have AI" and finally mean something concrete.',
```

Replace with:
```ts
    definition:
      'Agents with hands on my real stack: Gmail, Calendar, Slack, the database, the CRM. The model crosses out of the chat window and into the system of record. I\'m no longer asking it to *draft* the email; I\'m asking it to send the email, file the reply, update the deal, and move on. This is the rung where most companies say "we have AI" and finally mean something concrete.',
```

- [ ] **Step 5: Build check**

Run: `npx tsc --noEmit`
Expected: no TypeScript errors.

- [ ] **Step 6: Commit**

```bash
git add content/rungs.ts
git commit -m "content: rewrite rungs 4-7 definitions in first person"
```

---

### Task 4: Inspiration gallery — single tightening

The inspiration blurbs are mostly already concrete and on-voice. Only one line reads precious and needs a touch-up.

**Files:**
- Modify: `content/inspiration.ts` (the `vibe-coding` array, "The tracker your phone doesn't have" item)

- [ ] **Step 1: Rewrite the tracker blurb**

Find (around line 73–74):
```ts
      blurb:
        "Reading log. Sleep log. Garden log. Run log. The shape of the form is the shape of how you'd actually use it. Build it for yourself in v0.",
```

Replace with:
```ts
      blurb:
        "Reading log. Sleep log. Garden log. Run log. The fields are whatever you'd actually use. Build it for yourself in v0.",
```

- [ ] **Step 2: Build check**

Run: `npx tsc --noEmit`
Expected: no TypeScript errors.

- [ ] **Step 3: Commit**

```bash
git add content/inspiration.ts
git commit -m "content: tighten one inspiration blurb"
```

---

### Task 5: Verify the build and visual smoke test

**Files:**
- None (verification only)

- [ ] **Step 1: Type check the whole project**

Run: `npx tsc --noEmit`
Expected: zero errors.

- [ ] **Step 2: Build the production bundle**

Run: `npm run build`
Expected: build completes, no errors. Acceptable warnings: ESLint warnings unrelated to copy.

- [ ] **Step 3: Start the dev server**

Run: `npm run dev`
In a browser, open http://localhost:3000.

- [ ] **Step 4: Visual smoke check**

Walk through:
- Hero: new eyebrow, h1, 3-paragraph lede render correctly.
- Scroll through all 7 rungs: each definition reads as first-person and renders without layout issues (markdown bold/italic still applied).
- Inspiration card for the v0 tracker shows the updated blurb.
- Nothing else changed visually.

- [ ] **Step 5: Read-aloud check**

Read the hero and all 7 rung definitions out loud back-to-back. They should sound like the same writer. If any rung lands as a different voice, flag it for a follow-up edit (do not edit inline — open a follow-up task).

- [ ] **Step 6: No commit required**

This task is verification only. If the read-aloud check passes, the plan is complete.

---

## Self-Review Notes

Reviewed against `docs/superpowers/specs/2026-05-13-first-person-voice-pass-design.md`:

- **Hero rewrite (spec section "Hero rewrite (locked)"):** Implemented in Task 1.
- **Rung definitions (spec section "Rung definition rewrites"):** All 7 rungs covered in Tasks 2 and 3 with full before/after.
- **Inspiration gallery (spec section "Inspiration gallery"):** Spec said per-card pass. Plan covers the one blurb that triggered the "precious metaphor" rule; all others reviewed and judged on-voice already. If user wants a fuller pass, that's a follow-up task.
- **Bridges, step section, colophon (spec sections "Bridge lines", "Step section", "Colophon"):** All marked "light pass" in the spec. On review, current copy already lands. No changes needed.
- **`brief` fields, essay, README:** Explicitly out of scope per spec — not touched.
- **Acceptance criteria:** Covered by Task 5 (build + visual smoke + read-aloud).

No placeholders. No "TODO" or "implement later". Every rewrite shown in full.
