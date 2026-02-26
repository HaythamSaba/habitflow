import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useHabits } from "@/hooks/useHabits";
import { useAnalytics } from "@/hooks/useAnalytics";
import { BarChart3, TrendingUp, Target, Flame } from "lucide-react";
import { CompletionTrendChart } from "@/components/analytics/CompletionTrendChart";
import { HabitPerformanceChart } from "@/components/analytics/HabitPerformanceChart";
import { ActivityHeatmap } from "@/components/analytics/ActivityHeatmap";
import { StatCard } from "@/components/ui/StatCard";
import PageHeader from "@/components/ui/PageHeader";
import { ChartCard } from "@/components/ui/ChartCard";
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
        <PageHeader
          title="Analytics"
          description="Track your progress over the last 30 days"
          emoji="📊"
        />

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-6">
          <StatCard
            value={totalHabits}
            title="Active Habits"
            description="Currently tracking"
            icon={
              <BarChart3 className="w-4 h-4 lg:w-6 lg:h-6 text-blue-600 dark:text-blue-400" />
            }
            iconBgColor="bg-blue-100 dark:bg-blue-900/30"
          />

          <StatCard
            value={totalCompletions}
            title="Completions"
            description="Last 30 days"
            icon={
              <TrendingUp className="w-4 h-4 lg:w-6 lg:h-6 text-green-600 dark:text-green-400" />
            }
            iconBgColor="bg-green-100 dark:bg-green-900/30"
          />

          <StatCard
            value={`${averageRate}%`}
            title="Avg Rate"
            description="Completion rate"
            icon={
              <Target className="w-4 h-4 lg:w-6 lg:h-6 text-purple-600 dark:text-purple-400" />
            }
            iconBgColor="bg-purple-100 dark:bg-purple-900/30"
          />

          <StatCard
            value={bestStreak}
            title="Best Streak"
            description="Longest streak"
            icon={
              <Flame className="w-4 h-4 lg:w-6 lg:h-6 text-orange-600 dark:text-orange-400" />
            }
            iconBgColor="bg-orange-100 dark:bg-orange-900/30"
          />
        </div>

        {/* Activity Heatmap */}
        <ActivityHeatmap />

        {/* ⭐ Charts - REFACTORED */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4 lg:gap-6">
          <ChartCard
            title="Completion Trend"
            subtitle="Daily completions over the last 30 days"
          >
            <CompletionTrendChart data={lineChartData} />
          </ChartCard>

          <ChartCard
            title="Habit Performance"
            subtitle="Completion rate by habit (last 30 days)"
          >
            {barChartData.length > 0 ? (
              <HabitPerformanceChart data={barChartData} />
            ) : (
              <div className="h-52 md:h-75 flex items-center justify-center text-gray-500 dark:text-gray-400">
                <p>No habit data available</p>
              </div>
            )}
          </ChartCard>
        </div>
      </div>
    </DashboardLayout>
  );
}
