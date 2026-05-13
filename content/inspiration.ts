export type InspoMedia =
  | { kind: "image"; src: string; alt: string; ratio?: number }
  | { kind: "video"; src: string; ratio?: number; poster?: string }
  | { kind: "youtube"; id: string; ratio?: number; short?: boolean }
  | { kind: "loom"; id: string; ratio?: number };

export type InspoItem = {
  tool: string;
  title: string;
  blurb: string;
  url: string;
  media?: InspoMedia;
};

/**
 * Per-rung gallery: small specific things you could build for your actual
 * life, plus a few verified shorts of real people doing exactly that. The
 * point is excitement, not directory coverage. Keep blurbs sentence-short.
 * Read each card aloud. If it doesn't make you want to try it Sunday,
 * rewrite it.
 */
export const inspiration: Record<string, InspoItem[]> = {
  prompting: [
    {
      tool: "Natalie Barbu",
      title: "Claude planned my wedding",
      blurb:
        "Treating Claude like a wedding coordinator. Vendor shortlists, day-of timelines, the list of things you'd otherwise forget.",
      url: "https://claude.ai/new",
      media: { kind: "youtube", id: "dgvVpyMr1PU", short: true },
    },
    {
      tool: "You, this weekend",
      title: "The hard conversation you keep avoiding",
      blurb:
        "Paste the situation. Ask what you might be getting wrong about the other person. Three openings, three tones.",
      url: "https://claude.ai/new",
    },
    {
      tool: "You, with a deadline",
      title: "Pick the name",
      blurb:
        "A baby, a cat, a band, a Wi-Fi network. Constraint-loaded brainstorming is what LLMs are best at, and most people use them like a search bar.",
      url: "https://claude.ai/new",
    },
    {
      tool: "You, before bed",
      title: "Loosen the knot",
      blurb:
        "Type the thing you've been chewing on for a week. Ask Claude to play it back from three angles you didn't pick.",
      url: "https://claude.ai/new",
    },
  ],

  "vibe-coding": [
    {
      tool: "You, with a shared-list problem",
      title: "An app for the family grocery list",
      blurb:
        "The shared list that opens fast and remembers what aisle the chickpeas live in. Lovable, one prompt, your nan uses it now.",
      url: "https://lovable.dev",
    },
    {
      tool: "You, before the wedding",
      title: "The RSVP site no-one has to log in to",
      blurb:
        "Plus-ones, dietaries, song requests, a map. One Lovable prompt, your own domain, done by Sunday.",
      url: "https://lovable.dev",
    },
    {
      tool: "You, with a hobby",
      title: "The tracker your phone doesn't have",
      blurb:
        "Reading log. Sleep log. Garden log. Run log. The shape of the form is the shape of how you'd actually use it. Build it for yourself in v0.",
      url: "https://v0.dev",
    },
    {
      tool: "You, with kids",
      title: "The chore chart that doesn't suck",
      blurb:
        "Replit Agent will build you a kid-friendly tracker with sticker rewards in an hour. Print it if they prefer paper.",
      url: "https://replit.com/agent",
    },
  ],

  "coding-agents": [
    {
      tool: "You, with a dusty repo",
      title: "Personal site, finished this time",
      blurb:
        "Point Claude Code at your half-built portfolio. Ask for the smallest shippable version. The agent makes the cuts you couldn't.",
      url: "https://claude.com/claude-code",
    },
    {
      tool: "You, drowning in photos",
      title: "Sort five years of camera roll",
      blurb:
        "A small script that reads EXIF, clusters by location and event, and renames the folders the way you actually think about them.",
      url: "https://claude.com/claude-code",
    },
    {
      tool: "You, with a side project",
      title: "The CLI that runs your morning",
      blurb:
        "Six lines that open your day: weather, calendar, the one thing you swore you'd do. Claude Code wires it while you make coffee.",
      url: "https://claude.com/claude-code",
    },
    {
      tool: "You, with an aunt's old blog",
      title: "Save the recipes before the site dies",
      blurb:
        "Scrape the WordPress your aunt ran in 2011. Save the recipes as Markdown. Cursor handles the messy HTML.",
      url: "https://cursor.com",
    },
  ],

  apis: [
    {
      tool: "You, mid-marathon-training",
      title: "The training partner that texts back",
      blurb:
        "An SMS bot wired to the Claude API. You text it after every run. It logs, replies, asks the one good question.",
      url: "https://console.anthropic.com",
    },
    {
      tool: "You, with a parent who lives alone",
      title: "Daily check-in to mum",
      blurb:
        "One question a day, by SMS, with Claude on the other end. The answer lands on a tiny dashboard only you see.",
      url: "https://console.anthropic.com",
    },
    {
      tool: "You, in the kitchen",
      title: "A meal plan that thinks like you",
      blurb:
        "A weekly menu generator that knows your fridge, your kid's allergies, and that you hate prep on Wednesdays. Built once, used forever.",
      url: "https://console.anthropic.com",
    },
    {
      tool: "You, with a thousand bookmarks",
      title: "Your private second brain, but actually",
      blurb:
        "Pinboard, Notion, or just a text file plus the Claude API. Ask your bookmarks questions. Get answers back, with sources.",
      url: "https://console.anthropic.com",
    },
  ],

  skills: [
    {
      tool: "You, with a family",
      title: "A skill for the family calendar",
      blurb:
        "One Markdown file that fires when you say 'plan our weekend.' It knows the kids' birthdays, the recurring dinners, the Saturdays you actually have.",
      url: "https://docs.claude.com/en/docs/agents-and-tools/agent-skills",
    },
    {
      tool: "You, in your inbox",
      title: "Your reply, in your voice",
      blurb:
        "A skill that fires on 'draft reply.' It's seen how you actually write. The result lands inside your tone, not GPT's.",
      url: "https://docs.claude.com/en/docs/agents-and-tools/agent-skills",
    },
    {
      tool: "This repo",
      title: "Nine skills, ready to clone",
      blurb:
        "Open the .claude/skills folder in this repo on GitHub. Each one is a real, MIT-licensed skill — brainstorming, TDD, debugging, hygiene. Read one, copy it, change the description.",
      url: "https://github.com/01AHH/ai-ladder/tree/main/.claude/skills",
    },
  ],

  memory: [
    {
      tool: "ICOR with Tom",
      title: "Claude that knows who I am",
      blurb:
        "He walks through the memory-file pattern: Claude that doesn't start from zero every conversation. Useful even if you don't run a company.",
      url: "https://docs.claude.com/en/docs/build-with-claude/memory",
      media: { kind: "youtube", id: "A4rrL4WAb_8" },
    },
    {
      tool: "You, after a year",
      title: "Notes Claude actually remembers",
      blurb:
        "A memory file that survives sessions. Drop in: how you make decisions, your three current projects, the names of the people in your life. Compounding interest for prompts.",
      url: "https://docs.claude.com/en/docs/build-with-claude/memory",
    },
    {
      tool: "Anthropic memory tool",
      title: "File-based memory, on the API",
      blurb:
        "For production agents: Claude reads and writes files inside a sandbox that persists across conversations. The same idea as a /memory folder, but as a primitive your code can call.",
      url: "https://docs.claude.com/en/docs/build-with-claude/memory",
    },
  ],

  "integrated-systems": [
    {
      tool: "You, on holiday",
      title: "The agent that handles arrivals",
      blurb:
        "Lindy wired to your inbox, your calendar, your partner's SMS. Lands when the plane lands. 'We're in. Heading to the hotel. Reservation's at 8.'",
      url: "https://www.lindy.ai",
    },
    {
      tool: "You, on payday",
      title: "Your money, watched gently",
      blurb:
        "An agent that reads your bank notifications, categorises them, and texts you Friday with a single number you can act on.",
      url: "https://www.lindy.ai",
    },
    {
      tool: "You, on a long shift",
      title: "The morning brief",
      blurb:
        "Claude reads your inbox, your calendar, one Notion page; writes a 90-second briefing; emails it at 06:50. The day starts before your second coffee.",
      url: "https://www.lindy.ai",
    },
    {
      tool: "You, in front of your laptop",
      title: "Hands on the wheel",
      blurb:
        "Computer-use Claude finishing the boring forms. Insurance renewals, school-portal logins, the quarterly compliance click-through. Watch once, then walk away.",
      url: "https://www.anthropic.com/news/developing-computer-use",
    },
  ],
};
