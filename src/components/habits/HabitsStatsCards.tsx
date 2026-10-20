import { CheckCircle2, Flame, Target, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/Card";

interface HabitStatsCardsProps {
  totalHabits: number;
  activeHabits: number;
  archivedHabits: number;
  avgCompletionRate: number;
  longestStreak: number;
  isLoading?: boolean;
}

const TILE =
  "p-3 sm:p-4 lg:p-6 shadow-xl transition-all duration-300 ease-out hover:-translate-y-1";

export default function HabitsStatsCards({
  totalHabits,
  activeHabits,
  archivedHabits,
  avgCompletionRate,
  longestStreak,
  isLoading = false,
}: HabitStatsCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="p-3 sm:p-4 lg:p-6 shadow-xl animate-pulse">
            <div className="h-9 w-9 sm:h-10 sm:w-10 lg:h-12 lg:w-12 bg-gray-200 dark:bg-gray-700 rounded-xl mb-4" />
            <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
          </Card>
        ))}
      </div>
    );
  }

  const tiles = [
    {
      title: "Total Habits",
      value: totalHabits,
      description: `${archivedHabits} archived`,
      icon: CheckCircle2,
      chip: "from-blue-500 to-cyan-500",
      shadowHover:
        "hover:shadow-[0_12px_35px_rgba(59,130,246,0.25)] dark:hover:shadow-[0_12px_35px_rgba(59,130,246,0.18)]",
    },
    {
      title: "Active Habits",
      value: activeHabits,
      description: "Currently tracking",
      icon: TrendingUp,
      chip: "from-green-500 to-emerald-500",
      shadowHover:
        "hover:shadow-[0_12px_35px_rgba(34,197,94,0.25)] dark:hover:shadow-[0_12px_35px_rgba(34,197,94,0.18)]",
    },
    {
      title: "Avg Rate",
      value: `${avgCompletionRate}%`,
      description: "Completion rate",
      icon: Target,
      chip: "from-purple-500 to-pink-500",
      shadowHover:
        "hover:shadow-[0_12px_35px_rgba(168,85,247,0.25)] dark:hover:shadow-[0_12px_35px_rgba(168,85,247,0.18)]",
    },
    {
      title: "Best Streak",
      value: longestStreak,
      description: "Longest streak",
      icon: Flame,
      chip: "from-orange-500 to-red-500",
      shadowHover:
        "hover:shadow-[0_12px_35px_rgba(249,115,22,0.25)] dark:hover:shadow-[0_12px_35px_rgba(249,115,22,0.18)]",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-6">
      {tiles.map(
        ({ title, value, description, icon: Icon, chip, shadowHover }) => (
          <Card key={title} className={`${TILE} ${shadowHover}`}>
            <div className="flex items-center justify-between mb-2 lg:mb-4">
              <div
                className={`w-9 h-9 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-linear-to-br ${chip} rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg`}
              >
                <Icon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
              </div>

              <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100">
                {value}
              </span>
            </div>

            <h3 className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400 mb-0.5 sm:mb-1">
              {title}
            </h3>

            <p className="hidden sm:block text-xs text-gray-500 dark:text-gray-400">
              {description}
            </p>
          </Card>
        ),
      )}
    </div>
  );
}
