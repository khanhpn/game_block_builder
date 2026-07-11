import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useGameAudio } from '@/hooks/useGameAudio';

describe('useGameAudio', () => {
  it('exposes safe event playback when Web Audio is unavailable', () => {
    const { result } = renderHook(() => useGameAudio());

    expect(() => result.current.playEvent('rotate')).not.toThrow();
    expect(() => result.current.playEvent('drop')).not.toThrow();
    expect(() => result.current.playEvent('clear')).not.toThrow();
    expect(() => result.current.playEvent('gameover')).not.toThrow();
  });

  it('clamps volume and toggles mute state', () => {
    const { result } = renderHook(() => useGameAudio());

    act(() => result.current.setVolume(1.4));
    expect(result.current.volume).toBe(1);
    act(() => result.current.toggleMute());
    expect(result.current.muted).toBe(true);
    act(() => result.current.setVolume(-0.2));
    expect(result.current.volume).toBe(0);
  });
});
