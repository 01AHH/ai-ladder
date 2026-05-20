// content/tree-nodes.ts

export type Region = 'root' | 'soft' | 'cluster' | 'tech';

export type NodeId =
  | 'prompting'
  | 'cowork' | 'scheduling' | 'connectors'
  | 'skills' | 'sessions' | 'superpowers' | 'memory' | 'knowledge'
  | 'vibe' | 'agents' | 'repo' | 'apis' | 'cron' | 'integrated';

export interface ResourceLink {
  source: 'github' | 'docs' | 'video' | 'essay' | 'talk';
  title: string;
  href: string;
  internal?: boolean;
}

export type Tier = 'root' | 'core' | 'mid' | 'deep';

export interface TreeNode {
  id: NodeId;
  label: string;
  subtitle?: string;
  region: Region;
  /** Skill-tree depth tier. Drives hex radius and visual emphasis. */
  tier: Tier;
  /** XP awarded when this node is climbed. Used by the HUD rank bar. */
  xp: number;
  /** SVG viewBox coordinates (viewBox is 1400x660) */
  x: number;
  y: number;
  tag: string;
  timeToLearn: string;
  chips: string[];
  whatItIs: string;
  howToLearn: string[];
  resources: ResourceLink[];
  essayAnchor?: string;
  comingSoon?: boolean;
}

export type EdgeKind = 'spine' | 'cluster' | 'bridge';

export interface TreeEdge {
  from: NodeId;
  to: NodeId;
  kind: EdgeKind;
}

const PLACEHOLDER_WHAT = 'Coming soon. The author is writing this rung.';
const PLACEHOLDER_HOW: string[] = ['Content pending.'];

export const NODES: Record<NodeId, TreeNode> = {
  prompting: {
    id: 'prompting',
    label: 'Prompting',
    region: 'root',
    tier: 'root',
    xp: 50,
    x: 700, y: 110,
    tag: 'The conversation.',
    timeToLearn: '~5 min to start',
    chips: ['Claude.ai', 'ChatGPT', 'a browser tab'],
    whatItIs:
      'You open a chat window, ask for things, watch a paragraph come back. The model does the work; you steer. A sharp prompt is a huge unlock.',
    howToLearn: [
      'Open Claude.ai. Paste a real problem from your week.',
      'Frame it: role, context, constraints, the kind of answer you want.',
      'Iterate. Ask Claude to play it back from three angles you didn\'t pick.',
    ],
    resources: [
      { source: 'essay', title: 'Read the full rung on the essay', href: '/#prompting', internal: true },
    ],
    essayAnchor: '#prompting',
  },

  cowork: {
    id: 'cowork',
    label: 'Claude Cowork',
    subtitle: '(Claude.ai Projects)',
    region: 'soft',
    tier: 'core',
    xp: 30,
    x: 380, y: 200,
    tag: 'Working with Claude like a knowledge base.',
    timeToLearn: '~an afternoon',
    chips: ['Claude.ai Projects', 'persistent files'],
    whatItIs: PLACEHOLDER_WHAT,
    howToLearn: PLACEHOLDER_HOW,
    resources: [],
    comingSoon: true,
  },

  scheduling: {
    id: 'scheduling',
    label: 'Scheduling',
    region: 'soft',
    tier: 'mid',
    xp: 20,
    x: 380, y: 320,
    tag: 'Tasks that run on a clock.',
    timeToLearn: '~an hour',
    chips: ['Claude Code schedules'],
    whatItIs: PLACEHOLDER_WHAT,
    howToLearn: PLACEHOLDER_HOW,
    resources: [],
    comingSoon: true,
  },

  connectors: {
    id: 'connectors',
    label: 'Connectors',
    region: 'soft',
    tier: 'deep',
    xp: 30,
    x: 380, y: 440,
    tag: 'APIs, but you don\'t have to write code.',
    timeToLearn: '~a day',
    chips: ['Claude connectors', 'MCP'],
    whatItIs: PLACEHOLDER_WHAT,
    howToLearn: PLACEHOLDER_HOW,
    resources: [],
    comingSoon: true,
  },

  skills: {
    id: 'skills',
    label: 'Skills',
    region: 'cluster',
    tier: 'core',
    xp: 40,
    x: 700, y: 200,
    tag: 'Behaviour you can install.',
    timeToLearn: '~an hour to a day',
    chips: ['Claude Code skills', '.claude/skills/', 'superpowers'],
    whatItIs:
      'A skill is a markdown file the model loads when a trigger fires. A prompt is something you write once. **A skill is something the model does forever.**',
    howToLearn: [
      'Open the *brainstorming* skill in this repo. Read it top-to-bottom.',
      'Copy it. Strip it. Rewrite the description for one repeating thing you do.',
      'Put your version in *.claude/skills/*. Use it once. Watch it fire.',
    ],
    resources: [
      { source: 'github', title: 'obra/superpowers', href: 'https://github.com/obra/superpowers' },
      { source: 'essay', title: 'Read the full rung on the essay', href: '/#skills', internal: true },
    ],
    essayAnchor: '#skills',
  },

  sessions: {
    id: 'sessions',
    label: 'Session limits',
    subtitle: '(stretching the context window)',
    region: 'cluster',
    tier: 'core',
    xp: 25,
    x: 580, y: 130,
    tag: 'When your chat runs out of room.',
    timeToLearn: '~10 min',
    chips: ['/compact', 'Haiku', 'subagents', '/memory'],
    whatItIs:
      'Every long session eventually hits the context wall. The model forgets decisions, replies blur, costs climb. The fix isn\'t a bigger model — it\'s making each token earn its keep.',
    howToLearn: [
      'Run /compact *before* the window is full, not after. Frees room to keep going.',
      'One task per session. Don\'t let a single chat carry every topic of the week.',
      'Drop to Haiku for renames, sweeps, lookups — anything Opus is overkill for.',
      'Use subagents for big searches so noisy results stay out of the main thread.',
      'Anything you re-explain three times belongs in CLAUDE.md or /memory.',
    ],
    resources: [
      { source: 'essay', title: 'Read the full rung on the essay', href: '/#session-limits', internal: true },
    ],
    essayAnchor: '#session-limits',
  },

  superpowers: {
    id: 'superpowers',
    label: 'Superpowers',
    region: 'cluster',
    tier: 'mid',
    xp: 30,
    x: 580, y: 310,
    tag: 'A library of skills, opinionated.',
    timeToLearn: '~an evening',
    chips: ['superpowers framework'],
    whatItIs: PLACEHOLDER_WHAT,
    howToLearn: PLACEHOLDER_HOW,
    resources: [
      { source: 'github', title: 'obra/superpowers', href: 'https://github.com/obra/superpowers' },
    ],
    comingSoon: true,
  },

  memory: {
    id: 'memory',
    label: 'Memory',
    region: 'cluster',
    tier: 'mid',
    xp: 30,
    x: 820, y: 310,
    tag: 'Knowledge you can install.',
    timeToLearn: '~a week minimum',
    chips: ['CLAUDE.md', '/memory', 'Anthropic memory tool'],
    whatItIs:
      'A persistent store the model reads at the start of every session. Move every standing fact about your team, your stack, and your decisions into */memory*. The next conversation begins where the last one ended.',
    howToLearn: [
      'Create a */memory* folder at the root of any repo you own.',
      'Drop in 3 files: who you are, your three current projects, the people in your life.',
      'Reference */memory* from your CLAUDE.md. Watch the next session skip the warm-up.',
    ],
    resources: [
      { source: 'essay', title: 'Read the full rung on the essay', href: '/#memory', internal: true },
    ],
    essayAnchor: '#memory',
  },

  knowledge: {
    id: 'knowledge',
    label: 'Knowledge',
    region: 'cluster',
    tier: 'deep',
    xp: 40,
    x: 700, y: 420,
    tag: 'Where behaviour and memory compound.',
    timeToLearn: '~ongoing',
    chips: ['the long game'],
    whatItIs: PLACEHOLDER_WHAT,
    howToLearn: PLACEHOLDER_HOW,
    resources: [],
    comingSoon: true,
  },

  vibe: {
    id: 'vibe',
    label: 'Vibe coding',
    region: 'tech',
    tier: 'core',
    xp: 30,
    x: 1020, y: 200,
    tag: 'Shipped software, easily.',
    timeToLearn: '~an afternoon',
    chips: ['Lovable', 'v0', 'Bolt'],
    whatItIs:
      'You describe an app in plain English and a real working web app comes out the other end. A real URL, a real database, a real thing on the internet, and you never opened a terminal.',
    howToLearn: [
      'Open Lovable. Describe the smallest internal page your team would actually use.',
      'Ship it tonight. Don\'t add features. Watch it work.',
      'Show one person who isn\'t you.',
    ],
    resources: [
      { source: 'essay', title: 'Read the full rung on the essay', href: '/#vibe', internal: true },
    ],
    essayAnchor: '#vibe',
  },

  agents: {
    id: 'agents',
    label: 'Coding agents',
    region: 'tech',
    tier: 'mid',
    xp: 40,
    x: 1020, y: 290,
    tag: 'Pair-programming, asymmetric.',
    timeToLearn: '~a weekend',
    chips: ['Claude Code', 'Codex', 'Gemini', 'your terminal'],
    whatItIs:
      'The agent reads your repo, edits real files, runs the tests, fixes what broke. Not a chat window — a colleague in your terminal.',
    howToLearn: [
      'Install Claude Code. Point it at a half-built personal project.',
      'Ask for the three smallest shippable PRs.',
      'Read every diff before you accept it.',
    ],
    resources: [
      { source: 'essay', title: 'Read the full rung on the essay', href: '/#agents', internal: true },
    ],
    essayAnchor: '#agents',
  },

  repo: {
    id: 'repo',
    label: 'Repo',
    region: 'tech',
    tier: 'mid',
    xp: 30,
    x: 1020, y: 380,
    tag: 'The working substrate.',
    timeToLearn: '~a weekend',
    chips: ['CLAUDE.md', '/.claude', '/memory', '/prompts'],
    whatItIs:
      'At some point your repo stops being a codebase and starts being a *substrate*. Every folder is for the model as much as for you. The agent doesn\'t visit your repo. It lives in it.',
    howToLearn: [
      'Open any repo you own. Add */memory*, */personas*, and */.claude/skills*.',
      'Write a CLAUDE.md at the root. 20 lines is plenty.',
      'Watch the model on its third visit do things its first visit couldn\'t.',
    ],
    resources: [
      { source: 'essay', title: 'Read the full rung on the essay', href: '/#repo', internal: true },
    ],
    essayAnchor: '#repo',
  },

  apis: {
    id: 'apis',
    label: 'APIs',
    region: 'tech',
    tier: 'deep',
    xp: 30,
    x: 920, y: 470,
    tag: 'The model as a function in your codebase.',
    timeToLearn: '~a week',
    chips: ['anthropic SDK', 'webhooks', 'cron'],
    whatItIs:
      'You stop opening a chat window and start calling the model from code. A function with a return value. Now it can read your inbox, classify your tickets, or write a report at 6am.',
    howToLearn: [
      'Get an Anthropic API key. Make your first call from a Node script.',
      'Wire it to one inbox, one webhook, or one cron. Just one.',
      'Watch a loop you used to do by hand run itself.',
    ],
    resources: [
      { source: 'essay', title: 'Read the full rung on the essay', href: '/#apis', internal: true },
    ],
    essayAnchor: '#apis',
  },

  cron: {
    id: 'cron',
    label: 'Cron & scripts',
    region: 'tech',
    tier: 'deep',
    xp: 30,
    x: 1120, y: 470,
    tag: 'Engineering ops for AI workflows.',
    timeToLearn: '~a week',
    chips: ['cron', 'GitHub Actions', 'shell scripts'],
    whatItIs: PLACEHOLDER_WHAT,
    howToLearn: PLACEHOLDER_HOW,
    resources: [],
    comingSoon: true,
  },

  integrated: {
    id: 'integrated',
    label: 'Integrated',
    subtitle: '(knowledge-based systems)',
    region: 'tech',
    tier: 'deep',
    xp: 50,
    x: 1020, y: 570,
    tag: 'Agents with hands on your stack.',
    timeToLearn: '~a quarter',
    chips: ['Gmail', 'Calendar', 'Slack', 'your CRM', 'your DB'],
    whatItIs:
      'The model crosses out of the chat window and into the system of record. You\'re not drafting an email; you\'re asking it to send the email, file the reply, update the deal, and move on.',
    howToLearn: [
      'Pick the most boring pair of tools you use daily.',
      'Wire one agent that handles a single, well-defined trigger between them.',
      'Don\'t pick the hardest pair. Pick the most boring.',
    ],
    resources: [
      { source: 'essay', title: 'Read the full rung on the essay', href: '/#integrated', internal: true },
    ],
    essayAnchor: '#integrated',
  },
};

export const EDGES: TreeEdge[] = [
  // Root → branches
  { from: 'prompting', to: 'cowork', kind: 'spine' },
  { from: 'prompting', to: 'vibe', kind: 'spine' },
  { from: 'prompting', to: 'skills', kind: 'bridge' },

  // Non-technical spine
  { from: 'cowork', to: 'scheduling', kind: 'spine' },
  { from: 'scheduling', to: 'connectors', kind: 'spine' },

  // Technical spine
  { from: 'vibe', to: 'agents', kind: 'spine' },
  { from: 'agents', to: 'repo', kind: 'spine' },
  { from: 'repo', to: 'apis', kind: 'spine' },
  { from: 'repo', to: 'cron', kind: 'spine' },
  { from: 'apis', to: 'integrated', kind: 'spine' },
  { from: 'cron', to: 'integrated', kind: 'spine' },

  // Cluster diamond
  { from: 'skills', to: 'sessions', kind: 'cluster' },
  { from: 'skills', to: 'superpowers', kind: 'cluster' },
  { from: 'skills', to: 'memory', kind: 'cluster' },
  { from: 'sessions', to: 'memory', kind: 'cluster' },
  { from: 'superpowers', to: 'knowledge', kind: 'cluster' },
  { from: 'memory', to: 'knowledge', kind: 'cluster' },

  // Bridges (cluster → branches)
  { from: 'superpowers', to: 'cowork', kind: 'bridge' },
  { from: 'memory', to: 'agents', kind: 'bridge' },
  { from: 'memory', to: 'repo', kind: 'bridge' },
  { from: 'knowledge', to: 'integrated', kind: 'bridge' },
];

/** Suggested learning order. Drives the gold dotted trail and the
 *  "NEXT QUEST" banner in the HUD. */
export const RECOMMENDED_PATH: NodeId[] = [
  'prompting',
  'skills', 'sessions', 'memory', 'superpowers', 'knowledge',
  'cowork', 'scheduling', 'connectors',
  'vibe', 'agents', 'repo', 'apis', 'cron', 'integrated',
];
