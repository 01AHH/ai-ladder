'use client';

import { NODES, EDGES, type NodeId } from '@/content/tree-nodes';
import { useClimbed } from '@/lib/tree/useClimbed';
import { stateOf, recommendedNext } from '@/lib/tree/graph';
import { HexNode } from './HexNode';
import { Edge } from './Edge';

const VIEWBOX = '0 0 1400 660';

export function TreeGraph({ onNodeClick }: { onNodeClick: (id: NodeId) => void }) {
  const { climbed } = useClimbed();
  const next = recommendedNext(climbed);

  return (
    <svg
      viewBox={VIEWBOX}
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid meet"
      style={{ position: 'absolute', inset: 0 }}
    >
      {EDGES.map((e, i) => <Edge key={`e-${i}`} edge={e} />)}
      {Object.values(NODES).map((node) => {
        const baseState = stateOf(node.id, climbed);
        const state = baseState === 'available' && node.id === next ? 'next' : baseState;
        return <HexNode key={node.id} node={node} state={state} onClick={onNodeClick} />;
      })}
    </svg>
  );
}
