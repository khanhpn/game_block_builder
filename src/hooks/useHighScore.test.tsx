import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useHighScore } from '@/hooks/useHighScore';

describe('useHighScore', () => {
  beforeEach(() => localStorage.clear());

  it('persists the greatest score', () => {
    localStorage.setItem('neon-blocks-high-score', '80');
    const { result, rerender } = renderHook(({ score }) => useHighScore(score), { initialProps: { score: 20 } });
    expect(result.current).toBe(80);
    act(() => rerender({ score: 120 }));
    expect(result.current).toBe(120);
    expect(localStorage.getItem('neon-blocks-high-score')).toBe('120');
  });

  it('keeps working when storage access fails', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementationOnce(() => { throw new Error('blocked'); });
    expect(renderHook(() => useHighScore(12)).result.current).toBe(12);
  });
});
