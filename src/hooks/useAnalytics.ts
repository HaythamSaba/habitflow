import { useMemo } from "react";
import { useHabits } from "./useHabits";
import { useAllCompletions } from "./useAllCompletions";
import { getBestStreaks } from "@/lib/streaks";
import {
  ANALYTICS_WINDOW_DAYS,
  countCompletionsInWindow,
  getAverageRate,
  getDailyTargetTrend,
  getHabitRate,
} from "@/lib/analytics";
import { Completion, Habit } from "@/types";

// Per-habit completion rate for the bar charts, best performers first
function habitPerformance(
  habits: Habit[],
  completions: Completion[],
  windowDays: number,
) {
  return habits
    .map((habit) => ({
      name: habit.name,
      rate: getHabitRate(habit, completions, windowDays),
      color: habit.color,
    }))
    .sort((a, b) => b.rate - a.rate);
}

/** Analytics for active habits. Rate rules live in lib/analytics.ts. */
export function useAnalytics() {
  const { habits } = useHabits();
  const { completions } = useAllCompletions();

  return useMemo(() => {
    const activeHabits = habits.filter((h) => !h.archived);

    return {
      // Check-ins in the last 30 days
      totalCompletions: countCompletionsInWindow(completions),
      // % of daily targets met in the last 30 days (since creation if newer)
      averageRate: getAverageRate(activeHabits, completions),
      // Shared rules, see lib/streaks.ts — same value as the Habits page
      bestStreak: getBestStreaks(activeHabits, completions).longest,
      // Daily % of targets met, last 30 days
      lineChartData: getDailyTargetTrend(activeHabits, completions),
      // Per-habit rate, last 30 days (Analytics) and last 7 days (dashboard)
      barChartData: habitPerformance(
        activeHabits,
        completions,
        ANALYTICS_WINDOW_DAYS,
      ),
      weeklyBarChartData: habitPerformance(activeHabits, completions, 7),
    };
  }, [habits, completions]);
}
