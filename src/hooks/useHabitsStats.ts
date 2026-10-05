import { useMemo } from "react";
import { Habit, Completion } from "@/types";
import { subDays, parseISO } from "date-fns";
import { getBestStreaks } from "@/lib/streaks";

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

    // Calculate average completion rate (last 30 days)
    const avgCompletionRate = calculateAvgCompletionRate(
      activeHabits,
      completions,
    );

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

// Calculate average completion rate for last 30 days
function calculateAvgCompletionRate(
  habits: Habit[],
  completions: Completion[],
): number {
  if (habits.length === 0) return 0;

  const today = new Date();
  const thirtyDaysAgo = subDays(today, 30);

  // Filter completions to last 30 days
  const recentCompletions = completions.filter((completion) => {
    const completionDate = parseISO(completion.completed_at);
    return completionDate >= thirtyDaysAgo && completionDate <= today;
  });

  // Calculate expected completions for last 30 days
  let expectedCompletions = 0;
  habits.forEach((habit) => {
    if (habit.frequency === "daily") {
      expectedCompletions += 30 * habit.target_count;
    } else if (habit.frequency === "weekly") {
      // ~4.3 weeks in 30 days
      expectedCompletions += Math.floor(4.3 * habit.target_count);
    }
    // For custom, we'll treat it as daily for now
    else {
      expectedCompletions += 30 * habit.target_count;
    }
  });

  if (expectedCompletions === 0) return 0;

  // Calculate completion rate
  const actualCompletions = recentCompletions.length;
  const rate = (actualCompletions / expectedCompletions) * 100;

  return Math.min(Math.round(rate), 100); // Cap at 100%
}
