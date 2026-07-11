import { useMemo } from 'react';
import { getDropDistance } from '@/game/board';
import type { GameState } from '@/game/reducer';
import type { PieceType } from '@/game/types';

export type DisplayCell = {
  type: PieceType | null;
  mode?: 'active' | 'ghost';
  className: string;
};

const paintPiece = (
  cells: DisplayCell[][],
  state: GameState,
  mode: 'active' | 'ghost',
  offsetY = 0,
) => {
  state.activePiece.matrix.forEach((row, rowIndex) =>
    row.forEach((value, columnIndex) => {
      if (!value) return;
      const x = state.activePiece.x + columnIndex;
      const y = state.activePiece.y + rowIndex + offsetY;
      if (y >= 0 && y < cells.length && x >= 0 && x < cells[0].length) {
        cells[y][x] = {
          type: state.activePiece.type,
          mode,
          className: `cell piece-${state.activePiece.type.split('_')[0].toLowerCase()} cell--${mode}`,
        };
      }
    }),
  );
};

export const useBoardCells = (state: GameState): DisplayCell[] =>
  useMemo(() => {
    const cells: DisplayCell[][] = state.board.map((row) =>
      row.map((type) => ({
        type,
        className: type ? `cell piece-${type.split('_')[0].toLowerCase()}` : 'cell',
      })),
    );
    if (state.status === 'playing') {
      paintPiece(cells, state, 'ghost', getDropDistance(state.board, state.activePiece));
    }
    paintPiece(cells, state, 'active');
    return cells.flat();
  }, [state]);
