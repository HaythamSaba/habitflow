import { useHabits } from "./useHabits";
import {
  startOfDay,
  subDays,
  isAfter,
  isSameDay,
  format,
  differenceInCalendarDays,
} from "date-fns";
import { useAllCompletions } from "./useAllCompletions";

export function useAnalytics() {
  const { habits } = useHabits();
  const { completions } = useAllCompletions();

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
    if (!habits || habits.length === 0) return 0;

    // Expected completions = sum of (each habit's target * 30 days)
    const expectedCompletions = habits.reduce((sum, habit) => {
      return sum + habit.target_count * 30;
    }, 0);

    if (expectedCompletions === 0) return 0;

    // Actual completions
    const actualCompletions = completionsLast30Days.length;

    // Calculate percentage
    const rate = (actualCompletions / expectedCompletions) * 100;
    return Math.round(rate);
  })();

  // ===== 4. Best streak across all habits =====
  const bestStreak = (() => {
    if (!habits || !completions) return 0;

    let maxStreak = 0;

    habits.forEach((habit) => {
      // Get all completions for this habit
      const habitCompletions = completions.filter(
        (c) => c.habit_id === habit.id,
      );

      if (habitCompletions.length === 0) return;

      // Extract unique dates and sort them
      const uniqueDates = Array.from(
        new Set(
          habitCompletions.map((c) =>
            format(new Date(c.completed_at), "yyyy-MM-dd"),
          ),
        ),
      ).sort();

      // Calculate streak
      let currentStreak = 0;
      let longestStreak = 0;
      let previousDate: Date | null = null;

      uniqueDates.forEach((dateStr) => {
        const currentDate = new Date(dateStr);

        if (previousDate === null) {
          currentStreak = 1;
        } else {
          const daysDiff = differenceInCalendarDays(currentDate, previousDate);

          if (daysDiff === 1) {
            currentStreak += 1;
          } else {
            currentStreak = 1;
          }
        }

        if (currentStreak > longestStreak) {
          longestStreak = currentStreak;
        }

        previousDate = currentDate;
      });

      if (longestStreak > maxStreak) {
        maxStreak = longestStreak;
      }
    });

    return maxStreak;
  })();

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
    if (!habits) return [];

    const data = habits.map((habit) => {
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
