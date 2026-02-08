import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createHabit } from "@/lib/api";
import { useAuth } from "./useAuth";
import toast from "react-hot-toast";

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
      toast.success("Habit created! 🎉");
    },
    onError: (error: Error) => {
      toast.error(`Failed to create habit: ${error.message}`);
    },
  });
}