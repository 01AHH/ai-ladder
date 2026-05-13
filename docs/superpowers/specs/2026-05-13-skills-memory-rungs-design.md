# Skills + Memory as their own rungs

## The problem

The current ladder has 7 rungs. Rung 6 is "Knowledge systems" and silently overloads three orthogonal concepts: skills, memory, and (via cross-reference) repo structure. Skills land only on Rung 6, late, as a punchline — by which point any reader who isn't already on Claude Code has lost the thread.

A reader at Rung 3 (Coding agents) has the agent installed but no path between "installed it" and "rewired my whole repo around it." The Skills rung fills that gap: drop a folder of someone else's expertise into `.claude/skills/`, and the agent gets disciplined without any change to your repo.

## The change

8 rungs. Old Rung 6 dissolves into three discrete, ordered upgrades. The synthesis ("knowledge system") emerges in the reader's head, not on a tile.

| # | Rung | Status |
|---|---|---|
| 1 | Prompting | unchanged |
| 2 | Vibe coding | unchanged |
| 3 | Coding agents | unchanged |
| 4 | **Skills** | **new** |
| 5 | **Memory** | **new** |
| 6 | Repo structure | was Rung 4 (rewritten) |
| 7 | APIs | was Rung 5 |
| 8 | Integrated systems | was Rung 7 |

The ordering is ascending effort: Skills (drop in a folder, an hour) → Memory (write your own facts, a weekend) → Repo structure (reorganise the whole substrate, a weekend). Take → write → architect.

## Why dissolve Knowledge systems

"Knowledge system" is what emerges *when skills + memory + repo structure compose*. It is not itself a primitive. Naming it as a rung forces the reader to learn three primitives in one tile and prevents Skills from getting the dedicated treatment it has earned at this point in the technology cycle.

The climax line — *"A prompt is something you write once. A skill is something the model does forever"* — moves to the new Skills rung where it sits naturally.

## Rung 4 — Skills

- **Tagline:** Behaviour you can install
- **Time:** ~an hour
- **Tools:** Claude Code skills · `.claude/skills/` · superpowers
- **Scene:** new `skills` palette (slate/steel — `#3F4F58` bg, `#DDE4E8` ink, `#E8A046` copper accent)
- **mediaImage:** none (the skill cards do the visual work)
- **Skill cards:** three real, shipping skills from this repo's `.claude/skills/`:
  - `brainstorming` — forces multi-choice questions + a design before any code
  - `test-driven-development` — failing test first, then implementation
  - `verification-before-completion` — run the command, paste the output, then claim done
- **Crit line:** *"A prompt is something you write once. A skill is something the model does forever."* (moved from old Rung 6)
- **Socratic bridge:** *"What if the agent didn't just do the same thing every time, but remembered you between sessions?"*
- **bridgeTarget hook:** *"You can install behaviour. Now install context — Memory."*
- **Brief (for API prompt):** Skills are markdown files with frontmatter (`name`, `description`) and a body. They live in `~/.claude/skills/` (user-level) or `.claude/skills/` (per-repo). Claude matches the `description` field against the task to decide whether to invoke. This repo ships nine of them under `.claude/skills/`. The personalised output should help the user identify a workflow they repeat ten times a week and sketch a single skill that would replace that repetition.

## Rung 5 — Memory

- **Tagline:** Knowledge you can install
- **Time:** ~a weekend
- **Tools:** CLAUDE.md · `/memory` · Anthropic memory tool
- **Scene:** new `memory` palette (sandstone — `#A88B62` bg, `#231811` ink, `#3F4F58` accent echoing back to Skills)
- **mediaImage:** none
- **Seed example:** *"Move every standing fact about your team — names, roles, tools, the no-list — into a `/memory` folder. Watch the next conversation skip the warm-up."*
- **Definition:** absorbs the "AI sceptic / compounding" paragraph from the current Rung 4. Centres the practice of writing facts into files instead of repasting them.
- **Socratic bridge:** *"What if the whole working substrate was built for the model on purpose?"*
- **bridgeTarget hook:** *"You've taught it what to do, and what you know. Now give it a home."*

## Rung 6 — Repo structure (rewrite)

- **Tagline:** The working substrate · home for both
- **Time:** ~a weekend
- **Tools:** CLAUDE.md · /.claude · /memory · /personas · /prompts
- **Scene:** `repo` palette (unchanged)
- **mediaImage:** unchanged — `rung-4-claude-md.png` (contribution graph). File name not renamed to avoid git rename churn.
- **Essay:** `repoStructureEssay` stays attached — it tells the Skills + Memory + Repo arc as one story and serves as the synthesis-rung pull-quote.
- **Definition:** strips out the memory/compounding framing (now lives on Rung 5). New framing centres the *architecture*: every folder is for the model as much as for you. Skills are the behaviour you install. Memory is the knowledge you install. The repo is the home you give both.
- **Socratic bridge:** unchanged — *"What if the model didn't live in a chat window at all?"*
- **bridgeTarget hook:** unchanged — *"Your repo is now a brain. But it's still a place you go. What if Claude lived inside your product instead?"*

## Other rungs

- **Rung 7 (APIs):** content unchanged. Renumbered from 5. `bridgeUptag` updated from "Rung six · the climax" to "Rung eight" — the socratic punchline "What if it remembered you between calls?" is replaced because memory is now an earlier rung. New bridge: *"What if the model didn't just answer, but acted?"*  Target hook: *"Claude is now a function in your stack. The last move: hands."*
- **Rung 8 (Integrated systems):** content unchanged. Renumbered from 7. `bridgeUptag` updated.

## Plumbing

- `content/rungs.ts` — full rewrite of the array. Add Skills + Memory entries, rewrite Repo structure, renumber + rewire bridges.
- `app/globals.css` — add `body.scene-skills` and `body.scene-memory` palettes. No deletion of `body.scene-climax` (it's still used by hero/step palette transitions? — check; if unused, delete in a follow-up, not here).
- `components/RungIndex.tsx` — add `skills` and `memory` keys to `SCENE_COLOR` and `TAGS`. Update header text from "The seven rungs" to "The eight rungs."
- `components/LadderViz.tsx` — recompute `TICKS` y positions for 9 entries (hero + 8 rungs + step) within the 0–820 viewBox. Spacing ≈ 82px. Add `skills` and `memory` ticks; rename `climax`→ drop entirely.
- `README.md` — rewrite the rung list (lines 7-13) and the layout comment ("seven rung definitions" → "eight rung definitions").
- `prompts/design-brief.md` — update the seven-rungs paragraph (lines 17-27), update line 41 reference from "rung 4 made visible" to "rungs 4-6 made visible," update line 57 reference to seven rungs.

## Out of scope

- Renaming `rung-4-claude-md.png` (file name doesn't need to match rung number).
- Rewriting `repoStructureEssay` — the essay tells the whole arc and reads fine on the synthesis rung.
- New skill cards beyond the three named here (brainstorming, TDD, verification-before-completion) — the others can be referenced via "this repo ships nine" without listing each one.
- Touching the streamed-output API route (`app/api/generate/route.ts`) — it iterates the rungs array, so it picks up new rungs automatically. The system prompt at `prompts/coach.md` should still hold; sanity-check it during verification.

## Verification

- `npm run dev`, scroll the page, confirm:
  - Eight rungs render in order with new palettes.
  - LadderViz climber tracks correctly to each new rung.
  - RungIndex jump-nav links and tag copy match.
  - Each bridge reads as a punchline pulling to the next rung.
  - "Generate my example" still fires and streams for each rung (including the two new ones).
- Check on mobile width.
- Type check (`npx tsc --noEmit`) — the `Rung` type is unchanged, so should pass without churn.
