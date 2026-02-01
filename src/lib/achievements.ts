import { Completion } from "@/types";

/**
 * ============================================
 * ACHIEVEMENT CHECKING LOGIC
 * ============================================
 */

interface Achievement {
  id: string;
  key: string;
  name: string;
  emoji: string;
  category: string;
  condition_type: string;
  condition_value: number;
  points_reward: number;
}

/**
 * Check if a single achievement condition is met
 */
export function checkAchievementCondition(
  achievement: Achievement,
  stats: {
    totalCompletions: number;
    currentStreak: number;
    totalPoints: number;
    totalHabits: number;
    completions: Completion[];
  },
): { unlocked: boolean; progress: number } {
  const { condition_type, condition_value } = achievement;
  let currentValue = 0;

  // Determine current value based on condition type
  switch (condition_type) {
    case "total_completions":
      currentValue = stats.totalCompletions;
      break;

    case "current_streak":
      currentValue = stats.currentStreak;
      break;

    case "total_points":
      currentValue = stats.totalPoints;
      break;

    case "total_habits":
      currentValue = stats.totalHabits;
      break;

    case "early_completion":
      currentValue = checkEarlyCompletion(stats.completions) ? 1 : 0;
      break;

    case "late_completion":
      currentValue = checkLateCompletion(stats.completions) ? 1 : 0;
      break;

    case "perfect_day":
      // This needs to be calculated differently (all habits completed)
      currentValue = 0; // TODO: Implement perfect day logic
      break;

    case "speed_completion":
      // This needs timestamp analysis
      currentValue = 0; // TODO: Implement speed completion logic
      break;

    default:
      currentValue = 0;
  }

  // Calculate progress percentage
  const progress = Math.min(
    Math.round((currentValue / condition_value) * 100),
    100,
  );

  // Check if unlocked
  const unlocked = currentValue >= condition_value;

  return { unlocked, progress };
}

/**
 * Check if any completion was before 8 AM
 */
function checkEarlyCompletion(completions: Completion[]): boolean {
  return completions.some((completion) => {
    const hour = new Date(completion.completed_at).getHours();
    return hour < 8;
  });
}

/**
 * Check if any completion was after 10 PM
 */
function checkLateCompletion(completions: Completion[]): boolean {
  return completions.some((completion) => {
    const hour = new Date(completion.completed_at).getHours();
    return hour >= 22; // 10 PM = 22:00
  });
}

/**
 * Get all achievements that should be unlocked
 */
export function getAchievementsToUnlock(
  allAchievements: Achievement[],
  unlockedAchievementIds: string[],
  stats: {
    totalCompletions: number;
    currentStreak: number;
    totalPoints: number;
    totalHabits: number;
    completions: Completion[];
  },
): Achievement[] {
  const toUnlock: Achievement[] = [];

  for (const achievement of allAchievements) {
    // Skip if already unlocked
    if (unlockedAchievementIds.includes(achievement.id)) {
      continue;
    }

    // Check if condition is met
    const { unlocked } = checkAchievementCondition(achievement, stats);

    if (unlocked) {
      toUnlock.push(achievement);
    }
  }

  return toUnlock;
}

/**
 * Calculate progress for all locked achievements
 */
export function calculateAchievementProgress(
  allAchievements: Achievement[],
  unlockedAchievementIds: string[],
  stats: {
    totalCompletions: number;
    currentStreak: number;
    totalPoints: number;
    totalHabits: number;
    completions: Completion[];
  },
): Map<string, number> {
  const progressMap = new Map<string, number>();

  for (const achievement of allAchievements) {
    // Skip if already unlocked
    if (unlockedAchievementIds.includes(achievement.id)) {
      progressMap.set(achievement.id, 100);
      continue;
    }

    // Calculate progress
    const { progress } = checkAchievementCondition(achievement, stats);
    progressMap.set(achievement.id, progress);
  }

  return progressMap;
}
