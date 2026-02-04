import { useUserStats } from "@/hooks/useUserStats";

export default function LevelProgress() {
  const { currentLevel, levelData, totalPoints, pointsToNext, levelProgress } =
    useUserStats();

  if (!levelData) return null;

  const isMaxLevel = pointsToNext === 0;

  return (
    <div className="bg-primary-500 rounded-xl p-6 shadow-sm border- border-gray-200 flex-1 ">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{levelData.emoji}</span>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">
              Level {currentLevel} - {levelData.label}
            </h3>
            <p className="text-xs text-gray-100">
              {isMaxLevel
                ? "Max level reached!"
                : `${pointsToNext} points to Level ${currentLevel + 1}`}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold" style={{ color: levelData.color }}>
            {totalPoints}
          </p>
          <p className="text-xs text-gray-100">Total Points</p>
        </div>
      </div>

      {!isMaxLevel && (
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className="h=full rounded-full transition-all duration-500 ease-out"
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
