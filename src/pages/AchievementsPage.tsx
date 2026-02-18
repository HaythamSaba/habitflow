import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAchievements } from "@/hooks/useAchievements";
import { AchievementCard } from "@/components/achievements/AchievementCard";
import { calculateAchievementProgress } from "@/lib/achievements";
import { useHabits } from "@/hooks/useHabits";
import { useCompletions } from "@/hooks/useCompletions";
import { useUserStats } from "@/hooks/useUserStats";
import { useDashboardStreak } from "@/hooks/useDashboardStreak";
import { useMemo, useState } from "react";

export function AchievementsPage() {
  const { allAchievements, unlockedIds, isLoading } = useAchievements();
  const { habits } = useHabits();
  const { completions } = useCompletions();
  const { totalPoints } = useUserStats();
  const { maxStreak } = useDashboardStreak();

  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Calculate stats for progress
  const stats = useMemo(
    () => ({
      totalCompletions: completions?.length || 0,
      currentStreak: maxStreak,
      totalPoints: totalPoints,
      totalHabits: habits?.length || 0,
      completions: completions || [],
    }),
    [completions, maxStreak, totalPoints, habits],
  );

  // Calculate progress for all achievements
  const progressMap = useMemo(
    () => calculateAchievementProgress(allAchievements, unlockedIds, stats),
    [allAchievements, unlockedIds, stats],
  );

  // Filter achievements by category
  const filteredAchievements = useMemo(() => {
    if (selectedCategory === "all") return allAchievements;
    return allAchievements.filter((a) => a.category === selectedCategory);
  }, [allAchievements, selectedCategory]);

  // Group achievements
  const unlockedAchievements = filteredAchievements.filter((a) =>
    unlockedIds.includes(a.id),
  );
  const lockedAchievements = filteredAchievements.filter(
    (a) => !unlockedIds.includes(a.id),
  );

  // Calculate stats
  const totalCount = allAchievements.length;
  const unlockedCount = unlockedIds.length;
  const completionPercentage = Math.round((unlockedCount / totalCount) * 100);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading achievements...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* RESPONSIVE: overflow-x-hidden prevents horizontal scroll on small screens */}
      <div className="space-y-4 md:space-y-6 lg:space-y-8 overflow-x-hidden">
        {/* Header */}
        <div>
          {/* RESPONSIVE: Smaller heading on mobile */}
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1 md:mb-2">
            🏆 Achievements
          </h1>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
            Unlock achievements by completing challenges and milestones!
          </p>
        </div>

        {/* Stats Overview */}
        {/* RESPONSIVE: Reduced padding on mobile (p-3 sm:p-4) → desktop (lg:p-6) */}
        <div className="bg-white dark:bg-gray-950 rounded-xl p-3 sm:p-4 lg:p-6 border border-gray-200 dark:border-primary-700">
          {/* RESPONSIVE: Stack on very small screens, row on sm+ */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 md:mb-4 gap-2">
            <div>
              {/* RESPONSIVE: Smaller subheading on mobile */}
              <h2 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 dark:text-gray-100">
                Your Progress
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                {unlockedCount} of {totalCount} achievements unlocked
              </p>
            </div>
            {/* RESPONSIVE: Smaller percentage on mobile */}
            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary shrink-0">
              {completionPercentage}%
            </div>
          </div>

          {/* Progress bar */}
          {/* RESPONSIVE: Slightly thinner on mobile (h-3) → desktop (h-4) */}
          <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-3 md:h-4 overflow-hidden">
            <div
              className="bg-primary-500 h-full transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>

        {/* Category Filter */}
        {/* RESPONSIVE: Horizontal scroll on mobile with scrollbar hidden,
            min-h-[44px] on each button for touch targets */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 -mb-1">
          {["all", "completion", "streak", "points", "habit", "special"].map(
            (category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 sm:px-4 py-2 min-h-11 rounded-lg font-medium transition-all text-sm sm:text-base whitespace-nowrap shrink-0 ${
                  selectedCategory === category
                    ? "bg-primary text-primary-500 border border-primary-500 shadow-md dark:bg-primary-900 dark:text-primary-300 dark:border-primary-300"
                    : "bg-white text-gray-700 border border-gray-300 hover:border-primary dark:bg-gray-950 dark:text-gray-400 dark:border-gray-600 hover:dark:border-primary-500"
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ),
          )}
        </div>

        {/* Unlocked Achievements */}
        {unlockedAchievements.length > 0 && (
          <div>
            {/* RESPONSIVE: Smaller section heading on mobile */}
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3 md:mb-4">
              ✨ Unlocked ({unlockedAchievements.length})
            </h2>
            {/* RESPONSIVE: 1 col on mobile → 2 on md → 3 on lg → 4 on xl
                Reduced gap on mobile (gap-3) → desktop (gap-4 lg:gap-6) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
              {unlockedAchievements.map((achievement) => (
                <AchievementCard
                  key={achievement.id}
                  achievement={achievement}
                  unlocked={true}
                  progress={100}
                />
              ))}
            </div>
          </div>
        )}

        {/* Locked Achievements */}
        {lockedAchievements.length > 0 && (
          <div>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3 md:mb-4">
              🔒 Locked ({lockedAchievements.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
              {lockedAchievements.map((achievement) => (
                <AchievementCard
                  key={achievement.id}
                  achievement={achievement}
                  unlocked={false}
                  progress={progressMap.get(achievement.id) || 0}
                />
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {filteredAchievements.length === 0 && (
          // RESPONSIVE: Less vertical padding on mobile
          <div className="text-center py-8 md:py-12">
            <p className="text-gray-500 text-base md:text-lg">
              No achievements in this category yet!
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
