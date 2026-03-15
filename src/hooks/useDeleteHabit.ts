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

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits", user?.id] });
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
