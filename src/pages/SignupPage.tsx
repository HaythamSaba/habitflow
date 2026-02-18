import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, Navigate } from "react-router-dom";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";

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
    <div className="min-h-screen bg-linear-to-br from-emerald-50 via-white to-primary-200 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-5 sm:mb-8">
          <h1
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-1.5 sm:mb-2"
            style={{ fontFamily: "Sora, sans-serif" }}
          >
            Start Your Journey
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Create an account and build better habits
          </p>
        </div>

        <div className="card bg-white rounded-xl sm:rounded-2xl shadow-xl p-5 sm:p-6 lg:p-8 border border-gray-100">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-3 sm:space-y-4 lg:space-y-5"
          >
            <Input
              label="Full Name"
              type="text"
              placeholder="John Doe"
              error={errors.displayName?.message}
              {...register("displayName")}
              disabled={isLoading}
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              error={errors.email?.message}
              {...register("email")}
              disabled={isLoading}
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              helperText="8+ chars, uppercase, lowercase, and number"
              {...register("password")}
              disabled={isLoading}
            />

            <Input
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              error={errors.confirmPassword?.message}
              {...register("confirmPassword")}
              disabled={isLoading}
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-4 sm:mt-6 min-h-11"
              isLoading={isLoading}
            >
              Create Account
            </Button>
          </form>

          <div className="relative my-4 sm:my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-xs sm:text-sm">
              <span className="px-3 sm:px-4 bg-white text-gray-500">
                Already have an account?
              </span>
            </div>
          </div>

          <div className="text-center">
            <Link
              to="/login"
              className="text-sm sm:text-base text-primary-500 hover:underline min-h-11 inline-flex items-center"
            >
              Log in instead
            </Link>
          </div>
        </div>

        <p className="text-center text-xs sm:text-sm text-gray-500 mt-5 sm:mt-8 px-4">
          By creating an account, you agree to our Terms of Service and Privacy
          Policy
        </p>
      </div>
    </div>
  );
}
