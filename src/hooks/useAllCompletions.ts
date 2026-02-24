import { useQuery } from "@tanstack/react-query";
import { useAuth } from "./useAuth";
import { supabase } from "@/lib/supabase";
import { Completion } from "@/types";

export function useAllCompletions() {
  const { user } = useAuth();

  const {
    data: completions,
    isLoading,
    error,
  } = useQuery<Completion[]>({
    queryKey: ["all-completions", user?.id],
    queryFn: async () => {
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("completions")
        .select("*")
        .eq("user_id", user.id)
        .order("completed_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  return {
    completions: completions || [],
    isLoading,
    error,
  };
}