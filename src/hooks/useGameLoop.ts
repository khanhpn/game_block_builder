import { useCallback, useEffect, useRef } from 'react';

export function useGameLoop(callback: () => void, delay: number | null): void {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const runTick = useCallback(() => callbackRef.current(), []);

  useEffect(() => {
    if (delay === null) return undefined;
    const timer = window.setInterval(runTick, delay);
    return () => window.clearInterval(timer);
  }, [delay, runTick]);
}
