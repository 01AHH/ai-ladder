---
name: sweeping-the-codebase
description: Use when a single conceptual change must propagate across many surfaces — renames, identifier changes, file moves, env var shifts, API contract updates, or brand alignment. Stops "I updated the obvious 5 places and missed the other 5."
disable-model-invocation: false
---

# Sweeping the Codebase

## Core principle

**Discovery is the hard part, not editing.** Most cross-cutting changes fail because someone updates the obvious files and forgets the rest. Run a comprehensive grep first, categorize every hit, decide change-or-leave per category, then execute and verify.

The five phases: **Discover → Categorize → Decide → Execute → Verify.** Skipping Categorize and Decide is what makes sweeps brittle.

## When to use

- User says "rename X to Y everywhere"
- User says "clean up naming" / "align with X convention"
- User says "we need to update X across the codebase"
- A change involves a string, identifier, file path, or env var that appears in code, docs, configs, AND UI
- A file move requires updating imports
- An API contract change needs propagating to all callers + clients + docs

**Not for:** single-file edits, scoped refactors within one module, narrow bug fixes.

## Phase 1: Discover

Run a comprehensive grep across **all relevant file types** — not just source code. Most sweeps miss things because the grep was too narrow.

```bash
grep -rn -i "search-term" \
  --include="*.py" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" \
  --include="*.md" --include="*.html" --include="*.css" --include="*.scss" \
  --include="*.json" --include="*.toml" --include="*.yaml" --include="*.yml" \
  --include="*.sh" --include="*.bat" --include="Dockerfile" --include="Makefile" \
  --include="*.env.example" --include="*.sql" \
  /path/to/repo 2>/dev/null | grep -v node_modules | grep -v __pycache__ | grep -v dist | grep -v .git
```

Then list affected files only:

```bash
grep -rln -i "search-term" --include="*.py" --include="*.tsx" ... | sort -u
```

**Look at the count.** If you have 100+ hits, this is a real sweep. Plan for 15-30 min, not 5.

## Phase 2: Categorize

For each hit, classify by **surface type**. Different categories follow different rules.

| Category | What it is | Default decision |
|---|---|---|
| **User-visible strings** | UI text, labels, error messages, log lines shown to user | Change to match new term |
| **Public identifiers** | Exported class/function/type names, public API routes | Change; update all callers |
| **Internal identifiers** | Private helpers, local vars | Change if brand-bearing; leave otherwise |
| **File names / paths** | Module file names, asset paths | Change via `git mv` to preserve history |
| **Comments & docstrings** | Code commentary referring to the renamed thing | Change for accuracy |
| **Documentation** | README, architecture docs, in-repo specs | Change current-facing; preserve historical |
| **Test fixtures** | Sample data, snapshots, golden files | Change |
| **External contracts** | DB column names, env var names, API contract values, third-party client IDs | DANGEROUS — needs migration plan, may need to leave |
| **CSS class selectors** | `.cobbler-thing`, styling hooks | Usually leave — invisible to users, high churn |
| **localStorage / cache keys** | Persisted client state keys | Leave — breaks existing user state |
| **Backward-compat aliases** | Preserved old triggers, deprecated routes | Leave intentionally |
| **Historical records** | CHANGELOG entries, dated spec docs, git history | Leave — don't rewrite history |

## Phase 3: Decide

For every category above, make an **explicit yes/no** before opening any file. Write it down if the sweep is large.

Decision questions to ask:
- Is this user-visible? → Almost always change.
- Is this an external contract? → Check breaking-change implications first.
- Is this CSS / localStorage / cache key? → Leave unless you're prepared to migrate.
- Is this historical (changelog, dated spec)? → Leave.
- Is this a backward-compat alias the user deliberately preserved? → Leave.

When unsure, ask the user before editing — cheaper than reverting.

## Phase 4: Execute

- Use **`replace_all`** on the Edit tool when the search string is unambiguous across the file.
- Use targeted Edit (with surrounding context) when the same string appears in multiple senses and only some should change.
- Use **`git mv`** to rename files, not `mv` + new file — preserves git rename detection.
- Update dependent imports in the same logical step as the rename.
- For changes that touch stored state files (e.g. `data/bot_health.json` storing a now-renamed field), update those too — code defaults won't overwrite stale data.
- Batch independent edits in parallel; serialize when one depends on another.

## Phase 5: Verify

Mandatory checks before claiming done:

1. **Re-grep for the old term** (and case variants) to find stragglers
2. **Type check / build**: `npm run build` for TS, `python3 -c "import module"` for Python
3. **Spot-check user-visible labels** in the actual UI if possible
4. **Run tests** if the repo has them
5. **Check derived state files** (data JSON, generated configs) for stale cached values

Example verification pass:

```bash
# 1. Did anything escape the rename?
grep -rn -i "old-term" --include="*.{py,tsx,ts,md}" . | grep -v node_modules

# 2. Does the type checker still pass?
cd web && npm run build

# 3. Does the Python module still import?
python3 -c "import sys; sys.path.insert(0,'scripts'); import affected_module"
```

## Common mistakes

| Mistake | Fix |
|---|---|
| Greping only source code files (`.py`, `.ts`) | Include `.md`, `.html`, `.css`, `.json`, `.toml`, `.yaml`, `.env.example`, `Dockerfile` |
| Skipping the Categorize step and doing find-all-replace-all | Categorize first; some hits should never change (CSS classes, localStorage keys, historical changelogs) |
| Renaming a file with `mv` instead of `git mv` | Git loses rename detection, diffs become "deleted + new file" |
| Updating code but forgetting stored state | Data files cache old names; defaults in code don't override existing JSON |
| Renaming an env var without updating Railway/Vercel/deploy config | Production breaks on next deploy |
| Renaming a public API route without versioning | External callers break silently |
| Rewriting historical CHANGELOG entries | Loses context; only update current/forward-facing copy |
| "I'll just sed the whole repo" | Catches false positives in unrelated contexts (e.g. `cobbler` inside `cobbler_state.json` data values you don't own) |

## Real example: Cobbler naming sweep (2026-05-11)

The cobbler repo had three surfaces sharing the name "Cobbler" with no disambiguation:
- Frontend dashboard
- Status checker pet
- Telegram bot

After establishing the canonical names (The Cobbler / Cobbler Jr / Cobbler Messages), the sweep covered 147 references across 22 files.

Breakdown by decision:
- **Changed**: brand labels in `App.tsx`, `index.html`, login screen, popovers; Telegram bot self-references ("Cobbler is online" → "Cobbler Messages is online", daily heartbeat ping); internal types (`CobblerPet` component → `CobblerJr` via `git mv`, `CobblerMood` → `CobblerJrMood`, `getCobblerMoodFromTests` → `getCobblerJrMoodFromTests`); stored state in `data/bot_health.json` (`character_name`)
- **Deliberately left**: CSS class selectors (`.cobbler-sprite` etc. — styling hooks, invisible to users), `beeper_auth.py CLIENT_ID = "cobbler"` (Beeper API contract), `cobbler_handler.py` module (different surface — Beeper handler, not Telegram bot), `@cobbler` Beeper trigger (preserved alias), historical UPDATES.md entries, localStorage key `'cobbler-locked'`

Took ~20 minutes including verification. Build passed clean. Re-grep found zero stragglers.

## Output template for big sweeps

When reporting back to user, structure as:

```
**Changed** (brand alignment):
- file:line — old → new
- file:line — old → new

**Deliberately left** (with reason):
- file:line — reason
- file:line — reason

**Verification:**
- [ ] Build/typecheck passed
- [ ] Re-grep clean
- [ ] Stored state updated
- [ ] Dependent configs updated
```

This makes it easy for the user to spot anything they disagree with before merge.
