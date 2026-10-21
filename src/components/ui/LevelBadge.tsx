import { Link } from "react-router-dom";
import { useUserStats } from "@/hooks/useUserStats";

/** Navbar level chip; links to the Achievements page. */
export function LevelBadge() {
  const { currentLevel, levelData, totalPoints, pointsToNext } = useUserStats();

  if (!levelData) return null;

  const progressText =
    pointsToNext > 0
      ? `${pointsToNext} points to Level ${currentLevel + 1}`
      : "Max level reached!";

  return (
    <Link
      to="/achievements"
      className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full transition-all hover:scale-105 cursor-pointer"
      style={{
        backgroundColor: `${levelData.color}15`,
        border: `1.5px solid ${levelData.color}40`,
      }}
      title={progressText}
      // The visible "💪 Lv.4 240" is terse; spell it out for screen readers
      aria-label={`Level ${currentLevel}, ${levelData.label}, ${totalPoints} points. ${progressText} View achievements`}
    >
      <span className="text-sm sm:text-lg" aria-hidden="true">
        {levelData.emoji}
      </span>

      <span
        className="text-xs sm:text-sm font-bold"
        style={{ color: levelData.color }}
      >
        Lv.{currentLevel}
      </span>

      <span className="hidden sm:inline text-xs text-gray-600 dark:text-gray-400 font-medium">
        {totalPoints}
      </span>
    </Link>
  );
}
