export const POINTS_PER_COMPLETION = 10;

export interface LevelData {
  level: number;
  /** Points needed to reach this level */
  minPoints: number;
  label: string;
  emoji: string;
  /** Accent color (level badge, level card stripe) */
  color: string;
}

/**
 * Level tiers. Levels 1–4 keep their original thresholds so no existing
 * user is demoted; from there each step needs ~1.4–1.6× the previous gap,
 * so progression lasts about a year of daily check-ins with 3 habits
 * (11,500 pts ≈ 1,150 check-ins) instead of topping out after ~100.
 */
export const LEVELS: LevelData[] = [
  { level: 1, minPoints: 0, label: "Beginner", emoji: "🌱", color: "#ebd11a" },
  { level: 2, minPoints: 100, label: "Novice", emoji: "⭐", color: "#3b82f6" },
  { level: 3, minPoints: 300, label: "Intermediate", emoji: "🔥", color: "#f59e0b" },
  { level: 4, minPoints: 600, label: "Advanced", emoji: "💪", color: "#8b5cf6" },
  { level: 5, minPoints: 1000, label: "Dedicated", emoji: "🎯", color: "#10b981" },
  { level: 6, minPoints: 1600, label: "Expert", emoji: "🚀", color: "#06b6d4" },
  { level: 7, minPoints: 2500, label: "Elite", emoji: "💎", color: "#14b8a6" },
  { level: 8, minPoints: 3800, label: "Master", emoji: "🏆", color: "#ef4444" },
  { level: 9, minPoints: 5600, label: "Grandmaster", emoji: "👑", color: "#d97706" },
  { level: 10, minPoints: 8000, label: "Legend", emoji: "🌟", color: "#ec4899" },
  { level: 11, minPoints: 11500, label: "Mythic", emoji: "🔮", color: "#7c3aed" },
];

/** Highest level whose threshold the points have reached. */
export function getLevelDataFromPoints(points: number): LevelData {
  let current = LEVELS[0];
  for (const levelData of LEVELS) {
    if (points >= levelData.minPoints) current = levelData;
  }
  return current;
}

export function calculateLevel(points: number): number {
  return getLevelDataFromPoints(points).level;
}

export function getLevelData(level: number): LevelData {
  return LEVELS.find((l) => l.level === level) || LEVELS[0];
}

/** Points still needed for the next level; 0 at the max level. */
export function getPointsToNextLevel(currentPoints: number): number {
  const next = LEVELS.find((l) => l.minPoints > currentPoints);
  return next ? next.minPoints - currentPoints : 0;
}

/** Progress through the current level, 0–100 (100 at the max level). */
export function getLevelProgress(currentPoints: number): number {
  const current = getLevelDataFromPoints(currentPoints);
  const next = LEVELS.find((l) => l.level === current.level + 1);
  if (!next) return 100;

  const earned = currentPoints - current.minPoints;
  const needed = next.minPoints - current.minPoints;
  // Clamped: points can dip below 0 if a points update ever drifts
  return Math.min(100, Math.max(0, Math.round((earned / needed) * 100)));
}
