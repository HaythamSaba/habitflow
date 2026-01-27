import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useAuth } from "./useAuth";
import { getHabitCompletions } from "@/lib/api";
import { calculateCurrentStreak, calculateLongestStreak } from "@/lib/streaks";
import { Completion } from "@/types";

/**
 * Hook to get streak data for a specific habit
 * 
 * @param habitId - The habit to check
 * @returns Current streak, longest streak, loading state, and completion data
 * 
 * Example:
 * ```tsx
 * const { currentStreak, longestStreak, isLoading } = useHabitStreak(habit.id);
 * // currentStreak: 5 (active now)
 * // longestStreak: 12 (personal best)
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
    enabled: !!user,
  });

  // Calculate current streak (active: today or yesterday)
  const currentStreak = useMemo(() => {
    if (!completions || completions.length === 0) {
      return 0;
    }
    return calculateCurrentStreak(completions);
  }, [completions]);

  // Calculate longest streak (personal best)
  const longestStreak = useMemo(() => {
    if (!completions || completions.length === 0) {
      return 0;
    }
    return calculateLongestStreak(completions);
  }, [completions]);

  return {
    currentStreak,
    longestStreak,
    isLoading,
    error,
    completions,
  };
}