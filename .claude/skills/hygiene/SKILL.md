---
name: hygiene
description: Code and repo hygiene review for a Next.js + Anthropic SDK app. Scans for dead components, unused API routes, unreferenced types, dependency drift, and security issues. Suggests what to archive or clean. Run via /hygiene.
disable-model-invocation: false
---

# Repo Hygiene Review

You are running a hygiene pass across this Next.js + Anthropic SDK project. The goal is to keep the codebase lean: find dead code, flag stale content, identify security issues. Present everything as suggestions for the user to approve. Do not auto-archive or auto-delete anything unless the user explicitly says to.

## Modes

- **`/hygiene`** (default): Suggest mode. Scan everything, present findings, wait for approval before acting.
- **`/hygiene --execute`**: Execute mode. After presenting findings, act on anything in the "Confident" tier without asking. Still ask about "Borderline" and "Review" tiers.

Default to suggest mode. Always.

## How archiving works (when approved)

- Archived files go to `.archive/` at the repo root, preserving directory structure.
  - Example: `components/Dead.tsx` moves to `.archive/components/Dead.tsx`
- Every archive action gets logged in `.archive/MANIFEST.md` with: file path, date, reason, and how to restore.
- The original file is deleted from its current location after copying to `.archive/`.
- If `.archive/` or `MANIFEST.md` don't exist yet, create them.

## Confidence tiers

Every finding gets classified into one of three tiers:

| Tier | Meaning | Default action |
|---|---|---|
| **Confident** | Definitely dead. Nothing references it anywhere. | Suggest archive. Execute in `--execute` mode. |
| **Borderline** | Likely dead but has an edge case. | Suggest archive with context. Always ask. |
| **Review** | Not dead, but stale or worth looking at. | Flag for review. Never auto-act. |

## Review areas

Run all area scans in parallel using subagents where possible.

---

### 1. `app/` — App Router routes and layouts

**What to scan for:**
- `page.tsx` / `layout.tsx` / `route.ts` files in directories that don't form valid App Router routes (e.g. typos, orphaned route groups)
- API routes in `app/api/**/route.ts` that have no fetch call from any client component
- Server actions that are never imported

**How to detect:**
- For each `route.ts`, grep all `.tsx`/`.ts` files outside `app/api/` for the route path (e.g. `/api/generate`)
- For each server action export, grep for its name across the project

**Suggestions:**
- Unused API routes: Borderline (might be planned or called externally)
- Orphaned page files: Confident if no link points to them

---

### 2. `components/` — React components

**What to scan for:**
- Components not imported by any other `.tsx` file
- Components imported only by another dead component (chain)
- TypeScript types/interfaces in `types.ts` (or equivalent) that are never imported

**How to detect:**
- For each `.tsx` in `components/`, grep all `.tsx` files for `from '@/components/<Name>'` or relative imports
- For each exported type, grep for its name across the project

**Suggestions:**
- Unreferenced components: Confident
- Chains of dead components: surface the whole chain

---

### 3. `prompts/` and `content/` — content files

**What to scan for:**
- Prompt files (e.g. `prompts/coach.md`) referenced by code paths that no longer exist
- Content files (`content/*.ts`) exporting data that nothing imports
- Outdated examples or seed content (last-modified > 30 days, marked TODO/TBC)

**How to detect:**
- Grep `app/` and `components/` for filenames in `prompts/` and `content/`
- Use `git log -1 --format=%ai -- <file>` for last modified dates

**Suggestions:**
- Unreferenced prompts/content: Borderline (content is cheap; might be planned)
- Stale content: Review

---

### 4. Dependency drift

**What to scan for:**
- Packages in `package.json` `dependencies` and `devDependencies` not imported anywhere
- Imports referencing packages not declared in `package.json`

**How to detect:**
- For each dep, grep `app/`, `components/`, `lib/` for `from '<package>'` or `require('<package>')`
- Watch for runtime-only deps (e.g. `tailwindcss` used via config, not import)

**Suggestions:**
- Unused deps: Confident (remove)
- Missing declarations: Confident (add)

---

### 5. Build artifacts and `.gitignore` health

**What to scan for:**
- `.next/`, `node_modules/`, `dist/` directories tracked by git
- `.env.local` or any `.env` (other than `.env.example`) tracked by git
- Files larger than 1MB in the repo

**How to detect:**
- Check `.gitignore` covers `.next/`, `node_modules/`, `.env*`, `*.log`
- `git ls-files` to find tracked files; flag any in those paths
- `find . -size +1M -not -path '*/node_modules/*' -not -path '*/.next/*'`

**Suggestions:**
- Missing gitignore entries: Confident
- Large unexpected files: Review

---

### 6. Secrets (every run)

**What to scan for:**
- `ANTHROPIC_API_KEY` or other API keys hardcoded in any file
- `.env.local` or service account files tracked by git
- Tokens leaked into committed code (`sk-`, `ya29.`, `Bearer ` patterns)

**How to detect:**
- `git ls-files` for `.env*` (except `.env.example`)
- Grep all source files for hardcoded key patterns
- Verify `.env.local` is in `.gitignore`

**Suggestions:**
- Tracked secrets: **Confident** (remove from tracking immediately, rotate the key, add to `.gitignore`)
- Hardcoded keys: **Confident** (move to env var)

---

### 7. `docs/` — design specs and plans

**What to scan for:**
- Specs marked "approved" or "implemented" that match completed work
- Plans more than 30 days old with no implementation activity

**How to detect:**
- Read each doc; check if described components/routes exist
- Check git log for activity after the plan date

**Suggestions:**
- Fully implemented + no remaining TODOs: Confident (archive)
- Abandoned: Borderline
- In progress: skip

---

## Output format

After scanning all areas, present a single summary grouped by confidence tier:

```
## Hygiene Report — <date>

### Confident (safe to act on)
| # | File | Issue | Suggested action |
|---|------|-------|-----------------|
| 1 | ... | ... | ... |

### Borderline (likely safe, but check)
| # | File | Issue | Context |
|---|------|-------|---------|
| 1 | ... | ... | ... |

### Review (needs human judgement)
| # | File | Issue | Suggested action |
|---|------|-------|-----------------|
| 1 | ... | ... | ... |

### Security
| # | File | Issue | Action |
|---|------|-------|--------|
| 1 | ... | ... | ... |

### Summary
- Total files scanned: X
- Confident suggestions: X
- Borderline flags: X
- Review items: X
- Security issues: X
```

Then ask: **"Which items do you want me to act on? Give me the numbers, or say 'all confident' to clear the safe tier."**

## Rules

- Default to suggest mode. Never auto-act unless `--execute` is passed.
- Never archive `.env.example`, `CLAUDE.md`, `README.md`, `.gitignore`, `LICENSE*`, `package.json`, or `next.config.*`
- Never archive anything in `.claude/`, `docs/`, or `prompts/` without explicit approval (these are content/config).
- When in doubt between Confident and Borderline, choose Borderline.
- After approved actions, stage and commit the changes with a descriptive message.
- Run all area scans in parallel for speed.

## Context (if provided)

$ARGUMENTS
