import { UseFormRegister, FieldErrors, UseFormSetValue } from "react-hook-form";
import { HabitFormData } from "@/constants/habits";
import { Input } from "@/components/ui/Input";
import { IconPicker } from "./IconPicker";
import { ColorPicker } from "./ColorPicker";
import { FrequencySelector } from "./FrequencySelector";
import { TargetCounter } from "./TargetCounter";
import { useCategories } from "@/hooks/useCategories";

interface HabitFormProps {
  register: UseFormRegister<HabitFormData>;
  errors: FieldErrors<HabitFormData>;
  setValue: UseFormSetValue<HabitFormData>;
  selectedIcon: string;
  selectedColor: string;
  targetCount: number;
  onIconSelect: (icon: string) => void;
  onColorSelect: (color: string) => void;
  onTargetChange: (value: number) => void;
}

export function HabitForm({
  register,
  errors,
  setValue,
  selectedIcon,
  selectedColor,
  targetCount,
  onIconSelect,
  onColorSelect,
  onTargetChange,
}: HabitFormProps) {
  const { categories } = useCategories();

  const handleIconSelect = (icon: string) => {
    onIconSelect(icon);
    setValue("icon", icon, { shouldValidate: true });
  };

  const handleColorSelect = (color: string) => {
    onColorSelect(color);
    setValue("color", color, { shouldValidate: true });
  };

  return (
    <div className="space-y-4 sm:space-y-5 lg:space-y-6">
      {/* Habit Name */}
      <Input
        label="Habit Name"
        type="text"
        placeholder="e.g., Morning Run, Read 30 Minutes"
        error={errors.name?.message}
        {...register("name")}
      />

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-100 mb-1 sm:mb-1.5">
          Description (Optional)
        </label>
        <textarea
          placeholder="What is this habit about?"
          className="w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none text-sm sm:text-base"
          rows={2}
          {...register("description")}
        />
        {errors.description && (
          <p className="mt-1 sm:mt-1.5 text-xs sm:text-sm text-red-600 dark:text-red-400">
            {errors.description.message}
          </p>
        )}
      </div>

      {/* Icon Picker */}
      <IconPicker
        selectedIcon={selectedIcon}
        onIconSelect={handleIconSelect}
        error={errors.icon?.message}
      />

      {/* Color Picker */}
      <ColorPicker
        selectedColor={selectedColor}
        onColorSelect={handleColorSelect}
        error={errors.color?.message}
      />

      {/* Frequency Selector */}
      <FrequencySelector register={register} />

      {/* Target Counter */}
      <TargetCounter
        register={register}
        value={targetCount}
        onChange={onTargetChange}
      />

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-1.5">
          Category (Optional)
        </label>
        <select
          {...register("category_id")}
          className="w-full px-3 sm:px-4 py-2 sm:py-2.5 min-h-11 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base"
        >
          <option value="">No Category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.icon} {category.name}
            </option>
          ))}
        </select>
        <p className="mt-1 sm:mt-1.5 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
          Organize your habits into a category
        </p>
      </div>
    </div>
  );
}
