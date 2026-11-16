import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createHabit } from "@/lib/api";
import { useAuth } from "./useAuth";
import toast from "react-hot-toast";

export const HABIT_CREATED_TOAST_ID = "habit-created";

export function useCreateHabit() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: (habitData: {
      name: string;
      description?: string;
      icon: string;
      color: string;
      frequency: "daily" | "weekly" | "custom";
      target_count: number;
      category_id?: string | null;
    }) => {
      if (!user?.id) throw new Error("User not authenticated");
      return createHabit(user.id, habitData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
      // Fixed id so a caller can replace this toast instead of stacking one
      toast.success("Habit created", { id: HABIT_CREATED_TOAST_ID });
    },
    onError: (error: Error) => {
      toast.error(`Failed to create habit: ${error.message}`);
    },
  });
}