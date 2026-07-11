import { useCallback, type Dispatch } from 'react';
import type { GameAction, GameStatus } from '@/game/reducer';

export const useGameOverlayAction = (
  status: GameStatus,
  dispatch: Dispatch<GameAction>,
): (() => void) =>
  useCallback(() => {
    const action: GameAction =
      status === 'ready'
        ? { type: 'START' }
        : status === 'paused'
          ? { type: 'TOGGLE_PAUSE' }
          : { type: 'RESTART' };
    dispatch(action);
  }, [dispatch, status]);
