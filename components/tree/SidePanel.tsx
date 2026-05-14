'use client';

import { useEffect, useRef } from 'react';
import type { NodeId } from '@/content/tree-nodes';

export function SidePanel({
  selectedId,
  onClose,
  children,
}: {
  selectedId: NodeId | null;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose(); }
    function onClick(e: MouseEvent) {
      if (!selectedId) return;
      const target = e.target as Element;
      if (ref.current && ref.current.contains(target)) return;
      if (target.closest?.('[role="button"]')) return; // let hex's onClick toggle
      onClose();
    }
    window.addEventListener('keydown', onKey);
    window.addEventListener('mousedown', onClick);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('mousedown', onClick);
    };
  }, [selectedId, onClose]);

  const open = !!selectedId;

  return (
    <aside
      ref={ref}
      className={`tree-panel ${open ? 'tree-panel-open' : ''}`}
      aria-hidden={!open}
    >
      {open && children}
    </aside>
  );
}
