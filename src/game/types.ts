export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;

export type PieceType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L';
export type Matrix = number[][];
export type Cell = PieceType | null;
export type Board = Cell[][];

export interface ActivePiece {
  type: PieceType;
  matrix: Matrix;
  x: number;
  y: number;
}
