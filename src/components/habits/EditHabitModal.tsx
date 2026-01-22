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
import { useState, useEffect } from "react"; // ⭐ Added useEffect
import z from "zod";
import { Modal } from "../ui/Modal";
import { useForm } from "react-hook-form";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { zodResolver } from "@hookform/resolvers/zod";
import { HABIT_COLORS } from "@/lib/utils";

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

  // ⭐ Pre-populate form when habit changes
  useEffect(() => {
    if (habit) {
      reset({
        name: habit.name,
        description: habit.description || "",
        icon: habit.icon,
        color: habit.color,
        frequency: habit.frequency,
        target_count: habit.target_count,
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
        <>
          <Button
            variant="ghost"
            onClick={handleClose}
            disabled={updateHabit.isPending}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit(handleFormSubmit)}
            isLoading={updateHabit.isPending}
          >
            Save Changes
          </Button>
        </>
      }
    >
      <form className="space-y-6">
        <Input
          label="Habit Name"
          type="text"
          placeholder="Habit Name"
          error={errors.name?.message}
          {...register("name")}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Description (optional)
          </label>
          <textarea
            placeholder="What is this habit about?"
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            rows={3}
            {...register("description")}
          />
          {errors.description && (
            <p className="mt-1.5 text-sm text-red-600">
              {errors.description.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Choose an Icon
          </label>
          <div className="grid grid-cols-6 gap-2">
            {HABIT_ICONS.map(({ name, icon: Icon, label }) => (
              <button
                key={name}
                type="button"
                onClick={() => handleIconSelect(name)}
                className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all hover:border-primary hover:bg-emerald-50 ${
                  selectedIcon === name
                    ? "border-primary bg-emerald-50 ring-2 ring-primary ring-offset-2"
                    : "border-gray-200"
                }`}
                title={label}
              >
                <Icon className="w-6 h-6 text-gray-700" />
              </button>
            ))}
          </div>
          {errors.icon && (
            <p className="mt-2 text-sm text-red-600">{errors.icon.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
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
                    ? "ring-4 ring-offset-2"
                    : "hover:ring-2 ring-offset-1"
                }`}
                style={{
                  backgroundColor: color,
                }}
                title={color}
              />
            ))}
          </div>
          {errors.color && (
            <p className="mt-2 text-sm text-red-600">{errors.color.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Frequency
          </label>
          <div className="grid grid-cols-3 gap-3">
            <label className="relative flex items-center justify-center px-4 py-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-primary-500 transition-colors">
              <input
                type="radio"
                value="daily"
                {...register("frequency")}
                className="sr-only peer"
              />
              <span className="text-sm font-medium text-gray-700 peer-checked:text-primary-500">
                Daily
              </span>
              <div className="absolute inset-0 border-2 border-primary-500 rounded-lg opacity-0 peer-checked:opacity-100 pointer-events-none" />
            </label>

            <label className="relative flex items-center justify-center px-4 py-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-primary-500 transition-colors">
              <input
                type="radio"
                value="weekly"
                {...register("frequency")}
                className="sr-only peer"
              />
              <span className="text-sm font-medium text-gray-700 peer-checked:text-primary-500">
                Weekly
              </span>
              <div className="absolute inset-0 border-2 border-primary-500 rounded-lg opacity-0 peer-checked:opacity-100 pointer-events-none" />
            </label>

            <label className="relative flex items-center justify-center px-4 py-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-primary-500 transition-colors">
              <input
                type="radio"
                value="custom"
                {...register("frequency")}
                className="sr-only peer"
              />
              <span className="text-sm font-medium text-gray-700 peer-checked:text-primary-500">
                Custom
              </span>
              <div className="absolute inset-0 border-2 border-primary-500 rounded-lg opacity-0 peer-checked:opacity-100 pointer-events-none" />
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
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
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <span className="text-lg font-bold text-gray-900 w-12 text-center">
              {targetCount}x
            </span>
          </div>
          <p className="mt-1.5 text-sm text-gray-500">
            How many times per day do you want to complete this habit?
          </p>
        </div>
      </form>
    </Modal>
  );
}
