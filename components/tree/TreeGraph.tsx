'use client';

import { useMemo, useState, useEffect } from 'react';
import { NODES, EDGES, RECOMMENDED_PATH, type NodeId } from '@/content/tree-nodes';
import { useClimbed } from '@/lib/tree/useClimbed';
import { stateOf, recommendedNext, type NodeState } from '@/lib/tree/graph';
import { usePanZoom } from '@/lib/tree/usePanZoom';
import { HexNode } from './HexNode';
import { Edge } from './Edge';

const VIEWBOX = '0 0 1400 660';

type Section = {
  x: number;
  width: number;
  label: string;
  accent: string;
};

const SECTIONS: Section[] = [
  { x: 200, width: 290, label: 'General Productivity', accent: '#6BA0D6' },
  { x: 490, width: 380, label: 'Essential Skills & Knowledge', accent: '#D97757' },
  { x: 870, width: 390, label: 'Building Tools & Software', accent: '#E8C76A' },
];

function hexToRgba(hex: string, alpha: number): string {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

function ClusterBands() {
  return (
    <g aria-hidden="true">
      {SECTIONS.map((s, i) => (
        <g key={`band-${i}`}>
          <rect
            x={s.x}
            y={20}
            width={s.width}
            height={620}
            fill={hexToRgba(s.accent, 0.05)}
            stroke={hexToRgba(s.accent, 0.18)}
            strokeDasharray="3 6"
            strokeWidth={1}
            rx={14}
          />
          <text
            x={s.x + s.width / 2}
            y={50}
            textAnchor="middle"
            className="cluster-header-text"
            fill={hexToRgba(s.accent, 0.85)}
          >
            {s.label.toUpperCase()}
          </text>
        </g>
      ))}
    </g>
  );
}

export function TreeGraph({
  onNodeClick,
  selectedId,
  justLearnedId,
}: {
  onNodeClick: (id: NodeId) => void;
  selectedId: NodeId | null;
  justLearnedId: NodeId | null;
}) {
  const { climbed } = useClimbed();
  const next = recommendedNext(climbed);
  const { ref, pan, handlers } = usePanZoom();
  const [hoveredId, setHoveredId] = useState<NodeId | null>(null);

  const recommendedSet = useMemo(() => new Set(RECOMMENDED_PATH), []);
  const recIndex = useMemo(() => {
    const m = new Map<NodeId, number>();
    RECOMMENDED_PATH.forEach((id, i) => m.set(id, i));
    return m;
  }, []);

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
          <ClusterBands />
          {EDGES.map((e, i) => {
            const baseFrom = stateOf(e.from, climbed);
            const baseTo = stateOf(e.to, climbed);
            const fromState: NodeState = baseFrom === 'available' && e.from === next ? 'next' : baseFrom;
            const toState: NodeState = baseTo === 'available' && e.to === next ? 'next' : baseTo;
            const incident =
              hoveredId === e.from || hoveredId === e.to ||
              selectedId === e.from || selectedId === e.to;
            const fi = recIndex.get(e.from);
            const ti = recIndex.get(e.to);
            const onRecommended =
              fi !== undefined && ti !== undefined && Math.abs(fi - ti) === 1 &&
              recommendedSet.has(e.from) && recommendedSet.has(e.to);
            return (
              <Edge
                key={`e-${i}`}
                edge={e}
                fromState={fromState}
                toState={toState}
                onRecommended={onRecommended}
                incident={incident}
              />
            );
          })}
          {Object.values(NODES).map((node) => {
            const base = stateOf(node.id, climbed);
            const state: NodeState =
              base === 'available' && node.id === next ? 'next' : base;
            return (
              <HexNode
                key={node.id}
                node={node}
                state={state}
                hovered={hoveredId === node.id}
                selected={selectedId === node.id}
                justLearned={justLearnedId === node.id}
                onHover={setHoveredId}
                onClick={onNodeClick}
              />
            );
          })}
        </svg>
      </div>
    </div>
  );
}
