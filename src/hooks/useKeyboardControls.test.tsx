import { fireEvent, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useKeyboardControls } from './useKeyboardControls';

describe('useKeyboardControls', () => {
  it('maps movement and game keys to actions', () => {
    const dispatch = vi.fn();
    renderHook(() => useKeyboardControls(dispatch, 'playing'));
    const event = new KeyboardEvent('keydown', { key: 'ArrowLeft', cancelable: true });
    window.dispatchEvent(event);
    fireEvent.keyDown(window, { key: ' ' });
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(event.defaultPrevented).toBe(true);
    expect(dispatch).toHaveBeenNthCalledWith(1, { type: 'MOVE', dx: -1 });
    expect(dispatch).toHaveBeenNthCalledWith(2, { type: 'HARD_DROP' });
    expect(dispatch).toHaveBeenNthCalledWith(3, { type: 'TOGGLE_PAUSE' });
  });

  it('starts ready games with Enter', () => {
    const dispatch = vi.fn();
    renderHook(() => useKeyboardControls(dispatch, 'ready'));
    fireEvent.keyDown(window, { key: 'Enter' });
    expect(dispatch).toHaveBeenCalledWith({ type: 'START' });
  });
});
