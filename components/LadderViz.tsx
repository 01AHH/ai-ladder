"use client";

import { useEffect, useRef, useState } from "react";

type Tick = {
  key: string;
  href: string;
  y: number;
  label: string;
};

const TICKS: Tick[] = [
  { key: "hero", href: "#hero", y: 40, label: "00" },
  { key: "prompting", href: "#rung-1", y: 124, label: "01" },
  { key: "vibe", href: "#rung-2", y: 208, label: "02" },
  { key: "agents", href: "#rung-3", y: 292, label: "03" },
  { key: "skills", href: "#rung-4", y: 376, label: "04" },
  { key: "memory", href: "#rung-5", y: 460, label: "05" },
  { key: "repo", href: "#rung-6", y: 544, label: "06" },
  { key: "apis", href: "#rung-7", y: 628, label: "07" },
  { key: "integrated", href: "#rung-8", y: 712, label: "08" },
  { key: "step", href: "#step", y: 790, label: "⚑" },
];

type Props = {
  activeKey: string;
};

export function LadderViz({ activeKey }: Props) {
  const climberRef = useRef<SVGGElement>(null);
  const [climberY, setClimberY] = useState(40);

  useEffect(() => {
    const tick = TICKS.find((t) => t.key === activeKey);
    if (tick) setClimberY(tick.y);
  }, [activeKey]);

  function onTickClick(href: string) {
    const target = document.querySelector(href);
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <aside className="ladder-viz" aria-hidden="true">
      <div className="lv-cap">
        ↑ <span className="you">You</span>
      </div>
      <svg className="lv-svg" viewBox="0 0 110 820" preserveAspectRatio="xMidYMid meet">
        <line className="lv-rail" x1="34" x2="34" y1="20" y2="800" />
        <line className="lv-rail" x1="86" x2="86" y1="20" y2="800" />

        {TICKS.map((t) => (
          <g key={t.key} className={`lv-rung${activeKey === t.key ? " active" : ""}`}>
            <rect
              className="lv-rung-hit"
              x="0"
              y={t.y - 16}
              width="110"
              height="32"
              onClick={() => onTickClick(t.href)}
            />
            <line className="lv-rung-bar" x1="34" x2="86" y1={t.y} y2={t.y} />
            <text className="lv-rung-num" x="22" y={t.y + 4} textAnchor="end">
              {t.label}
            </text>
          </g>
        ))}

        <g
          ref={climberRef}
          className="lv-climber"
          style={{ transform: `translateY(${climberY - 40}px)` }}
        >
          <line className="lv-climber-bar" x1="34" x2="86" y1="40" y2="40" />
          <circle className="lv-climber-dot-l" cx="34" cy="40" r="5" />
          <circle className="lv-climber-dot-r" cx="86" cy="40" r="5" />
        </g>
      </svg>
      <div className="lv-foot">↓ Scroll to climb</div>
    </aside>
  );
}
