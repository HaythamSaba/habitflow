import { useMemo } from "react";
import { Habit, Completion } from "@/types";
import { getBestStreaks } from "@/lib/streaks";
import { getAverageRate } from "@/lib/analytics";

interface HabitsStats {
  totalHabits: number;
  activeHabits: number;
  archivedHabits: number;
  avgCompletionRate: number;
  longestStreak: number;
}

export function useHabitsStats(
  habits: Habit[],
  completions: Completion[],
): HabitsStats {
  return useMemo(() => {
    const activeHabits = habits.filter((h) => !h.archived);
    const archivedHabits = habits.filter((h) => h.archived);

    // % of daily targets met, last 30 days (shared rules, see lib/analytics.ts)
    // — same value as Analytics "Avg Rate"
    const avgCompletionRate = getAverageRate(activeHabits, completions);

    // Longest streak across active habits (shared rules, see lib/streaks.ts)
    const longestStreak = getBestStreaks(activeHabits, completions).longest;

    return {
      totalHabits: habits.length,
      activeHabits: activeHabits.length,
      archivedHabits: archivedHabits.length,
      avgCompletionRate,
      longestStreak,
    };
  }, [habits, completions]);
}
