import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useHabits } from "@/hooks/useHabits";
import { useAnalytics } from "@/hooks/useAnalytics";
import { BarChart3, TrendingUp, Target, Flame } from "lucide-react";
import { CompletionTrendChart } from "@/components/analytics/CompletionTrendChart";
import { HabitPerformanceChart } from "@/components/analytics/HabitPerformanceChart";
import { ActivityHeatmap } from "@/components/analytics/ActivityHeatmap";

export function AnalyticsPage() {
  const { habits } = useHabits();

  const {
    totalCompletions,
    averageRate,
    bestStreak,
    lineChartData,
    barChartData,
  } = useAnalytics();

  const totalHabits = habits?.length || 0;

  return (
    <DashboardLayout>
      <div className="space-y-4 md:space-y-6 lg:space-y-8 overflow-x-hidden p-4 sm:p-6">
        {/* Header */}
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1 md:mb-2">
            Analytics 📊
          </h1>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
            Track your progress over the last 30 days
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-6">
          {/* Total Habits */}
          <div className="card bg-white dark:bg-gray-950 rounded-xl p-2.5 sm:p-4 lg:p-6 border border-gray-200 dark:border-gray-700 shadow-md shadow-primary-100 dark:shadow-gray-900">
            <div className="flex items-center justify-between mb-2 lg:mb-4">
              <div className="w-9 h-9 lg:w-12 lg:h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-4 h-4 lg:w-6 lg:h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-base sm:text-lg lg:text-2xl font-bold text-gray-900 dark:text-gray-100">
                {totalHabits}
              </span>
            </div>
            <h3 className="text-xs lg:text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              Active Habits
            </h3>
            <p className="hidden sm:block text-xs text-gray-500 dark:text-gray-400">
              Currently tracking
            </p>
          </div>

          {/* Total Completions */}
          <div className="card bg-white dark:bg-gray-950 rounded-xl p-2.5 sm:p-4 lg:p-6 border border-gray-200 dark:border-gray-700 shadow-md shadow-primary-100 dark:shadow-gray-900">
            <div className="flex items-center justify-between mb-2 lg:mb-4">
              <div className="w-9 h-9 lg:w-12 lg:h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-4 h-4 lg:w-6 lg:h-6 text-green-600 dark:text-green-400" />
              </div>
              <span className="text-base sm:text-lg lg:text-2xl font-bold text-gray-900 dark:text-gray-100">
                {totalCompletions}
              </span>
            </div>
            <h3 className="text-xs lg:text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              Completions
            </h3>
            <p className="hidden sm:block text-xs text-gray-500 dark:text-gray-400">
              Last 30 days
            </p>
          </div>

          {/* Avg Rate */}
          <div className="card bg-white dark:bg-gray-950 rounded-xl p-2.5 sm:p-4 lg:p-6 border border-gray-200 dark:border-gray-700 shadow-md shadow-primary-100 dark:shadow-gray-900">
            <div className="flex items-center justify-between mb-2 lg:mb-4">
              <div className="w-9 h-9 lg:w-12 lg:h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <Target className="w-4 h-4 lg:w-6 lg:h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <span className="text-base sm:text-lg lg:text-2xl font-bold text-gray-900 dark:text-gray-100">
                {averageRate}%
              </span>
            </div>
            <h3 className="text-xs lg:text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              Avg Rate
            </h3>
            <p className="hidden sm:block text-xs text-gray-500 dark:text-gray-400">
              Completion rate
            </p>
          </div>

          {/* Best Streak */}
          <div className="card bg-white dark:bg-gray-950 rounded-xl p-2.5 sm:p-4 lg:p-6 border border-gray-200 dark:border-gray-700 shadow-md shadow-primary-100 dark:shadow-gray-900">
            <div className="flex items-center justify-between mb-2 lg:mb-4">
              <div className="w-9 h-9 lg:w-12 lg:h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                <Flame className="w-4 h-4 lg:w-6 lg:h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <span className="text-base sm:text-lg lg:text-2xl font-bold text-gray-900 dark:text-gray-100">
                {bestStreak}
              </span>
            </div>
            <h3 className="text-xs lg:text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              Best Streak
            </h3>
            <p className="hidden sm:block text-xs text-gray-500 dark:text-gray-400">
              Longest streak
            </p>
          </div>
        </div>

        <ActivityHeatmap />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4 lg:gap-6">
          <div className="card bg-white dark:bg-gray-950 rounded-xl p-3 sm:p-4 lg:p-6 border border-gray-200 dark:border-gray-700 min-w-0">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100 mb-2 md:mb-4">
              Completion Trend
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3 md:mb-4">
              Daily completions over the last 30 days
            </p>
            <div className="w-full overflow-x-auto">
              <CompletionTrendChart data={lineChartData} />
            </div>
          </div>

          <div className="card bg-white dark:bg-gray-950 rounded-xl p-3 sm:p-4 lg:p-6 border border-gray-200 dark:border-gray-700 min-w-0">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100 mb-2 md:mb-4">
              Habit Performance
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3 md:mb-4">
              Completion rate by habit (last 30 days)
            </p>
            <div className="w-full overflow-x-auto">
              {barChartData.length > 0 ? (
                <HabitPerformanceChart data={barChartData} />
              ) : (
                <div className="h-52 md:h-75 flex items-center justify-center text-gray-500 dark:text-gray-400">
                  <p>No habit data available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
