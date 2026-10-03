// src/hooks/useDeleteHabit.ts

import { deleteHabit } from "@/lib/api"; // ✅ Import from api
import { useAuth } from "./useAuth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function useDeleteHabit() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (habitId: string) => {
      if (!user) throw new Error("User not authenticated");
      return deleteHabit(habitId, user.id); // ✅ Uses imported function
    },

    onSuccess: (_data, habitId) => {
      queryClient.invalidateQueries({ queryKey: ["habits", user?.id] });
      // The habit's completions were cascade-deleted, so completion-based
      // stats (today's progress, streaks, charts) must refetch too
      queryClient.invalidateQueries({ queryKey: ["completions"] });
      queryClient.invalidateQueries({ queryKey: ["all-completions"] });
      queryClient.removeQueries({ queryKey: ["habit-completions", habitId] });
      toast.success("Habit deleted successfully! 🗑️");
    },

    onError: (error) => {
      console.error("Error deleting habit:", error);
      const message =
        error instanceof Error ? error.message : "Failed to delete habit";

      if (message.includes("Failed to fetch") || message.includes("Network")) {
        toast.error("Network error. Please check your connection.");
      } else {
        toast.error(message);
      }
    },
  });
}
