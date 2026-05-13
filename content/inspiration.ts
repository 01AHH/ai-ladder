export type InspoMedia =
  | { kind: "image"; src: string; alt: string; ratio?: number }
  | { kind: "video"; src: string; ratio?: number; poster?: string }
  | { kind: "youtube"; id: string }
  | { kind: "loom"; id: string };

export type InspoItem = {
  tool: string;
  title: string;
  blurb: string;
  url: string;
  media?: InspoMedia;
};

/**
 * Public, widely-known projects people built (or shipped) at each rung.
 * Think of this as Dribbble for AI work: see what's possible, then go make
 * your own. Keep entries to four-ish per rung so the page stays editorial,
 * not a directory dump.
 */
export const inspiration: Record<string, InspoItem[]> = {
  prompting: [
    {
      tool: "Anthropic",
      title: "Prompt Library",
      blurb:
        "Curated, named prompts you can copy and adapt, from cosmic keystrokes to PII scrubber.",
      url: "https://docs.claude.com/en/resources/prompt-library/library",
      media: { kind: "youtube", id: "FbAxP2-Jfps" },
    },
    {
      tool: "DAIR.AI",
      title: "Prompt Engineering Guide",
      blurb:
        "The most-cited open guide on how to structure prompts: zero-shot, few-shot, chain-of-thought.",
      url: "https://www.promptingguide.ai",
    },
    {
      tool: "GitHub · f/",
      title: "Awesome ChatGPT Prompts",
      blurb:
        "180k-star community repo of role-based prompts. Steal liberally for your own work.",
      url: "https://github.com/f/awesome-chatgpt-prompts",
    },
    {
      tool: "Anthropic",
      title: "Cookbook",
      blurb:
        "Recipe-style notebooks showing what good prompting looks like in production code.",
      url: "https://github.com/anthropics/anthropic-cookbook",
    },
  ],

  "vibe-coding": [
    {
      tool: "Vercel",
      title: "v0",
      blurb:
        "Type a sentence, get a React component or full page. Community gallery shows what others shipped.",
      url: "https://v0.dev",
      media: { kind: "youtube", id: "By9wCB9IZp0" },
    },
    {
      tool: "Lovable",
      title: "Lovable",
      blurb:
        "Describe a full-stack app; deploy in minutes. The launches page is a steady feed of one-prompt products.",
      url: "https://lovable.dev",
      media: { kind: "youtube", id: "kcOrTOT7Kko" },
    },
    {
      tool: "StackBlitz",
      title: "Bolt.new",
      blurb:
        "Prompt-to-app in the browser. Includes the dev server, the file tree, the deploy. No terminal.",
      url: "https://bolt.new",
    },
    {
      tool: "Replit",
      title: "Replit Agent",
      blurb:
        "Describe what you want; it scaffolds, edits, runs, and hosts. Strong showcase of single-prompt apps.",
      url: "https://replit.com/agent",
      media: { kind: "youtube", id: "nr6qrQTv7QI" },
    },
  ],

  "coding-agents": [
    {
      tool: "Anthropic",
      title: "Claude Code",
      blurb:
        "Terminal-native agent that reads your repo, edits real files, runs tests, opens PRs. The category-defining one.",
      url: "https://claude.com/claude-code",
      media: { kind: "youtube", id: "AJpK3YTTKZ4" },
    },
    {
      tool: "Anysphere",
      title: "Cursor",
      blurb:
        "VS Code fork with an agent in the side panel. Compose multi-file edits and run them against the codebase.",
      url: "https://cursor.com",
      media: { kind: "youtube", id: "s5kX-UHgMLo" },
    },
    {
      tool: "Paul Gauthier",
      title: "aider",
      blurb:
        "Open-source CLI pair-programmer. Pioneer of repo-aware editing with sensible Git defaults.",
      url: "https://aider.chat",
    },
    {
      tool: "Cline",
      title: "Cline",
      blurb:
        "Open-source agent for VS Code. Reads, writes, runs commands, and shows every diff before you accept it.",
      url: "https://github.com/cline/cline",
      media: { kind: "youtube", id: "CYIteJeNcuw" },
    },
  ],

  apis: [
    {
      tool: "Perplexity",
      title: "Perplexity",
      blurb:
        "Answer engine. Built on LLM APIs plus retrieval; the model is the product, not the chat window.",
      url: "https://www.perplexity.ai",
      media: { kind: "youtube", id: "YeldJ4UezDQ" },
    },
    {
      tool: "Granola",
      title: "Granola",
      blurb:
        "Meeting notes that listen, transcribe, and summarise into the format you actually use. API + on-device.",
      url: "https://www.granola.ai",
    },
    {
      tool: "Raycast",
      title: "Raycast AI",
      blurb:
        "Models wired into the macOS command bar. Quick actions, custom commands, context from your tabs.",
      url: "https://www.raycast.com/ai",
      media: { kind: "youtube", id: "RFwumqHLc8Y" },
    },
    {
      tool: "Cal.com",
      title: "Cal AI",
      blurb:
        "Scheduling that books you in plain English. Good worked example of model-as-feature.",
      url: "https://cal.ai",
    },
  ],

  "knowledge-systems": [
    {
      tool: "Anthropic",
      title: "Agent Skills",
      blurb:
        "The official skills system: tiny Markdown files that change what Claude does when their trigger fires.",
      url: "https://docs.claude.com/en/docs/agents-and-tools/agent-skills",
      media: { kind: "youtube", id: "fOxC44g8vig" },
    },
    {
      tool: "Cursor",
      title: "Cursor Rules",
      blurb:
        ".mdc files that inject project context, conventions, and constraints into every Cursor turn.",
      url: "https://docs.cursor.com/context/rules",
    },
    {
      tool: "Letta",
      title: "Letta (MemGPT)",
      blurb:
        "Open-source long-term memory for agents. Read the original MemGPT paper for the model-of-memory pattern.",
      url: "https://www.letta.com",
      media: { kind: "youtube", id: "3GqHXjCD7qA" },
    },
    {
      tool: "Glean",
      title: "Glean",
      blurb:
        "Enterprise knowledge search and assistants. Worked example of retrieval at company scale.",
      url: "https://www.glean.com",
      media: { kind: "youtube", id: "b7qojk3Ju9U" },
    },
  ],

  "integrated-systems": [
    {
      tool: "Cognition",
      title: "Devin",
      blurb:
        "End-to-end software engineer that plans, codes, tests, and ships across your stack with a long horizon.",
      url: "https://devin.ai",
      media: { kind: "youtube", id: "fjHtjT7GO1c" },
    },
    {
      tool: "Lindy",
      title: "Lindy",
      blurb:
        "Build agents that work across Gmail, Calendar, Slack, HubSpot, and 1000+ other tools. Trigger-driven.",
      url: "https://www.lindy.ai",
      media: { kind: "youtube", id: "m0bkNFIOLb4" },
    },
    {
      tool: "Zapier",
      title: "Zapier Agents",
      blurb:
        "Multi-step agents over Zapier's 7000-app graph. The boring-but-powerful end of integrated systems.",
      url: "https://zapier.com/agents",
      media: { kind: "youtube", id: "Ski0RwvwV_I" },
    },
    {
      tool: "Anthropic",
      title: "Computer Use",
      blurb:
        "Claude operating a real desktop: clicks, scrolls, types. The frontier of agents with hands.",
      url: "https://www.anthropic.com/news/developing-computer-use",
      media: { kind: "youtube", id: "ODaHJzOyVCQ" },
    },
  ],
};
