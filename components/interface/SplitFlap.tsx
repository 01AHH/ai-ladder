"use client";

import { useEffect, useState } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const FLIP_STEPS = 4;

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

type Props = { words: string[]; interval?: number };

export function SplitFlap({ words, interval = 3500 }: Props) {
  const maxLen = Math.max(...words.map((w) => w.length));
  const pad = (w: string) => w.padEnd(maxLen, " ");
  const [display, setDisplay] = useState(() => pad(words[0]).split(""));
  const [reduced] = useState(prefersReducedMotion);

  useEffect(() => {
    if (reduced || words.length < 2) return;
    let word = 0;
    const timers = new Set<ReturnType<typeof setTimeout>>();
    const later = (fn: () => void, ms: number) => {
      const t = setTimeout(() => {
        timers.delete(t);
        fn();
      }, ms);
      timers.add(t);
    };
    const setChar = (i: number, ch: string) =>
      setDisplay((d) => (d[i] === ch ? d : d.map((c, j) => (j === i ? ch : c))));
    const flipChar = (i: number, target: string, step: number) => {
      if (step >= FLIP_STEPS || target === " ") {
        setChar(i, target);
        return;
      }
      setChar(i, CHARS[(i * 5 + step * 11) % CHARS.length]);
      later(() => flipChar(i, target, step + 1), 55);
    };
    const flipTo = (w: string) =>
      w.split("").forEach((ch, i) => later(() => flipChar(i, ch, 0), i * 70));
    const cycle = setInterval(() => {
      word = (word + 1) % words.length;
      flipTo(pad(words[word]));
    }, interval);
    return () => {
      clearInterval(cycle);
      timers.forEach(clearTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced, interval]);

  return (
    <span className="if-flap" aria-label={words[0]}>
      {display.map((c, i) => (
        <span
          key={`${i}-${c}`}
          className="flap"
          data-space={c === " " ? "true" : undefined}
          aria-hidden="true"
        >
          {c}
        </span>
      ))}
    </span>
  );
}
