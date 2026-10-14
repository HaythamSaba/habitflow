/**
 * Suggested first habits for new users (dashboard welcome step).
 *
 * Kept separate from lib/habitTemplates.ts on purpose: those templates use
 * emoji icons, which the habit icon set (HABIT_ICONS) can't render. These
 * use HABIT_ICONS names and HABIT_COLORS values so the created habits look
 * right everywhere.
 */
export interface StarterHabit {
  key: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export const STARTER_HABITS: StarterHabit[] = [
  {
    key: "water",
    name: "Drink a glass of water",
    description: "Start the day hydrated",
    icon: "droplet",
    color: "#06B6D4",
  },
  {
    key: "read",
    name: "Read 10 pages",
    description: "A little reading every day adds up",
    icon: "book",
    color: "#3B82F6",
  },
  {
    key: "walk",
    name: "Take a 20-minute walk",
    description: "Move your body, clear your head",
    icon: "dumbbell",
    color: "#10B981",
  },
  {
    key: "meditate",
    name: "Meditate for 5 minutes",
    description: "A short pause to reset",
    icon: "heart",
    color: "#EC4899",
  },
  {
    key: "sleep",
    name: "In bed by 11 pm",
    description: "Protect your sleep",
    icon: "moon",
    color: "#8B5CF6",
  },
  {
    key: "plan",
    name: "Plan tomorrow",
    description: "Two minutes to set up the next day",
    icon: "target",
    color: "#F59E0B",
  },
];

export const MAX_STARTER_PICKS = 3;
