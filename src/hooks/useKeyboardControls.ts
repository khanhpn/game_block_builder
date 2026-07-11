import { useCallback, useEffect, type Dispatch } from 'react';
import type { GameAction, GameStatus } from '../game/reducer';

export const useKeyboardControls = (dispatch: Dispatch<GameAction>, status: GameStatus): void => {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    let action: GameAction | null = null;

    if ((event.key === 'p' || event.key === 'P' || event.key === 'Escape') && (status === 'playing' || status === 'paused')) {
      action = { type: 'TOGGLE_PAUSE' };
    } else if (event.key === 'Enter' && (status === 'ready' || status === 'gameover')) {
      action = status === 'ready' ? { type: 'START' } : { type: 'RESTART' };
    } else if (status === 'playing') {
      const actions: Record<string, GameAction> = {
        ArrowLeft: { type: 'MOVE', dx: -1 },
        ArrowRight: { type: 'MOVE', dx: 1 },
        ArrowDown: { type: 'SOFT_DROP' },
        ArrowUp: { type: 'ROTATE' },
        ' ': { type: 'HARD_DROP' },
      };
      action = actions[event.key] ?? null;
    }

    if (action) {
      event.preventDefault();
      dispatch(action);
    }
  }, [dispatch, status]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
};
