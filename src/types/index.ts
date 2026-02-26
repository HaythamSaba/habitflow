// ============================================
// DATABASE TYPES (matching Supabase schema)
// ============================================

export interface Habit {
  id: string
  user_id: string
  name: string
  description: string | null
  icon: string
  color: string
  frequency: 'daily' | 'weekly' | 'custom'
  frequency_days: number[] | null
  target_count: number
  archived: boolean
  position: number
  created_at: string
  updated_at: string
  checked: boolean
  category_id: string | null;
}

export interface Completion {
  id: string
  habit_id: string
  user_id: string
  completed_at: string
  notes: string | null
  mood_rating: number | null
  created_at: string
}

export interface UserStats {
  user_id: string
  total_completions: number
  current_points: number
  level: number
  longest_streak: number
  current_streak: number
  habits_created: number
  habits_archived: number
  updated_at: string
}

export interface UserProfile {
  user_id: string
  display_name: string | null
  avatar_url: string | null
  timezone: string
  theme: 'light' | 'dark'
  notification_enabled: boolean
  notification_time: string | null
  week_start_day: number
  created_at: string
  updated_at: string
}

export interface Achievement {
  id: string
  user_id: string
  type: string
  habit_id: string | null
  unlocked_at: string
  metadata: Record<string, unknown> | null
  emoji: string
  name: string
  description: string
  points_reward: number
  rarity: string
}

export interface HabitReminder {
  id: string
  habit_id: string
  user_id: string
  reminder_time: string
  days_of_week: number[]
  enabled: boolean
}

// ============================================
// FORM TYPES (for React Hook Form)
// ============================================

export interface CreateHabitFormData {
  name: string
  description?: string
  icon: string
  color: string
  frequency: 'daily' | 'weekly' | 'custom'
  target_count: number
  frequency_days?: number[]
}

export interface UpdateHabitFormData extends Partial<CreateHabitFormData> {
  id: string
}

export interface LoginFormData {
  email: string
  password: string
}

export interface SignupFormData {
  email: string
  password: string
  confirmPassword: string
  displayName: string
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface ApiResponse<T> {
  data: T | null
  error: string | null
  success: boolean
}

export interface HabitWithCompletions extends Habit {
  completions: Completion[]
  completedToday: boolean
  currentStreak: number
}

// ============================================
// UI STATE TYPES
// ============================================

export interface ModalState {
  isOpen: boolean
  mode: 'create' | 'edit' | 'view'
  data: Habit | null
}

export interface FilterOptions {
  showArchived: boolean
  frequency: 'all' | 'daily' | 'weekly' | 'custom'
  sortBy: 'name' | 'created' | 'position'
}

// ============================================
// UTILITY TYPES
// ============================================

export type FrequencyType = 'daily' | 'weekly' | 'custom'

export type ThemeType = 'light' | 'dark'

export type SortOption = 'name' | 'created' | 'position' | 'streak'

// ============================================
// COMPONENT PROP TYPES
// ============================================

export interface HabitCardProps {
  habit: Habit
  onEdit: (habit: Habit) => void
  onDelete: (habitId: string) => void
  onComplete?: (habitId: string) => void
}

export interface HabitListProps {
  habits: Habit[]
  isLoading?: boolean
  onEdit: (habit: Habit) => void
  onDelete: (habitId: string) => void
}

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  footer?: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showCloseButton?: boolean
}

// ============================================
// STATISTICS TYPES
// ============================================

export interface DailyStats {
  date: string
  completions: number
  habits_completed: string[]
  completion_rate: number
}

export interface WeeklyStats {
  week_start: string
  total_completions: number
  completion_rate: number
  best_day: string
  daily_breakdown: DailyStats[]
}

export interface MonthlyStats {
  month: string
  total_completions: number
  completion_rate: number
  longest_streak: number
  habits_created: number
  weekly_breakdown: WeeklyStats[]
}

// ============================================
// STREAK TYPES
// ============================================

export interface StreakData {
  current: number
  longest: number
  last_completed: string | null
  is_active: boolean
}

export interface HabitStreak extends Habit {
  streak: StreakData
}

// ============================================
// CHART DATA TYPES
// ============================================

export interface ChartDataPoint {
  date: string
  value: number
  label?: string
}

export interface HeatmapData {
  date: string
  count: number
}

// ============================================
// NOTIFICATION TYPES
// ============================================

export interface NotificationSettings {
  enabled: boolean
  time: string
  days: number[]
  sound: boolean
  vibration: boolean
}

// ============================================
// EXPORT TYPES
// ============================================

export interface ExportData {
  habits: Habit[]
  completions: Completion[]
  stats: UserStats
  exported_at: string
  version: string
}

// Category type
export interface Category {
  id: string;
  user_id: string;
  name: string;
  color: string;
  icon: string;
  created_at: string;
}

// Habit with category joined (for display)
export interface HabitWithCategory extends Habit {
  category?: Category | null;
}

// adding template type
export interface HabitTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  frequency: 'daily' | 'weekly' | 'custom';
  target_count: number;
  category_name: string;
  tags: string[];
}