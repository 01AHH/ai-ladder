# Briefing Claude on the AI Ladder

Paste this when you want Claude (any surface — Claude.ai, Claude Code, an API call) to help me design something for the AI Ladder. Read end to end before proposing anything.

---

## What this is

The AI Ladder is a single-page site that walks one person up seven rungs of AI capability, in order, with one personalised example per rung. The reader types one paragraph about themselves at the top. Each rung shows what they could do at that level — not generically, but tailored to the work they actually do. Each rung ends with a Socratic line that pulls them up to the next.

It is not a course. It is not a curriculum. It is not a checklist. It is a one-page field guide with a coach, that ends with the reader knowing the smallest concrete thing they could do this week.

## Who it's for

Smart, curious people who feel slightly behind on AI. PMs. Founders. Marketers. Designers. The real-estate agent who hates spreadsheets. The solo founder who has tried ChatGPT but not Claude Code. They don't need to be told AI is changing things. They need to be shown what changes for *them*, specifically, in five minutes.

## The seven rungs

1. **Prompting** — Claude.ai, ChatGPT, the conversation
2. **Vibe coding** — Lovable, v0, Bolt
3. **Coding agents** — Claude Code, Cursor
4. **Repo structure** — markdown as memory, the repo as second brain
5. **APIs** — Claude as a library call
6. **Knowledge systems** — memory, retrieval, *skills*
7. **Integrated systems** — agents with hands on your stack

Each rung has: a name, a one-paragraph definition, a seed example visible by default, a "Generate my example" button that streams a personalised walkthrough from Claude, and a one-sentence bridge that pulls the reader up to the next rung. Rung 6 is the climax — it inverts to dark mode and replaces the seed with a "your skill shelf" treatment because skills are the punchline of the whole ladder.

## Voice

Direct. Founder-level. Warm. Short. No em dashes. No corporate language. No hedging. Lead with the point, not the context. Speak to one reader, not an audience.

## Aesthetic

Editorial newspaper, not SaaS dashboard. Instrument Serif for display, JetBrains Mono for meta, Source Serif for body. Warm cream paper, ink-black type, one accent colour. One page, one column, one ladder. The reference points are Edward Tufte, a magazine spread, *Monocle*, a really good zine. The reference points are NOT a landing page, a Notion template, or a YC company homepage.

No animated gradients. No glassmorphism. No "trusted by" logo strip. No social proof carousel. No CTA banner urging signup. No newsletter modal.

## The repo is the content

This project is fully open source (MIT). The repo itself is rung 4 made visible: `CLAUDE.md` at the root, `prompts/coach.md` is the system prompt for the streaming coach, `content/rungs.ts` is the seven rung defs, `content/essays/` holds long-form essays attached to specific rungs, `.claude/skills/` ships with the working agent. Anyone forking the repo brings their own Anthropic key and runs their own copy. This recursion — *the repo is itself an example of the rung it teaches* — is load-bearing for the project's credibility and should be preserved in any design move.

## What good looks like

- A first-time reader scrolls the whole thing in under three minutes and lands on one specific action they can take tonight.
- The page feels handmade. Considered. Like one person wrote it for one reader.
- Generated examples *transform* the page. A reader sees their own work reflected in the example, not a generic prompt.
- Each bridge between rungs is a punchline, not a transition.
- The page is readable on a phone without a separate mobile design.

## What to avoid

- Anything that says "AI revolution" or "transform your business."
- Generic example prompts ("write a marketing plan").
- Sales-page tropes: testimonials, "Get started free" buttons, urgency banners, founder portraits in circles.
- "Hello!" intros from the coach. The coach starts mid-sentence and gets to the point.
- Treating the seven rungs as sequential mandatory steps. They're a map, not a curriculum.
- Adding features the spec called "out of scope": auth, accounts, saved examples, persona presets, conversational chat mode.

## How I'd like you to engage

Push back. Ask the sharp question I'm avoiding. If the direction is wrong, say so directly. When a decision has real tradeoffs, propose two or three concrete alternatives with the tradeoffs named, and tell me which one *you'd* pick and why. Don't give generic feedback. Tell me what *this specific design* should do that it doesn't, and what it shouldn't do that it does.

Ready when you are.
