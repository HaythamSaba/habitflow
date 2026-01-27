import { useMemo } from "react";
import { useHabits } from "./useHabits";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "./useAuth";
import { supabase } from "@/lib/supabase";
import { calculateCurrentStreak } from "@/lib/streaks";
import { Completion } from "@/types";

/**
 * Hook to get the highest active streak across all habits
 * Fetches all completions and calculates max streak
 */
export function useDashboardStreak() {
  const { user } = useAuth();
  const { habits, isLoading: habitsLoading } = useHabits();

  // Fetch ALL completions for current user
  const { data: allCompletions, isLoading: completionsLoading } = useQuery<
    Completion[]
  >({
    queryKey: ["all-completions", user?.id],
    queryFn: async () => {
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("completions")
        .select("*")
        .eq("user_id", user.id)
        .order("completed_at", { ascending: false });

      if (error) throw new Error(error.message);
      return data || [];
    },
    enabled: !!user,
  });

  // Calculate max streak from all habits
  const maxStreak = useMemo(() => {
    if (!habits || !allCompletions || habits.length === 0) {
      return 0;
    }

    let max = 0;

    // For each habit, calculate its current streak
    for (const habit of habits) {
      // Filter completions for this specific habit
      const habitCompletions = allCompletions.filter(
        (c) => c.habit_id === habit.id,
      );

      // Calculate current streak for this habit
      const streak = calculateCurrentStreak(habitCompletions);

      // Track the maximum
      if (streak > max) {
        max = streak;
      }
    }

    return max;
  }, [habits, allCompletions]);

  return {
    maxStreak,
    isLoading: habitsLoading || completionsLoading,
  };
}
