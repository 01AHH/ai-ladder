export const CLAUDE_MD_SAMPLE = `# CLAUDE.md

A note for you, Claude, at the start of every session in this repo.

## Who I am

I'm Sam, a product manager at a B2B logistics startup. I work in 90-minute blocks and lose patience with vague answers. Default to direct, terse, founder-level prose. No corporate language. Lead with the point, not the context.

## What we're building

A pricing dashboard for the internal ops team. Next.js + Tailwind + Supabase. Production lives at pricing.acme.com, staging at staging.pricing.acme.com.

## Standing rules

- Never push directly to main. Always open a PR.
- Tests live next to the file they test (\`*.test.ts\`).
- Bump the migration version on any schema change.
- Don't add a dependency to solve a problem one helper function could solve.

## Where else to look

- /memory — facts about the team, customers, decisions we've made
- /docs/specs — feature specs (treat as ground truth)
- /.claude/skills — the workflows I've already taught you`;

export function renderInlineMarkdown(text: string): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  const re = /(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g;
  let last = 0;
  let match;
  let key = 0;
  while ((match = re.exec(text)) !== null) {
    if (match.index > last) out.push(text.slice(last, match.index));
    const token = match[0];
    if (token.startsWith("**")) {
      out.push(<strong key={key++}>{token.slice(2, -2)}</strong>);
    } else if (token.startsWith("[")) {
      const m = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(token);
      if (m) {
        out.push(
          <a
            key={key++}
            href={m[2]}
            target="_blank"
            rel="noreferrer noopener"
          >
            {m[1]}
          </a>,
        );
      } else {
        out.push(token);
      }
    } else {
      out.push(<em key={key++}>{token.slice(1, -1)}</em>);
    }
    last = match.index + token.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export function renderEssay(text: string): React.ReactNode[] {
  const blocks = text.trim().split(/\n\n+/);
  return blocks.map((raw, i) => {
    const block = raw.trim();
    if (block.startsWith("## ")) {
      return <h4 key={i}>{renderInlineMarkdown(block.slice(3))}</h4>;
    }
    if (block.startsWith("# ")) {
      return <h3 key={i}>{renderInlineMarkdown(block.slice(2))}</h3>;
    }
    const lines = block.split("\n");
    if (lines.every((l) => l.trim().startsWith("- "))) {
      return (
        <ul key={i}>
          {lines.map((l, j) => (
            <li key={j}>{renderInlineMarkdown(l.replace(/^\s*-\s+/, ""))}</li>
          ))}
        </ul>
      );
    }
    return <p key={i}>{renderInlineMarkdown(block)}</p>;
  });
}
