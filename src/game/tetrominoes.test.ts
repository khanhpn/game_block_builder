import { describe, expect, it } from 'vitest';
import { TETROMINOES, createBag, rotateMatrix, spawnPiece } from './tetrominoes';

describe('tetrominoes', () => {
  it('defines all seven classic pieces', () => {
    expect(Object.keys(TETROMINOES)).toEqual(['I', 'O', 'T', 'S', 'Z', 'J', 'L']);
  });

  it('rotates a matrix clockwise', () => {
    expect(rotateMatrix([[1, 0], [1, 1]])).toEqual([[1, 1], [1, 0]]);
  });

  it('creates one of every piece in each bag', () => {
    expect(new Set(createBag(() => 0.5))).toEqual(new Set(['I', 'O', 'T', 'S', 'Z', 'J', 'L']));
  });

  it('spawns pieces centered above the board', () => {
    expect(spawnPiece('T')).toMatchObject({ type: 'T', x: 3, y: 0 });
  });
});
