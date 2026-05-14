"use client";

import { useEffect, useRef, useState } from "react";
import { rungs } from "@/content/rungs";
import { ContextInput } from "@/components/ContextInput";
import { Definitions } from "@/components/Definitions";
import { Rung } from "@/components/Rung";
import { Bridge } from "@/components/Bridge";
import { RungIndex } from "@/components/RungIndex";
import { LadderViz } from "@/components/LadderViz";
import { TabNav } from "@/components/tree/TabNav";

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
        <div className="topbar-left">
          <TabNav theme="light" />
          <div className="mark">
            THE&nbsp;AI&nbsp;LADDER<span className="dot">.</span>
          </div>
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
              <span className="eyebrow-sep">·</span>
              <a
                className="author"
                href="https://www.linkedin.com/in/arthur-hinton/"
                target="_blank"
                rel="noopener noreferrer"
              >
                by Arthur Hinton ↗
              </a>
            </div>

            <Definitions />

            <h1>
              Knowing the next step in your AI journey is hard when you
              don&apos;t know what&apos;s <em>possible</em>.
            </h1>

            <p className="lede">
              Most people stop at ChatGPT and assume that&apos;s the ceiling.
              It isn&apos;t. There are seven steps above it, and the gap
              between step one and step eight is the difference between{" "}
              <em>using</em> AI and <em>developing</em> with it.
            </p>
            <p className="lede">
              I built this because smart people kept asking me how I use AI
              and what was actually possible with it. Every conversation hit
              the same wall: I couldn&apos;t tell where they were on their
              AI journey, and they couldn&apos;t picture what one step up
              looked like. This is the map.
            </p>

            <aside className="note">
              <span className="note-eyebrow">On order</span>
              <p className="note-body">
                These aren&apos;t steps you have to do in sequence.{" "}
                <em>People pick them up at different stages, in different
                orders</em>. This is just how I climbed them.
              </p>
            </aside>

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

        <section className="scene step" id="step" data-scene-key="step">
          <div className="scene-inner">
            <aside className="note">
              <span className="note-eyebrow">The one rule</span>
              <p className="note-body">
                If you don&apos;t know how to do something with AI,{" "}
                <em>just ask AI how to do it</em>. That&apos;s the general
                rule everything else on this page rests on.
              </p>
            </aside>

            <div className="step-eyebrow">
              <span>⌂ A note</span>
            </div>
            <h2>
              This is just my <em>take</em>, today.
            </h2>
            <p className="step-lede">
              If you disagree, or think a step is missing,{" "}
              <a
                href="https://www.linkedin.com/in/arthur-hinton/"
                target="_blank"
                rel="noopener noreferrer"
              >
                tell me on LinkedIn
              </a>
              . I&apos;ll update this page as I hear what people say and as I
              learn more.
            </p>
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
