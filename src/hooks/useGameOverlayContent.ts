import { useMemo } from 'react';
import type { GameStatus } from '@/game/reducer';

export interface GameOverlayContent {
  eyebrow: string;
  title: string;
  text: string;
  button: string;
}

export const useGameOverlayContent = (
  status: GameStatus,
  score: number,
): GameOverlayContent | null =>
  useMemo(() => {
    if (status === 'playing') return null;
    return {
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
  }, [score, status]);
