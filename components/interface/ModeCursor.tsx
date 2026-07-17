"use client";

import { useEffect, useRef, useState } from "react";

export function ModeCursor() {
  const el = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [big, setBig] = useState(false);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setEnabled(true);
    let raf = 0;
    let x = 0;
    let y = 0;
    const onMove = (e: MouseEvent) => {
      x = e.clientX;
      y = e.clientY;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (el.current) {
          el.current.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
        }
      });
    };
    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      setBig(Boolean(t.closest('[data-cursor="climb"]')));
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (!enabled) return null;
  return (
    <div ref={el} className={`mode-cursor${big ? " big" : ""}`} aria-hidden="true">
      <span className="label">CLIMB ↗</span>
    </div>
  );
}
