# Copy inventory

Every bit of user-facing text on the site, in the order a visitor sees it. Each section names the file you'd edit to change that text.

---

## 0. Browser tab + meta

> File: `app/layout.tsx`

- **Title:** `AI Ladder · a personalised guide`
- **Description:** `A field guide to what you can actually do with AI, written for the work you do.`

---

## 1. Top bar

> File: `app/page.tsx`

- **Wordmark:** `THE AI LADDER.`
- **Scene readout (right side):** `{number} / 07 {label}`
  - Scene labels (one per section, swapped as you scroll):
    - hero → `Start`
    - prompting → `Prompting`
    - vibe → `Vibe coding`
    - agents → `Coding agents`
    - repo → `Repo structure`
    - apis → `APIs`
    - climax → `Skills`
    - integrated → `Integrated`
    - step → `Step`
  - Scene numbers:
    - hero `00`, prompting `01`, vibe `02`, agents `03`, repo `04`, apis `05`, climax `06`, integrated `07`, step `08`

---

## 2. Hero

> File: `app/page.tsx`

- **Eyebrow:** `A field guide to what's actually possible with AI right now`
- **H1:** `Knowing the next step in your AI journey is hard when you don't know what's *possible*.`
- **Lede paragraph 1:** `Most people stop at ChatGPT and assume that's the ceiling. It isn't. There are seven steps above it, and the gap between step one and step eight is the difference between *using* AI and *developing* with it.`
- **Lede paragraph 2:** `I built this because I kept talking to smart people who were asking me how I'm using AI and asking me to explain what is possible and it was hard to figure out what step they were at with their AI journey but also it was hard to explain what was possible at the next step`
- **Scroll hint:** `Or just scroll ↓`

---

## 3. Context input ("Who are you?")

> File: `components/ContextInput.tsx`

- **Label eyebrow:** `§ Begin here`
- **Status badge:** `unread` (changes to `filed` once typed in)
- **Question:** `Tell us *who you are* and what your knowledge is of AI and what problems you have in your day to day work.`
- **Placeholder:** `I'm a real estate agent in Sydney, I use ChatGPT a few times a week…`
- **Hint prefix:** `try:`
- **Try-it suggestions:**
  - `paediatric nurse, Lagos` → fills with: `I'm a paediatric nurse running a small clinic in Lagos. I've used ChatGPT once or twice.`
  - `PM, logistics` → fills with: `I'm a product manager at a B2B logistics startup. I use Claude every day for prompting and have shipped one v0 prototype.`
  - `solo ceramics shop` → fills with: `I run a one-person Etsy shop selling handmade ceramics. I've never really used AI.`
  - `history teacher` → fills with: `I'm a high-school history teacher in rural Vermont. I use ChatGPT to draft worksheets but that's it.`
- **Cue link:** `then climb the ladder ↓`

---

## 4. Quick-jump index ("The eight rungs")

> File: `components/RungIndex.tsx`

- **Lead:** `↓ The eight rungs`
- **Sub:** `Jump to any`
- **Per-rung tag (right-hand side of each row, overrides the default tagline):**
  - Prompting: `the conversation, a sharp prompt against a frontier model`
  - Vibe coding: `describe an app, ship a real URL by tonight`
  - Coding agents: `the agent reads your repo and writes patches`
  - Skills: `behaviour you install — what the model does forever`
  - Memory: `knowledge you install — CLAUDE.md, /memory, the no-list`
  - Repo structure: `the working substrate, home for skills and memory`
  - APIs: `the model as a function in your codebase`
  - Integrated systems: `agents with hands on Gmail, Calendar, your CRM`

---

## 5. The eight rungs (long-form content)

> File: `content/rungs.ts`

Each rung has these fields. To rewrite the section, edit the matching object in `rungs.ts`.

### Rung 01 · Prompting

- **Tagline:** `The conversation`
- **Time:** `~5 min to start`
- **Tools (chips):** `Claude.ai`, `ChatGPT`, `a browser tab`
- **Definition:** `I started here. Everyone does. You open a chat window, ask for things, watch a paragraph come back. The model does the work; You just steering it. People dismiss this step as "just chatting." But a sharp prompt is actually a huge unlock and spending time to write a prompt is still one of the best activities one can do. I still spend hours here, every week crafting the best prompt` -- change the copy to make it better english here. 
- **Seed example (italic pull-quote):** `"Summarise this PDF and pull out the three numbers I should be worried about."` -- help me improve this prompt to make it better
- **Bridge into next rung (uptag):** `Step two`
- **Bridge line:** `What if the answer couldn't be solved by a paragraph, but a *working website*?`

### Rung 02 · Vibe coding

- **Tagline:** `Shipped software, easily!`
- **Time:** `~an afternoon`
- **Tools (chips):** `Lovable`, `v0`, `Bolt`
- **Definition:** `The first time I used Lovable I described an app and nothing worked... I wasn't sold. But it was because I failed at the first step of writing a good prompt. So 3 months later I tried again with a better prompt and what I got was a perfect website! and a working web app came out the other end. A real URL, a real database, a real thing on the internet, and I never opened a terminal. The part of my brain that used to say "I'd need a developer for that" went quiet. v0 and Bolt do the same. The gap between step one and step two is enormous; the gap from here to a side project is small.` -- insert screenshot of early website built on loveable
- **Seed example:** `"Make me a one-page site that takes RSVPs to a dinner party and stores the list of people on the site so people can see who is coming."`
- **Bridge uptag:** `Step three`
- **Bridge line:** `But what if you want to customise it more and vibe coding isn't *doing it for you*?`

### Rung 03 · Coding agents

- **Tagline:** `Pair-programming, asymmetric`
- **Time:** `~a weekend - week (really depends how long you want to spend on this step)`
- **Tools (chips):** `Claude Code`, `Codex`, `Gemini`, `your terminal` `&` `IDE's`
- **Definition:** `This is where I got nervous. Claude Code, Codex, Gemini. Agents that live in your terminal. It *feels* like coding, but it really isn't: You describe what you want, the agent builds a repo, (add in link to what is a repo on this line so people can get a simple understanding of what it is) edits real files, runs the tests, and fixes what broke simply. What often happens with tools like loveable and bolt is they work well at the start but as you add more features they break. building with coding agents can solve this problem and can allow you to make a more personalised and scaleable solution.` -- improve copy here & add in link which explains what a repo is. 
- **Seed example:** `"Migrate this codebase from Pages Router to App Router and tell me what you couldn't translate."` -- do a better example of what non technical people would understand. 
- **Inline image:** `/rung-3-terminal.png`
  - Alt: `Claude Code running inside a macOS terminal window.`
  - Caption: `The agent lives here, not in a chat window.`
- **Bridge uptag:** `Step four`
- **Bridge line:** `What if you didn't have to continue giving the agnet information on how to do a task *each time you spoke to it*?` -- feel free to cut this down

### Rung 04 · Skills (the climax / "Where the agent gets opinions")

- **Stamp at top of section:** `Where the agent gets opinions`
- **Tagline:** `Behaviour you can install`
- **Time:** `~an hour`
- **Tools (chips):** `Claude Code skills`, `.claude/skills/`, `superpowers`
- **Definition:** `The first folder of skills I dropped into ~/.claude/skills changed the way I work. A skill is a small markdown file that tells the agent how to do a specific thing. Drop a folder of them in, and the agent stops being a generic chatbot and starts having opinions. A debugging skill that refuses to propose a fix until I've run the failing test. A brainstorming skill that won't let me charge into code without a design. A TDD skill that writes the test first, every time. I didn't change the model. I changed *what it does*, and unlike a prompt, the change persists into every future conversation, including the ones I haven't had yet.`
- **Crit pull-quote (italic, prominent):** `"A prompt is something you write once. **A skill is something the model does forever.**"`
- **Shelf head:** `Your skill shelf · a few examples`
- **Skill cards (3):**
  - `Skill · 01` — **brainstorming** — Fires when: `you ask for anything new. The agent refuses to write code until it has asked you multi-choice questions, written a design, and got your sign-off.`
  - `Skill · 02` — **test-driven-development** — Fires when: `you ask for a feature or a bugfix. The failing test gets written first; then the code that makes it pass; then the refactor.`
  - `Skill · 03` — **verification-before-completion** — Fires when: `you're about to claim "done." The agent runs the verification command, pastes the output, then makes the claim, never the other way round.`
- **Bridge uptag:** `Step five`
- **Bridge line:** `What if it didn't just *act* the same way every time, but *remembered* you between sessions?`

### Rung 05 · Memory

- **Tagline:** `Knowledge you can install`
- **Time:** `~a weekend`
- **Tools (chips):** `CLAUDE.md`, `/memory`, `Anthropic memory tool`
- **Definition (two paragraphs):**
  1. `This was the step that turned me. I stopped briefing the model at the start of every chat and started letting it read about me instead. A CLAUDE.md at the root of every project. A /memory folder for facts the next session shouldn't have to re-derive. The Anthropic memory tool (file-based, persistent) for production agents that need to carry context between API calls. Each conversation now begins where the last one ended; the model walks in already knowing my stack, my stakeholders, the things I've already said no to.`
  2. `This is also where the compounding starts. The faster I write into memory, the less I re-explain, and the less I re-explain, the more time I have to write into memory. I'll be honest: before this step, I was an AI sceptic. This is the step where I first felt the change.`
- **Seed example:** `"Move every standing fact about your team (names, roles, tools, the things you've already said no to) into a /memory folder. Watch the next conversation skip the warm-up."`
- **Bridge uptag:** `Step six`
- **Bridge line:** `What if the whole *substrate* was written for the model on purpose?`

### Rung 06 · Repo structure

- **Tagline:** `The working substrate · home for both`
- **Time:** `~a weekend`
- **Tools (chips):** `CLAUDE.md`, `/.claude`, `/memory`, `/personas`, `/prompts`
- **Definition (two paragraphs):**
  1. `At some point my repo stopped being a *codebase* and started being a *working substrate*. Every folder is for the model as much as for me: /memory for facts, /personas for stakeholder simulation, /.claude/skills for behaviour, /prompts for reusable system prompts, /docs for specs. The agent doesn't visit my repo. It lives in it. Anything I can think of as a folder, the model can walk.`
  2. `Skills are the *behaviour* I install. Memory is the *knowledge* I install. The repo is the *home* I give both of them, and the place where they start compounding into something more than the sum of their parts.`
- **Seed example:** `"Open any repo you own. Add /memory, /personas, and /.claude/skills. Watch the model on its third visit do things its first visit couldn't."`
- **Inline image:** `/rung-4-claude-md.png`
  - Alt: `GitHub contribution graph showing almost no activity for eleven months and a dense green block in the final six weeks.`
  - Caption: `My GitHub the year before I started writing into a repo, and the six weeks after.`
- **Repo CTA (special box on this rung):**
  - Eyebrow: `⌥ This repo, exactly`
  - Title: `Browse *ai-ladder* on GitHub`
  - Blurb: `The site you're reading is structured the way the essay describes. CLAUDE.md at the root, a /prompts folder, a /.claude/skills folder. Clone it. Look at the files. See if the shape matches yours.`
  - Cue: `github.com/01AHH/ai-ladder ↗`
- **Essay disclosure (collapsed by default):**
  - Eyebrow: `§ The long-form`
  - Title: `Read the essay: *Context Is the Compound Interest of AI*`
  - Cue: `expand ↓`
  - Essay body lives in `content/essays/repo-structure.ts` (see section 6 below)
- **Bridge uptag:** `Step 6.5`
- **Bridge line:** `But there's one file at the root the agent reads *before everything else*. Do you know what it is?`

### Rung 06.5 · CLAUDE.md

A sidebar step between Repo structure and APIs. Inherits the `repo` scene palette and is not counted toward the "08" total in the meta row.

- **Tagline:** `The front-door note`
- **Time:** `~10 min`
- **Plain-English line (renders under the name):** `The single file at the root of a project that Claude Code reads at the start of every session. Write it once, the model walks in already knowing the basics.`
- **Tools (chips):** `CLAUDE.md`, `Claude Code`
- **Definition:** `If the repo is the home, CLAUDE.md is the note pinned to the front door. It's the one file Claude Code reads at the start of every session, and it sets the tone for everything else. Mine tells the agent who I am, what we're building, and the handful of standing rules I keep breaking. The first version takes ten minutes and is fifteen lines. The hundredth version is what makes the model feel like it actually knows me.`
- **Seed example:** `"Open the root of any project. Create a CLAUDE.md. Three sections: who I am, what we are building, three rules I keep breaking. Watch the next session pick up where the last one left off."`
- **Bridge uptag:** `Step seven`
- **Bridge line:** `What if the model didn't live in a chat window *at all*?`

### Rung 07 · APIs

- **Tagline:** `The model as a library call`
- **Time:** `~a week`
- **Tools (chips):** `anthropic SDK`, `webhooks`, `cron`
- **Definition:** `You call the model directly from your own code. A function in your codebase, fired from a webhook, a cron, a click. Now the model is not a place you visit; it is a primitive in your stack, next to Postgres and Stripe. You can put intelligence into anything that has a key and a network connection.`
- **Seed example:** `"Every new support ticket gets read, classified, and tagged before a human sees it."`
- **Bridge uptag:** `Step eight`
- **Bridge line:** `What if it didn't just *answer*, but *acted*?`

### Rung 08 · Integrated systems

- **Tagline:** `Agents with hands on your stack`
- **Time:** `~a quarter`
- **Tools (chips):** `Gmail`, `Calendar`, `Slack`, `your CRM`, `your DB`
- **Definition:** `Agents that read, write, and act across your real tools: Gmail, Calendar, Slack, your database, your CRM. The model crosses out of the chat window and into the system of record. You are no longer asking it to draft an email; you are asking it to send the email, file the reply, update the deal, and move on. This step is where most companies say "we have AI" and finally mean something concrete.`
- **Seed example:** `"Read every reply in this thread, update the deal stage in HubSpot, and send a follow-up at 9am their time."`
- **Bridge uptag (after final rung):** `Now pick one`
- **Bridge line:** `Where on the ladder is your foot *right now*?`

---

## 6. The long essay (Repo structure rung)

> File: `content/essays/repo-structure.ts`

Title: `Context Is the Compound Interest of AI`

The full essay (renders inside the `<details>` block on Rung 06). Section headings inside it:

1. `Starting with nothing`
2. `The move that changed everything`
3. `Compounding through friction`
4. `The persona trick`
5. `Learning from a developer`
6. `What 39 days produced`
7. `The actual lesson`

The opening paragraph: `At the start of this year, we made a decision at Slice that sounded reasonable in a meeting and terrifying in practice. We were going to rebuild our entire product for enterprise.`

To edit, open the file directly. It's a single template literal, easy to rewrite section by section.

---

## 7. Per-rung UI microcopy (everywhere a rung renders)

> File: `components/Rung.tsx`

- **Meta row (above each numeral):** `↑ Step {n} of 08` · `{tagline}` · `{time}`
- **Name treatment:** rung name shown italic with trailing period, e.g. `Prompting.`
- **Seed-example label:** `Seed example · generic`
- **Generate button:**
  - Default (Rungs 1, 2, 3, 5, 6, 7, 8): `Generate good personal example for me →`
  - On Skills rung (climax): `Generate my skill →`
  - While streaming: `Streaming… ·`
  - After completion: `Regenerate ↻`
- **Streamed output header (`components/StreamedOutput.tsx`):**
  - While streaming: `streaming` · `vignette · rung-specific`
  - When complete: `complete` · `vignette · rung-specific`
  - On error (default): `Claude couldn't generate. Try again.`

---

## 8. Inspiration gallery (per-rung "things to build")

> File: `content/inspiration.ts`

Each rung gets a row of cards. Label above the row:

- `⌁ Inspiration · things to build for your actual life` · `(pick one)`

### Prompting

1. **Natalie Barbu** — *Claude planned my wedding* — `Treating Claude like a wedding coordinator. Vendor shortlists, day-of timelines, the list of things you'd otherwise forget.` (YouTube short)
2. **You, this weekend** — *The hard conversation you keep avoiding* — `Paste the situation. Ask what you might be getting wrong about the other person. Three openings, three tones.`
3. **You, with a deadline** — *Pick the name* — `A baby, a cat, a band, a Wi-Fi network. Constraint-loaded brainstorming is what LLMs are best at, and most people use them like a search bar.`
4. **You, before bed** — *Loosen the knot* — `Type the thing you've been chewing on for a week. Ask Claude to play it back from three angles you didn't pick.`

### Vibe coding

1. **You, with a shared-list problem** — *An app for the family grocery list* — `The shared list that opens fast and remembers what aisle the chickpeas live in. Lovable, one prompt, your nan uses it now.`
2. **You, before the wedding** — *The RSVP site no-one has to log in to* — `Plus-ones, dietaries, song requests, a map. One Lovable prompt, your own domain, done by Sunday.`
3. **You, with a hobby** — *The tracker your phone doesn't have* — `Reading log. Sleep log. Garden log. Run log. The shape of the form is the shape of how you'd actually use it. Build it for yourself in v0.`
4. **You, with kids** — *The chore chart that doesn't suck* — `Replit Agent will build you a kid-friendly tracker with sticker rewards in an hour. Print it if they prefer paper.`

### Coding agents

1. **You, with a dusty repo** — *Personal site, finished this time* — `Point Claude Code at your half-built portfolio. Ask for the smallest shippable version. The agent makes the cuts you couldn't.`
2. **You, drowning in photos** — *Sort five years of camera roll* — `A small script that reads EXIF, clusters by location and event, and renames the folders the way you actually think about them.`
3. **You, with a side project** — *The CLI that runs your morning* — `Six lines that open your day: weather, calendar, the one thing you swore you'd do. Claude Code wires it while you make coffee.`
4. **You, with an aunt's old blog** — *Save the recipes before the site dies* — `Scrape the WordPress your aunt ran in 2011. Save the recipes as Markdown. Cursor handles the messy HTML.`

### Skills

1. **You, with a family** — *A skill for the family calendar* — `One Markdown file that fires when you say 'plan our weekend.' It knows the kids' birthdays, the recurring dinners, the Saturdays you actually have.`
2. **You, in your inbox** — *Your reply, in your voice* — `A skill that fires on 'draft reply.' It's seen how you actually write. The result lands inside your tone, not GPT's.`
3. **This repo** — *Nine skills, ready to clone* — `Open the .claude/skills folder in this repo on GitHub. Each one is a real, MIT-licensed skill: brainstorming, TDD, debugging, hygiene. Read one, copy it, change the description.`

### Memory

1. **ICOR with Tom** — *Claude that knows who I am* — `He walks through the memory-file pattern: Claude that doesn't start from zero every conversation. Useful even if you don't run a company.` (YouTube)
2. **You, after a year** — *Notes Claude actually remembers* — `A memory file that survives sessions. Drop in: how you make decisions, your three current projects, the names of the people in your life. Compounding interest for prompts.`
3. **Anthropic memory tool** — *File-based memory, on the API* — `For production agents: Claude reads and writes files inside a sandbox that persists across conversations. The same idea as a /memory folder, but as a primitive your code can call.`

### Repo structure

(Currently no inspiration cards. Add them as a new `"repo-structure": [...]` block in `content/inspiration.ts` if you want some.)

### APIs

1. **You, mid-marathon-training** — *The training partner that texts back* — `An SMS bot wired to the Claude API. You text it after every run. It logs, replies, asks the one good question.`
2. **You, with a parent who lives alone** — *Daily check-in to mum* — `One question a day, by SMS, with Claude on the other end. The answer lands on a tiny dashboard only you see.`
3. **You, in the kitchen** — *A meal plan that thinks like you* — `A weekly menu generator that knows your fridge, your kid's allergies, and that you hate prep on Wednesdays. Built once, used forever.`
4. **You, with a thousand bookmarks** — *Your private second brain, but actually* — `Pinboard, Notion, or just a text file plus the Claude API. Ask your bookmarks questions. Get answers back, with sources.`

### Integrated systems

1. **You, on holiday** — *The agent that handles arrivals* — `Lindy wired to your inbox, your calendar, your partner's SMS. Lands when the plane lands. 'We're in. Heading to the hotel. Reservation's at 8.'`
2. **You, on payday** — *Your money, watched gently* — `An agent that reads your bank notifications, categorises them, and texts you Friday with a single number you can act on.`
3. **You, on a long shift** — *The morning brief* — `Claude reads your inbox, your calendar, one Notion page; writes a 90-second briefing; emails it at 06:50. The day starts before your second coffee.`
4. **You, in front of your laptop** — *Hands on the wheel* — `Computer-use Claude finishing the boring forms. Insurance renewals, school-portal logins, the quarterly compliance click-through. Watch once, then walk away.`

---

## 9. Final "Step" section ("The whole point")

> File: `app/page.tsx`

- **Eyebrow:** `⌂ The whole point`
- **H2:** `The point is the *step*, not the ladder.`
- **Lede:** `Pick one. Block twenty minutes for it this week. The ladder is only useful if you put your foot on it.`
- **Step list (per row: `↑ Step 0{n}` · what · where):**
  1. Step 01 — `Open Claude.ai and re-do your last meeting follow-up email, but ask it to find what you didn't say.` — `20 min · claude.ai`
  2. Step 02 — `Describe to Lovable the smallest internal page your team would actually use. Ship it tonight.` — `1 hr · lovable`
  3. Step 03 — `Point Claude Code at the repo you keep meaning to clean up. Ask it for the three smallest PRs.` — `1 evening · claude code`
  4. Step 04 — `Spin up one repo for one part of your life. CLAUDE.md, a /memory folder, three markdown files. Start the brain.` — `1 evening · any editor`
  5. Step 05 — `Wire a single API call into one inbox or webhook. Just one. Ship the smallest possible loop.` — `1 weekend · anthropic api`
  6. Step 06 — `Write your first skill. One file. The thing you keep re-explaining to Claude. Stop re-explaining.` — `2 hrs · claude.ai`
  7. Step 07 — `Connect one tool to one tool, mediated by an agent. Don't pick the hardest pair. Pick the most boring.` — `1 quarter · your stack`

---

## 10. Footer

> File: `app/page.tsx`

- **Colophon:** `Set in Instrument Serif, Inter & JetBrains Mono on warm paper. Composed in one page, one column, one ladder. No tracking. No newsletter signup. Open source on GitHub, MIT licensed. Fork it, bring your own Anthropic key, make it yours.`
  - Embedded links: `GitHub` → `https://github.com/01AHH/ai-ladder`, `Anthropic key` → `https://console.anthropic.com/`
- **Wink:** `the repo is the content.`

---

## 11. Ladder visualisation (left rail)

> File: `components/LadderViz.tsx`

- **Top cap:** `↑ You`
- **Foot:** `↓ Scroll to climb`
- **Rung labels (on the SVG):** `00` through `08`, with `⚑` as the final flag for the step list

---

## Notes on customising

- **Wording everywhere uses one trick:** wrapping text in single asterisks (`*like this*`) renders as italic. Double asterisks (`**like this**`) renders bold. This works inside rung definitions, bridge lines, and the crit pull-quote.
- **The bridge between rungs** is set on the *previous* rung (`socraticBridge` + `bridgeUptag`). To change "What if the agent had *opinions*?" you edit Rung 03, not Rung 04.
- **The Skills rung is the only one without a seed example** — it shows the skill shelf cards instead. Leave `seedExample: ""`.
- **The Repo structure rung is the only one with a full essay attached** — to swap the essay, edit `content/essays/repo-structure.ts`. To attach an essay to another rung, set its `essay:` field to a string.
- **AI prompt copy (what the streamed personal vignette generates)** lives in `prompts/coach.md` and `prompts/design-brief.md`. It's not user-visible text but it shapes what users see when they click "Generate". Edit those files if the streamed outputs feel off.
