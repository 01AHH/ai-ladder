import { describe, it, expect, beforeEach } from 'vitest';
import { getClimbed, isClimbed, climb, unclimb, resetTree, STORAGE_KEY } from './state';

describe('climbed state', () => {
  beforeEach(() => localStorage.clear());

  it('returns an empty set initially', () => {
    expect(getClimbed().size).toBe(0);
  });

  it('persists a climbed node', () => {
    climb('prompting');
    expect(isClimbed('prompting')).toBe(true);
    expect(getClimbed().has('prompting')).toBe(true);
  });

  it('un-climbs', () => {
    climb('prompting');
    unclimb('prompting');
    expect(isClimbed('prompting')).toBe(false);
  });

  it('survives JSON roundtrip through localStorage', () => {
    climb('vibe');
    climb('agents');
    const raw = localStorage.getItem(STORAGE_KEY);
    expect(raw).toBeTruthy();
    expect(JSON.parse(raw!).sort()).toEqual(['agents', 'vibe']);
  });

  it('resetTree clears storage', () => {
    climb('repo');
    resetTree();
    expect(getClimbed().size).toBe(0);
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it('is tolerant of malformed storage', () => {
    localStorage.setItem(STORAGE_KEY, 'not json');
    expect(getClimbed().size).toBe(0);
  });
});
