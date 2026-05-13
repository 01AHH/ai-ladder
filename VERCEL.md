# Vercel Setup Status

**As of 2026-05-13:** Not set up.

## Current state

- No `.vercel/` directory (project not linked)
- No `vercel.json` or `vercel.ts`
- Vercel CLI not a project dependency
- Next.js 15 app with `.env.local` (holds `ANTHROPIC_API_KEY`) — ready to deploy, just not linked

## To set up

1. `vercel link` — link this repo to a Vercel project
2. `vercel env pull` — sync env vars from Vercel into `.env.local`
3. `vercel deploy` — preview deploy
4. `vercel deploy --prod` — production deploy

Or import via the Vercel dashboard from GitHub.

## Notes

- Local Vercel CLI is outdated (52.0.0 → 53.4.0). Upgrade: `npm i -g vercel@latest`
- `ANTHROPIC_API_KEY` from `.env.local` will need to be added to Vercel project env vars before deploy works
