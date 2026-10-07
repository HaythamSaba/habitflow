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
import { z } from "zod";

// ⭐ Shared habit icons
export const HABIT_ICONS = [
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
] as const;

export const habitSchema = z.object({
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

export type HabitFormData = z.infer<typeof habitSchema>;

// Starting values for a new habit, so a name alone is enough to create one.
// Icon and color can still be changed before saving.
export const DEFAULT_HABIT_ICON = "check";
export const DEFAULT_HABIT_COLOR = "#10B981"; // HABIT_COLORS[0], emerald (brand)

export const HABIT_FORM_DEFAULTS: Partial<HabitFormData> = {
  icon: DEFAULT_HABIT_ICON,
  color: DEFAULT_HABIT_COLOR,
  frequency: "daily",
  target_count: 1,
  category_id: "",
};
