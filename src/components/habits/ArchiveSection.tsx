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
    <div className="mt-12">
      {/* Divider */}
      <div className="relative mb-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t-2 border-gray-200 dark:border-gray-700"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="bg-gray-50 dark:bg-gray-900 px-6 py-2 rounded-full text-sm font-medium text-gray-500 dark:text-gray-400 border-2 border-gray-200 dark:border-gray-700">
            Archive
          </span>
        </div>
      </div>

      {/* Archive Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full group"
      >
        <div className="bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 border-2 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl flex items-center justify-center">
                <ArchiveIcon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  Archived Habits
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {archivedHabits.length} habit
                  {archivedHabits.length !== 1 ? "s" : ""} in archive
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {isExpanded ? "Hide" : "Show"}
              </span>
              {isExpanded ? (
                <ChevronUp className="w-6 h-6 text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors" />
              ) : (
                <ChevronDown className="w-6 h-6 text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors" />
              )}
            </div>
          </div>
        </div>
      </button>

      {/* Archived Habits Grid */}
      {isExpanded && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
          {archivedHabits.map((habit) => (
            <div key={habit.id} className="relative">
              {/* "Archived" Badge */}
              <div className="absolute -top-2 -right-2 z-10 bg-gray-600 dark:bg-gray-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                Archived
              </div>

              {/* Card with restore option */}
              <div className="opacity-75 hover:opacity-100 transition-opacity">
                <PremiumHabitCard
                  habit={habit}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onArchive={onRestore} // Reuse archive button for restore
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
