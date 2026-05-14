'use client';

import { useState } from 'react';
import './tree.css';
import { Stage } from '@/components/tree/Stage';
import { TreeGraph } from '@/components/tree/TreeGraph';
import { LegendBar } from '@/components/tree/LegendBar';
import { SidePanel } from '@/components/tree/SidePanel';
import { PanelContent } from '@/components/tree/PanelContent';
import type { NodeId } from '@/content/tree-nodes';

export default function TreePage() {
  const [selectedId, setSelectedId] = useState<NodeId | null>(null);

  function handleNodeClick(id: NodeId) {
    setSelectedId((cur) => (cur === id ? null : id));
  }

  return (
    <Stage>
      <TreeGraph onNodeClick={handleNodeClick} />
      <LegendBar />
      <SidePanel selectedId={selectedId} onClose={() => setSelectedId(null)}>
        {selectedId && <PanelContent id={selectedId} onJumpTo={(id) => setSelectedId(id)} />}
      </SidePanel>
    </Stage>
  );
}
