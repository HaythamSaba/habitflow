import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "./useAuth";
import { updateHabit } from "@/lib/api";
import { CreateHabitFormData } from "@/types";
import toast from "react-hot-toast";

interface UpdateHabitParams {
  habitId: string;
  updates: Partial<CreateHabitFormData>;
}

export function useUpdateHabit() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ habitId, updates }: UpdateHabitParams) => {
      if (!user) throw new Error("User not authenticated");
      return updateHabit(habitId, user.id, updates);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits", user?.id] });
      toast.success("Habit updated successfully! 🎉");
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
