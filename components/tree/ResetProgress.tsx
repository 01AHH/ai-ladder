'use client';

import { useClimbed } from '@/lib/tree/useClimbed';

export function ResetProgress() {
  const { climbed, reset } = useClimbed();
  if (climbed.size === 0) return null;

  function handle() {
    if (window.confirm(`Reset all progress? (${climbed.size} climbed rungs will be cleared.)`)) {
      reset();
    }
  }

  return (
    <button type="button" className="reset-progress" onClick={handle}>
      reset progress ({climbed.size})
    </button>
  );
}
