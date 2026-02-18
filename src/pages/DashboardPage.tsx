import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  CheckCircle2,
  TrendingUp,
  Target,
  Award,
  Trophy,
  Sparkles,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useHabits } from "@/hooks/useHabits";
import TodayProgress from "@/components/dashboard/TodayProgress";
import { useCompletions } from "@/hooks/useCompletions";
import { useDashboardStreak } from "@/hooks/useDashboardStreak";
import { useUserStats } from "@/hooks/useUserStats";
import LevelProgress from "@/components/dashboard/LevelProgress";
import { useAchievements } from "@/hooks/useAchievements";
import { HabitPerformanceChart } from "@/components/analytics/HabitPerformanceChart";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useCategories } from "@/hooks/useCategories";
import { CategoryChips } from "@/components/categories/CategoryChips";
import HabitsContainer from "@/components/habits/HabitsContianer";
import { Button } from "@/components/ui/Button";
import { useNavigate } from "react-router-dom";
import { FeaturedTemplates } from "@/components/templates/FeaturedTemplates";
// Type definition for Achievement
type Achievement = {
  id: string;
  name: string;
  emoji: string;
  description: string;
  points_reward: number;
  rarity: string;
};

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

  // Filter habits based on selected category
  const filteredHabits = selectedCategoryId
    ? habits?.filter((habit) => habit.category_id === selectedCategoryId)
    : habits;

  // Calculate habits count for each category
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
  // Extract display name from user metadata or email
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
      <div className="space-y-4 md:space-y-6 lg:space-y-8 overflow-x-hidden p-4 sm:p-6 ">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 md:gap-3">
          <div className="w-full md:w-1/2 text-center md:text-left">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2 wrap-break-words">
              Welcome back,{" "}
              <span className="text-primary-500">{displayName}</span>! 👋
            </h2>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
              Ready to continue your habit journey? Let's make today count!
            </p>
            <Button
              variant="primary"
              className="mt-2"
              leftIcon={<Sparkles className="w-4 h-4" />}
              onClick={() => navigate("/templates")}
            >
              Browse Templates
            </Button>
          </div>
          <div className="w-full md:w-auto">
            <LevelProgress />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-6">
          {/* Active Habits Card */}
          <div className="bg-white dark:bg-gray-950 flex-1 rounded-xl p-2.5 sm:p-4 lg:p-6 shadow-sm border shadow-primary-100 dark:shadow-primary-800 hover:dark:shadow-xl border-gray-200 dark:border-primary-700 hover:shadow-xl transition-shadow duration-500">
            <div className="flex items-center justify-between mb-2 lg:mb-4">
              <div className="w-9 h-9 lg:w-12 lg:h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 lg:w-6 lg:h-6 text-primary" />
              </div>
              <span
                className="text-base sm:text-lg lg:text-2xl font-bold text-gray-900 dark:text-gray-100"
                style={{ fontFamily: "Sora, sans-serif" }}
              >
                {habits?.length || 0}
              </span>
            </div>
            <h3 className="text-xs lg:text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              Active Habits
            </h3>
            <p className="hidden sm:block text-xs text-gray-500 dark:text-gray-400">
              {habits?.length === 0
                ? "Start by creating your first habit"
                : `You have ${habits?.length} active ${habits?.length === 1 ? "habit" : "habits"}`}
            </p>
          </div>

          {/* Current Streak Card */}
          <div className="bg-white dark:bg-gray-950 flex-1 rounded-xl p-2.5 sm:p-4 lg:p-6 shadow-sm border shadow-primary-100 dark:shadow-primary-800 hover:dark:shadow-xl border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-500">
            <div className="flex items-center justify-between mb-2 lg:mb-4">
              <div className="w-9 h-9 lg:w-12 lg:h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-4 h-4 lg:w-6 lg:h-6 text-secondary" />
              </div>
              <span
                className="text-base sm:text-lg lg:text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-1 lg:gap-2"
                style={{ fontFamily: "Sora, sans-serif" }}
              >
                {maxStreak > 0 && <span>🔥</span>}
                {maxStreak}
              </span>
            </div>
            <h3 className="text-xs lg:text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              Current Streak
            </h3>
            <p className="hidden sm:block text-xs text-gray-500 dark:text-gray-400">
              {maxStreak === 0 && "Start a habit today!"}
              {maxStreak === 1 && "Great start!"}
              {maxStreak >= 2 && maxStreak < 7 && "Keep it up!"}
              {maxStreak >= 7 && maxStreak < 30 && "On fire! 🔥"}
              {maxStreak >= 30 && "Incredible! 🏆"}
            </p>
          </div>

          {/* Completion Rate Card */}
          <div className="bg-white dark:bg-gray-950 flex-1 rounded-xl p-2.5 sm:p-4 lg:p-6 shadow-sm border shadow-primary-100 dark:shadow-primary-800 hover:dark:shadow-xl border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-500">
            <div className="flex items-center justify-between mb-2 lg:mb-4">
              <div className="w-9 h-9 lg:w-12 lg:h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <Target className="w-4 h-4 lg:w-6 lg:h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <span
                className="text-base sm:text-lg lg:text-2xl font-bold text-gray-900 dark:text-gray-100"
                style={{ fontFamily: "Sora, sans-serif" }}
              >
                {completionRate}%
              </span>
            </div>
            <h3 className="text-xs lg:text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              Completion Rate
            </h3>
            <p className="hidden sm:block text-xs text-gray-500 dark:text-gray-400">
              {completionRate === 0
                ? "Start completing habits!"
                : completionRate === 100
                  ? "You did it! 🎉"
                  : "Keep going!"}
            </p>
          </div>

          {/* Points Card */}
          <div className="bg-white dark:bg-gray-950 flex-1 rounded-xl p-2.5 sm:p-4 lg:p-6 shadow-sm border shadow-primary-100 dark:shadow-primary-800 hover:dark:shadow-xl border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-500">
            <div className="flex items-center justify-between mb-2 lg:mb-4">
              <div className="w-9 h-9 lg:w-12 lg:h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <Award className="w-4 h-4 lg:w-6 lg:h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <span
                className="text-base sm:text-lg lg:text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-1"
                style={{ fontFamily: "Sora, sans-serif" }}
              >
                {levelData?.emoji}
                {totalPoints}
              </span>
            </div>
            <h3 className="text-xs lg:text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              Total Points
            </h3>
            <p className="hidden sm:block text-xs text-gray-500 dark:text-gray-400">
              {totalPoints === 0 && "Complete habits to earn points!"}
              {totalPoints > 0 &&
                totalPoints < 100 &&
                `Level ${levelData?.level} - ${levelData?.label}`}
              {totalPoints >= 100 &&
                `${levelData?.emoji} Level ${levelData?.level} - ${levelData?.label}`}
            </p>
          </div>
        </div>

        {/* Progress + Achievement Count */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4 lg:gap-6">
          <TodayProgress />

          {/* Achievement Count Card */}
          <div className="bg-white dark:bg-gray-950 flex-1 rounded-xl p-4 lg:p-6 shadow-sm border shadow-primary-100 dark:shadow-primary-800 hover:dark:shadow-xl border-gray-200 dark:border-primary-700 hover:shadow-xl transition-shadow duration-500">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                <Trophy className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <span
                className="text-2xl font-bold text-gray-900 dark:text-gray-100"
                style={{ fontFamily: "Sora, sans-serif" }}
              >
                {unlockedAchievements.length}/{allAchievements.length}
              </span>
            </div>
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              Achievements
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {unlockedAchievements.length === 0 &&
                "Start unlocking achievements!"}
              {unlockedAchievements.length > 0 &&
                unlockedAchievements.length < 5 &&
                "Great start!"}
              {unlockedAchievements.length >= 5 &&
                unlockedAchievements.length < 10 &&
                "You're doing amazing!"}
              {unlockedAchievements.length >= 10 &&
                unlockedAchievements.length < 15 &&
                "Achievement hunter!"}
              {unlockedAchievements.length >= 15 &&
                "Almost collected them all!"}
            </p>
          </div>
        </div>

        {/* Recent Achievements Section */}
        {unlockedAchievements.length > 0 && (
          <div>
            <div className="card bg-white dark:bg-gray-900 rounded-2xl p-3 sm:p-4 md:p-6 shadow-lg shadow-primary-200 dark:shadow-gray-900 border border-gray-300 dark:border-gray-700">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 md:mb-6 gap-2">
                <div>
                  <h2 className="text-lg md:text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    🏆 Recent Achievements
                  </h2>
                  <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Your latest unlocked achievements
                  </p>
                </div>
                <a
                  href="/achievements"
                  className="text-sm font-medium text-primary hover:underline flex items-center gap-1 min-h-11 shrink-0"
                >
                  View All
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </a>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                {unlockedAchievements
                  .slice(0, 3)
                  .map((achievement: Achievement) => (
                    <div
                      key={achievement.id}
                      className="p-3 md:p-4 rounded-lg border-2 border-primary bg-primary/5 dark:bg-primary/10 hover:bg-primary/10 dark:hover:bg-primary/20 transition-all"
                    >
                      <div className="flex items-center gap-2 sm:gap-3 mb-2">
                        <span className="text-2xl md:text-3xl shrink-0">
                          {achievement.emoji}
                        </span>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-sm md:text-base text-gray-900 dark:text-gray-100 truncate">
                            {achievement.name}
                          </h3>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 dark:bg-primary/30 text-primary font-medium">
                            {achievement.rarity}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                        {achievement.description}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-yellow-600 dark:text-yellow-500">
                        <span>⭐</span>
                        <span className="font-semibold">
                          +{achievement.points_reward} points
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* Next Achievement Preview */}
        {unlockedAchievements.length < allAchievements.length && (
          <div className="bg-linear-to-r from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 rounded-xl p-3 sm:p-4 md:p-6 border border-primary-800 dark:border-primary-100">
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
        <div className="flex flex-col xl:flex-row justify-between items-stretch gap-3 sm:gap-4 lg:gap-6">
          {/* Habits Container */}
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
        {habits && habits.length > 0 && <FeaturedTemplates />}
      </div>
    </DashboardLayout>
  );
}

export default DashboardPage;
