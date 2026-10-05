import { useMemo } from "react";
import { useAllCompletions } from "./useAllCompletions";
import { getHabitStreaks } from "@/lib/streaks";
import { Habit } from "@/types";

/**
 * Current and longest streak for one habit.
 *
 * Reads the shared all-completions query (refetched after every check-in),
 * so card badges always agree with the dashboard and analytics streaks.
 *
 * Example:
 * ```tsx
 * const { currentStreak, longestStreak, isLoading } = useHabitStreak(habit);
 * // currentStreak: 5 (active now)
 * // longestStreak: 12 (personal best)
 * ```
 */
export function useHabitStreak(habit: Pick<Habit, "id" | "target_count">) {
  const { completions, isLoading, error } = useAllCompletions();

  const { current, longest } = useMemo(
    () => getHabitStreaks(habit, completions),
    [habit, completions],
  );

  return {
    currentStreak: current,
    longestStreak: longest,
    isLoading,
    error,
  };
}
