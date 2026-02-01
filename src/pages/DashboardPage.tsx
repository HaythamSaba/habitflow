import { useAuth } from "@/hooks/useAuth";
import { CheckCircle2, TrendingUp, Target, Award, Trophy } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import HabitsContianer from "@/components/habits/HabitsContianer";
import { useHabits } from "@/hooks/useHabits";
import TodayProgress from "@/components/dashboard/TodayProgress";
import { useCompletions } from "@/hooks/useCompletions";
import { useDashboardStreak } from "@/hooks/useDashboardStreak";
import { useUserStats } from "@/hooks/useUserStats";
import LevelProgress from "@/components/dashboard/LevelProgress";
import { useAchievements } from "@/hooks/useAchievements";

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
  const { user } = useAuth();
  const { habits } = useHabits();
  const { completions } = useCompletions();
  const { maxStreak } = useDashboardStreak();
  const { totalPoints, levelData } = useUserStats();
  const { unlockedAchievements, allAchievements } = useAchievements();

  // Extract display name from user metadata or email
  const displayName =
    user?.user_metadata?.display_name || user?.email?.split("@")[0] || "User";

  const totalTargets = habits?.reduce(
    (sum, habit) => sum + (habit.target_count || 0),
    0,
  );
  const completionRate =
    totalTargets > 0
      ? Math.round(((completions?.length || 0) / totalTargets) * 100)
      : 0;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="flex items-center justify-between gap-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back,{" "}
              <span className="text-primary-500">{displayName}</span>! 👋
            </h2>
            <p className="text-gray-600">
              Ready to continue your habit journey? Let's make today count!
            </p>
          </div>
          <LevelProgress />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Active Habits Card */}
          <div className="card rounded-xl p-6 border border-gray-200 shadow-md shadow-primary-100 hover:shadow-xl transition-all hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-primary" />
              </div>
              <span
                className="text-2xl font-bold text-gray-900"
                style={{ fontFamily: "Sora, sans-serif" }}
              >
                {habits?.length || 0}
              </span>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">
              Active Habits
            </h3>
            <p className="text-xs text-gray-500">
              {habits?.length === 0
                ? "Start by creating your first habit"
                : `You have ${habits?.length} active ${habits?.length === 1 ? "habit" : "habits"}`}
            </p>
          </div>

          {/* Current Streak Card */}
          <div className="card bg-white rounded-xl p-6 border border-gray-200 shadow-md shadow-primary-100 hover:shadow-xl transition-all hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-secondary" />
              </div>
              <span
                className="text-2xl font-bold text-gray-900 flex items-center gap-2"
                style={{ fontFamily: "Sora, sans-serif" }}
              >
                {maxStreak > 0 && <span>🔥</span>}
                {maxStreak}
              </span>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">
              Current Streak
            </h3>
            <p className="text-xs text-gray-500">
              {maxStreak === 0 && "Start a habit today!"}
              {maxStreak === 1 && "Great start!"}
              {maxStreak >= 2 && maxStreak < 7 && "Keep it up!"}
              {maxStreak >= 7 && maxStreak < 30 && "On fire! 🔥"}
              {maxStreak >= 30 && "Incredible! 🏆"}
            </p>
          </div>

          {/* Completion Rate Card */}
          <div className="card bg-white rounded-xl p-6 border border-gray-200 shadow-md shadow-primary-100 hover:shadow-xl transition-all hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <span
                className="text-2xl font-bold text-gray-900"
                style={{ fontFamily: "Sora, sans-serif" }}
              >
                {completionRate}%
              </span>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">
              Completion Rate
            </h3>
            <p className="text-xs text-gray-500">
              {completionRate === 0
                ? "Start completing habits!"
                : completionRate === 100
                  ? "You did it! 🎉"
                  : "Keep going!"}
            </p>
          </div>

          {/* Points Card */}
          <div className="card bg-white rounded-xl p-6 border border-gray-200 shadow-md shadow-primary-100 hover:shadow-xl transition-all hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-purple-600" />
              </div>
              <span
                className="text-2xl font-bold text-gray-900 flex items-center gap-1"
                style={{ fontFamily: "Sora, sans-serif" }}
              >
                {levelData?.emoji}
                {totalPoints}
              </span>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">
              Total Points
            </h3>
            <p className="text-xs text-gray-500">
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TodayProgress />

          {/* Achievement Count Card */}
          <div className="card bg-white rounded-xl p-6 border border-gray-200 shadow-md shadow-primary-100 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Trophy className="w-6 h-6 text-orange-600" />
              </div>
              <span
                className="text-2xl font-bold text-gray-900"
                style={{ fontFamily: "Sora, sans-serif" }}
              >
                {unlockedAchievements.length}/{allAchievements.length}
              </span>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">
              Achievements
            </h3>
            <p className="text-xs text-gray-500">
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
            <div className="card bg-white rounded-2xl p-6 shadow-lg shadow-primary-200 border border-gray-300">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    🏆 Recent Achievements
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Your latest unlocked achievements
                  </p>
                </div>
                <a
                  href="/achievements"
                  className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {unlockedAchievements
                  .slice(0, 3)
                  .map((achievement: Achievement) => (
                    <div
                      key={achievement.id}
                      className="p-4 rounded-lg border-2 border-primary bg-primary/5 hover:bg-primary/10 transition-all"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-3xl">{achievement.emoji}</span>
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900">
                            {achievement.name}
                          </h3>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary font-medium">
                            {achievement.rarity}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {achievement.description}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-yellow-600">
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
          <div className="bg-linear-to-r from-primary/10 to-primary/5 rounded-xl p-6 border border-primary/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">
                  🎯 Next Achievement
                </p>
                <p className="text-xs text-gray-600">
                  Keep going to unlock more!
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-primary">
                  {allAchievements.length - unlockedAchievements.length}
                </p>
                <p className="text-xs text-gray-600">remaining</p>
              </div>
            </div>
          </div>
        )}

        {/* Habits Container */}
        <div className="card bg-white rounded-2xl p-12 shadow-lg shadow-primary-200 border border-gray-300">
          <HabitsContianer />
        </div>
      </div>
    </DashboardLayout>
  );
}

export default DashboardPage;
