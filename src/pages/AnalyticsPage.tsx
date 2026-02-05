import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useHabits } from "@/hooks/useHabits";
import { useAnalytics } from "@/hooks/useAnalytics";
import { BarChart3, TrendingUp, Target, Flame } from "lucide-react";
import { CompletionTrendChart } from "@/components/analytics/CompletionTrendChart";
import { HabitPerformanceChart } from "@/components/analytics/HabitPerformanceChart"; // ⭐ Add this import

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
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Analytics 📊
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track your progress over the last 30 days
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Habits */}
          <div className="card bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-md shadow-primary-100 dark:shadow-gray-900">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {totalHabits}
              </span>
            </div>
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              Active Habits
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Currently tracking
            </p>
          </div>

          {/* Total Completions */}
          <div className="card bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-md shadow-primary-100 dark:shadow-gray-900">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {totalCompletions}
              </span>
            </div>
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              Completions
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Last 30 days
            </p>
          </div>

          {/* Avg Rate */}
          <div className="card bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-md shadow-primary-100 dark:shadow-gray-900">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {averageRate}%
              </span>
            </div>
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              Avg Rate
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Completion rate
            </p>
          </div>

          {/* Best Streak */}
          <div className="card bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-md shadow-primary-100 dark:shadow-gray-900">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                <Flame className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {bestStreak}
              </span>
            </div>
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              Best Streak
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Longest streak
            </p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Line Chart */}
          <div className="card bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
              Completion Trend
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Daily completions over the last 30 days
            </p>
            <CompletionTrendChart data={lineChartData} />
          </div>

          {/* ⭐ Bar Chart - NOW WITH REAL CHART! */}
          <div className="card bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
              Habit Performance
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Completion rate by habit (last 30 days)
            </p>
            {barChartData.length > 0 ? (
              <HabitPerformanceChart data={barChartData} />
            ) : (
              <div className="h-75 flex items-center justify-center text-gray-500 dark:text-gray-400">
                <p>No habit data available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
