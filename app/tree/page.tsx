'use client';

import { useEffect, useState } from 'react';
import './tree.css';
import { Stage } from '@/components/tree/Stage';
import { TreeGraph } from '@/components/tree/TreeGraph';
import { LegendBar } from '@/components/tree/LegendBar';
import { SidePanel } from '@/components/tree/SidePanel';
import { PanelContent } from '@/components/tree/PanelContent';
import { ResetProgress } from '@/components/tree/ResetProgress';
import { DevBanner } from '@/components/tree/DevBanner';
import type { NodeId } from '@/content/tree-nodes';

export default function TreePage() {
  const [selectedId, setSelectedId] = useState<NodeId | null>(null);

  // The essay page applies `scene-*` body classes for its scroll-driven palette.
  // Strip them on /tree so the body bg doesn't bleed through the dark stage.
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

  function handleNodeClick(id: NodeId) {
    setSelectedId((cur) => (cur === id ? null : id));
  }

  return (
    <Stage>
      <TreeGraph onNodeClick={handleNodeClick} />
      <LegendBar />
      <ResetProgress />
      <SidePanel selectedId={selectedId} onClose={() => setSelectedId(null)}>
        {selectedId && <PanelContent id={selectedId} onJumpTo={(id) => setSelectedId(id)} />}
      </SidePanel>
      <DevBanner />
    </Stage>
  );
}
