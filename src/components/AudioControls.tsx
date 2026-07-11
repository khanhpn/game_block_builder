import type { ChangeEvent } from 'react';

export interface AudioControlsProps {
  muted: boolean;
  volume: number;
  onMuteToggle: () => void;
  onVolumeChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

export const AudioControls = ({
  muted,
  onMuteToggle,
  onVolumeChange,
  volume,
}: AudioControlsProps) => (
  <section className="audio-controls" aria-label="Audio controls">
    <div className="audio-controls__header">
      <span>Audio</span>
      <button
        type="button"
        onClick={onMuteToggle}
        aria-label={muted ? 'Unmute audio' : 'Mute audio'}
      >
        {muted ? 'Muted' : 'On'}
      </button>
    </div>
    <label className="audio-controls__slider">
      <span aria-hidden="true">{muted ? '◌' : '♫'}</span>
      <input
        type="range"
        min="0"
        max="100"
        step="1"
        value={Math.round(volume * 100)}
        onChange={onVolumeChange}
        aria-label="Game volume"
      />
      <output>{Math.round(volume * 100)}%</output>
    </label>
  </section>
);
