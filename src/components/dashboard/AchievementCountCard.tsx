import { Trophy } from "lucide-react";

interface AchievementCountCardProps {
  unlocked: number;
  total: number;
}

export function AchievementCountCard({
  unlocked,
  total,
}: AchievementCountCardProps) {
  // Dynamic description based on progress
  const getDescription = () => {
    if (unlocked === 0) return "Start unlocking achievements!";
    if (unlocked < 5) return "Great start!";
    if (unlocked < 10) return "You're doing amazing!";
    if (unlocked < 15) return "Achievement hunter!";
    return "Almost collected them all!";
  };

  return (
    <div className="bg-white dark:bg-gray-950 flex-1 rounded-xl p-4 lg:p-6 shadow-sm border shadow-primary-100 dark:shadow-primary-800 hover:dark:shadow-xl border-gray-200 dark:border-primary-700 hover:shadow-xl transition-shadow duration-500">
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
          <Trophy className="w-6 h-6 text-orange-600 dark:text-orange-400" />
        </div>
        <span
          className="text-2xl font-bold text-gray-900 dark:text-gray-100"
          style={{ fontFamily: "Sora, sans-serif" }}
        >
          {unlocked}/{total}
        </span>
      </div>
      <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
        Achievements
      </h3>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        {getDescription()}
      </p>
    </div>
  );
}
