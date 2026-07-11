import { useCallback, useRef, useState, type ChangeEvent } from 'react';

export type GameAudioEvent = 'rotate' | 'drop' | 'clear' | 'gameover';

type AudioWindow = Window & {
  webkitAudioContext?: typeof AudioContext;
};

const VOLUME_KEY = 'neon-blocks-volume';
const MUTED_KEY = 'neon-blocks-muted';

type FallbackNote = {
  duration: number;
  frequency: number;
  start: number;
  waveform: OscillatorType;
};

const FALLBACK_NOTES: Record<GameAudioEvent, FallbackNote[]> = {
  rotate: [
    { frequency: 520, start: 0, duration: 0.08, waveform: 'triangle' },
    { frequency: 780, start: 0.06, duration: 0.11, waveform: 'triangle' },
  ],
  drop: [
    { frequency: 150, start: 0, duration: 0.18, waveform: 'square' },
    { frequency: 75, start: 0.04, duration: 0.22, waveform: 'sine' },
  ],
  clear: [
    { frequency: 523, start: 0, duration: 0.16, waveform: 'triangle' },
    { frequency: 659, start: 0.07, duration: 0.18, waveform: 'triangle' },
    { frequency: 784, start: 0.14, duration: 0.22, waveform: 'triangle' },
    { frequency: 1047, start: 0.21, duration: 0.3, waveform: 'sine' },
  ],
  gameover: [
    { frequency: 220, start: 0, duration: 0.55, waveform: 'sawtooth' },
    { frequency: 174, start: 0.3, duration: 0.65, waveform: 'sawtooth' },
    { frequency: 130, start: 0.65, duration: 0.85, waveform: 'sawtooth' },
    { frequency: 65, start: 0.98, duration: 1.05, waveform: 'sine' },
  ],
};

const createFallbackWav = (event: GameAudioEvent): string => {
  const sampleRate = 22050;
  const notes = FALLBACK_NOTES[event];
  const duration = Math.max(...notes.map((note) => note.start + note.duration)) + 0.04;
  const sampleCount = Math.ceil(sampleRate * duration);
  const buffer = new ArrayBuffer(44 + sampleCount * 2);
  const view = new DataView(buffer);
  const writeText = (offset: number, text: string) =>
    [...text].forEach((character, index) => view.setUint8(offset + index, character.charCodeAt(0)));
  writeText(0, 'RIFF');
  view.setUint32(4, 36 + sampleCount * 2, true);
  writeText(8, 'WAVEfmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeText(36, 'data');
  view.setUint32(40, sampleCount * 2, true);

  for (let index = 0; index < sampleCount; index += 1) {
    const time = index / sampleRate;
    const sample = notes.reduce((total, note) => {
      const elapsed = time - note.start;
      if (elapsed < 0 || elapsed > note.duration) return total;
      const phase = elapsed * note.frequency * Math.PI * 2;
      const wave =
        note.waveform === 'square'
          ? Math.sign(Math.sin(phase))
          : note.waveform === 'sawtooth'
            ? 2 * ((elapsed * note.frequency) % 1) - 1
            : note.waveform === 'triangle'
              ? 2 * Math.abs(2 * ((elapsed * note.frequency) % 1) - 1) - 1
              : Math.sin(phase);
      const envelope = Math.min(1, elapsed * 35) * Math.max(0, 1 - elapsed / note.duration);
      return total + wave * envelope * 0.18;
    }, 0);
    view.setInt16(44 + index * 2, Math.max(-1, Math.min(1, sample)) * 32767, true);
  }

  let binary = '';
  const bytes = new Uint8Array(buffer);
  for (let index = 0; index < bytes.length; index += 8192) {
    binary += String.fromCharCode(...bytes.subarray(index, index + 8192));
  }
  return `data:audio/wav;base64,${btoa(binary)}`;
};

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
  const fallbackUrlsRef = useRef(new Map<GameAudioEvent, string>());

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
      if (!context) {
        if (typeof Audio === 'undefined') return;
        const url = fallbackUrlsRef.current.get(event) ?? createFallbackWav(event);
        fallbackUrlsRef.current.set(event, url);
        const audio = new Audio(url);
        audio.volume = volumeRef.current;
        const playback = audio.play();
        if (playback) void playback.catch(() => undefined);
        return;
      }

      const schedule = () => {
        if (mutedRef.current || volumeRef.current === 0) return;

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
      };

      if (context.state === 'suspended') {
        void context
          .resume()
          .then(schedule)
          .catch(() => undefined);
      } else {
        schedule();
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
