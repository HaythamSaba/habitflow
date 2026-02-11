import { HabitTemplate } from "@/types";

export const HABIT_TEMPLATES: HabitTemplate[] = [
  // ==================== HEALTH & FITNESS ====================
  {
    id: "template-1",
    name: "Morning Run",
    description: "Start your day with a refreshing run",
    icon: "🏃",
    color: "#10b981",
    frequency: "daily",
    target_count: 1,
    category_name: "Health & Fitness",
    tags: ["fitness", "morning", "cardio", "exercise"],
  },
  {
    id: "template-2",
    name: "Drink Water",
    description: "Stay hydrated throughout the day",
    icon: "💧",
    color: "#06b6d4",
    frequency: "daily",
    target_count: 8,
    category_name: "Health & Fitness",
    tags: ["health", "hydration", "wellness"],
  },
  {
    id: "template-3",
    name: "Strength Training",
    description: "Build muscle and strength",
    icon: "💪",
    color: "#f59e0b",
    frequency: "weekly",
    target_count: 3,
    category_name: "Health & Fitness",
    tags: ["fitness", "strength", "gym", "exercise"],
  },
  {
    id: "template-4",
    name: "Yoga Session",
    description: "Practice yoga for flexibility and peace",
    icon: "🧘",
    color: "#8b5cf6",
    frequency: "daily",
    target_count: 1,
    category_name: "Health & Fitness",
    tags: ["fitness", "yoga", "flexibility", "mindfulness"],
  },
  {
    id: "template-5",
    name: "Eat Vegetables",
    description: "Get your daily serving of vegetables",
    icon: "🥗",
    color: "#10b981",
    frequency: "daily",
    target_count: 3,
    category_name: "Health & Fitness",
    tags: ["nutrition", "health", "diet"],
  },
  {
    id: "template-6",
    name: "10K Steps",
    description: "Walk 10,000 steps daily",
    icon: "🚶",
    color: "#3b82f6",
    frequency: "daily",
    target_count: 1,
    category_name: "Health & Fitness",
    tags: ["walking", "fitness", "cardio"],
  },
  {
    id: "template-7",
    name: "Sleep 8 Hours",
    description: "Get a full night's rest",
    icon: "😴",
    color: "#6366f1",
    frequency: "daily",
    target_count: 1,
    category_name: "Health & Fitness",
    tags: ["sleep", "rest", "recovery", "health"],
  },

  // ==================== WORK & PRODUCTIVITY ====================
  {
    id: "template-8",
    name: "Inbox Zero",
    description: "Clear your email inbox",
    icon: "📧",
    color: "#ef4444",
    frequency: "daily",
    target_count: 1,
    category_name: "Work & Productivity",
    tags: ["work", "email", "productivity", "organization"],
  },
  {
    id: "template-9",
    name: "Deep Work Session",
    description: "Focused work without distractions",
    icon: "🎯",
    color: "#8b5cf6",
    frequency: "daily",
    target_count: 2,
    category_name: "Work & Productivity",
    tags: ["work", "focus", "productivity", "deep work"],
  },
  {
    id: "template-10",
    name: "Daily Planning",
    description: "Plan your day and set priorities",
    icon: "📝",
    color: "#3b82f6",
    frequency: "daily",
    target_count: 1,
    category_name: "Work & Productivity",
    tags: ["planning", "organization", "productivity"],
  },
  {
    id: "template-11",
    name: "No Phone Before Coffee",
    description: "Start your day mindfully",
    icon: "☕",
    color: "#f59e0b",
    frequency: "daily",
    target_count: 1,
    category_name: "Work & Productivity",
    tags: ["morning", "mindfulness", "digital detox"],
  },
  {
    id: "template-12",
    name: "Clear Desk",
    description: "Organize your workspace",
    icon: "🧹",
    color: "#10b981",
    frequency: "daily",
    target_count: 1,
    category_name: "Work & Productivity",
    tags: ["organization", "workspace", "productivity"],
  },
  {
    id: "template-13",
    name: "Code Review",
    description: "Review code and provide feedback",
    icon: "💻",
    color: "#6366f1",
    frequency: "daily",
    target_count: 2,
    category_name: "Work & Productivity",
    tags: ["coding", "development", "teamwork"],
  },
  {
    id: "template-14",
    name: "Weekly Review",
    description: "Reflect on your week and plan ahead",
    icon: "📊",
    color: "#ec4899",
    frequency: "weekly",
    target_count: 1,
    category_name: "Work & Productivity",
    tags: ["planning", "reflection", "productivity"],
  },

  // ==================== MINDFULNESS & MENTAL HEALTH ====================
  {
    id: "template-15",
    name: "Meditation",
    description: "Practice mindfulness meditation",
    icon: "🧘",
    color: "#8b5cf6",
    frequency: "daily",
    target_count: 1,
    category_name: "Mindfulness & Mental Health",
    tags: ["meditation", "mindfulness", "mental health"],
  },
  {
    id: "template-16",
    name: "Journal Entry",
    description: "Write down your thoughts and feelings",
    icon: "📓",
    color: "#f59e0b",
    frequency: "daily",
    target_count: 1,
    category_name: "Mindfulness & Mental Health",
    tags: ["journaling", "writing", "reflection", "mental health"],
  },
  {
    id: "template-17",
    name: "Gratitude List",
    description: "Write three things you're grateful for",
    icon: "🙏",
    color: "#ec4899",
    frequency: "daily",
    target_count: 3,
    category_name: "Mindfulness & Mental Health",
    tags: ["gratitude", "positivity", "mental health"],
  },
  {
    id: "template-18",
    name: "Digital Detox Hour",
    description: "One hour without screens",
    icon: "📱",
    color: "#ef4444",
    frequency: "daily",
    target_count: 1,
    category_name: "Mindfulness & Mental Health",
    tags: ["digital detox", "mindfulness", "balance"],
  },
  {
    id: "template-19",
    name: "Morning Affirmations",
    description: "Start your day with positive affirmations",
    icon: "🌅",
    color: "#f59e0b",
    frequency: "daily",
    target_count: 1,
    category_name: "Mindfulness & Mental Health",
    tags: ["morning", "positivity", "mental health"],
  },
  {
    id: "template-20",
    name: "Self-Care Time",
    description: "Dedicate time to yourself",
    icon: "🛁",
    color: "#06b6d4",
    frequency: "daily",
    target_count: 1,
    category_name: "Mindfulness & Mental Health",
    tags: ["self-care", "wellness", "mental health"],
  },
  {
    id: "template-21",
    name: "Breathing Exercise",
    description: "Practice deep breathing for relaxation",
    icon: "😌",
    color: "#10b981",
    frequency: "daily",
    target_count: 3,
    category_name: "Mindfulness & Mental Health",
    tags: ["breathing", "relaxation", "stress relief"],
  },

  // ==================== LEARNING & DEVELOPMENT ====================
  {
    id: "template-22",
    name: "Read 30 Minutes",
    description: "Spend time reading every day",
    icon: "📚",
    color: "#3b82f6",
    frequency: "daily",
    target_count: 1,
    category_name: "Learning & Development",
    tags: ["reading", "learning", "books"],
  },
  {
    id: "template-23",
    name: "Listen to Podcast",
    description: "Learn from podcasts",
    icon: "🎧",
    color: "#8b5cf6",
    frequency: "daily",
    target_count: 1,
    category_name: "Learning & Development",
    tags: ["podcast", "learning", "audio"],
  },
  {
    id: "template-24",
    name: "Code Practice",
    description: "Practice coding skills",
    icon: "💻",
    color: "#10b981",
    frequency: "daily",
    target_count: 1,
    category_name: "Learning & Development",
    tags: ["coding", "programming", "practice", "learning"],
  },
  {
    id: "template-25",
    name: "Learn Language",
    description: "Practice a new language",
    icon: "🌍",
    color: "#06b6d4",
    frequency: "daily",
    target_count: 1,
    category_name: "Learning & Development",
    tags: ["language", "learning", "practice"],
  },
  {
    id: "template-26",
    name: "Write & Reflect",
    description: "Write and reflect on your learning",
    icon: "📝",
    color: "#f59e0b",
    frequency: "daily",
    target_count: 1,
    category_name: "Learning & Development",
    tags: ["writing", "reflection", "learning"],
  },

  // ==================== SOCIAL & RELATIONSHIPS ====================
  {
    id: "template-27",
    name: "Call Family",
    description: "Stay connected with family",
    icon: "💬",
    color: "#ec4899",
    frequency: "weekly",
    target_count: 1,
    category_name: "Social & Relationships",
    tags: ["family", "connection", "relationships"],
  },
  {
    id: "template-28",
    name: "Connect with Friend",
    description: "Reach out to friends",
    icon: "👥",
    color: "#3b82f6",
    frequency: "weekly",
    target_count: 2,
    category_name: "Social & Relationships",
    tags: ["friends", "connection", "relationships"],
  },
  {
    id: "template-29",
    name: "Quality Time with Partner",
    description: "Spend meaningful time together",
    icon: "❤️",
    color: "#ef4444",
    frequency: "daily",
    target_count: 1,
    category_name: "Social & Relationships",
    tags: ["partner", "love", "relationships", "quality time"],
  },
  {
    id: "template-30",
    name: "Message Old Friend",
    description: "Reconnect with someone you haven't talked to",
    icon: "📱",
    color: "#8b5cf6",
    frequency: "weekly",
    target_count: 1,
    category_name: "Social & Relationships",
    tags: ["friends", "connection", "relationships"],
  },
];

// ==================== HELPER FUNCTIONS ====================

/**
 * Get all unique categories from templates
 */
export function getTemplateCategories(): string[] {
  const categories = new Set(
    HABIT_TEMPLATES.map((template) => template.category_name),
  );
  return Array.from(categories);
}

/**
 * Filter templates by category
 */
export function getTemplatesByCategory(category: string): HabitTemplate[] {
  return HABIT_TEMPLATES.filter(
    (template) => template.category_name === category,
  );
}

/**
 * Search templates by query (name, description, tags)
 */
export function searchTemplates(query: string): HabitTemplate[] {
  if (!query.trim()) return HABIT_TEMPLATES;

  const lowerQuery = query.toLowerCase();
  return HABIT_TEMPLATES.filter(
    (template) =>
      template.name.toLowerCase().includes(lowerQuery) ||
      template.description.toLowerCase().includes(lowerQuery) ||
      template.tags.some((tag) => tag.toLowerCase().includes(lowerQuery)),
  );
}

/**
 * Filter templates by category and search query
 */
export function filterTemplates(
  category: string | null,
  searchQuery: string,
): HabitTemplate[] {
  let filtered = HABIT_TEMPLATES;

  // Filter by category
  if (category) {
    filtered = filtered.filter(
      (template) => template.category_name === category,
    );
  }

  // Filter by search query
  if (searchQuery.trim()) {
    const lowerQuery = searchQuery.toLowerCase();
    filtered = filtered.filter(
      (template) =>
        template.name.toLowerCase().includes(lowerQuery) ||
        template.description.toLowerCase().includes(lowerQuery) ||
        template.tags.some((tag) => tag.toLowerCase().includes(lowerQuery)),
    );
  }

  return filtered;
}
