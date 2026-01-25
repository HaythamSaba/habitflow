import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useAuth } from "./useAuth";
import { getHabitCompletions } from "@/lib/api";
import { calculateCurrentStreak } from "@/lib/streaks";
import { Completion } from "@/types";

/**
 * Hook to get the current streak for a specific habit
 *
 * @param habitId - The habit to check
 * @returns Streak count, loading state, and completion data
 *
 * Example:
 * ```tsx
 * const { streak, isLoading } = useHabitStreak(habit.id);
 * if (streak > 0) {
 *   return <span>🔥 {streak}</span>
 * }
 * ```
 */
export function useHabitStreak(habitId: string) {
  const { user } = useAuth();

  // Fetch all completions for this habit
  const {
    data: completions,
    isLoading,
    error,
  } = useQuery<Completion[]>({
    queryKey: ["habit-completions", habitId],
    queryFn: () => {
      if (!user) throw new Error("Not authenticated");
      return getHabitCompletions(habitId, user.id);
    },
    enabled: !!user, // Only fetch if user is logged in
  });

  // Calculate streak (memoized to avoid recalculation)
  const streak = useMemo(() => {
    if (!completions || completions.length === 0) {
      return 0;
    }
    return calculateCurrentStreak(completions);
  }, [completions]);

  return {
    streak,
    isLoading,
    error,
    completions, // For debugging or other features
  };
}
