import { describe, expect, it } from 'vitest';
import { gravityForLevel, levelForLines, scoreLines } from '@/game/scoring';

describe('scoring', () => {
  it('scores one through four cleared rows', () => {
    expect([1, 2, 3, 4].map((count) => scoreLines(count, 2))).toEqual([200, 600, 1000, 1600]);
  });

  it('increases level every ten rows', () => {
    expect(levelForLines(0)).toBe(1);
    expect(levelForLines(20)).toBe(3);
  });

  it('speeds up gravity without becoming uncontrollable', () => {
    expect(gravityForLevel(2)).toBeLessThan(gravityForLevel(1));
    expect(gravityForLevel(99)).toBe(90);
  });
});
