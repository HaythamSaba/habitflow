import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateHabit } from "@/lib/api";
import { useAuth } from "./useAuth";
import toast from "react-hot-toast";

export function useUpdateHabit() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: ({
      habitId,
      updates,
    }: {
      habitId: string;
      updates: {
        name?: string;
        description?: string | null;
        icon?: string;
        color?: string;
        frequency?: "daily" | "weekly" | "custom";
        target_count?: number;
        category_id?: string | null;  // ⭐ ADD THIS
      };
    }) => {
      if (!user?.id) throw new Error("User not authenticated");
      return updateHabit(habitId, user.id, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
      toast.success("Habit updated! ✨");
    },
    onError: (error: Error) => {
      toast.error(`Failed to update habit: ${error.message}`);
    },
  });
}