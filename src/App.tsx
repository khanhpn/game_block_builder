import { ControlsGuide } from './components/ControlsGuide';
import { GameBoard } from './components/GameBoard';
import { NextPiece } from './components/NextPiece';
import { ScorePanel } from './components/ScorePanel';
import { useTetrisGame } from './hooks/useTetrisGame';

export default function App() {
  const { state, highScore, dispatch } = useTetrisGame();
  return (
    <main className="game-shell">
      <div className="ambient ambient--one" /><div className="ambient ambient--two" />
      <ControlsGuide />
      <GameBoard state={state} dispatch={dispatch} />
      <aside className="stats-column">
        <ScorePanel state={state} highScore={highScore} />
        <NextPiece piece={state.nextPiece} />
        <div className="system-message"><span>◆</span><p><b>System online</b><small>All controls are responsive</small></p></div>
      </aside>
    </main>
  );
}
