import { BOARD_HEIGHT, BOARD_WIDTH, type ActivePiece, type Board, type Cell } from '@/game/types';

export const createBoard = (): Board =>
  Array.from({ length: BOARD_HEIGHT }, () => Array<Cell>(BOARD_WIDTH).fill(null));

export const hasCollision = (board: Board, piece: ActivePiece): boolean =>
  piece.matrix.some((row, rowIndex) =>
    row.some((value, columnIndex) => {
      if (!value) return false;
      const x = piece.x + columnIndex;
      const y = piece.y + rowIndex;
      return x < 0 || x >= BOARD_WIDTH || y >= BOARD_HEIGHT || (y >= 0 && board[y][x] !== null);
    }),
  );

export const mergePiece = (board: Board, piece: ActivePiece): Board => {
  const merged = board.map((row) => [...row]);
  piece.matrix.forEach((row, rowIndex) => {
    row.forEach((value, columnIndex) => {
      const y = piece.y + rowIndex;
      const x = piece.x + columnIndex;
      if (value && y >= 0) merged[y][x] = piece.type;
    });
  });
  return merged;
};

export const clearFullRows = (board: Board): { board: Board; cleared: number } => {
  const remaining = board.filter((row) => row.some((cell) => cell === null));
  const cleared = BOARD_HEIGHT - remaining.length;
  const emptyRows = Array.from({ length: cleared }, () => Array<Cell>(BOARD_WIDTH).fill(null));
  return { board: [...emptyRows, ...remaining], cleared };
};

export const getDropDistance = (board: Board, piece: ActivePiece): number => {
  let distance = 0;
  while (!hasCollision(board, { ...piece, y: piece.y + distance + 1 })) distance += 1;
  return distance;
};
