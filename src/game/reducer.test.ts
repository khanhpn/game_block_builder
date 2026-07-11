import { describe, expect, it } from 'vitest';
import { createInitialState, gameReducer } from './reducer';

describe('game reducer', () => {
  it('starts, pauses, resumes, and restarts a game', () => {
    const ready = createInitialState(() => 0.5);
    const playing = gameReducer(ready, { type: 'START' });
    expect(playing.status).toBe('playing');
    const paused = gameReducer(playing, { type: 'TOGGLE_PAUSE' });
    expect(paused.status).toBe('paused');
    expect(gameReducer(paused, { type: 'TOGGLE_PAUSE' }).status).toBe('playing');
    expect(gameReducer({ ...playing, score: 800 }, { type: 'RESTART' }).score).toBe(0);
  });

  it('moves and rotates only while playing', () => {
    const ready = createInitialState(() => 0.5);
    expect(gameReducer(ready, { type: 'MOVE', dx: -1 })).toBe(ready);
    const playing = gameReducer(ready, { type: 'START' });
    expect(gameReducer(playing, { type: 'MOVE', dx: -1 }).activePiece.x).toBe(playing.activePiece.x - 1);
    expect(gameReducer(playing, { type: 'ROTATE' }).activePiece.matrix).not.toEqual(playing.activePiece.matrix);
  });

  it('awards hard-drop points and locks the piece', () => {
    const playing = gameReducer(createInitialState(() => 0.5), { type: 'START' });
    const dropped = gameReducer(playing, { type: 'HARD_DROP' });
    expect(dropped.score).toBeGreaterThan(0);
    expect(dropped.board.flat().filter(Boolean)).toHaveLength(4);
    expect(dropped.activePiece.type).toBe(playing.nextPiece);
  });

  it('moves down on tick and awards a soft-drop point', () => {
    const playing = gameReducer(createInitialState(() => 0.5), { type: 'START' });
    expect(gameReducer(playing, { type: 'TICK' }).activePiece.y).toBe(playing.activePiece.y + 1);
    expect(gameReducer(playing, { type: 'SOFT_DROP' }).score).toBe(1);
  });
});
