import { getHabits } from "@/lib/api";
import { useAuth } from "./useAuth";
import { useQuery } from "@tanstack/react-query";

export function useHabits() {
  const { user } = useAuth(); // ✅ Get current user

  const {
    isLoading,
    data: habits,
    error,
  } = useQuery({
    queryKey: ["habits", user?.id], // ✅ Cache per user
    queryFn: () => getHabits(user?.id), // ✅ Pass user ID
    enabled: !!user, // ✅ Only run if user exists
  });

  return {
    isLoading,
    habits: habits || [],
    error,
  };
}
