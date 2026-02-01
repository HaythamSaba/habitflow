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
    common: "border-gray-300 bg-gray-50",
    rare: "border-blue-300 bg-blue-50",
    epic: "border-purple-300 bg-purple-50",
    legendary: "border-orange-300 bg-orange-50",
  };

  const rarityColor =
    rarityColors[achievement.rarity as keyof typeof rarityColors] ||
    rarityColors.common;

  return (
    <div
      className={`relative rounded-xl p-6 border-2 transition-all duration-300 ${
        unlocked
          ? `${rarityColor} shadow-md hover:shadow-lg hover:scale-105`
          : "border-gray-200 bg-gray-100 opacity-60"
      }`}
    >
      {/* Locked overlay */}
      {!unlocked && (
        <div className="absolute top-3 right-3">
          <span className="text-2xl">🔒</span>
        </div>
      )}

      {/* Achievement emoji */}
      <div className="text-center mb-4">
        <span
          className={`text-6xl ${unlocked ? "animate-fadeIn" : "grayscale opacity-50"}`}
        >
          {achievement.emoji}
        </span>
      </div>

      {/* Achievement name */}
      <h3
        className={`text-lg font-bold text-center mb-2 ${
          unlocked ? "text-gray-900" : "text-gray-500"
        }`}
      >
        {achievement.name}
      </h3>

      {/* Description */}
      <p
        className={`text-sm text-center mb-4 ${
          unlocked ? "text-gray-600" : "text-gray-400"
        }`}
      >
        {achievement.description}
      </p>

      {/* Progress bar (only for locked) */}
      {!unlocked && progress > 0 && (
        <div className="mb-3">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-300 rounded-full h-2 overflow-hidden">
            <div
              className="bg-primary h-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Points reward */}
      <div className="flex items-center justify-center gap-2">
        <span className="text-yellow-500">⭐</span>
        <span
          className={`text-sm font-semibold ${
            unlocked ? "text-gray-700" : "text-gray-400"
          }`}
        >
          +{achievement.points_reward} points
        </span>
      </div>

      {/* Rarity badge */}
      <div className="absolute top-3 left-3">
        <span
          className={`text-xs px-2 py-1 rounded-full font-semibold ${
            achievement.rarity === "common" && "bg-gray-200 text-gray-700"
          } ${achievement.rarity === "rare" && "bg-blue-200 text-blue-700"} ${
            achievement.rarity === "epic" && "bg-purple-200 text-purple-700"
          } ${
            achievement.rarity === "legendary" &&
            "bg-orange-200 text-orange-700"
          }`}
        >
          {achievement.rarity}
        </span>
      </div>
    </div>
  );
}
