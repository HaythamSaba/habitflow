import { useHabits } from "./useHabits";
import {
  startOfDay,
  subDays,
  isAfter,
  isSameDay,
  format,
} from "date-fns";
import { useAllCompletions } from "./useAllCompletions";
import { getBestStreaks } from "@/lib/streaks";

export function useAnalytics() {
  const { habits } = useHabits();
  const { completions } = useAllCompletions();

  // get the active habits and remove the archived ones
  const activeHabits = habits?.filter((h) => !h.archived);

  // ===== 1. Filter completions to last 30 days =====
  const today = startOfDay(new Date());
  const thirtyDaysAgo = subDays(today, 30);

  const completionsLast30Days =
    completions?.filter((completion) => {
      const completionDate = new Date(completion.completed_at);
      return (
        isAfter(completionDate, thirtyDaysAgo) ||
        isSameDay(completionDate, thirtyDaysAgo)
      );
    }) || [];

  // ===== 2. Total completions (last 30 days) =====
  const totalCompletions = completionsLast30Days.length;

  // ===== 3. Average completion rate =====
  const averageRate = (() => {
    if (!activeHabits || activeHabits.length === 0) return 0;

    // Expected completions = sum of (each habit's target * 30 days)
    const expectedCompletions = activeHabits.reduce((sum, habit) => {
      return sum + habit.target_count * 30;
    }, 0);

    if (expectedCompletions === 0) return 0;

    // Actual completions
    const actualCompletions = completionsLast30Days.length;

    // Calculate percentage
    const rate = (actualCompletions / expectedCompletions) * 100;
    return Math.round(rate);
  })();

  // ===== 4. Best (longest) streak across active habits =====
  // Shared rules, see lib/streaks.ts — same value as the Habits page
  const bestStreak = getBestStreaks(activeHabits, completions).longest;

  // ===== 5. Line chart data (daily completions for last 30 days) =====
  const lineChartData = (() => {
    const data = [];

    // Create array of last 30 days
    for (let i = 29; i >= 0; i--) {
      const date = subDays(today, i);

      // Count completions on this date
      const completionsOnDate = completionsLast30Days.filter((completion) => {
        const completionDate = new Date(completion.completed_at);
        return isSameDay(completionDate, date);
      });

      data.push({
        date: format(date, "MMM dd"), // "Jan 15"
        completions: completionsOnDate.length,
      });
    }

    return data;
  })();

  // ===== 6. Bar chart data (per-habit performance) =====
  const barChartData = (() => {
    if (!activeHabits) return [];

    const data = activeHabits.map((habit) => {
      // Filter completions for this habit in last 30 days
      const habitCompletions = completionsLast30Days.filter(
        (c) => c.habit_id === habit.id,
      );

      // Calculate completion rate
      const expected = habit.target_count * 30;
      const actual = habitCompletions.length;
      const rate = expected > 0 ? (actual / expected) * 100 : 0;

      return {
        name: habit.name,
        rate: Math.round(rate),
        color: habit.color,
      };
    });

    // Sort by rate descending (best performers first)
    return data.sort((a, b) => b.rate - a.rate);
  })();

  return {
    totalCompletions,
    averageRate,
    bestStreak,
    lineChartData,
    barChartData,
  };
}
