// Move Achievement type to types.ts first, then:
import { Achievement } from "@/types";

interface RecentAchievementsSectionProps {
  achievements: Achievement[];
}

export function RecentAchievementsSection({
  achievements,
}: RecentAchievementsSectionProps) {
  if (achievements.length === 0) return null;

  return (
    <div className="card bg-white dark:bg-gray-900 rounded-2xl p-3 sm:p-4 md:p-6 shadow-lg shadow-primary-200 dark:shadow-gray-900 border border-gray-300 dark:border-gray-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 md:mb-6 gap-2">
        <div>
          <h2 className="text-lg md:text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            🏆 Recent Achievements
          </h2>
          <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mt-1">
            Your latest unlocked achievements
          </p>
        </div>
        <a
          href="/achievements"
          className="text-sm font-medium text-primary hover:underline flex items-center gap-1 min-h-11 shrink-0"
        >
          View All
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
        {achievements.map((achievement) => (
          <div
            key={achievement.id}
            className="p-3 md:p-4 rounded-lg border-2 border-primary bg-primary/5 dark:bg-primary/10 hover:bg-primary/10 dark:hover:bg-primary/20 transition-all"
          >
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <span className="text-2xl md:text-3xl shrink-0">
                {achievement.emoji}
              </span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-sm md:text-base text-gray-900 dark:text-gray-100 truncate">
                  {achievement.name}
                </h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 dark:bg-primary/30 text-primary font-medium">
                  {achievement.rarity}
                </span>
              </div>
            </div>
            <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
              {achievement.description}
            </p>
            <div className="flex items-center gap-1 text-xs text-yellow-600 dark:text-yellow-500">
              <span>⭐</span>
              <span className="font-semibold">
                +{achievement.points_reward} points
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
