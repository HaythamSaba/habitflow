import { useUpdateHabit } from "@/hooks/useUpdateHabit";
import { Habit } from "@/types";
import {
  Book,
  CheckCircle2,
  Coffee,
  Droplet,
  Dumbbell,
  Flame,
  Heart,
  Moon,
  Music,
  Sun,
  Target,
  Zap,
} from "lucide-react";
import { useState, useEffect } from "react";
import z from "zod";
import { Modal } from "../ui/Modal";
import { useForm } from "react-hook-form";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { zodResolver } from "@hookform/resolvers/zod";
import { HABIT_COLORS } from "@/lib/utils";
import { useCategories } from "@/hooks/useCategories";

interface EditHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  habit: Habit | null;
}

const HABIT_ICONS = [
  { name: "dumbbell", icon: Dumbbell, label: "Exercise" },
  { name: "book", icon: Book, label: "Reading" },
  { name: "coffee", icon: Coffee, label: "Coffee" },
  { name: "heart", icon: Heart, label: "Health" },
  { name: "zap", icon: Zap, label: "Energy" },
  { name: "music", icon: Music, label: "Music" },
  { name: "droplet", icon: Droplet, label: "Water" },
  { name: "moon", icon: Moon, label: "Sleep" },
  { name: "sun", icon: Sun, label: "Morning" },
  { name: "target", icon: Target, label: "Goal" },
  { name: "check", icon: CheckCircle2, label: "Task" },
  { name: "flame", icon: Flame, label: "Streak" },
];

const habitSchema = z.object({
  name: z
    .string()
    .min(1, "Habit name is required")
    .max(50, "Habit name must be less than 50 characters"),
  description: z
    .string()
    .max(200, "Description must be less than 200 characters")
    .optional(),
  icon: z.string().min(1, "Please select an icon"),
  color: z.string().min(1, "Please select a color"),
  frequency: z.enum(["daily", "weekly", "custom"]),
  target_count: z.number().min(1).max(10),
  category_id: z.string().optional().nullable(),
});

type HabitFormData = z.infer<typeof habitSchema>;

export function EditHabitModal({
  isOpen,
  onClose,
  habit,
}: EditHabitModalProps) {
  const [selectedIcon, setSelectedIcon] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [targetCount, setTargetCount] = useState(1);

  const updateHabit = useUpdateHabit();
  const { categories } = useCategories();
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<HabitFormData>({
    resolver: zodResolver(habitSchema),
    defaultValues: {
      frequency: "daily",
      target_count: 1,
    },
  });

  useEffect(() => {
    if (habit) {
      reset({
        name: habit.name,
        description: habit.description || "",
        icon: habit.icon,
        color: habit.color,
        frequency: habit.frequency,
        target_count: habit.target_count,
        category_id: habit.category_id,
      });
      setSelectedIcon(habit.icon);
      setSelectedColor(habit.color);
      setTargetCount(habit.target_count);
    }
  }, [habit, reset]);

  const handleClose = () => {
    reset();
    setSelectedIcon("");
    setSelectedColor("");
    setTargetCount(1);
    onClose();
  };

  const handleFormSubmit = async (data: HabitFormData) => {
    if (!habit) return;

    try {
      await updateHabit.mutateAsync({
        habitId: habit.id,
        updates: data,
      });
      onClose();
    } catch (error) {
      console.error("Error updating habit:", error);
    }
  };

  const handleIconSelect = (iconName: string) => {
    setSelectedIcon(iconName);
    setValue("icon", iconName, { shouldValidate: true });
  };

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    setValue("color", color, { shouldValidate: true });
  };

  if (!habit) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Edit Habit"
      size="lg"
      footer={
        <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto sm:justify-end">
          <Button
            variant="ghost"
            onClick={handleClose}
            disabled={updateHabit.isPending}
            className="min-h-11 w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit(handleFormSubmit)}
            isLoading={updateHabit.isPending}
            className="min-h-11 w-full sm:w-auto"
          >
            Save Changes
          </Button>
        </div>
      }
    >
      <form className="space-y-4 sm:space-y-5 lg:space-y-6">
        <Input
          label="Habit Name"
          type="text"
          placeholder="Habit Name"
          error={errors.name?.message}
          {...register("name")}
        />

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-1.5">
            Description (optional)
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
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">
            Choose an Icon
          </label>
          {/* RESPONSIVE: 4 cols on mobile, 6 on sm+ */}
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5 sm:gap-2">
            {HABIT_ICONS.map(({ name, icon: Icon, label }) => (
              <button
                key={name}
                type="button"
                onClick={() => handleIconSelect(name)}
                className={`flex flex-col items-center justify-center p-2 sm:p-3 min-h-11 rounded-lg border-2 transition-all hover:border-primary hover:bg-emerald-50 dark:hover:bg-emerald-900/20 ${
                  selectedIcon === name
                    ? "border-primary bg-emerald-50 dark:bg-emerald-900/20 ring-2 ring-primary ring-offset-1 sm:ring-offset-2 dark:ring-offset-gray-800"
                    : "border-gray-200 dark:border-gray-700"
                }`}
                title={label}
              >
                <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 dark:text-gray-300" />
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
          <div className="flex gap-2 sm:gap-3 flex-wrap">
            {HABIT_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => handleColorSelect(color)}
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full transition-all hover:scale-110 ${
                  selectedColor === color
                    ? "ring-4 ring-offset-2 dark:ring-offset-gray-800"
                    : "hover:ring-2 ring-offset-1 dark:ring-offset-gray-800"
                }`}
                style={{
                  backgroundColor: color,
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

        {/* Frequency */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">
            Frequency
          </label>
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <label className="relative flex items-center justify-center px-2 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:border-primary-500 transition-colors min-h-11">
              <input
                type="radio"
                value="daily"
                {...register("frequency")}
                className="sr-only peer"
              />
              <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 peer-checked:text-primary-500">
                Daily
              </span>
              <div className="absolute inset-0 border-2 border-primary-500 rounded-lg opacity-0 peer-checked:opacity-100 pointer-events-none" />
            </label>

            <label className="relative flex items-center justify-center px-2 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:border-primary-500 transition-colors min-h-11">
              <input
                type="radio"
                value="weekly"
                {...register("frequency")}
                className="sr-only peer"
              />
              <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 peer-checked:text-primary-500">
                Weekly
              </span>
              <div className="absolute inset-0 border-2 border-primary-500 rounded-lg opacity-0 peer-checked:opacity-100 pointer-events-none" />
            </label>

            <label className="relative flex items-center justify-center px-2 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:border-primary-500 transition-colors min-h-11">
              <input
                type="radio"
                value="custom"
                {...register("frequency")}
                className="sr-only peer"
              />
              <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 peer-checked:text-primary-500">
                Custom
              </span>
              <div className="absolute inset-0 border-2 border-primary-500 rounded-lg opacity-0 peer-checked:opacity-100 pointer-events-none" />
            </label>
          </div>
        </div>

        {/* Target Count */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-1.5">
            Daily Target
          </label>
          <div className="flex items-center gap-3 sm:gap-4">
            <input
              type="range"
              min="1"
              max="10"
              {...register("target_count", {
                valueAsNumber: true,
                onChange: (e) => setTargetCount(Number(e.target.value)),
              })}
              className="flex-1 h-2 min-h-11 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <span className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100 w-10 sm:w-12 text-center shrink-0">
              {targetCount}x
            </span>
          </div>
          <p className="mt-1 sm:mt-1.5 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            How many times per day?
          </p>
        </div>

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
            Organize your habit into a category
          </p>
        </div>
      </form>
    </Modal>
  );
}
