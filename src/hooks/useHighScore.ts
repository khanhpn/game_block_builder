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

export const useHighScore = (score: number): number => {
  const [highScore, setHighScore] = useState(() => Math.max(readHighScore(), score));
  if (score > highScore) setHighScore(score);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, String(highScore));
    } catch {
      // Storage is optional; the in-memory score remains available.
    }
  }, [highScore]);

  return highScore;
};
