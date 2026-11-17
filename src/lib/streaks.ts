import { Completion, Habit } from "@/types";
import { nextDayKey, previousDayKey, toDayKey, weekStartKey } from "./dates";

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
 * - Streak freeze (audit R8): each habit gets one free freeze per Mon–Sun
 *   week. It covers a single missed day between two completed days (or
 *   yesterday, while today is still open), so the streak doesn't break. A
 *   frozen day bridges the streak but doesn't add to its length. Freezes are
 *   computed, not stored: logging the missed day late releases it, and a gap
 *   of two or more days breaks the streak without using the week's freeze.
 *   Only days from STREAK_FREEZE_START on can be frozen, so streaks earned
 *   before the feature existed don't change.
 * - Every frequency currently uses these daily rules. Weekly and custom
 *   schedules aren't defined yet; when they are, add their rules here.
 */

/** First local day a streak freeze can cover (the day R8 shipped). */
export const STREAK_FREEZE_START = "2026-11-17";

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

/**
 * Missed days covered by a streak freeze: at most one per Mon–Sun week, the
 * earliest missed day that the freeze actually bridges.
 */
export function getFrozenDayKeys(
  completedDays: Set<string>,
  today: Date = new Date(),
  freezeStart: string = STREAK_FREEZE_START,
): Set<string> {
  const todayKey = toDayKey(today);

  // A single missed day right after a completed day, followed by a
  // completed day or by today (which can still be done)
  const bridgeable: string[] = [];
  for (const doneDay of completedDays) {
    const missed = nextDayKey(doneDay);
    if (completedDays.has(missed)) continue;
    if (missed < freezeStart || missed >= todayKey) continue;

    const after = nextDayKey(missed);
    if (after === todayKey || completedDays.has(after)) bridgeable.push(missed);
  }

  const frozenDays = new Set<string>();
  const usedWeeks = new Set<string>();
  for (const day of bridgeable.sort()) {
    const week = weekStartKey(day);
    if (usedWeeks.has(week)) continue;
    usedWeeks.add(week);
    frozenDays.add(day);
  }
  return frozenDays;
}

/**
 * Consecutive completed days ending today, or yesterday if today isn't done
 * yet. Frozen days keep the run going but aren't counted.
 */
export function calculateCurrentStreak(
  completedDays: Set<string>,
  today: Date = new Date(),
  frozenDays: Set<string> = new Set(),
): number {
  const todayKey = toDayKey(today);
  let day = completedDays.has(todayKey) ? todayKey : previousDayKey(todayKey);

  let streak = 0;
  while (completedDays.has(day) || frozenDays.has(day)) {
    if (completedDays.has(day)) streak++;
    day = previousDayKey(day);
  }
  return streak;
}

/**
 * Longest run of consecutive completed days in the habit's history. Frozen
 * days keep a run going but aren't counted.
 */
export function calculateLongestStreak(
  completedDays: Set<string>,
  frozenDays: Set<string> = new Set(),
): number {
  const days = [...completedDays, ...frozenDays].sort();
  let longest = 0;
  let run = 0;

  for (let i = 0; i < days.length; i++) {
    const counts = completedDays.has(days[i]) ? 1 : 0;
    const continuesRun = i > 0 && previousDayKey(days[i]) === days[i - 1];
    run = continuesRun ? run + counts : counts;
    longest = Math.max(longest, run);
  }
  return longest;
}

/** Days covered by a streak freeze for one habit. `completions` may include other habits. */
export function getHabitFrozenDayKeys(
  habit: StreakHabit,
  completions: StreakCompletion[],
  today: Date = new Date(),
): Set<string> {
  return getFrozenDayKeys(getCompletedDayKeys(habit, completions), today);
}

/** Current and longest streak for one habit. `completions` may include other habits. */
export function getHabitStreaks(
  habit: StreakHabit,
  completions: StreakCompletion[],
  today: Date = new Date(),
  freezeStart: string = STREAK_FREEZE_START,
): HabitStreaks {
  const completedDays = getCompletedDayKeys(habit, completions);
  const frozenDays = getFrozenDayKeys(completedDays, today, freezeStart);
  return {
    current: calculateCurrentStreak(completedDays, today, frozenDays),
    longest: calculateLongestStreak(completedDays, frozenDays),
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
