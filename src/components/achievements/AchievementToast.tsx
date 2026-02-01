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
    <div className={`p-4 rounded-lg border-2 ${rarityColor}min-w-75`}>
      <div className="flex items-start gap-3">
        {/* Emoji */}
        <div className="text-4xl animate-bounce">{achievement.emoji}</div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-gray-900">
              🎉 Achievement Unlocked!
            </h3>
          </div>
          <p className="font-semibold text-lg text-gray-800 mb-1">
            {achievement.name}
          </p>
          <p className="text-sm text-gray-600 mb-2">
            {achievement.description}
          </p>
          <div className="flex-items-center gap-2">
            <span className="text-sm font-semibold px-2 py-1 rounded-full bg-yellow-100 text-yellow-700">
              +{achievement.points_reward} Points
            </span>
            <span className="text-xs font-semibold px-2 py-1 rounded-full bg-white text-gray-700 border">
              {achievement.rarity}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
