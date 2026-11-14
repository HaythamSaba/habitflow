import { Category } from "@/types";

interface CategoryBadgeProps {
  category: Category;
  size: "sm" | "md";
}

export function CategoryBadge({ category, size = "sm" }: CategoryBadgeProps) {
  const sizeClasses = {
    sm: "text-xs px-1.5 sm:px-2 py-0.5",
    md: "text-xs sm:text-sm px-2 sm:px-3 py-0.5 sm:py-1",
  };

  return (
    // Neutral text: category colors like amber and emerald are 2–2.5:1 as
    // text on their own tint. The tint and border carry the color (as N6).
    <span
      className={`inline-flex items-center gap-0.5 sm:gap-1 rounded-full font-medium max-w-30 sm:max-w-40 text-gray-800 dark:text-gray-100 ${sizeClasses[size]}`}
      style={{
        backgroundColor: `${category.color}15`,
        border: `1px solid ${category.color}40`,
      }}
    >
      <span className="shrink-0">{category.icon}</span>
      <span className="truncate">{category.name}</span>
    </span>
  );
}
