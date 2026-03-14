import { restoreHabit } from "@/lib/api";
import { useAuth } from "./useAuth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function useRestoreHabit() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (habitId: string) => {
      if (!user) throw new Error("User not authenticated");
      return restoreHabit(habitId, user.id);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits", user?.id] });
      toast.success("Habit restored! ✨");
    },

    onError: (error) => {
      console.error("Error restoring habit:", error);
      const message =
        error instanceof Error ? error.message : "Failed to restore habit";
      toast.error(message);
    },
  });
}
