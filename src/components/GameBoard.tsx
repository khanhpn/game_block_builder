import type { Dispatch } from 'react';
import type { GameAction, GameState } from '@/game/reducer';
import { GameOverlay } from '@/components/GameOverlay';
import { useBoardCells } from '@/hooks/useBoardCells';

interface GameBoardProps {
  state: GameState;
  dispatch: Dispatch<GameAction>;
}

export const GameBoard = ({ state, dispatch }: GameBoardProps) => {
  const cells = useBoardCells(state);

  return (
    <section className="board-frame" aria-label="Tetris game board">
      <div className="board-status">
        <span>GRID 10×20</span>
        <span className={`status-dot status-dot--${state.status}`}>{state.status}</span>
      </div>
      <div className="game-board" role="grid" aria-label="Playfield">
        {cells.map((cell, index) => (
          <div
            role="gridcell"
            aria-label={cell.type ? `${cell.type} block` : 'Empty'}
            className={[
              'cell',
              cell.type && `piece-${cell.type.toLowerCase()}`,
              cell.mode && `cell--${cell.mode}`,
            ]
              .filter(Boolean)
              .join(' ')}
            key={index}
          />
        ))}
      </div>
      <GameOverlay status={state.status} score={state.score} dispatch={dispatch} />
    </section>
  );
};
