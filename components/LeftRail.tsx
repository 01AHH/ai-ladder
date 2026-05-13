"use client";

import { useEffect, useState } from "react";

const TICKS = [
  { id: "hero", label: "00" },
  { id: "rung-1", label: "01" },
  { id: "rung-2", label: "02" },
  { id: "rung-3", label: "03" },
  { id: "rung-4", label: "04" },
  { id: "rung-5", label: "05" },
  { id: "rung-6", label: "06" },
  { id: "rung-7", label: "07" },
];

const TOTAL = String(TICKS.length - 1).padStart(2, "0");

export function LeftRail() {
  const [fill, setFill] = useState(0);
  const [active, setActive] = useState(0);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    function update() {
      const scrollY = window.scrollY;
      const winH = window.innerHeight;
      const docH = document.documentElement.scrollHeight - winH;
      const pct = Math.min(1, Math.max(0, docH > 0 ? scrollY / docH : 0));
      setFill(pct * 100);

      let next = 0;
      let bestDist = Infinity;
      TICKS.forEach((t, i) => {
        const el = document.getElementById(t.id);
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const target = winH * 0.35;
        const dist = Math.abs(rect.top - target);
        if (rect.top < winH * 0.6 && dist < bestDist) {
          bestDist = dist;
          next = i;
        }
      });
      setActive(next);

      const climax = document.getElementById("rung-6");
      if (climax) {
        const r = climax.getBoundingClientRect();
        setDark(r.top < winH * 0.5 && r.bottom > winH * 0.5);
      }
    }

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <>
      <nav className={`rail${dark ? " dark" : ""}`} aria-label="Ladder progress">
        <div className="rail-track">
          <div className="rail-fill" style={{ height: `${fill}%` }} />
          {TICKS.map((t, i) => {
            const pct = (i / (TICKS.length - 1)) * 100;
            return (
              <a
                key={t.id}
                href={`#${t.id}`}
                className={`rail-tick${i === active ? " active" : ""}`}
                style={{ top: `${pct}%` }}
              >
                <span className="num">{t.label}</span>
                <span className="dot" />
              </a>
            );
          })}
        </div>
      </nav>
      <div className={`progress-readout${dark ? " dark" : ""}`}>
        <div>
          <span className="n">{String(active).padStart(2, "0")}</span>{" "}
          <span style={{ opacity: 0.5 }}>/</span> {TOTAL}
        </div>
      </div>
    </>
  );
}
