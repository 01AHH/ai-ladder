"use client";

import { useRef, useState } from "react";
import { rungs } from "@/content/rungs";
import { ContextInput } from "@/components/ContextInput";
import { Rung } from "@/components/Rung";

export default function Home() {
  const [context, setContext] = useState("");
  const contextRef = useRef(context);
  contextRef.current = context;

  return (
    <main>
      <ContextInput value={context} onChange={setContext} />
      <div className="pb-24">
        {rungs.map((r, i) => (
          <Rung key={r.id} rung={r} number={i + 1} getContext={() => contextRef.current} />
        ))}
      </div>
      <footer className="mx-auto max-w-2xl border-t border-stone-200 px-6 py-8 text-sm text-stone-500">
        Public on{" "}
        <a className="underline" href="https://github.com/01AHH/ai-ladder">
          GitHub
        </a>
        . The repo is the content.
      </footer>
    </main>
  );
}
