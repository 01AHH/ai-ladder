"use client";

import { useState } from "react";
import type { Rung as RungType } from "@/content/rungs";
import { StreamedOutput } from "./StreamedOutput";

type State = "idle" | "streaming" | "done" | "error";

type Props = {
  rung: RungType;
  getContext: () => string;
};

export function GenerateDemo({ rung, getContext }: Props) {
  const [text, setText] = useState("");
  const [state, setState] = useState<State>("idle");
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const isClimax = rung.id === "skills";

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
      : "Generate good personal example for me";
  const buttonArrow = state === "streaming" ? "·" : state === "done" ? "↻" : "→";

  return (
    <>
      <button
        className="generate"
        data-state={state === "idle" ? undefined : state}
        onClick={handleGenerate}
        disabled={state === "streaming"}
      >
        {buttonLabel}
        <span className="arrow">{buttonArrow}</span>
      </button>
      <StreamedOutput text={text} state={state} errorMessage={errorMessage} />
    </>
  );
}
