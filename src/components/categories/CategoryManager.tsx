import { useState } from "react";
import { Edit2, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useCategories } from "@/hooks/useCategories";
import { useDeleteCategory } from "@/hooks/useDeleteCategory";
import { useHabits } from "@/hooks/useHabits";
import { CreateCategoryModal } from "./CreateCategoryModal";
import { EditCategoryModal } from "./EditCategoryModal";
import { Category } from "@/types";

export function CategoryManager() {
  const { categories, isLoading } = useCategories();
  const { habits } = useHabits();
  const deleteCategory = useDeleteCategory();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Count habits per category
  const getHabitCount = (categoryId: string) => {
    return (
      habits?.filter((habit) => habit.category_id === categoryId).length || 0
    );
  };

  const handleDelete = (category: Category) => {
    const habitCount = getHabitCount(category.id);

    const message =
      habitCount > 0
        ? `Delete "${category.name}"? ${habitCount} habit${habitCount > 1 ? "s" : ""} will become uncategorized.`
        : `Delete "${category.name}"?`;

    const confirmed = window.confirm(message);

    if (confirmed) {
      deleteCategory.mutate(category.id);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3 sm:space-y-4">
        <div className="h-14 sm:h-16 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
        <div className="h-14 sm:h-16 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100">
            Categories
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-0.5 sm:mt-1">
            Organize your habits into categories
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => setIsCreateModalOpen(true)}
          className="min-h-11 w-full sm:w-auto"
        >
          New Category
        </Button>
      </div>

      {/* Categories List */}
      {categories.length > 0 ? (
        <div className="space-y-2 sm:space-y-3">
          {categories.map((category) => {
            const habitCount = getHabitCount(category.id);

            return (
              <div
                key={category.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 p-3 sm:p-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-md transition-shadow"
              >
                {/* Category Info */}
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                  <div
                    className="w-9 h-9 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center text-lg sm:text-2xl shrink-0"
                    style={{
                      backgroundColor: `${category.color}15`,
                      border: `2px solid ${category.color}40`,
                    }}
                  >
                    {category.icon}
                  </div>
                  <div className="min-w-0">
                    <h4
                      className="font-semibold text-sm sm:text-base truncate"
                      style={{ color: category.color }}
                    >
                      {category.name}
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                      {habitCount} habit{habitCount !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 sm:gap-2 shrink-0 self-end sm:self-auto">
                  <Button
                    variant="ghost"
                    size="sm"
                    leftIcon={<Edit2 className="w-4 h-4" />}
                    onClick={() => setEditingCategory(category)}
                    className="min-h-11"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    leftIcon={<Trash2 className="w-4 h-4" />}
                    onClick={() => handleDelete(category)}
                    className="min-h-11 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8 sm:py-12 px-4">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <Plus className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400 dark:text-gray-500" />
          </div>
          <h4 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1.5 sm:mb-2">
            No categories yet
          </h4>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-3 sm:mb-4">
            Create your first category to organize your habits
          </p>
          <Button
            variant="primary"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setIsCreateModalOpen(true)}
            className="min-h-11"
          >
            Create Category
          </Button>
        </div>
      )}

      {/* Modals */}
      <CreateCategoryModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      <EditCategoryModal
        isOpen={!!editingCategory}
        onClose={() => setEditingCategory(null)}
        category={editingCategory}
      />
    </div>
  );
}
