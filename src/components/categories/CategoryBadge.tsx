import { Category } from "@/types";

interface CategoryBadgeProps {
  category: Category;
  size: "sm" | "md";
}

export function CategoryBadge({ category, size = "sm" }: CategoryBadgeProps) {
  const sizeClasses = {
    sm: "text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5",
    md: "text-xs sm:text-sm px-2 sm:px-3 py-0.5 sm:py-1",
  };

  return (
    <span
      className={`inline-flex items-center gap-0.5 sm:gap-1 rounded-full font-medium max-w-30 sm:max-w-40 ${sizeClasses[size]}`}
      style={{
        backgroundColor: `${category.color}15`,
        color: category.color,
        border: `1px solid ${category.color}40`,
      }}
    >
      <span className="shrink-0">{category.icon}</span>
      <span className="truncate">{category.name}</span>
    </span>
  );
}
