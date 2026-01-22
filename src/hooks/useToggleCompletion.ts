import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createCompletion,
  getTodayCompletions,
  deleteCompletion,
} from "@/lib/api";
import { useAuth } from "./useAuth";
import toast from "react-hot-toast";

export function useToggleCompletion() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (habitId: string) => {
      if (!user) throw new Error("Not logged in");

      const completions = await getTodayCompletions(user.id);
      const existing = completions.find((c) => c.habit_id === habitId);

      if (existing) {
        await deleteCompletion(existing.id, user.id);
        return "removed";
      } else {
        await createCompletion(habitId, user.id);
        return "added";
      }
    },

    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["completions"] });
      toast.success(result === "added" ? "✓ Done!" : "Unmarked");
    },
  });
}
