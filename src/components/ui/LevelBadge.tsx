import { useUserStats } from "@/hooks/useUserStats";

export function LevelBadge() {
  const { currentLevel, levelData, totalPoints, pointsToNext } = useUserStats();

  if (!levelData) return null;

  return (
    <div
      className="flex items-center gap-2 px-3 py-1.5 rounded-full transition-all hover:scale-105 cursor-pointer"
      style={{
        backgroundColor: `${levelData.color}15`,
        border: `1.5px solid ${levelData.color}40`,
      }}
      title={
        pointsToNext > 0
          ? `${pointsToNext} points to Level ${currentLevel + 1}`
          : "Max level reached!"
      }
    >
      {/* Level emoji */}
      <span className="text-lg">{levelData.emoji}</span>

      {/* Level number */}
      <span className="text-sm font-bold" style={{ color: levelData.color }}>
        Lv. {currentLevel}
      </span>

      {/* Points */}
      <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
        {totalPoints}
      </span>
    </div>
  );
}
