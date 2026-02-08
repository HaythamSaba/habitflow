import { fetchCategories } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export function useCategories() {
  const {
    data: categories,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: () => fetchCategories(),
  });

  return {
    categories: categories || [],
    isLoading,
    error,
  };
}
