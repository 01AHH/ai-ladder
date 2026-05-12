---
name: bugfix
description: Use when a bug, unexpected behavior, or broken feature is reported, before reading any file or running any command
---

# Bugfix Investigation

## Overview

Information beats speed. The fastest path to a fix is fully understanding the system before touching anything.

**Hard gate:** Do NOT read any file, run any command, or form any hypothesis until Phase 0 is complete. No exceptions.

**Violating the letter of this process is violating the spirit of bug fixing.**

## Red Flags — You Are Skipping This Skill

- "Let me look at the recent changes to understand what's happening"
- "I'll check the code first"
- Reading git diffs before asking a single question
- Forming a hypothesis from file reads alone
- "I think the issue might be X" before the Q&A is complete

**All of these mean: STOP. Return to Phase 0.**

## Phase 0 — Q&A (one question at a time, no file access)

Ask these in order. Wait for each answer before asking the next.

1. What is the expected behavior?
2. What is the actual behavior — exactly what do you see?
3. Which parts of the system do you think are involved? (frontend, backend, Gmail, database, etc.)
4. What changed recently — code, config, deploys, anything?
5. What have you already tried or noticed?

Do not read any file or run any command between these questions.

## Phase 1 — System Map

Based only on what the user told you, write out the component flow:

```
[component A] → [component B] → [component C] → [output]
```

Mark where the break is most likely based on the answers. Present it and ask if the map looks right before proceeding.

## Phase 2 — Hand Off

Invoke `superpowers:systematic-debugging` to investigate and fix.

## Rationalization Table

| Thought | Reality |
|---------|---------|
| "I need to see the code to ask good questions" | You need user context first. Code comes after. |
| "Let me check git diff to understand what changed" | That is Phase 1 of systematic-debugging, not before Q&A. |
| "I already have a theory from the description" | Theories before evidence produce wrong fixes. |
| "I'll just quickly look at one file" | One file becomes five. Ask questions first. |
| "The user described it clearly enough" | A description is a symptom. Q&A finds the system. |
