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
    <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto scrollbar-hide -mx-1 px-1 pb-1">
      <button
        onClick={() => onSelectCategory(null)}
        className={`inline-flex items-center gap-1 sm:gap-2 py-1.5 sm:py-2 px-3 sm:px-4 min-h-11 rounded-full font-medium text-xs sm:text-sm transition-all whitespace-nowrap shrink-0 ${
          selectedCategoryId === null
            ? "bg-primary-500 text-white shadow-md"
            : "bg-gray-100 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
        }`}
      >
        <span>All</span>
        {habitCounts.all !== undefined && (
          <span
            className={`text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full ${
              selectedCategoryId === null
                ? "bg-white/20"
                : "bg-gray-200 dark:bg-gray-600"
            }`}
          >
            {habitCounts.all}
          </span>
        )}
      </button>

      {/* Category chips */}
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelectCategory(category.id)}
          className={`inline-flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 min-h-11 rounded-full font-medium text-xs sm:text-sm transition-all whitespace-nowrap shrink-0 ${
            selectedCategoryId === category.id
              ? "shadow-md ring-2 ring-offset-2 dark:ring-offset-gray-900"
              : "hover:scale-105"
          }`}
          style={{
            backgroundColor:
              selectedCategoryId === category.id
                ? category.color
                : `${category.color}15`,
            color:
              selectedCategoryId === category.id ? "white" : category.color,
            borderColor:
              selectedCategoryId === category.id
                ? category.color
                : `${category.color}40`,
            borderWidth: "1px",
            boxShadow:
              selectedCategoryId === category.id ? category.color : undefined,
          }}
        >
          {/* RESPONSIVE: Smaller emoji on mobile */}
          <span className="text-sm sm:text-lg">{category.icon}</span>
          <span>{category.name}</span>
          {habitCounts[category.id] !== undefined && (
            <span
              className={`text-[10px] sm:text-xs px-1 sm:px-1.5 py-0.5 rounded-full ${
                selectedCategoryId === category.id
                  ? "bg-white/20"
                  : "bg-gray-200 dark:bg-gray-600"
              }`}
            >
              {habitCounts[category.id]}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
