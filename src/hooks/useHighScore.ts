import { useEffect, useState } from 'react';

const STORAGE_KEY = 'neon-blocks-high-score';

const readHighScore = (): number => {
  try {
    const value = Number.parseInt(localStorage.getItem(STORAGE_KEY) ?? '0', 10);
    return Number.isFinite(value) ? value : 0;
  } catch {
    return 0;
  }
};

export function useHighScore(score: number): number {
  const [highScore, setHighScore] = useState(() => Math.max(readHighScore(), score));

  useEffect(() => {
    if (score <= highScore) return;
    setHighScore(score);
    try {
      localStorage.setItem(STORAGE_KEY, String(score));
    } catch {
      // Storage is optional; the in-memory score remains available.
    }
  }, [score, highScore]);

  return Math.max(highScore, score);
}
