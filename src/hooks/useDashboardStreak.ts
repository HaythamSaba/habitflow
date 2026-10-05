import { useMemo } from "react";
import { useHabits } from "./useHabits";
import { useAllCompletions } from "./useAllCompletions";
import { getBestStreaks } from "@/lib/streaks";

/**
 * Highest current streak across the user's active (non-archived) habits.
 * Used by the dashboard, the analytics heatmap and achievement checks.
 */
export function useDashboardStreak() {
  const { habits, isLoading: habitsLoading } = useHabits();
  const { completions, isLoading: completionsLoading } = useAllCompletions();

  const maxStreak = useMemo(() => {
    const activeHabits = habits.filter((habit) => !habit.archived);
    return getBestStreaks(activeHabits, completions).current;
  }, [habits, completions]);

  return {
    maxStreak,
    isLoading: habitsLoading || completionsLoading,
  };
}
