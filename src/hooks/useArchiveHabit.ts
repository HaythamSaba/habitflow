import { archiveHabit } from "@/lib/api";
import { useAuth } from "./useAuth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function useArchiveHabit() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (habitId: string) => {
      if (!user) throw new Error("User not authenticated");
      return archiveHabit(habitId, user.id);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits", user?.id] });
      toast.success("Habit archived! 📦");
    },

    onError: (error) => {
      console.error("Error archiving habit:", error);
      const message =
        error instanceof Error ? error.message : "Failed to archive habit";
      toast.error(message);
    },
  });
}
