import { describe, expect, it } from "vitest";
import { checkAchievementCondition } from "./achievements";
import { Completion, Habit } from "@/types";

// Dates are built in LOCAL time, so these tests hold in any time zone
const local = (y: number, m: number, d: number, h = 12) =>
  new Date(y, m - 1, d, h);

const habit = (id: string): Habit => ({
  id,
  user_id: "u",
  name: id,
  description: null,
  icon: "check",
  color: "#10b981",
  frequency: "daily",
  frequency_days: null,
  target_count: 1,
  archived: false,
  position: 0,
  created_at: local(2026, 9, 1).toISOString(),
  updated_at: local(2026, 9, 1).toISOString(),
  checked: false,
  category_id: null,
});

let nextId = 0;
const completion = (habitId: string, date: Date): Completion => ({
  id: `c${nextId++}`,
  habit_id: habitId,
  user_id: "u",
  completed_at: date.toISOString(),
  notes: null,
  mood_rating: null,
  created_at: date.toISOString(),
});

const achievement = (condition_type: string, condition_value: number) => ({
  id: condition_type,
  key: condition_type,
  name: condition_type,
  emoji: "🏆",
  category: "test",
  condition_type,
  condition_value,
  points_reward: 10,
});

const statsFor = (habits: Habit[], completions: Completion[]) => ({
  totalCompletions: completions.length,
  currentStreak: 0,
  totalPoints: 0,
  totalHabits: habits.length,
  completions,
  habits,
});

describe("total completions milestone", () => {
  it("counts completions spread across many days, not just today", () => {
    const read = habit("read");
    // 10 completions over 10 different days
    const completions = Array.from({ length: 10 }, (_, i) =>
      completion("read", local(2026, 10, i + 1)),
    );

    expect(
      checkAchievementCondition(
        achievement("total_completions", 10),
        statsFor([read], completions),
      ),
    ).toEqual({ unlocked: true, progress: 100 });

    expect(
      checkAchievementCondition(
        achievement("total_completions", 20),
        statsFor([read], completions),
      ),
    ).toEqual({ unlocked: false, progress: 50 });
  });
});

describe("perfect day", () => {
  const active = ["a", "b", "c", "d", "e"].map(habit);
  const perfectDay = achievement("perfect_day", 1);

  it("unlocks when every active habit was done on one past day", () => {
    const completions = active.map((h) => completion(h.id, local(2026, 10, 3)));
    expect(
      checkAchievementCondition(perfectDay, statsFor(active, completions)).unlocked,
    ).toBe(true);
  });

  it("doesn't unlock when the day's set includes since-archived habits", () => {
    // Oct 3: 4 of the 5 active habits plus 2 habits that are now archived
    const completions = [
      ...active.slice(0, 4).map((h) => completion(h.id, local(2026, 10, 3))),
      completion("archived-1", local(2026, 10, 3)),
      completion("archived-2", local(2026, 10, 3)),
    ];
    expect(
      checkAchievementCondition(perfectDay, statsFor(active, completions)).unlocked,
    ).toBe(false);
  });

  it("needs all habits on the same day, not spread over several days", () => {
    const completions = active.map((h, i) => completion(h.id, local(2026, 10, i + 1)));
    expect(
      checkAchievementCondition(perfectDay, statsFor(active, completions)).unlocked,
    ).toBe(false);
  });
});

describe("early bird / night owl", () => {
  it("finds an early completion anywhere in history", () => {
    const completions = [
      completion("read", local(2026, 9, 2, 7)), // 7 am, weeks ago
      completion("read", local(2026, 10, 15, 13)),
    ];
    expect(
      checkAchievementCondition(
        achievement("early_completion", 1),
        statsFor([habit("read")], completions),
      ).unlocked,
    ).toBe(true);
  });
});
