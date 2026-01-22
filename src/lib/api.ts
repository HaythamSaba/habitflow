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

// src/lib/api.ts
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
