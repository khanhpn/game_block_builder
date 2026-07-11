import { renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useGameLoop } from '@/hooks/useGameLoop';

describe('useGameLoop', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('ticks at the requested delay and stops when disabled', () => {
    const onTick = vi.fn();
    const { rerender } = renderHook(({ delay }) => useGameLoop(onTick, delay), { initialProps: { delay: 500 as number | null } });
    vi.advanceTimersByTime(1000);
    expect(onTick).toHaveBeenCalledTimes(2);
    rerender({ delay: null });
    vi.advanceTimersByTime(1000);
    expect(onTick).toHaveBeenCalledTimes(2);
  });
});
