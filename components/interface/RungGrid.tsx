"use client";

import { useState } from "react";
import { rungs, type Rung as RungType } from "@/content/rungs";
import { RungPanel } from "./RungPanel";

const SCENE_COLOR: Record<string, string> = {
  prompting: "#7FA35E",
  vibe: "#E88B54",
  agents: "#8A6BB8",
  skills: "#7A98A8",
  memory: "#C4A578",
  repo: "#D9B04A",
  apis: "#4E93AC",
  integrated: "#E08468",
};

const mainRungs = rungs.filter((r) => Number.isInteger(r.number));
const subsAfter = (n: number) =>
  rungs.filter((r) => !Number.isInteger(r.number) && Math.floor(r.number) === n);

function chunk<T>(list: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < list.length; i += size) out.push(list.slice(i, i + size));
  return out;
}

type Props = {
  getContext: () => string;
  onReadOnPaper: (rungNumber: number) => void;
};

export function RungGrid({ getContext, onReadOnPaper }: Props) {
  const [openId, setOpenId] = useState<string | null>(null);
  const toggle = (id: string) => setOpenId((cur) => (cur === id ? null : id));

  const cell = (r: RungType, sub = false) => (
    <button
      key={r.id}
      className={`${sub ? "if-sub" : "if-cell"}${openId === r.id ? " open" : ""}`}
      style={{ ["--cell-color" as string]: SCENE_COLOR[r.sceneKey] ?? "#E05B2B" }}
      data-cursor="climb"
      aria-expanded={openId === r.id}
      onClick={() => toggle(r.id)}
    >
      <span className="if-cell-num">
        {Number.isInteger(r.number) ? String(r.number).padStart(2, "0") : r.number}
      </span>
      <span className="if-cell-name">{r.name}</span>
      <span className="if-cell-plain">{r.plain}</span>
    </button>
  );

  const openRung = rungs.find((r) => r.id === openId);
  const panel = (row: RungType[]) =>
    openRung &&
    row.some((r) => r.id === openRung.id) && (
      <RungPanel
        rung={openRung}
        getContext={getContext}
        onReadOnPaper={onReadOnPaper}
      />
    );

  return (
    <div className="if-grid" role="list" aria-label="The eight rungs">
      {chunk(mainRungs, 4).map((row, i) => {
        const subs = row.flatMap((r) => subsAfter(r.number));
        return (
          <div className="if-row" key={i}>
            <div className="if-row-cells">{row.map((r) => cell(r))}</div>
            {panel(row)}
            {subs.map((s) => (
              <div className="if-subwrap" key={s.id}>
                {cell(s, true)}
                {panel([s])}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
