"use client";

import { useState } from "react";
import type { Rung as RungType } from "@/content/rungs";
import { StreamedOutput } from "./StreamedOutput";

type Props = {
  rung: RungType;
  number: number;
  getContext: () => string;
};

type State = "idle" | "streaming" | "done" | "error";

export function Rung({ rung, number, getContext }: Props) {
  const [text, setText] = useState("");
  const [state, setState] = useState<State>("idle");
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  async function handleGenerate() {
    const context = getContext();
    if (!context.trim()) {
      document.getElementById("context-input")?.scrollIntoView({ behavior: "smooth", block: "start" });
      document.querySelector<HTMLTextAreaElement>("#context-input textarea")?.focus();
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

  return (
    <article className="mx-auto max-w-2xl border-t border-stone-200 px-6 py-10">
      <div className="flex items-baseline gap-3">
        <span className="text-sm font-mono text-stone-500">{number.toString().padStart(2, "0")}</span>
        <h2 className="text-xl font-semibold text-stone-900">{rung.name}</h2>
      </div>
      <p className="mt-1 text-stone-600">{rung.definition}</p>
      <p className="mt-4 text-stone-700">{rung.seedExample}</p>

      <button
        onClick={handleGenerate}
        disabled={state === "streaming"}
        className="mt-5 rounded-md bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-800 disabled:opacity-50"
      >
        {state === "streaming" ? "Generating..." : "Generate my example"}
      </button>

      <StreamedOutput text={text} state={state} errorMessage={errorMessage} />
    </article>
  );
}
