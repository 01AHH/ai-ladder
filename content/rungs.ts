export type Rung = {
  id: string;
  name: string;
  definition: string;
  seedExample: string;
  bridgeTarget: { id: string; hook: string } | null;
  brief: string;
};

export const rungs: Rung[] = [
  {
    id: "prompting",
    name: "Prompting",
    definition: "Using Claude.ai or ChatGPT well. The base layer.",
    seedExample:
      "A real estate agent pastes a listing description into Claude.ai with the prompt 'rewrite this for first-home buyers, no jargon, 80 words.' Three seconds, done.",
    bridgeTarget: { id: "vibe-coding", hook: "Your prompt works. What if it was a webpage?" },
    brief:
      "Prompting is using a chat interface (Claude.ai, ChatGPT) effectively. The user types, Claude responds. No code. The skill is in framing the request: role, context, constraints, examples.",
  },
  {
    id: "vibe-coding",
    name: "Vibe coding",
    definition: "Lovable, v0, Bolt. Shipping a UI by describing it.",
    seedExample:
      "A founder types into Lovable: 'a landing page for a dog-walking app, hero with a photo, three pricing tiers, signup form.' Two minutes later it's live at a real URL.",
    bridgeTarget: {
      id: "coding-agents",
      hook: "Lovable shipped it. But you want a specific change it can't quite get. That's where an agent comes in.",
    },
    brief:
      "Vibe coding is shipping working software by describing what you want in natural language. Tools like Lovable, v0, and Bolt generate full apps from a single prompt. No code editing required, but no fine control either.",
  },
  {
    id: "coding-agents",
    name: "Coding agents",
    definition: "Claude Code, Cursor. Editing real code by chatting.",
    seedExample:
      "An indie dev opens Claude Code in their repo and says 'add a dark mode toggle to the navbar, persist in localStorage.' Claude reads the relevant files, edits three of them, runs the build, commits.",
    bridgeTarget: {
      id: "apis",
      hook: "The agent edits files. But what if Claude was inside your product, not just your editor?",
    },
    brief:
      "Coding agents (Claude Code, Cursor) operate directly on a codebase. They read files, run commands, write tests, commit. You stay in the loop but the agent does the keystrokes. This is where code generation moves from 'snippet you paste' to 'real change in your repo'.",
  },
  {
    id: "apis",
    name: "APIs",
    definition: "Calling Claude directly from your own code.",
    seedExample:
      "A SaaS founder adds a 'summarise this thread' button to their support inbox. Behind it: 20 lines of TypeScript that POST the thread to Anthropic's API and stream the response back. Ships that afternoon.",
    bridgeTarget: {
      id: "knowledge-systems",
      hook: "You're calling Claude programmatically. But it forgets everything. What if it knew you?",
    },
    brief:
      "APIs put Claude inside your own product. You call messages.create() from your server, pass a prompt, stream tokens back. Now Claude is a feature of your app, not a tab the user has to open.",
  },
  {
    id: "knowledge-systems",
    name: "Knowledge systems",
    definition: "Giving Claude persistent context. Memory, retrieval, skills.",
    seedExample:
      "A solo consultant pipes every client meeting transcript into a tagged store. Next time she opens Claude Code in her notes repo, it already knows what each client cares about, what they've agreed to, and what's overdue.",
    bridgeTarget: {
      id: "integrated-systems",
      hook: "Claude knows your context. But it just sits there. What if it acted?",
    },
    brief:
      "Knowledge systems make Claude stop forgetting. Three flavours: (1) memory, files Claude reads at every turn; (2) retrieval, Claude searches a corpus for relevant chunks; (3) skills, small Markdown files that inject *behaviour* on demand. This is the rung where 'skills as superpowers' becomes concrete. Prompting changes one conversation. Memory changes what Claude *knows*. A skill changes what Claude *does*, every time the trigger fires. The repo this site lives in ships `.claude/skills/` for exactly this reason: clone it, get the working agent, not just the app. Frame this rung around that distinction.",
  },
  {
    id: "integrated-systems",
    name: "Integrated systems",
    definition: "Agents that read, write, and act across tools (Gmail, Calendar, Slack, your DB).",
    seedExample:
      "A founder asks 'who haven't I replied to this week?' An agent reads Gmail, cross-references Calendar, drafts three replies, and pings Slack with a summary. The founder taps approve.",
    bridgeTarget: null,
    brief:
      "Integrated systems are agents with hands. They read and write across the user's real tools: email, calendar, Slack, databases, payment systems. The leap from rung 5 to rung 6 is the leap from 'Claude knows things' to 'Claude does things on your behalf'. Closing nudge: 'You've built a system that acts on your behalf. Now what's the next system you'd hand off?'",
  },
];
