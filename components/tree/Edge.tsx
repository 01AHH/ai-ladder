'use client';

import type { TreeEdge, NodeId } from '@/content/tree-nodes';
import { NODES } from '@/content/tree-nodes';
import type { NodeState } from '@/lib/tree/graph';

const REGION_ACCENT: Record<string, string> = {
  root: '#E8C76A',
  soft: '#6BA0D6',
  cluster: '#D97757',
  tech: '#E8C76A',
};

const GOLD = '#E8C76A';
const GOLD_BRIGHT = '#FFE9B0';
const PURPLE = '#A78BFA';

const TIER_RADIUS: Record<string, number> = {
  root: 32, core: 30, mid: 28, deep: 26,
};

function hexEdge(cx: number, cy: number, tx: number, ty: number, r: number): [number, number] {
  const ang = Math.atan2(ty - cy, tx - cx);
  const eff = r * 0.86;
  return [cx + Math.cos(ang) * eff, cy + Math.sin(ang) * eff];
}

export function Edge({
  edge,
  fromState,
  toState,
  onRecommended,
  incident,
}: {
  edge: TreeEdge;
  fromState: NodeState;
  toState: NodeState;
  onRecommended: boolean;
  incident: boolean;
}) {
  const from = NODES[edge.from];
  const to = NODES[edge.to];
  const ra = TIER_RADIUS[from.tier];
  const rb = TIER_RADIUS[to.tier];
  const [x1, y1] = hexEdge(from.x, from.y, to.x, to.y, ra);
  const [x2, y2] = hexEdge(to.x, to.y, from.x, from.y, rb);

  const isRootEdge = edge.from === 'prompting';
  const isBridge = edge.kind === 'bridge';

  let color: string;
  if (isRootEdge) color = GOLD;
  else if (isBridge) color = PURPLE;
  else color = REGION_ACCENT[to.region];

  const edgeLearned = fromState === 'climbed' && toState === 'climbed';
  const edgeReady = fromState === 'climbed' && (toState === 'available' || toState === 'next');

  const opacity =
    edgeLearned ? 0.95 :
    edgeReady ? 0.6 :
    incident ? 0.55 :
    0.22;

  const dashed = isBridge ? '4 6' : undefined;

  return (
    <g>
      <line
        x1={x1} y1={y1} x2={x2} y2={y2}
        stroke={color}
        strokeWidth={edgeLearned ? 1.8 : 1.1}
        strokeOpacity={opacity}
        strokeDasharray={dashed}
        style={{ transition: 'stroke-opacity 240ms ease, stroke-width 240ms ease' }}
      />
      {edgeLearned && (
        <line
          x1={x1} y1={y1} x2={x2} y2={y2}
          stroke={GOLD_BRIGHT}
          strokeWidth={1.2}
          strokeOpacity={0.85}
          strokeDasharray="2 10"
          className="edge-flow"
        />
      )}
      {onRecommended && !edgeLearned && (
        <line
          x1={x1} y1={y1} x2={x2} y2={y2}
          stroke={GOLD}
          strokeWidth={1.4}
          strokeOpacity={0.55}
          strokeDasharray="1 4"
          className="edge-flow"
        />
      )}
    </g>
  );
}
