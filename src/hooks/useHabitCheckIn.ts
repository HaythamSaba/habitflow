import { Habit } from "@/types";
import { useCompletions } from "./useCompletions";
import { useToggleCompletion } from "./useToggleCompletion";

/**
 * Today's check-in state for one habit, plus the tap handler shared by every
 * check-off control (dashboard list and Habits page cards).
 */
export function useHabitCheckIn(habit: Habit) {
  const { getHabitCompletionCount, getHabitCompletionIds } = useCompletions();
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

  return { completionCount, isFullyCompleted, isPending, toggle };
}
