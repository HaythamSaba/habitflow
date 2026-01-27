import { useAuth } from "@/hooks/useAuth";
import { CheckCircle2, TrendingUp, Target, Award } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import HabitsContianer from "@/components/habits/HabitsContianer";
import { useHabits } from "@/hooks/useHabits";
import TodayProgress from "@/components/dashboard/TodayProgress";
import { useCompletions } from "@/hooks/useCompletions";
import { useDashboardStreak } from "@/hooks/useDashboardStreak";

export function DashboardPage() {
  const { user } = useAuth();
  const { habits } = useHabits();
  const { completions } = useCompletions();
  const { maxStreak } = useDashboardStreak(); // ⭐ NEW

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
      {/* Welcome Section */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, <span className="text-primary-500 ">{displayName}</span>{" "}
          ! 👋
        </h2>
        <p className="text-gray-600">
          Ready to continue your habit journey? Let's make today count!
        </p>
      </div>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ">
        {/* Total Habits Card */}
        <div className="card  rounded-xl p-6 border border-gray-200 shadow-md shadow-primary-100 hover:shadow-xl transition-all hover:scale-105">
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

        {/* Current Streak Card - ⭐ UPDATED */}
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
              className="text-2xl font-bold text-gray-900"
              style={{ fontFamily: "Sora, sans-serif" }}
            >
              0
            </span>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">
            Total Points
          </h3>
          <p className="text-xs text-gray-500">Earn points for completions</p>
        </div>
      </div>
      <TodayProgress />

      <div className="card bg-white rounded-2xl p-12 shadow-lg shadow-primary-200 border border-gray-300">
        <HabitsContianer />
      </div>

      {/* Coming Soon Notice */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800 text-center">
          🚀 <strong>Coming in Day 3-7:</strong> Habit creation, editing,
          completion tracking, and more!
        </p>
      </div>
    </DashboardLayout>
  );
}

export default DashboardPage;
