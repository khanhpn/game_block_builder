import type { Dispatch } from 'react';
import type { GameAction, GameStatus } from '@/game/reducer';
import { useGameOverlayAction } from '@/hooks/useGameOverlayAction';
import { useGameOverlayContent } from '@/hooks/useGameOverlayContent';

interface GameOverlayProps {
  status: GameStatus;
  score: number;
  dispatch: Dispatch<GameAction>;
}

export const GameOverlay = ({ status, score, dispatch }: GameOverlayProps) => {
  const handleAction = useGameOverlayAction(status, dispatch);

  const content = useGameOverlayContent(status, score);

  if (!content) return null;

  return (
    <div className="game-overlay">
      <span className="eyebrow">{content.eyebrow}</span>
      <h2>{content.title}</h2>
      <p>{content.text}</p>
      <button type="button" onClick={handleAction}>
        {content.button}
      </button>
      <small>or press Enter</small>
    </div>
  );
};
