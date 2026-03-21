import { Button } from "@/components/ui/Button";
import { Home, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen overflow-hidden bg-gray-100 dark:bg-gray-900 flex items-center justify-center px-6">
      {/* Background Glow */}
      <div className="absolute inset-0">
        <div className="absolute w-125 h-125 bg-primary-600/20 blur-[120px] rounded-full -top-25 -left-25" />
        <div className="absolute w-100 h-100 bg-secondary-500/20 blur-[120px] rounded-full -bottom-25 -right-25" />
      </div>

      {/* Glass Card */}
      <div className="relative z-10 backdrop-blur-xl bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 shadow-2xl rounded-3xl p-10 max-w-lg w-full text-center">
        {/* 404 */}
        <h1 className="text-[120px] font-extrabold bg-linear-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent leading-none tracking-tight">
          404
        </h1>

        {/* Subtitle */}
        <p className="mt-3 text-gray-700 dark:text-gray-300 text-sm sm:text-base leading-relaxed">
          The page you’re trying to reach doesn’t exist… or it decided to
          disappear. Happens more often than developers admit.
        </p>

        {/* Divider */}
        <div className="w-16 h-px bg-linear-to-r from-transparent via-white/30 to-transparent mx-auto my-6" />

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => navigate("/")}
            variant="primary"
            leftIcon={<Home className="w-4 h-4" />}
            className="bg-linear-to-r from-primary-500 to-secondary-500 text-black font-medium shadow-lg hover:scale-[1.03] transition-all duration-300"
          >
            Dashboard
          </Button>

          <Button
            variant="outline"
            onClick={() => window.history.back()}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}
