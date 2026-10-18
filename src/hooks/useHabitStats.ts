import { useMemo } from 'react';
import { format, subDays } from 'date-fns';
import { Habit, Completion } from '@/types';
import { getHabitStreaks } from '@/lib/streaks';
import { getHabitRate } from '@/lib/analytics';
import { toDayKey } from '@/lib/dates';

export interface SparklineDay {
  /** Local day key, e.g. "2026-10-18" */
  dayKey: string;
  /** One-letter weekday for the axis, e.g. "M" */
  label: string;
  /** Full date for tooltips, e.g. "Sat, Oct 18" */
  fullLabel: string;
  count: number;
  isToday: boolean;
}

// ────────────────────────────────────────────
// INDIVIDUAL HABIT STATS
// ────────────────────────────────────────────
export function useHabitStats(habit: Habit, allCompletions: Completion[]) {
  return useMemo(() => {
    // Filter completions for THIS specific habit
    const habitCompletions = allCompletions.filter(
      (c) => c.habit_id === habit.id
    );

    return {
      // Shared rules, see lib/analytics.ts: % of daily targets met in the
      // last 30 days (or since creation) — same number as Analytics
      completionRate: getHabitRate(habit, habitCompletions),
      // Shared rules, see lib/streaks.ts
      currentStreak: getHabitStreaks(habit, habitCompletions).current,
      last7Days: getLast7Days(habitCompletions),
      totalCompletions: habitCompletions.length,
    };
  }, [habit, allCompletions]);
}

// ────────────────────────────────────────────
// HELPER: Check-ins per local day, oldest first, ending today
// ────────────────────────────────────────────
function getLast7Days(completions: Completion[]): SparklineDay[] {
  const counts = new Map<string, number>();
  for (const completion of completions) {
    const day = toDayKey(completion.completed_at);
    counts.set(day, (counts.get(day) ?? 0) + 1);
  }

  const today = new Date();
  return Array.from({ length: 7 }, (_, i) => {
    const day = subDays(today, 6 - i);
    const dayKey = toDayKey(day);
    return {
      dayKey,
      label: format(day, 'EEEEE'),
      fullLabel: format(day, 'EEE, MMM d'),
      count: counts.get(dayKey) ?? 0,
      isToday: i === 6,
    };
  });
}
