import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, Navigate } from "react-router-dom";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { ArrowRight } from "lucide-react"; // ⭐ ADD

const signupSchema = z
  .object({
    displayName: z
      .string()
      .min(1, "Name is required")
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name must be less than 50 characters"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain uppercase, lowercase, and number",
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type SignupFormData = z.infer<typeof signupSchema>;

export function SignupPage() {
  const { signUp, isLoading, isAuthenticated } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const onSubmit = async (data: SignupFormData) => {
    await signUp(data.email, data.password, data.displayName);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-50 via-white to-primary-100 dark:from-gray-950 dark:via-gray-900 dark:to-primary-950 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Start Your Journey ✨
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Create an account and build better habits
          </p>
        </div>

        {/* Card */}
        <div className="rounded-3xl border border-gray-200 dark:border-gray-800 p-5 sm:p-6 lg:p-8 shadow-xl shadow-primary-200/50 dark:shadow-primary-950/50 bg-white dark:bg-gray-900 backdrop-blur-sm">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 sm:space-y-5"
          >
            {/* Full Name */}
            <Input
              label="Full Name"
              type="text"
              placeholder="John Doe"
              error={errors.displayName?.message}
              {...register("displayName")}
              disabled={isLoading}
            />

            {/* Email */}
            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              error={errors.email?.message}
              {...register("email")}
              disabled={isLoading}
            />

            {/* Password */}
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              helperText="8+ chars, uppercase, lowercase, and number"
              {...register("password")}
              disabled={isLoading}
            />

            {/* Confirm Password */}
            <Input
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              error={errors.confirmPassword?.message}
              {...register("confirmPassword")}
              disabled={isLoading}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2 min-h-11 sm:min-h-12"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />}
            >
              Create Account
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">
                Already have an account?
              </span>
            </div>
          </div>

          {/* Login Link */}
          <div className="text-center">
            <Link
              to="/login"
              className="text-sm sm:text-base text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium hover:underline transition-colors"
            >
              Log in instead →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
