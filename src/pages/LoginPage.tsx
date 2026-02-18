import { Input } from "@/components/ui/Input";
import { useAuth } from "@/hooks/useAuth";
import { useForm } from "react-hook-form";
import { Link, Navigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import { ArrowRight } from "lucide-react";

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
    <div className="min-h-screen bg-linear-to-br from-emerald-50 via-white to-primary-200 flex items-center justify-center p-4 sm:p-6 bg-[#fafafa]">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="rounded-xl border p-5 sm:p-6 lg:p-8 shadow-primary-200 shadow-xl bg-white">
          <h1 className="text-2xl sm:text-3xl font-bold text-center mb-1.5 sm:mb-2">
            Welcome back
          </h1>
          <p className="text-center text-gray-400 text-sm sm:text-base mb-4 sm:mb-6">
            Continue your journey towards consistency.
          </p>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-3 sm:space-y-4"
          >
            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              error={errors.email?.message}
              {...register("email")}
              disabled={isLoading}
            />

            {/* Password Input */}
            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              error={errors.password?.message}
              {...register("password")}
              disabled={isLoading}
            />

            <div className="flex items-center">
              <button
                type="button"
                className="text-sm text-primary-500 hover:underline min-h-11 flex items-center"
              >
                Forgot password?
              </button>
            </div>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full min-h-11"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />}
            >
              Log In
            </Button>
          </form>

          <div className="mt-4 sm:mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/signup" className="text-primary-500 hover:underline">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
