import { useUserStats } from "@/hooks/useUserStats";

export default function LevelProgress() {
  const { currentLevel, levelData, totalPoints, pointsToNext, levelProgress } =
    useUserStats();

  if (!levelData) return null;

  const isMaxLevel = pointsToNext === 0;

  return (
    <div className="bg-primary-500 rounded-xl p-3 sm:p-4 lg:p-6 shadow-sm shadow-primary-100 dark:shadow-primary-800 hover:shadow-xl transition-shadow duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 sm:mb-3 gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xl sm:text-2xl shrink-0">
            {levelData.emoji}
          </span>
          <div className="min-w-0">
            <h3 className="text-xs sm:text-sm font-semibold text-gray-900 truncate">
              Level {currentLevel} - {levelData.label}
            </h3>
            <p className="text-[10px] sm:text-xs text-gray-100">
              {isMaxLevel
                ? "Max level reached!"
                : `${pointsToNext} pts to Level ${currentLevel + 1}`}
            </p>
          </div>
        </div>
        <div className="text-left sm:text-right shrink-0">
          <p
            className="text-xl sm:text-2xl font-bold"
            style={{ color: levelData.color }}
          >
            {totalPoints}
          </p>
          <p className="text-[10px] sm:text-xs text-gray-100">Total Points</p>
        </div>
      </div>

      {!isMaxLevel && (
        <div className="w-full bg-gray-200 rounded-full h-2.5 sm:h-3 overflow-hidden">
          <div
            className="rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${levelProgress}%`,
              backgroundColor: levelData.color,
              height: "100%",
            }}
          ></div>
        </div>
      )}
    </div>
  );
}
