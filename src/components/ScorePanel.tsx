import type { GameState } from '@/game/reducer';
import { AudioControls, type AudioControlsProps } from '@/components/AudioControls';

interface ScorePanelProps {
  state: GameState;
  highScore: number;
  audio: AudioControlsProps;
}

export const ScorePanel = ({ audio, state, highScore }: ScorePanelProps) => {
  return (
    <section className="panel score-panel" aria-live="polite">
      <div className="panel-heading">
        <span>Live metrics</span>
        <span>SYNC</span>
      </div>
      <div className="primary-score">
        <small>Score</small>
        <strong>{state.score.toLocaleString().padStart(6, '0')}</strong>
      </div>
      <div className="metric-grid">
        <div>
          <small>High score</small>
          <strong>{highScore.toLocaleString()}</strong>
        </div>
        <div>
          <small>Level</small>
          <strong>{String(state.level).padStart(2, '0')}</strong>
        </div>
        <div>
          <small>Lines</small>
          <strong>{String(state.lines).padStart(2, '0')}</strong>
        </div>
        <div>
          <small>Speed</small>
          <strong>{Math.min(999, state.level * 10)}%</strong>
        </div>
      </div>
      <AudioControls
        muted={audio.muted}
        volume={audio.volume}
        onMuteToggle={audio.onMuteToggle}
        onVolumeChange={audio.onVolumeChange}
      />
    </section>
  );
};
