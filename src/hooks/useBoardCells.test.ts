import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { createInitialState } from '@/game/reducer';
import { useBoardCells } from '@/hooks/useBoardCells';

describe('useBoardCells', () => {
  it('layers ghost and active pieces into a 375-cell model', () => {
    const state = {
      ...createInitialState(() => 0.5),
      status: 'playing' as const,
    };
    const { result } = renderHook(() => useBoardCells(state));

    expect(result.current).toHaveLength(375);
    expect(result.current.filter((cell) => cell.mode === 'active')).toHaveLength(4);
    expect(result.current.filter((cell) => cell.mode === 'ghost')).toHaveLength(4);
  });
});
