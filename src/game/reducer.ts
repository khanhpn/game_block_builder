import { clearFullRows, createBoard, getDropDistance, hasCollision, mergePiece } from './board';
import { levelForLines, scoreLines } from './scoring';
import { createBag, rotateMatrix, spawnPiece } from './tetrominoes';
import type { ActivePiece, Board, PieceType } from './types';

export type GameStatus = 'ready' | 'playing' | 'paused' | 'gameover';

export interface GameState {
  board: Board;
  activePiece: ActivePiece;
  nextPiece: PieceType;
  bag: PieceType[];
  score: number;
  lines: number;
  level: number;
  status: GameStatus;
}

export type GameAction =
  | { type: 'START' }
  | { type: 'MOVE'; dx: -1 | 1 }
  | { type: 'ROTATE' }
  | { type: 'TICK' }
  | { type: 'SOFT_DROP' }
  | { type: 'HARD_DROP' }
  | { type: 'TOGGLE_PAUSE' }
  | { type: 'RESTART' };

const takePiece = (bag: PieceType[]): { type: PieceType; bag: PieceType[] } => {
  const source = bag.length > 0 ? bag : createBag();
  return { type: source[0], bag: source.slice(1) };
};

export const createInitialState = (random = Math.random): GameState => {
  const bag = createBag(random);
  const [active, next, ...remaining] = bag;
  return {
    board: createBoard(),
    activePiece: spawnPiece(active),
    nextPiece: next,
    bag: remaining,
    score: 0,
    lines: 0,
    level: 1,
    status: 'ready',
  };
};

const lockPiece = (state: GameState, piece: ActivePiece, dropPoints = 0): GameState => {
  const merged = mergePiece(state.board, piece);
  const { board, cleared } = clearFullRows(merged);
  const lines = state.lines + cleared;
  const level = levelForLines(lines);
  const queued = takePiece(state.bag);
  const activePiece = spawnPiece(state.nextPiece);
  const status: GameStatus = hasCollision(board, activePiece) ? 'gameover' : 'playing';

  return {
    ...state,
    board,
    activePiece,
    nextPiece: queued.type,
    bag: queued.bag,
    score: state.score + dropPoints + scoreLines(cleared, state.level),
    lines,
    level,
    status,
  };
};

const stepDown = (state: GameState, reward: number): GameState => {
  const moved = { ...state.activePiece, y: state.activePiece.y + 1 };
  return hasCollision(state.board, moved)
    ? lockPiece(state, state.activePiece)
    : { ...state, activePiece: moved, score: state.score + reward };
};

export const gameReducer = (state: GameState, action: GameAction): GameState => {
  if (action.type === 'RESTART') return { ...createInitialState(), status: 'playing' };
  if (action.type === 'START' && state.status === 'ready') return { ...state, status: 'playing' };
  if (action.type === 'TOGGLE_PAUSE') {
    if (state.status === 'playing') return { ...state, status: 'paused' };
    if (state.status === 'paused') return { ...state, status: 'playing' };
    return state;
  }
  if (state.status !== 'playing') return state;

  switch (action.type) {
    case 'MOVE': {
      const moved = { ...state.activePiece, x: state.activePiece.x + action.dx };
      return hasCollision(state.board, moved) ? state : { ...state, activePiece: moved };
    }
    case 'ROTATE': {
      const matrix = rotateMatrix(state.activePiece.matrix);
      for (const offset of [0, -1, 1, -2, 2]) {
        const rotated = { ...state.activePiece, matrix, x: state.activePiece.x + offset };
        if (!hasCollision(state.board, rotated)) return { ...state, activePiece: rotated };
      }
      return state;
    }
    case 'SOFT_DROP':
      return stepDown(state, 1);
    case 'TICK':
      return stepDown(state, 0);
    case 'HARD_DROP': {
      const distance = getDropDistance(state.board, state.activePiece);
      const dropped = { ...state.activePiece, y: state.activePiece.y + distance };
      return lockPiece(state, dropped, distance * 2);
    }
    default:
      return state;
  }
};
