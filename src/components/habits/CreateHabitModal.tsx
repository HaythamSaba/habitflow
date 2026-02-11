import { useState, useEffect, startTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { HABIT_COLORS } from "@/lib/utils";
import {
  Dumbbell,
  Book,
  Coffee,
  Heart,
  Zap,
  Music,
  Droplet,
  Moon,
  Sun,
  Target,
  CheckCircle2,
  Flame,
} from "lucide-react";
import { useCreateHabit } from "@/hooks/useCreateHabit";
import { useCategories } from "@/hooks/useCategories";

// Available icons for habits
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

// Validation schema
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

interface CreateHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefilledData?: {
    name: string;
    description: string;
    icon: string;
    color: string;
    frequency: "daily" | "weekly" | "custom";
    target_count: number;
    category_id: string | null;
  };
  onSuccess?: () => void;
}

export function CreateHabitModal({
  isOpen,
  onClose,
  prefilledData,
  onSuccess,
}: CreateHabitModalProps) {
  const [selectedIcon, setSelectedIcon] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [targetCount, setTargetCount] = useState(1);

  const createHabit = useCreateHabit();
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

  const handleIconSelect = (iconName: string) => {
    setSelectedIcon(iconName);
    setValue("icon", iconName, { shouldValidate: true });
  };

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    setValue("color", color, { shouldValidate: true });
  };

  const handleFormSubmit = async (data: HabitFormData) => {
    try {
      await createHabit.mutateAsync(data);
      handleClose();
      onSuccess?.();
    } catch (error) {
      console.error("Error creating habit:", error);
    }
  };

  const handleClose = () => {
    reset();
    setSelectedIcon("");
    setSelectedColor("");
    setTargetCount(1);
    onClose();
  };
  useEffect(() => {
    if (prefilledData && isOpen) {
      // Use startTransition to batch updates
      startTransition(() => {
        reset({
          name: prefilledData.name || "",
          description: prefilledData.description || "",
          icon: prefilledData.icon || "",
          color: prefilledData.color || "",
          frequency: prefilledData.frequency || "daily",
          target_count: prefilledData.target_count || 1,
          category_id: prefilledData.category_id || "",
        });

        setSelectedIcon(prefilledData.icon || "");
        setSelectedColor(prefilledData.color || "");
        setTargetCount(prefilledData.target_count || 1);
      });
    }
  }, [isOpen, prefilledData, reset]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create New Habit"
      size="lg"
      footer={
        <>
          <Button
            variant="ghost"
            onClick={handleClose}
            disabled={createHabit.isPending}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit(handleFormSubmit)}
            isLoading={createHabit.isPending}
          >
            Create Habit
          </Button>
        </>
      }
    >
      <form className="space-y-6">
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
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-100 mb-1.5">
            Description (Optional)
          </label>
          <textarea
            placeholder="What is this habit about?"
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            rows={3}
            {...register("description")}
          />
          {errors.description && (
            <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Icon Picker */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Choose an Icon
          </label>
          <div className="grid grid-cols-6 gap-2">
            {HABIT_ICONS.map(({ name, icon: Icon, label }) => (
              <button
                key={name}
                type="button"
                onClick={() => handleIconSelect(name)}
                className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all hover:border-primary hover:bg-emerald-50 dark:hover:bg-emerald-900/20 ${
                  selectedIcon === name
                    ? "border-primary bg-emerald-50 dark:bg-emerald-900/20 ring-2 ring-primary ring-offset-2 dark:ring-offset-gray-800"
                    : "border-gray-200 dark:border-gray-700"
                }`}
                title={label}
              >
                <Icon className="w-6 h-6 text-gray-700 dark:text-gray-300" />
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
            {HABIT_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => handleColorSelect(color)}
                className={`w-10 h-10 rounded-full transition-all hover:scale-110 ${
                  selectedColor === color
                    ? "ring-4 ring-offset-2 dark:ring-offset-gray-800"
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
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
              {errors.color.message}
            </p>
          )}
        </div>

        {/* Frequency */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Frequency
          </label>
          <div className="grid grid-cols-3 gap-3">
            <label className="relative flex items-center justify-center px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:border-primary transition-colors">
              <input
                type="radio"
                value="daily"
                {...register("frequency")}
                className="sr-only peer"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 peer-checked:text-primary">
                Daily
              </span>
              <div className="absolute inset-0 border-2 border-primary rounded-lg opacity-0 peer-checked:opacity-100 pointer-events-none" />
            </label>

            <label className="relative flex items-center justify-center px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:border-primary transition-colors">
              <input
                type="radio"
                value="weekly"
                {...register("frequency")}
                className="sr-only peer"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 peer-checked:text-primary">
                Weekly
              </span>
              <div className="absolute inset-0 border-2 border-primary rounded-lg opacity-0 peer-checked:opacity-100 pointer-events-none" />
            </label>

            <label className="relative flex items-center justify-center px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:border-primary transition-colors">
              <input
                type="radio"
                value="custom"
                {...register("frequency")}
                className="sr-only peer"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 peer-checked:text-primary">
                Custom
              </span>
              <div className="absolute inset-0 border-2 border-primary rounded-lg opacity-0 peer-checked:opacity-100 pointer-events-none" />
            </label>
          </div>
        </div>

        {/* Target Count */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Daily Target
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="1"
              max="10"
              {...register("target_count", {
                valueAsNumber: true,
                onChange: (e) => setTargetCount(Number(e.target.value)),
              })}
              className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <span className="text-lg font-bold text-gray-900 dark:text-gray-100 w-12 text-center">
              {targetCount}x
            </span>
          </div>
          <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
            How many times per day do you want to complete this habit?
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Category (Optional)
          </label>
          <select
            {...register("category_id")}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">No Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.icon} {category.name}
              </option>
            ))}
          </select>
          <p className="mb-1.5 text-sm text-gray-500 dark:text-gray-400">
            Organizer your habits into a category
          </p>
        </div>
      </form>
    </Modal>
  );
}
