"use client";

import { useState } from "react";
import type { Rung as RungType } from "@/content/rungs";
import { StreamedOutput } from "./StreamedOutput";
import { InspirationGallery } from "./InspirationGallery";

type Props = {
  rung: RungType;
  getContext: () => string;
};

type State = "idle" | "streaming" | "done" | "error";

function renderInlineMarkdown(text: string) {
  // Tiny inline parser: **bold** and *italic*. Returns React nodes.
  const out: React.ReactNode[] = [];
  const re = /(\*\*[^*]+\*\*|\*[^*]+\*)/g;
  let last = 0;
  let match;
  let key = 0;
  while ((match = re.exec(text)) !== null) {
    if (match.index > last) {
      out.push(text.slice(last, match.index));
    }
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

export function Rung({ rung, getContext }: Props) {
  const [text, setText] = useState("");
  const [state, setState] = useState<State>("idle");
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const isClimax = rung.number === 5;

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

  const buttonLabel = state === "streaming" ? "streaming…" : state === "done" ? "Regenerate" : isClimax ? "Generate my skill" : "Generate my example";
  const buttonArrow = state === "streaming" ? "·" : state === "done" ? "↻" : "→";

  const meta = (
    <div className="rung-meta">
      <span className="step">↑ Rung {rung.number} of 06</span>
      <span>{rung.tagline}</span>
      <span>{rung.time}</span>
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

  if (isClimax) {
    return (
      <section className="rung rung-5" id={`rung-${rung.number}`}>
        <div className="climax-mark">▲ The ladder pays off</div>
        <div className="inner">
          <div className="layout">
            <div>
              <div className="numeral-wrap">
                <h2 className="rung-numeral">05</h2>
              </div>
              {meta}
              <h3 className="rung-name">
                <em>{rung.name}.</em>
              </h3>
              <p className="rung-def">{renderInlineMarkdown(rung.definition)}</p>
              {rung.crit && (
                <p className="crit">{renderInlineMarkdown(rung.crit)}</p>
              )}
            </div>

            <div>
              <div className="rung-meta" style={{ marginBottom: 18 }}>
                <span style={{ color: "var(--accent)" }}>
                  ⌁ Your skill shelf — a few examples
                </span>
              </div>
              <div className="skills-stack">
                {rung.skills?.map((s) => (
                  <div className="skill-card" key={s.name}>
                    <span className="tag">{s.tag}</span>
                    <span className="name">{s.name}</span>
                    <span className="trigger">
                      <span className="when">Fires when</span>
                      {s.trigger}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {generate}
          {stream}

          <InspirationGallery rungId={rung.id} />
        </div>
      </section>
    );
  }

  return (
    <section className="rung" id={`rung-${rung.number}`}>
      <div className="rung-head">
        <h2 className="rung-numeral">
          {String(rung.number).padStart(2, "0")}
          <span className="slash">/</span>
          <span className="of">06</span>
        </h2>
        {meta}
      </div>
      <h3 className="rung-name">
        <em>{rung.name}.</em>
      </h3>
      <p className="rung-def">{renderInlineMarkdown(rung.definition)}</p>

      {rung.seedExample && (
        <div className="seed">
          <div className="seed-label">Seed example — generic</div>
          <div className="seed-text">{rung.seedExample}</div>
        </div>
      )}

      {generate}
      {stream}

      <InspirationGallery rungId={rung.id} />
    </section>
  );
}
