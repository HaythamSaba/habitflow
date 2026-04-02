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
          await updateUserPoints(user.id, -POINTS_PER_COMPLETION);
        }
      } else {
        // Add completion
        console.log("✅ Creating completion for habit:", habitId); // ⭐ DEBUG
        const result = await createCompletion(habitId, user.id); // ⭐ CAPTURE RESULT
        console.log("✅ Completion created:", result); // ⭐ DEBUG
        await updateUserPoints(user.id, POINTS_PER_COMPLETION);
      }
    },
    onSuccess: () => {
      console.log("🎉 Mutation succeeded!"); // ⭐ DEBUG
      // Invalidate all related queries
      queryClient.invalidateQueries({ queryKey: ["habits"] });
      queryClient.invalidateQueries({ queryKey: ["completions"] });
      queryClient.invalidateQueries({ queryKey: ["user-stats"] });
    },
    // ⭐⭐⭐ ADD ERROR HANDLER
    onError: (error) => {
      console.error("❌ Mutation failed:", error); // ⭐ DEBUG
      toast.error(`Failed to update habit: ${error.message}`);
    },
  });
}