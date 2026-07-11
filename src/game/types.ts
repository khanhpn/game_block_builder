export const BOARD_WIDTH = 15;
export const BOARD_HEIGHT = 25;

export type PieceType =
  | 'I'
  | 'O'
  | 'T'
  | 'S'
  | 'Z'
  | 'J'
  | 'L'
  | 'I_MIRROR'
  | 'O_MIRROR'
  | 'T_MIRROR'
  | 'S_MIRROR'
  | 'Z_MIRROR'
  | 'J_MIRROR'
  | 'L_MIRROR';
export type Matrix = number[][];
export type Cell = PieceType | null;
export type Board = Cell[][];

export interface ActivePiece {
  type: PieceType;
  matrix: Matrix;
  x: number;
  y: number;
}
