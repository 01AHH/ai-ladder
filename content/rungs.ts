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
  /** Drop-cap paragraph definition */
  definition: string;
  /** Italic pull-quote example under the definition */
  seedExample: string;
  /** Only set for rung 5: skill-shelf cards shown in place of the seed block */
  skills?: SkillCard[];
  /** Only set for rung 5: the italic crit pull-quote */
  crit?: string;
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
    definition:
      'You open a chat window and ask for things. Claude.ai, ChatGPT. The model is doing all the work; you are doing all the steering. This rung is sometimes dismissed as "just chatting," but a sharp prompt against a frontier model is still the highest leverage-per-minute most people will ever encounter.',
    seedExample:
      '"Summarise this PDF and pull out the three numbers I should be worried about."',
    bridgeTarget: { id: "vibe-coding", hook: "Your prompt works. What if it was a webpage?" },
    brief:
      "Prompting is using a chat interface (Claude.ai, ChatGPT) effectively. The user types, Claude responds. No code. The skill is in framing the request: role, context, constraints, examples.",
  },
  {
    id: "vibe-coding",
    number: 2,
    name: "Vibe coding",
    tagline: "Shipped software, no compiler",
    time: "~an afternoon",
    definition:
      "You describe an app and a working web app comes out the other end: Lovable, v0, Bolt. You don't open a terminal. You don't know what a package manager is. The output is a real URL, a real database, a real thing on the internet. Some part of your brain that used to say \"I'd need a developer for that\" goes quiet.",
    seedExample:
      '"Make me a one-page site that takes RSVPs to a dinner party and texts me when someone replies."',
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
    time: "~a weekend",
    definition:
      "Claude Code, Cursor. You are still the author of the codebase, but the agent reads the whole repo, writes patches, runs tests, and reports back. The relationship inverts: you spend more time reviewing than typing. The model becomes the junior who never sleeps and never gets cranky about touching legacy code.",
    seedExample:
      '"Migrate this codebase from Pages Router to App Router and tell me what you couldn\'t translate."',
    bridgeTarget: {
      id: "apis",
      hook: "The agent edits files. But what if Claude was inside your product, not just your editor?",
    },
    brief:
      "Coding agents (Claude Code, Cursor) operate directly on a codebase. They read files, run commands, write tests, commit. You stay in the loop but the agent does the keystrokes. This is where code generation moves from 'snippet you paste' to 'real change in your repo'.",
  },
  {
    id: "apis",
    number: 4,
    name: "APIs",
    tagline: "The model as a library call",
    time: "~a week",
    definition:
      "You call the model directly from your own code. A function in your codebase, fired from a webhook, a cron, a click. Now the model is not a place you visit; it is a primitive in your stack, next to Postgres and Stripe. You can put intelligence into anything that has a key and a network connection.",
    seedExample:
      '"Every new support ticket gets read, classified, and tagged before a human sees it."',
    bridgeTarget: {
      id: "knowledge-systems",
      hook: "You're calling Claude programmatically. But it forgets everything. What if it knew you?",
    },
    brief:
      "APIs put Claude inside your own product. You call messages.create() from your server, pass a prompt, stream tokens back. Now Claude is a feature of your app, not a tab the user has to open.",
  },
  {
    id: "knowledge-systems",
    number: 5,
    name: "Knowledge systems",
    tagline: "Where the model starts remembering you",
    time: "~a fortnight",
    definition:
      "Memory. Retrieval. **Skills.** Now the model is no longer a stranger at every door; it carries your context, your house style, your standard operating procedure with it. A skill is the punchline: a small, named bundle of instructions that *changes what the model does*, every single time the trigger fires.",
    seedExample: "",
    crit:
      '"A prompt is something you write once. **A skill is something the model does forever.**"',
    skills: [
      {
        tag: "Skill · 01",
        name: "house-style-writer",
        trigger:
          "you ask Claude to draft any external-facing copy. It lifts tone, banned words, and your three rhetorical tics from a single source file.",
      },
      {
        tag: "Skill · 02",
        name: "monday-digest",
        trigger:
          'you say "what happened last week." It pulls Linear, Stripe, and Slack into the same three-paragraph brief, every time, in the same shape.',
      },
      {
        tag: "Skill · 03",
        name: "contract-redline",
        trigger:
          "a PDF lands in a folder. It flags clauses against your playbook and writes the email to your lawyer with the diff attached.",
      },
    ],
    bridgeTarget: {
      id: "integrated-systems",
      hook: "Claude knows your context. But it just sits there. What if it acted?",
    },
    brief:
      "Knowledge systems make Claude stop forgetting. Three flavours: (1) memory, files Claude reads at every turn; (2) retrieval, Claude searches a corpus for relevant chunks; (3) skills, small Markdown files that inject *behaviour* on demand. This is the rung where 'skills as superpowers' becomes concrete. Prompting changes one conversation. Memory changes what Claude *knows*. A skill changes what Claude *does*, every time the trigger fires. The repo this site lives in ships `.claude/skills/` for exactly this reason: clone it, get the working agent, not just the app. Frame this rung around that distinction.",
  },
  {
    id: "integrated-systems",
    number: 6,
    name: "Integrated systems",
    tagline: "Agents with hands on your stack",
    time: "~a quarter",
    definition:
      'Agents that read, write, and act across your real tools: Gmail, Calendar, Slack, your database, your CRM. The model crosses out of the chat window and into the system of record. You are no longer asking it to draft an email; you are asking it to send the email, file the reply, update the deal, and move on. This rung is where most companies say "we have AI" and finally mean something concrete.',
    seedExample:
      '"Read every reply in this thread, update the deal stage in HubSpot, and send a follow-up at 9am their time."',
    bridgeTarget: null,
    brief:
      "Integrated systems are agents with hands. They read and write across the user's real tools: email, calendar, Slack, databases, payment systems. The leap from rung 5 to rung 6 is the leap from 'Claude knows things' to 'Claude does things on your behalf'. Closing nudge: 'You've built a system that acts on your behalf. Now what's the next system you'd hand off?'",
  },
];
