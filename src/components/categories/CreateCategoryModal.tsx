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
    .min(1, "NamCategory name is required")
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
        <>
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={createCategory.isPending}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit(handleFormSubmit)}
            isLoading={createCategory.isPending}
          >
            Create Category
          </Button>
        </>
      }
    >
      <form className="space-y-6">
        <Input
          label="Category Name"
          type="text"
          placeholder="Enter your category"
          {...register("name")}
          error={errors.name?.message}
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
                <span>{icon}</span>
              </button>
            ))}
          </div>
          {errors.icon && <p className="text-red-500">{errors.icon.message}</p>}
        </div>

        {/* Color Picker */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Choose an Color
          </label>
          <div className="grid grid-cols-10 gap-2">
            {CATEGORY_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => handleColorSelect(color)}
                className={`w-12 h-12 rounded-full transition-all hover:scale-110 ${
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
            <p className="text-red-500">{errors.color.message}</p>
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
