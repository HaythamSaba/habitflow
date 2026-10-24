import { Input } from "@/components/ui/Input";
import { useAuth } from "@/hooks/useAuth";
import { useForm } from "react-hook-form";
import { Link, Navigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import { ArrowRight } from "lucide-react";
import { AuthBrand, AuthFeatures } from "@/components/auth/AuthBrand";
import HeaderCardForm from "@/components/ui/HeaderCardForm";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters")
    .max(50, "Password must be less than 50 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginPage() {
  const { signIn, isLoading, isAuthenticated } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const onSubmit = async (data: LoginFormData) => {
    await signIn(data.email, data.password);
  };

  return (
    <div
      className="min-h-screen bg-linear-to-r from-white to-primary-100
            dark:bg-linear-to-r dark:from-gray-950 dark:to-primary-900 flex flex-col items-center justify-center p-4 sm:p-6"
    >
      <div className="w-full max-w-md">
        <AuthBrand />

        {/* Card */}
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 p-5 sm:p-6 lg:p-8 shadow-xl shadow-primary-200 dark:shadow-primary-900 bg-white dark:bg-gray-950">
          {/* Header */}
          <HeaderCardForm
            Title="Welcome back"
            Description="Log in to check off today's habits"
          />

          {/* Form */}
          {/* noValidate: zod shows the errors, not the browser's native bubbles */}
          <form
            noValidate
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 sm:space-y-5"
          >
            {/* Email Input */}
            <Input
              label="Email Address"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              error={errors.email?.message}
              {...register("email")}
              disabled={isLoading}
            />

            {/* Password Input */}
            <Input
              label="Password"
              type="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              error={errors.password?.message}
              {...register("password")}
              disabled={isLoading}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full min-h-11 sm:min-h-12"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />}
            >
              Log In
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6 sm:my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">
                Don't have an account?
              </span>
            </div>
          </div>

          {/* Sign Up Link */}
          <div className="text-center">
            <Link
              to="/signup"
              className="text-sm sm:text-base text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium hover:underline transition-colors"
            >
              Create a free account →
            </Link>
          </div>
        </div>
      </div>
      <AuthFeatures />
    </div>
  );
}
