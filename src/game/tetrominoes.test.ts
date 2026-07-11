import { describe, expect, it } from 'vitest';
import { TETROMINOES, createBag, rotateMatrix, spawnPiece } from '@/game/tetrominoes';

describe('tetrominoes', () => {
  it('defines seven classic pieces and seven mirror variants', () => {
    expect(Object.keys(TETROMINOES)).toEqual([
      'I',
      'O',
      'T',
      'S',
      'Z',
      'J',
      'L',
      'I_MIRROR',
      'O_MIRROR',
      'T_MIRROR',
      'S_MIRROR',
      'Z_MIRROR',
      'J_MIRROR',
      'L_MIRROR',
    ]);

    expect(TETROMINOES.S_MIRROR).toEqual(TETROMINOES.Z);
    expect(TETROMINOES.J_MIRROR).toEqual(TETROMINOES.L);
  });

  it('rotates a matrix clockwise', () => {
    expect(
      rotateMatrix([
        [1, 0],
        [1, 1],
      ]),
    ).toEqual([
      [1, 1],
      [1, 0],
    ]);
  });

  it('creates one of every piece in each 14-piece bag', () => {
    const bag = createBag(() => 0.5);
    expect(bag).toHaveLength(14);
    expect(new Set(bag)).toEqual(new Set(Object.keys(TETROMINOES)));
  });

  it('spawns pieces centered above the board', () => {
    expect(spawnPiece('T')).toMatchObject({ type: 'T', x: 6, y: 0 });
  });
});
