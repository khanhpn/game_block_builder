const LINE_POINTS: readonly number[] = [0, 100, 300, 500, 800];

export const scoreLines = (cleared: number, level: number): number =>
  (LINE_POINTS[cleared] ?? 0) * level;

export const levelForLines = (lines: number): number => Math.floor(lines / 10) + 1;

export const gravityForLevel = (level: number): number => Math.max(90, 850 - (level - 1) * 70);
