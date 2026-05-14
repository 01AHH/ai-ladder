'use client';

import './tree.css';
import { TabNav } from '@/components/tree/TabNav';

export default function TreePage() {
  return (
    <main className="tree-page">
      <div className="tree-tabs"><TabNav theme="dark" /></div>
      <div className="tree-stage-placeholder">
        <p className="placeholder-text">Skill tree — under construction.</p>
      </div>
    </main>
  );
}
