import { Category } from "@/types";

interface CategoryBadgeProps {
  category: Category;
  size: "sm" | "md";
}

export function CategoryBadge({ category, size = "sm" }: CategoryBadgeProps) {
  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-3 py-1",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-medium ${sizeClasses[size]}`}
      style={{
        backgroundColor: `${category.color}15`,
        color: category.color,
        border: `1px solid ${category.color}40`,
      }}
    >
      <span>{category.icon}</span>
      <span>{category.name}</span>
    </span>
  );
}
