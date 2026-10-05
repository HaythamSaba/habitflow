import { Completion, Habit } from "@/types";
import { previousDayKey, toDayKey } from "./dates";

/**
 * The single source of truth for streaks. Every screen (dashboard, habit
 * cards, habits page, analytics, achievements) must use these functions so
 * the same habit always shows the same streak.
 *
 * Rules:
 * - A day is the user's LOCAL calendar day (see lib/dates.ts).
 * - A day counts only when the habit's daily target was met
 *   (e.g. 3 check-ins for a "3x per day" habit). Partial days don't count.
 * - The current streak is still alive if today isn't done yet: it counts
 *   back from today when today is complete, otherwise from yesterday.
 * - Every frequency currently uses these daily rules. Weekly and custom
 *   schedules aren't defined yet; when they are, add their rules here.
 */

type StreakHabit = Pick<Habit, "id" | "target_count">;
type StreakCompletion = Pick<Completion, "habit_id" | "completed_at">;

export interface HabitStreaks {
  current: number;
  longest: number;
}

/** Local day keys on which this habit's daily target was met. */
export function getCompletedDayKeys(
  habit: StreakHabit,
  completions: StreakCompletion[],
): Set<string> {
  const target = Math.max(1, habit.target_count || 1);
  const countsByDay = new Map<string, number>();

  for (const completion of completions) {
    if (completion.habit_id !== habit.id) continue;
    const day = toDayKey(completion.completed_at);
    countsByDay.set(day, (countsByDay.get(day) ?? 0) + 1);
  }

  const completedDays = new Set<string>();
  for (const [day, count] of countsByDay) {
    if (count >= target) completedDays.add(day);
  }
  return completedDays;
}

/** Consecutive completed days ending today, or yesterday if today isn't done yet. */
export function calculateCurrentStreak(
  completedDays: Set<string>,
  today: Date = new Date(),
): number {
  const todayKey = toDayKey(today);
  let day = completedDays.has(todayKey) ? todayKey : previousDayKey(todayKey);

  let streak = 0;
  while (completedDays.has(day)) {
    streak++;
    day = previousDayKey(day);
  }
  return streak;
}

/** Longest run of consecutive completed days in the habit's history. */
export function calculateLongestStreak(completedDays: Set<string>): number {
  const days = [...completedDays].sort();
  let longest = 0;
  let run = 0;

  for (let i = 0; i < days.length; i++) {
    run = i > 0 && previousDayKey(days[i]) === days[i - 1] ? run + 1 : 1;
    longest = Math.max(longest, run);
  }
  return longest;
}

/** Current and longest streak for one habit. `completions` may include other habits. */
export function getHabitStreaks(
  habit: StreakHabit,
  completions: StreakCompletion[],
  today: Date = new Date(),
): HabitStreaks {
  const completedDays = getCompletedDayKeys(habit, completions);
  return {
    current: calculateCurrentStreak(completedDays, today),
    longest: calculateLongestStreak(completedDays),
  };
}

/** Highest current streak and highest longest streak across several habits. */
export function getBestStreaks(
  habits: StreakHabit[],
  completions: StreakCompletion[],
  today: Date = new Date(),
): HabitStreaks {
  let current = 0;
  let longest = 0;
  for (const habit of habits) {
    const streaks = getHabitStreaks(habit, completions, today);
    current = Math.max(current, streaks.current);
    longest = Math.max(longest, streaks.longest);
  }
  return { current, longest };
}
