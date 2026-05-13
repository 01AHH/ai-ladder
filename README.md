# AI Ladder

Seven rungs. See one vivid example of what's possible at each level of AI capability, personalised to you, then take one small step.

## The rungs

1. **Prompting** — using Claude.ai or ChatGPT well
2. **Vibe coding** — Lovable, v0, Bolt
3. **Coding agents** — Claude Code, Cursor
4. **Repo structure** — markdown as memory, the repo as your second brain
5. **APIs** — calling Claude directly from your own code
6. **Knowledge systems** — memory, retrieval, **skills**
7. **Integrated systems** — agents that read, write, act across tools

## Running locally

This project is open source (MIT). The hosted version runs on my Anthropic key. If you clone or fork the repo, you'll need to supply **your own `ANTHROPIC_API_KEY`** to run it. Grab one from [console.anthropic.com](https://console.anthropic.com/) (free credits on signup; pay-as-you-go after that).

```bash
cp .env.example .env.local        # paste your ANTHROPIC_API_KEY here
npm install
npm run dev
```

Open http://localhost:3000.

## The repo is the content

Clone this repo and you get more than a Next.js app — you get the working agent. See [`.claude/skills/`](./.claude/skills) for the nine skills that ship with it. Open the repo in [Claude Code](https://claude.com/claude-code) and they load automatically.

This is rung 6 made concrete: a skill is not just knowledge, it's injected behaviour. Prompting changes one conversation. Memory changes what Claude knows. A skill changes what Claude *does*, every time the trigger fires.

## Stack

Next.js 15 App Router · TypeScript · Tailwind · [`@anthropic-ai/sdk`](https://www.npmjs.com/package/@anthropic-ai/sdk) (streaming) · `claude-sonnet-4-6` · Vercel.

## Layout

```
app/             # page + streaming API route
components/      # ContextInput, Rung, StreamedOutput
content/rungs.ts # seven rung definitions
content/essays/  # long-form essays attached to specific rungs
prompts/coach.md # system prompt
lib/             # prompt loader, rate limit
.claude/skills/  # ships with the repo — see README inside
docs/            # design spec + implementation plan
```

## License

MIT for the app code. Skills under `.claude/skills/` copied from [superpowers](https://github.com/obra/superpowers) (MIT, Jesse Vincent) — see `LICENSE-superpowers`.
