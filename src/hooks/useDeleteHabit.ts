import { deleteHabit } from "@/lib/api";
import { useAuth } from "./useAuth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function useDeleteHabit() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (habitId: string) => {
      if (!user) throw new Error("User not authenticated");
      return deleteHabit(habitId, user.id);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits", user?.id] });
      toast.success("Habit deleted successfully! 🎉");
    },

    onError: (error) => {
      console.error("Error creating habit:", error);
      const message =
        error instanceof Error ? error.message : "Failed to create habit";

      if (message.includes("Faild to fetch") || message.includes("Network")) {
        toast.error("Failed to create habit. Please try again.");
      } else {
        toast.error(message);
      }
    },
  });
}
