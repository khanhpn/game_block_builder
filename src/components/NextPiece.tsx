import type { PieceType } from '@/game/types';
import { useNextPiecePreview } from '@/hooks/useNextPiecePreview';

export const NextPiece = ({ piece }: { piece: PieceType }) => {
  const previewCells = useNextPiecePreview(piece);

  return (
    <section className="panel next-panel">
      <div className="panel-heading">
        <span>Next signal</span>
        <span>01</span>
      </div>
      <div className="preview-grid" aria-label={`Next piece ${piece}`}>
        {previewCells.map((filled, index) => (
          <span
            className={filled ? `preview-cell piece-${piece.toLowerCase()}` : 'preview-cell'}
            key={index}
          />
        ))}
      </div>
    </section>
  );
};
