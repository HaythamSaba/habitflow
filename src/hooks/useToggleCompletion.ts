import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "./useAuth";
import { useCompletions } from "./useCompletions";
import {
  createCompletion,
  deleteCompletion,
  updateUserPoints,
} from "@/lib/api";
import { POINTS_PER_COMPLETION } from "@/lib/points";

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

      const currentCount = getHabitCompletionCount(habitId);

      if (currentCount >= targetCount) {
        // Remove one completion
        const completionIds = getHabitCompletionIds(habitId);
        const lastCompletionId = completionIds[completionIds.length - 1];

        if (lastCompletionId) {
          await deleteCompletion(lastCompletionId, user.id);
          // Deduct points (negative)
          await updateUserPoints(user.id, -POINTS_PER_COMPLETION);
        }
      } else {
        // Add completion
        await createCompletion(habitId, user.id);
        // Award points!
        await updateUserPoints(user.id, POINTS_PER_COMPLETION);
      }
    },
    onSuccess: () => {
      // Invalidate all related queries
      queryClient.invalidateQueries({ queryKey: ["habits"] });
      queryClient.invalidateQueries({ queryKey: ["completions"] });
      queryClient.invalidateQueries({ queryKey: ["user-stats"] }); // ⭐ NEW
    },
  });
}
 