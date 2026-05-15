'use client';

import type { TreeNode, Tier } from '@/content/tree-nodes';
import type { NodeState } from '@/lib/tree/graph';

const REGION_ACCENT: Record<TreeNode['region'], string> = {
  root: '#E8C76A',
  soft: '#6BA0D6',
  cluster: '#D97757',
  tech: '#E8C76A',
};

const TIER_RADIUS: Record<Tier, number> = {
  root: 32,
  core: 30,
  mid: 28,
  deep: 26,
};

const GOLD = '#E8C76A';
const GOLD_BRIGHT = '#FFE9B0';

function hexPath(r: number): string {
  const a = r;
  const b = (r * Math.sqrt(3)) / 2;
  return `M ${a} 0 L ${a / 2} ${b} L ${-a / 2} ${b} L ${-a} 0 L ${-a / 2} ${-b} L ${a / 2} ${-b} Z`;
}

export function HexNode({
  node,
  state,
  hovered,
  selected,
  justLearned,
  onHover,
  onClick,
}: {
  node: TreeNode;
  state: NodeState;
  hovered: boolean;
  selected: boolean;
  justLearned: boolean;
  onHover: (id: TreeNode['id'] | null) => void;
  onClick: (id: TreeNode['id']) => void;
}) {
  const r = TIER_RADIUS[node.tier];
  const accent = REGION_ACCENT[node.region];
  const isRoot = node.tier === 'root';

  const fill =
    state === 'climbed' ? 'rgba(232,199,106,0.20)' :
    state === 'available' || state === 'next' ? 'rgba(20,28,48,0.85)' :
    'rgba(12,16,28,0.7)';

  const stroke =
    state === 'climbed' ? GOLD :
    state === 'available' || state === 'next' ? accent :
    'rgba(180,200,230,0.22)';

  const strokeOpacity =
    state === 'climbed' ? 1 :
    state === 'available' || state === 'next' ? 0.85 :
    0.5;

  const strokeWidth = isRoot ? 2.2 : 1.8;

  const labelOpacity =
    state === 'climbed' ? 1 :
    state === 'available' || state === 'next' ? 0.95 :
    0.55;

  const labelFill =
    state === 'climbed' ? GOLD :
    state === 'locked' ? 'rgba(200,210,230,0.55)' :
    '#E6EAF5';

  const filter =
    state === 'climbed'
      ? 'drop-shadow(0 0 14px rgba(232,199,106,0.55))'
      : state === 'next'
      ? `drop-shadow(0 0 10px rgba(232,199,106,0.55))`
      : state === 'available' && hovered
      ? `drop-shadow(0 0 8px ${accent})`
      : undefined;

  const showAura = state === 'available' || state === 'next' || selected;

  const path = hexPath(r);
  const labelY = r + 14;
  const subY = r + 30;
  const labelSize = isRoot ? 19 : 17;

  return (
    <g
      transform={`translate(${node.x} ${node.y})`}
      style={{ cursor: 'pointer' }}
      onMouseEnter={() => onHover(node.id)}
      onMouseLeave={() => onHover(null)}
      onClick={() => onClick(node.id)}
      role="button"
      aria-label={node.label}
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick(node.id); }}
    >
      {showAura && (
        <path
          d={hexPath(r + 12)}
          fill="none"
          stroke={state === 'next' ? GOLD : accent}
          strokeOpacity={state === 'next' ? 0.7 : (selected ? 0.6 : 0.35)}
          strokeWidth={1}
          className={state === 'next' ? 'hex-pulse-strong' : 'hex-pulse'}
          style={{ pointerEvents: 'none' }}
        />
      )}

      {justLearned && (
        <path
          d={path}
          fill="none"
          stroke={GOLD_BRIGHT}
          strokeWidth={2}
          className="hex-burst"
          style={{ pointerEvents: 'none' }}
        />
      )}

      <path
        d={path}
        fill={fill}
        stroke={stroke}
        strokeOpacity={strokeOpacity}
        strokeWidth={strokeWidth}
        style={{ filter, transition: 'fill .25s ease, stroke .25s ease, filter .25s ease' }}
      />

      <path
        d={hexPath(r - 5)}
        fill="none"
        stroke={stroke}
        strokeOpacity={state === 'climbed' ? 0.5 : 0.18}
        strokeWidth={0.8}
        style={{ pointerEvents: 'none' }}
      />

      {state === 'climbed' && (
        <path
          d="M -10 1 L -3 8 L 11 -8"
          stroke={GOLD}
          strokeWidth={2.4}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ pointerEvents: 'none' }}
        />
      )}
      {(state === 'available' || state === 'next') && (
        <g style={{ pointerEvents: 'none' }}>
          <circle cx={0} cy={0} r={3} fill={accent} opacity={0.95} className="hex-pulse-dot" />
          <circle cx={0} cy={0} r={6} fill="none" stroke={accent} strokeOpacity={0.4} strokeWidth={0.8} className="hex-pulse-dot" />
        </g>
      )}
      {state === 'locked' && !isRoot && (
        <circle cx={0} cy={0} r={1.6} fill="rgba(180,200,230,0.25)" style={{ pointerEvents: 'none' }} />
      )}

      <text
        y={labelY}
        textAnchor="middle"
        fontFamily="Cormorant Garamond, Instrument Serif, serif"
        fontStyle="italic"
        fontSize={labelSize}
        fontWeight={state === 'climbed' ? 600 : 500}
        fill={labelFill}
        opacity={labelOpacity}
        style={{ pointerEvents: 'none', transition: 'fill .25s ease, opacity .25s ease' }}
      >
        {node.label}
      </text>
      {node.subtitle && (
        <text
          y={subY}
          textAnchor="middle"
          fontFamily="Cormorant Garamond, Instrument Serif, serif"
          fontStyle="italic"
          fontSize={11.5}
          fill="rgba(230,234,245,0.55)"
          opacity={labelOpacity * 0.85}
          style={{ pointerEvents: 'none' }}
        >
          {node.subtitle}
        </text>
      )}
    </g>
  );
}
