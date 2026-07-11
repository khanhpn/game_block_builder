import { describe, expect, it } from 'vitest';
import { clearFullRows, createBoard, getDropDistance, hasCollision, mergePiece } from '@/game/board';
import { spawnPiece } from '@/game/tetrominoes';

describe('board rules', () => {
  it('creates a 10 by 20 empty board', () => {
    const board = createBoard();
    expect(board).toHaveLength(20);
    expect(board[0]).toHaveLength(10);
    expect(board.flat().every((cell) => cell === null)).toBe(true);
  });

  it('detects collisions beyond the board and with locked cells', () => {
    const board = createBoard();
    const piece = spawnPiece('O');
    expect(hasCollision(board, { ...piece, x: -1 })).toBe(true);
    board[1][piece.x] = 'T';
    expect(hasCollision(board, piece)).toBe(true);
  });

  it('merges a piece without mutating the original board', () => {
    const board = createBoard();
    const merged = mergePiece(board, spawnPiece('O'));
    expect(merged[0].filter(Boolean)).toHaveLength(2);
    expect(board[0].filter(Boolean)).toHaveLength(0);
  });

  it('clears full rows and adds empty rows at the top', () => {
    const board = createBoard();
    board[19] = Array(10).fill('I');
    board[18][0] = 'L';
    const result = clearFullRows(board);
    expect(result.cleared).toBe(1);
    expect(result.board[0].every((cell) => cell === null)).toBe(true);
    expect(result.board[19][0]).toBe('L');
  });

  it('finds the hard-drop distance', () => {
    const piece = spawnPiece('O');
    expect(getDropDistance(createBoard(), piece)).toBe(18);
  });
});
