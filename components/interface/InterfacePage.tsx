"use client";

import { useRef } from "react";
import { ContextInput } from "@/components/ContextInput";
import { TabNav } from "@/components/tree/TabNav";
import { ThemeToggle } from "@/components/ThemeToggle";
import type { Theme } from "@/lib/useTheme";
import { SplitFlap } from "./SplitFlap";
import { RungGrid } from "./RungGrid";
import { ModeCursor } from "./ModeCursor";

const FLAP_WORDS = ["POSSIBLE", "PROMPT", "BUILD", "DELEGATE", "CLIMB"];

type Props = {
  theme: Theme;
  setTheme: (t: Theme) => void;
  context: string;
  setContext: (v: string) => void;
};

export function InterfacePage({ theme, setTheme, context, setContext }: Props) {
  const contextRef = useRef(context);
  contextRef.current = context;

  function readOnPaper(rungNumber: number) {
    setTheme("light");
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document
          .getElementById(`rung-${rungNumber}`)
          ?.scrollIntoView({ block: "start" });
      });
    });
  }

  return (
    <div className="if-root">
      <ModeCursor />
      <header className="topbar">
        <div className="topbar-left">
          <TabNav theme="dark" />
          <div className="mark">
            THE&nbsp;AI&nbsp;LADDER<span className="dot">.</span>
          </div>
        </div>
        <div className="topbar-right">
          <ThemeToggle theme={theme} setTheme={setTheme} />
        </div>
      </header>

      <main className="if-main">
        <section className="if-hero">
          <SplitFlap words={FLAP_WORDS} />
          <p className="if-lede">
            A field guide to what&apos;s actually possible with AI right now.
            Eight rungs, one ladder — open any of them below.
          </p>
          <ContextInput value={context} onChange={setContext} />
        </section>

        <RungGrid
          getContext={() => contextRef.current}
          onReadOnPaper={readOnPaper}
        />
      </main>

      <footer className="site">
        <div className="colophon">
          Interface mode: set in JetBrains Mono on near-black. Paper mode is
          one toggle away. Open source on{" "}
          <a href="https://github.com/01AHH/ai-ladder">GitHub</a>, MIT licensed.
        </div>
        <div className="wink">
          two brands, one ladder<span className="dot">.</span>
        </div>
      </footer>
    </div>
  );
}
