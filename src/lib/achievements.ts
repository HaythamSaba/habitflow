import { Completion, Habit } from "@/types";

const SPEED_COMPLETION_WINDOW_MS = 5 * 60 * 1000; // 5 minutes

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
    habits: Habit[];
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
      currentValue = checkPerfectDay(stats.completions, stats.totalHabits)
        ? 1
        : 0;
      break;

    case "speed_completion":
      currentValue = checkSpeedCompletion(stats.completions, stats.habits)
        ? 1
        : 0;
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
 * Check if every active habit was completed at least once on the same day
 */
function checkPerfectDay(completions: Completion[], totalHabits: number): boolean {
  if (totalHabits === 0) return false;

  const habitIdsByDay = new Map<string, Set<string>>();
  for (const completion of completions) {
    const day = completion.completed_at.split("T")[0];
    if (!habitIdsByDay.has(day)) {
      habitIdsByDay.set(day, new Set());
    }
    habitIdsByDay.get(day)!.add(completion.habit_id);
  }

  return [...habitIdsByDay.values()].some((ids) => ids.size >= totalHabits);
}

/**
 * Check if any habit was first completed within minutes of being created
 */
function checkSpeedCompletion(completions: Completion[], habits: Habit[]): boolean {
  const firstCompletionAtByHabit = new Map<string, number>();
  for (const completion of completions) {
    const completedAt = new Date(completion.completed_at).getTime();
    const existing = firstCompletionAtByHabit.get(completion.habit_id);
    if (existing === undefined || completedAt < existing) {
      firstCompletionAtByHabit.set(completion.habit_id, completedAt);
    }
  }

  return habits.some((habit) => {
    const firstCompletedAt = firstCompletionAtByHabit.get(habit.id);
    if (firstCompletedAt === undefined) return false;
    const createdAt = new Date(habit.created_at).getTime();
    return firstCompletedAt - createdAt <= SPEED_COMPLETION_WINDOW_MS;
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
    habits: Habit[];
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
    habits: Habit[];
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
