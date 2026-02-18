import { useCreateCategory } from "@/hooks/useCreateCategory";
import { useState } from "react";
import z from "zod";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CATEGORY_COLORS, CATEGORY_ICONS } from "@/lib/categoryConstants";
const categorySchema = z.object({
  name: z
    .string()
    .min(1, "Category name is required")
    .max(50, "Category name must be less than 50 characters"),
  icon: z.string().min(1, "Please select an icon"),
  color: z.string().min(1, "Please select a color"),
});

type CategoryFormDate = z.infer<typeof categorySchema>;

interface CreateCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateCategoryModal({
  isOpen,
  onClose,
}: CreateCategoryModalProps) {
  const [selectedIcon, setSelectedIcon] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");

  const createCategory = useCreateCategory();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<CategoryFormDate>({
    resolver: zodResolver(categorySchema),
  });

  // watch name for live preview
  const categoryName = watch("name") || "Category Name";

  const handleIconSelect = (icon: string) => {
    setSelectedIcon(icon);
    setValue("icon", icon, { shouldValidate: true });
  };

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    setValue("color", color, { shouldValidate: true });
  };

  const handleFormSubmit = async (data: CategoryFormDate) => {
    try {
      await createCategory.mutateAsync(data);
      reset();
      setSelectedIcon("");
      setSelectedColor("");
      onClose();
    } catch (error) {
      console.error("Error creating category:", error);
    }
  };

  const handleClose = () => {
    reset();
    setSelectedIcon("");
    setSelectedColor("");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create Your Category"
      size="lg"
      footer={
        <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto sm:justify-end">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={createCategory.isPending}
            className="min-h-11w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit(handleFormSubmit)}
            isLoading={createCategory.isPending}
            className="min-h-11w-full sm:w-auto"
          >
            Create Category
          </Button>
        </div>
      }
    >
      <form className="space-y-4 sm:space-y-5 lg:space-y-6">
        <Input
          label="Category Name"
          type="text"
          placeholder="Enter your category"
          {...register("name")}
          error={errors.name?.message}
        />

        {/* Icon Picker */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">
            Choose an Icon
          </label>
          <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-1.5 sm:gap-2">
            {CATEGORY_ICONS.map((icon) => (
              <button
                key={icon}
                type="button"
                onClick={() => handleIconSelect(icon)}
                className={`flex items-center justify-center p-1.5 sm:p-2 min-h-11rounded-lg border-2 transition-all hover:scale-110 ${
                  selectedIcon === icon
                    ? "border-primary bg-primary-50 dark:bg-primary-900/20 ring-2 ring-primary ring-offset-1 sm:ring-offset-2 dark:ring-offset-gray-800"
                    : "border-gray-200 dark:border-gray-700 hover:border-primary"
                }`}
                title={icon}
              >
                <span className="text-lg sm:text-xl">{icon}</span>
              </button>
            ))}
          </div>
          {errors.icon && (
            <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-red-600 dark:text-red-400">
              {errors.icon.message}
            </p>
          )}
        </div>

        {/* Color Picker */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">
            Choose a Color
          </label>
          {/* RESPONSIVE: Smaller swatches on mobile, flex-wrap instead of grid */}
          <div className="flex gap-2 sm:gap-3 flex-wrap">
            {CATEGORY_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => handleColorSelect(color)}
                className={`w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full transition-all hover:scale-110 ${
                  selectedColor === color
                    ? "ring-2 ring-offset-2 dark:ring-offset-gray-800"
                    : "hover:ring-2 ring-offset-1 dark:ring-offset-gray-800"
                }`}
                style={{
                  backgroundColor: color,
                  borderColor: color,
                }}
                title={color}
              />
            ))}
          </div>
          {errors.color && (
            <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-red-600 dark:text-red-400">
              {errors.color.message}
            </p>
          )}
        </div>

        {/* Preview */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">
            Preview
          </label>
          {/* RESPONSIVE: Smaller preview on mobile */}
          <div
            className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border-2 transition-all max-w-full"
            style={{
              borderColor: selectedColor || "#e5e7eb",
              backgroundColor: selectedColor
                ? `${selectedColor}15`
                : "transparent",
            }}
          >
            <span className="text-lg sm:text-2xl shrink-0">
              {selectedIcon || "❓"}
            </span>
            <span
              className="font-medium text-sm sm:text-base truncate"
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
