"use client";

import { useRef, useState } from "react";
import { rungs } from "@/content/rungs";
import { ContextInput } from "@/components/ContextInput";
import { Rung } from "@/components/Rung";
import { LeftRail } from "@/components/LeftRail";

const STEPS = [
  {
    rung: 1,
    what:
      "Open Claude.ai and re-do your last meeting follow-up email, but ask it to find what you didn't say.",
    where: "20 min · claude.ai",
  },
  {
    rung: 2,
    what:
      "Describe to Lovable the smallest internal page your team would actually use. Ship it tonight.",
    where: "1 hr · lovable",
  },
  {
    rung: 3,
    what:
      "Point Claude Code at the repo you keep meaning to clean up. Ask it for the three smallest PRs.",
    where: "1 evening · claude code",
  },
  {
    rung: 4,
    what:
      "Spin up one repo for one part of your life. CLAUDE.md, a /memory folder, three markdown files. Start the brain.",
    where: "1 evening · any editor",
  },
  {
    rung: 5,
    what:
      "Wire a single API call into one inbox or webhook. Just one. Ship the smallest possible loop.",
    where: "1 weekend · anthropic api",
  },
  {
    rung: 6,
    what:
      "Write your first skill. One file. The thing you keep re-explaining to Claude. Stop re-explaining.",
    where: "2 hrs · claude.ai",
  },
  {
    rung: 7,
    what:
      "Connect one tool to one tool, mediated by an agent. Don't pick the hardest pair. Pick the most boring.",
    where: "1 quarter · your stack",
  },
];

export default function Home() {
  const [context, setContext] = useState("");
  const contextRef = useRef(context);
  contextRef.current = context;

  return (
    <>
      <LeftRail />

      <header className="topbar">
        <div className="mark">
          AI · LADDER<span className="dot"> .</span>
        </div>
        <div className="meta">
          <span>SEVEN RUNGS</span>
          <span>ONE STEP</span>
          <span>EST. 2026</span>
        </div>
      </header>

      <main>
        <section className="hero" id="hero">
          <div className="eyebrow">
            <span className="swatch" />
            A field guide to what you can actually do with AI · Issue 01
          </div>
          <ContextInput value={context} onChange={setContext} />
        </section>

        <div id="ladder-intro" />

        {rungs.map((r) => (
          <Rung key={r.id} rung={r} getContext={() => contextRef.current} />
        ))}

        <section className="one-step" id="onestep">
          <div className="rung-meta" style={{ marginBottom: 18 }}>
            <span className="step">⌂ Now pick one</span>
            <span>Smallest possible next move</span>
          </div>
          <h2>
            The whole point is the <em>step</em>, not the ladder.
          </h2>
          <p>
            Pick one of these. Block twenty minutes for it this week. The ladder is
            only useful if you put your foot on it.
          </p>
          <div className="step-list">
            {STEPS.map((s) => (
              <a key={s.rung} className="step-row" href={`#rung-${s.rung}`}>
                <div className="n">↑ Rung 0{s.rung}</div>
                <div className="what">{s.what}</div>
                <div className="where">{s.where}</div>
              </a>
            ))}
          </div>
        </section>

        <section className="manifesto" id="why">
          <div className="eyebrow">
            <span className="step">§ Why this exists</span>
            <span>The longer story</span>
          </div>
          <h2>
            Seven rungs. One <em>climb</em>. Pick yours.
          </h2>
          <p className="lede">
            Most people stop at rung one and think the elevator is broken.{" "}
            <span className="small-caps">The AI Ladder</span> shows you one vivid thing
            you could be doing at each of the seven rungs above where you are, written
            for the work you actually do, and asks you to take one small step.
          </p>
        </section>
      </main>

      <footer className="site">
        <div className="colophon">
          Set in Instrument Serif &amp; JetBrains Mono on warm paper. Composed in one
          page, one column, one ladder. No tracking. No newsletter signup. Open source
          on <a href="https://github.com/01AHH/ai-ladder">GitHub</a>, MIT licensed. Fork
          it, bring your own <a href="https://console.anthropic.com/">Anthropic key</a>,
          make it yours.
        </div>
        <div className="wink">
          the repo is the content<span className="dot"> .</span>
        </div>
      </footer>
    </>
  );
}
