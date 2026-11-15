import { Habit } from "@/types";
import { previousDayKey, toDayKey, yesterdayCheckInTime } from "@/lib/dates";
import { useAllCompletions } from "./useAllCompletions";
import { useCompletions } from "./useCompletions";
import { useTodayKey } from "./useTodayKey";
import { useToggleCompletion } from "./useToggleCompletion";

/** Yesterday's check-ins for one habit, for logging a missed day late (R1) */
export interface YesterdayCheckIn {
  count: number;
  target: number;
  isFullyCompleted: boolean;
  /** Adds one below the target, else removes the newest. Returns if it acted. */
  toggle: () => boolean;
}

/**
 * Today's check-in state for one habit, plus the tap handler shared by every
 * check-off control (dashboard list and Habits page cards). Also exposes
 * yesterday's state, or null when the habit didn't exist yet yesterday.
 */
export function useHabitCheckIn(habit: Habit) {
  const { getHabitCompletionCount, getHabitCompletionIds } = useCompletions();
  const { completions: allCompletions } = useAllCompletions();
  const todayKey = useTodayKey();
  const toggleCompletion = useToggleCompletion();

  const completionCount = getHabitCompletionCount(habit.id);
  const isFullyCompleted = completionCount >= habit.target_count;
  const isPending = toggleCompletion.isPending;

  // Below the target a tap adds a check-in; at the target it removes the
  // newest one (an Undo toast follows either way). Returns whether it acted.
  const toggle = () => {
    if (isPending) return false;
    if (!isFullyCompleted) {
      toggleCompletion.mutate({ habit, action: "add" });
      return true;
    }
    // Today's completions are ordered newest first
    const [newestId] = getHabitCompletionIds(habit.id);
    if (!newestId) return false;
    toggleCompletion.mutate({ habit, action: "remove", completionId: newestId });
    return true;
  };

  // All-time history is newest first, so the first match is the newest
  const yesterdayKey = previousDayKey(todayKey);
  const yesterdayIds = allCompletions
    .filter(
      (c) =>
        c.habit_id === habit.id && toDayKey(c.completed_at) === yesterdayKey,
    )
    .map((c) => c.id);
  const yesterdayFull = yesterdayIds.length >= habit.target_count;
  const existedYesterday = toDayKey(habit.created_at) <= yesterdayKey;

  const toggleYesterday = () => {
    if (isPending) return false;
    // Computed at tap time, so a tab left open past midnight uses the new day
    const completedAt = yesterdayCheckInTime(habit.created_at);
    if (!completedAt) return false;
    if (!yesterdayFull) {
      toggleCompletion.mutate({ habit, action: "add", completedAt });
      return true;
    }
    const [newestId] = yesterdayIds;
    if (!newestId) return false;
    toggleCompletion.mutate({
      habit,
      action: "remove",
      completionId: newestId,
      completedAt,
    });
    return true;
  };

  const yesterday: YesterdayCheckIn | null = existedYesterday
    ? {
        count: yesterdayIds.length,
        target: habit.target_count,
        isFullyCompleted: yesterdayFull,
        toggle: toggleYesterday,
      }
    : null;

  return { completionCount, isFullyCompleted, isPending, toggle, yesterday };
}
