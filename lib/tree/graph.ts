import { EDGES, type NodeId } from '@/content/tree-nodes';

/** A node's prereqs are the `from` ends of all `spine` and `cluster` edges into it,
 *  plus the special `bridge` edge from `prompting` (since Skills unlocks early).
 *  Cluster edges are progression gates (Skills → Superpowers/Memory → Knowledge),
 *  not purely visual groupings.
 *
 *  Returned order follows `EDGES` declaration order.
 *  `closestUnmetPrereq` depends on this for its "first unmet" semantics.
 */
export function prereqsOf(id: NodeId): NodeId[] {
  return EDGES
    .filter((e) => e.to === id)
    .filter((e) => e.kind === 'spine' || e.kind === 'cluster' || (e.kind === 'bridge' && e.from === 'prompting'))
    .map((e) => e.from);
}

/** A node's render state.
 *  `stateOf()` only returns `'available' | 'climbed' | 'locked'`.
 *  The `'next'` state is composed at the UI layer by marking the single
 *  result of `recommendedNext()` as `'next'` instead of `'available'`.
 */
export type NodeState = 'available' | 'climbed' | 'next' | 'locked';

export function stateOf(id: NodeId, climbed: Set<NodeId>): NodeState {
  if (climbed.has(id)) return 'climbed';
  const prereqs = prereqsOf(id);
  if (prereqs.every((p) => climbed.has(p))) return 'available';
  return 'locked';
}

/** Traversal priority for picking the single "recommended next" node.
 *  Per spec §6: tech first, then soft, then cluster. Root first if not climbed.
 */
const RECOMMENDATION_ORDER: NodeId[] = [
  'prompting',
  'vibe', 'agents', 'repo', 'apis', 'cron', 'integrated',
  'cowork', 'scheduling', 'connectors',
  'skills', 'superpowers', 'memory', 'knowledge',
];

export function recommendedNext(climbed: Set<NodeId>): NodeId | null {
  for (const id of RECOMMENDATION_ORDER) {
    if (stateOf(id, climbed) === 'available') return id;
  }
  return null;
}

export function closestUnmetPrereq(id: NodeId, climbed: Set<NodeId>): NodeId | null {
  if (climbed.has(id)) return null;
  const prereqs = prereqsOf(id);
  return prereqs.find((p) => !climbed.has(p)) ?? null;
}
