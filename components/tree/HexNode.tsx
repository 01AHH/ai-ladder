'use client';

import type { TreeNode } from '@/content/tree-nodes';
import type { NodeState } from '@/lib/tree/graph';

const REGION_COLORS: Record<TreeNode['region'], string> = {
  root: '#f5efd1',
  soft: '#6db1ff',
  cluster: '#ff8c5a',
  tech: '#c5b572',
};

const SIZE = 32; // half-width of the hex in viewBox units

const HEX_POINTS = [
  [0, -SIZE], [SIZE * 0.866, -SIZE / 2], [SIZE * 0.866, SIZE / 2],
  [0, SIZE], [-SIZE * 0.866, SIZE / 2], [-SIZE * 0.866, -SIZE / 2],
].map((p) => p.join(',')).join(' ');

export function HexNode({
  node,
  state,
  onClick,
}: {
  node: TreeNode;
  state: NodeState;
  onClick: (id: TreeNode['id']) => void;
}) {
  const stroke = REGION_COLORS[node.region];
  const strokeOpacity = state === 'locked' ? 0.35 : 1;
  const fill =
    state === 'climbed' ? 'rgba(125,242,168,0.18)' :
    state === 'next' ? 'rgba(245,239,209,0.14)' :
    '#14172a';
  const filter = state === 'next' ? 'drop-shadow(0 0 12px rgba(245,239,209,0.65))' : undefined;

  return (
    <g
      transform={`translate(${node.x} ${node.y})`}
      style={{ cursor: 'pointer' }}
      onClick={() => onClick(node.id)}
      role="button"
      aria-label={node.label}
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick(node.id); }}
    >
      <polygon
        points={HEX_POINTS}
        fill={fill}
        stroke={stroke}
        strokeOpacity={strokeOpacity}
        strokeWidth={2.2}
        style={{ filter, transition: 'fill .2s, stroke-opacity .2s, filter .2s' }}
      />
      <text
        y={4}
        textAnchor="middle"
        fontFamily="Instrument Serif, serif"
        fontStyle="italic"
        fontSize="13"
        fill="#f0ecd7"
        style={{ pointerEvents: 'none' }}
      >
        {node.label}
      </text>
      {node.subtitle && (
        <text
          y={56}
          textAnchor="middle"
          fontFamily="Instrument Serif, serif"
          fontStyle="italic"
          fontSize="9.5"
          fill="#f0ecd7"
          opacity="0.55"
          style={{ pointerEvents: 'none' }}
        >
          {node.subtitle}
        </text>
      )}
    </g>
  );
}
