"use client";

import { useEffect, useRef, useState } from "react";
import { rungs } from "@/content/rungs";
import { ContextInput } from "@/components/ContextInput";
import { Rung } from "@/components/Rung";
import { Bridge } from "@/components/Bridge";
import { RungIndex } from "@/components/RungIndex";
import { LadderViz } from "@/components/LadderViz";

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

const SCENE_LABELS: Record<string, string> = {
  hero: "Start",
  prompting: "Prompting",
  vibe: "Vibe coding",
  agents: "Coding agents",
  repo: "Repo structure",
  apis: "APIs",
  climax: "Skills",
  integrated: "Integrated",
  step: "Step",
};

const SCENE_NUMS: Record<string, string> = {
  hero: "00",
  prompting: "01",
  vibe: "02",
  agents: "03",
  repo: "04",
  apis: "05",
  climax: "06",
  integrated: "07",
  step: "08",
};

export default function Home() {
  const [context, setContext] = useState("");
  const contextRef = useRef(context);
  contextRef.current = context;

  const [activeScene, setActiveScene] = useState("hero");

  // Scroll-driven scene class on <body>. Pick the bg-element whose center
  // is closest to viewport center; toggle body class for the palette morph.
  useEffect(() => {
    function update() {
      const els = document.querySelectorAll<HTMLElement>("[data-scene-key]");
      const center = window.innerHeight * 0.4;
      let best: HTMLElement | null = null;
      let bestDist = Infinity;
      els.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const mid = rect.top + rect.height / 2;
        if (
          rect.top < window.innerHeight * 0.6 &&
          rect.bottom > window.innerHeight * 0.2
        ) {
          const dist = Math.abs(mid - center);
          if (dist < bestDist) {
            bestDist = dist;
            best = el;
          }
        }
      });
      if (best) {
        const key = (best as HTMLElement).dataset.sceneKey;
        if (key && key !== activeScene) setActiveScene(key);
      }
    }
    update();
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
      cancelAnimationFrame(raf);
    };
  }, [activeScene]);

  // Apply scene class to body so the palette tokens morph globally.
  useEffect(() => {
    const cls = `scene-${activeScene}`;
    document.body.classList.forEach((c) => {
      if (c.startsWith("scene-") && c !== cls) {
        document.body.classList.remove(c);
      }
    });
    if (!document.body.classList.contains(cls)) {
      document.body.classList.add(cls);
    }
  }, [activeScene]);

  return (
    <>
      <header className="topbar">
        <div className="mark">
          THE&nbsp;AI&nbsp;LADDER<span className="dot">.</span>
        </div>
        <div className="scene-readout">
          <span className="n">{SCENE_NUMS[activeScene] ?? "00"}</span>
          <span className="sep">/</span>
          <span>07</span>
          <span className="label">{SCENE_LABELS[activeScene] ?? "Start"}</span>
        </div>
      </header>

      <LadderViz activeKey={activeScene} />

      <main>
        <section className="scene hero" id="hero" data-scene-key="hero">
          <div className="scene-inner">
            <div className="eyebrow">
              <span className="pip" />
              A field guide to what's actually possible with AI right now
            </div>

            <h1>
              Knowing the next step in your AI journey is hard when you
              don&apos;t know what&apos;s <em>possible</em>.
            </h1>

            <p className="lede">
              Most people stop at ChatGPT and assume that&apos;s the ceiling.
              It isn&apos;t. There are seven steps above it, and the gap
              between step one and step eight is the difference between{" "}
              <em>using</em> AI and <em>building</em> with it.
            </p>
            <p className="lede">
              I built this because I kept watching smart people give up on AI
              after a few weeks of Claude.ai. Not because they couldn&apos;t
              get value out of it. Nobody had shown them what one
              step up looks like. This is the map I wish I&apos;d had.
            </p>

            <ContextInput value={context} onChange={setContext} />

            <RungIndex />

            <div className="scroll-hint">
              <span>Or just scroll</span>
              <span className="arr">↓</span>
            </div>
          </div>
        </section>

        {rungs.map((r, i) => {
          const prevRung = rungs[i - 1];
          return (
            <div key={r.id}>
              {prevRung && (
                <Bridge
                  uptag={prevRung.bridgeUptag}
                  line={prevRung.socraticBridge}
                  sceneKey={prevRung.sceneKey}
                />
              )}
              <Rung rung={r} getContext={() => contextRef.current} />
            </div>
          );
        })}

        {/* Bridge from last rung into the Step scene */}
        <Bridge
          uptag={rungs[rungs.length - 1].bridgeUptag}
          line={rungs[rungs.length - 1].socraticBridge}
          sceneKey={rungs[rungs.length - 1].sceneKey}
        />

        <section className="scene step" id="step" data-scene-key="step">
          <div className="scene-inner">
            <div className="step-eyebrow">
              <span>⌂ The whole point</span>
            </div>
            <h2>
              The point is the <em>step</em>, not the ladder.
            </h2>
            <p className="step-lede">
              Pick one. Block twenty minutes for it this week. The ladder is
              only useful if you put your foot on it.
            </p>
            <div className="step-list">
              {STEPS.map((s) => (
                <a key={s.rung} className="step-row" href={`#rung-${s.rung}`}>
                  <div className="n">↑ Step 0{s.rung}</div>
                  <div className="what">{s.what}</div>
                  <div className="where">{s.where}</div>
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="site">
        <div className="colophon">
          Set in Instrument Serif, Inter &amp; JetBrains Mono on warm paper.
          Composed in one page, one column, one ladder. No tracking. No
          newsletter signup. Open source on{" "}
          <a href="https://github.com/01AHH/ai-ladder">GitHub</a>, MIT licensed.
          Fork it, bring your own{" "}
          <a href="https://console.anthropic.com/">Anthropic key</a>, make it
          yours.
        </div>
        <div className="wink">
          the repo is the content<span className="dot">.</span>
        </div>
      </footer>
    </>
  );
}
