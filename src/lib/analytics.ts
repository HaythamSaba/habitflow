import { eachDayOfInterval, format, max, parseISO, startOfDay, subDays } from "date-fns";
import { Completion, Habit } from "@/types";
import { toDayKey } from "./dates";

/**
 * Completion-rate math shared by Analytics, the Habits page and the dashboard.
 *
 * Rules:
 * - Days are the user's LOCAL calendar days (lib/dates.ts).
 * - A habit is only "expected" on days it existed: a habit created 5 days ago
 *   and done every day is at 100%, not 5/30 = 17%.
 * - Each day counts up to the habit's daily target (target_count), so extra
 *   check-ins on one day can't make up for a missed day.
 * - Every frequency uses these daily rules for now, matching lib/streaks.ts.
 *   Weekly and custom schedules aren't defined yet.
 * - The window includes today, even though today may still be in progress.
 */

export const ANALYTICS_WINDOW_DAYS = 30;

type RateHabit = Pick<Habit, "id" | "target_count" | "created_at">;
type RateCompletion = Pick<Completion, "habit_id" | "completed_at">;

export interface DailyTargetPoint {
  dayKey: string;
  /** Short label for chart axes, e.g. "Oct 05" */
  date: string;
  /** % of the day's targets met; null when no habit existed yet that day */
  rate: number | null;
  done: number;
  expected: number;
}

const targetOf = (habit: RateHabit) => Math.max(1, habit.target_count || 1);

const windowStart = (today: Date, windowDays: number) =>
  startOfDay(subDays(today, windowDays - 1));

/** Check-in counts keyed by `${habitId}|${dayKey}` */
function countByHabitDay(completions: RateCompletion[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const completion of completions) {
    const key = `${completion.habit_id}|${toDayKey(completion.completed_at)}`;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return counts;
}

/** Day keys in the window on which the habit existed (created day through today). */
function habitDaysInWindow(
  habit: RateHabit,
  today: Date,
  windowDays: number,
): string[] {
  const start = max([
    windowStart(today, windowDays),
    startOfDay(parseISO(habit.created_at)),
  ]);
  const end = startOfDay(today);
  if (start > end) return [];
  return eachDayOfInterval({ start, end }).map((day) => toDayKey(day));
}

function habitTotals(
  habit: RateHabit,
  counts: Map<string, number>,
  today: Date,
  windowDays: number,
) {
  const target = targetOf(habit);
  const days = habitDaysInWindow(habit, today, windowDays);
  const done = days.reduce(
    (sum, day) => sum + Math.min(counts.get(`${habit.id}|${day}`) ?? 0, target),
    0,
  );
  return { done, expected: days.length * target };
}

const toPercent = (done: number, expected: number) =>
  expected > 0 ? Math.round((done / expected) * 100) : 0;

/** % of the habit's daily targets met in the window (0–100). */
export function getHabitRate(
  habit: RateHabit,
  completions: RateCompletion[],
  windowDays = ANALYTICS_WINDOW_DAYS,
  today: Date = new Date(),
): number {
  const { done, expected } = habitTotals(
    habit,
    countByHabitDay(completions),
    today,
    windowDays,
  );
  return toPercent(done, expected);
}

/** % of all daily targets met in the window across habits (0–100). */
export function getAverageRate(
  habits: RateHabit[],
  completions: RateCompletion[],
  windowDays = ANALYTICS_WINDOW_DAYS,
  today: Date = new Date(),
): number {
  const counts = countByHabitDay(completions);
  let done = 0;
  let expected = 0;
  for (const habit of habits) {
    const totals = habitTotals(habit, counts, today, windowDays);
    done += totals.done;
    expected += totals.expected;
  }
  return toPercent(done, expected);
}

/** One point per day in the window: share of that day's targets that were met. */
export function getDailyTargetTrend(
  habits: RateHabit[],
  completions: RateCompletion[],
  windowDays = ANALYTICS_WINDOW_DAYS,
  today: Date = new Date(),
): DailyTargetPoint[] {
  const counts = countByHabitDay(completions);
  const days = eachDayOfInterval({
    start: windowStart(today, windowDays),
    end: startOfDay(today),
  });

  return days.map((day) => {
    const dayKey = toDayKey(day);
    let done = 0;
    let expected = 0;
    for (const habit of habits) {
      if (toDayKey(habit.created_at) > dayKey) continue; // didn't exist yet
      const target = targetOf(habit);
      expected += target;
      done += Math.min(counts.get(`${habit.id}|${dayKey}`) ?? 0, target);
    }
    return {
      dayKey,
      date: format(day, "MMM dd"),
      rate: expected > 0 ? toPercent(done, expected) : null,
      done,
      expected,
    };
  });
}

/** Number of check-ins made in the window (any habit). */
export function countCompletionsInWindow(
  completions: RateCompletion[],
  windowDays = ANALYTICS_WINDOW_DAYS,
  today: Date = new Date(),
): number {
  const startKey = toDayKey(windowStart(today, windowDays));
  const endKey = toDayKey(today);
  return completions.filter((completion) => {
    const day = toDayKey(completion.completed_at);
    return day >= startKey && day <= endKey;
  }).length;
}
