import { useMemo } from 'react';
import { Habit, Completion } from '@/types';
import {
  startOfDay,
  endOfDay,
  differenceInDays,
  subDays,
  parseISO,
  isWithinInterval
} from 'date-fns';
import { getHabitStreaks } from '@/lib/streaks';

// ────────────────────────────────────────────
// INDIVIDUAL HABIT STATS
// ────────────────────────────────────────────
export function useHabitStats(habit: Habit, allCompletions: Completion[]) {
  return useMemo(() => {
    // Filter completions for THIS specific habit
    const habitCompletions = allCompletions.filter(
      (c) => c.habit_id === habit.id
    );

    if (habitCompletions.length === 0) {
      return {
        completionRate: 0,
        currentStreak: 0,
        last7Days: [0, 0, 0, 0, 0, 0, 0],
        totalCompletions: 0,
      };
    }

    // 1️⃣ COMPLETION RATE (since habit creation)
    const completionRate = calculateCompletionRate(habit, habitCompletions);

    // 2️⃣ CURRENT STREAK (shared rules, see lib/streaks.ts)
    const currentStreak = getHabitStreaks(habit, habitCompletions).current;

    // 3️⃣ LAST 7 DAYS (for sparkline chart)
    const last7Days = calculateLast7Days(habitCompletions);

    return {
      completionRate,
      currentStreak,
      last7Days,
      totalCompletions: habitCompletions.length,
    };
  }, [habit, allCompletions]);
}

// ────────────────────────────────────────────
// HELPER: Calculate completion rate since creation
// ────────────────────────────────────────────
function calculateCompletionRate(habit: Habit, completions: Completion[]): number {
  const createdDate = parseISO(habit.created_at);
  const today = new Date();
  const daysSinceCreation = differenceInDays(today, createdDate) + 1;

  // Count unique days with completions
  const uniqueDays = new Set(
    completions.map((c) => startOfDay(parseISO(c.completed_at)).toISOString())
  ).size;

  const rate = (uniqueDays / daysSinceCreation) * 100;
  return Math.min(Math.round(rate), 100);
}

// ────────────────────────────────────────────
// HELPER: Get last 7 days completion counts
// ────────────────────────────────────────────
function calculateLast7Days(completions: Completion[]): number[] {
  const last7Days: number[] = [];

  for (let i = 6; i >= 0; i--) {
    const dayToCheck = subDays(new Date(), i);
    const dayStart = startOfDay(dayToCheck);
    const dayEnd = endOfDay(dayToCheck);

    const dayCount = completions.filter((c) => {
      const completionDate = parseISO(c.completed_at);
      return isWithinInterval(completionDate, { start: dayStart, end: dayEnd });
    }).length;

    last7Days.push(dayCount);
  }

  return last7Days;
}