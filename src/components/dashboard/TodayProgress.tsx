import { useHabits } from "@/hooks/useHabits";
import { useCompletions } from "@/hooks/useCompletions";
import { CheckCircle2 } from "lucide-react";

export function TodayProgress() {
  const { habits } = useHabits();
  const { completions } = useCompletions();

  // Count how many habits are completed today
  const completedCount =
    habits?.filter((habit) => {
      const habitCompletions =
        completions?.filter((c) => c.habit_id === habit.id) || [];
      return habitCompletions.length >= habit.target_count;
    }).length || 0;

  const totalHabits = habits?.length || 0;

  // Calculate percentage
  const percentage =
    totalHabits > 0 ? Math.round((completedCount / totalHabits) * 100) : 0;

  // Don't show if no habits
  if (totalHabits === 0) return null;

  return (
    <div className="bg-white dark:bg-gray-950 flex-1 rounded-xl p-6 shadow-sm border shadow-primary-100 dark:shadow-primary-800 hover:dark:shadow-xl  border-gray-200 dark:border-primary-700 hover:shadow-xl transition-shadow duration-500">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
          Today's Progress
        </h3>
        <CheckCircle2 className="w-5 h-5 text-primary" />
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
          <div
            className="h-full bg-secondary-500 transition-all duration-500 rounded-full"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-600 dark:text-gray-400">
          <span className="font-bold text-gray-900 dark:text-gray-100">
            {completedCount}
          </span>{" "}
          of{" "}
          <span className="font-bold text-gray-900 dark:text-gray-100">
            {totalHabits}
          </span>{" "}
          habits completed
        </span>
        <span className="font-bold text-primary">{percentage}%</span>
      </div>

      {/* Motivational Message */}
      {percentage === 100 && (
        <p className="mt-3 text-sm text-green-600 dark:text-green-400 font-medium">
          🎉 Perfect day! All habits completed!
        </p>
      )}
      {percentage >= 50 && percentage < 100 && (
        <p className="mt-3 text-sm text-secondary-700 dark:text-secondary-400 font-medium">
          🔥 You're on fire! Keep going!
        </p>
      )}
      {percentage > 0 && percentage < 50 && (
        <p className="mt-3 text-sm text-blue-600 dark:text-blue-400 font-medium">
          💪 Great start! You can do this!
        </p>
      )}
      {percentage === 0 && totalHabits > 0 && (
        <p className="mt-3 text-sm text-gray-500 dark:text-gray-400 font-medium">
          ⏰ Ready to start your day?
        </p>
      )}
    </div>
  );
}

export default TodayProgress;
