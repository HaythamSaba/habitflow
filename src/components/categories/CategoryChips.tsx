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
    <div className="flex items-center gap-2 flex-wrap">
      <button
        onClick={() => onSelectCategory(null)}
        className={`inline-flex items-center gap-2 py-2 px-4 rounded-full font-medium transition-all ${selectedCategoryId === null ? "bg-primary-500 text-white shadow-md" : "bg-gray-100 text-gray-700 dark:text--gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"}`}
      >
        <span>All Habits</span>
        {habitCounts.all !== undefined && (
          <span
            className={`text-sx px-2 py-0.5 rounded-full ${selectedCategoryId === null ? "bg-white/20" : "bg-gray-200 dark:bg-gray-600"}`}
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
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all ${
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
          <span className="text-lg">{category.icon}</span>
          <span>{category.name}</span>
          {habitCounts[category.id] !== undefined && (
            <span
              className={`text-xs px-1.5 py-0.5 rounded-full ${
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
