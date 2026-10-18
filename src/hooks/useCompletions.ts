import { useQuery } from "@tanstack/react-query";
import { parseISO } from "date-fns";
import { useAuth } from "./useAuth";
import { useTodayKey } from "./useTodayKey";
import { getTodayCompletions } from "@/lib/api";
import { Completion } from "@/types";

export function useCompletions() {
  const { user } = useAuth();
  // The day is part of the key: at local midnight useTodayKey changes, the
  // key changes, and the new (empty) day is fetched instead of showing
  // yesterday's check-ins as today's
  const todayKey = useTodayKey();
  const {
    data: completions,
    isLoading,
    error,
  } = useQuery<Completion[]>({
    queryKey: ["completions", user?.id, todayKey],
    queryFn: () => {
      if (!user) throw new Error("User not authenticated");
      // parseISO reads a date-only key as local midnight
      return getTodayCompletions(user.id, parseISO(todayKey));
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
