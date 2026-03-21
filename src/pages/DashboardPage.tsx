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
  const { habits: allHabits } = useHabits();
  const { completions } = useCompletions();
  const { maxStreak } = useDashboardStreak();
  const { totalPoints, levelData } = useUserStats();
  const { unlockedAchievements, allAchievements } = useAchievements();
  const { barChartData } = useAnalytics();

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );

  const habits = allHabits?.filter((habit) => !habit.archived);

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

  const lockedAchievements = allAchievements.filter(
    (achievement) => !unlockedAchievements.includes(achievement.id),
  );

  return (
    <DashboardLayout>
      <div className="space-y-4 md:space-y-6 lg:space-y-8 overflow-x-hidden p-4 sm:p-6">
        {/* ⭐ Header - Extracted */}
        <DashboardHeader
          displayName={displayName}
          onBrowseTemplates={() => navigate("/templates")}
        />

        {/* ⭐ Stats Grid - Already refactored with DashboardCard */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-8">
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
            value={completionRate}
            isPercentage
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
          <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-primary-200 to-secondary-200 dark:bg-linear-to-br dark:from-primary-900 dark:to-secondary-900 p-4 sm:p-6 md:p-8 lg:p-6">
            {/* Animated background glow */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-linear-to-br from-orange-400/20 to-yellow-400/20 rounded-full blur-3xl animate-pulse"></div>

            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🔥</span>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    Keep Going!
                  </h3>
                </div>
                <div className="px-3 py-1 rounded-full bg-secondary-500 dark:bg-secondary-900">
                  <span className="text-xs font-bold text-orange-700 dark:text-orange-300">
                    {Math.round(
                      (unlockedAchievements.length / allAchievements.length) *
                        100,
                    )}
                    % Complete
                  </span>
                </div>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-200 mb-4">
                You've unlocked{" "}
                <span className="font-bold text-orange-600 dark:text-orange-400">
                  {unlockedAchievements.length}
                </span>{" "}
                out of{" "}
                <span className="font-bold">{allAchievements.length}</span>{" "}
                achievements. Only{" "}
                <span className="font-bold text-orange-600 dark:text-orange-400">
                  {allAchievements.length - unlockedAchievements.length}
                </span>{" "}
                more to go!
              </p>

              {/* Mini achievement icons preview */}
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {lockedAchievements.slice(0, 5).map((achievement, i) => (
                    <div
                      key={achievement.id}
                      className="w-10 h-10 rounded-full bg-white dark:bg-primary-900 border-2 border-primary-100 dark:border-primary-500 flex items-center justify-center"
                      style={{ zIndex: 5 - i }}
                    >
                      <span className="text-lg filter  ">
                        {achievement.emoji}
                      </span>
                    </div>
                  ))}
                  {lockedAchievements.length > 5 && (
                    <div className="w-10 h-10 rounded-full bg-secondary-100 dark:bg-secondary-900 border-2 border-secondary-300 dark:border-secondary-700 flex items-center justify-center">
                      <span className="text-xs font-bold text-secondary-700 dark:text-secondary-300">
                        +{lockedAchievements.length - 5}
                      </span>
                    </div>
                  )}
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-200 ml-2">
                  Waiting to be unlocked
                </span>
              </div>
            </div>
          </div>
        )}
        
        {/* Category Filter */}
        {categories.length > 0 && (
          <div className="flex items-center gap-2 md:gap-4 min-w-0 w-full scrollbar-hide">
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
