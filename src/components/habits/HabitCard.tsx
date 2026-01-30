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
  // ⭐ Get completion data
  const { isHabitCompletedToday, getHabitCompletionCount } = useCompletions(); // ← Fixed!
  const toggleCompletion = useToggleCompletion();
  const isCompleted = isHabitCompletedToday(habit.id);

  // ⭐ Calculate completion status
  const completionCount = getHabitCompletionCount(habit.id);
  const isFullyCompleted = completionCount >= habit.target_count;
  const isPartiallyCompleted =
    completionCount > 0 && completionCount < habit.target_count;
  const isLoading = toggleCompletion.isPending;

  // ⭐ Handle toggle
  const handleToggle = () => {
    if (isLoading) return;
    toggleCompletion.mutate({
      habitId: habit.id,
      targetCount: habit.target_count,
    });
  };

  // ⭐ Get background color based on completion
  const backgroundColor = isFullyCompleted
    ? lightenColor(habit.color, 92)
    : "white";

  const {
    currentStreak,
    longestStreak,
    isLoading: isLoadingStreak,
  } = useHabitStreak(habit.id);

  // Helper function (add at top of component, before return)
  const getStreakColor = (streak: number) => {
    if (streak >= 30) {
      return "bg-orange-100 text-orange-700 border border-orange-300";
    } else if (streak >= 7) {
      return "bg-yellow-100 text-yellow-700 border border-yellow-300";
    } else {
      return "bg-gray-100 text-gray-600 border border-gray-300";
    }
  };

  const isNewRecord = currentStreak > 0 && currentStreak === longestStreak;

  return (
    <div
      className="rounded-xl p-4 border-l-4 shadow-sm hover:shadow-md transition-all duration-200"
      style={{
        borderLeftColor: habit.color,
        backgroundColor,
      }}
    >
      <div className="flex items-center justify-between gap-4">
        {/* ⭐ Checkbox - Now functional! */}
        <button
          onClick={handleToggle}
          disabled={isLoading}
          className="shrink-0 transition-transform hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isCompleted ? (
            <CircleCheck className="w-6 h-6" style={{ color: habit.color }} />
          ) : (
            <Circle className="w-6 h-6 text-gray-400" />
          )}
        </button>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <div
              className="p-2 rounded-full bg-white"
              style={{ backgroundColor: habit.color }}
            >
              {HABIT_ICONS.filter((icon) => icon.name === habit.icon).map(
                (icon) => (
                  <icon.icon key={icon.name} className={`w-5 h-5 text-white`} />
                ),
              )}
            </div>
            <h3
              className={`font-bold text-lg ${isCompleted ? "line-through opacity-60" : ""}`}
            >
              {habit.name}
            </h3>

            {/* ⭐ Task 5: Completion counter badge */}
            {habit.target_count > 1 && (
              <span
                className={`text-xs px-2 py-1 rounded-full font-semibold transition-colors ${
                  isFullyCompleted
                    ? "bg-green-100 text-green-700"
                    : isPartiallyCompleted
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-gray-100 text-gray-600"
                }`}
              >
                {completionCount}/{habit.target_count}
              </span>
            )}

            {/* Frequency badge */}
            <span className="text-xs bg-gray-100 px-2 py-1 rounded capitalize">
              {habit.frequency}
            </span>

            {/* Target count (only show if target is 1) */}
            {habit.target_count === 1 && (
              <span className="text-xs text-gray-500">
                {habit.target_count}x per day
              </span>
            )}
            <div className="flex items-center gap-2">
              {isLoadingStreak ? (
                <Spinner />
              ) : (
                <>
                  {/* Current Streak */}
                  {currentStreak > 0 && (
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-semibold flex items-center gap-1 transition-all duration-300 animate-fadeIn ${getStreakColor(currentStreak)}`}
                      title={`Current ${currentStreak} day streak`}
                    >
                      <span>{isNewRecord ? "🎉" : "🔥"}</span>
                      <span>{currentStreak}</span>
                    </span>
                  )}

                  {/* Longest Streak (only if different from current) */}
                  {longestStreak > currentStreak && (
                    <span
                      className="text-xs px-2 py-1 rounded-full font-semibold flex items-center gap-1 bg-purple-100 text-purple-700 border border-purple-300 transition-all duration-300 animate-fadeIn"
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
              className={`text-sm text-gray-600 mt-1 ${
                isFullyCompleted ? "line-through opacity-60" : ""
              }`}
            >
              {habit.description}
            </p>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 shrink-0">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onEdit(habit)}
            disabled={isLoading} // ⭐ Disable during loading
          >
            <Pencil className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDelete(habit.id)}
            disabled={isLoading} // ⭐ Disable during loading
            className="text-red-600 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
