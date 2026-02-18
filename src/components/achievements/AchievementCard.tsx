interface AchievementCardProps {
  achievement: {
    id: string;
    key: string;
    name: string;
    description: string;
    emoji: string;
    category: string;
    condition_value: number;
    points_reward: number;
    rarity: string;
  };
  unlocked: boolean;
  progress?: number;
}

export function AchievementCard({
  achievement,
  unlocked,
  progress = 0,
}: AchievementCardProps) {
  // Rarity colors
  const rarityColors = {
    common: "border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-800",
    rare: "border-blue-300 bg-blue-50 dark:border-blue-600 dark:bg-blue-800",
    epic: "border-purple-300 bg-purple-50 dark:border-purple-600 dark:bg-purple-800",
    legendary: "border-orange-300 bg-orange-50 dark:border-orange-600 dark:bg-orange-800",
  };

  const rarityColor =
    rarityColors[achievement.rarity as keyof typeof rarityColors] ||
    rarityColors.common;

  return (
    <div
      // RESPONSIVE: Reduced padding on mobile (p-3 sm:p-4) → desktop (lg:p-6)
      className={`relative rounded-xl p-3 sm:p-4 lg:p-6 border-2 transition-all duration-300 ${
        unlocked
          ? `${rarityColor} shadow-md hover:shadow-lg hover:scale-105`
          : "border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-950 opacity-60"
      }`}
    >
      {/* Locked overlay */}
      {!unlocked && (
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
          {/* RESPONSIVE: Smaller lock icon on mobile */}
          <span className="text-xl sm:text-2xl">🔒</span>
        </div>
      )}

      {/* Achievement emoji */}
      {/* RESPONSIVE: Reduced margin and emoji size on mobile */}
      <div className="text-center mb-2 sm:mb-3 lg:mb-4">
        <span
          className={`text-4xl sm:text-5xl lg:text-6xl ${unlocked ? "animate-fadeIn" : "grayscale opacity-50"}`}
        >
          {achievement.emoji}
        </span>
      </div>

      {/* Achievement name */}
      {/* RESPONSIVE: Smaller text on mobile, truncate if too long */}
      <h3
        className={`text-sm sm:text-base lg:text-lg font-bold text-center mb-1 sm:mb-2 line-clamp-2 ${
          unlocked ? "text-gray-900 dark:text-gray-100" : "text-gray-500 dark:text-gray-300"
        }`}
      >
        {achievement.name}
      </h3>

      {/* Description */}
      {/* RESPONSIVE: Smaller text, line-clamp-2 to prevent overflow on small cards */}
      <p
        className={`text-xs sm:text-sm text-center mb-2 sm:mb-3 lg:mb-4 line-clamp-2 ${
          unlocked ? "text-gray-600 dark:text-gray-400" : "text-gray-400"
        }`}
      >
        {achievement.description}
      </p>

      {/* Progress bar (only for locked) */}
      {!unlocked && progress > 0 && (
        <div className="mb-2 sm:mb-3">
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-1.5 sm:h-2 overflow-hidden">
            <div
              className="bg-primary-500 h-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Points reward */}
      <div className="flex items-center justify-center gap-1 sm:gap-2">
        <span className="text-yellow-500">⭐</span>
        <span
          className={`text-xs sm:text-sm font-semibold ${
            unlocked ? "text-gray-700" : "text-gray-400"
          }`}
        >
          +{achievement.points_reward} pts
        </span>
      </div>

      {/* Rarity badge */}
      {/* RESPONSIVE: Smaller badge on mobile, positioned tighter */}
      <div className="absolute top-2 left-2 sm:top-3 sm:left-3">
        <span
          className={`text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full font-semibold ${
            achievement.rarity === "common" && "bg-gray-200 text-gray-700 dark:text-gray-400 dark:bg-gray-700"
          } ${achievement.rarity === "rare" && "bg-blue-200 text-blue-700 dark:text-blue-100 dark:bg-blue-500"} ${
            achievement.rarity === "epic" && "bg-purple-200 text-purple-700 dark:text-purple-100 dark:bg-purple-500"
          } ${
            achievement.rarity === "legendary" &&
            "bg-orange-200 text-orange-700 dark:text-orange-100 dark:bg-orange-500"
          }`}
        >
          {achievement.rarity}
        </span>
      </div>
    </div>
  );
}