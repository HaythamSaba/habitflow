import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/authstore";

export function useAuth() {
  const navigate = useNavigate();
  const {
    user,
    isLoading,
    isInitialized,
    setUser,
    setLoading,
    setInitialized,
    reset,
  } = useAuthStore();

  // Initialize auth state on mount
  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        // Get current session
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error("Error getting session:", error);
          if (mounted) reset();
          return;
        }

        if (mounted) {
          setUser(session?.user ?? null);
          setLoading(false);
          setInitialized(true);
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        if (mounted) reset();
      }
    };

    initializeAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      setUser(session?.user ?? null);
      setLoading(false);

      // Handle different auth events
      if (event === "SIGNED_IN") {
        // toast.success("Welcome back!");
      } else if (event === "SIGNED_OUT") {
        toast.success("Logged out successfully");
      } else if (event === "USER_UPDATED") {
        toast.success("Profile updated");
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [setUser, setLoading, setInitialized, reset]);

  // Sign up with email and password
  const signUp = async (
    email: string,
    password: string,
    displayName: string
  ) => {
    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName,
          },
        },
      });

      if (error) throw error;

      if (data.user) {
        toast.success("Account created! Welcome to HabitFlow 🎉");
        navigate("/dashboard");
        return { success: true };
      }

      return { success: false, error: "Unknown error occurred" };
    } catch (error) {
      console.error("Signup error:", error);
      const message =
        error instanceof Error ? error.message : "Failed to create account";
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        navigate("/dashboard");
        return { success: true };
      }

      return { success: false, error: "Unknown error occurred" };
    } catch (error) {
      console.error("Login error:", error);
      const message =
        error instanceof Error ? error.message : "Failed to sign in";
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();

      if (error) throw error;

      reset();
      navigate("/login");
      return { success: true };
    } catch (error) {
      console.error("Logout error:", error);
      const message =
        error instanceof Error ? error.message : "Failed to sign out";
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // Password reset request
  const resetPassword = async (email: string) => {
    try {
      setLoading(true);

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      toast.success("Password reset email sent! Check your inbox.");
      return { success: true };
    } catch (error) {
      console.error("Password reset error:", error);
      const message =
        error instanceof Error ? error.message : "Failed to send reset email";
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    isLoading,
    isInitialized,
    isAuthenticated: !!user,
    signUp,
    signIn,
    signOut,
    resetPassword,
  };
}
