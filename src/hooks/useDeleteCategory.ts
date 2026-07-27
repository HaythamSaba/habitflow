import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCategory } from "@/lib/api";
import toast from "react-hot-toast";
import { useAuth } from "./useAuth";

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: (categoryId: string) => {
      if (!user) throw new Error("Not authenticated");
      return deleteCategory(categoryId, user.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["habits"] });
      toast.success("Category deleted! 🎉");
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete category: ${error.message}`);
    },
  });
}
