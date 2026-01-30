export const POINTS_PER_COMPLETION = 10;

export const LEVELS = [
  {
    level: 1,
    minPoints: 0,
    maxPoints: 99,
    label: "Beginner",
    emoji: "🌱",
    color: "#10b981",
  },
  {
    level: 2,
    minPoints: 100,
    maxPoints: 299,
    label: "Novice",
    emoji: "⭐",
    color: "#3b82f6",
  },
  {
    level: 3,
    minPoints: 300,
    maxPoints: 599,
    label: "Intermediate",
    emoji: "🔥",
    color: "#f59e0b",
  },
  {
    level: 4,
    minPoints: 600,
    maxPoints: 999,
    label: "Advanced",
    emoji: "💪",
    color: "#8b5cf6",
  },
  {
    level: 5,
    minPoints: 1000,
    maxPoints: Infinity,
    label: "Master",
    emoji: "🏆",
    color: "#ef4444",
  },
];

export function calculateLevel(points: number): number {
  for (const levelData of LEVELS) {
    if (points >= levelData.minPoints && points <= levelData.maxPoints) {
      return levelData.level;
    }
  }
  return 1;
}

export function getLevelData(level: number) {
  return LEVELS.find((l) => l.level === level) || LEVELS[0];
}

export function getLevelDataFromPoints(points: number) {
  const level = calculateLevel(points);
  return getLevelData(level);
}

export function getPointsToNextLevel(currentPoints: number): number {
  const currentLevel = calculateLevel(currentPoints);
  const nextLevelData = LEVELS.find((l) => l.level === currentLevel + 1);

  if (!nextLevelData) {
    return 0;
  }
  return nextLevelData.minPoints - currentPoints;
}

export function getLevelProgress(currentPoints: number): number {
  const currentLevelData = getLevelDataFromPoints(currentPoints);
  const nextLevelData = LEVELS.find(
    (l) => l.level === currentLevelData.level + 1,
  );

  if (!nextLevelData) {
    return 100;
  }

  const pointsInCurrentLevel = currentPoints - currentLevelData.minPoints;
  const pointsNeededForLevel =
    nextLevelData.minPoints - currentLevelData.minPoints;

  return Math.round((pointsInCurrentLevel / pointsNeededForLevel) * 100);
}
