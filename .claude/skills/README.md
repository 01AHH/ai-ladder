# Skills

This folder ships with the repo. Anyone who clones it and opens it in [Claude Code](https://claude.com/claude-code) inherits these skills automatically. They turn a general LLM into a project-specific collaborator.

A **skill** is a small Markdown file with YAML frontmatter that Claude loads on demand. The frontmatter `description` tells Claude when to use it; the body tells Claude *how*. Think of it as injected behaviour — not just knowledge.

## What's in here

### Project-bespoke skills

| Skill | When it fires |
|---|---|
| [`simplest-path`](./simplest-path/SKILL.md) | Any technical decision, migration, or architecture choice. Forces the cheapest workable answer first. |
| [`sweeping-the-codebase`](./sweeping-the-codebase/SKILL.md) | Renames or refactors that span multiple files. Discover before edit. |
| [`bugfix`](./bugfix/SKILL.md) | A bug is reported. Gates you to Q&A before reading any file. |
| [`hygiene`](./hygiene/SKILL.md) | Repo cleanup — dead components, unused routes, dependency drift, secrets. |

### Process skills (from [superpowers](https://github.com/obra/superpowers))

Copied under MIT (see [`LICENSE-superpowers`](../../LICENSE-superpowers)).

| Skill | When it fires |
|---|---|
| [`brainstorming`](./brainstorming/SKILL.md) | Any creative work — features, components, behaviour changes. Required before implementation. |
| [`writing-plans`](./writing-plans/SKILL.md) | You have a spec or requirements and need a multi-step plan before touching code. |
| [`test-driven-development`](./test-driven-development/SKILL.md) | Implementing any feature or bugfix. Tests first. |
| [`verification-before-completion`](./verification-before-completion/SKILL.md) | About to claim "done", "fixed", or "passing". Run the check first. |
| [`systematic-debugging`](./systematic-debugging/SKILL.md) | Any unexpected behaviour or failing test. Evidence before hypothesis. |

## Want the full superpowers set?

The five skills above are a curated subset. The full plugin includes nine more (`executing-plans`, `finishing-a-development-branch`, `requesting-code-review`, `receiving-code-review`, `using-git-worktrees`, `dispatching-parallel-agents`, `subagent-driven-development`, `writing-skills`, `using-superpowers`). Install the plugin for the full set:

```
/plugin install superpowers@claude-plugins-official
```

## Why ship skills in the repo?

Because the repo *is* the content. The AI Ladder teaches that prompting → vibe coding → coding agents → APIs → knowledge systems → integrated systems is a real progression. Skills are the **knowledge systems** rung made concrete: clone this repo and you don't just get a Next.js app — you get the working agent that built it.
