import { CSSProperties } from "react";
import { Category } from "@/types";

interface CategoryChipsProps {
  categories: Category[];
  selectedCategoryId: string | null;
  onSelectCategory: (categoryId: string | null) => void;
  habitCounts?: Record<string, number>;
}

export function CategoryChips({
  categories,
  selectedCategoryId,
  onSelectCategory,
  habitCounts = {},
}: CategoryChipsProps) {
  return (
    <div
      role="group"
      aria-label="Filter by category"
      className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto scrollbar-hide -mx-1 pr-4 py-1 overflow-hidden"
    >
      <button
        type="button"
        aria-pressed={selectedCategoryId === null}
        onClick={() => onSelectCategory(null)}
        className={`inline-flex items-center gap-1 sm:gap-2 py-1.5 sm:py-2 px-3 sm:px-4 min-h-11 rounded-full font-medium text-xs sm:text-sm transition-all whitespace-nowrap shrink-0 ${
          selectedCategoryId === null
            ? "bg-primary-700 text-white shadow-md"
            : "bg-gray-100 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
        }`}
      >
        <span>All</span>
        {habitCounts.all !== undefined && (
          <span
            className={`text-xs px-1.5 sm:px-2 py-0.5 rounded-full ${
              selectedCategoryId === null
                ? "bg-white/20"
                : "bg-gray-200 dark:bg-gray-600"
            }`}
          >
            {habitCounts.all}
          </span>
        )}
      </button>

      {/* Category chips. Text is always neutral gray: category colors are
          2–2.5:1 as text on their tint, and white on amber or emerald is
          similar. The color shows in the tint, the border and, when
          selected, a stronger tint plus a ring in the category color. */}
      {categories.map((category) => {
        const isSelected = selectedCategoryId === category.id;
        return (
          <button
            key={category.id}
            type="button"
            aria-pressed={isSelected}
            onClick={() => onSelectCategory(category.id)}
            className={`inline-flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 min-h-11 rounded-full font-medium text-xs sm:text-sm transition-all whitespace-nowrap shrink-0 ${
              isSelected
                ? "text-gray-900 dark:text-gray-50 shadow-md ring-2 ring-offset-2 dark:ring-offset-gray-900"
                : // Shadow instead of scale: a scaled chip overlaps its
                  // neighbours and gets clipped by the scrolling row
                  "text-gray-800 dark:text-gray-100 hover:shadow-md"
            }`}
            style={
              {
                backgroundColor: isSelected
                  ? `${category.color}40`
                  : `${category.color}15`,
                borderColor: isSelected
                  ? category.color
                  : `${category.color}40`,
                borderWidth: "1px",
                // Tailwind's ring-2 reads its color from this variable
                "--tw-ring-color": isSelected ? category.color : undefined,
              } as CSSProperties
            }
          >
            {/* RESPONSIVE: Smaller emoji on mobile */}
            <span className="text-sm sm:text-lg">{category.icon}</span>
            <span>{category.name}</span>
            {habitCounts[category.id] !== undefined && (
              <span
                className={`text-xs px-1 sm:px-1.5 py-0.5 rounded-full ${
                  isSelected
                    ? "bg-white/70 dark:bg-gray-900/50"
                    : "bg-gray-200 dark:bg-gray-600"
                }`}
              >
                {habitCounts[category.id]}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
