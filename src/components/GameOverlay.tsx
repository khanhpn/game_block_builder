import type { Dispatch } from 'react';
import type { GameAction, GameStatus } from '@/game/reducer';
import { useGameOverlayAction } from '@/hooks/useGameOverlayAction';

interface GameOverlayProps {
  status: GameStatus;
  score: number;
  dispatch: Dispatch<GameAction>;
}

export const GameOverlay = ({ status, score, dispatch }: GameOverlayProps) => {
  const handleAction = useGameOverlayAction(status, dispatch);

  if (status === 'playing') return null;

  const content = {
    ready: {
      eyebrow: 'SYSTEM READY',
      title: 'Ready to stack?',
      text: 'Clear lines. Chase the signal.',
      button: 'Start game',
    },
    paused: {
      eyebrow: 'SIGNAL HELD',
      title: 'Game paused',
      text: 'Take a breath. The grid will wait.',
      button: 'Resume game',
    },
    gameover: {
      eyebrow: 'SIGNAL LOST',
      title: 'Game over',
      text: `Final score ${score.toLocaleString()}`,
      button: 'Play again',
    },
  }[status];

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
