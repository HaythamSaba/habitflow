import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useHabits } from "@/hooks/useHabits";
import { useCompletions } from "@/hooks/useCompletions";
import { useDashboardStreak } from "@/hooks/useDashboardStreak";
import { useUserStats } from "@/hooks/useUserStats";
import { useAchievements } from "@/hooks/useAchievements";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useCategories } from "@/hooks/useCategories";
import { CheckCircle2, TrendingUp, Target, Award } from "lucide-react";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import TodayProgress from "@/components/dashboard/TodayProgress";
import { AchievementCountCard } from "@/components/dashboard/AchievementCountCard";
import { CategoryChips } from "@/components/categories/CategoryChips";
import HabitsContainer from "@/components/habits/HabitsContianer";
import { HabitPerformanceChart } from "@/components/analytics/HabitPerformanceChart";
import { FeaturedTemplates } from "@/components/templates/FeaturedTemplates";
import { RecentAchievementsSection } from "@/components/dashboard/RecentAchievementsSection";
import { StatCard } from "@/components/ui/StatCard";

export function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { categories } = useCategories();
  const { habits } = useHabits();
  const { completions } = useCompletions();
  const { maxStreak } = useDashboardStreak();
  const { totalPoints, levelData } = useUserStats();
  const { unlockedAchievements, allAchievements } = useAchievements();
  const { barChartData } = useAnalytics();

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );

  // Computed values
  const filteredHabits = selectedCategoryId
    ? habits?.filter((habit) => habit.category_id === selectedCategoryId)
    : habits;

  const habitCounts = {
    all: habits?.length || 0,
    ...categories.reduce(
      (acc, category) => {
        acc[category.id] =
          habits?.filter((habit) => habit.category_id === category.id).length ||
          0;
        return acc;
      },
      {} as Record<string, number>,
    ),
  };

  const displayName =
    user?.user_metadata?.display_name || user?.email?.split("@")[0] || "User";

  const totalTargets =
    filteredHabits?.reduce((sum, habit) => sum + habit.target, 0) || 0;

  const completionRate =
    totalTargets > 0
      ? Math.round(((completions?.length || 0) / totalTargets) * 100)
      : 0;

  return (
    <DashboardLayout>
      <div className="space-y-4 md:space-y-6 lg:space-y-8 overflow-x-hidden p-4 sm:p-6">
        {/* ⭐ Header - Extracted */}
        <DashboardHeader
          displayName={displayName}
          onBrowseTemplates={() => navigate("/templates")}
        />

        {/* ⭐ Stats Grid - Already refactored with DashboardCard */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-6">
          <StatCard
            value={habits?.length || 0}
            title="Active Habits"
            description={
              habits?.length === 0
                ? "Start by creating your first habit"
                : `You have ${habits?.length} active ${habits?.length === 1 ? "habit" : "habits"}`
            }
            icon={
              <CheckCircle2 className="w-4 h-4 lg:w-6 lg:h-6 text-primary-600 dark:text-primary-400" />
            }
            iconBgColor="bg-emerald-100 dark:bg-emerald-900/30"
          />

          <StatCard
            value={maxStreak}
            title="Current Streak"
            description={
              maxStreak === 0
                ? "Start a habit today!"
                : maxStreak === 1
                  ? "Great start!"
                  : maxStreak >= 2 && maxStreak < 7
                    ? "Keep it up!"
                    : maxStreak >= 7 && maxStreak < 30
                      ? "On fire! 🔥"
                      : "Incredible! 🏆"
            }
            icon={
              <TrendingUp className="w-4 h-4 lg:w-6 lg:h-6 text-yellow-600 dark:text-yellow-400" />
            }
            iconBgColor="bg-yellow-100 dark:bg-yellow-800/30"
            showEmoji={maxStreak > 0}
            emoji="🔥"
          />

          <StatCard
            value={`${completionRate}%`}
            title="Completion Rate"
            description={
              completionRate === 0
                ? "Start completing habits!"
                : completionRate === 100
                  ? "You did it! 🎉"
                  : "Keep going!"
            }
            icon={
              <Target className="w-4 h-4 lg:w-6 lg:h-6 text-blue-600 dark:text-blue-400" />
            }
            iconBgColor="bg-blue-100 dark:bg-blue-900/30"
          />

          <StatCard
            value={totalPoints}
            title="Total Points"
            description={
              totalPoints === 0
                ? "Complete habits to earn points!"
                : totalPoints > 0 && totalPoints < 100
                  ? `Level ${levelData?.level} - ${levelData?.label}`
                  : `${levelData?.emoji} Level ${levelData?.level} - ${levelData?.label}`
            }
            icon={
              <Award className="w-4 h-4 lg:w-6 lg:h-6 text-purple-600 dark:text-purple-400" />
            }
            iconBgColor="bg-purple-100 dark:bg-purple-900/30"
            showEmoji={true}
            emoji={levelData?.emoji}
          />
        </div>

        {/* Progress + Achievement Count */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4 lg:gap-6">
          <TodayProgress />
          {/* ⭐ Achievement Card - Extracted */}
          <AchievementCountCard
            unlocked={unlockedAchievements.length}
            total={allAchievements.length}
          />
        </div>

        {/* ⭐ Recent Achievements - Extracted */}
        <RecentAchievementsSection
          achievements={unlockedAchievements.slice(0, 3)}
        />

        {/* Next Achievement Preview */}
        {unlockedAchievements.length < allAchievements.length && (
          <div className="bg-linear-to-r from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 rounded-xl p-3 sm:p-4 md:p-6 border border-primary-200 dark:border-primary-800">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  🎯 Next Achievement
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Keep going to unlock more!
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xl md:text-2xl font-bold text-primary">
                  {allAchievements.length - unlockedAchievements.length}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  remaining
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Category Filter */}
        {categories.length > 0 && (
          <div className="flex items-center gap-2 md:gap-4 overflow-x-auto min-w-0 w-full scrollbar-hide">
            <CategoryChips
              categories={categories}
              selectedCategoryId={selectedCategoryId}
              onSelectCategory={setSelectedCategoryId}
              habitCounts={habitCounts}
            />
          </div>
        )}

        {/* Habits + Chart */}
        <div className="flex flex-col xl:flex-row justify-between items-stretch gap-3 sm:gap-4 lg:gap-6">
          <div className="card bg-white dark:bg-gray-950 rounded-2xl p-3 sm:p-4 lg:p-6 xl:p-10 shadow-lg shadow-primary-200 dark:shadow-gray-900 border border-gray-300 dark:border-gray-700 xl:flex-1">
            <HabitsContainer filteredHabits={filteredHabits} />
          </div>
          <div className="w-full xl:w-1/2">
            {barChartData.length > 0 ? (
              <HabitPerformanceChart data={barChartData} />
            ) : (
              <div className="h-52 md:h-75 flex items-center justify-center text-gray-500 dark:text-gray-400">
                <p>No habit data available</p>
              </div>
            )}
          </div>
        </div>

        {/* Featured Templates */}
        {habits && habits.length > 0 && <FeaturedTemplates />}
      </div>
    </DashboardLayout>
  );
}

export default DashboardPage;
