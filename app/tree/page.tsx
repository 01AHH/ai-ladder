'use client';

import './tree.css';
import { Stage } from '@/components/tree/Stage';

export default function TreePage() {
  return (
    <Stage>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ fontFamily: 'Instrument Serif, serif', fontStyle: 'italic', fontSize: 28, color: '#f5efd1', opacity: 0.55 }}>
          Skill tree — under construction.
        </p>
      </div>
    </Stage>
  );
}
