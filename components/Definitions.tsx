/**
 * Collapsible glossary callout shown at the top of the hero.
 * Closed: a single-line callout. Open: a compact grid of plain-English
 * definitions for the terms used across the ladder.
 */

type Term = { word: string; gloss: string };

const TERMS: Term[] = [
  {
    word: "Prompt",
    gloss:
      "What you type into the chat. The instruction the model is responding to.",
  },
  {
    word: "Model / LLM",
    gloss:
      "The AI itself. Claude, GPT, Gemini are models. Different models have different strengths.",
  },
  {
    word: "Context",
    gloss:
      "Everything the model can see right now: your message, the conversation so far, any files attached.",
  },
  {
    word: "Agent",
    gloss:
      "An AI that can do things, not just answer. Reads files, runs commands, makes changes.",
  },
  {
    word: "Terminal / CLI",
    gloss:
      "The text window where you type commands to your computer. Where coding agents live.",
  },
  {
    word: "Repo",
    gloss:
      "Short for repository. A folder of code or notes, usually tracked by git so changes are saved as history.",
  },
  {
    word: "API",
    gloss:
      "A way for one program to call another. The Anthropic API lets your own code talk to Claude.",
  },
  {
    word: "Skill",
    gloss:
      "A small markdown file that teaches the model how to do a specific thing. Installs behaviour, not knowledge.",
  },
  {
    word: "Memory",
    gloss:
      "Files the model reads at the start of every session so you don't have to re-explain yourself.",
  },
  {
    word: "Vibe coding",
    gloss:
      "Describing software in plain English and getting a working app back. No code editing required.",
  },
  {
    word: "Webhook",
    gloss:
      "A URL another service hits when something happens. The wiring that lets systems trigger each other.",
  },
  {
    word: "Markdown",
    gloss:
      "A plain-text format with light formatting (# for headings, * for italics). What most AI files are written in.",
  },
];

export function Definitions() {
  return (
    <details className="defs">
      <summary>
        <span className="defs-eyebrow">New to AI?</span>
        <span className="defs-title">
          A <em>plain-English glossary</em> for the terms used on this page.
        </span>
        <span className="defs-cue">
          <span className="defs-cue-open">Open ↓</span>
          <span className="defs-cue-close">Close ↑</span>
        </span>
      </summary>
      <div className="defs-body">
        <dl className="defs-grid">
          {TERMS.map((t) => (
            <div className="defs-row" key={t.word}>
              <dt>{t.word}</dt>
              <dd>{t.gloss}</dd>
            </div>
          ))}
        </dl>
      </div>
    </details>
  );
}
