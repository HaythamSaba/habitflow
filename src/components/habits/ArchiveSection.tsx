import { Habit } from "@/types";
import { useState } from "react";
import { PremiumHabitCard } from "./PremiumHabitCard";
import { ChevronDown, ChevronUp, Archive as ArchiveIcon } from "lucide-react";

interface ArchiveSectionProps {
  archivedHabits: Habit[];
  onEdit: (habit: Habit) => void;
  onDelete: (habitId: string) => void;
  onRestore: (habitId: string) => void;
}

export function ArchiveSection({
  archivedHabits,
  onEdit,
  onDelete,
  onRestore,
}: ArchiveSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (archivedHabits.length === 0) return null;

  return (
    <div className="mt-6 sm:mt-8 lg:mt-12">
      {/* Divider */}
      <div className="relative mb-4 sm:mb-6 lg:mb-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t-2 border-gray-200 dark:border-gray-700"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="bg-gray-50 dark:bg-gray-900 px-4 sm:px-6 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 border-2 border-gray-200 dark:border-gray-700">
            Archive
          </span>
        </div>
      </div>

      {/* Archive Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full group min-h-11"
      >
        <div className="bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 border-2 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 sm:gap-4 min-w-0">
              <div className="w-9 h-9 sm:w-12 sm:h-12 bg-gray-200 dark:bg-gray-700 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0">
                <ArchiveIcon className="w-4 h-4 sm:w-6 sm:h-6 text-gray-600 dark:text-gray-400" />
              </div>
              <div className="text-left min-w-0">
                <h3 className="text-sm sm:text-base lg:text-lg font-bold text-gray-900 dark:text-gray-100 truncate">
                  Archived Habits
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  {archivedHabits.length} habit
                  {archivedHabits.length !== 1 ? "s" : ""} in archive
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
              <span className="hidden sm:inline text-sm text-gray-500 dark:text-gray-400">
                {isExpanded ? "Hide" : "Show"}
              </span>
              {isExpanded ? (
                <ChevronUp className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors" />
              ) : (
                <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors" />
              )}
            </div>
          </div>
        </div>
      </button>

      {/* Archived Habits Grid */}
      {isExpanded && (
        <div className="mt-3 sm:mt-4 lg:mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
          {archivedHabits.map((habit) => (
            <div key={habit.id} className="relative">
              {/* "Archived" Badge */}
              <div className="absolute -top-1.5 -right-1.5 sm:-top-2 sm:-right-2 z-10 bg-gray-600 dark:bg-gray-500 text-white text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full shadow-lg">
                Archived
              </div>

              {/* Card with restore option */}
              <div className="opacity-75 hover:opacity-100 transition-opacity">
                <PremiumHabitCard
                  habit={habit}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onArchive={onRestore}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
