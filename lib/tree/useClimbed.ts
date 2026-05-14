'use client';

import { useCallback, useEffect, useState } from 'react';
import type { NodeId } from '@/content/tree-nodes';
import { getClimbed, climb as climbFn, unclimb as unclimbFn, resetTree, STORAGE_KEY } from './state';

export function useClimbed() {
  const [climbed, setClimbed] = useState<Set<NodeId>>(() => new Set());

  // Hydrate from localStorage on mount (avoids SSR/CSR mismatch)
  useEffect(() => { setClimbed(getClimbed()); }, []);

  // Listen for cross-tab changes
  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === STORAGE_KEY) setClimbed(getClimbed());
    }
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const climb = useCallback((id: NodeId) => {
    climbFn(id);
    setClimbed(getClimbed());
  }, []);

  const unclimb = useCallback((id: NodeId) => {
    unclimbFn(id);
    setClimbed(getClimbed());
  }, []);

  const reset = useCallback(() => {
    resetTree();
    setClimbed(new Set());
  }, []);

  return { climbed, climb, unclimb, reset };
}
