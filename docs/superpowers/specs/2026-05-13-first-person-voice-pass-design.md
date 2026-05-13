# First-person voice pass on AI Ladder site copy

**Date:** 2026-05-13
**Owner:** Arthur
**Status:** Approved (hero direction + sample voice both confirmed by user)

## Problem

The site copy reads like an essayist channelling Arthur's voice rather than Arthur himself. The current hero ("Seven rungs. One climb. Pick yours.") is poetic but doesn't tell a first-time visitor what the site is or what problem it solves. The rung definitions lean on literary metaphor ("the substrate is doing the work", "a stranger at every door") in a way Arthur's actual essays don't.

The goal: rewrite the high-impact user-facing surfaces in Arthur's first-person voice, opening with a problem statement, while keeping the lines that already work.

## Voice reference

Source material: `~/Documents/Personal/arthur-ea/docs/writing/`
- `the-productive-ai-paradox.md`
- `old-wiring-new-world.md`
- `ai_deep_work_fragmentation.md`

Voice characteristics observed:
- First-person, anchored to specific moments ("I had five Claude Code terminals running last Tuesday")
- Names what he changed his mind about ("I used to think X. That isn't right.")
- Concrete numbers, dates, named tools
- Short sentences. Single-sentence paragraphs.
- Direct, founder-tone. No corporate hedging.
- Australian spellings (optimising, realised, recognise)
- Comfortable being a guide who's still figuring it out

## Scope (in)

1. **`app/page.tsx`**
   - Hero `eyebrow`, `h1`, `lede`
   - "Step" section h2 + lede ("The point is the step, not the ladder.")
   - Footer colophon wink
2. **`content/rungs.ts`** (per rung, rungs 1–7)
   - `definition`
   - `socraticBridge` (italic line shown after the rung)
   - `bridgeTarget.hook` (line under the bridge into the next rung)
3. **`content/inspiration.ts`**
   - `blurb` prose only
   - Keep `tool` field framing ("You, with X") — first person would break a "things you could build" gallery
   - Keep `title` strings unless one is clearly precious

## Scope (out, explicit)

- `content/essays/repo-structure.ts` — already in Arthur's voice, leave alone
- `brief` fields in `rungs.ts` — internal API-prompt input, not user-facing
- `seedExample` strings — concrete and working, leave alone
- `tools` arrays, `tagline`, `time`, `bridgeUptag` — labels/metadata
- README, `prompts/`, anything outside the three files above

## Hero rewrite (locked)

**Eyebrow:** A field guide to what's actually possible with AI right now

**H1:** Knowing the next step in your AI journey is hard when you don't know what's possible.

**Lede:**
> Most people stop at ChatGPT and assume that's the ceiling. It isn't. There are seven rungs above it, and the gap between rung one and rung seven is the difference between *using* AI and *building* with it.
>
> I built this because I kept watching smart people give up on AI after a few weeks of Claude.ai. Not because they couldn't get value out of it — because nobody had shown them what one rung up looks like. This is the map I wish I'd had.
>
> Pick the rung above where your foot is right now. I'll show you one specific thing you could build there, for the life you actually have.

## Rung definition rewrites (direction + Rung 1 sample)

Each rung definition shifts from second-person observational ("You open a chat window") to first-person reflective ("I started here. Most people do."). Keep the existing arc and named tools. Drop precious turns. Preserve lines that already work (e.g. "Lovable hands you a generic Lego set", "the junior who never sleeps").

**Rung 1 sample (approved):**
> I started here. Most people do. Open a chat window, ask for things, watch a paragraph come back. The model does the work; I'm just steering. People dismiss this rung as "just chatting" — but a sharp prompt against a frontier model is still the highest leverage-per-minute I've ever encountered. I still spend hours here, every week.

The remaining six rungs follow the same pattern: open with a personal moment or shift, deliver the concrete observation, keep one strong specific image per rung.

## Bridge lines

Current bridges are short italic Socratic questions ("What if it could touch the code you already had?"). These already work. Light pass only — keep the question form, tighten anywhere overly literary. No first-person required here; bridges are an editorial voice that sits above any one rung.

## Step section

Current h2 ("The point is the step, not the ladder.") already lands. Rewrite the lede ("Pick one. Block twenty minutes for it this week.") into the voice without losing the imperative. Step row `what` strings stay as written — they're already concrete imperatives aimed at the reader.

## Inspiration gallery

Per-card pass on `blurb` strings only. Goal: drop metaphor inflation ("the shape of the form is the shape of how you'd actually use it"), keep the specific imagery (chickpeas aisle, EXIF clustering). Sentence-short blurbs stay sentence-short.

## Colophon

Light pass on the footer wink lines ("Set in Instrument Serif…" + "the repo is the content"). Keep the typographic poetry but cut anything precious.

## Non-goals

- Restructuring rung order or content arc
- New essays or long-form prose anywhere
- Touching the streaming API output or `brief` prompts
- Style/CSS changes
- Editing inspiration card `title` strings unless one is obviously wrong

## Risks

- **Tone drift across 7 rungs.** Each rung must sound like the same writer. Mitigation: rewrite all seven in one pass, then a read-through edit pass.
- **Losing lines that work.** Some current copy is already strong (Lego set, junior who never sleeps, the place the model lives). Mitigation: explicit preservation list during implementation.
- **First-person fatigue.** Seven "I" stories in a row could feel narcissistic. Mitigation: every other rung opens with the reader observation, not the personal anecdote.

## Acceptance criteria

- Hero copy reads as problem-first and names what the site is in the first 30 words
- Every rung definition contains at least one first-person sentence anchored to Arthur's experience
- No preserved metaphors are dropped without a replacement that's at least as concrete
- Read-aloud pass: each rung sounds like the same writer
- Site still loads, no broken imports, no TypeScript errors

## Out of process

- Deploy to production after approval (separate, user-triggered)
- Apply the same voice pass to API-generated walkthroughs (separate spec; would touch `brief` fields and `prompts/coach.md`)
