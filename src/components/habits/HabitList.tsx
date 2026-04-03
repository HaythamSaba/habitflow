import { Habit } from "@/types";
import { HabitCard } from "./HabitCard";
import { useState } from "react";
import { Search, X } from "lucide-react";
import { filterHabits } from "@/lib/utils";

interface HabitListProps {
  habits: Habit[];
  onEdit: (habit: Habit) => void;
  onDelete: (habitId: string) => void;
}

export function HabitList({ habits, onEdit, onDelete }: HabitListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredHabits = filterHabits(habits, searchQuery);
  const hasSearchQuery = searchQuery.trim().length > 0;

  return (
    <div className="flex flex-col gap-4">
      {/* Search Bar */}
      {habits.length > 0 && (
        <div>
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search habits by name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            />
            {/* Clear button - only show when there's text */}
            {hasSearchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                aria-label="Clear search"
              >
                <X className="w-4 h-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
              </button>
            )}
          </div>

          {/* Search results count */}
          {hasSearchQuery && (
            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">
              {filteredHabits.length > 0 &&
                `${filteredHabits.length} ${filteredHabits.length === 1 ? "habit" : "habits"} found`}
            </p>
          )}
        </div>
      )}

      {/* Habit Cards */}
      {filteredHabits.length > 0 ? (
        <div className="flex flex-col gap-3">
          {filteredHabits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          {hasSearchQuery ? (
            // No results for search
            <>
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                No habits found
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                No habits match "{searchQuery}"
              </p>
              <button
                onClick={() => setSearchQuery("")}
                className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
              >
                Clear search
              </button>
            </>
          ) : (
            // No habits at all
            <>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                No habits yet
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Create your first habit to get started!
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
