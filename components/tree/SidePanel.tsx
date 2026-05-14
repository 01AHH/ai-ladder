// components/tree/SidePanel.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
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
  const [dragY, setDragY] = useState(0);
  const dragStart = useRef<number | null>(null);

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

  // Reset drag offset when panel re-opens
  useEffect(() => { setDragY(0); }, [selectedId]);

  function onHandlePointerDown(e: React.PointerEvent) {
    (e.target as Element).setPointerCapture?.(e.pointerId);
    dragStart.current = e.clientY;
  }
  function onHandlePointerMove(e: React.PointerEvent) {
    if (dragStart.current == null) return;
    const dy = Math.max(0, e.clientY - dragStart.current);
    setDragY(dy);
  }
  function onHandlePointerUp() {
    if (dragY > 80) onClose();
    setDragY(0);
    dragStart.current = null;
  }

  const open = !!selectedId;
  const style = open ? { transform: `translateY(${dragY}px)` } : undefined;

  return (
    <aside
      ref={ref}
      className={`tree-panel ${open ? 'tree-panel-open' : ''}`}
      aria-hidden={!open}
      style={style}
    >
      <div
        className="tree-panel-handle"
        onPointerDown={onHandlePointerDown}
        onPointerMove={onHandlePointerMove}
        onPointerUp={onHandlePointerUp}
        aria-label="drag to dismiss"
      />
      {open && children}
    </aside>
  );
}
