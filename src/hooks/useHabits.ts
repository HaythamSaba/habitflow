import { getHabits } from "@/lib/api";
import { useAuth } from "./useAuth";
import { useQuery } from "@tanstack/react-query";

export function useHabits() {
  const { user } = useAuth();

  const {
    isLoading,
    data: habits,
    error,
  } = useQuery({
    queryKey: ["habits", user?.id],
    queryFn: () => getHabits(user?.id),
    enabled: !!user,
  });

  return {
    isLoading,
    habits: habits || [],
    error,
  };
}
