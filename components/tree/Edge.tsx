'use client';

import type { TreeEdge } from '@/content/tree-nodes';
import { NODES } from '@/content/tree-nodes';

const EDGE_STROKE: Record<TreeEdge['kind'], string> = {
  spine: 'rgba(197,181,114,0.65)',  // gold
  cluster: 'rgba(255,140,90,0.7)',  // orange
  bridge: 'rgba(176,125,255,0.55)', // purple
};

export function Edge({ edge }: { edge: TreeEdge }) {
  const from = NODES[edge.from];
  const to = NODES[edge.to];
  const dash = edge.kind === 'bridge' ? '5 5' : undefined;

  // Quadratic curve through a midpoint with slight bias for non-vertical edges
  const mx = (from.x + to.x) / 2;
  const my = (from.y + to.y) / 2;
  const d = `M ${from.x} ${from.y} Q ${mx} ${my} ${to.x} ${to.y}`;

  return (
    <path
      d={d}
      fill="none"
      stroke={EDGE_STROKE[edge.kind]}
      strokeWidth={1.8}
      strokeDasharray={dash}
    />
  );
}
