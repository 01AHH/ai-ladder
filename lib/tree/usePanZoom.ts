'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

type Pan = { x: number; y: number; scale: number };

const MIN_SCALE = 0.5;
const MAX_SCALE = 2.5;
const PAN_BOUNDS = 200; // px overflow allowed past stage edge

export function usePanZoom(initial: Pan = { x: 0, y: 0, scale: 1 }) {
  const [pan, setPan] = useState<Pan>(initial);
  const ref = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; y: number; px: number; py: number } | null>(null);
  const pinch = useRef<{ d0: number; s0: number } | null>(null);

  const clamp = useCallback((next: Pan): Pan => {
    const el = ref.current;
    if (!el) return next;
    const r = el.getBoundingClientRect();
    const maxX = r.width / 2 + PAN_BOUNDS;
    const maxY = r.height / 2 + PAN_BOUNDS;
    return {
      x: Math.max(-maxX, Math.min(maxX, next.x)),
      y: Math.max(-maxY, Math.min(maxY, next.y)),
      scale: Math.max(MIN_SCALE, Math.min(MAX_SCALE, next.scale)),
    };
  }, []);

  function distance(touches: React.TouchList) {
    const [a, b] = [touches[0], touches[1]];
    return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
  }

  function onPointerDown(e: React.PointerEvent) {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    (e.target as Element).setPointerCapture?.(e.pointerId);
    drag.current = { x: e.clientX, y: e.clientY, px: pan.x, py: pan.y };
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!drag.current) return;
    const dx = e.clientX - drag.current.x;
    const dy = e.clientY - drag.current.y;
    if (Math.hypot(dx, dy) < 3) return; // deadzone — let small wiggles register as clicks
    setPan((p) => clamp({ ...p, x: drag.current!.px + dx, y: drag.current!.py + dy }));
  }

  function onPointerUp() { drag.current = null; }

  function onTouchStart(e: React.TouchEvent) {
    if (e.touches.length === 2) {
      pinch.current = { d0: distance(e.touches), s0: pan.scale };
    }
  }
  function onTouchMove(e: React.TouchEvent) {
    if (e.touches.length === 2 && pinch.current) {
      const d = distance(e.touches);
      const next = pinch.current.s0 * (d / pinch.current.d0);
      setPan((p) => clamp({ ...p, scale: next }));
    }
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (e.touches.length < 2) pinch.current = null;
  }

  // Cleanup on unmount
  useEffect(() => () => { drag.current = null; pinch.current = null; }, []);

  return {
    ref,
    pan,
    handlers: { onPointerDown, onPointerMove, onPointerUp, onTouchStart, onTouchMove, onTouchEnd },
    reset: () => setPan(initial),
  };
}
