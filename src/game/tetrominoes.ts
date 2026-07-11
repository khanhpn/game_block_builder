import { BOARD_WIDTH, type ActivePiece, type Matrix, type PieceType } from '@/game/types';

export const TETROMINOES: Record<PieceType, Matrix> = {
  I: [[1, 1, 1, 1]],
  O: [
    [1, 1],
    [1, 1],
  ],
  T: [
    [0, 1, 0],
    [1, 1, 1],
  ],
  S: [
    [0, 1, 1],
    [1, 1, 0],
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 1],
  ],
  J: [
    [1, 0, 0],
    [1, 1, 1],
  ],
  L: [
    [0, 0, 1],
    [1, 1, 1],
  ],
  I_MIRROR: [[1], [1], [1], [1]],
  O_MIRROR: [
    [1, 1],
    [1, 1],
  ],
  T_MIRROR: [
    [0, 1, 0],
    [1, 1, 1],
  ],
  S_MIRROR: [
    [1, 1, 0],
    [0, 1, 1],
  ],
  Z_MIRROR: [
    [0, 1, 1],
    [1, 1, 0],
  ],
  J_MIRROR: [
    [0, 0, 1],
    [1, 1, 1],
  ],
  L_MIRROR: [
    [1, 0, 0],
    [1, 1, 1],
  ],
};

export const rotateMatrix = (matrix: Matrix): Matrix =>
  matrix[0].map((_, column) => matrix.map((row) => row[column]).reverse());

export const createBag = (random = Math.random): PieceType[] => {
  const bag: PieceType[] = Object.keys(TETROMINOES) as PieceType[];

  for (let index = bag.length - 1; index > 0; index -= 1) {
    const target = Math.floor(random() * (index + 1));
    [bag[index], bag[target]] = [bag[target], bag[index]];
  }

  return bag;
};

export const spawnPiece = (type: PieceType): ActivePiece => {
  const matrix = TETROMINOES[type].map((row) => [...row]);
  return {
    type,
    matrix,
    x: Math.floor((BOARD_WIDTH - matrix[0].length) / 2),
    y: 0,
  };
};
