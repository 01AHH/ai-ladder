import { renderEssay, CLAUDE_MD_SAMPLE } from "./markdown";

export function EssayBlock({ essay }: { essay?: string }) {
  if (!essay) return null;
  return (
    <details className="essay">
      <summary>
        <span className="essay-eyebrow">§ The long-form</span>
        <span className="essay-title">
          Read the essay: <em>Context Is the Compound Interest of AI</em>
        </span>
        <span className="essay-cue">expand ↓</span>
      </summary>
      <div className="essay-body">{renderEssay(essay)}</div>
    </details>
  );
}

export function ClaudeMdSample({ rungId }: { rungId: string }) {
  if (rungId !== "claude-md") return null;
  return (
    <details className="essay">
      <summary>
        <span className="essay-eyebrow">§ Sample</span>
        <span className="essay-title">
          See a <em>good starter CLAUDE.md</em>
        </span>
        <span className="essay-cue">expand ↓</span>
      </summary>
      <div className="essay-body">{renderEssay(CLAUDE_MD_SAMPLE)}</div>
    </details>
  );
}

export function RepoCta({ rungId }: { rungId: string }) {
  if (rungId !== "repo-structure") return null;
  return (
    <a
      className="repo-cta"
      href="https://github.com/01AHH/ai-ladder"
      target="_blank"
      rel="noreferrer noopener"
    >
      <span className="repo-cta-eyebrow">⌥ This repo, exactly</span>
      <span className="repo-cta-title">
        Browse <em>ai-ladder</em> on GitHub
      </span>
      <span className="repo-cta-blurb">
        The site you&apos;re reading is structured the way the essay describes.
        CLAUDE.md at the root, a /prompts folder, a /.claude/skills folder.
        Clone it. Look at the files. See if the shape matches yours.
      </span>
      <span className="repo-cta-cue">github.com/01AHH/ai-ladder ↗</span>
    </a>
  );
}
