import { useId, useState } from "react";
import {
  Control,
  UseFormRegister,
  FieldErrors,
  UseFormSetValue,
  useWatch,
} from "react-hook-form";
import { ChevronDown } from "lucide-react";
import { HabitFormData } from "@/constants/habits";
import { Input } from "@/components/ui/Input";
import { IconPicker } from "./IconPicker";
import { ColorPicker } from "./ColorPicker";
import { FrequencySelector } from "./FrequencySelector";
import { TargetCounter } from "./TargetCounter";
import { useCategories } from "@/hooks/useCategories";

interface HabitFormProps {
  register: UseFormRegister<HabitFormData>;
  control: Control<HabitFormData>;
  errors: FieldErrors<HabitFormData>;
  setValue: UseFormSetValue<HabitFormData>;
  selectedIcon: string;
  selectedColor: string;
  targetCount: number;
  onIconSelect: (icon: string) => void;
  onColorSelect: (color: string) => void;
  onTargetChange: (value: number) => void;
  /** Show description, frequency, target and category expanded (e.g. when editing) */
  showAllOptions?: boolean;
}

export function HabitForm({
  register,
  control,
  errors,
  setValue,
  selectedIcon,
  selectedColor,
  targetCount,
  onIconSelect,
  onColorSelect,
  onTargetChange,
  showAllOptions = false,
}: HabitFormProps) {
  const { categories } = useCategories();
  const [isMoreOpen, setIsMoreOpen] = useState(showAllOptions);
  const moreOptionsId = useId();

  const [frequency, categoryId] = useWatch({
    control,
    name: ["frequency", "category_id"],
  });

  // Never hide a field that has a validation error
  const hasMoreOptionsError = Boolean(
    errors.description ||
      errors.frequency ||
      errors.target_count ||
      errors.category_id,
  );
  const showMoreOptions = isMoreOpen || hasMoreOptionsError;

  const categoryName =
    categories.find((category) => category.id === categoryId)?.name ??
    "No category";
  const moreOptionsSummary = [
    frequency ? frequency.charAt(0).toUpperCase() + frequency.slice(1) : "Daily",
    `${targetCount}× per day`,
    categoryName,
  ].join(" · ");

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

      {/* Icon Picker (defaults to a check mark) */}
      <IconPicker
        selectedIcon={selectedIcon}
        onIconSelect={handleIconSelect}
        error={errors.icon?.message}
      />

      {/* Color Picker (defaults to emerald) */}
      <ColorPicker
        selectedColor={selectedColor}
        onColorSelect={handleColorSelect}
        error={errors.color?.message}
      />

      {/* More options: everything else has a sensible default */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-700">
        <button
          type="button"
          onClick={() => setIsMoreOpen((open) => !open)}
          aria-expanded={showMoreOptions}
          aria-controls={moreOptionsId}
          className="w-full flex items-center justify-between gap-3 px-3 sm:px-4 py-2.5 min-h-11 text-left rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50"
        >
          <span className="min-w-0">
            <span className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              More options
            </span>
            <span className="block text-xs text-gray-500 dark:text-gray-400 truncate">
              {moreOptionsSummary}
            </span>
          </span>
          <ChevronDown
            className={`w-5 h-5 shrink-0 text-gray-500 transition-transform ${
              showMoreOptions ? "rotate-180" : ""
            }`}
            aria-hidden="true"
          />
        </button>

        {/* Kept mounted (hidden) so the fields stay registered with the form */}
        <div
          id={moreOptionsId}
          hidden={!showMoreOptions}
          className="space-y-4 sm:space-y-5 px-3 sm:px-4 pb-4 pt-1"
        >
          {/* Description */}
          <div>
            <label
              htmlFor={`${moreOptionsId}-description`}
              className="block text-sm font-medium text-gray-700 dark:text-gray-100 mb-1 sm:mb-1.5"
            >
              Description (Optional)
            </label>
            <textarea
              id={`${moreOptionsId}-description`}
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
            <label
              htmlFor={`${moreOptionsId}-category`}
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-1.5"
            >
              Category (Optional)
            </label>
            <select
              id={`${moreOptionsId}-category`}
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
      </div>
    </div>
  );
}
