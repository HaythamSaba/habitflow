import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "./useAuth";
import { useCompletions } from "./useCompletions";
import {
  createCompletion,
  deleteCompletion,
  updateUserPoints,
} from "@/lib/api";
import { POINTS_PER_COMPLETION } from "@/lib/points";
import { toast } from "react-hot-toast";

/**
 * The check-in change was saved but the follow-up points update failed.
 * The two writes aren't atomic yet, so report this case separately instead
 * of telling the user the whole action failed.
 */
class PointsSyncError extends Error {
  readonly checkInAdded: boolean;

  constructor(checkInAdded: boolean) {
    super("Points update failed");
    this.checkInAdded = checkInAdded;
  }
}

async function syncPoints(userId: string, delta: number, checkInAdded: boolean) {
  try {
    await updateUserPoints(userId, delta);
  } catch {
    throw new PointsSyncError(checkInAdded);
  }
}

export function useToggleCompletion() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { getHabitCompletionCount, getHabitCompletionIds } = useCompletions();

  return useMutation({
    mutationFn: async ({
      habitId,
      targetCount,
    }: {
      habitId: string;
      targetCount: number;
    }) => {
      if (!user) throw new Error("Not authenticated");

      console.log("🎯 Toggling completion for habit:", habitId); // ⭐ DEBUG

      const currentCount = getHabitCompletionCount(habitId);

      if (currentCount >= targetCount) {
        // Remove one completion
        const completionIds = getHabitCompletionIds(habitId);
        const lastCompletionId = completionIds[completionIds.length - 1];

        if (lastCompletionId) {
          console.log("❌ Deleting completion:", lastCompletionId); // ⭐ DEBUG
          await deleteCompletion(lastCompletionId, user.id);
          await syncPoints(user.id, -POINTS_PER_COMPLETION, false);
        }
      } else {
        // Add completion
        console.log("✅ Creating completion for habit:", habitId); // ⭐ DEBUG
        const result = await createCompletion(habitId, user.id); // ⭐ CAPTURE RESULT
        console.log("✅ Completion created:", result); // ⭐ DEBUG
        await syncPoints(user.id, POINTS_PER_COMPLETION, true);
      }
    },
    // Refetch on success AND failure: a partially failed toggle may still
    // have changed the check-in, and the UI must show what was saved
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
      queryClient.invalidateQueries({ queryKey: ["completions"] });
      queryClient.invalidateQueries({ queryKey: ["all-completions"] });
      queryClient.invalidateQueries({ queryKey: ["user-stats"] });
    },
    onError: (error) => {
      console.error("❌ Mutation failed:", error); // ⭐ DEBUG
      if (error instanceof PointsSyncError) {
        toast.error(
          error.checkInAdded
            ? "Check-in saved, but your points couldn't be updated."
            : "Check-in removed, but your points couldn't be updated.",
        );
        return;
      }
      toast.error(`Failed to update habit: ${error.message}`);
    },
  });
}