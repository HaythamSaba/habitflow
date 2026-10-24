import { Loader2 } from "lucide-react";

/** Full-screen loading state: auth check and lazy-loaded pages. */
export function PageLoader() {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-linear-to-r from-white to-primary-100
            dark:bg-linear-to-r dark:from-gray-950 dark:to-primary-900"
    >
      <div className="text-center" role="status">
        <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
        <p className="text-gray-700 dark:text-gray-300 font-medium">
          Loading HabitFlow...
        </p>
      </div>
    </div>
  );
}
