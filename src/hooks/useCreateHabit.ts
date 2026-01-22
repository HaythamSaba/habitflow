import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "./useAuth";
import { CreateHabitFormData } from "@/types";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";

export function useCreateHabit() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateHabitFormData) => {
      if (!user) throw new Error("User not authenticated");

      const { count } = await supabase
        .from("habits")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);

      const position = count || 0;
      const { data: newHabit, error } = await supabase
        .from("habits")
        .insert({
          user_id: user.id,
          name: data.name,
          description: data.description || null,
          icon: data.icon,
          color: data.color,
          frequency: data.frequency,
          frequency_days: data.frequency_days || null,
          target_count: data.target_count,
          archived: false,
          position,
        })
        .select()
        .single();

      if (error) throw error;
      return newHabit;
    },
    retry: 2,
    retryDelay: 1000,
    onSuccess: () => {
      // Invalidate and refetch habits
      queryClient.invalidateQueries({ queryKey: ["habits", user?.id] });
      toast.success("Habit created successfully! 🎉");
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
