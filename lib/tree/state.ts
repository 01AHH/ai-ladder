import type { NodeId } from '@/content/tree-nodes';

export const STORAGE_KEY = 'ai-ladder:climbed';

function safeStorage(): Storage | null {
  if (typeof window === 'undefined') return null;
  try { return window.localStorage; } catch { return null; }
}

export function getClimbed(): Set<NodeId> {
  const s = safeStorage();
  if (!s) return new Set();
  const raw = s.getItem(STORAGE_KEY);
  if (!raw) return new Set();
  try {
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return new Set();
    return new Set(arr as NodeId[]);
  } catch {
    return new Set();
  }
}

function setClimbed(next: Set<NodeId>): void {
  const s = safeStorage();
  if (!s) return;
  s.setItem(STORAGE_KEY, JSON.stringify(Array.from(next)));
}

export function isClimbed(id: NodeId): boolean {
  return getClimbed().has(id);
}

export function climb(id: NodeId): void {
  const set = getClimbed();
  set.add(id);
  setClimbed(set);
}

export function unclimb(id: NodeId): void {
  const set = getClimbed();
  set.delete(id);
  setClimbed(set);
}

export function resetTree(): void {
  const s = safeStorage();
  if (!s) return;
  s.removeItem(STORAGE_KEY);
}
