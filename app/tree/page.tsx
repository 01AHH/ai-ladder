'use client';

import { useEffect, useRef, useState } from 'react';
import './tree.css';
import { Stage } from '@/components/tree/Stage';
import { TreeGraph } from '@/components/tree/TreeGraph';
import { LegendBar } from '@/components/tree/LegendBar';
import { SidePanel } from '@/components/tree/SidePanel';
import { PanelContent } from '@/components/tree/PanelContent';
import { DevBanner } from '@/components/tree/DevBanner';
import { HUD } from '@/components/tree/HUD';
import { useClimbed } from '@/lib/tree/useClimbed';
import type { NodeId } from '@/content/tree-nodes';

export default function TreePage() {
  const [selectedId, setSelectedId] = useState<NodeId | null>(null);
  const [justLearnedId, setJustLearnedId] = useState<NodeId | null>(null);
  const { climbed } = useClimbed();
  const prevClimbed = useRef<Set<NodeId>>(climbed);

  useEffect(() => {
    const removed: string[] = [];
    document.body.classList.forEach((c) => {
      if (c.startsWith('scene-')) removed.push(c);
    });
    removed.forEach((c) => document.body.classList.remove(c));
    document.body.classList.add('tree-route');
    return () => {
      document.body.classList.remove('tree-route');
    };
  }, []);

  useEffect(() => {
    const added: NodeId[] = [];
    climbed.forEach((id) => { if (!prevClimbed.current.has(id)) added.push(id); });
    prevClimbed.current = climbed;
    if (added.length > 0) {
      const id = added[0];
      setJustLearnedId(id);
      const t = setTimeout(() => setJustLearnedId(null), 1200);
      return () => clearTimeout(t);
    }
  }, [climbed]);

  function handleNodeClick(id: NodeId) {
    setSelectedId((cur) => (cur === id ? null : id));
  }

  return (
    <Stage>
      <TreeGraph
        onNodeClick={handleNodeClick}
        selectedId={selectedId}
        justLearnedId={justLearnedId}
      />
      <HUD />
      <LegendBar />
      <SidePanel selectedId={selectedId} onClose={() => setSelectedId(null)}>
        {selectedId && <PanelContent id={selectedId} onJumpTo={(id) => setSelectedId(id)} />}
      </SidePanel>
      <DevBanner />
    </Stage>
  );
}
