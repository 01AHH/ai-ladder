'use client';

import './tree.css';
import { Stage } from '@/components/tree/Stage';
import { TreeGraph } from '@/components/tree/TreeGraph';
import { LegendBar } from '@/components/tree/LegendBar';

export default function TreePage() {
  return (
    <Stage>
      <TreeGraph onNodeClick={(id) => console.log('node clicked:', id)} />
      <LegendBar />
    </Stage>
  );
}
