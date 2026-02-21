import { CheckCircle2, Flame, Target, TrendingUp } from "lucide-react";

interface HabitStatsCardsProps {
  totalHabits: number;
  activeHabits: number;
  archivedHabits: number;
  avgCompletionRate: number;
  longestStreak: number;
  isLoading?: boolean;
}

export default function HabitsStatsCards({
  totalHabits,
  activeHabits,
  archivedHabits,
  avgCompletionRate,
  longestStreak,
  isLoading = false,
}: HabitStatsCardsProps) {
  // If loading, show placeholder
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-gray-700/50 shadow-xl animate-pulse"
          >
            <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-xl mb-4" />
            <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        ))}
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-6">
      {/* Total Habits */}
      <div className="relative group">
        <div className="absolute inset-0 bg-linear-to-br from-blue-500/20 to-cyan-500/20 dark:bg-linear-to-br dark:from-blue-800 dark:to-cyan-500/20 rounded-xl sm:rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
        <div className="relative glass-card bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 border border-white/20 dark:border-gray-700/50 shadow-xl hover:scale-105 transition-all">
          <div className="flex items-center justify-between mb-2 lg:mb-4">
            <div className="w-9 h-9 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-linear-to-br from-blue-500 to-cyan-500 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
              <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
            </div>
            <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100">
              {totalHabits}
            </span>
          </div>
          <h3 className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400 mb-0.5 sm:mb-1">
            Total Habits
          </h3>
          <p className="hidden sm:block text-xs text-gray-500 dark:text-gray-400">
            {archivedHabits} archived
          </p>
        </div>
      </div>

      {/* Active Habits */}
      <div className="relative group">
        <div className="absolute inset-0 bg-linear-to-br from-green-500/20 to-emerald-500/20 dark:bg-linear-to-br dark:from-green-800 dark:to-emerald-500/20 rounded-xl sm:rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
        <div className="relative glass-card bg-white/70 dark:bg-gray-900 backdrop-blur-xl rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 border border-white/20 dark:border-gray-700/50 shadow-xl hover:scale-105 transition-all">
          <div className="flex items-center justify-between mb-2 lg:mb-4">
            <div className="w-9 h-9 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-linear-to-br from-green-500 to-emerald-500 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
            </div>
            <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100">
              {activeHabits}
            </span>
          </div>
          <h3 className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400 mb-0.5 sm:mb-1">
            Active Habits
          </h3>
          <p className="hidden sm:block text-xs text-gray-500 dark:text-gray-400">
            Currently tracking
          </p>
        </div>
      </div>

      {/* AVG Completion Rate */}
      <div className="relative group">
        <div className="absolute inset-0 bg-linear-to-br from-purple-500/20 to-pink-500/20 dark:bg-linear-to-br dark:from-purple-800 dark:to-pink-500/20 rounded-xl sm:rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
        <div className="relative glass-card bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 border border-white/20 dark:border-gray-700/50 shadow-xl hover:scale-105 transition-all">
          <div className="flex items-center justify-between mb-2 lg:mb-4">
            <div className="w-9 h-9 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-linear-to-br from-purple-500 to-pink-500 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
              <Target className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
            </div>
            <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100">
              {avgCompletionRate}%
            </span>
          </div>
          <h3 className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400 mb-0.5 sm:mb-1">
            Avg Rate
          </h3>
          <p className="hidden sm:block text-xs text-gray-500 dark:text-gray-400">
            Completion rate
          </p>
        </div>
      </div>

      {/* Best Streak */}
      <div className="relative group">
        <div className="absolute inset-0 bg-linear-to-br from-orange-500/20 to-red-500/20 dark:bg-linear-to-br dark:from-orange-800 dark:to-red-500/20 rounded-xl sm:rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
        <div className="relative glass-card bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 border border-white/20 dark:border-gray-700/50 shadow-xl hover:scale-105 transition-all">
          <div className="flex items-center justify-between mb-2 lg:mb-4">
            <div className="w-9 h-9 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-linear-to-br from-orange-500 to-red-500 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
              <Flame className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
            </div>
            <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100">
              {longestStreak}
            </span>
          </div>
          <h3 className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400 mb-0.5 sm:mb-1">
            Best Streak
          </h3>
          <p className="hidden sm:block text-xs text-gray-500 dark:text-gray-400">
            Longest streak
          </p>
        </div>
      </div>
    </div>
  );
}
