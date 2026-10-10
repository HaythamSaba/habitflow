interface AchievementToastProps {
  achievement: {
    name: string;
    emoji: string;
    description: string;
    points_reward: number;
    rarity: string;
  };
}

export function AchievementToast({ achievement }: AchievementToastProps) {
  // Rendered via toast.custom(), so it doesn't inherit the Toaster's
  // theme-aware styles: every color needs its own dark variant here
  const rarityColors = {
    common:
      "bg-gray-100 border-gray-300 dark:bg-gray-800 dark:border-gray-600",
    rare: "bg-blue-100 border-blue-300 dark:bg-blue-950 dark:border-blue-700",
    epic: "bg-purple-100 border-purple-300 dark:bg-purple-950 dark:border-purple-700",
    legendary:
      "bg-orange-100 border-orange-300 dark:bg-orange-950 dark:border-orange-700",
  };

  const rarityColor =
    rarityColors[achievement.rarity as keyof typeof rarityColors] ||
    rarityColors.common;

  return (
    // RESPONSIVE: Reduced padding on mobile (p-3), constrained width so it doesn't overflow
    // role="status": custom toasts don't get react-hot-toast's live region,
    // so announce the unlock to screen readers here
    <div
      role="status"
      aria-live="polite"
      className={`p-3 sm:p-4 rounded-lg border-2 shadow-lg ${rarityColor} w-[calc(100vw-2rem)] sm:w-auto sm:min-w-75 max-w-sm`}
    >
      <div className="flex items-start gap-2 sm:gap-3">
        {/* Emoji: one celebratory pop on arrival (was an endless bounce) */}
        <div
          className="text-3xl sm:text-4xl animate-pop shrink-0"
          aria-hidden="true"
        >
          {achievement.emoji}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm sm:text-base">
              🎉 Achievement Unlocked!
            </h3>
          </div>
          <p className="font-semibold text-base sm:text-lg text-gray-800 dark:text-gray-100 mb-1 truncate">
            {achievement.name}
          </p>
          {/* line-clamp-2 prevents long descriptions from blowing out the toast */}
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">
            {achievement.description}
          </p>
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            <span className="text-xs sm:text-sm font-semibold px-2 py-0.5 sm:py-1 rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-200">
              +{achievement.points_reward} pts
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 sm:py-1 rounded-full bg-white text-gray-700 border dark:bg-gray-900 dark:text-gray-200 dark:border-gray-600">
              {achievement.rarity}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
