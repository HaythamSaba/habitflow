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
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🏆 Achievements
          </h1>
          <p className="text-gray-600">
            Unlock achievements by completing challenges and milestones!
          </p>
        </div>

        {/* Stats Overview */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Your Progress</h2>
              <p className="text-sm text-gray-600">
                {unlockedCount} of {totalCount} achievements unlocked
              </p>
            </div>
            <div className="text-4xl font-bold text-primary">
              {completionPercentage}%
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <div
              className="bg-primary h-full transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 flex-wrap">
          {["all", "completion", "streak", "points", "habit", "special"].map(
            (category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedCategory === category
                    ? "bg-primary text-primary-500 border border-primary-500 shadow-md"
                    : "bg-white text-gray-700 border border-gray-300 hover:border-primary"
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
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              ✨ Unlocked ({unlockedAchievements.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              🔒 Locked ({lockedAchievements.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No achievements in this category yet!
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
