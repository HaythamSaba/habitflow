import { fetchCategories } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "./useAuth";

export function useCategories() {
  const { user } = useAuth();

  const {
    data: categories,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["categories", user?.id],
    queryFn: () => fetchCategories(user!.id),
    enabled: !!user,
  });

  return {
    categories: categories || [],
    isLoading,
    error,
  };
}
