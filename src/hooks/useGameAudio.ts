import { useCallback, useRef, useState, type ChangeEvent } from 'react';

export type GameAudioEvent = 'rotate' | 'drop' | 'clear' | 'gameover';

type AudioWindow = Window & {
  webkitAudioContext?: typeof AudioContext;
};

const VOLUME_KEY = 'neon-blocks-volume';
const MUTED_KEY = 'neon-blocks-muted';

const readStoredVolume = (): number => {
  try {
    const stored = Number.parseFloat(localStorage.getItem(VOLUME_KEY) ?? '0.65');
    return Number.isFinite(stored) ? Math.min(1, Math.max(0, stored)) : 0.65;
  } catch {
    return 0.65;
  }
};

const readStoredMuted = (): boolean => {
  try {
    return localStorage.getItem(MUTED_KEY) === 'true';
  } catch {
    return false;
  }
};

export const useGameAudio = () => {
  const contextRef = useRef<AudioContext | null>(null);
  const [volume, setVolumeState] = useState(readStoredVolume);
  const [muted, setMuted] = useState(readStoredMuted);
  const volumeRef = useRef(volume);
  const mutedRef = useRef(muted);

  const getContext = useCallback((): AudioContext | null => {
    if (typeof window === 'undefined') return null;
    if (contextRef.current) return contextRef.current;

    const AudioContextConstructor =
      window.AudioContext ?? (window as AudioWindow).webkitAudioContext;
    if (!AudioContextConstructor) return null;

    const context = new AudioContextConstructor();
    contextRef.current = context;
    return context;
  }, []);

  const playEvent = useCallback(
    (event: GameAudioEvent) => {
      if (mutedRef.current || volumeRef.current === 0) return;
      const context = getContext();
      if (!context) return;
      if (context.state === 'suspended') void context.resume();

      const master = context.createGain();
      master.gain.setValueAtTime(0.0001, context.currentTime);
      master.gain.exponentialRampToValueAtTime(
        0.14 * volumeRef.current,
        context.currentTime + 0.01,
      );
      master.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.45);
      master.connect(context.destination);

      const tone = (
        frequency: number,
        start: number,
        duration: number,
        type: OscillatorType = 'sine',
        volume = 0.12,
      ) => {
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        oscillator.type = type;
        oscillator.frequency.setValueAtTime(frequency, start);
        gain.gain.setValueAtTime(volume, start);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
        oscillator.connect(gain);
        gain.connect(master);
        oscillator.start(start);
        oscillator.stop(start + duration);
      };

      const now = context.currentTime;
      if (event === 'rotate') {
        tone(520, now, 0.08, 'triangle', 0.08);
        tone(780, now + 0.06, 0.11, 'triangle', 0.07);
      } else if (event === 'drop') {
        tone(150, now, 0.18, 'square', 0.12);
        tone(75, now + 0.04, 0.22, 'sine', 0.1);
      } else if (event === 'clear') {
        tone(523, now, 0.16, 'triangle', 0.1);
        tone(659, now + 0.07, 0.18, 'triangle', 0.1);
        tone(784, now + 0.14, 0.22, 'triangle', 0.1);
        tone(1047, now + 0.21, 0.3, 'sine', 0.11);
      } else {
        master.gain.cancelScheduledValues(now);
        master.gain.setValueAtTime(0.0001, now);
        master.gain.exponentialRampToValueAtTime(0.18, now + 0.02);
        master.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);
        tone(220, now, 0.55, 'sawtooth', 0.15);
        tone(174, now + 0.3, 0.65, 'sawtooth', 0.13);
        tone(130, now + 0.65, 0.85, 'sawtooth', 0.12);
        tone(65, now + 0.98, 1.05, 'sine', 0.15);
      }
    },
    [getContext],
  );

  const setVolume = useCallback((nextVolume: number) => {
    const next = Math.min(1, Math.max(0, nextVolume));
    volumeRef.current = next;
    setVolumeState(next);
    try {
      localStorage.setItem(VOLUME_KEY, String(next));
    } catch {
      // Audio settings remain available in memory when storage is blocked.
    }
  }, []);

  const toggleMute = useCallback(() => {
    setMuted((current) => {
      const next = !current;
      mutedRef.current = next;
      try {
        localStorage.setItem(MUTED_KEY, String(next));
      } catch {
        // Audio settings remain available in memory when storage is blocked.
      }
      return next;
    });
  }, []);

  const handleVolumeChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => setVolume(Number(event.currentTarget.value) / 100),
    [setVolume],
  );

  return { handleVolumeChange, muted, playEvent, setVolume, toggleMute, volume };
};
