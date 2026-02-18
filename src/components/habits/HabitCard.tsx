import { Habit } from "@/types";
import { Circle, CircleCheck, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { lightenColor } from "@/lib/utils";
import { useToggleCompletion } from "@/hooks/useToggleCompletion";
import { useCompletions } from "@/hooks/useCompletions";
import {
  Dumbbell,
  Book,
  Coffee,
  Heart,
  Zap,
  Music,
  Droplet,
  Moon,
  Sun,
  Target,
  CheckCircle2,
  Flame,
} from "lucide-react";
import { useHabitStreak } from "@/hooks/useHabitStreak";
import Spinner from "../ui/Spinner";
import { useTheme } from "@/contexts/ThemeContext";
import { useCategories } from "@/hooks/useCategories";
import { CategoryBadge } from "../categories/CategoryBadge";

interface HabitCardProps {
  habit: Habit;
  onEdit: (habit: Habit) => void;
  onDelete: (habitId: string) => void;
}

const HABIT_ICONS = [
  { name: "dumbbell", icon: Dumbbell, label: "Exercise" },
  { name: "book", icon: Book, label: "Reading" },
  { name: "coffee", icon: Coffee, label: "Coffee" },
  { name: "heart", icon: Heart, label: "Health" },
  { name: "zap", icon: Zap, label: "Energy" },
  { name: "music", icon: Music, label: "Music" },
  { name: "droplet", icon: Droplet, label: "Water" },
  { name: "moon", icon: Moon, label: "Sleep" },
  { name: "sun", icon: Sun, label: "Morning" },
  { name: "target", icon: Target, label: "Goal" },
  { name: "check", icon: CheckCircle2, label: "Task" },
  { name: "flame", icon: Flame, label: "Streak" },
];

export function HabitCard({ habit, onEdit, onDelete }: HabitCardProps) {
  const { theme } = useTheme();
  const { categories } = useCategories();
  const { isHabitCompletedToday, getHabitCompletionCount } = useCompletions();
  const toggleCompletion = useToggleCompletion();
  const isCompleted = isHabitCompletedToday(habit.id);

  const completionCount = getHabitCompletionCount(habit.id);
  const isFullyCompleted = completionCount >= habit.target_count;
  const isPartiallyCompleted =
    completionCount > 0 && completionCount < habit.target_count;
  const isLoading = toggleCompletion.isPending;
  const habitCategory = categories.find((cat) => cat.id === habit.category_id);

  const handleToggle = () => {
    if (isLoading) return;
    toggleCompletion.mutate({
      habitId: habit.id,
      targetCount: habit.target_count,
    });
  };

  const {
    currentStreak,
    longestStreak,
    isLoading: isLoadingStreak,
  } = useHabitStreak(habit.id);

  const getStreakColor = (streak: number) => {
    if (streak >= 30) {
      return "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border border-orange-300 dark:border-orange-700";
    } else if (streak >= 7) {
      return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border border-yellow-300 dark:border-yellow-700";
    } else {
      return "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600";
    }
  };

  const isNewRecord = currentStreak > 0 && currentStreak === longestStreak;

  // Smart background color based on theme
  const getBackgroundColor = () => {
    if (!isFullyCompleted) return "transparent";

    return theme === "dark"
      ? lightenColor(habit.color, 20)
      : lightenColor(habit.color, 92);
  };

  return (
    <div
      className="rounded-xl p-3 sm:p-4 border-l-4 shadow-sm hover:shadow-md transition-all duration-200 bg-white dark:bg-gray-800"
      style={{
        borderLeftColor: habit.color,
        backgroundColor: getBackgroundColor(),
      }}
    >
      <div className="flex items-start sm:items-center justify-between gap-2 sm:gap-4">
        {/* Checkbox */}
        <button
          onClick={handleToggle}
          disabled={isLoading}
          className="shrink-0 min-w-11 min-h-11 flex items-center justify-center transition-transform hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed -ml-2 sm:ml-0"
        >
          {isCompleted ? (
            <CircleCheck className="w-6 h-6" style={{ color: habit.color }} />
          ) : (
            <Circle className="w-6 h-6 text-gray-400 dark:text-gray-500" />
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            <div
              className="p-1.5 sm:p-2 rounded-full shrink-0"
              style={{ backgroundColor: habit.color }}
            >
              {HABIT_ICONS.filter((icon) => icon.name === habit.icon).map(
                (icon) => (
                  <icon.icon
                    key={icon.name}
                    className="w-4 h-4 sm:w-5 sm:h-5 text-white"
                  />
                ),
              )}
            </div>
            <h3
              className={`font-bold text-base sm:text-lg text-gray-900 dark:text-gray-100 truncate max-w-30 sm:max-w-none ${isCompleted ? "line-through opacity-60" : ""}`}
            >
              {habit.name}
            </h3>

            {/* Completion counter badge */}
            {habit.target_count > 1 && (
              <span
                className={`text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full font-semibold transition-colors shrink-0 ${
                  isFullyCompleted
                    ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                    : isPartiallyCompleted
                      ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                }`}
              >
                {completionCount}/{habit.target_count}
              </span>
            )}

            {/* Frequency badge */}
            <span className="text-[10px] sm:text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded capitalize shrink-0">
              {habit.frequency}
            </span>

            {/* Category Badge */}
            {habitCategory && (
              <CategoryBadge category={habitCategory} size="sm" />
            )}

            {/* Target count */}
            {habit.target_count === 1 && (
              <span className="hidden sm:inline text-xs text-gray-500 dark:text-gray-400 shrink-0">
                {habit.target_count}x per day
              </span>
            )}

            {/* Streaks */}
            <div className="flex items-center gap-1 sm:gap-2">
              {isLoadingStreak ? (
                <Spinner />
              ) : (
                <>
                  {/* Current Streak */}
                  {currentStreak > 0 && (
                    <span
                      className={`text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full font-semibold flex items-center gap-0.5 sm:gap-1 transition-all duration-300 animate-fadeIn ${getStreakColor(currentStreak)}`}
                      title={`Current ${currentStreak} day streak`}
                    >
                      <span>{isNewRecord ? "🎉" : "🔥"}</span>
                      <span>{currentStreak}</span>
                    </span>
                  )}

                  {/* Longest Streak */}
                  {longestStreak > currentStreak && (
                    <span
                      className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full font-semibold flex items-center gap-0.5 sm:gap-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border border-purple-300 dark:border-purple-700 transition-all duration-300 animate-fadeIn"
                      title={`Personal best streak: ${longestStreak} days`}
                    >
                      <span>🏆</span>
                      <span>{longestStreak}</span>
                    </span>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Description */}
          {habit.description && (
            <p
              className={`text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-1 sm:line-clamp-none ${
                isFullyCompleted ? "line-through opacity-60" : ""
              }`}
            >
              {habit.description}
            </p>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 shrink-0">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onEdit(habit)}
            disabled={isLoading}
            className="min-h-11 min-w-11 flex items-center justify-center"
          >
            <Pencil className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDelete(habit.id)}
            disabled={isLoading}
            className="min-h-11 min-w-11 flex items-center justify-center text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}