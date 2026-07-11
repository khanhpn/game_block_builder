import { useMemo } from 'react';
import { TETROMINOES } from '@/game/tetrominoes';
import type { PieceType } from '@/game/types';

export interface PreviewCell {
  filled: boolean;
  className: string;
}

export const useNextPiecePreview = (piece: PieceType): PreviewCell[] => {
  const matrix = TETROMINOES[piece];

  return useMemo(
    () =>
      Array.from({ length: 16 }, (_, index) => {
        const row = Math.floor(index / 4);
        const column = index % 4;
        const offsetX = Math.floor((4 - matrix[0].length) / 2);
        const offsetY = Math.floor((4 - matrix.length) / 2);
        const filled = Boolean(matrix[row - offsetY]?.[column - offsetX]);
        return {
          filled,
          className: filled
            ? `preview-cell piece-${piece.split('_')[0].toLowerCase()}`
            : 'preview-cell',
        };
      }),
    [matrix, piece],
  );
};
