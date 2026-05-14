'use client';

import { useState } from 'react';
import './tree.css';
import { Stage } from '@/components/tree/Stage';
import { TreeGraph } from '@/components/tree/TreeGraph';
import { LegendBar } from '@/components/tree/LegendBar';
import { SidePanel } from '@/components/tree/SidePanel';
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
        <div style={{ fontFamily: 'JetBrains Mono, ui-monospace, monospace', fontSize: 12, color: '#f5efd1' }}>
          Selected: {selectedId}
        </div>
      </SidePanel>
    </Stage>
  );
}
