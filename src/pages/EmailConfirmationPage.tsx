import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ArrowRight, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";

export function EmailConfirmationPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [isResending, setIsResending] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  // Get email from URL params or session storage
  useEffect(() => {
    const paramEmail = searchParams.get("email");
    const storedEmail = sessionStorage.getItem("signup_email");
    
    if (paramEmail) {
      setEmail(paramEmail);
      sessionStorage.setItem("signup_email", paramEmail);
    } else if (storedEmail) {
      setEmail(storedEmail);
    }
  }, [searchParams]);

  // Countdown timer for resend button
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const handleResendEmail = async () => {
    if (!email) {
      toast.error("Email not found. Please sign up again.");
      return;
    }

    setIsResending(true);
    try {
      // Resend confirmation email
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: email,
      });

      if (error) throw error;

      toast.success("Confirmation email sent! Check your inbox.");
      setTimeLeft(60); // Cooldown: 60 seconds before resend
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to resend email"
      );
    } finally {
      setIsResending(false);
    }
  };

  const handleGoToLogin = () => {
    sessionStorage.removeItem("signup_email");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-50 via-white to-primary-100 
      dark:from-gray-950 dark:via-gray-900 dark:to-primary-950 
      flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Content */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">
            Confirm Your Email
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-2">
            We've sent a confirmation link to:
          </p>
          <p className="text-lg font-semibold text-primary-600 dark:text-primary-400">
            {email || "your email"}
          </p>
        </div>

        {/* Steps Card */}
        <div className="rounded-3xl border border-gray-200 dark:border-gray-800 p-5 sm:p-6 lg:p-8 shadow-xl shadow-primary-200/50 dark:shadow-primary-950/50 bg-white dark:bg-gray-900 backdrop-blur-sm mb-6">
          <div className="space-y-4">
            {/* Step 1 */}
            <div className="flex gap-4">
              <div className="shrink-0">
                <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center 
                  justify-center text-white font-bold text-sm">
                  1
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                  Check Your Inbox
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Open the email from HabitFlow
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-4">
              <div className="shrink-0">
                <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center 
                  justify-center text-white font-bold text-sm">
                  2
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                  Click the Link
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Click "Confirm your email" in the email
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-4">
              <div className="shrink-0">
                <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center 
                  justify-center text-white font-bold text-sm">
                  3
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                  Log In
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Return here and log in with your credentials
                </p>
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 
            dark:border-blue-800 rounded-lg flex gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Check your spam folder if you don't see the email in a few minutes.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Button
            variant="primary"
            size="lg"
            className="w-full min-h-11"
            onClick={handleGoToLogin}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Go to Login
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="w-full min-h-11"
            onClick={handleResendEmail}
            disabled={isResending || timeLeft > 0}
          >
            {isResending ? "Sending..." : timeLeft > 0 ? `Resend in ${timeLeft}s` : "Resend Confirmation Email"}
          </Button>
        </div>

        {/* Help Text */}
        <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-6">
          Didn't receive the email?{" "}
          <button
            onClick={handleResendEmail}
            disabled={isResending || timeLeft > 0}
            className="text-primary-600 dark:text-primary-400 hover:underline disabled:opacity-50"
          >
            Click here to resend
          </button>
        </p>
      </div>
    </div>
  );
}