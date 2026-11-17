import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { deleteMyAccount } from "@/lib/account";
import { supabase } from "@/lib/supabase";
import { SIGNED_OUT_TOAST_ID } from "./useAuth";

/**
 * Permanently deletes the account (audit R17), then clears the local session
 * and cached data and returns to the login page.
 */
export function useDeleteAccount() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: deleteMyAccount,
    onSuccess: async () => {
      // The user no longer exists on the server, so only the local session
      // needs clearing ("local" skips the server call that would now fail)
      await supabase.auth.signOut({ scope: "local" });
      queryClient.removeQueries();
      navigate("/login", { replace: true });
      // Same id as the sign-out toast, so this replaces it
      toast.success("Your account and all of its data were deleted", {
        id: SIGNED_OUT_TOAST_ID,
      });
    },
    onError: (error: Error) => {
      toast.error(`Couldn't delete your account: ${error.message}`);
    },
  });
}
