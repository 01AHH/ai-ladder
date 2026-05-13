"use client";

import { useState } from "react";
import { rungs, type Rung as RungType } from "@/content/rungs";
import { StreamedOutput } from "./StreamedOutput";
import { InspirationGallery } from "./InspirationGallery";

type Props = {
  rung: RungType;
  getContext: () => string;
};

type State = "idle" | "streaming" | "done" | "error";

const TOTAL = String(rungs.length).padStart(2, "0");

function renderInlineMarkdown(text: string): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  const re = /(\*\*[^*]+\*\*|\*[^*]+\*)/g;
  let last = 0;
  let match;
  let key = 0;
  while ((match = re.exec(text)) !== null) {
    if (match.index > last) out.push(text.slice(last, match.index));
    const token = match[0];
    if (token.startsWith("**")) {
      out.push(<strong key={key++}>{token.slice(2, -2)}</strong>);
    } else {
      out.push(<em key={key++}>{token.slice(1, -1)}</em>);
    }
    last = match.index + token.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

function renderEssay(text: string): React.ReactNode[] {
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

export function Rung({ rung, getContext }: Props) {
  const [text, setText] = useState("");
  const [state, setState] = useState<State>("idle");
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const isClimax = rung.id === "knowledge-systems";

  async function handleGenerate() {
    const context = getContext();
    if (!context.trim()) {
      document.getElementById("context-input")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      document.querySelector<HTMLInputElement>("#context-input input")?.focus();
      return;
    }

    setText("");
    setErrorMessage(undefined);
    setState("streaming");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ context, rung_id: rung.id }),
      });

      if (!res.ok || !res.body) {
        const msg = await res.text();
        setErrorMessage(msg || "Claude couldn't generate. Try again.");
        setState("error");
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        setText(buf);
      }
      setState("done");
    } catch {
      setErrorMessage("Claude couldn't generate. Try again.");
      setState("error");
    }
  }

  const buttonLabel =
    state === "streaming"
      ? "Streaming…"
      : state === "done"
      ? "Regenerate"
      : isClimax
      ? "Generate my skill"
      : "Generate my example";
  const buttonArrow = state === "streaming" ? "·" : state === "done" ? "↻" : "→";

  const meta = (
    <div className="rung-meta">
      <span className="step">↑ Rung {rung.number} of {TOTAL}</span>
      <span>{rung.tagline}</span>
      <span>{rung.time}</span>
    </div>
  );

  const tools = rung.tools.length > 0 && (
    <div className="rung-tools">
      {rung.tools.map((t) => (
        <span key={t} className="chip">
          {t}
        </span>
      ))}
    </div>
  );

  const generate = (
    <button
      className="generate"
      data-state={state === "idle" ? undefined : state}
      onClick={handleGenerate}
      disabled={state === "streaming"}
    >
      {buttonLabel}
      <span className="arrow">{buttonArrow}</span>
    </button>
  );

  const stream = (
    <StreamedOutput text={text} state={state} errorMessage={errorMessage} />
  );

  const essayBlock = rung.essay && (
    <details className="essay">
      <summary>
        <span className="essay-eyebrow">§ The long-form</span>
        <span className="essay-title">
          Read the essay: <em>Context Is the Compound Interest of AI</em>
        </span>
        <span className="essay-cue">expand ↓</span>
      </summary>
      <div className="essay-body">{renderEssay(rung.essay)}</div>
    </details>
  );

  const repoCta = rung.id === "repo-structure" && (
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
        The site you're reading is structured the way the essay describes.
        CLAUDE.md at the root, a /prompts folder, a /.claude/skills folder.
        Clone it. Look at the files. See if the shape matches yours.
      </span>
      <span className="repo-cta-cue">github.com/01AHH/ai-ladder ↗</span>
    </a>
  );

  if (isClimax) {
    return (
      <section
        className="scene rung climax"
        id={`rung-${rung.number}`}
        data-scene-key={rung.sceneKey}
      >
        <div className="scene-inner">
          <div className="rung-stage">
            <div className="climax-stamp">The ladder pays off</div>
            <h2 className="rung-numeral">{String(rung.number).padStart(2, "0")}</h2>
            <div className="rung-meta" style={{ marginTop: 12 }}>
              <span className="step">↑ Rung {rung.number} of {TOTAL}</span>
              <span>{rung.tagline}</span>
            </div>
            <h3 className="rung-name">
              <em>{rung.name}.</em>
            </h3>
            <p className="rung-def">{renderInlineMarkdown(rung.definition)}</p>
            {rung.crit && (
              <p className="crit">{renderInlineMarkdown(rung.crit)}</p>
            )}
          </div>

          <div className="rung-body">
            <div className="shelf-head">Your skill shelf · a few examples</div>
            <div className="shelf">
              {rung.skills?.map((s) => (
                <div className="skill-card" key={s.name}>
                  <div className="top">
                    <span className="tag">{s.tag}</span>
                    <span className="name">{s.name}</span>
                  </div>
                  <div className="trigger">
                    <span className="when">Fires when</span>
                    {s.trigger}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 32 }}>{generate}</div>
            {stream}

            <InspirationGallery rungId={rung.id} />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className="scene rung"
      id={`rung-${rung.number}`}
      data-scene-key={rung.sceneKey}
    >
      <div className="scene-inner">
        <div className="rung-stage">
          {meta}
          <h2 className="rung-numeral">
            {String(rung.number).padStart(2, "0")}
            <span className="of">/{TOTAL}</span>
          </h2>
          <h3 className="rung-name">
            <em>{rung.name}.</em>
          </h3>
          {tools}
        </div>

        <div className="rung-body">
          <p className="rung-def">{renderInlineMarkdown(rung.definition)}</p>

          {rung.seedExample && (
            <div className="seed">
              <div className="seed-label">Seed example · generic</div>
              <div className="seed-text">{rung.seedExample}</div>
            </div>
          )}

          {repoCta}

          {essayBlock}

          {generate}
          {stream}

          <InspirationGallery rungId={rung.id} />
        </div>
      </div>
    </section>
  );
}
