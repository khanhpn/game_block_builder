import { useCallback, useReducer } from 'react';
import { gameReducer, createInitialState } from '@/game/reducer';
import { gravityForLevel } from '@/game/scoring';
import { useGameLoop } from '@/hooks/useGameLoop';
import { useHighScore } from '@/hooks/useHighScore';
import { useKeyboardControls } from '@/hooks/useKeyboardControls';

export const useTetrisGame = () => {
  const [state, dispatch] = useReducer(gameReducer, undefined, createInitialState);
  const tick = useCallback(() => dispatch({ type: 'TICK' }), []);
  const delay = state.status === 'playing' ? gravityForLevel(state.level) : null;

  useGameLoop(tick, delay);
  useKeyboardControls(dispatch, state.status);
  const highScore = useHighScore(state.score);

  return { state, highScore, dispatch };
};
