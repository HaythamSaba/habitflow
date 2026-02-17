import { Habit } from "@/types";
import { useState } from "react";
import { useCategories } from "@/hooks/useCategories";
import { CategoryBadge } from "../categories/CategoryBadge";
import {
  Archive,
  Calendar,
  Dumbbell,
  Edit2,
  Flame,
  MoreVertical,
  Star,
  Trash2,
  TrendingUp,
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
} from "lucide-react";
import { format } from "date-fns";

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

interface PremiumHabitCardProps {
  habit: Habit;
  onEdit: (habit: Habit) => void;
  onDelete: (habitId: string) => void;
  onArchive?: (habitId: string) => void;
}
export function PremiumHabitCard({
  habit,
  onEdit,
  onDelete,
  onArchive,
}: PremiumHabitCardProps) {
  const { categories } = useCategories();

  const [showMenu, setShowMenu] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  // Find category
  const category = categories.find((c) => c.id === habit.category_id);

  // Mock data (we'll calculate real values later)
  const completionRate = 85;
  const currentStreak = 15;
  const last7Days = [3, 5, 4, 6, 5, 7, 6]; // completions per day

  // Progress ring calculation
  const circumference = 2 * Math.PI * 45; // radius = 45
  const progress = circumference - (completionRate / 100) * circumference;

  return (
    <div className="relative group z-0">
      <div
        className="absolute inset-0 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500"
        style={{
          background: `radial-gradient(circle at center, ${habit.color}30, transparent 70%)`,
        }}
      />
      <div
        className="relative bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-2xl p-6 border-2 border-transparent hover:border-white/40 dark:hover:border-gray-700/40 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]"
        style={{ borderLeftColor: habit.color, borderLeftWidth: "6px" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          {/* Icon and Title */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div
              className="w-12 h-12 flex items-center justify-center rounded-xl text-xl shrink-0 shadow-lg"
              style={{
                backgroundColor: `${habit.color}20`,
                border: `2px solid ${habit.color}40`,
              }}
            >
              {HABIT_ICONS.filter((icon) => icon.name === habit.icon).map(
                (icon) => (
                  <icon.icon
                    key={icon.name}
                    className="w-5 h-5"
                    style={{ color: habit.color }}
                  />
                ),
              )}{" "}
            </div>
            <div className="flex-1 min-w-0">
              <h3
                className="font-bold text-lg truncate"
                style={{ color: habit.color }}
              >
                {habit.name}
              </h3>
              {habit.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                  {habit.description}
                </p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-500"
              onClick={() => setIsFavorite(!isFavorite)}
            >
              <Star
                className={`w-5 h-5 ${
                  isFavorite
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-400 dark:text-gray-500"
                }`}
              />
            </button>

            {/* More Menu */}
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              {/* Dropdown menu */}
              {showMenu && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 shadow-2xl overflow-hidden z-10">
                  <button
                    onClick={() => {
                      onEdit(habit);
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2 text-gray-700 dark:text-gray-300"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit Habit
                  </button>
                  {onArchive && (
                    <button
                      onClick={() => {
                        onArchive(habit.id);
                        setShowMenu(false);
                      }}
                      className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2 text-gray-700 dark:text-gray-300"
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
                    className="w-full text-left px-4 py-3 text-sm hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-2 text-red-600 dark:text-red-400"
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
        <div className="flex items-center gap-6 mb-4">
          <div className="relative w-24 h-24 shrink-0">
            <svg className="w-24 h-24 transform -rotate-90">
              {/* Background circle */}
              <circle
                cx="48"
                cy="48"
                r="45"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-gray-200 dark:text-gray-700"
              />
              {/* Progress circle */}
              <circle
                cx="48"
                cy="48"
                r="45"
                stroke={habit.color}
                strokeWidth="8"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={progress}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {completionRate}%
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex-1 grid grid-cols-2 gap-3">
            {/* Streak */}
            <div className="bg-linear-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl p-3 border border-orange-200 dark:border-orange-800">
              <div className="flex items-center gap-2 mb-1">
                <Flame className="w-4 h-4 text-orange-500" />
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                  Streak
                </span>
              </div>
              <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {currentStreak}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">days</p>
            </div>
            {/* Frequency */}
            <div className="bg-linear-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-3 border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="w-4 h-4 text-blue-500" />
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                  Target
                </span>
              </div>
              <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {habit.target_count}x
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                {habit.frequency}
              </p>
            </div>
          </div>
        </div>

        {/* Last 7 days Sparkline */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              Last 7 days
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {last7Days.reduce((a, b) => a + b, 0)} completions
            </span>
          </div>
          {/* Sparkline bars */}
          <div className="flex items-end gap-1 h-12">
            {last7Days.map((count, index) => {
              const maxCount = Math.max(...last7Days);
              const height = (count / maxCount) * 100;
              return (
                <div
                  key={index}
                  className="flex-1 rounded-t-lg transition-all duration-300 hover:opacity-80"
                  style={{
                    height: `${height}%`,
                    backgroundColor: habit.color,
                    opacity: 0.3 + (height / 100) * 0.7,
                  }}
                  title={`${count} completions`}
                />
              );
            })}
          </div>
        </div>
        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          {/* Category */}
          <div>
            {category ? (
              <CategoryBadge category={category} size="sm" />
            ) : (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                No category
              </span>
            )}
          </div>

          {/* Created date */}
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Since {format(new Date(habit.created_at), "MMM yyyy")}
          </span>
        </div>
      </div>
    </div>
  );
}
