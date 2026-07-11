import { useCallback, useEffect, useReducer, useRef } from 'react';
import { createInitialState, gameReducer } from '@/game/reducer';
import type { GameAction, GameState } from '@/game/reducer';
import { gravityForLevel } from '@/game/scoring';
import { useGameAudio } from '@/hooks/useGameAudio';
import { useGameLoop } from '@/hooks/useGameLoop';
import { useHighScore } from '@/hooks/useHighScore';
import { useKeyboardControls } from '@/hooks/useKeyboardControls';

export const useTetrisGame = () => {
  const [state, dispatch] = useReducer(gameReducer, undefined, createInitialState);
  const audio = useGameAudio();
  const { playEvent } = audio;
  const previousStateRef = useRef<GameState | null>(null);

  const dispatchAction = useCallback(
    (action: GameAction) => {
      if (action.type === 'ROTATE') playEvent('rotate');
      if (action.type === 'SOFT_DROP' || action.type === 'HARD_DROP') playEvent('drop');
      dispatch(action);
    },
    [playEvent],
  );
  const tick = useCallback(() => dispatchAction({ type: 'TICK' }), [dispatchAction]);
  const delay = state.status === 'playing' ? gravityForLevel(state.level) : null;

  useEffect(() => {
    const previousState = previousStateRef.current;
    if (previousState) {
      const previousLocked = previousState.board.flat().filter(Boolean).length;
      const locked = state.board.flat().filter(Boolean).length;
      if (locked > previousLocked && state.lines === previousState.lines) playEvent('drop');
      if (state.lines > previousState.lines) playEvent('clear');
      if (previousState.status !== 'gameover' && state.status === 'gameover') {
        playEvent('gameover');
      }
    }
    previousStateRef.current = state;
  }, [playEvent, state]);

  useGameLoop(tick, delay);
  useKeyboardControls(dispatchAction, state.status);
  const highScore = useHighScore(state.score);

  return { audio, state, highScore, dispatch: dispatchAction };
};
