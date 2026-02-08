import { Category } from "@/types";
import { supabase } from "./supabase";
export async function getAchievements() {
  const { data: achievements, error } = await supabase
    .from("achievements")
    .select("*");
  if (error) {
    console.error(error);
  }
  return achievements;
}

export async function getHabits(userId: string | undefined) {
  const { data, error } = await supabase
    .from("habits")
    .select("*")
    .eq("user_id", userId) // ✅ Filter by user
    .eq("archived", false) // ✅ Don't show archived
    .order("position", { ascending: true });

  if (error) throw error;
  return data;
}

export async function createHabit(
  userId: string,
  habitData: {
    name: string;
    description?: string;
    icon: string;
    color: string;
    frequency: "daily" | "weekly" | "custom";
    target_count: number;
    category_id?: string | null;
  },
) {
  const { data, error } = await supabase
    .from("habits")
    .insert({
      user_id: userId,
      name: habitData.name,
      description: habitData.description || null,
      icon: habitData.icon,
      color: habitData.color,
      frequency: habitData.frequency,
      target_count: habitData.target_count,
      category_id: habitData.category_id || null,
      archived: false,
      position: 0, // or calculate next position
      created_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function deleteHabit(habitId: string, userId: string) {
  const { data, error } = await supabase
    .from("habits")
    .update({ archived: true })
    .eq("id", habitId)
    .eq("user_id", userId) // ✅ Filter by user
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function updateHabit(
  habitId: string,
  userId: string,
  updates: {
    name?: string;
    description?: string | null;
    icon?: string;
    color?: string;
    frequency?: "daily" | "weekly" | "custom";
    target_count?: number;
    frequency_days?: number[] | null;
    category_id?: string | null;
  },
) {
  const { data, error } = await supabase
    .from("habits")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", habitId)
    .eq("user_id", userId) // ✅ Filter by user
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function createCompletion(habitId: string, userId: string) {
  const { data, error } = await supabase
    .from("completions")
    .insert({
      habit_id: habitId,
      user_id: userId,
      completed_at: new Date().toISOString(),
      notes: null,
      mood_rating: null,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

// Undo a completion (delete it)
export async function deleteCompletion(completionId: string, userId: string) {
  const { error } = await supabase
    .from("completions")
    .delete()
    .eq("id", completionId)
    .eq("user_id", userId); // Security: only owner can delete

  if (error) throw new Error(error.message);
}

export async function getTodayCompletions(userId: string) {
  const today = new Date().toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("completions")
    .select("*")
    .eq("user_id", userId)
    .gte("completed_at", `${today}T00:00:00`) // Greater than or equal to start of today
    .lte("completed_at", `${today}T23:59:59`) // Less than or equal to end of today
    .order("completed_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data || [];
}

export async function getCompletionsByDateRange(
  habitId: string,
  userId: string,
  startDate: string,
  endDate: string,
) {
  const { data, error } = await supabase
    .from("completions")
    .select("*")
    .eq("habit_id", habitId)
    .eq("user_id", userId)
    .gte("completed_at", `${startDate}T00:00:00`)
    .lte("completed_at", `${endDate}T23:59:59`)
    .order("completed_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data || [];
}

// Count how many times a habit was completed today
export async function getHabitCompletionCountToday(
  habitId: string,
  userId: string,
) {
  const today = new Date().toISOString().split("T")[0];

  const { count, error } = await supabase
    .from("completions")
    .select("*", { count: "exact", head: true }) // Only count, don't return data
    .eq("habit_id", habitId)
    .eq("user_id", userId)
    .gte("completed_at", `${today}T00:00:00`)
    .lte("completed_at", `${today}T23:59:59`);

  if (error) throw new Error(error.message);
  return count || 0;
}

/**
 * Get all completions for a specific habit
 * Used for: Calculating streaks, viewing history
 */
export async function getHabitCompletions(habitId: string, userId: string) {
  const { data, error } = await supabase
    .from("completions")
    .select("*")
    .eq("habit_id", habitId)
    .eq("user_id", userId)
    .order("completed_at", { ascending: false }); // Newest first

  if (error) throw new Error(error.message);
  return data || [];
}

/**
 * Get user stats (points, level, etc.)
 */
export async function getUserStats(userId: string) {
  console.log("🔍 getUserStats called with userId:", userId);

  const { data, error } = await supabase
    .from("user_stats")
    .select("*")
    .eq("user_id", userId)
    .single();

  console.log("📊 getUserStats response:", { data, error });

  if (error) {
    console.error("❌ getUserStats error:", error);
    throw new Error(error.message);
  }

  return data;
}

/**
 * Update user's total points
 */
export async function updateUserPoints(userId: string, pointsToAdd: number) {
  // First, get current points
  const stats = await getUserStats(userId);
  const newTotal = (stats.total_points || 0) + pointsToAdd;

  // Update with new total
  const { data, error } = await supabase
    .from("user_stats")
    .update({
      total_points: newTotal,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", userId)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}
/*
 * ============================================
 * ACHIEVEMENT API FUNCTIONS
 * ============================================
 */

/**
 * Get all achievements (master list)
 */
export async function getAllAchievements() {
  const { data, error } = await supabase
    .from("achievements")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) throw new Error(error.message);
  return data || [];
}

/**
 * Get user's unlocked achievements
 */
export async function getUserAchievements(userId: string) {
  const { data, error } = await supabase
    .from("user_achievements")
    .select(
      `
      *,
      achievement:achievements(*)
    `,
    )
    .eq("user_id", userId);

  if (error) throw new Error(error.message);
  return data || [];
}

/**
 * Unlock an achievement for a user
 */
export async function unlockAchievement(userId: string, achievementId: string) {
  // Check if already unlocked
  const { data: existing } = await supabase
    .from("user_achievements")
    .select("id")
    .eq("user_id", userId)
    .eq("achievement_id", achievementId)
    .maybeSingle();

  if (existing) {
    return { alreadyUnlocked: true, data: existing };
  }

  // Unlock the achievement
  const { data, error } = await supabase
    .from("user_achievements")
    .insert({
      user_id: userId,
      achievement_id: achievementId,
      unlocked_at: new Date().toISOString(),
      progress: 100, // 100% since it's unlocked
    })
    .select(
      `
      *,
      achievement:achievements(*)
    `,
    )
    .single();

  if (error) throw new Error(error.message);

  // Award bonus points
  if (data.achievement) {
    const pointsReward = data.achievement.points_reward || 0;
    if (pointsReward > 0) {
      await updateUserPoints(userId, pointsReward);
    }
  }

  return { alreadyUnlocked: false, data };
}

/**
 * Update progress on an achievement
 */
export async function updateAchievementProgress(
  userId: string,
  achievementId: string,
  progress: number,
) {
  const { data, error } = await supabase
    .from("user_achievements")
    .upsert(
      {
        user_id: userId,
        achievement_id: achievementId,
        progress: progress,
      },
      {
        onConflict: "user_id,achievement_id",
      },
    )
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function updateUserProfile(displayName: string) {
  const { data, error } = await supabase.auth.updateUser({
    data: { display_name: displayName }, // ← Updates user metadata!
  });

  if (error) throw new Error(error.message);
  return data;
}

// ==================== CATEGORIES ====================
export async function fetchCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);
  return data;
}

export async function createCategory(categoryData: {
  name: string;
  color: string;
  icon: string;
}): Promise<Category> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase
    .from("categories")
    .insert({
      user_id: user.id,
      name: categoryData.name,
      color: categoryData.color,
      icon: categoryData.icon,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

// Update a category
export async function updateCategory(
  categoryId: string,
  updates: {
    name?: string;
    color?: string;
    icon?: string;
  },
): Promise<Category> {
  const { data, error } = await supabase
    .from("categories")
    .update(updates)
    .eq("id", categoryId)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

// Delete a category
export async function deleteCategory(categoryId: string): Promise<void> {
  const { error } = await supabase
    .from("categories")
    .delete()
    .eq("id", categoryId);

  if (error) throw new Error(error.message);
}
