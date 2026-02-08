import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useUpdateCategory } from "@/hooks/useUpdateCategory";
import { CATEGORY_COLORS, CATEGORY_ICONS } from "@/lib/categoryConstants";
import { Category } from "@/types";

// Validation schema
const categorySchema = z.object({
  name: z
    .string()
    .min(1, "Category name is required")
    .max(50, "Category name must be less than 50 characters"),
  icon: z.string().min(1, "Please select an icon"),
  color: z.string().min(1, "Please select a color"),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface EditCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: Category | null;
}

export function EditCategoryModal({
  isOpen,
  onClose,
  category,
}: EditCategoryModalProps) {
  const [selectedIcon, setSelectedIcon] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");

  const updateCategory = useUpdateCategory();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
  });

  // Watch name for live preview
  const categoryName = watch("name") || "Category Name";

  // Pre-fill form when category changes
  useEffect(() => {
    if (category) {
      reset({
        name: category.name,
        icon: category.icon,
        color: category.color,
      });
      setSelectedIcon(category.icon);
      setSelectedColor(category.color);
    }
  }, [category, reset]);

  const handleIconSelect = (icon: string) => {
    setSelectedIcon(icon);
    setValue("icon", icon, { shouldValidate: true });
  };

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    setValue("color", color, { shouldValidate: true });
  };

  const handleFormSubmit = async (data: CategoryFormData) => {
    if (!category) return;

    try {
      await updateCategory.mutateAsync({
        categoryId: category.id,
        updates: data,
      });
      onClose();
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  const handleClose = () => {
    reset();
    setSelectedIcon("");
    setSelectedColor("");
    onClose();
  };

  if (!category) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Edit Category"
      size="lg"
      footer={
        <>
          <Button
            variant="ghost"
            onClick={handleClose}
            disabled={updateCategory.isPending}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit(handleFormSubmit)}
            isLoading={updateCategory.isPending}
          >
            Save Changes
          </Button>
        </>
      }
    >
      <form className="space-y-6">
        {/* Category Name */}
        <Input
          label="Category Name"
          type="text"
          placeholder="e.g., Health & Fitness, Work, Learning"
          error={errors.name?.message}
          {...register("name")}
        />

        {/* Icon Picker */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Choose an Icon
          </label>
          <div className="grid grid-cols-10 gap-2">
            {CATEGORY_ICONS.map((icon) => (
              <button
                key={icon}
                type="button"
                onClick={() => handleIconSelect(icon)}
                className={`flex items-center justify-center p-2 rounded-lg border-2 transition-all hover:scale-110 ${
                  selectedIcon === icon
                    ? "border-primary bg-primary-50 dark:bg-primary-900/20 ring-2 ring-primary ring-offset-2 dark:ring-offset-gray-800"
                    : "border-gray-200 dark:border-gray-700 hover:border-primary"
                }`}
                title={icon}
              >
                <span className="text-2xl">{icon}</span>
              </button>
            ))}
          </div>
          {errors.icon && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
              {errors.icon.message}
            </p>
          )}
        </div>

        {/* Color Picker */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Choose a Color
          </label>
          <div className="flex gap-3 flex-wrap">
            {CATEGORY_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => handleColorSelect(color)}
                className={`w-12 h-12 rounded-full transition-all hover:scale-110 ${
                  selectedColor === color
                    ? "ring-4 ring-offset-2 dark:ring-offset-gray-800"
                    : "hover:ring-2 ring-offset-1 dark:ring-offset-gray-800"
                }`}
                style={{
                  backgroundColor: color,
                  ringColor: color,
                }}
                title={color}
              />
            ))}
          </div>
          {errors.color && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
              {errors.color.message}
            </p>
          )}
        </div>

        {/* Preview */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Preview
          </label>
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all"
            style={{
              borderColor: selectedColor || "#e5e7eb",
              backgroundColor: selectedColor
                ? `${selectedColor}15`
                : "transparent",
            }}
          >
            <span className="text-2xl">{selectedIcon || "❓"}</span>
            <span
              className="font-medium"
              style={{
                color: selectedColor || "#6b7280",
              }}
            >
              {categoryName}
            </span>
          </div>
        </div>
      </form>
    </Modal>
  );
}
