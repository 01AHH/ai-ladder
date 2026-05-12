# AI Ladder: Design Spec

**Date:** 2026-05-12
**Repo:** `01AHH/ai-ladder` (public)
**Status:** Design approved. Pre-implementation.

---

## The problem

People who want to "get into AI" don't know where they are on the curve, what's possible at the next level, or how to take one concrete step. The internet has two extremes: passive content (read a post, watch a video) and high-friction doing (open Cursor, sign up for an API, scaffold a project). Almost nothing lives in the middle: see one vivid example tailored to *you*, then do one small thing.

## What we're building

A single-page site that walks a user up a six-rung AI capability ladder. The user types their own context once at the top. Each rung shows a Claude-generated, personalised example of what they could do at that stage, ending with a Socratic question that pulls them into the next rung. The repo IS the content. Public on GitHub, deployed to Vercel.

## The ladder (six rungs)

1. **Prompting**: using Claude.ai or ChatGPT well. The base layer.
2. **Vibe coding**: Lovable, v0, Bolt. Shipping a UI by describing it.
3. **Coding agents**: Claude Code, Cursor. Editing real code by chatting.
4. **APIs**: calling Claude directly from your own code.
5. **Knowledge systems**: giving Claude persistent context. Memory, retrieval, skills.
6. **Integrated systems**: agents that read, write, and act across tools (Gmail, Calendar, Slack, your DB).

## Card anatomy

Each rung is one card. Each card has four parts and nothing else:

1. **Rung name** + one-sentence definition.
2. **Static seed example**: a short, vivid description of what's possible at this rung, visible by default so the page never looks empty.
3. **"Generate my example" button**: hits the API with `(user_context, rung_id)`, streams a personalised walkthrough below. Includes the actual prompt, URL, or code the user would use.
4. **Bridge question**: the last line of the streamed output. A Socratic nudge that points to the next rung.

## Top-of-page context input

One textarea at the top: *"Tell Claude about you. What do you do, what do you care about, what are you stuck on?"*

State lives in the browser only (React state). The same context is sent with every "Generate my example" call. No persistence, no auth.

If the context field is empty when a generate button is clicked, the card pings the API with a "we need more info" sentinel and the coach asks the user for context before generating.

## The coach skill

Stored at `prompts/coach.md` in the repo as a single system prompt. Read by the API route at request time so iterating on the prompt does not require redeploys-of-code (only redeploys-of-content).

The prompt takes four variables:

- `user_context`: whatever the user typed at the top
- `rung_id`: e.g. `prompting`, `apis`
- `rung_brief`: one-paragraph definition of the rung
- `bridge_target`: the next rung's name and one-line hook

The prompt returns:

1. A concrete "you could do X right now" walkthrough tailored to the user's context. Includes the literal prompt, URL, or snippet they'd use. Must be doable in under five minutes.
2. A one-sentence Socratic bridge to `bridge_target`.

Tone: direct, founder-level, warm, short. No em dashes. No corporate language. No hedging.

## Bridges between rungs

The exact bridge copy will be in `prompts/coach.md` as a lookup table. The intent:

- Prompting → Vibe coding: "Your prompt works. What if it was a webpage?"
- Vibe coding → Coding agents: "Lovable shipped it. But you want a specific change it can't quite get. That's where an agent comes in."
- Coding agents → APIs: "The agent edits files. But what if Claude was inside your product, not just your editor?"
- APIs → Knowledge systems: "You're calling Claude programmatically. But it forgets everything. What if it knew you?"
- Knowledge systems → Integrated systems: "Claude knows your context. But it just sits there. What if it acted?"
- Integrated systems → (end): "You've built a system that acts on your behalf. Now what's the next system you'd hand off?"

## Architecture

```
Browser (Next.js App Router page)
    │
    │ POST /api/generate { context, rung_id }
    ▼
Serverless route (app/api/generate/route.ts)
    │
    │ reads prompts/coach.md, fills variables
    │ calls Anthropic SDK with streaming
    ▼
Anthropic API (claude-sonnet-4-6)
    │
    │ streamed tokens
    ▼
Browser renders inline under the card
```

### Stack

- **Framework:** Next.js 15+, App Router, TypeScript.
- **Hosting:** Vercel. One project. Production = `main` branch.
- **AI:** Anthropic SDK (`@anthropic-ai/sdk`), streaming responses, model `claude-sonnet-4-6`.
- **Styling:** Tailwind. Minimal, opinionated, readable. Light mode first.
- **Env:** `ANTHROPIC_API_KEY` only. Server-side only, never exposed to the browser.

### File layout

```
ai-ladder/
├── README.md
├── package.json
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── .env.example
├── .gitignore
├── prompts/
│   └── coach.md                # The coach skill
├── content/
│   └── rungs.ts                # Six rung defs: id, name, definition, seed example, bridge
├── app/
│   ├── layout.tsx
│   ├── page.tsx                # The whole UI
│   ├── globals.css
│   └── api/
│       └── generate/
│           └── route.ts        # Streams Claude output
├── components/
│   ├── Rung.tsx                # One card
│   ├── ContextInput.tsx        # Top textarea
│   └── StreamedOutput.tsx      # Renders streamed tokens
└── docs/
    └── superpowers/
        └── specs/
            └── 2026-05-12-ai-ladder-design.md
```

## Data flow

1. User loads `/`. Sees title, context textarea, six rung cards each showing the seed example.
2. User types context. State held in a single top-level React state.
3. User clicks "Generate my example" on any card.
4. Card sends `POST /api/generate { context, rung_id }`.
5. Route loads `prompts/coach.md`, looks up `content/rungs.ts` for `rung_brief` and `bridge_target`, calls Anthropic with streaming.
6. Streamed tokens render under the card.
7. User scrolls to the next card. Repeat.

## Failure modes

| Failure | Behaviour |
|---|---|
| Empty context | API responds with a short "tell me more about you first" message. UI scrolls to the context input. |
| API key missing or invalid | Static seed examples still render. Generate button shows "Set ANTHROPIC_API_KEY to try this." |
| Anthropic API error / timeout | Inline message: "Claude couldn't generate. Try again." |
| Cost spike from abuse | Per-IP soft cap: 10 generations per IP per day, tracked in serverless route memory. Good enough for day one. Upgrade to KV later. |
| Browser refresh | All state lost. Acceptable for v1. |

## Out of scope for v1

- Auth, accounts, sessions.
- Saving generated examples.
- Analytics beyond Vercel's built-in.
- Persona presets ("I'm a founder / marketer / engineer").
- Per-card context refinement (input is top-of-page only).
- A conversational chatbot mode.
- A scrollable feed of community-contributed examples.
- Multi-language support.
- Mobile-specific layout (default responsive is fine).

All of these can be layered on later without rewriting v1.

## Testing

For a 4-hour ship, testing is manual:

- Each rung's generate button produces a sensible output for two contrasting test contexts ("real estate agent who hates spreadsheets", "indie hacker building a SaaS").
- Empty context triggers the "tell me more" path.
- Missing API key path renders cleanly.
- Mobile width (~375px) is readable. Tap targets work.

No automated tests in v1. Worth adding later.

## Time budget

| Phase | Minutes |
|---|---|
| Repo init, Vercel link, env var | 20 |
| Next.js scaffold, page layout, six cards, scroll feel | 45 |
| API route + Anthropic SDK + streaming | 30 |
| `prompts/coach.md` + `content/rungs.ts` (briefs, seeds, bridges) | 45 |
| Polish copy, hit each card live, push, deploy | 30 |
| Buffer | 30 |
| **Total** | **3h 20m** |

Target ship: 5pm local on 2026-05-12.

## Open questions

None. Ready to plan implementation.
