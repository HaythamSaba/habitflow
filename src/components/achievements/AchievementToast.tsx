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
  const rarityColors = {
    common: "bg-gray-100 border-gray-300",
    rare: "bg-blue-100 border-blue-300",
    epic: "bg-purple-100 border-purple-300",
    legendary: "bg-orange-100 border-orange-300",
  };

  const rarityColor =
    rarityColors[achievement.rarity as keyof typeof rarityColors] ||
    rarityColors.common;

  return (
    // RESPONSIVE: Reduced padding on mobile (p-3), constrained width so it doesn't overflow
    // Fixed missing space before min-w-75 in original, and made width responsive
    <div
      className={`p-3 sm:p-4 rounded-lg border-2 ${rarityColor} w-[calc(100vw-2rem)] sm:w-auto sm:min-w-75 max-w-sm`}
    >
      <div className="flex items-start gap-2 sm:gap-3">
        {/* Emoji */}
        {/* RESPONSIVE: Smaller emoji on mobile */}
        <div className="text-3xl sm:text-4xl animate-bounce shrink-0">
          {achievement.emoji}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {/* RESPONSIVE: Smaller heading on mobile */}
            <h3 className="font-bold text-gray-900 text-sm sm:text-base">
              🎉 Achievement Unlocked!
            </h3>
          </div>
          {/* RESPONSIVE: Smaller name, truncate if needed */}
          <p className="font-semibold text-base sm:text-lg text-gray-800 mb-1 truncate">
            {achievement.name}
          </p>
          {/* RESPONSIVE: line-clamp-2 prevents long descriptions from blowing out toast */}
          <p className="text-xs sm:text-sm text-gray-600 mb-2 line-clamp-2">
            {achievement.description}
          </p>
          {/* RESPONSIVE: Fixed missing space in original (flex-items → flex items),
              wrap badges on small screens */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            <span className="text-xs sm:text-sm font-semibold px-2 py-0.5 sm:py-1 rounded-full bg-yellow-100 text-yellow-700">
              +{achievement.points_reward} pts
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 sm:py-1 rounded-full bg-white text-gray-700 border">
              {achievement.rarity}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
