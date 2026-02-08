import { updateCategory } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      categoryId,
      updates,
    }: {
      categoryId: string;
      updates: { name?: string; color?: string; icon?: string };
    }) => updateCategory(categoryId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category updated successfully! 🎉");
    },
    onError: (error: Error) => {
      toast.error(`Failed ot update category: ${error.message}`);
    },
  });
}
