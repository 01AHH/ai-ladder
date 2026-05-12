# AI Ladder

Six rungs. See one vivid example of what's possible at each level of AI capability, personalised to you, then take one small step.

## The rungs

1. **Prompting** — using Claude.ai or ChatGPT well
2. **Vibe coding** — Lovable, v0, Bolt
3. **Coding agents** — Claude Code, Cursor
4. **APIs** — calling Claude directly from your own code
5. **Knowledge systems** — memory, retrieval, **skills**
6. **Integrated systems** — agents that read, write, act across tools

## Running locally

```bash
cp .env.example .env.local        # add your ANTHROPIC_API_KEY
npm install
npm run dev
```

Open http://localhost:3000.

## The repo is the content

Clone this repo and you get more than a Next.js app — you get the working agent. See [`.claude/skills/`](./.claude/skills) for the nine skills that ship with it. Open the repo in [Claude Code](https://claude.com/claude-code) and they load automatically.

This is rung 5 made concrete: a skill is not just knowledge, it's injected behaviour. Prompting changes one conversation. Memory changes what Claude knows. A skill changes what Claude *does*, every time the trigger fires.

## Stack

Next.js 15 App Router · TypeScript · Tailwind · [`@anthropic-ai/sdk`](https://www.npmjs.com/package/@anthropic-ai/sdk) (streaming) · `claude-sonnet-4-6` · Vercel.

## Layout

```
app/             # page + streaming API route
components/      # ContextInput, Rung, StreamedOutput
content/rungs.ts # six rung definitions
prompts/coach.md # system prompt
lib/             # prompt loader, rate limit
.claude/skills/  # ships with the repo — see README inside
docs/            # design spec + implementation plan
```

## License

MIT for the app code. Skills under `.claude/skills/` copied from [superpowers](https://github.com/obra/superpowers) (MIT, Jesse Vincent) — see `LICENSE-superpowers`.
