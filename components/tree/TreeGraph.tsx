'use client';

import { NODES, EDGES, type NodeId } from '@/content/tree-nodes';
import { useClimbed } from '@/lib/tree/useClimbed';
import { stateOf, recommendedNext } from '@/lib/tree/graph';
import { usePanZoom } from '@/lib/tree/usePanZoom';
import { HexNode } from './HexNode';
import { Edge } from './Edge';

const VIEWBOX = '0 0 1400 660';

export function TreeGraph({ onNodeClick }: { onNodeClick: (id: NodeId) => void }) {
  const { climbed } = useClimbed();
  const next = recommendedNext(climbed);
  const { ref, pan, handlers } = usePanZoom();

  return (
    <div
      ref={ref}
      className="tree-pan-layer"
      {...handlers}
      style={{ touchAction: 'none' }}
    >
      <div
        className="tree-pan-content"
        style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${pan.scale})` }}
      >
        <svg
          viewBox={VIEWBOX}
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMid meet"
        >
          {EDGES.map((e, i) => <Edge key={`e-${i}`} edge={e} />)}
          {Object.values(NODES).map((node) => {
            const base = stateOf(node.id, climbed);
            const state = base === 'available' && node.id === next ? 'next' : base;
            return <HexNode key={node.id} node={node} state={state} onClick={onNodeClick} />;
          })}
        </svg>
      </div>
    </div>
  );
}
