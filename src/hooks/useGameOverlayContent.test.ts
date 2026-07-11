import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useGameOverlayContent } from '@/hooks/useGameOverlayContent';

describe('useGameOverlayContent', () => {
  it('formats the game-over score for display', () => {
    const { result } = renderHook(() => useGameOverlayContent('gameover', 1200));
    expect(result.current?.text).toBe('Final score 1,200');
  });
});
