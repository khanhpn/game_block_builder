import { useMemo, type Dispatch } from 'react';
import { getDropDistance } from '../game/board';
import type { GameAction, GameState } from '../game/reducer';
import type { PieceType } from '../game/types';
import { GameOverlay } from './GameOverlay';

interface GameBoardProps {
  state: GameState;
  dispatch: Dispatch<GameAction>;
}

type DisplayCell = { type: PieceType | null; mode?: 'active' | 'ghost' };

const paintPiece = (cells: DisplayCell[][], state: GameState, mode: 'active' | 'ghost', offsetY = 0) => {
  state.activePiece.matrix.forEach((row, rowIndex) => row.forEach((value, columnIndex) => {
    if (!value) return;
    const x = state.activePiece.x + columnIndex;
    const y = state.activePiece.y + rowIndex + offsetY;
    if (y >= 0 && y < cells.length && x >= 0 && x < cells[0].length) cells[y][x] = { type: state.activePiece.type, mode };
  }));
};

export function GameBoard({ state, dispatch }: GameBoardProps) {
  const cells = useMemo(() => {
    const displayCells: DisplayCell[][] = state.board.map((row) => row.map((type) => ({ type })));
    if (state.status === 'playing') {
      paintPiece(displayCells, state, 'ghost', getDropDistance(state.board, state.activePiece));
    }
    paintPiece(displayCells, state, 'active');
    return displayCells.flat();
  }, [state]);

  return (
    <section className="board-frame" aria-label="Tetris game board">
      <div className="board-status"><span>GRID 10×20</span><span className={`status-dot status-dot--${state.status}`}>{state.status}</span></div>
      <div className="game-board" role="grid" aria-label="Playfield">
        {cells.map((cell, index) => (
          <div
            role="gridcell"
            aria-label={cell.type ? `${cell.type} block` : 'Empty'}
            className={['cell', cell.type && `piece-${cell.type.toLowerCase()}`, cell.mode && `cell--${cell.mode}`].filter(Boolean).join(' ')}
            key={index}
          />
        ))}
      </div>
      <GameOverlay status={state.status} score={state.score} dispatch={dispatch} />
    </section>
  );
}
