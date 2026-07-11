import { useEffect, useRef } from 'react';

export function useGameLoop(callback: () => void, delay: number | null): void {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) return undefined;
    const timer = window.setInterval(() => callbackRef.current(), delay);
    return () => window.clearInterval(timer);
  }, [delay]);
}
