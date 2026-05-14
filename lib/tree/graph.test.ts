import { describe, it, expect } from 'vitest';
import { prereqsOf, stateOf, recommendedNext, closestUnmetPrereq } from './graph';
import type { NodeId } from '@/content/tree-nodes';

describe('prereqsOf', () => {
  it('returns empty for the root', () => {
    expect(prereqsOf('prompting')).toEqual([]);
  });

  it('returns the upstream spine node', () => {
    expect(prereqsOf('agents')).toEqual(['vibe']);
  });

  it('returns multiple prereqs when there are converging spine edges', () => {
    // integrated has two predecessors on spine edges (apis, cron)
    expect(prereqsOf('integrated').sort()).toEqual(['apis', 'cron']);
  });

  it('does not include cluster or bridge edges as prereqs (except root→skills)', () => {
    // skills has only a bridge edge from prompting; prereqs should be just ['prompting']
    expect(prereqsOf('skills')).toEqual(['prompting']);
    // superpowers has a cluster edge from skills (not spine, not root bridge); no spine prereqs.
    expect(prereqsOf('superpowers')).toEqual([]);
  });
});

describe('stateOf', () => {
  it('returns climbed when the node is in the set', () => {
    expect(stateOf('prompting', new Set(['prompting']))).toBe('climbed');
  });

  it('returns available for the root when nothing is climbed', () => {
    expect(stateOf('prompting', new Set())).toBe('available');
  });

  it('returns locked when prereqs are unmet', () => {
    expect(stateOf('agents', new Set())).toBe('locked');
  });

  it('returns available when all prereqs are climbed', () => {
    expect(stateOf('agents', new Set(['vibe']))).toBe('available');
  });

  it('handles converging prereqs (integrated needs apis AND cron)', () => {
    expect(stateOf('integrated', new Set(['apis']))).toBe('locked');
    expect(stateOf('integrated', new Set(['apis', 'cron']))).toBe('available');
  });
});

describe('recommendedNext', () => {
  it('returns prompting when nothing is climbed', () => {
    expect(recommendedNext(new Set())).toBe('prompting');
  });

  it('returns null when everything is climbed', () => {
    const all: NodeId[] = [
      'prompting','cowork','scheduling','connectors',
      'skills','superpowers','memory','knowledge',
      'vibe','agents','repo','apis','cron','integrated',
    ];
    expect(recommendedNext(new Set(all))).toBeNull();
  });

  it('prefers technical branch progression', () => {
    // climbed prompting → next should be vibe (tech) over cowork (soft) by traversal priority
    expect(recommendedNext(new Set(['prompting']))).toBe('vibe');
  });
});

describe('closestUnmetPrereq', () => {
  it('returns null for already-climbed nodes', () => {
    expect(closestUnmetPrereq('prompting', new Set(['prompting']))).toBeNull();
  });

  it('returns the single unmet prereq', () => {
    expect(closestUnmetPrereq('agents', new Set())).toBe('vibe');
  });

  it('returns the first unmet prereq when there are multiple', () => {
    expect(closestUnmetPrereq('integrated', new Set(['apis']))).toBe('cron');
    expect(closestUnmetPrereq('integrated', new Set(['cron']))).toBe('apis');
  });
});
