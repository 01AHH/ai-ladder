import { repoStructureEssay } from "./essays/repo-structure";

export type SkillCard = {
  tag: string;
  name: string;
  trigger: string;
};

export type Rung = {
  id: string;
  number: number;
  name: string;
  /** Short tagline shown in the meta row (e.g. "THE CONVERSATION") */
  tagline: string;
  /** Time-to-start hint shown in the meta row */
  time: string;
  /** One-sentence plain-English definition for beginners, rendered under the rung name */
  plain: string;
  /** Drop-cap paragraph definition */
  definition: string;
  /** Italic pull-quote example under the definition */
  seedExample: string;
  /** Tool chips rendered next to the numeral (e.g. ["Claude.ai", "ChatGPT"]) */
  tools: string[];
  /** Scene key driving the per-rung palette (e.g. "prompting", "vibe") */
  sceneKey: string;
  /** Display-italic Socratic line rendered as the bridge AFTER this rung's section */
  socraticBridge: string;
  /** Label under the uptag arrow on the bridge (e.g. "RUNG TWO") */
  bridgeUptag: string;
  /** Skill-shelf cards shown in place of the seed block (used on the Skills rung) */
  skills?: SkillCard[];
  /** Italic crit pull-quote (used on the Skills rung) */
  crit?: string;
  /** Optional long-form essay attached to the rung, rendered inline behind a <details> toggle */
  essay?: string;
  /** Optional inline image rendered under the definition */
  mediaImage?: { src: string; alt: string; caption?: string };
  bridgeTarget: { id: string; hook: string } | null;
  /** Long-form brief fed to the API prompt (not shown in UI) */
  brief: string;
};

export const rungs: Rung[] = [
  {
    id: "prompting",
    number: 1,
    name: "Prompting",
    tagline: "The conversation",
    time: "~5 min to start",
    plain:
      "Typing a question into a chat window (Claude, ChatGPT) and reading the answer. Pure conversation, no code.",
    definition:
      'I started here. Everyone does. You open a chat window, ask for things, and a paragraph comes back. The model does the work; you\'re just steering. People dismiss this step as "just chatting." But a sharp prompt is a huge unlock, and writing one well is still one of the highest-leverage things you can do. I still spend hours here every week, crafting the right prompt.',
    seedExample:
      '"Read this PDF and pull out the three numbers I should worry about, the one I\'d defend in a meeting, and the question I\'m not asking."',
    tools: ["Claude.ai", "ChatGPT", "a browser tab"],
    sceneKey: "prompting",
    socraticBridge: "What if the answer couldn't fit in a paragraph, but in a *working website*?",
    bridgeUptag: "Step two",
    bridgeTarget: { id: "vibe-coding", hook: "Your prompt works. What if it was a webpage?" },
    brief:
      "Prompting is using a chat interface (Claude.ai, ChatGPT) effectively. The user types, Claude responds. No code. The skill is in framing the request: role, context, constraints, examples.",
  },
  {
    id: "vibe-coding",
    number: 2,
    name: "Vibe coding",
    tagline: "Shipped software, easily",
    time: "~an afternoon",
    plain:
      "Describing an app in plain English and getting a working website back. Tools like Lovable do the building for you.",
    definition:
      "The first time I tried Lovable, nothing worked. I wasn't sold. But that was because I'd failed at step one: I hadn't written a good prompt. Three months later I tried again with a sharper one, and a real working web app came out the other end. A real URL, a real database, a real thing on the internet, and I never opened a terminal. The part of my brain that used to say \"I'd need a developer for that\" went quiet. v0 and Bolt do the same. The gap between step one and step two is enormous; the gap from here to a side project is small.",
    seedExample:
      '"Make me a one-page site that takes RSVPs to a dinner party and shows the guest list so everyone can see who\'s coming."',
    tools: ["Lovable", "v0", "Bolt"],
    mediaImage: {
      src: "/rung-2-lovable.png",
      alt: "Lovable generating a soft-toy boutique landing page from a single prompt, chat panel on the left, working site on the right.",
      caption: "One prompt in. A real, working site out.",
    },
    sceneKey: "vibe",
    socraticBridge: "But what if you want to *customise it further*, and vibe coding can't quite get you there?",
    bridgeUptag: "Step three",
    bridgeTarget: {
      id: "coding-agents",
      hook: "Lovable shipped it. But you want a specific change it can't quite get. That's where an agent comes in.",
    },
    brief:
      "Vibe coding is shipping working software by describing what you want in natural language. Tools like Lovable, v0, and Bolt generate full apps from a single prompt. No code editing required, but no fine control either.",
  },
  {
    id: "coding-agents",
    number: 3,
    name: "Coding agents",
    tagline: "Pair-programming, asymmetric",
    time: "~a weekend or a week (whatever you want to spend)",
    plain:
      "An AI that lives in your terminal, reads your real codebase, and edits files for you. You direct, the agent types.",
    definition:
      "This is where I got nervous. Claude Code, Codex, Gemini. Agents that live in your terminal or your IDE. It *feels* like coding, but it isn't: you describe what you want, the agent works inside a [repo](https://docs.github.com/en/repositories/creating-and-managing-repositories/about-repositories) (think of a repo as a folder for all the code in one project), edits real files, runs the tests, and fixes what broke. The trap with Lovable and Bolt is they're great at the start but harder to push as you add features. Coding agents flip that. You own the code underneath, so anything you can describe, the agent can attempt, and the thing you build can keep growing with you.",
    seedExample:
      '"Take my half-finished personal site, find what\'s broken, and ship the three smallest changes that would let me actually publish it."',
    tools: ["Claude Code", "Codex", "Gemini", "your terminal", "your IDE"],
    mediaImage: {
      src: "/rung-3-terminal.png",
      alt: "Claude Code running inside a macOS terminal window.",
      caption: "The agent lives here, not in a chat window.",
    },
    sceneKey: "agents",
    socraticBridge: "What if you didn't have to re-explain *every time*?",
    bridgeUptag: "Step four",
    bridgeTarget: {
      id: "skills",
      hook: "The agent will do anything you ask. But it's generic. What if you could install other people's expertise into it?",
    },
    brief:
      "Coding agents (Claude Code, Codex, Gemini) live inside the terminal and operate directly on a codebase. They read files, run commands, write tests, commit. This is the step most people find scary because it looks like coding, but the agent does the keystrokes. The contrast: Lovable/v0 give you a templated app you can't really customise; ChatGPT gives you snippets to paste; an agent works inside your actual codebase, so anything you can describe, it can attempt. This is where code generation moves from 'snippet you paste' to 'real change in your repo'.",
  },
  {
    id: "skills",
    number: 4,
    name: "Skills",
    tagline: "Behaviour you can install",
    time: "~an hour",
    plain:
      "Small markdown files you drop in a folder to teach the model how to behave. Once installed, they apply in every future chat.",
    definition:
      "The first folder of skills I dropped into `~/.claude/skills` changed the way I work. A skill is a small markdown file that tells the agent how to do a specific thing. Drop a folder of them in, and the agent stops being a generic chatbot and starts having opinions. A debugging skill that refuses to propose a fix until I've run the failing test. A brainstorming skill that won't let me charge into code without a design. A TDD skill that writes the test first, every time. I didn't change the model. I changed *what it does*, and unlike a prompt, the change persists into every future conversation, including the ones I haven't had yet.",
    seedExample: "",
    tools: ["Claude Code skills", ".claude/skills/", "superpowers"],
    sceneKey: "skills",
    socraticBridge: "But what happens when your session fills up *before* the skill has done its work?",
    bridgeUptag: "Step 4.5",
    crit:
      '"A prompt is something you write once. **A skill is something the model does forever.**"',
    skills: [
      {
        tag: "Skill · 01",
        name: "brainstorming",
        trigger:
          "you ask for anything new. The agent refuses to write code until it has asked you multi-choice questions, written a design, and got your sign-off.",
      },
      {
        tag: "Skill · 02",
        name: "test-driven-development",
        trigger:
          "you ask for a feature or a bugfix. The failing test gets written first; then the code that makes it pass; then the refactor.",
      },
      {
        tag: "Skill · 03",
        name: "verification-before-completion",
        trigger:
          'you’re about to claim "done." The agent runs the verification command, pastes the output, then makes the claim, never the other way round.',
      },
    ],
    bridgeTarget: {
      id: "session-limits",
      hook: "You've installed behaviour. Now learn to stretch the context window it runs inside.",
    },
    brief:
      "Skills are markdown files that change what Claude *does*, not what Claude *knows*. A skill lives in `~/.claude/skills/` (global to you) or `.claude/skills/` (per-repo). Each is a folder with a single `.md` file: frontmatter (`name`, `description`) plus a body of instructions. The `description` field is how the skill gets triggered. Claude matches the current task against it and decides whether to invoke. This repo ships nine real, MIT-licensed skills under `.claude/skills/`: brainstorming, bugfix, hygiene, simplest-path, sweeping-the-codebase, systematic-debugging, test-driven-development, verification-before-completion, writing-plans. Skills are the cheapest possible upgrade on the ladder: one folder, no repo restructure, no API call. The personalised output for this step should help the user identify one workflow they repeat ten or more times a week and sketch the single skill that would replace that repetition.",
  },
  {
    id: "session-limits",
    number: 4.5,
    name: "Session limits",
    tagline: "When you hit the wall",
    time: "~10 min",
    plain:
      "What to do when a chat runs out of room: compact, split, swap models, and push the recurring context into files so the next session starts lighter.",
    definition:
      "Every long session eventually hits a wall. The context window fills up, the model starts forgetting decisions you made an hour ago, replies get vaguer, and you feel the cost climb. Most people respond by starting over and re-explaining everything; the better move is to make each token earn its keep.\n\nThe tricks are unglamorous and they compound. `/compact` collapses the chat into a summary and frees room to keep going. Start a fresh session for each new task instead of letting one chat carry every topic of the week. Drop a smaller model (Haiku) on grunt work, renames, and sweeps. Use subagents for big searches so the results don't pollute your main thread. And anything you find yourself re-explaining belongs in a `CLAUDE.md` or `/memory` file, not pasted at the top of every chat.\n\nThis rung is the bridge to Memory. Tactics buy you a few more turns. Memory removes the need to spend them at all.",
    seedExample:
      '"My session is 80% full and I still have three things to ship. Compact the chat, pin the open decisions to a scratch file, and start fresh for the next task."',
    tools: ["/compact", "Haiku", "subagents", "/memory", "CLAUDE.md"],
    sceneKey: "skills",
    socraticBridge:
      "What if you didn't have to re-explain who you are *at the start of every session* in the first place?",
    bridgeUptag: "Step five",
    bridgeTarget: {
      id: "memory",
      hook: "Tactics buy time. Memory buys context for free, every session.",
    },
    brief:
      "Session limits is the practical rung about managing the context window and token budget of a real working session with Claude. Six concrete tactics: (1) `/compact` — collapses chat history into a summary, frees room to keep going. Run it before the window is full, not after. (2) Fresh sessions per task — don't let one chat carry every topic of the week; one task per session keeps each chat lean. (3) Drop to a smaller model (Haiku) for grunt work — renames, file moves, sweeps, simple lookups — anything that doesn't need Opus-grade reasoning. (4) Use subagents for big searches and explorations — keeps the noisy intermediate results out of the main thread's context. (5) Push recurring context into `CLAUDE.md` and `/memory` — anything you re-explain three times belongs in a file the model loads automatically. (6) Use scoped prompts — point Claude at one file or one function rather than the whole repo, so it only loads what it needs. This rung is meta: it's about being efficient with the substrate you've already built. The personalised output should help the user identify the single biggest leak in their current workflow (re-explaining who they are? letting one chat sprawl? using Opus for renames?) and the one tactic that fixes it.",
  },
  {
    id: "memory",
    number: 5,
    name: "Memory",
    tagline: "Knowledge you can install",
    time: "~a weekend",
    plain:
      "Files the model reads at the start of every session so you don't keep re-explaining who you are or what you've already decided.",
    definition:
      "This was the step that turned me. I stopped briefing the model at the start of every chat and started letting it read about me instead. A CLAUDE.md at the root of every project. A /memory folder for facts the next session shouldn't have to re-derive. The Anthropic memory tool (file-based, persistent) for production agents that need to carry context between API calls. Each conversation now begins where the last one ended; the model walks in already knowing my stack, my stakeholders, the things I've already said no to.\n\nThis is also where the compounding starts. The faster I write into memory, the less I re-explain, and the less I re-explain, the more time I have to write into memory. I'll be honest: before this step, I was an AI sceptic. This is the step where I first felt the change.",
    seedExample:
      '"Move every standing fact about your team (names, roles, tools, the things you\'ve already said no to) into a /memory folder. Watch the next conversation skip the warm-up."',
    tools: ["CLAUDE.md", "/memory", "Anthropic memory tool"],
    sceneKey: "memory",
    socraticBridge: "What if the whole *substrate* was written for the model on purpose?",
    bridgeUptag: "Step six",
    bridgeTarget: {
      id: "repo-structure",
      hook: "You've taught it what to do, and what you know. Now give it a home.",
    },
    brief:
      "Memory is the practice of writing facts into files instead of pasting them into every chat. The model now carries your context between sessions. Three flavours: (1) CLAUDE.md: a single root file that loads at every Claude Code session start, used for global facts about you and the project. (2) /memory folder: multiple markdown files organised by topic, retrieved on demand. (3) Anthropic memory tool: the API-level memory primitive where Claude reads and writes files inside a sandbox that persists across conversations. The thesis: instead of re-explaining your business at the start of every chat, it's already there. Each session begins smarter than the last. The personalised output for this step should help the user identify the top three facts they re-explain most often, and which file each should live in.",
  },
  {
    id: "repo-structure",
    number: 6,
    name: "Repo structure",
    tagline: "The working substrate · home for both",
    time: "~a weekend",
    plain:
      "Treating your project folder as a home for the model: skills, memory, prompts and docs all in folders the agent can walk.",
    definition:
      "At some point my repo stopped being a *codebase* and started being a *working substrate*. Every folder is for the model as much as for me: /memory for facts, /personas for stakeholder simulation, /.claude/skills for behaviour, /prompts for reusable system prompts, /docs for specs. The agent doesn't visit my repo. It lives in it. Anything I can think of as a folder, the model can walk.\n\nSkills are the *behaviour* I install. Memory is the *knowledge* I install. The repo is the *home* I give both of them, and the place where they start compounding into something more than the sum of their parts.",
    seedExample:
      '"Open any repo you own. Add /memory, /personas, and /.claude/skills. Watch the model on its third visit do things its first visit couldn\'t."',
    tools: ["CLAUDE.md", "/.claude", "/memory", "/personas", "/prompts"],
    mediaImage: {
      src: "/rung-4-claude-md.png",
      alt: "GitHub contribution graph showing almost no activity for eleven months and a dense green block in the final six weeks.",
      caption: "My GitHub the year before I started writing into a repo, and the six weeks after.",
    },
    sceneKey: "repo",
    socraticBridge: "But there's one file at the root the agent reads *before everything else*. Do you know what it is?",
    bridgeUptag: "Step 6.5",
    essay: repoStructureEssay,
    bridgeTarget: {
      id: "claude-md",
      hook: "Your repo is the home. CLAUDE.md is the note pinned to the front door.",
    },
    brief:
      "Repo structure is the architecture of the substrate underneath everything else. Skills and Memory each live as folders inside it, alongside /personas (stakeholder simulation), /workflows (SOPs), /prompts (reusable system prompts), /docs (specs). The repo is no longer a place for code; it's a working substrate for the whole operation. Anything you can think of as a folder, the model can walk. This step is the bridge between using AI tools (steps 1-5) and putting AI inside your stack (steps 7-8). The canonical long-form expression of this idea is the 'Context Is the Compound Interest of AI' essay attached to this step. The personalised output should help the user identify the first repo they should build (for their work or their life) and which three folders to start with.",
  },
  {
    id: "claude-md",
    number: 6.5,
    name: "CLAUDE.md",
    tagline: "The front-door note",
    time: "~10 min",
    plain:
      "The single file at the root of a project that Claude Code reads at the start of every session. Write it once, the model walks in already knowing the basics.",
    definition:
      "If the repo is the home, CLAUDE.md is the note pinned to the front door. It's the one file Claude Code reads at the start of every session, and it sets the tone for everything else. Mine tells the agent who I am, what we're building, and the handful of standing rules I keep breaking. The first version takes ten minutes and is fifteen lines. The hundredth version is what makes the model feel like it actually knows me.",
    seedExample:
      '"Open the root of any project. Create a CLAUDE.md. Three sections: who I am, what we are building, three rules I keep breaking. Watch the next session pick up where the last one left off."',
    tools: ["CLAUDE.md", "Claude Code"],
    sceneKey: "repo",
    socraticBridge: "What if the model didn't live in a chat window *at all*?",
    bridgeUptag: "Step seven",
    bridgeTarget: {
      id: "apis",
      hook: "You've taught the agent who you are. Now make it a function in your stack.",
    },
    brief:
      "CLAUDE.md is the entry-point instruction file that Claude Code reads at the start of every session. It lives at the root of a repository. Use it for: (1) who the user is (role, voice, working style), (2) what the project is, (3) standing rules and conventions, (4) pointers to other files the agent should know about. It is the single highest-leverage file in the whole substrate because it loads first, sets the frame, and persists across sessions. The personalised output should help the user draft the three sections they should put in their CLAUDE.md right now.",
  },
  {
    id: "apis",
    number: 7,
    name: "APIs",
    tagline: "The model as a library call",
    time: "~a week",
    plain:
      "Calling the model directly from your own code, so Claude becomes a feature inside your app instead of a tab you visit.",
    definition:
      "You call the model directly from your own code. A function in your codebase, fired from a webhook, a cron, a click. Now the model is not a place you visit; it is a primitive in your stack, next to Postgres and Stripe. You can put intelligence into anything that has a key and a network connection.",
    seedExample:
      '"Every new support ticket gets read, classified, and tagged before a human sees it."',
    tools: ["anthropic SDK", "webhooks", "cron"],
    sceneKey: "apis",
    socraticBridge: "What if it didn't just *answer*, but *acted*?",
    bridgeUptag: "Step eight",
    bridgeTarget: {
      id: "integrated-systems",
      hook: "Claude is now a function in your stack. The last move: hands.",
    },
    brief:
      "APIs put Claude inside your own product. You call messages.create() from your server, pass a prompt, stream tokens back. Now Claude is a feature of your app, not a tab the user has to open.",
  },
  {
    id: "integrated-systems",
    number: 8,
    name: "Integrated systems",
    tagline: "Agents with hands on your stack",
    time: "~a quarter",
    plain:
      "Agents that don't just answer, they act. Reading email, sending messages, updating your CRM on your behalf.",
    definition:
      'Agents that read, write, and act across your real tools: Gmail, Calendar, Slack, your database, your CRM. The model crosses out of the chat window and into the system of record. You are no longer asking it to draft an email; you are asking it to send the email, file the reply, update the deal, and move on. This step is where most companies say "we have AI" and finally mean something concrete.',
    seedExample:
      '"Read every reply in this thread, update the deal stage in HubSpot, and send a follow-up at 9am their time."',
    tools: ["Gmail", "Calendar", "Slack", "your CRM", "your DB"],
    sceneKey: "integrated",
    socraticBridge: "Where on the ladder is your foot *right now*?",
    bridgeUptag: "Now pick one",
    bridgeTarget: null,
    brief:
      "Integrated systems are agents with hands. They read and write across the user's real tools: email, calendar, Slack, databases, payment systems. The leap from step 7 to step 8 is the leap from 'Claude knows things' to 'Claude does things on your behalf'. Closing nudge: 'You've built a system that acts on your behalf. Now what's the next system you'd hand off?'",
  },
];
