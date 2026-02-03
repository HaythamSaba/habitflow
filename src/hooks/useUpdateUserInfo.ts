import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserProfile } from "@/lib/api"; // ← Changed name
import toast from "react-hot-toast";

export function useUpdateUserInfo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (displayName: string) => {
      // ← Just takes string!
      return updateUserProfile(displayName);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] }); // ← Refresh user data
      toast.success("Profile updated successfully! 🎉");
    },
    onError: (error) => {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. Please try again.");
    },
  });
}
