import { useMemo } from 'react';
import { TETROMINOES } from '../game/tetrominoes';
import type { PieceType } from '../game/types';

export function NextPiece({ piece }: { piece: PieceType }) {
  const matrix = TETROMINOES[piece];
  const previewCells = useMemo(() => Array.from({ length: 16 }, (_, index) => {
    const row = Math.floor(index / 4);
    const column = index % 4;
    const offsetX = Math.floor((4 - matrix[0].length) / 2);
    const offsetY = Math.floor((4 - matrix.length) / 2);
    return Boolean(matrix[row - offsetY]?.[column - offsetX]);
  }), [matrix]);

  return (
    <section className="panel next-panel">
      <div className="panel-heading"><span>Next signal</span><span>01</span></div>
      <div className="preview-grid" aria-label={`Next piece ${piece}`}>
        {previewCells.map((filled, index) => (
          <span className={filled ? `preview-cell piece-${piece.toLowerCase()}` : 'preview-cell'} key={index} />
        ))}
      </div>
    </section>
  );
}
