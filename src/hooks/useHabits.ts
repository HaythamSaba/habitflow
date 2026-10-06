import { getHabits } from "@/lib/api";
import { useAuth } from "./useAuth";
import { useQuery } from "@tanstack/react-query";

export function useHabits() {
  const { user } = useAuth();

  const {
    isLoading,
    isFetching,
    data: habits,
    error,
    refetch,
  } = useQuery({
    queryKey: ["habits", user?.id],
    queryFn: () => getHabits(user?.id),
    enabled: !!user,
  });

  return {
    isLoading,
    isFetching,
    habits: habits || [],
    error,
    // Retry after an error without reloading the page
    refetch,
  };
}
