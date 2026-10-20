import { Habit } from "@/types";
import { useState, useRef } from "react";
import { useCategories } from "@/hooks/useCategories";
import { useHabitStats } from "@/hooks/useHabitStats";
import { CategoryBadge } from "../categories/CategoryBadge";
import { useClickOutside } from "@/hooks/useClickOutside";
import {
  Archive,
  Calendar,
  Edit2,
  Flame,
  MoreVertical,
  Trash2,
  TrendingUp,
  RotateCcw,
} from "lucide-react";
import { format } from "date-fns";
import { useAllCompletions } from "@/hooks/useAllCompletions";
import { HABIT_ICONS } from "@/constants/habits";

interface HabitOverviewCardProps {
  habit: Habit;
  onEdit: (habit: Habit) => void;
  onDelete: (habitId: string) => void;
  onArchive?: (habitId: string) => void;
  onRestore?: (habitId: string) => void;
}

export function HabitOverviewCard({
  habit,
  onEdit,
  onDelete,
  onArchive,
  onRestore,
}: HabitOverviewCardProps) {
  const { categories } = useCategories();
  const { completions } = useAllCompletions();

  const { completionRate, currentStreak, last7Days } = useHabitStats(
    habit,
    completions || [],
  );

  // Sparkline bars are scaled to the daily target
  const target = Math.max(1, habit.target_count || 1);
  const daysOnTarget = last7Days.filter((day) => day.count >= target).length;

  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useClickOutside(menuRef, () => setShowMenu(false));

  const category = categories.find((c) => c.id === habit.category_id);

  // Progress ring calculation
  const circumference = 2 * Math.PI * 45; // radius = 45
  const progress = circumference - (completionRate / 100) * circumference;

  return (
    <div className="relative z-0">
      {/* Hover is a shadow lift only (no scale-up or colored glow) */}
      <div
        className="relative bg-white dark:bg-gray-900 backdrop-blur-xl rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 border shadow-lg hover:shadow-2xl transition-shadow duration-300"
        style={{ borderColor: habit.color }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-3 lg:mb-4">
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
            <div
              className="w-9 h-9 sm:w-10 sm:h-10 lg:w-12 lg:h-12 flex items-center justify-center rounded-lg sm:rounded-xl text-xl shrink-0 shadow-lg"
              style={{
                backgroundColor: `${habit.color}20`,
                border: `2px solid ${habit.color}40`,
              }}
            >
              {HABIT_ICONS.filter((icon) => icon.name === habit.icon).map(
                (icon) => (
                  <icon.icon
                    key={icon.name}
                    className="w-4 h-4 sm:w-5 sm:h-5"
                    style={{ color: habit.color }}
                  />
                ),
              )}
            </div>
            <div className="flex-1 min-w-0">
              {/* Neutral text: palette colors like amber and lime are ~2:1 on
                  white. The icon chip beside it carries the habit color. */}
              <h3 className="font-bold text-base sm:text-lg truncate text-gray-900 dark:text-gray-100">
                {habit.name}
              </h3>
              {habit.description && (
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
                  {habit.description}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setShowMenu(!showMenu)}
                className="p-1.5 sm:p-2 min-h-11 min-w-11 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label={`More actions for ${habit.name}`}
                aria-expanded={showMenu}
              >
                <MoreVertical className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400" />
              </button>
              {showMenu && (
                <div className="absolute top-full right-0 mt-2 w-44 sm:w-48 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 shadow-2xl overflow-hidden z-10">
                  <button
                    onClick={() => {
                      onEdit(habit);
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-4 py-3 min-h-11 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2 text-gray-700 dark:text-gray-300 cursor-pointer"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit Habit
                  </button>
                  {habit.archived
                    ? onRestore && (
                        <button
                          onClick={() => {
                            onRestore(habit.id);
                            setShowMenu(false);
                          }}
                          className="w-full text-left px-4 py-3 min-h-11 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2 text-gray-700 dark:text-gray-300 cursor-pointer"
                        >
                          <RotateCcw className="w-4 h-4" />
                          Restore
                        </button>
                      )
                    : onArchive && (
                        <button
                          onClick={() => {
                            onArchive(habit.id);
                            setShowMenu(false);
                          }}
                          className="w-full text-left px-4 py-3 min-h-11 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2 text-gray-700 dark:text-gray-300 cursor-pointer"
                        >
                          <Archive className="w-4 h-4" />
                          Archive
                        </button>
                      )}
                  <button
                    onClick={() => {
                      onDelete(habit.id);
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-4 py-3 min-h-11 text-sm hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-2 text-red-600 dark:text-red-400 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Progress Ring & Stats */}
        <div className="flex items-center gap-3 sm:gap-4 lg:gap-6 mb-3 lg:mb-4">
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 shrink-0">
            <svg
              className="w-full h-full transform -rotate-90"
              viewBox="0 0 96 96"
            >
              <circle
                cx="48"
                cy="48"
                r="43"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-gray-200 dark:text-gray-700"
              />
              <circle
                cx="48"
                cy="48"
                r="43"
                stroke={habit.color}
                strokeWidth="8"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={progress}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div
              className="absolute inset-0 flex items-center justify-center"
              title="Daily targets met, last 30 days (or since created)"
            >
              <span className="text-sm sm:text-lg lg:text-2xl font-bold text-gray-900 dark:text-gray-100">
                {completionRate}%
              </span>
              <span className="sr-only">
                of daily targets met in the last 30 days
              </span>
            </div>
          </div>

          <div className="flex-1 grid grid-cols-2 gap-2 sm:gap-3">
            {/* Streak */}
            <div className="bg-linear-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg sm:rounded-xl p-2 sm:p-3 border border-orange-200 dark:border-orange-800">
              <div className="flex items-center gap-1 sm:gap-2 mb-0.5 sm:mb-1">
                <Flame className="w-3 h-3 sm:w-4 sm:h-4 text-orange-500 shrink-0" />
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                  Streak
                </span>
              </div>
              <p className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 dark:text-gray-100">
                {currentStreak}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                days
              </p>
            </div>
            {/* Frequency */}
            <div className="bg-linear-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg sm:rounded-xl p-2 sm:p-3 border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-1 sm:gap-2 mb-0.5 sm:mb-1">
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500 shrink-0" />
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                  Target
                </span>
              </div>
              <p className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 dark:text-gray-100">
                {habit.target_count}x
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                {habit.frequency}
              </p>
            </div>
          </div>
        </div>

        {/* Last 7 days Sparkline */}
        <div className="mb-3 lg:mb-4">
          <div className="flex items-center justify-between mb-1.5 sm:mb-2">
            <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
              Last 7 days
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {daysOnTarget} of 7 days on target
            </span>
          </div>
          {/* Sparkline bars: full height = daily target met, so 1/1 and 3/3
              look the same and 1/3 is a third. Extra check-ins are capped. */}
          <div
            role="img"
            aria-label={`Last 7 days: daily target met on ${daysOnTarget} of 7 days`}
            className="flex items-end gap-0.5 sm:gap-1 h-8 sm:h-10 lg:h-12"
          >
            {last7Days.map((day) => {
              const progress = Math.min(day.count / target, 1);
              return (
                <div
                  key={day.dayKey}
                  className="flex-1 rounded-t-md sm:rounded-t-lg transition-all duration-300 hover:opacity-80"
                  style={{
                    height: `${progress * 100}%`,
                    backgroundColor: habit.color,
                    // Met days solid, partial days lighter, empty days a faint stub
                    opacity: progress === 0 ? 0.15 : progress < 1 ? 0.5 : 1,
                    minHeight: progress === 0 ? "2px" : undefined,
                  }}
                  title={`${day.isToday ? "Today, " : ""}${day.fullLabel}: ${day.count} of ${target}`}
                />
              );
            })}
          </div>
          {/* Weekday labels, today highlighted */}
          <div className="flex gap-0.5 sm:gap-1 mt-1" aria-hidden="true">
            {last7Days.map((day) => (
              <span
                key={day.dayKey}
                className={`flex-1 text-center text-xs ${
                  day.isToday
                    ? "font-bold text-gray-900 dark:text-gray-100"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {day.label}
              </span>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 lg:pt-4 border-t border-gray-200 dark:border-gray-700">
          <div>
            {category ? (
              <CategoryBadge category={category} size="sm" />
            ) : (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                No category
              </span>
            )}
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Since {format(new Date(habit.created_at), "MMM yyyy")}
          </span>
        </div>
      </div>
    </div>
  );
}
