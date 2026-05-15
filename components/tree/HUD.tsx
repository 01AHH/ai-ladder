'use client';

import { useMemo } from 'react';
import { NODES, RECOMMENDED_PATH } from '@/content/tree-nodes';
import { useClimbed } from '@/lib/tree/useClimbed';
import { prereqsOf } from '@/lib/tree/graph';

const RANKS: { threshold: number; name: string }[] = [
  { threshold: 0,    name: 'WANDERER' },
  { threshold: 0.01, name: 'INITIATE' },
  { threshold: 0.15, name: 'APPRENTICE' },
  { threshold: 0.4,  name: 'JOURNEYMAN' },
  { threshold: 0.66, name: 'ARCHITECT' },
  { threshold: 1,    name: 'SAGE' },
];

function rankFor(pct: number): string {
  let name = RANKS[0].name;
  for (const r of RANKS) {
    if (pct >= r.threshold) name = r.name;
  }
  return name;
}

export function HUD() {
  const { climbed, reset } = useClimbed();

  const totalXp = useMemo(
    () => Object.values(NODES).reduce((s, n) => s + n.xp, 0),
    []
  );
  const totalCount = Object.keys(NODES).length;
  const xp = useMemo(
    () => [...climbed].reduce((s, id) => s + (NODES[id]?.xp ?? 0), 0),
    [climbed]
  );
  const pct = totalXp ? Math.min(100, (xp / totalXp) * 100) : 0;
  const rankName = rankFor(xp / totalXp);

  const nextNode = useMemo(() => {
    for (const id of RECOMMENDED_PATH) {
      if (climbed.has(id)) continue;
      const prereqsMet = prereqsOf(id).every((p) => climbed.has(p));
      if (prereqsMet) return NODES[id];
    }
    return null;
  }, [climbed]);

  function handleReset() {
    if (climbed.size === 0) return;
    if (window.confirm(`Reset all progress? (${climbed.size} climbed rungs will be cleared.)`)) {
      reset();
    }
  }

  return (
    <div className="tree-hud">
      <div className="hud-left">
        <div className="brand">
          <h1 className="brand-title">The AI Skill Tree</h1>
          <div className="brand-sub">a map of what to learn next</div>
        </div>
      </div>

      <div className="hud-center">
        {nextNode ? (
          <div className="tree-quest" key={nextNode.id}>
            <span className="quest-label">NEXT QUEST</span>
            <span className="quest-arrow">→</span>
            <span className="quest-name">{nextNode.label}</span>
            {nextNode.subtitle && <span className="quest-sub">· {nextNode.subtitle}</span>}
            {!nextNode.subtitle && <span className="quest-sub">· {nextNode.tag}</span>}
          </div>
        ) : (
          <div className="tree-quest is-done">
            <span className="quest-label">TREE COMPLETE</span>
            <span className="quest-arrow">✦</span>
            <span className="quest-name">You walked the whole map</span>
          </div>
        )}
      </div>

      <div className="hud-right">
        <div className="xp-block">
          <div className="xp-row">
            <span className="xp-level">{rankName}</span>
            <span className="xp-count">
              {xp} <span className="xp-of">/ {totalXp} XP</span>
            </span>
          </div>
          <div className="xp-bar"><div className="xp-fill" style={{ width: pct + '%' }} /></div>
          <div className="xp-row xp-row-sm">
            <span>{climbed.size} of {totalCount} stars</span>
            {climbed.size > 0 && (
              <button className="xp-reset" onClick={handleReset}>reset</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
