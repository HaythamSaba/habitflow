import { useQuery } from "@tanstack/react-query";
import { useAuth } from "./useAuth";
import { getTodayCompletions } from "@/lib/api";
import { Completion } from "@/types";

export function useCompletions() {
  const { user } = useAuth();
  // Fetch today's completions
  const {
    data: completions,
    isLoading,
    error,
  } = useQuery<Completion[]>({
    queryKey: ["completions", user?.id],
    queryFn: () => {
      if (!user) throw new Error("User not authenticated");
      return getTodayCompletions(user.id);
    },
    enabled: !!user,
  });

  const isHabitCompletedToday = (habitId: string): boolean => {
    if (!completions) return false;
    return completions.some((completion) => completion.habit_id === habitId);
  };

  const getHabitCompletionCount = (habitId: string): number => {
    if (!completions) return 0;
    return completions.filter((completion) => completion.habit_id === habitId)
      .length;
  };

  const getHabitCompletionIds = (habitId: string): string[] => {
    if (!completions) return [];
    return completions
      .filter((completion) => completion.habit_id === habitId)
      .map((completion) => completion.id);
  };

  return {
    completions,
    isLoading,
    error,
    isHabitCompletedToday,
    getHabitCompletionCount,
    getHabitCompletionIds,
  };
}
